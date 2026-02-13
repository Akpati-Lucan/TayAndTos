import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { restartDatabase } from './db.js';
import { initializeDatabase, getPool } from './db.js';
import usersRoutes from './routes/users.js';
import bookingsRoutes from './routes/bookings.js';
import guestBookingsRoutes from './routes/guest_bookings.js';
import emailRoutes from './routes/email_routes.js';
// Guest email routes are now integrated into the main email routes
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use((req, res, next) => {
    console.log('Request origin:', req.headers.origin);
    next();
});

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
        app.use('/email', emailRoutes);
        // Guest email routes are now handled by /email/send-guest-booking-confirmation
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

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// await restartDatabase();
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
