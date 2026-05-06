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
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Disable CSP for easier debugging during dev/cross-domain
}));

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // During debugging, if origin is from vercel, we can be more flexible
        if (origin.includes('vercel.app')) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Simple Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());

// API Routes
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

app.get('/api/auth/me', require('./middleware/authMiddleware').protect, (req, res) => {
    res.json({
        authenticated: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            institution_id: req.user.institution_id
        }
    });
});


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



// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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