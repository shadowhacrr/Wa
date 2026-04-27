// Clock
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.querySelectorAll('#clock').forEach(el => el.textContent = `${hours}:${minutes}`);
}
setInterval(updateClock, 1000);
updateClock();

// Get chat ID from URL
const chatId = window.location.pathname.split('/').pop();
let currentChat = null;

// Go back
function goBack() {
  window.location.href = '/';
}

// Load chat info
async function loadChatInfo() {
  try {
    const res = await fetch(`/api/chats/${chatId}`);
    currentChat = await res.json();
    
    document.getElementById('headerName').textContent = currentChat.name;
    document.getElementById('headerStatus').textContent = currentChat.status;
    document.getElementById('headerDp').src = currentChat.dp;
    document.title = `WhatsApp - ${currentChat.name}`;
  } catch (err) {
    console.error('Failed to load chat info');
  }
}

// Load messages
async function loadMessages() {
  try {
    const res = await fetch(`/api/chats/${chatId}/messages`);
    const messages = await res.json();
    renderMessages(messages);
    
    // Mark as seen
    await fetch(`/api/chats/${chatId}/seen`, { method: 'POST' });
  } catch (err) {
    document.getElementById('chatMessages').innerHTML = '<div class="loading">Failed to load messages</div>';
  }
}

function renderMessages(messages) {
  const container = document.getElementById('chatMessages');
  
  if (messages.length === 0) {
    container.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg><h3>No messages yet</h3><p>Send a message to start chatting</p></div>';
    return;
  }

  let lastDate = '';
  
  container.innerHTML = messages.map(msg => {
    const isSent = msg.sender === 'me';
    const statusSvg = isSent ? getStatusSvg(msg) : '';
    
    return `
      <div class="message ${isSent ? 'sent' : 'received'}">
        <div class="message-text">${escapeHtml(msg.text)}</div>
        <div class="message-meta">
          <span class="message-time">${msg.time}</span>
          ${statusSvg}
        </div>
      </div>
    `;
  }).join('');
  
  scrollToBottom();
}

function getStatusSvg(msg) {
  // Single tick = sent, double blue = seen
  if (msg.seen) {
    return `
      <div class="message-status">
        <svg viewBox="0 0 24 24" class="tick-seen">
          <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
        </svg>
      </div>
    `;
  }
  return `
    <div class="message-status">
      <svg viewBox="0 0 24 24" class="tick-double">
        <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
      </svg>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, '<br>');
}

function scrollToBottom() {
  const container = document.getElementById('chatMessages');
  container.scrollTop = container.scrollHeight;
}

// Send message
async function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  
  if (!text) return;
  
  input.value = '';
  input.disabled = true;
  
  try {
    // Add user message to UI immediately
    const container = document.getElementById('chatMessages');
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) emptyState.remove();
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    const userMsgEl = document.createElement('div');
    userMsgEl.className = 'message sent';
    userMsgEl.innerHTML = `
      <div class="message-text">${escapeHtml(text)}</div>
      <div class="message-meta">
        <span class="message-time">${timeStr}</span>
        <div class="message-status">
          <svg viewBox="0 0 24 24" class="tick-single">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      </div>
    `;
    container.appendChild(userMsgEl);
    scrollToBottom();
    
    // Show typing indicator
    document.getElementById('typingIndicator').classList.add('active');
    document.getElementById('headerStatus').textContent = 'typing...';
    scrollToBottom();
    
    // Send to server
    const res = await fetch(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    
    const data = await res.json();
    
    // Hide typing indicator
    document.getElementById('typingIndicator').classList.remove('active');
    document.getElementById('headerStatus').textContent = currentChat?.status || 'online';
    
    // Update user message to double tick
    userMsgEl.querySelector('.message-status').innerHTML = `
      <svg viewBox="0 0 24 24" class="tick-seen">
        <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
      </svg>
    `;
    
    // Add reply message
    const replyEl = document.createElement('div');
    replyEl.className = 'message received';
    replyEl.innerHTML = `
      <div class="message-text">${escapeHtml(data.reply.text)}</div>
      <div class="message-meta">
        <span class="message-time">${data.reply.time}</span>
      </div>
    `;
    container.appendChild(replyEl);
    scrollToBottom();
    
  } catch (err) {
    console.error('Failed to send message', err);
    document.getElementById('typingIndicator').classList.remove('active');
  } finally {
    input.disabled = false;
    input.focus();
  }
}

function handleKeyPress(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
}

// Load on page load
loadChatInfo();
loadMessages();
