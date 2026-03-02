# Configuration Example for Super BAS

## Basic Configuration

Copy this configuration to the top of your APPS_SCRIPT_COMPLETE.gs file and modify as needed:

```javascript
const CONFIG = {
  // Sheet name where data will be written
  SHEET_NAME: 'Data',
  
  // API endpoint to fetch data from (leave empty for sample data)
  API_ENDPOINT: '',
  
  // Cache duration in seconds (default: 5 minutes)
  CACHE_DURATION: 300
};
```

## Example Configurations

### Example 1: Sample Data (No External API)
```javascript
const CONFIG = {
  SHEET_NAME: 'Data',
  API_ENDPOINT: '', // Empty = use sample data
  CACHE_DURATION: 300
};
```

### Example 2: REST API Connection
```javascript
const CONFIG = {
  SHEET_NAME: 'APIData',
  API_ENDPOINT: 'https://api.example.com/v1/data',
  CACHE_DURATION: 600 // 10 minutes
};
```

### Example 3: JSON Placeholder (Testing)
```javascript
const CONFIG = {
  SHEET_NAME: 'TestData',
  API_ENDPOINT: 'https://jsonplaceholder.typicode.com/users',
  CACHE_DURATION: 300
};
```

### Example 4: Local Data Source
```javascript
const CONFIG = {
  SHEET_NAME: 'LocalData',
  API_ENDPOINT: 'https://your-domain.com/api/data.json',
  CACHE_DURATION: 1800 // 30 minutes
};
```

## Advanced Configuration with Authentication

If your API requires authentication, modify the `fetchDataFromAPI` function:

### Bearer Token Authentication
```javascript
function fetchDataFromAPI(endpoint) {
  try {
    const token = 'YOUR_API_TOKEN'; // Or use PropertiesService
    
    const response = UrlFetchApp.fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      muteHttpExceptions: true
    });
    
    // ... rest of the function
  } catch (e) {
    Logger.log('Error fetching data: ' + e.message);
    throw e;
  }
}
```

### API Key Authentication
```javascript
function fetchDataFromAPI(endpoint) {
  try {
    const apiKey = 'YOUR_API_KEY'; // Or use PropertiesService
    const url = endpoint + '?api_key=' + apiKey;
    
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    // ... rest of the function
  } catch (e) {
    Logger.log('Error fetching data: ' + e.message);
    throw e;
  }
}
```

### Using Script Properties (Recommended for Sensitive Data)
```javascript
// Set properties once via Apps Script editor:
// File > Project properties > Script properties
// Add property: API_KEY = your_actual_key

function fetchDataFromAPI(endpoint) {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const apiKey = scriptProperties.getProperty('API_KEY');
    
    const response = UrlFetchApp.fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      muteHttpExceptions: true
    });
    
    // ... rest of the function
  } catch (e) {
    Logger.log('Error fetching data: ' + e.message);
    throw e;
  }
}
```

## Timezone Configuration

The default timezone is set to `Asia/Jakarta` in `appsscript.json`. To change it:

```json
{
  "timeZone": "America/New_York",
  ...
}
```

Common timezones:
- `America/New_York` - Eastern Time
- `America/Los_Angeles` - Pacific Time
- `Europe/London` - UK Time
- `Asia/Tokyo` - Japan Time
- `Asia/Jakarta` - Indonesia Time
- `Australia/Sydney` - Australian Time

## OAuth Scopes

The script requires these permissions (defined in appsscript.json):
- `https://www.googleapis.com/auth/spreadsheets` - Read and write spreadsheets
- `https://www.googleapis.com/auth/script.external_request` - Make external HTTP requests

## Environment Variables Using Script Properties

Instead of hardcoding values, use Script Properties:

1. In Apps Script editor: **File** > **Project properties** > **Script properties**
2. Add your properties:
   - Property: `API_ENDPOINT`, Value: `https://api.example.com/data`
   - Property: `API_KEY`, Value: `your_secret_key`
   - Property: `SHEET_NAME`, Value: `Data`

3. Update your CONFIG:
```javascript
const scriptProperties = PropertiesService.getScriptProperties();
const CONFIG = {
  SHEET_NAME: scriptProperties.getProperty('SHEET_NAME') || 'Data',
  API_ENDPOINT: scriptProperties.getProperty('API_ENDPOINT') || '',
  CACHE_DURATION: 300
};
```

## Testing Configuration

To test your configuration:

1. Run the `testConnection()` function
2. Check the "Test" sheet for results
3. Review logs: **View** > **Logs** in Apps Script editor

## Cache Configuration

Adjust cache duration based on your data update frequency:
- Real-time data: `60` (1 minute)
- Frequent updates: `300` (5 minutes)
- Hourly updates: `1800` (30 minutes)
- Daily updates: `3600` (1 hour)

## Troubleshooting Configuration Issues

### Issue: API not responding
- Check if the API_ENDPOINT URL is correct
- Test the API in a browser or with Postman first
- Check if the API requires authentication

### Issue: Wrong timezone
- Update `timeZone` in `appsscript.json`
- Save and redeploy the script

### Issue: Permission errors
- Verify OAuth scopes in `appsscript.json`
- Re-authorize the script

## Best Practices

1. **Never commit secrets**: Use Script Properties for sensitive data
2. **Test with sample data first**: Leave API_ENDPOINT empty initially
3. **Use appropriate cache duration**: Balance between freshness and API limits
4. **Monitor API usage**: Check your API provider's rate limits
5. **Log errors**: Always check logs when troubleshooting
