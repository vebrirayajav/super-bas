const express = require('express');
const SheetsService = require('./sheetsService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Sheets Service
const sheetsService = new SheetsService();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Super BAS - Google Sheets API Integration',
    endpoints: {
      'GET /': 'Health check',
      'GET /api/test': 'Test API connection',
      'GET /api/data': 'Get all data from sheet',
      'GET /api/data/formatted': 'Get formatted data with headers'
    }
  });
});

// Test connection endpoint
app.get('/api/test', async (req, res) => {
  try {
    const isConnected = await sheetsService.testConnection();
    
    if (isConnected) {
      res.json({
        success: true,
        message: 'Successfully connected to Google Sheets API'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to connect to Google Sheets API',
        hint: 'Please check your .env configuration'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing connection',
      error: error.message
    });
  }
});

// Get raw data from sheet
app.get('/api/data', async (req, res) => {
  try {
    const range = req.query.range;
    const data = await sheetsService.getData(range);
    
    res.json({
      success: true,
      rowCount: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching data from Google Sheets',
      error: error.message
    });
  }
});

// Get formatted data from sheet
app.get('/api/data/formatted', async (req, res) => {
  try {
    const range = req.query.range;
    const data = await sheetsService.getFormattedData(range);
    
    res.json({
      success: true,
      recordCount: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching formatted data from Google Sheets',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Google Sheets API integration active`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  - GET /              : Health check`);
  console.log(`  - GET /api/test      : Test API connection`);
  console.log(`  - GET /api/data      : Get all data`);
  console.log(`  - GET /api/data/formatted : Get formatted data\n`);
  
  // Test connection on startup
  console.log('Testing Google Sheets API connection...');
  sheetsService.testConnection();
});

module.exports = app;
