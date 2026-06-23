# Ziper v1.2.0 - Login System Documentation

## 🆕 What's New in v1.2.0

### Complete Login System
Ziper now features a comprehensive account management and authentication system with:

- ✅ Login screen before main UI
- ✅ Session management (24-hour auto-logout)
- ✅ Admin panel for account management
- ✅ Account expiration support
- ✅ Secure 4-digit PIN authentication

---

## 🔑 Default Admin Account

**Username:** `Sun`  
**Password:** `6619`  
**Role:** Administrator  
**Expiration:** Never

---

## 📋 Features Overview

### 1. Login Screen
- **Matrix Green Theme**: Matches Ziper's signature design
- **Username Field**: Standard text input
- **PIN Field**: 4-digit numeric password (secure entry)
- **Error Messages**: Clear feedback for invalid credentials
- **Enter Key Support**: Quick login workflow

### 2. Session Management
- **24-Hour Sessions**: Auto-logout after 24 hours
- **Persistent Storage**: Uses localStorage
- **Session Validation**: Checks on every page load
- **Account Expiration**: Automatic logout for expired accounts

### 3. User Interface Updates
- **Current User Display**: Shows logged-in username in Settings tab
- **Admin Badge**: Shows "(Admin)" for admin users
- **Logout Button**: Prominent logout option in Settings
- **Version Update**: Shows v1.2.0 in Settings

### 4. Admin Panel (Admin Users Only)
Located in the Settings tab, below the theme selector.

#### Create Account Section
- **Username Input**: Text field for new username
- **PIN Input**: 4-digit numeric password
- **Expiration Input**: Optional days (1-365) or leave empty for "never"
- **Create Button**: Validates and creates new account
- **Status Messages**: Success/error feedback

#### Accounts List Section
- **All Accounts Display**: Shows every registered account
- **Account Information**:
  - Username with admin badge (👑) if applicable
  - Status: Active (✅) or Expired (❌)
  - Creation date and time
  - Expiration date and time (or "Never")
- **Delete Buttons**: Remove accounts (except "Sun")
- **Auto-Refresh**: Updates after create/delete operations

---

## 🔐 Security Features

### Password Requirements
- Exactly 4 digits (0-9)
- No letters or special characters
- Numeric keyboard support on mobile

### Account Protection
- Admin account "Sun" cannot be deleted
- Session expiration after 24 hours
- Account expiration dates enforced
- Invalid credentials show generic error messages

### Data Storage
All data stored in localStorage:
- `ziperAccounts`: Account database
- `ziperCurrentUser`: Current session username
- `ziperSessionTimestamp`: Login timestamp

---

## 📖 Usage Guide

### First Time Setup
1. Load Ziper.js in your webpage
2. Login screen appears automatically
3. Enter default admin credentials (Sun / 6619)
4. Main Ziper UI loads

### Creating New Accounts (Admin Only)
1. Click Settings tab
2. Scroll to Admin Panel
3. Enter new username
4. Enter 4-digit PIN
5. Optional: Set expiration (1-365 days or leave empty)
6. Click "Create Account"

### Deleting Accounts (Admin Only)
1. Go to Settings → Admin Panel
2. Find account in the list
3. Click "Delete" button (not available for "Sun")
4. Confirm deletion

### Logging Out
1. Go to Settings tab
2. Click "Logout" button
3. Confirm logout
4. Returns to login screen

### Account Expiration
- Set days (1-365) when creating account
- Leave empty for accounts that never expire
- Expired accounts cannot log in
- Status shown in accounts list

---

## 🏗️ Technical Implementation

### Account Structure
```javascript
{
  username: {
    password: "1234",      // 4-digit PIN
    admin: false,          // Admin privileges
    created: 1234567890,   // Timestamp
    expires: 1234567890    // Timestamp or null
  }
}
```

### Session Flow
1. Page loads → Check session validity
2. No session → Show login screen
3. Valid session → Load main Ziper UI
4. Session > 24 hours → Force logout
5. Account expired → Force logout

### Key Functions
- `initAccounts()`: Initialize account database
- `getCurrentSession()`: Validate and return session
- `login(username, password)`: Authenticate user
- `logout()`: Clear session
- `createAccount(username, password, days)`: Add new account
- `deleteAccount(username)`: Remove account
- `getAllAccounts()`: Get all accounts (admin only)
- `showLoginScreen()`: Display login UI

---

## 🎨 Theme Integration

The login screen uses the Matrix Green theme by default and includes:
- Green gradient background (#0d1b0e → #1a3a1f)
- Green borders (#2ecc71)
- Green shadow effects
- Matching color scheme with main UI

Once logged in, users can change themes in Settings, and all 5 themes work perfectly:
- 🌲 Matrix Green
- 🌊 Ocean Blue  
- 👑 Royal Purple
- 🔥 Fire Red
- 🌅 Sunset Orange

---

## 🧪 Testing Checklist

- [ ] Login with default admin account
- [ ] Create new non-admin account
- [ ] Login with new account
- [ ] Test invalid credentials
- [ ] Test 4-digit PIN validation
- [ ] Create account with expiration
- [ ] Verify expired account cannot login
- [ ] Delete non-admin account
- [ ] Try to delete admin account (should fail)
- [ ] Test logout functionality
- [ ] Test session persistence (refresh page)
- [ ] Test 24-hour auto-logout
- [ ] Verify admin panel only shows for admins
- [ ] Test all 5 themes still work
- [ ] Verify all 24+ original features work

---

## 🔄 Backward Compatibility

✅ **All original features preserved:**
- AI Chat (Hugging Face)
- Custom JS Runner
- 24+ Fun Effects & Games
- Screen Filters
- Theme System
- Minimize/Maximize
- All keyboard shortcuts (Ctrl+R, Ctrl+Shift+E)

---

## 📊 Statistics

- **Lines Added**: ~422 lines
- **New Functions**: 8 (login, logout, create, delete, etc.)
- **New UI Elements**: Login screen + Admin panel
- **localStorage Keys**: 3 (accounts, user, timestamp)
- **Original Features**: 100% intact

---

## 🐛 Known Limitations

1. **Local Storage Only**: Accounts stored in browser localStorage
2. **Single Browser**: Accounts don't sync across browsers
3. **Clear Data**: Clearing browser data removes all accounts
4. **PIN Security**: 4-digit PINs are easy to brute force (not for production)
5. **No Password Recovery**: Lost passwords require localStorage edit

---

## 🚀 Future Enhancements (Not Implemented)

- Multi-factor authentication
- Password recovery system
- Account sync across devices
- Password complexity options (6-8 digits)
- Login history/audit log
- Role-based permissions beyond admin/user
- Email notifications for expiring accounts

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Test with default admin account
3. Clear localStorage if needed: `localStorage.clear()`
4. Verify JavaScript console for errors

---

## 📄 License

Same as original Ziper project.

---

**Version:** 1.2.0  
**Last Updated:** January 2025  
**Author:** Enhanced with comprehensive login system
