const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { initializeDatabase, getPool } = require('./db');
const usersRoutes = require('./routes/users');
const bookingsRoutes = require('./routes/bookings');
const guestBookingsRoutes = require('./routes/guest_bookings');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());


// Initialize database and start server
async function startServer() {
    try {
        console.log('Initializing database...');
        await initializeDatabase();
        console.log('Database initialized successfully');

        // Set up database pool in app.locals
        app.locals.pool = getPool();
        console.log('Database pool initialized');

        // Mount routes
        app.use('/users', usersRoutes);
        app.use('/bookings', bookingsRoutes);
        app.use('/guest_bookings', guestBookingsRoutes);

        // Health check endpoint
        app.get('/health', (req, res) => {
            res.status(200).json({ status: 'OK' });
        });

        // Database connection test endpoint
        app.get('/db-status', async (req, res) => {
            try {
                const pool = app.locals.pool;
                const [rows] = await pool.query('SELECT 1');
                res.status(200).json({ database: 'connected' });
            } catch (err) {
                res.status(500).json({ database: 'disconnected', error: err.message });
            }
        });

        // Debug endpoint to list all routes
        app.get('/debug/routes', (req, res) => {
            const routes = [];
            app._router.stack.forEach(middleware => {
                if (middleware.route) {
                    routes.push({
                        path: middleware.route.path,
                        methods: Object.keys(middleware.route.methods)
                    });
                } else if (middleware.name === 'router') {
                    middleware.handle.stack.forEach(handler => {
                        if (handler.route) {
                            routes.push({
                                path: '/bookings' + handler.route.path,
                                methods: Object.keys(handler.route.methods)
                            });
                        }
                    });
                }
            });
            res.json({ routes });
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('Error:', err.stack);
            res.status(500).json({ error: 'Something went wrong!', details: err.message });
        });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    const pool = app.locals.pool;
    await pool.end();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    const pool = app.locals.pool;
    await pool.end();
    process.exit(0);
});