# Usage Flow - Super BAS Data Connection

This document illustrates the complete flow of using Super BAS to connect data to Google Sheets.

## 📊 System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  1. Create Google      │
                    │     Sheet              │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  2. Open Apps Script   │
                    │     Editor             │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  3. Paste Code from    │
                    │     APPS_SCRIPT_       │
                    │     COMPLETE.gs        │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  4. Grant Permissions  │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  5. Use Super BAS Menu │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  6. Connect Data       │
                    └────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  External    │         │  Apps Script │         │  Google      │
│  API         │────────▶│  (Cache)     │────────▶│  Sheet       │
│  (Optional)  │  HTTP   │              │  Write  │              │
└──────────────┘  GET    └──────────────┘  Data   └──────────────┘
                                 │
                                 │ If cached
                                 ▼
                    ┌────────────────────────┐
                    │  CacheService          │
                    │  (5 min default)       │
                    └────────────────────────┘
```

## 🔄 Function Call Flow

### Scenario 1: First Time Connection (Sample Data)

```
User clicks "Super BAS > Connect Data"
          │
          ▼
   connectDataToSheet()
          │
          ├─▶ getSpreadsheet()
          │   └─▶ Returns: Active spreadsheet
          │
          ├─▶ getOrCreateSheet('Data')
          │   └─▶ Creates/Gets sheet named "Data"
          │
          ├─▶ Check CONFIG.API_ENDPOINT
          │   └─▶ Empty = Use sample data
          │
          ├─▶ Generate sample data array
          │
          ├─▶ writeDataToSheet('Data', sampleData, true)
          │   ├─▶ Clear existing data
          │   └─▶ Write new data to sheet
          │
          └─▶ Show success alert
```

### Scenario 2: API Data Connection

```
User clicks "Super BAS > Connect Data"
          │
          ▼
   connectDataToSheet()
          │
          ├─▶ getSpreadsheet()
          │
          ├─▶ getOrCreateSheet('Data')
          │
          ├─▶ Check CONFIG.API_ENDPOINT
          │   └─▶ Not empty = Fetch from API
          │
          ├─▶ fetchDataFromAPI(endpoint)
          │   │
          │   ├─▶ Check cache
          │   │   ├─▶ If cached: Return cached data
          │   │   └─▶ If not cached: Continue
          │   │
          │   ├─▶ UrlFetchApp.fetch(endpoint)
          │   │   └─▶ HTTP GET request
          │   │
          │   ├─▶ Parse JSON response
          │   │
          │   ├─▶ Cache the data
          │   │
          │   └─▶ Return data
          │
          ├─▶ convertAPIDataToSheetFormat(apiData)
          │   ├─▶ Extract headers from data
          │   ├─▶ Convert to 2D array
          │   └─▶ Return formatted data
          │
          ├─▶ writeDataToSheet('Data', sheetData, true)
          │   ├─▶ Clear existing data
          │   └─▶ Write new data
          │
          └─▶ Show success alert
```

### Scenario 3: Data Refresh

```
User clicks "Super BAS > Refresh Data"
          │
          ▼
    refreshData()
          │
          ├─▶ Get cache instance
          │
          ├─▶ cache.remove('api_data_' + endpoint)
          │   └─▶ Clear cached data
          │
          └─▶ connectDataToSheet()
              └─▶ Fetches fresh data (see Scenario 2)
```

## 🎯 Menu Actions Flow

```
┌─────────────────────────────────────┐
│      Super BAS Menu                 │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Connect Data               │   │
│  └────────────┬────────────────┘   │
│               │                     │
│               ├─▶ connectDataToSheet()
│               │   └─▶ Load/Create data
│               │                     │
│  ┌────────────┴────────────────┐   │
│  │  Refresh Data               │   │
│  └────────────┬────────────────┘   │
│               │                     │
│               ├─▶ refreshData()
│               │   ├─▶ Clear cache
│               │   └─▶ Reload data
│               │                     │
│  ┌────────────┴────────────────┐   │
│  │  Clear Cache                │   │
│  └────────────┬────────────────┘   │
│               │                     │
│               └─▶ clearCache()
│                   └─▶ Remove cached entries
│                                     │
└─────────────────────────────────────┘
```

## 🧪 Testing Flow

```
Step 1: Test Connection
   testConnection()
        │
        ├─▶ Get spreadsheet
        ├─▶ Create "Test" sheet
        ├─▶ Write test data
        └─▶ Show results
             ↓
   ✅ Connection OK

Step 2: Connect Sample Data
   connectDataToSheet()
        │
        ├─▶ Create "Data" sheet
        ├─▶ Write sample data
        └─▶ Show success
             ↓
   ✅ Sample Data OK

Step 3: Configure API (Optional)
   Update CONFIG.API_ENDPOINT
        │
        └─▶ Set API URL
             ↓
   ✅ Configuration OK

Step 4: Test API Connection
   connectDataToSheet()
        │
        ├─▶ Fetch from API
        ├─▶ Convert format
        ├─▶ Write to sheet
        └─▶ Show success
             ↓
   ✅ API Data OK

Step 5: Test Refresh
   refreshData()
        │
        ├─▶ Clear cache
        ├─▶ Reload data
        └─▶ Verify update
             ↓
   ✅ Refresh OK
```

## 🔐 Permission Flow

```
1. User runs function
        │
        ▼
2. Apps Script checks permissions
        │
        ├─▶ Has permissions?
        │   └─▶ Yes: Execute function ✅
        │
        └─▶ No permissions?
            │
            ▼
3. Show "Authorization Required" dialog
        │
        ▼
