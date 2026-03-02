# Testing Guide for Super BAS

This guide helps you test the Google Apps Script implementation to ensure data is properly connected to Google Sheets.

## Prerequisites

Before testing:
1. The script should be added to your Google Sheets via Extensions > Apps Script
2. Permissions should be granted to the script
3. The spreadsheet should be open

## Test Scenarios

### Test 1: Basic Connection Test

**Purpose**: Verify the script can access the spreadsheet and create sheets.

**Steps**:
1. Open your Google Sheet
2. Go to Extensions > Apps Script
3. Select the `testConnection` function from the dropdown
4. Click Run (▶️)
5. Check for a new "Test" sheet with connection status

**Expected Result**:
- A "Test" sheet is created
- The sheet contains connection status information
- All tests show "OK" status
- An alert appears: "Connection test passed!"

**Troubleshooting**:
- If permission dialog appears, grant the requested permissions
- If error occurs, check the logs (View > Logs)

### Test 2: Sample Data Connection

**Purpose**: Verify data can be written to sheets without external API.

**Steps**:
1. Open your Google Sheet
2. From the "Super BAS" menu, click "Connect Data"
3. Wait for the operation to complete

**Expected Result**:
- A "Data" sheet is created (or cleared if it exists)
- Sample data appears with headers: ID, Name, Status, Date
- Three rows of sample data are displayed
- An alert appears: "Sample data created. Configure API_ENDPOINT to connect to real data source."

**Troubleshooting**:
- If no menu appears, reload the spreadsheet
- If menu doesn't work, run `connectDataToSheet()` from Apps Script editor

### Test 3: Data Refresh

**Purpose**: Verify data can be refreshed and cache is cleared.

**Steps**:
1. Ensure Test 2 has been completed
2. Modify any cell in the "Data" sheet
3. From the "Super BAS" menu, click "Refresh Data"
4. Observe the data

**Expected Result**:
- The sheet is cleared and repopulated
- Manual changes are overwritten
- Fresh sample data appears
- An alert confirms success

### Test 4: Cache Functionality

**Purpose**: Verify caching works correctly.

**Steps**:
1. Open Apps Script editor
2. Set a test API endpoint in CONFIG (e.g., 'https://jsonplaceholder.typicode.com/users')
3. Run `connectDataToSheet()`
4. Note the execution time
5. Run `connectDataToSheet()` again immediately
6. Note the second execution time

**Expected Result**:
- Second execution is faster (cached)
- Check logs to see "Returning cached data" message

### Test 5: External API Connection (Optional)

**Purpose**: Verify connection to an external API.

**Steps**:
1. Update CONFIG in the script:
   ```javascript
   const CONFIG = {
     SHEET_NAME: 'APIData',
     API_ENDPOINT: 'https://jsonplaceholder.typicode.com/users',
     CACHE_DURATION: 300
   };
   ```
2. Save the script
3. Run `connectDataToSheet()` from Apps Script editor
4. Check the "APIData" sheet

**Expected Result**:
- A new "APIData" sheet is created
- Data from the API appears in the sheet
- Headers match the JSON object keys
- Alert shows: "Data connected and loaded successfully!"

**Troubleshooting**:
- Verify the API URL is accessible
- Check the logs for any error messages
- Ensure the API returns valid JSON

### Test 6: Error Handling

**Purpose**: Verify proper error handling.

**Steps**:
1. Update CONFIG with an invalid API endpoint:
   ```javascript
   const CONFIG = {
     SHEET_NAME: 'ErrorTest',
     API_ENDPOINT: 'https://invalid-url-that-does-not-exist.com/api',
     CACHE_DURATION: 300
   };
   ```
2. Run `connectDataToSheet()`

**Expected Result**:
- An error alert appears with descriptive message
- Logs contain detailed error information
- The script doesn't crash
- No partial data is written

### Test 7: Menu Functionality

**Purpose**: Verify all menu items work correctly.

**Steps**:
1. Open your Google Sheet
2. Verify "Super BAS" menu appears
3. Test each menu item:
   - Connect Data
   - Refresh Data
   - Clear Cache

