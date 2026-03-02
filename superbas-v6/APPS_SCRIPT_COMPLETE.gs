/**
 * Google Apps Script - Super BAS Data Connection
 * This script connects data to Google Sheets API
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Data',
  API_ENDPOINT: '', // Set your API endpoint here if needed
  CACHE_DURATION: 300 // 5 minutes in seconds
};

/**
 * Get the active spreadsheet
 * @return {Spreadsheet} The active spreadsheet
 */
function getSpreadsheet() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    Logger.log('Error getting spreadsheet: ' + e.message);
    throw new Error('Failed to access spreadsheet: ' + e.message);
  }
}

/**
 * Get or create a sheet by name
 * @param {string} sheetName - The name of the sheet
 * @return {Sheet} The sheet object
 */
function getOrCreateSheet(sheetName) {
  try {
    const spreadsheet = getSpreadsheet();
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      Logger.log('Created new sheet: ' + sheetName);
    }
    
    return sheet;
  } catch (e) {
    Logger.log('Error getting/creating sheet: ' + e.message);
    throw new Error('Failed to access sheet: ' + e.message);
  }
}

/**
 * Connect and fetch data from external API
 * @param {string} endpoint - API endpoint URL
 * @return {Object} The fetched data
 */
function fetchDataFromAPI(endpoint) {
  try {
    if (!endpoint) {
      Logger.log('No API endpoint configured');
      return null;
    }
    
    const cache = CacheService.getScriptCache();
    const cacheKey = 'api_data_' + endpoint;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      Logger.log('Returning cached data');
      return JSON.parse(cachedData);
    }
    
    const response = UrlFetchApp.fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    const statusCode = response.getResponseCode();
    
    if (statusCode !== 200) {
      throw new Error('API request failed with status: ' + statusCode);
    }
    
    const data = JSON.parse(response.getContentText());
    
    // Cache the data
    cache.put(cacheKey, JSON.stringify(data), CONFIG.CACHE_DURATION);
    
    Logger.log('Data fetched successfully from API');
    return data;
    
  } catch (e) {
    Logger.log('Error fetching data from API: ' + e.message);
    throw new Error('Failed to fetch data from API: ' + e.message);
  }
}

/**
 * Write data to sheet
 * @param {string} sheetName - The name of the sheet
 * @param {Array} data - 2D array of data to write
 * @param {boolean} clearFirst - Whether to clear the sheet first
 */
function writeDataToSheet(sheetName, data, clearFirst) {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to write');
    }
    
    const sheet = getOrCreateSheet(sheetName);
    
    if (clearFirst) {
      sheet.clear();
      Logger.log('Sheet cleared');
    }
    
    const range = sheet.getRange(1, 1, data.length, data[0].length);
    range.setValues(data);
    
    Logger.log('Data written successfully to sheet: ' + sheetName);
    Logger.log('Rows written: ' + data.length);
    
  } catch (e) {
    Logger.log('Error writing data to sheet: ' + e.message);
    throw new Error('Failed to write data to sheet: ' + e.message);
  }
}

/**
 * Read data from sheet
 * @param {string} sheetName - The name of the sheet
 * @return {Array} 2D array of data from the sheet
 */
function readDataFromSheet(sheetName) {
  try {
    const sheet = getOrCreateSheet(sheetName);
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    
    if (lastRow === 0 || lastColumn === 0) {
      Logger.log('Sheet is empty');
      return [];
    }
    
    const range = sheet.getRange(1, 1, lastRow, lastColumn);
    const data = range.getValues();
    
    Logger.log('Data read successfully from sheet: ' + sheetName);
    return data;
    
  } catch (e) {
    Logger.log('Error reading data from sheet: ' + e.message);
    throw new Error('Failed to read data from sheet: ' + e.message);
  }
}

/**
 * Main function to connect data to sheet
 * This is the primary function to establish the connection
 */
function connectDataToSheet() {
  try {
    Logger.log('Starting data connection to sheet...');
    
    // Get or create the data sheet
    const sheet = getOrCreateSheet(CONFIG.SHEET_NAME);
    
    // Check if API endpoint is configured
    if (CONFIG.API_ENDPOINT) {
      // Fetch data from API
      const apiData = fetchDataFromAPI(CONFIG.API_ENDPOINT);
      
      if (apiData) {
        // Convert API data to 2D array format for sheets
        const sheetData = convertAPIDataToSheetFormat(apiData);
        
        // Write data to sheet
        writeDataToSheet(CONFIG.SHEET_NAME, sheetData, true);
        
        SpreadsheetApp.getUi().alert('Success', 'Data connected and loaded successfully!', SpreadsheetApp.getUi().ButtonSet.OK);
      } else {
        SpreadsheetApp.getUi().alert('Warning', 'No API endpoint configured. Please set API_ENDPOINT in CONFIG.', SpreadsheetApp.getUi().ButtonSet.OK);
      }
    } else {
      // If no API endpoint, create sample data structure
      const sampleData = [
        ['ID', 'Name', 'Status', 'Date'],
        [1, 'Sample Data 1', 'Active', new Date().toLocaleDateString()],
        [2, 'Sample Data 2', 'Active', new Date().toLocaleDateString()],
        [3, 'Sample Data 3', 'Inactive', new Date().toLocaleDateString()]
      ];
      
      writeDataToSheet(CONFIG.SHEET_NAME, sampleData, true);
      
      SpreadsheetApp.getUi().alert('Info', 'Sample data created. Configure API_ENDPOINT to connect to real data source.', SpreadsheetApp.getUi().ButtonSet.OK);
    }
    
    Logger.log('Data connection completed successfully');
    
  } catch (e) {
    Logger.log('Error in connectDataToSheet: ' + e.message);
    SpreadsheetApp.getUi().alert('Error', 'Failed to connect data: ' + e.message, SpreadsheetApp.getUi().ButtonSet.OK);
    throw e;
  }
}

