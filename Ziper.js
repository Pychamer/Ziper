(function(){
  if(document.getElementById("ziperRoot")) return;

  /* ===== CONFIG ===== */
  // Get your free token at: https://huggingface.co/settings/tokens
  const HF_TOKEN = "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"; // Hugging Face token
  const MODEL = "HuggingFaceTB/SmolLM2-360M-Instruct"; // Fast, small model

  /* ===== ROOT (PROTECTED) ===== */
  const root = document.createElement("div");
  root.id = "ziperRoot";
  root.setAttribute("contenteditable","false");
  root.style = `
    position:fixed;
    bottom:20px;
    right:20px;
    background:#1e1f22;
    color:white;
    padding:10px;
    border-radius:14px;
    z-index:9999999;
    display:flex;
    flex-direction:column;
    gap:8px;
    box-shadow:0 0 20px rgba(0,0,0,.6);
    font-family:sans-serif;
    user-select:none;
    pointer-events:auto;
  `;

  root.innerHTML = `
    <b style="text-align:center">Ziper</b>
    <button id="rb">🌈</button>
    <button id="hf">📜</button>
    <button id="ed">✏️</button>
    <button id="tr">🌐</button>
    <button id="vd">🎥</button>
    <button id="ai">🧠</button>
    <button id="cl">❌</button>
    <style>
      #ziperRoot button{width:40px;height:40px;border:none;border-radius:50%;background:#2b2d31;color:white;cursor:pointer;font-size:18px;}
      #ziperRoot button:hover{background:#5865F2;}
    </style>
  `;

  document.body.appendChild(root);

  /* ===== RAINBOW ===== */
  let rbInt = null;
  document.getElementById("rb").onclick = () => {
    if(rbInt) return;
    const colors = ["red","orange","yellow","green","blue","purple"];
    let i = 0;
    rbInt = setInterval(()=>{document.body.style.backgroundColor = colors[i++ % colors.length];},1000);
  };

  /* ===== HISTORY FLOOD ===== */
  document.getElementById("hf").onclick = () => {
    const n = +prompt("History flood amount:");
    if(!n) return;
    const x = location.href;
    for(let i=1;i<=n;i++) history.pushState(0,0,i===n?x:i.toString());
    alert("History flood successful!");
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

  /* ===== AI CALCULATOR ===== */
  document.getElementById("ai").onclick = async () => {
    const q = prompt("Ziper AI:");
    if(!q) return;

    // Helper to create styled close button
    const makeCloseBtn = () => {
      const btn = document.createElement("button");
      btn.id = "closeAI";
      btn.textContent = "Close";
      btn.style = "margin-top:8px;padding:6px 12px;background:#5865F2;border:none;border-radius:6px;color:white;cursor:pointer;";
      return btn;
    };

    // Helper to update box content safely (prevents XSS)
    const updateBox = (content, isError = false) => {
      box.innerHTML = "";
      if(typeof content === "string") {
        const textDiv = document.createElement("div");
        textDiv.textContent = content;
        if(!isError) textDiv.style = "white-space:pre-wrap;word-wrap:break-word;";
        box.appendChild(textDiv);
      } else {
        box.appendChild(content);
      }
      const closeBtn = makeCloseBtn();
      closeBtn.onclick = () => box.remove();
      box.appendChild(closeBtn);
    };

    const box = document.createElement("div");
    box.style = `
      position:fixed;top:50%;left:50%;
      transform:translate(-50%,-50%);
      background:#111;color:white;
      padding:14px;border-radius:12px;
      z-index:99999999;width:360px;
      max-height:400px;overflow-y:auto;
    `;
    updateBox("🤔 Thinking…");
    document.body.appendChild(box);

    try {
      // Try Hugging Face API with better error handling
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      const res = await fetch("https://api-inference.huggingface.co/models/"+MODEL,{
        method:"POST",
        headers:{
          "Authorization":"Bearer "+HF_TOKEN,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          inputs:q, 
          parameters:{max_new_tokens:150, temperature:0.7}
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if(!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        // Handle model loading
        if(res.status === 503 || errorData.error?.includes("loading")) {
          updateBox("⏳ Model is loading... This can take 20-30 seconds.\nPlease try again in a moment.");
          return;
        }
        
        // Handle token/auth errors
        if(res.status === 401 || res.status === 403) {
          throw new Error("Authentication failed. Token may be invalid.");
        }
        
        throw new Error(`HTTP ${res.status}: ${errorData.error || res.statusText}`);
      }

      const data = await res.json();
      
      // Handle different response formats
      let reply = "";
      if(Array.isArray(data) && data[0]?.generated_text) {
        reply = data[0].generated_text.replace(q,"").trim();
      } else if(data.generated_text) {
        reply = data.generated_text.replace(q,"").trim();
      } else {
        reply = "No response generated";
      }
      
      updateBox(reply || "No reply");
    } catch(e) {
      let errorMsg = e.message;
      if(e.name === "AbortError") {
        errorMsg = "Request timed out. The model may be loading. Please try again.";
      }
      updateBox("❌ AI Error:\n" + errorMsg, true);
    }
  };

  /* ===== CLOSE ===== */
  document.getElementById("cl").onclick = () => {
    clearInterval(rbInt);
    root.remove();
  };
})();
