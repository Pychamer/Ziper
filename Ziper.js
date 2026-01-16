(function(){
  if(document.getElementById("ziperRoot")) return;

  /* ===== CONFIG ===== */
  const HF_TOKEN = "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"; // Hugging Face API token
  const HF_MODEL = "HuggingFaceTB/SmolLM2-360M-Instruct"; // AI Model
  const AI_ENABLED = true; // Re-enabled with Hugging Face

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
    border-radius:16px;
    z-index:9999999;
    width:380px;
    box-shadow:0 8px 32px rgba(0,255,0,.2);
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
        padding:12px 16px;
        border-radius:14px 14px 0 0;
        display:flex;
        justify-content:space-between;
        align-items:center;
        border-bottom:2px solid #27ae60;
      }
      #ziperRoot .header h3{
        margin:0;
        font-size:18px;
        font-weight:bold;
        color:#fff;
        text-shadow:0 2px 4px rgba(0,0,0,.3);
      }
      #ziperRoot .beta-badge{
        background:#f39c12;
        color:#000;
        padding:4px 10px;
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
        padding:12px;
        text-align:center;
        cursor:pointer;
        color:#7fb887;
        border:none;
        background:transparent;
        font-size:14px;
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
        padding:16px;
        max-height:400px;
        overflow-y:auto;
      }
      #ziperRoot .content::-webkit-scrollbar{width:8px;}
      #ziperRoot .content::-webkit-scrollbar-track{background:#0a150b;}
      #ziperRoot .content::-webkit-scrollbar-thumb{background:#27ae60;border-radius:4px;}
      #ziperRoot .tab-content{display:none;}
      #ziperRoot .tab-content.active{display:block;}
      #ziperRoot .feature-btn{
        width:100%;
        padding:12px;
        margin:8px 0;
        background:#1a3a1f;
        border:2px solid #27ae60;
        border-radius:8px;
        color:#2ecc71;
        cursor:pointer;
        font-size:14px;
        transition:all .2s;
        display:flex;
        align-items:center;
        gap:10px;
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
        background:#e74c3c;
        color:#fff;
        border:none;
        padding:6px 12px;
        border-radius:6px;
        cursor:pointer;
        font-size:12px;
        font-weight:bold;
      }
      #ziperRoot .close-btn:hover{
        background:#c0392b;
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
    </style>
    <div class="header">
      <h3>🌲 Ziper <span class="beta-badge">BETA</span></h3>
      <button class="close-btn" id="closeWidget">✕</button>
    </div>
    <div class="tabs">
      <button class="tab active" data-tab="chat">💬 Chat</button>
      <button class="tab" data-tab="features">🔧 Features</button>
      <button class="tab" data-tab="settings">⚙️ Settings</button>
    </div>
    <div class="content">
      <div class="tab-content active" id="chat-tab">
        <textarea class="chat-input" id="chatInput" placeholder="Ask AI anything..." rows="3"></textarea>
        <button class="send-btn" id="sendChat">🚀 Send Message</button>
        <div id="chatResponse"></div>
      </div>
      <div class="tab-content" id="features-tab">
        <div class="sub-tabs">
          <button class="sub-tab active" data-subtab="basic">📌 Basic</button>
          <button class="sub-tab" data-subtab="tools">🛠️ Tools</button>
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
        </div>
      </div>
      <div class="tab-content" id="settings-tab">
        <div style="color:#7fb887;line-height:1.8;">
          <p><strong style="color:#2ecc71;">Version:</strong> BETA 0.9.0</p>
          <p><strong style="color:#2ecc71;">API:</strong> Hugging Face AI</p>
          <p><strong style="color:#2ecc71;">Model:</strong> SmolLM2-360M</p>
          <p><strong style="color:#2ecc71;">Theme:</strong> Matrix Green</p>
          <p style="margin-top:12px;font-size:12px;color:#2ecc71;">✅ AI Chat enabled with Hugging Face</p>
          <p style="margin-top:4px;font-size:12px;color:#5a8260;">More settings coming soon...</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  /* ===== SHARED STATE ===== */
  let rbInt = null; // Rainbow mode interval

  /* ===== TAB SWITCHING ===== */
  const tabs = root.querySelectorAll('.tab');
  const tabContents = root.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));
      tab.classList.add('active');
      const targetTab = tab.getAttribute('data-tab');
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
  document.getElementById("closeWidget").onclick = () => {
    if(rbInt) clearInterval(rbInt);
    root.remove();
  };

  /* ===== AI CHAT WITH HUGGING FACE ===== */
  document.getElementById("sendChat").onclick = async () => {
    const input = document.getElementById("chatInput");
    const responseDiv = document.getElementById("chatResponse");
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
  document.getElementById("rb").onclick = () => {
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
  document.getElementById("hf").onclick = () => {
    const n = +prompt("History flood amount:");
    if(!n) return;
    const x = location.href;
    for(let i=1;i<=n;i++) history.pushState(0,0,i===n?x:i.toString());
    alert("✅ History flood successful!");
  };

  /* ===== EDIT PAGE (LOCK ZIPER) ===== */
  document.getElementById("ed").onclick = () => {
    const on = document.body.contentEditable !== "true";
    document.body.contentEditable = on ? "true" : "false";
    document.designMode = on ? "on" : "off";
    root.setAttribute("contenteditable","false");
    root.style.userSelect = "none";
    root.style.pointerEvents = "auto";
    root.querySelectorAll("*").forEach(el => {el.contentEditable="false";el.style.userSelect="none";});
  };

  /* ===== TRANSLATE ===== */
  document.getElementById("tr").onclick = () => {
    window.open("https://translate.google.com/translate?u="+encodeURIComponent(location.href));
  };

  /* ===== VIDEO SPEED ===== */
  document.getElementById("vd").onclick = () => {
    document.querySelectorAll("video").forEach(v => {v.playbackRate = v.playbackRate===1 ? 2 : 1;});
  };

  /* ===== AUTOCLICKER (from TheRealMrGamz/Bookmarklets) ===== */
  document.getElementById("ac").onclick = () => {
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
  document.getElementById("td").onclick = () => {
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

  /* ===== BLOOKET GUI (from BlobJanitor/minesraft2-blooket-hacks) ===== */
  document.getElementById("bg").onclick = () => {
    const script = document.createElement('script');
    script.src = 'https://raw.githubusercontent.com/BlobJanitor/minesraft2-blooket-hacks/main/blooket%20gui%20bookmarklet';
    document.body.appendChild(script);
    alert('🎮 Blooket GUI loading...');
  };

  /* ===== TIMER CONTROLLER (inspired by Greasyfork script) ===== */
  document.getElementById("tc").onclick = () => {
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
})();