4. User clicks "Review Permissions"
        │
        ▼
5. Google OAuth screen
        │
        ├─▶ Select account
        ├─▶ Review scopes:
        │   ├─ Spreadsheet access
        │   └─ External requests
        │
        ▼
6. User grants permissions
        │
        ▼
7. Function executes ✅
```

## 📦 Data Format Conversion Flow

### Array of Objects → Sheet Format

```
API Response:
[
  {id: 1, name: "Item 1", status: "active"},
  {id: 2, name: "Item 2", status: "inactive"}
]
        │
        ▼
convertAPIDataToSheetFormat()
        │
        ├─▶ Extract keys: ['id', 'name', 'status']
        │
        ├─▶ Create header row
        │
        └─▶ Create data rows
        
Sheet Result:
┌────┬─────────┬──────────┐
│ id │  name   │  status  │
├────┼─────────┼──────────┤
│ 1  │ Item 1  │ active   │
│ 2  │ Item 2  │ inactive │
└────┴─────────┴──────────┘
```

### Single Object → Sheet Format

```
API Response:
{
  total: 100,
  active: 75,
  inactive: 25
}
        │
        ▼
convertAPIDataToSheetFormat()
        │
        ├─▶ Create key-value pairs
        │
        └─▶ Format as rows
        
Sheet Result:
┌──────────┬───────┐
│   Key    │ Value │
├──────────┼───────┤
│  total   │  100  │
│  active  │   75  │
│ inactive │   25  │
└──────────┴───────┘
```

## ⚡ Error Handling Flow

```
Function Call
      │
      ▼
  try {
    Execute operation
      │
      ├─▶ Success? ✅
      │   └─▶ Log success
      │       └─▶ Show user alert
      │
      └─▶ Error? ❌
  }
      │
      ▼
  catch (error) {
      │
      ├─▶ Logger.log(error)
      │   └─▶ Logs for developer
      │
      ├─▶ SpreadsheetApp.getUi().alert(error)
      │   └─▶ Alert for user
      │
      └─▶ throw error
          └─▶ Stop execution
  }
```

## 🔄 Cache Strategy Flow

```
Data Request
      │
      ▼
Is data in cache?
      │
      ├─▶ YES (Cache Hit)
      │   │
      │   ├─▶ Get from cache ⚡ Fast!
      │   │
      │   └─▶ Return data
      │
      └─▶ NO (Cache Miss)
          │
          ├─▶ Fetch from API 🌐
          │
          ├─▶ Store in cache
          │   │
          │   └─▶ TTL: 5 minutes (default)
          │
          └─▶ Return data

Cache Refresh
      │
      ├─▶ Manual: "Refresh Data" button
      │   └─▶ cache.remove()
      │
      └─▶ Auto: After 5 minutes
          └─▶ Cache expires
```

## 📱 Mobile Usage Flow

```
Mobile Device
      │
      ▼
Open Google Sheets App
      │
      ▼
Open spreadsheet with script
      │
      ▼
Tap ⋮ (three dots menu)
      │
      ▼
Scroll to "Super BAS"
      │
      ├─▶ Connect Data
      ├─▶ Refresh Data
      └─▶ Clear Cache
      
Note: Full functionality available on mobile!
```

## 🎯 Quick Reference: Common Tasks

### Task: Connect Sample Data
```
Menu → Super BAS → Connect Data
[No configuration needed]
Result: Sample data in "Data" sheet
```

### Task: Connect API Data
```
1. Apps Script → Edit CONFIG.API_ENDPOINT
2. Menu → Super BAS → Connect Data
Result: API data in sheet
```

### Task: Refresh Data
```
Menu → Super BAS → Refresh Data
Result: Fresh data loaded
```

### Task: Test Connection
```
Apps Script → Run testConnection()
Result: "Test" sheet with status
```

### Task: Clear Cache
```
Menu → Super BAS → Clear Cache
Result: Cache cleared, next fetch will be fresh
```

## 🚀 Performance Flow

```
First Request (No Cache)
API Call ─────────────▶ [Server Processing] ──▶ Response
         ~1-3 seconds                            Cache ✅
         
Subsequent Requests (Cached)
Cache Hit ──▶ Response
  ~0.1 seconds  ⚡ Fast!
  
Cache Expired
API Call ─────────────▶ [Server Processing] ──▶ Response
         ~1-3 seconds                            New Cache ✅
```

## 📊 Data Volume Guidelines

```
Small Dataset (< 100 rows)
  ├─▶ Instant processing
  └─▶ No optimization needed

Medium Dataset (100-1,000 rows)
  ├─▶ Fast processing (~2-5 sec)
  └─▶ Caching helps significantly

Large Dataset (1,000-10,000 rows)
  ├─▶ Moderate processing (~5-30 sec)
  ├─▶ Caching essential
  └─▶ Consider pagination

Very Large (> 10,000 rows)
  ├─▶ May hit limits
  ├─▶ Consider splitting across sheets
  └─▶ Optimize API response
```

## 🎓 Learning Path

```
Beginner
  1. Read QUICKSTART.md ────▶ 5 min setup
  2. Connect sample data ───▶ Verify working
  3. Explore the menu ──────▶ Understand options

Intermediate
  1. Read README.md ────────▶ Full features
  2. Configure API ─────────▶ Real data
  3. Run TESTING.md tests ──▶ Verify all features

Advanced
  1. Read CONFIG_EXAMPLE ───▶ Advanced config
  2. Modify functions ──────▶ Customize
  3. Add triggers ──────────▶ Automation
```

This usage flow guide helps you understand exactly how the system works and how to use it effectively!
