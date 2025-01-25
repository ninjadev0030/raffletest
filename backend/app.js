const express = require('express');
const cors = require('cors');
const https = require('https');
const raffleRoutes = require('./routes/raffleRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const path = require('path');
const app = express();
const startCronJob = require('./cron/raffleCron'); // Import the cron function
const agent = new https.Agent({
    rejectUnauthorized: false, // Bypass SSL validation
});
// Middleware
app.use(cors({
    origin: 'https://185.28.22.25:5000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/raffles', raffleRoutes, { httpsAgent: agent });
app.use('/api', ticketRoutes, { httpsAgent: agent });

// Start the cron job
startCronJob();

module.exports = app;
