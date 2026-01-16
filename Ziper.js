(function(){
  if(document.getElementById("ziperRoot")) return;

  /* ===== CONFIG ===== */
  const HF_TOKEN = "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"; // Hugging Face token
  const MODEL = "HuggingFaceTB/SmolLM2-360M-Instruct"; // Replace if needed

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

    const box = document.createElement("div");
    box.style = `
      position:fixed;top:50%;left:50%;
      transform:translate(-50%,-50%);
      background:#111;color:white;
      padding:14px;border-radius:12px;
      z-index:99999999;width:320px;
    `;
    box.innerHTML = "Thinking…<br><button id='closeAI'>Close</button>";
    document.body.appendChild(box);
    box.querySelector("#closeAI").onclick = () => box.remove();

    try {
      const res = await fetch("https://api-inference.huggingface.co/models/"+MODEL,{
        method:"POST",
        headers:{
          "Authorization":"Bearer "+HF_TOKEN,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({inputs:q, parameters:{max_new_tokens:120}})
      });
      if(!res.ok) throw new Error("HTTP "+res.status+" "+res.statusText);

      const data = await res.json();
      box.innerHTML = (data[0]?.generated_text?.replace(q,"").trim() || "No reply") + "<br><button id='closeAI'>Close</button>";
      box.querySelector("#closeAI").onclick = () => box.remove();
    } catch(e) {
      box.innerHTML = "AI error: "+e.message+"<br><button id='closeAI'>Close</button>";
      box.querySelector("#closeAI").onclick = () => box.remove();
    }
  };

  /* ===== CLOSE ===== */
  document.getElementById("cl").onclick = () => {
    clearInterval(rbInt);
    root.remove();
  };
})();
