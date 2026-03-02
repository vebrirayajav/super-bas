# Super BAS - Google Sheets Data Connection System

A Google Apps Script solution for connecting external data sources to Google Sheets with automatic data synchronization and caching.

## 🚀 Quick Start

1. Navigate to `superbas-v6/` directory
2. Follow the setup instructions in [superbas-v6/README.md](superbas-v6/README.md)
3. Copy the code from `APPS_SCRIPT_COMPLETE.gs` to your Google Sheets Apps Script editor

## 📁 Project Structure

```
super-bas/
├── superbas-v6/
│   ├── APPS_SCRIPT_COMPLETE.gs  # Main Apps Script code
│   ├── README.md                # Detailed documentation
│   ├── CONFIG_EXAMPLE.md        # Configuration examples
│   └── appsscript.json          # Apps Script manifest
└── README.md                    # This file
```

## ✨ Features

- ✅ **Google Sheets Integration**: Seamless connection to Google Sheets API
- ✅ **External API Support**: Fetch data from any REST API
- ✅ **Data Caching**: Automatic caching to reduce API calls
- ✅ **Custom Menu**: Easy-to-use menu in Google Sheets
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Sample Data**: Built-in sample data for testing
- ✅ **Auto-refresh**: Manual and scheduled data refresh

## 🛠️ Setup

### Prerequisites
- Google Account
- Access to Google Sheets
- (Optional) External API endpoint for data

### Installation Steps

1. **Create a Google Spreadsheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet

2. **Add the Script**
   - Click **Extensions** > **Apps Script**
   - Copy code from `superbas-v6/APPS_SCRIPT_COMPLETE.gs`
   - Paste into the Apps Script editor
   - Save the project

3. **Configure**
   - Update the `CONFIG` object with your settings
   - See `superbas-v6/CONFIG_EXAMPLE.md` for examples

4. **Grant Permissions**
   - Run any function to trigger authorization
   - Grant necessary permissions

5. **Use the Menu**
   - Reload your spreadsheet
   - Look for "Super BAS" menu
   - Click "Connect Data" to start

## 📖 Documentation

- [Full Documentation](superbas-v6/README.md) - Complete guide with examples
- [Configuration Examples](superbas-v6/CONFIG_EXAMPLE.md) - Various configuration scenarios
- [Apps Script Code](superbas-v6/APPS_SCRIPT_COMPLETE.gs) - Main implementation

## 🔧 Configuration

Basic configuration in `APPS_SCRIPT_COMPLETE.gs`:

```javascript
const CONFIG = {
  SHEET_NAME: 'Data',           // Sheet name for data
  API_ENDPOINT: '',             // Your API URL (optional)
  CACHE_DURATION: 300           // Cache duration (seconds)
};
```

## 📝 Usage

### Via Menu (Recommended)
1. Open your Google Sheet
2. Click **Super BAS** menu
3. Select **Connect Data**

### Via Script
```javascript
// Initialize the system
initialize();

// Connect data
connectDataToSheet();

// Refresh data
refreshData();

// Test connection
testConnection();
```

## 🐛 Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Data not appearing | Run `connectDataToSheet()` from the menu |
| Permission errors | Grant necessary permissions when prompted |
| API connection fails | Check API endpoint URL and authentication |
| Stale data | Use "Refresh Data" or "Clear Cache" from menu |

See [Full Troubleshooting Guide](superbas-v6/README.md#troubleshooting) for more details.

## 🔐 Security

- Never commit API keys in code
- Use Google Apps Script Properties Service for sensitive data
- Review OAuth scopes in `appsscript.json`
- Follow the security guidelines in the documentation

## 📚 API Data Format

The script supports various API response formats:

**Array of Objects** (recommended):
```json
[
  {"id": 1, "name": "Item 1", "status": "active"},
  {"id": 2, "name": "Item 2", "status": "inactive"}
]
```

**Single Object**:
```json
{
  "total": 100,
  "active": 75
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For help:
1. Check the [documentation](superbas-v6/README.md)
2. Review [configuration examples](superbas-v6/CONFIG_EXAMPLE.md)
3. Check Apps Script logs: **View** > **Logs**
4. Open an issue on GitHub

## 🎯 Use Cases

- Import data from external APIs into Google Sheets
- Automate data synchronization
- Create dashboards with live data
- Monitor API data changes
- Build data pipelines with Google Sheets as the interface

## 🔄 Version

**Current Version**: v6 (superbas-v6)

## 👨‍💻 Author

Created for easy data integration with Google Sheets.