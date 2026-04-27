// Clock
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.querySelectorAll('#clock').forEach(el => el.textContent = `${hours}:${minutes}`);
}
setInterval(updateClock, 1000);
updateClock();

// Fetch and render chats
async function loadChats() {
  try {
    const res = await fetch('/api/chats');
    const chats = await res.json();
    renderChats(chats);
  } catch (err) {
    document.getElementById('chatList').innerHTML = '<div class="loading">Failed to load chats</div>';
  }
}

function renderChats(chats) {
  const list = document.getElementById('chatList');
  
  if (chats.length === 0) {
    list.innerHTML = '<div class="loading">No chats found</div>';
    return;
  }

  list.innerHTML = chats.map(chat => `
    <div class="chat-item ${chat.unread > 0 ? 'has-unread' : ''}" onclick="openChat(${chat.id})">
      <div class="${chat.isOnline ? 'online-indicator' : ''}">
        <img class="chat-dp" src="${chat.dp}" alt="${chat.name}">
      </div>
      <div class="chat-info">
        <div class="chat-top">
          <div class="chat-name">${chat.name}</div>
          <div class="chat-time">${chat.lastMessageTime}</div>
        </div>
        <div class="chat-bottom">
          <div class="chat-preview">${chat.lastMessage}</div>
          ${chat.unread > 0 ? `<div class="unread-badge">${chat.unread}</div>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function openChat(chatId) {
  window.location.href = `/chat/${chatId}`;
}

// Search
let allChats = [];

document.getElementById('searchInput').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  if (!allChats.length) return;
  const filtered = allChats.filter(c => 
    c.name.toLowerCase().includes(term) || 
    c.lastMessage.toLowerCase().includes(term)
  );
  renderChats(filtered);
});

// Load chats on page load
loadChats().then(async () => {
  const res = await fetch('/api/chats');
  allChats = await res.json();
});
