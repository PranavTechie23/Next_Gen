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

// Middleware
app.use(helmet());
app.use(cors({
    origin: function(origin, callback) {
        // Allow any request to pass through during development
        callback(null, true); 
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

app.use('/api/admin', adminRoutes);
app.use('/api/dept', deptRoutes);
app.use('/api', newsRoutes);

const studentRoutes = require('./routes/studentRoutes');
app.use('/api/student', studentRoutes);





// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Export pool for use in other modules
module.exports = { app, pool: db };