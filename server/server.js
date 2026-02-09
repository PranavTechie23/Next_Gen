const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Middleware
app.use(cors()); // Allow frontend to connect later
app.use(express.json()); // Allow JSON data

// // Import Routes
// const testRoutes = require('./routes/testRoute');

// // Use Routes
// app.use('/api', testRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});