/**
 * Convert API data to sheet format
 * @param {Object|Array} apiData - Data from API
 * @return {Array} 2D array formatted for sheets
 */
function convertAPIDataToSheetFormat(apiData) {
  try {
    // Handle array of objects
    if (Array.isArray(apiData)) {
      if (apiData.length === 0) {
        return [['No data available']];
      }
      
      // Get headers from first object
      const headers = Object.keys(apiData[0]);
      const rows = [headers];
      
      // Convert each object to array of values
      apiData.forEach(item => {
        const row = headers.map(header => item[header] !== undefined ? item[header] : '');
        rows.push(row);
      });
      
      return rows;
    }
    
    // Handle single object
    if (typeof apiData === 'object' && apiData !== null) {
      const rows = [['Key', 'Value']];
      Object.keys(apiData).forEach(key => {
        rows.push([key, apiData[key]]);
      });
      return rows;
    }
    
    // Default case
    return [['Data'], [JSON.stringify(apiData)]];
    
  } catch (e) {
    Logger.log('Error converting API data: ' + e.message);
    return [['Error'], ['Failed to convert data: ' + e.message]];
  }
}

/**
 * Refresh data from source
 */
function refreshData() {
  try {
    Logger.log('Refreshing data...');
    
    // Clear cache
    const cache = CacheService.getScriptCache();
    cache.removeAll(['api_data_' + CONFIG.API_ENDPOINT]);
    
    // Reconnect data
    connectDataToSheet();
    
  } catch (e) {
    Logger.log('Error refreshing data: ' + e.message);
    SpreadsheetApp.getUi().alert('Error', 'Failed to refresh data: ' + e.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Create custom menu on spreadsheet open
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Super BAS')
      .addItem('Connect Data', 'connectDataToSheet')
      .addItem('Refresh Data', 'refreshData')
      .addSeparator()
      .addItem('Clear Cache', 'clearCache')
      .addToUi();
    
    Logger.log('Custom menu created successfully');
  } catch (e) {
    Logger.log('Error creating menu: ' + e.message);
  }
}

/**
 * Clear all cached data
 */
function clearCache() {
  try {
    const cache = CacheService.getScriptCache();
    cache.removeAll(['api_data_' + CONFIG.API_ENDPOINT]);
    
    SpreadsheetApp.getUi().alert('Success', 'Cache cleared successfully!', SpreadsheetApp.getUi().ButtonSet.OK);
    Logger.log('Cache cleared');
    
  } catch (e) {
    Logger.log('Error clearing cache: ' + e.message);
    SpreadsheetApp.getUi().alert('Error', 'Failed to clear cache: ' + e.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Test the connection
 */
function testConnection() {
  try {
    Logger.log('Testing connection...');
    
    const spreadsheet = getSpreadsheet();
    const sheet = getOrCreateSheet('Test');
    
    const testData = [
      ['Test', 'Status', 'Timestamp'],
      ['Connection', 'OK', new Date().toLocaleString()],
      ['Sheet Access', 'OK', new Date().toLocaleString()],
      ['API Ready', CONFIG.API_ENDPOINT ? 'Configured' : 'Not Configured', new Date().toLocaleString()]
    ];
    
    writeDataToSheet('Test', testData, true);
    
    SpreadsheetApp.getUi().alert('Success', 'Connection test passed! Check the "Test" sheet for details.', SpreadsheetApp.getUi().ButtonSet.OK);
    Logger.log('Connection test completed successfully');
    
  } catch (e) {
    Logger.log('Connection test failed: ' + e.message);
    SpreadsheetApp.getUi().alert('Error', 'Connection test failed: ' + e.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Initialize the system
 */
function initialize() {
  try {
    Logger.log('Initializing Super BAS system...');
    
    // Test connection first
    testConnection();
    
    // Then connect data
    connectDataToSheet();
    
    Logger.log('Initialization completed');
    
  } catch (e) {
    Logger.log('Initialization failed: ' + e.message);
    throw e;
  }
}
