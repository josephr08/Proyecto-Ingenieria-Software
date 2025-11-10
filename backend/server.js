import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/ping', (req, res) => {
    res.json({
        ok: true,
        message: 'Sangil Water API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Sangil Water Customer Portal API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            admin: '/api/admin',
            health: '/api/ping'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint not found',
        path: req.path
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log('═══════════════════════════════════════');
    console.log('🌊 Sangil Water API Server');
    console.log('═══════════════════════════════════════');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
    console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('═══════════════════════════════════════');
    console.log('\n📝 Available endpoints:');
    console.log('   POST   /api/auth/register     - Register new user');
    console.log('   POST   /api/auth/login        - User login');
    console.log('   GET    /api/auth/stats        - Get user stats');
    console.log('   GET    /api/auth/receipts     - Get user receipts');
    console.log('   POST   /api/auth/support      - Submit support ticket');
    console.log('   POST   /api/auth/payment      - Process payment');
    console.log('   GET    /api/admin/customers   - Get all customers (admin)');
    console.log('   POST   /api/admin/stats/update - Update customer stats (admin)');
    console.log('   POST   /api/admin/receipts/generate - Generate receipt (admin)');
    console.log('   GET    /api/admin/support/tickets - Get support tickets (admin)');
    console.log('   POST   /api/admin/support/respond - Respond to ticket (admin)');
    console.log('═══════════════════════════════════════\n');
});