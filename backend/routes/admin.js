import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Get all customers
router.get('/customers', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, email, role, name, phone, address, created_at 
       FROM users 
       WHERE role = 'customer'
       ORDER BY created_at DESC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Get customers error:', err);
        res.status(500).json({ message: 'Error fetching customers' });
    }
});

// Get all users (customers and admins)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, email, role, name, phone, address, created_at 
       FROM users 
       ORDER BY created_at DESC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Update customer statistics
router.post('/stats/update', authenticateToken, requireAdmin, async (req, res) => {
    const { customerId, weekUsage, monthUsage } = req.body;

    if (!customerId || weekUsage === undefined || monthUsage === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Insert or update stats
        await pool.query(
            `INSERT INTO user_stats (user_id, week_usage, month_usage, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         week_usage = $2,
         month_usage = $3,
         updated_at = CURRENT_TIMESTAMP`,
            [customerId, weekUsage, monthUsage]
        );

        res.json({
            message: 'Statistics updated successfully',
            customerId,
            weekUsage,
            monthUsage
        });
    } catch (err) {
        console.error('Update stats error:', err);
        res.status(500).json({ message: 'Error updating statistics' });
    }
});

// Generate receipt for customer
router.post('/receipts/generate', authenticateToken, requireAdmin, async (req, res) => {
    const { customerId, consumption, rate, billingMonth, dueDate } = req.body;

    if (!customerId || !consumption || !rate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const total = parseFloat(consumption) * parseFloat(rate);

        const result = await pool.query(
            `INSERT INTO receipts (user_id, billing_month, consumption, rate, total, status, due_date)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6)
       RETURNING id, billing_month, consumption, rate, total, status, due_date`,
            [
                customerId,
                billingMonth || new Date().toISOString().slice(0, 7), // YYYY-MM format
                consumption,
                rate,
                total,
                dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 15 days from now
            ]
        );

        res.json({
            message: 'Receipt generated successfully',
            receipt: result.rows[0]
        });
    } catch (err) {
        console.error('Generate receipt error:', err);
        res.status(500).json({ message: 'Error generating receipt' });
    }
});

// Get all receipts (admin view)
router.get('/receipts', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.id, r.billing_month, r.consumption, r.rate, r.total, r.status, 
              r.due_date, r.paid_date, r.created_at,
              u.name as customer_name, u.email as customer_email
       FROM receipts r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Get receipts error:', err);
        res.status(500).json({ message: 'Error fetching receipts' });
    }
});

// Get all support tickets
router.get('/support/tickets', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, user_id, customer_name, subject, message, status, 
              response, created_at, updated_at
       FROM support_tickets
       ORDER BY 
         CASE WHEN status = 'open' THEN 0 ELSE 1 END,
         created_at DESC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Get tickets error:', err);
        res.status(500).json({ message: 'Error fetching tickets' });
    }
});

// Respond to support ticket
router.post('/support/respond', authenticateToken, requireAdmin, async (req, res) => {
    const { ticketId, response } = req.body;

    if (!ticketId || !response) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const result = await pool.query(
            `UPDATE support_tickets 
       SET response = $1, status = 'resolved', updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, customer_name, subject`,
            [response, ticketId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({
            message: 'Response sent successfully',
            ticket: result.rows[0]
        });
    } catch (err) {
        console.error('Respond ticket error:', err);
        res.status(500).json({ message: 'Error responding to ticket' });
    }
});

// Get customer details with stats and receipts
router.get('/customers/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        // Get customer info
        const customerResult = await pool.query(
            `SELECT id, email, name, phone, address, created_at 
       FROM users 
       WHERE id = $1 AND role = 'customer'`,
            [id]
        );

        if (customerResult.rowCount === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Get stats
        const statsResult = await pool.query(
            'SELECT week_usage, month_usage FROM user_stats WHERE user_id = $1',
            [id]
        );

        // Get receipts
        const receiptsResult = await pool.query(
            `SELECT id, billing_month, consumption, rate, total, status, due_date, paid_date
       FROM receipts 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
            [id]
        );

        res.json({
            customer: customerResult.rows[0],
            stats: statsResult.rows[0] || { week_usage: 0, month_usage: 0 },
            receipts: receiptsResult.rows
        });
    } catch (err) {
        console.error('Get customer details error:', err);
        res.status(500).json({ message: 'Error fetching customer details' });
    }
});

// Dashboard statistics for admin
router.get('/dashboard/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        // Total customers
        const customersResult = await pool.query(
            "SELECT COUNT(*) as total FROM users WHERE role = 'customer'"
        );

        // Total pending payments
        const pendingResult = await pool.query(
            "SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as amount FROM receipts WHERE status = 'pending'"
        );

        // Open support tickets
        const ticketsResult = await pool.query(
            "SELECT COUNT(*) as total FROM support_tickets WHERE status = 'open'"
        );

        // Recent activity
        const activityResult = await pool.query(
            `SELECT 'receipt' as type, billing_month as description, created_at 
       FROM receipts 
       WHERE created_at > NOW() - INTERVAL '7 days'
       UNION ALL
       SELECT 'ticket' as type, subject as description, created_at 
       FROM support_tickets 
       WHERE created_at > NOW() - INTERVAL '7 days'
       ORDER BY created_at DESC
       LIMIT 10`
        );

        res.json({
            totalCustomers: parseInt(customersResult.rows[0].total),
            pendingPayments: {
                count: parseInt(pendingResult.rows[0].total),
                amount: parseFloat(pendingResult.rows[0].amount)
            },
            openTickets: parseInt(ticketsResult.rows[0].total),
            recentActivity: activityResult.rows
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
});

export default router;