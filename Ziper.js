(async function(){
  if(document.getElementById("ziperRoot")) return;

  /* ===== CONFIG ===== */
  const VERSION = "v1.2.1"; // Updated version with universal account storage
  const HF_TOKEN = "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"; // Hugging Face API token
  const HF_MODEL = "HuggingFaceTB/SmolLM2-360M-Instruct"; // AI Model
  const AI_ENABLED = true; // Re-enabled with Hugging Face
  const STORAGE_HUB_URL = "https://pychamer.github.io/Ziper/storage-hub.html"; // Universal storage hub
  
  /* ===== UNIVERSAL STORAGE SYSTEM ===== */
  // This system allows accounts to work across all domains by using an iframe
  // that acts as a central storage hub
  
  let storageHub = null;
  let hubReady = false;
  let pendingRequests = new Map();
  let requestCounter = 0;
  
  function initStorageHub() {
    return new Promise((resolve) => {
      // Create hidden iframe for storage hub
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = STORAGE_HUB_URL;
      iframe.id = 'ziperStorageHub';
      
      // Listen for messages from the hub
      window.addEventListener('message', (event) => {
        if (event.source !== iframe.contentWindow) return;
        
        const { type, requestId, data, success, error } = event.data;
        
        if (type === 'PONG') {
          hubReady = true;
          resolve(iframe);
          return;
        }
        
        const pending = pendingRequests.get(requestId);
        if (pending) {
          pendingRequests.delete(requestId);
          
          if (type === 'ERROR') {
            pending.reject(new Error(error || 'Storage hub error'));
          } else {
            pending.resolve({ data, success });
          }
        }
      });
      
      // Send ping after iframe loads
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.postMessage({ type: 'PING', requestId: 0 }, '*');
          
          // Fallback timeout
          setTimeout(() => {
            if (!hubReady) {
              console.warn('Storage hub timeout - using local storage');
              resolve(null);
            }
          }, 3000);
        }, 100);
      };
      
      document.body.appendChild(iframe);
      storageHub = iframe;
    });
  }
  
  function sendToHub(type, data = null) {
    return new Promise((resolve, reject) => {
      if (!storageHub || !hubReady) {
        reject(new Error('Storage hub not ready'));
        return;
      }
      
      const requestId = ++requestCounter;
      pendingRequests.set(requestId, { resolve, reject });
      
      storageHub.contentWindow.postMessage({
        type,
        data,
        requestId
      }, '*');
      
      // Timeout after 5 seconds
      setTimeout(() => {
        if (pendingRequests.has(requestId)) {
          pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 5000);
    });
  }
  
  /* ===== ACCOUNT MANAGEMENT SYSTEM ===== */
  const ACCOUNTS_KEY = "ziperAccounts";
  const SESSION_KEY = "ziperCurrentUser";
  const SESSION_TIME_KEY = "ziperSessionTimestamp";
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  let useUniversalStorage = true; // Try to use universal storage

  // Initialize accounts with admin - now supports universal storage
  async function initAccounts() {
    try {
      if (useUniversalStorage && hubReady) {
        const response = await sendToHub('GET_ACCOUNTS');
        let accounts = response.data || {};
        
        // Ensure admin account exists
        if (!accounts.Sun) {
          accounts.Sun = {
            password: "6619",
            admin: true,
            created: Date.now(),
            expires: null
          };
          await sendToHub('SAVE_ACCOUNTS', accounts);
        }
        
        return accounts;
      }
    } catch (e) {
      console.warn('Universal storage failed, using local:', e);
      useUniversalStorage = false;
    }
    
    // Fallback to local storage
    let accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
    if (!accounts.Sun) {
      accounts.Sun = {
        password: "6619",
        admin: true,
        created: Date.now(),
        expires: null
      };
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }
    return accounts;
  }
  
  // Save accounts to storage
  async function saveAccounts(accounts) {
    try {
      if (useUniversalStorage && hubReady) {
        await sendToHub('SAVE_ACCOUNTS', accounts);
        return;
      }
    } catch (e) {
      console.warn('Universal storage save failed, using local:', e);
      useUniversalStorage = false;
    }
    
    // Fallback to local storage
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  // Get current session - now supports universal storage
  async function getCurrentSession() {
    try {
      let username, timestamp;
      
      if (useUniversalStorage && hubReady) {
        const userResponse = await sendToHub('GET_CURRENT_USER');
        username = userResponse.data;
        // For session timestamp, still use local storage as it's session-specific
        timestamp = localStorage.getItem(SESSION_TIME_KEY);
      } else {
        username = localStorage.getItem(SESSION_KEY);
        timestamp = localStorage.getItem(SESSION_TIME_KEY);
      }
      
      if (!username || !timestamp) return null;
      
      const now = Date.now();
      const sessionAge = now - parseInt(timestamp);
      
      if (sessionAge > SESSION_DURATION) {
        await logout();
        return null;
      }
      
      const accounts = await initAccounts();
      const account = accounts[username];
      
      if (!account) {
        await logout();
        return null;
      }
      
      if (account.expires && account.expires < now) {
        await logout();
        return null;
      }
      
      return { username, account };
    } catch (e) {
      console.error('Session check error:', e);
      return null;
    }
  }

  // Login function - now supports universal storage
  async function login(username, password) {
    try {
      const accounts = await initAccounts();
      const account = accounts[username];
      
      if (!account) return { success: false, error: "Invalid username" };
      if (account.password !== password) return { success: false, error: "Invalid password" };
      
      const now = Date.now();
      if (account.expires && account.expires < now) {
        return { success: false, error: "Account expired" };
      }
      
      // Save session
      if (useUniversalStorage && hubReady) {
        await sendToHub('SET_CURRENT_USER', username);
      } else {
        localStorage.setItem(SESSION_KEY, username);
      }
      localStorage.setItem(SESSION_TIME_KEY, now.toString());
      
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Logout function - now supports universal storage
  async function logout() {
    try {
      if (useUniversalStorage && hubReady) {
        await sendToHub('SET_CURRENT_USER', null);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
      localStorage.removeItem(SESSION_TIME_KEY);
    } catch (e) {
      // Fallback
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_TIME_KEY);
    }
  }

  // Create account (admin only) - now supports universal storage
  async function createAccount(username, password, expirationDays, isAdmin = false) {
    try {
      const accounts = await initAccounts();
      
      // Validate username
      username = username.trim();
      if (!username || username.length > 30) {
        return { success: false, error: "Username must be 1-30 characters" };
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return { success: false, error: "Username can only contain letters, numbers, _ and -" };
      }
      
      if (accounts[username]) {
        return { success: false, error: "Username already exists" };
      }
      
      if (!/^\d{4}$/.test(password)) {
        return { success: false, error: "Password must be exactly 4 digits" };
      }
      
      let expires = null;
      if (expirationDays && expirationDays !== "never") {
        const days = parseInt(expirationDays);
        if (isNaN(days) || days < 1 || days > 365) {
          return { success: false, error: "Expiration must be 1-365 days" };
        }
        expires = Date.now() + (days * 24 * 60 * 60 * 1000);
      }
      
      accounts[username] = {
        password,
        admin: isAdmin,
        created: Date.now(),
        expires
      };
      
      await saveAccounts(accounts);
      return { success: true };
    } catch (e) {
      return { success: false, error: "Storage error: " + e.message };
    }
  }

  // Delete account (admin only) - now supports universal storage
  async function deleteAccount(username) {
    try {
      if (username === "Sun") {
        return { success: false, error: "Cannot delete admin account" };
      }
      
      const accounts = await initAccounts();
      if (!accounts[username]) {
        return { success: false, error: "Account not found" };
      }
      
      delete accounts[username];
      await saveAccounts(accounts);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Get all accounts (admin only) - now supports universal storage
  async function getAllAccounts() {
    return await initAccounts();
  }
  
  /* ===== THEME SYSTEM ===== */
  const THEMES = {
    green: {
      name: "Matrix Green",
      primary: "#27ae60",
      secondary: "#2ecc71",
      bgDark: "#0d1b0e",
      bgLight: "#1a3a1f",
      text: "#e0ffe0",
      textMuted: "#7fb887",
      shadow: "rgba(0,255,0,.2)",
      minimized: { bg: "#1a1a2e", bgAlt: "#16213e", border: "#0f3460", btn: "#1a4d2e" }
    },
    blue: {
      name: "Ocean Blue",
      primary: "#2980b9",
      secondary: "#3498db",
      bgDark: "#0b0e1b",
      bgLight: "#1f2a3a",
      text: "#e0f0ff",
      textMuted: "#7f9db8",
      shadow: "rgba(0,100,255,.2)",
      minimized: { bg: "#1a1a2e", bgAlt: "#162138", border: "#0f2460", btn: "#1a3d4d" }
    },
    purple: {
      name: "Royal Purple",
      primary: "#8e44ad",
      secondary: "#9b59b6",
      bgDark: "#1b0b1e",
      bgLight: "#3a1f3f",
      text: "#f0e0ff",
      textMuted: "#b87fa8",
      shadow: "rgba(150,0,255,.2)",
      minimized: { bg: "#1a1a2e", bgAlt: "#21163e", border: "#300f60", btn: "#3d1a4d" }
    },
    red: {
      name: "Fire Red",
      primary: "#c0392b",
      secondary: "#e74c3c",
      bgDark: "#1b0b0d",
      bgLight: "#3a1f1f",
      text: "#ffe0e0",
      textMuted: "#b87f7f",
      shadow: "rgba(255,0,0,.2)",
      minimized: { bg: "#1a1a2e", bgAlt: "#3e1616", border: "#600f0f", btn: "#4d1a1a" }
    },
    orange: {
      name: "Sunset Orange",
      primary: "#d35400",
      secondary: "#e67e22",
      bgDark: "#1b0f0b",
      bgLight: "#3a2a1f",
      text: "#fff0e0",
      textMuted: "#b89f7f",
      shadow: "rgba(255,100,0,.2)",
      minimized: { bg: "#1a1a2e", bgAlt: "#3e2616", border: "#602f0f", btn: "#4d2a1a" }
    }
  };
  
  let currentTheme = localStorage.getItem("ziperTheme") || "green";

  /* ===== ROOT (PROTECTED) ===== */
  const root = document.createElement("div");
  root.id = "ziperRoot";
  root.setAttribute("contenteditable","false");
  root.style = `
    position:fixed;
    bottom:20px;
    right:20px;
    background:linear-gradient(135deg, #0d1b0e 0%, #1a3a1f 100%);
    color:#e0ffe0;
    padding:0;
    border-radius:12px;
    z-index:9999999;
    width:320px;
    box-shadow:0 6px 24px rgba(0,255,0,.2);
    font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
    user-select:none;
    pointer-events:auto;
    border:2px solid #2ecc71;
  `;

  root.innerHTML = `
    <style>
      #ziperRoot *{box-sizing:border-box;}
      #ziperRoot .header{
        background:linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
        padding:10px 12px;
        border-radius:10px 10px 0 0;
        display:flex;
        justify-content:space-between;
        align-items:center;
        border-bottom:2px solid #27ae60;
      }
      #ziperRoot .header h3{
        margin:0;
        font-size:16px;
        font-weight:bold;
        color:#fff;
        text-shadow:0 2px 4px rgba(0,0,0,.3);
      }
      #ziperRoot .beta-badge{
        background:#f39c12;
        color:#000;
        padding:3px 8px;
        border-radius:12px;
        font-size:11px;
        font-weight:bold;
        letter-spacing:1px;
      }
      #ziperRoot .tabs{
        display:flex;
        background:#0a150b;
        border-bottom:1px solid #27ae60;
      }
      #ziperRoot .tab{
        flex:1;
        padding:10px 8px;
        text-align:center;
        cursor:pointer;
        color:#7fb887;
        border:none;
        background:transparent;
        font-size:13px;
        transition:all .2s;
        border-bottom:3px solid transparent;
      }
      #ziperRoot .tab:hover{
        background:rgba(46,204,113,.1);
        color:#2ecc71;
      }
      #ziperRoot .tab.active{
        color:#2ecc71;
        border-bottom-color:#2ecc71;
        background:rgba(46,204,113,.15);
      }
      #ziperRoot .content{
        padding:12px;
        height:260px;
        overflow-y:auto;
      }
      #ziperRoot .content::-webkit-scrollbar{width:8px;}
      #ziperRoot .content::-webkit-scrollbar-track{background:#0a150b;}
      #ziperRoot .content::-webkit-scrollbar-thumb{background:#27ae60;border-radius:4px;}
      #ziperRoot .tab-content{display:none;}
      #ziperRoot .tab-content.active{display:block;}
      #ziperRoot .feature-btn{
        width:100%;
        padding:10px;
        margin:6px 0;
        background:#1a3a1f;
        border:2px solid #27ae60;
        border-radius:6px;
        color:#2ecc71;
        cursor:pointer;
        font-size:13px;
        transition:all .2s;
        display:flex;
        align-items:center;
        gap:8px;
      }
      #ziperRoot .feature-btn:hover{
        background:#27ae60;
        color:#fff;
        transform:translateY(-2px);
        box-shadow:0 4px 12px rgba(46,204,113,.3);
      }
      #ziperRoot .chat-input{
        width:100%;
        padding:12px;
        background:#0a150b;
        border:2px solid #27ae60;
        border-radius:8px;
        color:#e0ffe0;
        font-size:14px;
        margin-bottom:10px;
      }
      #ziperRoot .chat-input:focus{
        outline:none;
        border-color:#2ecc71;
        box-shadow:0 0 8px rgba(46,204,113,.3);
      }
      #ziperRoot .send-btn{
        width:100%;
        padding:12px;
        background:#27ae60;
        border:none;
        border-radius:8px;
        color:#fff;
        font-weight:bold;
        cursor:pointer;
        transition:all .2s;
      }
      #ziperRoot .send-btn:hover{
        background:#2ecc71;
        transform:translateY(-2px);
        box-shadow:0 4px 12px rgba(46,204,113,.4);
      }
      #ziperRoot .chat-response{
        background:#0a150b;
        padding:12px;
        border-radius:8px;
        margin-top:12px;
        border-left:4px solid #27ae60;
        color:#c9e4ce;
        line-height:1.6;
      }
      #ziperRoot .close-btn{
        background:#27ae60;
        color:#fff;
        border:none;
        padding:8px;
        border-radius:6px;
        cursor:pointer;
        font-size:14px;
        font-weight:bold;
      }
      #ziperRoot .close-btn:hover{
        opacity:0.85;
      }
      #ziperRoot .theme-btn{
        width:100%;
        padding:10px;
        background:#1a3a1f;
        border:2px solid #27ae60;
        color:#2ecc71;
        border-radius:8px;
        cursor:pointer;
        font-size:14px;
        transition:all .2s;
        text-align:left;
      }
      #ziperRoot .theme-btn:hover{
        background:#27ae60;
        color:#fff;
        transform:translateX(4px);
      }
      #ziperRoot .theme-btn.active{
        background:#27ae60;
        color:#fff;
        border-color:#2ecc71;
        font-weight:bold;
      }
      #ziperRoot .minimize-btn{
        background:#27ae60;
        color:#fff;
        border:none;
        padding:8px;
        border-radius:6px;
        cursor:pointer;
        font-size:14px;
        font-weight:bold;
        margin-right:8px;
      }
      #ziperRoot .minimize-btn:hover{
        opacity:0.85;
      }
      #ziperRoot .header > div{
        display:flex;
        align-items:center;
      }
      #ziperRoot .sub-tabs{
        display:flex;
        background:#0a150b;
        border-radius:8px;
        margin-bottom:12px;
        padding:4px;
        gap:4px;
      }
      #ziperRoot .sub-tab{
        flex:1;
        padding:8px;
        text-align:center;
        cursor:pointer;
        color:#7fb887;
        border:none;
        background:transparent;
        font-size:13px;
        border-radius:6px;
        transition:all .2s;
      }
      #ziperRoot .sub-tab:hover{
        background:rgba(46,204,113,.1);
        color:#2ecc71;
      }
      #ziperRoot .sub-tab.active{
        color:#fff;
        background:#27ae60;
      }
      #ziperRoot .sub-content{
        max-height:280px;
        overflow-y:auto;
        padding-right:4px;
      }
      #ziperRoot .sub-content::-webkit-scrollbar{width:6px;}
      #ziperRoot .sub-content::-webkit-scrollbar-track{background:#0a150b;border-radius:3px;}
      #ziperRoot .sub-content::-webkit-scrollbar-thumb{background:#27ae60;border-radius:3px;}
      #ziperRoot .sub-tab-content{display:none;}
      #ziperRoot .sub-tab-content.active{display:block;}
      #ziperRoot .custom-textarea{
        width:100%;
        height:200px;
        padding:12px;
        background:#0a150b;
        border:2px solid #27ae60;
        border-radius:8px;
        color:#2ecc71;
        font-family:monospace;
        font-size:13px;
        resize:vertical;
        margin-bottom:10px;
      }
      #ziperRoot .custom-textarea:focus{
        outline:none;
        border-color:#2ecc71;
        box-shadow:0 0 8px rgba(46,204,113,.3);
      }
      #ziperRoot .warning-box{
        background:rgba(243,156,18,.1);
        border:2px solid #f39c12;
        border-radius:8px;
        padding:10px;
        margin-bottom:12px;
        color:#f39c12;
        font-size:12px;
        line-height:1.5;
      }
      #ziperRoot .run-btn{
        width:100%;
        padding:12px;
        background:#27ae60;
        border:none;
        border-radius:8px;
        color:#fff;
        font-weight:bold;
        cursor:pointer;
        transition:all .2s;
        font-size:14px;
      }
      #ziperRoot .run-btn:hover{
        background:#2ecc71;
        transform:translateY(-2px);
        box-shadow:0 4px 12px rgba(46,204,113,.4);
      }
    </style>
    <div class="header">
      <h3>🌲 Ziper <span class="beta-badge">BETA</span></h3>
      <div>
        <button class="minimize-btn" id="minimizeWidget">−</button>
        <button class="close-btn" id="closeWidget">✕</button>
      </div>
    </div>
    <div class="tabs">
      <button class="tab ${session ? 'active' : ''}" data-tab="chat">💬 Chat</button>
      <button class="tab" data-tab="features">🔧 Features</button>
      <button class="tab" data-tab="custom">⚡ Custom</button>
      <button class="tab ${!session ? 'active' : ''}" data-tab="settings">⚙️ Settings</button>
    </div>
    <div class="content">
      <div class="tab-content ${session ? 'active' : ''}" id="chat-tab">
        <textarea class="chat-input" id="chatInput" placeholder="Ask AI anything..." rows="3"></textarea>
        <button class="send-btn" id="sendChat">🚀 Send Message</button>
        <div id="chatResponse"></div>
      </div>
      <div class="tab-content" id="features-tab">
        <div class="sub-tabs">
          <button class="sub-tab active" data-subtab="basic">📌 Basic</button>
          <button class="sub-tab" data-subtab="tools">🛠️ Tools</button>
          <button class="sub-tab" data-subtab="fun">🎉 Fun</button>
          <button class="sub-tab" data-subtab="screen">🖥️ Screen</button>
          <button class="sub-tab" data-subtab="games">🎮 Games</button>
        </div>
        <div class="sub-content">
          <div class="sub-tab-content active" id="basic-subtab">
            <button class="feature-btn" id="rb">🌈 Rainbow Mode</button>
            <button class="feature-btn" id="hf">📜 History Flooder</button>
            <button class="feature-btn" id="ed">✏️ Edit Page Mode</button>
            <button class="feature-btn" id="tr">🌐 Translate Page</button>
            <button class="feature-btn" id="vd">🎥 Video Speed Toggle</button>
          </div>
          <div class="sub-tab-content" id="tools-subtab">
            <button class="feature-btn" id="ac">🖱️ AutoClicker</button>
            <button class="feature-btn" id="td">🎭 Tab Disguise</button>
            <button class="feature-btn" id="bg">🎮 Blooket GUI</button>
            <button class="feature-btn" id="tc">⏱️ Timer Controller</button>
          </div>
          <div class="sub-tab-content" id="fun-subtab">
            <button class="feature-btn" id="spin">🌀 Spin Spin</button>
            <button class="feature-btn" id="minecraft">🧱 Minecraft Mode</button>
            <button class="feature-btn" id="moveanything">🖐️ Move Anything</button>
          </div>
          <div class="sub-tab-content" id="screen-subtab">
            <button class="feature-btn" id="blur">💫 Blur Screen</button>
            <button class="feature-btn" id="grayscale">⚫ Grayscale</button>
            <button class="feature-btn" id="sepia">🟤 Sepia Tone</button>
            <button class="feature-btn" id="huerotate">🌈 Hue Rotate</button>
            <button class="feature-btn" id="brightness">☀️ Brightness</button>
            <button class="feature-btn" id="contrast">🔆 High Contrast</button>
          </div>
          <div class="sub-tab-content" id="games-subtab">
            <button class="feature-btn" id="breakout">🧱 Breakout</button>
            <button class="feature-btn" id="snake">🐍 Snake Game</button>
            <button class="feature-btn" id="pong">🏓 Pong</button>
            <button class="feature-btn" id="tetris">🟦 Tetris</button>
            <button class="feature-btn" id="spaceshooter">🚀 Space Shooter</button>
          </div>
        </div>
      </div>
      <div class="tab-content" id="custom-tab">
        <textarea class="custom-textarea" id="customJS" placeholder="// Enter your custom JavaScript code here&#10;// Example:&#10;alert('Hello from Ziper!');&#10;&#10;// Change background color&#10;document.body.style.backgroundColor = '#ff0000';&#10;&#10;// Add custom animations&#10;// document.body.style.transition = 'all 2s';"></textarea>
        <button class="run-btn" id="runCustomJS">▶️ Run Custom Code</button>
        <div id="customResponse"></div>
      </div>
      <div class="tab-content ${!session ? 'active' : ''}" id="settings-tab">
        <div style="color:#7fb887;line-height:1.8;">
          <div id="loginSection">
            <!-- Login form will be shown if not logged in, account info if logged in -->
          </div>
          
          <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #27ae60;">
            <p><strong style="color:#2ecc71;">Version:</strong> v1.2.0 RELEASE</p>
            <p><strong style="color:#2ecc71;">API:</strong> Hugging Face AI</p>
            <p><strong style="color:#2ecc71;">Model:</strong> SmolLM2-360M</p>
            <p style="margin-top:12px;font-size:12px;color:#2ecc71;">✅ AI Chat enabled</p>
            <p style="margin-top:4px;font-size:12px;color:#2ecc71;">✅ Custom JS runner</p>
            <p style="margin-top:4px;font-size:12px;color:#2ecc71;">✅ Fun effects & games</p>
            <p style="margin-top:4px;font-size:12px;color:#2ecc71;">✅ Screen filters</p>
            <p style="margin-top:4px;font-size:12px;color:#2ecc71;">✅ Login system</p>
          </div>
          
          <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #27ae60;">
            <p style="margin-bottom:12px;"><strong style="color:#2ecc71;">🎨 Theme:</strong></p>
            <div id="themeSelector" style="display:flex;flex-direction:column;gap:8px;">
              <button class="theme-btn" data-theme="green">🌲 Matrix Green</button>
              <button class="theme-btn" data-theme="blue">🌊 Ocean Blue</button>
              <button class="theme-btn" data-theme="purple">👑 Royal Purple</button>
              <button class="theme-btn" data-theme="red">🔥 Fire Red</button>
              <button class="theme-btn" data-theme="orange">🌅 Sunset Orange</button>
            </div>
          </div>
          
          <div id="adminPanel" style="display:none;">
            <div style="padding-top:16px;border-top:1px solid #27ae60;">
              <p style="margin-bottom:12px;"><strong style="color:#2ecc71;">👑 Admin Panel</strong></p>
              
              <div style="background:#1a3a1f;padding:12px;border-radius:8px;margin-bottom:12px;">
                <p style="color:#2ecc71;font-weight:bold;font-size:13px;margin-bottom:8px;">Create Account</p>
                <input type="text" id="newUsername" placeholder="Username" style="width:100%;padding:8px;margin:4px 0;background:#0d1b0e;border:1px solid #27ae60;border-radius:4px;color:#e0ffe0;font-size:12px;">
                <input type="text" id="newPassword" placeholder="4-digit PIN" maxlength="4" pattern="[0-9]*" inputmode="numeric" style="width:100%;padding:8px;margin:4px 0;background:#0d1b0e;border:1px solid #27ae60;border-radius:4px;color:#e0ffe0;font-size:12px;">
                <input type="number" id="newExpDays" placeholder="Expiration days (1-365 or leave empty for never)" min="1" max="365" style="width:100%;padding:8px;margin:4px 0;background:#0d1b0e;border:1px solid #27ae60;border-radius:4px;color:#e0ffe0;font-size:12px;">
                <button id="createAccountBtn" style="width:100%;padding:8px;margin-top:8px;background:#27ae60;border:none;border-radius:4px;color:#fff;cursor:pointer;font-size:12px;">➕ Create Account</button>
                <div id="createAccountMsg" style="margin-top:8px;font-size:11px;display:none;"></div>
              </div>
              
              <div style="background:#1a3a1f;padding:12px;border-radius:8px;">
                <p style="color:#2ecc71;font-weight:bold;font-size:13px;margin-bottom:8px;">Accounts</p>
                <div id="accountsList" style="max-height:200px;overflow-y:auto;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  // Async initialization function
  (async function initZiper() {
    // Initialize storage hub
    try {
      await initStorageHub();
      console.log('Ziper: Universal storage initialized');
    } catch (e) {
      console.warn('Ziper: Using local storage only');
      useUniversalStorage = false;
    }

    // Check session
    const session = await getCurrentSession();

    /* ===== SHARED STATE ===== */
    let rbInt = null; // Rainbow mode interval

    /* ===== TAB SWITCHING ===== */
    const tabs = root.querySelectorAll('.tab');
    const tabContents = root.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.onclick = () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // If not logged in and trying to access non-settings tab, redirect to settings
        if (!session && targetTab !== 'settings') {
          tabs.forEach(t => t.classList.remove('active'));
          tabContents.forEach(tc => tc.classList.remove('active'));
        root.querySelector('[data-tab="settings"]').classList.add('active');
        root.querySelector('#settings-tab').classList.add('active');
        
        // Show message
        const loginError = root.querySelector('#loginError');
        if (loginError) {
          loginError.textContent = "⚠️ Please login to access this feature";
          loginError.style.display = "block";
          setTimeout(() => loginError.style.display = "none", 3000);
        }
        return;
      }
      
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));
      tab.classList.add('active');
      root.querySelector(`#${targetTab}-tab`).classList.add('active');
    };
  });

  /* ===== SUB-TAB SWITCHING ===== */
  const subTabs = root.querySelectorAll('.sub-tab');
  const subTabContents = root.querySelectorAll('.sub-tab-content');
  
  subTabs.forEach(subTab => {
    subTab.onclick = () => {
      subTabs.forEach(st => st.classList.remove('active'));
      subTabContents.forEach(stc => stc.classList.remove('active'));
      subTab.classList.add('active');
      const targetSubTab = subTab.getAttribute('data-subtab');
      root.querySelector(`#${targetSubTab}-subtab`).classList.add('active');
    };
  });

  /* ===== CLOSE WIDGET ===== */
  root.querySelector("#closeWidget").onclick = () => {
    if(rbInt) clearInterval(rbInt);
    root.remove();
  };

  /* ===== MINIMIZE/MAXIMIZE WITH CTRL+R AND BUTTON ===== */
  let isMinimized = false;
  let originalContent = null;
  
  // Toggle function for minimize/maximize
  const toggleMinimize = () => {
    const contentDiv = root.querySelector(".content");
    const tabsDiv = root.querySelector(".tabs");
    const minimizeBtn = root.querySelector("#minimizeWidget");
    const closeBtn = root.querySelector("#closeWidget");
    const headerDiv = root.querySelector(".header");
    const titleH3 = root.querySelector(".header h3");
    const betaBadge = root.querySelector(".beta-badge");
    
    if(!isMinimized) {
      // Minimize: Hide content and tabs, change to dark blue theme with "ZP"
      originalContent = contentDiv.style.display;
      contentDiv.style.display = "none";
      tabsDiv.style.display = "none";
      root.style.width = "auto";
      minimizeBtn.textContent = "+";
      
      // Apply dark blue minimized theme
      const theme = THEMES[currentTheme];
      root.style.background = `linear-gradient(135deg, ${theme.minimized.bg} 0%, ${theme.minimized.bgAlt} 100%)`;
      root.style.border = `2px solid ${theme.minimized.border}`;
      root.style.boxShadow = "0 2px 8px rgba(0,0,0,.3)";
      root.style.opacity = "0.7";
      headerDiv.style.background = `linear-gradient(90deg, ${theme.minimized.border} 0%, ${theme.minimized.bgAlt} 100%)`;
      headerDiv.style.borderBottom = `2px solid ${theme.minimized.border}`;
      
      // Make buttons smaller and use theme's minimized button color
      minimizeBtn.style.background = theme.minimized.btn;
      minimizeBtn.style.padding = "4px 8px";
      minimizeBtn.style.fontSize = "12px";
      closeBtn.style.background = theme.minimized.btn;
      closeBtn.style.padding = "4px 8px";
      closeBtn.style.fontSize = "10px";
      
      // Change title to "ZP" and hide BETA badge
      titleH3.textContent = "ZP";
      if(betaBadge) betaBadge.style.display = "none";
      
      isMinimized = true;
    } else {
      // Maximize: Show content and tabs, restore current theme with full title
      contentDiv.style.display = originalContent || "block";
      tabsDiv.style.display = "flex";
      root.style.width = "380px";
      minimizeBtn.textContent = "−";
      
      // Restore current theme
      const theme = THEMES[currentTheme];
      root.style.background = `linear-gradient(135deg, ${theme.bgDark} 0%, ${theme.bgLight} 100%)`;
      root.style.border = `2px solid ${theme.secondary}`;
      root.style.boxShadow = `0 8px 32px ${theme.shadow}`;
      root.style.opacity = "1";
      headerDiv.style.background = `linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
      headerDiv.style.borderBottom = `2px solid ${theme.primary}`;
      
      // Restore button colors and sizes
      minimizeBtn.style.background = theme.primary;
      minimizeBtn.style.padding = "8px";
      minimizeBtn.style.fontSize = "14px";
      closeBtn.style.background = theme.primary;
      closeBtn.style.padding = "8px";
      closeBtn.style.fontSize = "14px";
      
      // Restore original title with BETA badge
      titleH3.innerHTML = '🌲 Ziper <span class="beta-badge">BETA</span>';
      
      isMinimized = false;
    }
  };
  
  // Minimize button click handler
  root.querySelector("#minimizeWidget").onclick = toggleMinimize;
  
  // Keyboard shortcut: Ctrl+R
  document.addEventListener("keydown", (e) => {
    if(e.ctrlKey && e.key.toLowerCase() === "r") {
      e.preventDefault();
      toggleMinimize();
    }
  });

  /* ===== THEME SYSTEM ===== */
  const applyTheme = (themeName) => {
    const theme = THEMES[themeName];
    if(!theme) return;
    
    currentTheme = themeName;
    localStorage.setItem("ziperTheme", themeName);
    
    // Update root widget styles
    root.style.background = `linear-gradient(135deg, ${theme.bgDark} 0%, ${theme.bgLight} 100%)`;
    root.style.border = `2px solid ${theme.secondary}`;
    root.style.boxShadow = `0 8px 32px ${theme.shadow}`;
    root.style.color = theme.text;
    
    // Update header
    const headerDiv = root.querySelector(".header");
    if(headerDiv && !isMinimized) {
      headerDiv.style.background = `linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
      headerDiv.style.borderBottom = `2px solid ${theme.primary}`;
    }
    
    // Update all dynamic color references
    root.querySelectorAll(".tab.active, .sub-tab.active").forEach(el => {
      el.style.color = theme.secondary;
      el.style.borderBottomColor = theme.secondary;
    });
    
    root.querySelectorAll(".tab, .sub-tab").forEach(el => {
      el.style.color = theme.textMuted;
    });
    
    root.querySelectorAll(".feature-btn, .send-btn, .execute-btn").forEach(btn => {
      if(btn.classList.contains("feature-btn") || btn.classList.contains("execute-btn")) {
        btn.style.background = theme.bgLight;
        btn.style.borderColor = theme.primary;
        btn.style.color = theme.secondary;
      } else if(btn.classList.contains("send-btn")) {
        btn.style.background = theme.primary;
      }
    });
    
    // Update theme buttons active state
    root.querySelectorAll(".theme-btn").forEach(btn => {
      if(btn.getAttribute("data-theme") === themeName) {
        btn.classList.add("active");
        btn.style.background = theme.primary;
        btn.style.borderColor = theme.secondary;
      } else {
        btn.classList.remove("active");
        btn.style.background = theme.bgLight;
        btn.style.borderColor = theme.primary;
      }
    });
    
    // Update minimize and close button colors to match theme (only when not minimized)
    if(!isMinimized) {
      const minimizeBtn = root.querySelector("#minimizeWidget");
      const closeBtn = root.querySelector("#closeWidget");
      if(minimizeBtn) {
        minimizeBtn.style.background = theme.primary;
      }
      if(closeBtn) {
        closeBtn.style.background = theme.primary;
      }
    }
  };
  
  // Theme selector event handlers
  root.querySelectorAll(".theme-btn").forEach(btn => {
    btn.onclick = () => {
      const themeName = btn.getAttribute("data-theme");
      applyTheme(themeName);
    };
  });
  
  // Apply saved theme on load
  applyTheme(currentTheme);

  /* ===== USER SESSION & ADMIN PANEL ===== */
  // Render login section based on session state
  const loginSection = root.querySelector("#loginSection");
  
  if (session) {
    // User is logged in - show account info
    loginSection.innerHTML = `
      <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #27ae60;">
        <p style="margin-bottom:12px;"><strong style="color:#2ecc71;">🔐 Account</strong></p>
        <p style="margin-bottom:8px;"><strong style="color:#2ecc71;">👤 Logged in as:</strong> <span id="currentUserDisplay">${session.username}${session.account.admin ? " (Admin)" : ""}</span></p>
        <button class="theme-btn" id="logoutBtn" style="background:#c0392b;">🚪 Logout</button>
      </div>
    `;
    
    // Logout handler
    root.querySelector("#logoutBtn").onclick = async () => {
      if(confirm("Are you sure you want to logout?")) {
        await logout();
        if(rbInt) clearInterval(rbInt);
        root.remove();
        location.reload();
      }
    };
  } else {
    // User is not logged in - show login form
    loginSection.innerHTML = `
      <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #27ae60;">
        <p style="margin-bottom:12px;"><strong style="color:#2ecc71;">🔐 Login</strong></p>
        <input type="text" id="loginUsername" placeholder="Username" autocomplete="off" style="width:100%;padding:10px;margin:6px 0;background:#1a3a1f;border:2px solid #27ae60;border-radius:6px;color:#e0ffe0;font-size:13px;">
        <input type="password" id="loginPassword" placeholder="4-digit PIN" maxlength="4" pattern="[0-9]*" inputmode="numeric" style="width:100%;padding:10px;margin:6px 0;background:#1a3a1f;border:2px solid #27ae60;border-radius:6px;color:#e0ffe0;font-size:13px;">
        <div id="loginError" style="background:#3a1f1f;border:2px solid #e74c3c;color:#ffe0e0;padding:8px;border-radius:6px;margin:6px 0;font-size:12px;display:none;"></div>
        <button id="loginBtn" style="width:100%;padding:10px;margin-top:6px;background:linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);border:none;border-radius:6px;color:#fff;font-size:13px;font-weight:bold;cursor:pointer;">🔐 Login</button>
      </div>
    `;
    
    const usernameInput = root.querySelector("#loginUsername");
    const passwordInput = root.querySelector("#loginPassword");
    const loginBtn = root.querySelector("#loginBtn");
    const errorDiv = root.querySelector("#loginError");
    
    // Handle login
    const attemptLogin = async () => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      
      if (!username) {
        errorDiv.textContent = "❌ Please enter username";
        errorDiv.style.display = "block";
        return;
      }
      
      if (!/^\d{4}$/.test(password)) {
        errorDiv.textContent = "❌ PIN must be exactly 4 digits";
        errorDiv.style.display = "block";
        return;
      }
      
      const result = await login(username, password);
      
      if (result.success) {
        location.reload();
      } else {
        errorDiv.textContent = "❌ " + result.error;
        errorDiv.style.display = "block";
        passwordInput.value = "";
      }
    };
    
    loginBtn.onclick = attemptLogin;
    
    // Filter non-numeric input in PIN field
    passwordInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
    
    // Handle Enter key
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") attemptLogin();
    });
    usernameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") passwordInput.focus();
    });
  }
  
  // Show admin panel if user is admin
  if(session && session.account.admin) {
    const adminPanel = root.querySelector("#adminPanel");
    adminPanel.style.display = "block";
    
    // HTML escape helper
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };
    
    // Format date helper
    const formatDate = (timestamp) => {
      if(!timestamp) return "Never";
      const d = new Date(timestamp);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    };
    
    // Message timeout tracker
    let msgTimeout = null;
    
    // Show message helper
    const showMessage = (msgDiv, text, isError) => {
      if(msgTimeout) clearTimeout(msgTimeout);
      msgDiv.textContent = text;
      msgDiv.style.color = isError ? "#e74c3c" : "#2ecc71";
      msgDiv.style.display = "block";
      msgTimeout = setTimeout(() => msgDiv.style.display = "none", 3000);
    };
    
    // Refresh accounts list
    const refreshAccountsList = async () => {
      const accounts = await getAllAccounts();
      const accountsList = root.querySelector("#accountsList");
      const now = Date.now();
      
      let html = "";
      for(const username in accounts) {
        const acc = accounts[username];
        const isExpired = acc.expires && acc.expires < now;
        const status = isExpired ? "❌ Expired" : "✅ Active";
        const statusColor = isExpired ? "#e74c3c" : "#2ecc71";
        const canDelete = username !== "Sun";
        const safeUsername = escapeHtml(username);
        
        html += `
          <div style="background:#0d1b0e;padding:10px;margin:6px 0;border-radius:6px;border:1px solid #27ae60;font-size:11px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <strong style="color:#2ecc71;">${safeUsername}${acc.admin ? " 👑" : ""}</strong>
              <span style="color:${statusColor};font-size:10px;">${status}</span>
            </div>
            <div style="color:#7fb887;font-size:10px;line-height:1.4;">
              Created: ${escapeHtml(formatDate(acc.created))}<br>
              Expires: ${escapeHtml(formatDate(acc.expires))}
            </div>
            ${canDelete ? `<button class="delete-account-btn" data-username="${escapeHtml(username)}" style="width:100%;padding:6px;margin-top:8px;background:#c0392b;border:none;border-radius:4px;color:#fff;cursor:pointer;font-size:10px;">🗑️ Delete</button>` : ""}
          </div>
        `;
      }
      
      accountsList.innerHTML = html || "<p style='color:#7fb887;font-size:11px;text-align:center;'>No accounts</p>";
      
      // Add delete handlers
      accountsList.querySelectorAll(".delete-account-btn").forEach(btn => {
        btn.onclick = async () => {
          const username = btn.getAttribute("data-username");
          if(confirm(`Delete account "${username}"?`)) {
            const result = await deleteAccount(username);
            const msgDiv = root.querySelector("#createAccountMsg");
            if(result.success) {
              showMessage(msgDiv, "✅ Account deleted", false);
              refreshAccountsList();
            } else {
              showMessage(msgDiv, "❌ " + result.error, true);
            }
          }
        };
      });
    };
    
    
    // Create account handler
    const newPasswordInput = root.querySelector("#newPassword");
    
    // Filter non-numeric input in PIN field
    newPasswordInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
    
    root.querySelector("#createAccountBtn").onclick = async () => {
      const usernameInput = root.querySelector("#newUsername");
      const passwordInput = root.querySelector("#newPassword");
      const expDaysInput = root.querySelector("#newExpDays");
      const msgDiv = root.querySelector("#createAccountMsg");
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      const expDays = expDaysInput.value.trim() || "never";
      
      if(!username) {
        showMessage(msgDiv, "❌ Username required", true);
        return;
      }
      
      const result = await createAccount(username, password, expDays);
      
      if(result.success) {
        showMessage(msgDiv, "✅ Account created successfully", false);
        usernameInput.value = "";
        passwordInput.value = "";
        expDaysInput.value = "";
        refreshAccountsList();
      } else {
        showMessage(msgDiv, "❌ " + result.error, true);
      }
    };
    
    // Initial load of accounts
    refreshAccountsList();
  }

  /* ===== AI CHAT WITH HUGGING FACE ===== */
  root.querySelector("#sendChat").onclick = async () => {
    const input = root.querySelector("#chatInput");
    const responseDiv = root.querySelector("#chatResponse");
    const q = input.value.trim();
    if(!q) return;

    responseDiv.innerHTML = '<div class="chat-response">🤔 Thinking...</div>';

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const res = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + HF_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: q,
          parameters: {max_new_tokens: 150, temperature: 0.7}
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if(!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if(res.status === 503 || errorData.error?.includes("loading")) {
          responseDiv.innerHTML = '<div class="chat-response" style="border-left-color:#f39c12;">⏳ Model is loading... This can take 20-30 seconds.<br><br>Please try again in a moment.</div>';
          return;
        }
        if(res.status === 401 || res.status === 403) {
          throw new Error("Authentication failed. Token may be invalid.");
        }
        throw new Error(`HTTP ${res.status}: ${errorData.error || res.statusText}`);
      }

      const data = await res.json();
      let reply = "";
      if(Array.isArray(data) && data[0]?.generated_text) {
        reply = data[0].generated_text.replace(q,"").trim();
      } else if(data.generated_text) {
        reply = data.generated_text.replace(q,"").trim();
      } else {
        reply = "No response generated";
      }
      
      responseDiv.innerHTML = '<div class="chat-response">' + escapeHtml(reply || "No reply") + '</div>';
    } catch(e) {
      let errorMsg = e.message;
      if(e.name === "AbortError") {
        errorMsg = "Request timed out. The model may be loading. Please try again.";
      }
      responseDiv.innerHTML = '<div class="chat-response" style="border-left-color:#e74c3c;">❌ AI Error:<br>' + escapeHtml(errorMsg) + '</div>';
    }
  };

  // Helper to escape HTML (prevent XSS)
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /* ===== RAINBOW MODE ===== */
  root.querySelector("#rb").onclick = () => {
    if(rbInt) {
      clearInterval(rbInt);
      rbInt = null;
      document.body.style.backgroundColor = "";
      return;
    }
    const colors = ["#ff6b6b","#feca57","#48dbfb","#1dd1a1","#5f27cd","#ff9ff3"];
    let i = 0;
    rbInt = setInterval(()=>{document.body.style.backgroundColor = colors[i++ % colors.length];},1000);
  };

  /* ===== HISTORY FLOOD ===== */
  root.querySelector("#hf").onclick = () => {
    const n = +prompt("History flood amount:");
    if(!n) return;
    const x = location.href;
    for(let i=1;i<=n;i++) history.pushState(0,0,i===n?x:i.toString());
    alert("✅ History flood successful!");
  };

  /* ===== EDIT PAGE (LOCK ZIPER) ===== */
  root.querySelector("#ed").onclick = () => {
    const on = document.body.contentEditable !== "true";
    document.body.contentEditable = on ? "true" : "false";
    document.designMode = on ? "on" : "off";
    root.setAttribute("contenteditable","false");
    root.style.userSelect = "none";
    root.style.pointerEvents = "auto";
    root.querySelectorAll("*").forEach(el => {el.contentEditable="false";el.style.userSelect="none";});
  };

  /* ===== TRANSLATE ===== */
  root.querySelector("#tr").onclick = () => {
    window.open("https://translate.google.com/translate?u="+encodeURIComponent(location.href));
  };

  /* ===== VIDEO SPEED ===== */
  root.querySelector("#vd").onclick = () => {
    document.querySelectorAll("video").forEach(v => {v.playbackRate = v.playbackRate===1 ? 2 : 1;});
  };

  /* ===== AUTOCLICKER (from TheRealMrGamz/Bookmarklets) ===== */
  root.querySelector("#ac").onclick = () => {
    if(!window.ziperClick){
      window.ziperClick = true;
      document.body.style.cursor = 'crosshair';
      const cps = prompt('AutoClicker CPS: (1-200 recommended)');
      if(!cps || isNaN(cps)){
        alert('Invalid CPS value. Try again.');
        window.ziperClick = false;
        document.body.style.cursor = 'default';
        return;
      }
      const cpsNum = parseFloat(cps);
      if(cpsNum < 1 || cpsNum > 1000){
        alert('CPS must be between 1 and 1000 for safety.');
        window.ziperClick = false;
        document.body.style.cursor = 'default';
        return;
      }
      alert(`AutoClicker activated at ${cpsNum} CPS! Press [Ctrl+E] to stop.`);
      
      let x = 0, y = 0;
      const moveHandler = e => {x = e.clientX; y = e.clientY;};
      const keyHandler = e => {
        if(e.key === 'e' && e.ctrlKey){
          alert('AutoClicker deactivated!');
          clearInterval(window.ziperClickInt);
          document.removeEventListener('mousemove', moveHandler);
          document.removeEventListener('keydown', keyHandler);
          window.ziperClick = false;
          document.body.style.cursor = 'default';
        }
      };
      
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('keydown', keyHandler);
      
      window.ziperClickInt = setInterval(() => {
        const el = document.elementFromPoint(x, y);
        if(el) el.click();
      }, 1000/cpsNum);
    }
  };

  /* ===== TAB DISGUISE (from TheRealMrGamz/Bookmarklets) ===== */
  root.querySelector("#td").onclick = () => {
    function gcloak() {
      let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png';
      document.title = 'My Drive - Google Drive';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    gcloak();
    setInterval(gcloak, 1000);
    alert('✅ Tab disguised as Google Drive!');
  };

  /* ===== BLOOKET GUI (from Zip-On/Zips-Blooket-Hacks-And-Cheats-GUI) ===== */
  root.querySelector("#bg").onclick = () => {
    const script = document.createElement('script');
    script.src = 'https://raw.githubusercontent.com/Zip-On/Zips-Blooket-Hacks-And-Cheats-GUI/main/Gui.js';
    document.body.appendChild(script);
  };

  /* ===== TIMER CONTROLLER (inspired by Greasyfork script) ===== */
  root.querySelector("#tc").onclick = () => {
    const speed = prompt('Video speed multiplier (0.1-16):', '2');
    if(!speed || isNaN(speed)) return;
    const speedNum = parseFloat(speed);
    if(speedNum < 0.1 || speedNum > 16){
      alert('Speed must be between 0.1 and 16');
      return;
    }
    
    // Speed up all videos
    document.querySelectorAll('video').forEach(v => {
      v.playbackRate = speedNum;
    });
    
    // Skip ads and intros
    document.querySelectorAll('.ytp-ad-skip-button, .ytp-skip-ad-button').forEach(btn => btn.click());
    
    alert(`⏱️ Videos set to ${speedNum}x speed!`);
  };

  /* ===== FUN FEATURES ===== */
  
  /* SPIN SPIN - Page rotation effect */
  root.querySelector("#spin").onclick = () => {
    if(window.ziperSpinInterval) {
      clearInterval(window.ziperSpinInterval);
      window.ziperSpinInterval = null;
      document.body.style.transform = '';
      return;
    }
    let deg = 0;
    window.ziperSpinInterval = setInterval(() => {
      deg = (deg + 2) % 360;
      document.body.style.transform = `rotate(${deg}deg)`;
    }, 20);
  };

  /* MINECRAFT MODE - Pixelated transformation */
  root.querySelector("#minecraft").onclick = () => {
    if(document.body.style.imageRendering === 'pixelated') {
      document.body.style.imageRendering = '';
      document.body.style.filter = '';
      document.querySelectorAll('img, video, canvas').forEach(el => {
        el.style.imageRendering = '';
      });
      return;
    }
    document.body.style.imageRendering = 'pixelated';
    document.body.style.filter = 'contrast(1.2)';
    document.querySelectorAll('img, video, canvas').forEach(el => {
      el.style.imageRendering = 'pixelated';
    });
    alert('🧱 Minecraft mode activated!');
  };

  /* MOVE ANYTHING - Drag elements around */
  root.querySelector("#moveanything").onclick = () => {
    if(window.ziperMoveMode) {
      window.ziperMoveMode = false;
      document.body.style.cursor = 'default';
      if(window.ziperMoveHandlers) {
        document.removeEventListener('mousedown', window.ziperMoveHandlers.down);
        document.removeEventListener('mousemove', window.ziperMoveHandlers.move);
        document.removeEventListener('mouseup', window.ziperMoveHandlers.up);
        window.ziperMoveHandlers = null;
      }
      alert('Move Anything mode deactivated!');
      return;
    }
    window.ziperMoveMode = true;
    document.body.style.cursor = 'move';
    alert('🖐️ Move Anything activated! Click and drag any element. Click again to disable.');
    
    let draggedEl = null;
    let offsetX = 0, offsetY = 0;
    
    const mouseDownHandler = (e) => {
      if(!window.ziperMoveMode) return;
      if(e.target.closest('#ziperRoot')) return;
      draggedEl = e.target;
      const rect = draggedEl.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      draggedEl.style.position = 'fixed';
      draggedEl.style.zIndex = '999999';
      e.preventDefault();
    };
    
    const mouseMoveHandler = (e) => {
      if(!draggedEl || !window.ziperMoveMode) return;
      draggedEl.style.left = (e.clientX - offsetX) + 'px';
      draggedEl.style.top = (e.clientY - offsetY) + 'px';
    };
    
    const mouseUpHandler = () => {
      draggedEl = null;
    };
    
    document.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    
    window.ziperMoveHandlers = {down: mouseDownHandler, move: mouseMoveHandler, up: mouseUpHandler};
  };

  /* ===== SCREEN EFFECTS ===== */
  
  /* Blur Screen */
  root.querySelector("#blur").onclick = () => {
    document.body.style.filter = document.body.style.filter ? '' : 'blur(5px)';
  };

  /* Grayscale */
  root.querySelector("#grayscale").onclick = () => {
    document.body.style.filter = document.body.style.filter ? '' : 'grayscale(100%)';
  };

  /* Sepia */
  root.querySelector("#sepia").onclick = () => {
    document.body.style.filter = document.body.style.filter ? '' : 'sepia(100%)';
  };

  /* Hue Rotate */
  root.querySelector("#huerotate").onclick = () => {
    if(window.ziperHueInterval) {
      clearInterval(window.ziperHueInterval);
      window.ziperHueInterval = null;
      document.body.style.filter = '';
      return;
    }
    let hue = 0;
    window.ziperHueInterval = setInterval(() => {
      hue = (hue + 5) % 360;
      document.body.style.filter = `hue-rotate(${hue}deg)`;
    }, 50);
  };

  /* Brightness */
  root.querySelector("#brightness").onclick = () => {
    document.body.style.filter = document.body.style.filter ? '' : 'brightness(150%)';
  };

  /* Contrast */
  root.querySelector("#contrast").onclick = () => {
    document.body.style.filter = document.body.style.filter ? '' : 'contrast(200%)';
  };

  /* ===== GAMES ===== */
  
  /* BREAKOUT GAME */
  root.querySelector("#breakout").onclick = () => {
    if(document.getElementById('ziperBreakout')) {
      document.getElementById('ziperBreakout').remove();
      return;
    }
    
    const gameDiv = document.createElement('div');
    gameDiv.id = 'ziperBreakout';
    gameDiv.style = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999998;background:#000;padding:20px;border-radius:10px;border:3px solid #2ecc71;';
    gameDiv.innerHTML = '<canvas id="breakoutCanvas" width="400" height="500"></canvas><div style="text-align:center;color:#2ecc71;margin-top:10px;">Arrow Keys to Move | ESC to Close</div>';
    document.body.appendChild(gameDiv);
    
    const canvas = document.getElementById('breakoutCanvas');
    const ctx = canvas.getContext('2d');
    let x = canvas.width / 2, y = canvas.height - 30, dx = 2, dy = -2;
    const ballRadius = 8, paddleHeight = 10, paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false, leftPressed = false;
    const brickRowCount = 5, brickColumnCount = 7;
    const brickWidth = 50, brickHeight = 20, brickPadding = 5, brickOffsetTop = 30, brickOffsetLeft = 17.5;
    let bricks = [];
    let score = 0;
    
    for(let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for(let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
      else if(e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
      else if(e.key === 'Escape') gameDiv.remove();
    });
    
    document.addEventListener('keyup', (e) => {
      if(e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
      else if(e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
    });
    
    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#2ecc71';
      ctx.fill();
      ctx.closePath();
    }
    
    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
      ctx.fillStyle = '#2ecc71';
      ctx.fill();
      ctx.closePath();
    }
    
    function drawBricks() {
      for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
          if(bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = '#27ae60';
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }
    
    function collisionDetection() {
      for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if(b.status === 1) {
            if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
              dy = -dy;
              b.status = 0;
              score++;
              if(score === brickRowCount * brickColumnCount) {
                alert('🎉 YOU WIN!');
                gameDiv.remove();
              }
            }
          }
        }
      }
    }
    
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();
      
      if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
      if(y + dy < ballRadius) dy = -dy;
      else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) dy = -dy;
        else {
          alert('GAME OVER! Score: ' + score);
          gameDiv.remove();
          return;
        }
      }
      
      if(rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
      else if(leftPressed && paddleX > 0) paddleX -= 5;
      
      x += dx;
      y += dy;
      requestAnimationFrame(draw);
    }
    draw();
  };

  /* SNAKE GAME */
  root.querySelector("#snake").onclick = () => {
    if(document.getElementById('ziperSnake')) {
      document.getElementById('ziperSnake').remove();
      return;
    }
    
    const gameDiv = document.createElement('div');
    gameDiv.id = 'ziperSnake';
    gameDiv.style = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999998;background:#000;padding:20px;border-radius:10px;border:3px solid #2ecc71;';
    gameDiv.innerHTML = '<canvas id="snakeCanvas" width="400" height="400"></canvas><div style="text-align:center;color:#2ecc71;margin-top:10px;">Arrow Keys | ESC to Close</div>';
    document.body.appendChild(gameDiv);
    
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const box = 20;
    let snake = [{x: 10 * box, y: 10 * box}];
    let food = {x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box};
    let score = 0;
    let d = 'RIGHT';
    
    document.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowLeft' && d !== 'RIGHT') d = 'LEFT';
      else if(e.key === 'ArrowUp' && d !== 'DOWN') d = 'UP';
      else if(e.key === 'ArrowRight' && d !== 'LEFT') d = 'RIGHT';
      else if(e.key === 'ArrowDown' && d !== 'UP') d = 'DOWN';
      else if(e.key === 'Escape') gameDiv.remove();
    });
    
    function draw() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#2ecc71' : '#27ae60';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#0a150b';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
      }
      
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(food.x, food.y, box, box);
      
      let snakeX = snake[0].x;
      let snakeY = snake[0].y;
      
      if(d === 'LEFT') snakeX -= box;
      if(d === 'UP') snakeY -= box;
      if(d === 'RIGHT') snakeX += box;
      if(d === 'DOWN') snakeY += box;
      
      if(snakeX === food.x && snakeY === food.y) {
        score++;
        food = {x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box};
      } else {
        snake.pop();
      }
      
      const newHead = {x: snakeX, y: snakeY};
      
      if(snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || snake.some(seg => seg.x === snakeX && seg.y === snakeY)) {
        alert('Game Over! Score: ' + score);
        gameDiv.remove();
        return;
      }
      
      snake.unshift(newHead);
      
      ctx.fillStyle = '#2ecc71';
      ctx.font = '20px Arial';
      ctx.fillText('Score: ' + score, 10, 30);
    }
    
    const game = setInterval(() => {
      if(!document.getElementById('ziperSnake')) clearInterval(game);
      else draw();
    }, 100);
  };

  /* PONG GAME */
  root.querySelector("#pong").onclick = () => {
    if(document.getElementById('ziperPong')) {
      document.getElementById('ziperPong').remove();
      return;
    }
    
    const gameDiv = document.createElement('div');
    gameDiv.id = 'ziperPong';
    gameDiv.style = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999998;background:#000;padding:20px;border-radius:10px;border:3px solid #2ecc71;';
    gameDiv.innerHTML = '<canvas id="pongCanvas" width="600" height="400"></canvas><div style="text-align:center;color:#2ecc71;margin-top:10px;">W/S Keys | ESC to Close</div>';
    document.body.appendChild(gameDiv);
    
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    
    const paddle = {w: 10, h: 80, speed: 6};
    let p1 = {x: 10, y: canvas.height / 2 - paddle.h / 2, score: 0};
    let p2 = {x: canvas.width - 10 - paddle.w, y: canvas.height / 2 - paddle.h / 2, score: 0};
    let ball = {x: canvas.width / 2, y: canvas.height / 2, r: 8, dx: 3, dy: 3};
    let wPressed = false, sPressed = false;
    
    document.addEventListener('keydown', (e) => {
      if(e.key === 'w' || e.key === 'W') wPressed = true;
      if(e.key === 's' || e.key === 'S') sPressed = true;
      if(e.key === 'Escape') gameDiv.remove();
    });
    
    document.addEventListener('keyup', (e) => {
      if(e.key === 'w' || e.key === 'W') wPressed = false;
      if(e.key === 's' || e.key === 'S') sPressed = false;
    });
    
    function draw() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(p1.x, p1.y, paddle.w, paddle.h);
      ctx.fillRect(p2.x, p2.y, paddle.w, paddle.h);
      
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = '#2ecc71';
      ctx.fill();
      ctx.closePath();
      
      ctx.font = '30px Arial';
      ctx.fillText(p1.score, canvas.width / 4, 50);
      ctx.fillText(p2.score, 3 * canvas.width / 4, 50);
      
      if(wPressed && p1.y > 0) p1.y -= paddle.speed;
      if(sPressed && p1.y < canvas.height - paddle.h) p1.y += paddle.speed;
      
      p2.y += (ball.y - (p2.y + paddle.h / 2)) * 0.1;
      
      ball.x += ball.dx;
      ball.y += ball.dy;
      
      if(ball.y + ball.r > canvas.height || ball.y - ball.r < 0) ball.dy = -ball.dy;
      
      if(ball.x - ball.r < p1.x + paddle.w && ball.y > p1.y && ball.y < p1.y + paddle.h) ball.dx = -ball.dx;
      if(ball.x + ball.r > p2.x && ball.y > p2.y && ball.y < p2.y + paddle.h) ball.dx = -ball.dx;
      
      if(ball.x < 0) {
        p2.score++;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 3;
      }
      if(ball.x > canvas.width) {
        p1.score++;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = -3;
      }
      
      requestAnimationFrame(draw);
    }
    draw();
  };

  /* TETRIS GAME */
  root.querySelector("#tetris").onclick = () => {
    if(document.getElementById('ziperTetris')) {
      document.getElementById('ziperTetris').remove();
      return;
    }
    
    const gameDiv = document.createElement('div');
    gameDiv.id = 'ziperTetris';
    gameDiv.style = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999998;background:#000;padding:20px;border-radius:10px;border:3px solid #2ecc71;';
    gameDiv.innerHTML = '<canvas id="tetrisCanvas" width="240" height="400"></canvas><div style="text-align:center;color:#2ecc71;margin-top:10px;">Arrow Keys | Space to Drop | ESC to Close</div>';
    document.body.appendChild(gameDiv);
    
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    const COLS = 12, ROWS = 20, BLOCK = 20;
    
    let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    let piece = {x: 5, y: 0, shape: [[1,1,1,1]]};
    let score = 0;
    
    const shapes = [
      [[1,1,1,1]],
      [[1,1],[1,1]],
      [[1,1,1],[0,1,0]],
      [[1,1,1],[1,0,0]],
      [[1,1,1],[0,0,1]]
    ];
    
    function newPiece() {
      piece = {x: 5, y: 0, shape: shapes[Math.floor(Math.random() * shapes.length)]};
    }
    
    function draw() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for(let r = 0; r < ROWS; r++) {
        for(let c = 0; c < COLS; c++) {
          if(board[r][c]) {
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(c * BLOCK, r * BLOCK, BLOCK - 1, BLOCK - 1);
          }
        }
      }
      
      ctx.fillStyle = '#2ecc71';
      for(let r = 0; r < piece.shape.length; r++) {
        for(let c = 0; c < piece.shape[r].length; c++) {
          if(piece.shape[r][c]) {
            ctx.fillRect((piece.x + c) * BLOCK, (piece.y + r) * BLOCK, BLOCK - 1, BLOCK - 1);
          }
        }
      }
      
      ctx.fillStyle = '#2ecc71';
      ctx.font = '16px Arial';
      ctx.fillText('Score: ' + score, 10, 20);
    }
    
    function canMove(dx, dy) {
      for(let r = 0; r < piece.shape.length; r++) {
        for(let c = 0; c < piece.shape[r].length; c++) {
          if(piece.shape[r][c]) {
            const newX = piece.x + c + dx;
            const newY = piece.y + r + dy;
            if(newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
              return false;
            }
          }
        }
      }
      return true;
    }
    
    function merge() {
      for(let r = 0; r < piece.shape.length; r++) {
        for(let c = 0; c < piece.shape[r].length; c++) {
          if(piece.shape[r][c]) {
            board[piece.y + r][piece.x + c] = 1;
          }
        }
      }
      
      for(let r = ROWS - 1; r >= 0; r--) {
        if(board[r].every(cell => cell)) {
          board.splice(r, 1);
          board.unshift(Array(COLS).fill(0));
          score += 10;
          r++;
        }
      }
    }
    
    document.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowLeft' && canMove(-1, 0)) piece.x--;
      else if(e.key === 'ArrowRight' && canMove(1, 0)) piece.x++;
      else if(e.key === 'ArrowDown' && canMove(0, 1)) piece.y++;
      else if(e.key === ' ') {
        while(canMove(0, 1)) piece.y++;
      } else if(e.key === 'Escape') gameDiv.remove();
    });
    
    function update() {
      if(canMove(0, 1)) {
        piece.y++;
      } else {
        merge();
        newPiece();
        if(!canMove(0, 0)) {
          alert('Game Over! Score: ' + score);
          gameDiv.remove();
          return;
        }
      }
      draw();
    }
    
    const game = setInterval(() => {
      if(!document.getElementById('ziperTetris')) clearInterval(game);
      else update();
    }, 500);
    draw();
  };

  /* SPACE SHOOTER GAME */
  root.querySelector("#spaceshooter").onclick = () => {
    if(document.getElementById('ziperSpace')) {
      document.getElementById('ziperSpace').remove();
      return;
    }
    
    const gameDiv = document.createElement('div');
    gameDiv.id = 'ziperSpace';
    gameDiv.style = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999998;background:#000;padding:20px;border-radius:10px;border:3px solid #2ecc71;';
    gameDiv.innerHTML = '<canvas id="spaceCanvas" width="400" height="500"></canvas><div style="text-align:center;color:#2ecc71;margin-top:10px;">Arrow Keys | Space to Shoot | ESC to Close</div>';
    document.body.appendChild(gameDiv);
    
    const canvas = document.getElementById('spaceCanvas');
    const ctx = canvas.getContext('2d');
    
    let player = {x: canvas.width / 2 - 15, y: canvas.height - 60, w: 30, h: 30, speed: 5};
    let bullets = [];
    let enemies = [];
    let score = 0;
    let leftPressed = false, rightPressed = false, spacePressed = false;
    let lastShot = 0;
    
    document.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowLeft') leftPressed = true;
      if(e.key === 'ArrowRight') rightPressed = true;
      if(e.key === ' ') spacePressed = true;
      if(e.key === 'Escape') gameDiv.remove();
    });
    
    document.addEventListener('keyup', (e) => {
      if(e.key === 'ArrowLeft') leftPressed = false;
      if(e.key === 'ArrowRight') rightPressed = false;
      if(e.key === ' ') spacePressed = false;
    });
    
    function spawnEnemy() {
      enemies.push({x: Math.random() * (canvas.width - 30), y: -30, w: 30, h: 30});
    }
    
    function draw() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(player.x, player.y, player.w, player.h);
      
      ctx.fillStyle = '#27ae60';
      bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
      
      ctx.fillStyle = '#e74c3c';
      enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));
      
      ctx.fillStyle = '#2ecc71';
      ctx.font = '20px Arial';
      ctx.fillText('Score: ' + score, 10, 30);
      
      if(leftPressed && player.x > 0) player.x -= player.speed;
      if(rightPressed && player.x < canvas.width - player.w) player.x += player.speed;
      
      const now = Date.now();
      if(spacePressed && now - lastShot > 250) {
        bullets.push({x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10, speed: 7});
        lastShot = now;
      }
      
      bullets = bullets.filter(b => {
        b.y -= b.speed;
        return b.y >= 0;
      });
      
      enemies = enemies.filter((e, i) => {
        e.y += 2;
        if(e.y > canvas.height) return false;
        
        if(e.x < player.x + player.w && e.x + e.w > player.x && e.y < player.y + player.h && e.y + e.h > player.y) {
          alert('Game Over! Score: ' + score);
          gameDiv.remove();
        }
        return true;
      });
      
      for(let bi = bullets.length - 1; bi >= 0; bi--) {
        const b = bullets[bi];
        for(let ei = enemies.length - 1; ei >= 0; ei--) {
          const e = enemies[ei];
          if(b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
            bullets.splice(bi, 1);
            enemies.splice(ei, 1);
            score += 10;
            break;
          }
        }
      }
      
      if(Math.random() < 0.02) spawnEnemy();
      
      requestAnimationFrame(draw);
    }
    draw();
  };

  /* ===== CUSTOM JS RUNNER ===== */
  root.querySelector("#runCustomJS").onclick = () => {
    const code = root.querySelector("#customJS").value.trim();
    const responseDiv = root.querySelector("#customResponse");
    
    if(!code) {
      responseDiv.innerHTML = '<div class="chat-response" style="border-left-color:#f39c12;">⚠️ Please enter some JavaScript code first.</div>';
      return;
    }
    
    try {
      // Execute the code
      const result = eval(code);
      responseDiv.innerHTML = '<div class="chat-response" style="border-left-color:#2ecc71;">✅ Code executed successfully!' + (result !== undefined ? '<br><br>Return value: ' + escapeHtml(String(result)) : '') + '</div>';
    } catch(e) {
      responseDiv.innerHTML = '<div class="chat-response" style="border-left-color:#e74c3c;">❌ Error:<br>' + escapeHtml(e.message) + '</div>';
    }
  };
  
  })(); // End of async initZiper

})(); // End of main IIFE
