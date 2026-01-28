(function(){
  /* ===== ZIPER v1.2.0 WITH LOGIN SYSTEM ===== */
  
  // Check if already loaded
  if(document.getElementById("ziperRoot") || document.getElementById("ziperLoginScreen")) return;
  
  /* ===== ACCOUNT MANAGEMENT SYSTEM ===== */
  const ACCOUNTS_KEY = "ziperAccounts";
  const SESSION_KEY = "ziperCurrentUser";
  const SESSION_TIMESTAMP_KEY = "ziperSessionTimestamp";
  
  // Initialize accounts storage with admin account
  function initAccounts() {
    let accounts = localStorage.getItem(ACCOUNTS_KEY);
    if(!accounts) {
      accounts = {
        "Sun": {
          password: "6619",
          admin: true,
          created: Date.now(),
          expires: null
        }
      };
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY));
  }
  
  // Get accounts
  function getAccounts() {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
  }
  
  // Save accounts
  function saveAccounts(accounts) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }
  
  // Validate account
  function validateAccount(username, password) {
    const accounts = getAccounts();
    const account = accounts[username];
    
    if(!account) return { valid: false, message: "Invalid username" };
    if(account.password !== password) return { valid: false, message: "Invalid password" };
    
    // Check expiration
    if(account.expires && Date.now() > account.expires) {
      return { valid: false, message: "Account expired" };
    }
    
    return { valid: true, admin: account.admin || false };
  }
  
  // Create account (admin only)
  function createAccount(username, password, expiresInDays, isAdmin = false) {
    if(!/^\d{4}$/.test(password)) {
      return { success: false, message: "Password must be 4 digits" };
    }
    
    const accounts = getAccounts();
    if(accounts[username]) {
      return { success: false, message: "Username already exists" };
    }
    
    const expires = expiresInDays > 0 ? Date.now() + (expiresInDays * 24 * 60 * 60 * 1000) : null;
    
    accounts[username] = {
      password: password,
      admin: isAdmin,
      created: Date.now(),
      expires: expires
    };
    
    saveAccounts(accounts);
    return { success: true };
  }
  
  // Delete account (admin only)
  function deleteAccount(username) {
    const accounts = getAccounts();
    if(username === "Sun") {
      return { success: false, message: "Cannot delete admin account" };
    }
    if(!accounts[username]) {
      return { success: false, message: "Account not found" };
    }
    delete accounts[username];
    saveAccounts(accounts);
    return { success: true };
  }
  
  // Get current session
  function getCurrentSession() {
    const username = localStorage.getItem(SESSION_KEY);
    const timestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);
    
    if(!username) return null;
    
    // Session expires after 24 hours
    if(timestamp && Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
      clearSession();
      return null;
    }
    
    const accounts = getAccounts();
    const account = accounts[username];
    
    if(!account) {
      clearSession();
      return null;
    }
    
    // Check account expiration
    if(account.expires && Date.now() > account.expires) {
      clearSession();
      return null;
    }
    
    return { username, admin: account.admin || false };
  }
  
  // Set current session
  function setSession(username) {
    localStorage.setItem(SESSION_KEY, username);
    localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
  }
  
  // Clear session
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_TIMESTAMP_KEY);
  }
  
  /* ===== LOGIN SCREEN ===== */
  function showLoginScreen() {
    const loginScreen = document.createElement("div");
    loginScreen.id = "ziperLoginScreen";
    loginScreen.style = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 99999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    loginScreen.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #0d1b0e 0%, #1a3a1f 100%);
        border: 2px solid #2ecc71;
        border-radius: 16px;
        padding: 40px;
        box-shadow: 0 8px 32px rgba(0,255,0,.3);
        max-width: 400px;
        width: 90%;
      ">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="
            color: #2ecc71;
            margin: 0 0 10px 0;
            font-size: 32px;
            text-shadow: 0 0 10px rgba(46,204,113,0.5);
          ">🌲 Ziper Login</h1>
          <p style="color: #7fb887; margin: 0; font-size: 14px;">v1.2.0 - Secure Access</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="
            display: block;
            color: #2ecc71;
            margin-bottom: 8px;
            font-weight: 600;
          ">Username</label>
          <input type="text" id="ziperUsername" placeholder="Enter username" style="
            width: 100%;
            padding: 12px;
            border: 2px solid #2ecc71;
            border-radius: 8px;
            background: #0d1b0e;
            color: #e0ffe0;
            font-size: 16px;
            outline: none;
          " />
        </div>
        
        <div style="margin-bottom: 25px;">
          <label style="
            display: block;
            color: #2ecc71;
            margin-bottom: 8px;
            font-weight: 600;
          ">Password (4 digits)</label>
          <input type="password" id="ziperPassword" placeholder="Enter 4-digit PIN" maxlength="4" pattern="[0-9]{4}" style="
            width: 100%;
            padding: 12px;
            border: 2px solid #2ecc71;
            border-radius: 8px;
            background: #0d1b0e;
            color: #e0ffe0;
            font-size: 16px;
            letter-spacing: 8px;
            text-align: center;
            outline: none;
          " />
        </div>
        
        <div id="ziperLoginError" style="
          color: #e74c3c;
          margin-bottom: 15px;
          text-align: center;
          min-height: 20px;
          font-size: 14px;
        "></div>
        
        <button id="ziperLoginBtn" style="
          width: 100%;
          padding: 14px;
          background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        ">Login to Ziper</button>
        
        <div style="text-align: center; margin-top: 20px; color: #7fb887; font-size: 12px;">
          Admin: Sun | Password: 6619
        </div>
      </div>
    `;
    
    document.body.appendChild(loginScreen);
    
    // Focus username input
    const usernameInput = document.getElementById("ziperUsername");
    const passwordInput = document.getElementById("ziperPassword");
    const loginBtn = document.getElementById("ziperLoginBtn");
    const errorDiv = document.getElementById("ziperLoginError");
    
    usernameInput.focus();
    
    // Only allow numbers in password
    passwordInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    });
    
    // Login handler
    function attemptLogin() {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      
      if(!username) {
        errorDiv.textContent = "Please enter username";
        return;
      }
      
      if(!/^\d{4}$/.test(password)) {
        errorDiv.textContent = "Password must be 4 digits";
        return;
      }
      
      const result = validateAccount(username, password);
      
      if(result.valid) {
        setSession(username);
        loginScreen.remove();
        loadZiperApp(result.admin);
      } else {
        errorDiv.textContent = result.message;
        passwordInput.value = "";
        passwordInput.focus();
      }
    }
    
    loginBtn.onclick = attemptLogin;
    
    // Enter key to login
    passwordInput.addEventListener("keypress", (e) => {
      if(e.key === "Enter") attemptLogin();
    });
    usernameInput.addEventListener("keypress", (e) => {
      if(e.key === "Enter") {
        passwordInput.focus();
      }
    });
  }
  
  /* ===== LOAD ZIPER APPLICATION ===== */
  function loadZiperApp(isAdmin) {
    // Insert the original Ziper.js code here
    // For now, I'll create a modified version with account management UI
    