**Expected Result**:
- All menu items are visible
- Each menu item executes its function
- Appropriate alerts appear after each action

### Test 8: Data Format Conversion

**Purpose**: Verify different API response formats are handled correctly.

**Test 8a - Array of Objects**:
```javascript
// In Apps Script editor, create and run this test function:
function testArrayFormat() {
  const testData = [
    {id: 1, name: 'Test 1', value: 100},
    {id: 2, name: 'Test 2', value: 200}
  ];
  const result = convertAPIDataToSheetFormat(testData);
  Logger.log(result);
}
```

**Expected Result**:
- First row contains headers: ['id', 'name', 'value']
- Subsequent rows contain the data values

**Test 8b - Single Object**:
```javascript
function testObjectFormat() {
  const testData = {
    total: 100,
    active: 75,
    inactive: 25
  };
  const result = convertAPIDataToSheetFormat(testData);
  Logger.log(result);
}
```

**Expected Result**:
- Two columns: ['Key', 'Value']
- Rows contain each property and its value

## Automated Test Checklist

Run through this checklist to verify all functionality:

- [ ] Script loads without syntax errors
- [ ] Permissions can be granted successfully
- [ ] `testConnection()` passes all checks
- [ ] Sample data can be created
- [ ] Data can be written to sheets
- [ ] Data can be read from sheets
- [ ] Menu appears in spreadsheet
- [ ] Menu items execute correctly
- [ ] Cache functionality works
- [ ] API data can be fetched (if endpoint configured)
- [ ] Error messages are clear and helpful
- [ ] Logs provide useful debugging information
- [ ] Different data formats are handled correctly
- [ ] Refresh clears and reloads data
- [ ] Cache can be cleared manually

## Common Issues and Solutions

### Issue: Menu doesn't appear
**Solution**: 
- Reload the spreadsheet
- Check if `onOpen()` function exists in the script
- Run `onOpen()` manually from Apps Script editor

### Issue: Permission denied
**Solution**:
- Click "Review Permissions" when prompted
- Grant necessary permissions
- Try running the function again

### Issue: "Failed to access spreadsheet"
**Solution**:
- Ensure you're running from a spreadsheet (not standalone script)
- Check OAuth scopes in appsscript.json

### Issue: Data not updating
**Solution**:
- Use "Clear Cache" from menu
- Run `refreshData()` function
- Check if API endpoint is returning data

### Issue: API connection fails
**Solution**:
- Verify API URL is correct and accessible
- Check if API requires authentication
- Review error messages in logs
- Test API endpoint in browser or Postman first

## Performance Testing

### Test: Large Dataset
1. Configure API that returns many records (100+)
2. Run `connectDataToSheet()`
3. Measure execution time
4. Verify all data appears correctly

**Expected**: Script should handle up to 1000 rows efficiently (under 30 seconds)

### Test: Frequent Refreshes
1. Run `refreshData()` multiple times in succession
2. Observe cache behavior
3. Check execution times

**Expected**: Cached requests should be significantly faster

## Logging and Debugging

To view detailed logs:
1. In Apps Script editor: View > Logs
2. Or use: View > Executions (for execution history)

Look for these log messages:
- "Starting data connection to sheet..."
- "Data fetched successfully from API"
- "Data written successfully to sheet"
- "Data connection completed successfully"

## Success Criteria

The implementation is successful if:
1. ✅ All test scenarios pass
2. ✅ No errors in execution logs
3. ✅ Data appears correctly in sheets
4. ✅ Menu functions work as expected
5. ✅ Error messages are clear and helpful
6. ✅ Performance is acceptable
7. ✅ Cache reduces API calls

## Next Steps After Testing

Once testing is complete:
1. Configure your actual API endpoint in CONFIG
2. Set up authentication if required
3. Configure scheduled triggers for automatic updates
4. Share the spreadsheet with users
5. Monitor logs for any issues in production

## Support

If tests fail:
1. Check the detailed error message
2. Review the logs in Apps Script editor
3. Verify your configuration matches examples
4. Consult the main README.md for troubleshooting
5. Check that all required permissions are granted
