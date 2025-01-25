const express = require('express');
const cors = require('cors');
const raffleRoutes = require('./routes/raffleRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const path = require('path');
const app = express();
const startCronJob = require('./cron/raffleCron'); // Import the cron function

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/raffles', raffleRoutes);
app.use('/api', ticketRoutes);

// Start the cron job
startCronJob();

module.exports = app;
