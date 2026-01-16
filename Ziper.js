(function(){
  if(document.getElementById("ziperRoot")) return;

  /* ===== CONFIG ===== */
  const HF_TOKEN = "PASTE_YOUR_TOKEN_HERE";
  const MODEL = "HuggingFaceTB/SmolLM2-360M-Instruct";

  /* ===== ROOT (PROTECTED) ===== */
  const root = document.createElement("div");
  root.id="ziperRoot";
  root.contentEditable="false";
  root.style=`
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
  `;

  root.innerHTML=`
    <b style="text-align:center">Ziper</b>

    <button id="rb">🌈</button>
    <button id="hf">📜</button>
    <button id="ed">✏️</button>
    <button id="tr">🌐</button>
    <button id="vd">🎥</button>
    <button id="ai">🧮</button>
    <button id="cl">❌</button>

    <style>
      #ziperRoot button{
        width:40px;height:40px;
        border:none;border-radius:50%;
        background:#2b2d31;color:white;
        cursor:pointer;font-size:18px;
      }
      #ziperRoot button:hover{background:#5865F2}
    </style>
  `;

  document.body.appendChild(root);

  /* ===== RAINBOW (PAGE ONLY) ===== */
  let rbInt=null;
  document.getElementById("rb").onclick=()=>{
    if(rbInt) return;
    const colors=["red","orange","yellow","green","blue","purple"];
    let i=0;
    rbInt=setInterval(()=>{
      document.body.style.backgroundColor=colors[i++%colors.length];
    },1000);
  };

  /* ===== HISTORY FLOODER ===== */
  document.getElementById("hf").onclick=()=>{
    const n=+prompt("History flood amount:");
    if(!n) return;
    const x=location.href;
    for(let i=1;i<=n;i++){
      history.pushState(0,0,i==n?x:i.toString());
    }
    alert("History flood successful!");
  };

  /* ===== EDIT PAGE (EXCEPT ZIPER) ===== */
  document.getElementById("ed").onclick=()=>{
    const on=document.body.contentEditable!=="true";
    document.body.contentEditable=on?"true":"false";
    document.designMode=on?"on":"off";
    root.contentEditable="false";
  };

  /* ===== TRANSLATE ===== */
  document.getElementById("tr").onclick=()=>{
    open("https://translate.google.com/translate?u="+encodeURIComponent(location.href));
  };

  /* ===== VIDEO SPEED ===== */
  document.getElementById("vd").onclick=()=>{
    document.querySelectorAll("video").forEach(v=>{
      v.playbackRate=v.playbackRate===1?2:1;
    });
  };

  /* ===== AI CALCULATOR ===== */
  document.getElementById("ai").onclick=async()=>{
    const q=prompt("Ziper AI:");
    if(!q) return;

    const box=document.createElement("div");
    box.style=`
      position:fixed;top:50%;left:50%;
      transform:translate(-50%,-50%);
      background:#111;color:white;
      padding:14px;border-radius:12px;
      z-index:99999999;width:320px;
    `;
    box.innerHTML="Thinking…";
    document.body.appendChild(box);

    try{
      const r=await fetch("https://api-inference.huggingface.co/models/"+MODEL,{
        method:"POST",
        headers:{
          "Authorization":"Bearer "+HF_TOKEN,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({inputs:q})
      });
      const d=await r.json();
      box.innerHTML=d[0]?.generated_text||"No reply";
    }catch{
      box.innerHTML="AI error.";
    }
  };

  /* ===== CLOSE ===== */
  document.getElementById("cl").onclick=()=>{
    clearInterval(rbInt);
    root.remove();
  };

})();
