# Deployment Configuration Guide

## After Deploying Google Apps Script

When you deploy or redeploy the Google Apps Script, you need to update the API URL in the frontend files.

### Steps:

1. **Deploy Apps Script**
   - Open Google Sheets → Extensions → Apps Script
   - Deploy → New deployment → Web app
   - Copy the deployment URL (e.g., `https://script.google.com/macros/s/ABC123.../exec`)

2. **Update Frontend Files**

   Edit the following files and replace the API URL:

   **File: `superbas-v6/index.html`**
   - Find line 17: `var OLD_API = "..."`
   - Find line 23: `var NEW_API = "..."`
   - Update NEW_API with your new deployment URL

   **File: `superbas-v6/owner.html`**
   - Find line 222: `const API = "..."`
   - Update with your new deployment URL

3. **Test the Connection**
   - Open index.html in a browser
   - Try logging in with Owner/Korlap credentials
   - Check browser console (F12) for any errors

### Current Deployment URLs

The project currently uses:
```
NEW_API = "https://script.google.com/macros/s/AKfycbylz213eFucAEniyxuVtNkYy86xUKXdwVbGD0M9rnNGoTziQyIWCOnyUQx1Nwc-eTCU/exec"
```

If you redeploy, you'll get a new URL that needs to be updated in both files.

### Tip: Using a Configuration File

For easier management, you could create a `config.js` file:

```javascript
// config.js
const API_CONFIG = {
  url: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
};
```

Then include it in your HTML files:
```html
<script src="config.js"></script>
<script>
  const API = API_CONFIG.url;
  // ... rest of your code
</script>
```

This way, you only need to update one file when redeploying.
