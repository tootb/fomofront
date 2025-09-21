const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));

// API endpoint for health check / keep-alive
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'fomo-frontend',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's',
    platform: 'render-webservice'
  });
});

// Keep-alive endpoint for cron-job.org
app.get('/keep-alive', (req, res) => {
  res.json({
    status: 'alive',
    service: 'fomo-frontend',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime() / 60) + ' minutes',
    message: 'Frontend server is running'
  });
});

// API endpoint to get frontend status
app.get('/api/status', (req, res) => {
  res.json({
    frontend: 'active',
    backend: process.env.REACT_APP_SERVER_URL || 'https://fomoback.onrender.com',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'production'
  });
});

// Serve React app for all other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Frontend server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 Backend URL: ${process.env.REACT_APP_SERVER_URL || 'https://fomoback.onrender.com'}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💓 Keep-alive: http://localhost:${PORT}/keep-alive`);
});

module.exports = app;