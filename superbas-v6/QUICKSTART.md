# Quick Start Guide - Super BAS

Get your data connected to Google Sheets in 5 minutes!

## 📋 Prerequisites

- Google Account
- Access to Google Sheets
- 5 minutes of your time

## 🚀 Step-by-Step Setup

### Step 1: Create a Google Sheet (1 minute)

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it "Super BAS Data" (or any name you prefer)

### Step 2: Open Apps Script Editor (30 seconds)

1. In your new spreadsheet, click **Extensions** in the menu
2. Click **Apps Script**
3. A new tab will open with the Apps Script editor

### Step 3: Add the Code (1 minute)

1. In the Apps Script editor, you'll see some default code
2. **Select all the code** (Ctrl+A or Cmd+A) and **delete it**
3. Open the file: `APPS_SCRIPT_COMPLETE.gs` in this repository
4. **Copy all the code** from that file
5. **Paste it** into the Apps Script editor
6. Click **Save** (disk icon or Ctrl+S)
7. Name your project "Super BAS Connection" when prompted

### Step 4: Grant Permissions (2 minutes)

1. In the Apps Script editor toolbar, click the **Select function** dropdown
2. Choose `testConnection` from the list
3. Click **Run** (▶️ play button)
4. A dialog will appear: "Authorization required"
5. Click **Review Permissions**
6. Select your Google account
7. Click **Advanced** (at the bottom)
8. Click **Go to [Project Name] (unsafe)**
9. Click **Allow**

### Step 5: Test the Connection (30 seconds)

1. The `testConnection` function should now run successfully
2. Go back to your Google Sheet tab
3. You should see a new sheet called "Test" with connection status
4. ✅ You're done! The connection is working!

### Step 6: Load Your First Data (30 seconds)

1. Reload your Google Sheet (F5 or refresh button)
2. You should now see a new menu called **"Super BAS"** in the menu bar
3. Click **Super BAS** > **Connect Data**
4. An alert will appear: "Sample data created..."
5. Click **OK**
6. Check the "Data" sheet - you'll see sample data!

## 🎉 Success!

You now have Super BAS up and running! The sample data proves that:
- ✅ The script can access your spreadsheet
- ✅ Data can be written to sheets
- ✅ The menu system works
- ✅ Everything is connected properly

## 🔄 Next Steps

### Option 1: Keep Using Sample Data
If you just want to test or don't have an API yet, you're all set! You can:
- Click **Super BAS** > **Refresh Data** to reload sample data
- Modify the sample data format in the script
- Experiment with the functions

### Option 2: Connect to Your API
To connect real data from an API:

1. Go back to the Apps Script editor
2. Find this section at the top of the code:
   ```javascript
   const CONFIG = {
     SHEET_NAME: 'Data',
     API_ENDPOINT: '', // Set your API endpoint here
     CACHE_DURATION: 300
   };
   ```
3. Update `API_ENDPOINT` with your API URL:
   ```javascript
   const CONFIG = {
     SHEET_NAME: 'Data',
     API_ENDPOINT: 'https://your-api.com/data',
     CACHE_DURATION: 300
   };
   ```
4. Click **Save**
5. Go back to your sheet and click **Super BAS** > **Refresh Data**
6. Your real data should now appear!

### Option 3: Try a Test API
Want to test with real API data? Use this free test API:

1. Update CONFIG to:
   ```javascript
   const CONFIG = {
     SHEET_NAME: 'Users',
     API_ENDPOINT: 'https://jsonplaceholder.typicode.com/users',
     CACHE_DURATION: 300
   };
   ```
2. Save and refresh data
3. You'll see user data from the test API!

## 🎨 Customization

### Change the Sheet Name
In CONFIG, change `SHEET_NAME`:
```javascript
const CONFIG = {
  SHEET_NAME: 'MyCustomName',  // Change this
  API_ENDPOINT: '',
  CACHE_DURATION: 300
};
```

### Adjust Cache Duration
To change how long data is cached (in seconds):
```javascript
const CONFIG = {
  SHEET_NAME: 'Data',
  API_ENDPOINT: '',
  CACHE_DURATION: 600  // 10 minutes instead of 5
};
```

## 📱 Using the Menu

The **Super BAS** menu provides these options:

- **Connect Data**: Load data from API or create sample data
- **Refresh Data**: Clear cache and reload fresh data
- **Clear Cache**: Remove cached data (forces fresh API call next time)

## 🔧 Troubleshooting

### Menu doesn't appear
**Fix**: Reload your spreadsheet (F5 or refresh)

### Permission errors
**Fix**: Re-run the authorization process (Step 4 above)

### "Failed to access spreadsheet"
**Fix**: Make sure you're running the script from within a spreadsheet, not a standalone Apps Script file

### Data not updating
**Fix**: Click **Super BAS** > **Clear Cache**, then **Refresh Data**

### API connection fails
**Fix**: 
- Check your API URL is correct
- Test the URL in your browser first
- Check if your API requires authentication (see CONFIG_EXAMPLE.md for auth examples)

## 📚 Learn More

- [Full Documentation](README.md) - Complete guide with all features
- [Configuration Examples](CONFIG_EXAMPLE.md) - Advanced setup options
- [Testing Guide](TESTING.md) - How to test all features

## 💡 Tips

1. **Start with sample data** - Don't configure an API until you verify the basic setup works
2. **Check the logs** - In Apps Script editor, go to View > Logs to see what's happening
3. **Test your API first** - Before configuring, make sure your API URL works in a browser
4. **Use the Test function** - Run `testConnection()` anytime to verify everything works
5. **Refresh often** - During setup, refresh your sheet to see menu updates

## ⏱️ Total Time: ~5 Minutes

- Step 1: 1 minute
- Step 2: 30 seconds  
- Step 3: 1 minute
- Step 4: 2 minutes
- Step 5: 30 seconds
- Step 6: 30 seconds

## 🆘 Need Help?

If you're stuck:
1. Check the error message carefully
2. Review the logs in Apps Script (View > Logs)
3. Try running `testConnection()` again
4. Consult the [full documentation](README.md)
5. Make sure you completed all steps, especially permissions

## ✅ Verification Checklist

Before moving to production, verify:
- [ ] `testConnection()` runs without errors
- [ ] "Test" sheet appears with OK status
- [ ] Super BAS menu appears in spreadsheet
- [ ] "Connect Data" creates sample data successfully
- [ ] "Refresh Data" works without errors
- [ ] If using API: Data from API appears correctly

## 🎯 What You've Accomplished

After completing this quick start:
- ✅ Installed and configured Google Apps Script
- ✅ Granted necessary permissions
- ✅ Created a working data connection
- ✅ Loaded data into your spreadsheet
- ✅ Set up a custom menu for easy access
- ✅ Ready to connect real data sources

**Congratulations! You're ready to use Super BAS! 🎊**
