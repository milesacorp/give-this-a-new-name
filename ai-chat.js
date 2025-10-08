// --- AI Chat Widget ---
let aiChatWindow = null;
let chatVisible = false;

// Detect Shift+T
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLowerCase() === "t") {
    e.preventDefault();
    toggleAIChat();
  }
});

async function toggleAIChat() {
  if (!chatVisible) {
    aiChatWindow = document.createElement("div");
    aiChatWindow.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      height: 500px;
      background: #1e1e1e;
      color: #f0f0f0;
      border: 2px solid #444;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: system-ui, sans-serif;
    `;
    aiChatWindow.innerHTML = `
      <div style="background:#222;padding:10px;text-align:center;font-weight:bold;">
        🎮  AI Chat to help with games 
      </div>
      <div id="chatLog" style="flex:1;overflow-y:auto;padding:10px;"></div>
      <div style="display:flex;border-top:1px solid #333;">
        <input id="chatInput" type="text" placeholder="Type a message..." 
               style="flex:1;padding:10px;background:#2a2a2a;color:#fff;border:none;outline:none;">
        <button id="chatSend" style="padding:10px 15px;background:#444;color:#fff;border:none;">Send</button>
      </div>
    `;
    document.body.appendChild(aiChatWindow);

    const chatLog = aiChatWindow.querySelector("#chatLog");
    const chatInput = aiChatWindow.querySelector("#chatInput");
    const chatSend = aiChatWindow.querySelector("#chatSend");

    // Intro message
    chatLog.innerHTML = `
      <div style="margin-bottom:10px;">
        <b>AI:</b> 👋 Hi! I'm the <b>Moon Gaming AI</b> — here to answer your <b>gaming questions</b>, chat about mods, or just have fun.  
        Ask me anything!
      </div>
    `;

    // Send message handler
    chatSend.onclick = async () => {
      const msg = chatInput.value.trim();
      if (!msg) return;
      chatLog.innerHTML += `<div><b>You:</b> ${msg}</div>`;
      chatInput.value = "";

      try {
        const response = await puter.ai.chat(msg);
        chatLog.innerHTML += `<div><b>AI:</b> ${response}</div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
      } catch (err) {
        chatLog.innerHTML += `<div style="color:red;"><b>Error:</b> ${err.message}</div>`;
      }
    };

    // Enter key sends message
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") chatSend.click();
    });

    chatVisible = true;
  } else {
    aiChatWindow.remove();
    chatVisible = false;
  }
}

// --- Dark Mode Logic ---
function applyDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark-mode', isDarkMode);
}
window.onload = applyDarkMode;
