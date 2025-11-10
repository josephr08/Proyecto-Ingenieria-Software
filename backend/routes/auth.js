import express from 'express';
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Register new user (customer or admin if employee)
router.post('/register', async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role, name, phone, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, role, name',
      [email, hash, 'customer', name, phone || '', address || '']
    );

    res.json({
      message: 'Registration successful',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === '23505') { // Duplicate email
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash, role, name FROM users WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get user stats (consumption)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT week_usage, month_usage FROM user_stats WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rowCount === 0) {
      // Return default values if no stats found
      return res.json({ week_usage: 0, month_usage: 0 });
    }

    res.json({
      week_usage: parseFloat(result.rows[0].week_usage),
      month_usage: parseFloat(result.rows[0].month_usage)
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Get user receipts
router.get('/receipts', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, billing_month, consumption, rate, total, status, due_date, paid_date, created_at 
       FROM receipts 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Receipts error:', err);
    res.status(500).json({ message: 'Error fetching receipts' });
  }
});

// Submit support ticket
router.post('/support', authenticateToken, async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO support_tickets (user_id, customer_name, subject, message, status) 
       VALUES ($1, $2, $3, $4, 'open') 
       RETURNING id`,
      [req.user.id, req.user.name, subject, message]
    );

    res.json({
      message: 'Ticket submitted successfully',
      ticketId: result.rows[0].id
    });
  } catch (err) {
    console.error('Support ticket error:', err);
    res.status(500).json({ message: 'Error submitting ticket' });
  }
});

// Process payment
router.post('/payment', authenticateToken, async (req, res) => {
  const { receiptId, paymentMethod } = req.body;

  if (!receiptId) {
    return res.status(400).json({ message: 'Receipt ID required' });
  }

  try {
    // Update receipt status to paid
    const result = await pool.query(
      `UPDATE receipts 
       SET status = 'paid', paid_date = CURRENT_DATE 
       WHERE id = $1 AND user_id = $2 AND status = 'pending'
       RETURNING id, total`,
      [receiptId, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Receipt not found or already paid' });
    }

    res.json({
      message: 'Payment processed successfully',
      receipt: result.rows[0]
    });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ message: 'Payment processing failed' });
  }
});

// Export both the router and the middleware
export { authenticateToken };
export default router;