# 🚀 Ziper v1.2.0 - Quick Start Guide

## Installation & First Use

### 1. Add to Your Website
```html
<script src="Ziper.js"></script>
```

### 2. First Login
When Ziper loads, you'll see a login screen:
- **Username:** `Sun`
- **Password:** `6619`
- Click **Login** or press Enter

### 3. Access Features
After login, you'll see the main Ziper interface with tabs:
- **💬 Chat** - AI assistant
- **🔧 Features** - 24+ tools and effects
- **⚡ Custom** - JavaScript code runner
- **⚙️ Settings** - Themes, account management, logout

## Admin Functions

### View Current User
Go to **Settings** tab - see your username at the top

### Create New Account
1. Go to **Settings** → scroll to **Admin Panel**
2. Fill in:
   - Username (letters, numbers, _ or -)
   - PIN (exactly 4 digits)
   - Expiration (1-365 days or leave empty for never)
3. Click **Create Account**

### Delete Account
1. Go to **Settings** → **Admin Panel** → **Accounts** list
2. Find the account
3. Click **🗑️ Delete** button
4. Confirm deletion

Note: Cannot delete the "Sun" admin account.

### Logout
1. Go to **Settings** tab
2. Click **🚪 Logout** button
3. Confirm logout

## Account Information

### Admin Account
- Username: `Sun`
- Password: `6619`
- Cannot be deleted
- Never expires

### Regular Accounts
- Created by admin
- Can have expiration dates
- Can be deleted by admin
- Same features as admin (except account management)

## Session Details

- **Duration:** 24 hours from login
- **Auto-logout:** When session expires or account expires
- **Storage:** localStorage (browser-specific)

## Keyboard Shortcuts

- **Ctrl+R** - Minimize/Maximize Ziper
- **Enter** (in login) - Submit login
- **Enter** (in username field) - Move to password field

## Themes

Choose from 5 color schemes in Settings:
- 🌲 Matrix Green (default)
- 🌊 Ocean Blue
- 👑 Royal Purple
- 🔥 Fire Red
- 🌅 Sunset Orange

## Features Still Work!

All 24+ original features are preserved:
- AI Chat, Custom JS, Games, Tools, Screen Filters, etc.

## Troubleshooting

### Can't Login
- Check username spelling (case-sensitive)
- Ensure PIN is exactly 4 digits
- Try clearing localStorage: `localStorage.clear()`

### Session Expired
- Normal after 24 hours
- Just login again

### Account Expired
- Admin can create a new account
- Or extend expiration when creating

### Lost Admin Password
Clear localStorage and refresh:
```javascript
localStorage.clear();
location.reload();
```
This resets to default admin account (Sun/6619).

## Security Notes

⚠️ **Important:**
- Passwords stored in plain text
- 4-digit PINs are convenient, not highly secure
- Suitable for bookmarklet/tool access control
- Not recommended for protecting sensitive data
- localStorage can be viewed in browser DevTools

## Testing

Use the included `test_login.html` file to test the system:
1. Open `test_login.html` in browser
2. Click "Launch Ziper"
3. Test login and all features

## Documentation

- **LOGIN_SYSTEM.md** - Complete feature documentation
- **IMPLEMENTATION_COMPLETE.md** - Technical details
- **QUICK_START.md** - This guide

## Support

If you encounter issues:
1. Check JavaScript console for errors
2. Verify localStorage is enabled
3. Try clearing localStorage
4. Review the documentation files

---

**Version:** 1.2.0  
**Last Updated:** January 2025
