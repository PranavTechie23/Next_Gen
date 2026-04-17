const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const db = require('./config/db');


// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;

const parseAllowedOrigins = () => {
    const raw = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '';
    return raw
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins();

// Middleware
app.use(helmet());
app.use(cors({
    origin: function(origin, callback) {
        // Allow server-to-server and health-check requests without origin header.
        if (!origin) return callback(null, true);

        // If no explicit allow-list is provided, allow all origins (backward compatible).
        if (allowedOrigins.length === 0) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true // Allow cookies to be sent
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());

// API Routes
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running', timestamp: new Date() });
});

const adminRoutes = require('./routes/adminRoutes');
const deptRoutes = require('./routes/deptRoutes');
const newsRoutes = require('./routes/newsRoutes');
const studentRoutes = require('./routes/studentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/dept', deptRoutes);
app.use('/api', newsRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/notifications', notificationRoutes);





// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('/{*path}', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Export pool for use in other modules
module.exports = { app, pool: db };