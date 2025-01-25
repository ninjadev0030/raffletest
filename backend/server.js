const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');
const connectDB = require('./config/db');
const app = require('./app');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const options = {
  key: fs.readFileSync(path.join(__dirname, 'certificates', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates', 'cert.pem'))
};
// Start server
const PORT = process.env.PORT || 5000;
https.createServer(options, app).listen(5000, () => {
  console.log('HTTPS Server running on https://localhost:5000');
});