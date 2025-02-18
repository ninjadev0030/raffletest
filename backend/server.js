const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');
const http = require('http');
const connectDB = require('./config/db');
const app = require('./app');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();
const options = {
  key: fs.readFileSync(path.join(__dirname, 'certificates', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates', 'cert.pem'))
};
console.log(options);
// Start server
const PORT = process.env.PORT || 5000;
// https.createServer(options, app).listen(443, () => {
//   console.log('HTTPS Server running on https://localhost');
// });

const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`HTTP Server running on http://localhost:${PORT}`);
});