# Super BAS - Google Sheets Data Connection

## Overview
This Google Apps Script connects external data sources to Google Sheets, providing automated data fetching and synchronization capabilities.

## Features
- ✅ Connect to Google Sheets API
- ✅ Fetch data from external APIs
- ✅ Automatic data caching
- ✅ Custom menu integration
- ✅ Error handling and logging
- ✅ Sample data generation
- ✅ Data refresh functionality

## Setup Instructions

### 1. Create a Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Give it a name (e.g., "Super BAS Data")

### 2. Add the Apps Script
1. In your Google Sheet, click on **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Copy all the code from `APPS_SCRIPT_COMPLETE.gs`
4. Paste it into the Apps Script editor
5. Click **Save** (disk icon)
6. Give your project a name (e.g., "Super BAS Connection")

### 3. Configure the Script
Update the `CONFIG` object at the top of the script:

```javascript
const CONFIG = {
  SHEET_NAME: 'Data',           // Name of the sheet to write data to
  API_ENDPOINT: '',             // Your API endpoint URL (optional)
  CACHE_DURATION: 300           // Cache duration in seconds
};
```

### 4. Grant Permissions
1. Run any function (e.g., `testConnection`) from the Apps Script editor
2. Click **Review Permissions**
3. Choose your Google account
4. Click **Advanced** > **Go to [Your Project Name] (unsafe)**
5. Click **Allow**

### 5. Use the Script
After setup, reload your Google Sheet. You should see a new menu called "Super BAS" with the following options:
- **Connect Data**: Establishes connection and loads data
- **Refresh Data**: Clears cache and reloads data
- **Clear Cache**: Clears cached data

## Functions

### Main Functions
- `connectDataToSheet()`: Main function to connect and load data to sheet
- `refreshData()`: Refresh data from source
- `testConnection()`: Test the connection and sheet access
- `initialize()`: Initialize the entire system

### Utility Functions
- `getSpreadsheet()`: Get the active spreadsheet
- `getOrCreateSheet(sheetName)`: Get or create a sheet by name
- `fetchDataFromAPI(endpoint)`: Fetch data from external API
- `writeDataToSheet(sheetName, data, clearFirst)`: Write data to sheet
- `readDataFromSheet(sheetName)`: Read data from sheet
- `convertAPIDataToSheetFormat(apiData)`: Convert API response to sheet format
- `clearCache()`: Clear all cached data

### Triggers
- `onOpen()`: Creates custom menu when spreadsheet opens

## Usage Examples

### Example 1: Connect with Sample Data
If no API endpoint is configured, the script will create sample data:
```javascript
// Just run from the menu: Super BAS > Connect Data
```

### Example 2: Connect to External API
```javascript
// 1. Update CONFIG with your API endpoint
const CONFIG = {
  SHEET_NAME: 'Data',
  API_ENDPOINT: 'https://api.example.com/data',
  CACHE_DURATION: 300
};

// 2. Run from menu: Super BAS > Connect Data
```

### Example 3: Programmatic Connection
```javascript
function myCustomFunction() {
  // Connect data
  connectDataToSheet();
  
  // Read the data
  const data = readDataFromSheet('Data');
  
  // Process the data
  Logger.log('Loaded ' + data.length + ' rows');
}
```

## Troubleshooting

### Issue: "Failed to access spreadsheet"
**Solution**: Make sure you've granted the necessary permissions to the script.

### Issue: "No data to write"
**Solution**: Check if your API endpoint is returning data. Run `testConnection()` to verify.

### Issue: "API request failed"
**Solution**: 
- Verify your API endpoint URL is correct
- Check if the API requires authentication
- Review the logs (View > Logs in Apps Script editor)

### Issue: Data is not updating
**Solution**: 
- Use "Refresh Data" from the Super BAS menu
- Check if caching is causing stale data
- Use "Clear Cache" to force a fresh fetch

### Issue: "Sheet is empty"
**Solution**: 
- Run `connectDataToSheet()` first to populate data
- Check the logs for any error messages

## Data Format

### API Response Format
The script expects API responses in one of these formats:

**Array of Objects:**
```json
[
  {"id": 1, "name": "Item 1", "status": "active"},
  {"id": 2, "name": "Item 2", "status": "inactive"}
]
```

**Single Object:**
```json
{
  "total": 100,
  "active": 75,
  "inactive": 25
}
```

### Sheet Format
Data is automatically converted to a 2D array format for sheets:
- First row contains headers (column names)
- Subsequent rows contain data values

## Advanced Configuration

### Custom Data Processing
To customize how API data is processed, modify the `convertAPIDataToSheetFormat()` function:

```javascript
function convertAPIDataToSheetFormat(apiData) {
  // Your custom processing logic here
  // Return a 2D array for the sheet
}
```

### Scheduled Updates
To automatically refresh data on a schedule:
1. In Apps Script editor, click on **Triggers** (clock icon)
2. Click **Add Trigger**
3. Choose `refreshData` function
4. Select event source: **Time-driven**
5. Choose frequency (e.g., Every hour, Every day)
6. Click **Save**

## Security Notes
- Never commit API keys or sensitive credentials in the code
- Use Google Apps Script Properties Service for sensitive data:
  ```javascript
  const apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
  ```
- Set properties via: **Project Settings** (gear icon) in the left sidebar, then click **Script Properties**

## Logging
View logs to troubleshoot issues:
1. In Apps Script editor, go to **View** > **Logs**
2. Or use `Logger.log()` statements in your code
3. For production, consider using `console.log()` for Stackdriver logging

## Support
For issues or questions:
1. Check the logs in Apps Script editor
2. Review the troubleshooting section above
3. Verify all permissions are granted
4. Test with sample data first before connecting to external APIs

## License
This project is open source and available for use and modification.
