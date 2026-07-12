const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables before config modules read process.env
dotenv.config();

const app = express();
const db = require('./config/db');

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || (isProduction ? undefined : 5000);

if (isProduction) {
    const requiredEnv = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'TPO_REGISTRATION_SECRET'];
    const missing = requiredEnv.filter((key) => !process.env[key]?.trim());
    if (missing.length > 0) {
        console.error(`Missing required environment variables in production: ${missing.join(', ')}`);
        process.exit(1);
    }
    const corsConfigured = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '').trim();
    if (!corsConfigured) {
        console.error('CORS_ORIGIN or FRONTEND_URL must be set in production.');
        process.exit(1);
    }
}

if (!PORT) {
    console.error('PORT must be set in production.');
    process.exit(1);
}

const parseAllowedOrigins = () => {
    const raw = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '';
    return raw
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins();

const trustProxy =
    process.env.TRUST_PROXY === 'true' ||
    (isProduction && process.env.TRUST_PROXY !== 'false');
if (trustProxy) {
    app.set('trust proxy', 1);
}

const enableCsp = process.env.ENABLE_CSP === 'true';
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

// Middleware — CSP opt-in via ENABLE_CSP=true (tune directives before enabling in prod SPA)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: enableCsp ? {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            frameAncestors: ["'self'"],
        },
    } : false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true } : false,
}));

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0) {
            if (isProduction) {
                return callback(new Error('CORS allowlist is not configured'), false);
            }
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Simple Request Logger
app.use((req, res, next) => {
    logger.request(req.method, req.url, req.headers.origin);
    next();
});

app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(require('cookie-parser')());
app.use('/api', apiLimiter);

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
            institution_id: req.user.institution_id,
        }
    });
});

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running', timestamp: new Date() });
});

const TPORoutes = require('./routes/TPORoutes');
const deptRoutes = require('./routes/deptRoutes');
const newsRoutes = require('./routes/newsRoutes');
const studentRoutes = require('./routes/studentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const platformFeedbackRoutes = require('./routes/platformFeedbackRoutes');

app.use('/api/TPO', TPORoutes);
app.use('/api/dept', deptRoutes);
app.use('/api', newsRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/config', require('./routes/configRoutes'));
app.use('/api/assessment', require('./routes/assessmentRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/platform-feedback', platformFeedbackRoutes);
app.use('/api/super-admin', require('./routes/superAdminRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));

// Uploaded files are served only via authenticated /api/files/* routes.

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('/{*path}', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
}

// Start Server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // Initialize services
    try {
        const ConfigService = require('./services/ConfigService');
        const EmailTemplateService = require('./services/EmailTemplateService');
        await ConfigService.initialize();
        await EmailTemplateService.initialize();
        console.log("✅ Services initialized");
    } catch (err) {
        console.error("❌ Service initialization failed:", err);
    }
});

// Export pool for use in other modules
module.exports = { app, pool: db };

// force restart

// Trigger nodemon restart
