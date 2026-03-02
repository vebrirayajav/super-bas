const { google } = require('googleapis');
require('dotenv').config();

// Configuration constants
const MAX_ROWS = process.env.MAX_ROWS || 1000;

/**
 * Google Sheets Service
 * Handles connection and data retrieval from Google Sheets API
 */
class SheetsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    this.spreadsheetId = process.env.SPREADSHEET_ID;
    this.sheetName = process.env.SHEET_NAME || 'Sheet1';
    this.maxRows = MAX_ROWS;
    
    if (!this.apiKey) {
      console.warn('Warning: GOOGLE_SHEETS_API_KEY not set in environment variables');
    }
    
    if (!this.spreadsheetId) {
      console.warn('Warning: SPREADSHEET_ID not set in environment variables');
    }
  }

  /**
   * Get data from Google Sheets
   * @param {string} range - The range to fetch (e.g., 'Sheet1!A1:D10')
   * @returns {Promise<Array>} The data from the sheet
   */
  async getData(range) {
    try {
      if (!this.apiKey || !this.spreadsheetId) {
        throw new Error('Missing API configuration. Please check .env file.');
      }

      const sheets = google.sheets({ version: 'v4', auth: this.apiKey });
      
      const fullRange = range || `${this.sheetName}!A1:Z${this.maxRows}`;
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: fullRange,
      });

      const rows = response.data.values;
      
      if (!rows || rows.length === 0) {
        console.log('No data found in the sheet.');
        return [];
      }

      return rows;
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error.message);
      throw error;
    }
  }

  /**
   * Get formatted data with headers
   * @param {string} range - The range to fetch
   * @returns {Promise<Array<Object>>} Array of objects with header keys
   */
  async getFormattedData(range) {
    try {
      const rows = await this.getData(range);
      
      if (rows.length === 0) {
        return [];
      }

      const headers = rows[0];
      const data = rows.slice(1);

      return data.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
    } catch (error) {
      console.error('Error formatting data:', error.message);
      throw error;
    }
  }

  /**
   * Test the connection to Google Sheets API
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    try {
      if (!this.apiKey || !this.spreadsheetId) {
        console.error('❌ Configuration missing');
        return false;
      }

      const sheets = google.sheets({ version: 'v4', auth: this.apiKey });
      
      const response = await sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      console.log('✅ Successfully connected to Google Sheets API');
      console.log(`📄 Spreadsheet: ${response.data.properties.title}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to Google Sheets API:', error.message);
      return false;
    }
  }
}

module.exports = SheetsService;
