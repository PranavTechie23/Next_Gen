const express = require('express');
const cors = require('cors');
const morgan = require('morgan');   
const app = express();
const db = require('./config/db');
require('dotenv').config();

// Middleware
app.use(cors()); // Allow frontend to connect later
app.use(express.json()); // Allow JSON data
app.use(morgan('dev'));

app.get('/',(req,res)=>{
    res.json({message:'Placement Automation API is Running'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});