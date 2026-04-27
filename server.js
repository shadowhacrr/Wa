const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_DIR = path.join(DATA_DIR, 'messages');
const CHATS_FILE = path.join(DATA_DIR, 'chats.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(MESSAGES_DIR)) fs.mkdirSync(MESSAGES_DIR, { recursive: true });

// Initialize chats data if not exists
function initChats() {
  if (!fs.existsSync(CHATS_FILE)) {
    const initialChats = [
      {
        id: 1,
        name: "Zara ✨",
        dp: "/images/dp1.jpg",
        status: "online",
        about: "Tumhari jaan ❤️",
        lastMessage: "Jaan, aaj itni dair kahan laga di? Main kab se wait kar rahi thi... 🥺❤️",
        lastMessageTime: "10:50 PM",
        unread: 2,
        isOnline: true,
        gender: "female"
      },
      {
        id: 2,
        name: "Ayesha 💕",
        dp: "/images/dp2.jpg",
        status: "last seen 5 minutes ago",
        about: "Shukr hai 🌸",
        lastMessage: "Aap ne khana khaya? Mujhe aapki bohat fikar ho rahi thi... 💗",
        lastMessageTime: "10:35 PM",
        unread: 1,
        isOnline: false,
        gender: "female"
      },
      {
        id: 3,
        name: "Hina 🌸",
        dp: "/images/dp3.jpg",
        status: "online",
        about: "Living my best life ✌️",
        lastMessage: "Oye hoye! Tum toh ajkal bade busy ho gaye ho, haina? 😏",
        lastMessageTime: "10:15 PM",
        unread: 3,
        isOnline: true,
        gender: "female"
      },
      {
        id: 4,
        name: "Sara 🦋",
        dp: "/images/dp4.jpg",
        status: "last seen 1 hour ago",
        about: "Queen of my own world 👑",
        lastMessage: "Baby, where are you? I was waiting for your call... 😘",
        lastMessageTime: "9:45 PM",
        unread: 0,
        isOnline: false,
        gender: "female"
      },
      {
        id: 5,
        name: "Mehwish 🌹",
        dp: "/images/dp5.jpg",
        status: "typing...",
        about: "Mohabbat ek ehsaas hai 🌙",
        lastMessage: "Tum mere khwabon ki tabeer ho... 💫 har raat tumhe sochta hoon.",
        lastMessageTime: "9:30 PM",
        unread: 1,
        isOnline: true,
        gender: "female"
      },
      {
        id: 6,
        name: "Fatima 💫",
        dp: "/images/dp6.jpg",
        status: "online",
        about: "Simple girl, big dreams 🌟",
        lastMessage: "Bhaiya... matlab jaan 😳 sorry sorry! Woh main... aap kya kar rahe ho? 🙈",
        lastMessageTime: "9:15 PM",
        unread: 4,
        isOnline: true,
        gender: "female"
      },
      {
        id: 7,
        name: "Ali 🔥",
        dp: "/images/dp7.jpg",
        status: "last seen 10 minutes ago",
        about: "King of my Queen 👑",
        lastMessage: "Meri jaan, aaj toh tum bohat pyari lag rahi ho... dil kar raha hai bas tumhe dekhta rahoon 😍",
        lastMessageTime: "10:40 PM",
        unread: 2,
        isOnline: false,
        gender: "male"
      },
      {
        id: 8,
        name: "Hassan 💪",
        dp: "/images/dp8.jpg",
        status: "online",
        about: "Haqiqi mohabbat ❤️",
        lastMessage: "Meri jaan, main hoon na. Tum fikar mat karo, sab theek ho jayega. 🤗💪",
        lastMessageTime: "10:25 PM",
        unread: 1,
        isOnline: true,
        gender: "male"
      },
      {
        id: 9,
        name: "Usman 🎯",
        dp: "/images/dp9.jpg",
        status: "last seen 30 minutes ago",
        about: "Mast rehne ka 😎",
        lastMessage: "Hahahaha! Bhai tum toh ajkal full romantic mode mein ho 😂 par haan, yaad aa rahi thi tumhari ❤️",
        lastMessageTime: "10:00 PM",
        unread: 0,
        isOnline: false,
        gender: "male"
      },
      {
        id: 10,
        name: "Bilal 🌙",
        dp: "/images/dp10.jpg",
        status: "online",
        about: "Raat ki khamoshi mein... 🌙",
        lastMessage: "Tumhari soch mujhe hamesha hairan karti hai. Tum ek khoobsurat kitaab ho jo har baar padhne ka dil karta hai. 📖✨",
        lastMessageTime: "8:45 PM",
        unread: 1,
        isOnline: true,
        gender: "male"
      }
    ];
    fs.writeFileSync(CHATS_FILE, JSON.stringify(initialChats, null, 2));
  }
}

// Initialize messages for a chat
function initMessages(chatId) {
  const msgFile = path.join(MESSAGES_DIR, `chat-${chatId}.json`);
  if (!fs.existsSync(msgFile)) {
    const initialMessages = getInitialMessages(chatId);
    fs.writeFileSync(msgFile, JSON.stringify(initialMessages, null, 2));
  }
}

// Get initial conversation for each chat
function getInitialMessages(chatId) {
  const conversations = {
    1: [ // Zara - Overly romantic, attached
      { id: 1, sender: "them", text: "Jaan, subha se mera dil kar raha hai tumse baat karoon... 💕", time: "10:00 PM", seen: true },
      { id: 2, sender: "them", text: "Tum mujhse itna door kyun ho? Mujhe tumhari yaad aa rahi hai bohat zyada 🥺", time: "10:15 PM", seen: true },
      { id: 3, sender: "them", text: "Maine tumhare liye dua maangi hai har namaz mein... Allah tumhe hamesha khush rakhe ❤️🤲", time: "10:30 PM", seen: true },
      { id: 4, sender: "them", text: "Jaan, aaj itni dair kahan laga di? Main kab se wait kar rahi thi... 🥺❤️", time: "10:50 PM", seen: false }
    ],
    2: [ // Ayesha - Shy, traditional, polite
      { id: 1, sender: "them", text: "Assalam-o-Alaikum... umm, aap ka din kaisa guzra? 🌸", time: "9:30 PM", seen: true },
      { id: 2, sender: "them", text: "Mujhe sharm aa rahi hai ye kehne mein... lekin aap mere dil ke bohat qareeb ho 💗", time: "10:00 PM", seen: true },
      { id: 3, sender: "them", text: "Aap ne khana khaya? Mujhe aapki bohat fikar ho rahi thi... 💗", time: "10:35 PM", seen: false }
    ],
    3: [ // Hina - Bubbly, energetic, teasing
      { id: 1, sender: "them", text: "Oye hoye! Kya baat hai ajkal toh bade stylish lag rahe ho tum 😏✨", time: "9:45 PM", seen: true },
      { id: 2, sender: "them", text: "Chalo batao, aaj kahan gaye thay? Kisi larki se milne? 👀😂", time: "10:00 PM", seen: true },
      { id: 3, sender: "them", text: "Mazak kar rahi hoon jaan! Mujhe pata hai tum sirf mere ho 😘❤️", time: "10:10 PM", seen: true },
      { id: 4, sender: "them", text: "Oye hoye! Tum toh ajkal bade busy ho gaye ho, haina? 😏", time: "10:15 PM", seen: false }
    ],
    4: [ // Sara - Stylish, attitude, English mix
      { id: 1, sender: "them", text: "Hey baby! Miss me? 💋", time: "9:00 PM", seen: true },
      { id: 2, sender: "them", text: "I was thinking about you all day... tumhare bina sab kuch boring lagta hai 😔", time: "9:30 PM", seen: true },
      { id: 3, sender: "them", text: "Baby, where are you? I was waiting for your call... 😘", time: "9:45 PM", seen: false }
    ],
    5: [ // Mehwish - Poetic, Shayari
      { id: 1, sender: "them", text: "Tere ishq mein dooba rehta hoon har pal,\nTu hai meri rooh ka hissa, mera dil ka dhadkan... 🌹", time: "8:30 PM", seen: true },
      { id: 2, sender: "them", text: "Chand ki roshni mein tumhara chehra nazar aata hai,\nTum ho meri raat ka sukoon, meri subha ki roshni... ✨🌙", time: "9:00 PM", seen: true },
      { id: 3, sender: "them", text: "Tum mere khwabon ki tabeer ho... 💫 har raat tumhe sochta hoon.", time: "9:30 PM", seen: false }
    ],
    6: [ // Fatima - Innocent, cute, childish
      { id: 1, sender: "them", text: "Assalam-o-Alaikum... 😊", time: "8:30 PM", seen: true },
      { id: 2, sender: "them", text: "Woh... aaj maine aapke liye kuch banaya tha... khayal mein 😳🙈", time: "8:45 PM", seen: true },
      { id: 3, sender: "them", text: "Mujhe pata hai stupid baat hai... lekin main sach keh rahi hoon! 😣", time: "9:00 PM", seen: true },
      { id: 4, sender: "them", text: "Bhaiya... matlab jaan 😳 sorry sorry! Woh main... aap kya kar rahe ho? 🙈", time: "9:15 PM", seen: false }
    ],
    7: [ // Ali - Confident, flirty, charming
      { id: 1, sender: "them", text: "Meri jaan, tumhare bina ye raat adhoori hai... 🌙❤️", time: "10:00 PM", seen: true },
      { id: 2, sender: "them", text: "Agar main wahan hota na, toh tumhe abhi gale laga leta... itni yaad aa rahi hai tumhari 🥺", time: "10:20 PM", seen: true },
      { id: 3, sender: "them", text: "Meri jaan, aaj toh tum bohat pyari lag rahi ho... dil kar raha hai bas tumhe dekhta rahoon 😍", time: "10:40 PM", seen: false }
    ],
    8: [ // Hassan - Strong, protective, caring
      { id: 1, sender: "them", text: "Jaan, main hamesha tumhare saath hoon. Koi pareshani ho toh bata dena. 🤗", time: "9:45 PM", seen: true },
      { id: 2, sender: "them", text: "Tum meri duniya ho. Main tumhari hifazat ke liye hamesha taiyaar hoon. 💪❤️", time: "10:10 PM", seen: true },
      { id: 3, sender: "them", text: "Meri jaan, main hoon na. Tum fikar mat karo, sab theek ho jayega. 🤗💪", time: "10:25 PM", seen: false }
    ],
    9: [ // Usman - Funny, playful, roasting
      { id: 1, sender: "them", text: "Bhai! Kya scene hai? Aaj kal toh full missing status lagaye hue ho 😂", time: "9:30 PM", seen: true },
      { id: 2, sender: "them", text: "Hahaha mazak kar raha hoon yaar! Sachi bataun? Tumhari bohat yaad aa rahi thi... ❤️", time: "9:45 PM", seen: true },
      { id: 3, sender: "them", text: "Hahahaha! Bhai tum toh ajkal full romantic mode mein ho 😂 par haan, yaad aa rahi thi tumhari ❤️", time: "10:00 PM", seen: false }
    ],
    10: [ // Bilal - Calm, mature, intellectual
      { id: 1, sender: "them", text: "Raat ke 2 baje hain... aur main soch raha hoon ki tum kya kar rahi hogi. 🌙", time: "8:00 PM", seen: true },
      { id: 2, sender: "them", text: "Tumhari soch mujhe hamesha hairan karti hai. Tum ek khoobsurat kitaab ho jo har baar padhne ka dil karta hai. 📖✨", time: "8:45 PM", seen: false }
    ]
  };
  return conversations[chatId] || [];
}

// Get auto-reply based on chat personality
function getAutoReply(chatId, userMessage) {
  const replies = {
    1: [ // Zara - Romantic, attached
      "Jaan! 😘 Tum aa gaye! Mera dil garden garden ho gaya... ❤️🌸",
      "Tumhare bina mera dil udaas rehta hai... bas tum hi meri khushi ho 💕",
      "Jaan, I love you! Bohat zyada! Tum mujhse mohabbat karte ho na? 🥺❤️",
      "Meri neend tumhare bina nahi aati... har waqt bas tumhare khayal aate hain 🌙💗",
      "Tum mera sab kuch ho jaan... ALLAH se har waqt tumhare liye dua mangti hoon 🤲❤️",
      "Kahan thay itni dair? Mujhe lag gaya tha tum mujhse door ho gaye 🥺💔",
      "Jaan, ek baar keh do na 'I love you'... mera din ban jayega 😍❤️",
      "Tumhari awaz sunne ko dil taras raha hai... call kar sakte ho? 📞💕"
    ],
    2: [ // Ayesha - Shy, traditional
      "Aap... aap ne mujhe yaad kiya? Mujhe bohat acha laga sunke 💗",
      "Mujhe sharm aa rahi hai... lekin main bhi aapko bohat miss kar rahi thi 🙈",
      "Aap ka din kaisa raha? Umeed hai acha guzra hoga... 🤲🌸",
      "Maine aapke liye dua maangi thi... ALLAH aapko hamesha khush rakhe 💕",
      "Aap mere liye bohat khaas ho... ye baat main hamesha kehna chahti thi 💗",
      "Khayal rakhna apna... meri har dua mein aap shaamil ho 🤲❤️"
    ],
    3: [ // Hina - Bubbly, energetic
      "Hahaha! Bhai aap toh full mood mein ho aaj! 😂🔥",
      "Oye! Itni der kyun laga di? Kisi aur se baat kar rahe thay? 👀😏",
      "Tumhari baatein mujhe hansi deti hain yaar! Maza aa gaya 😂❤️",
      "Chalo chalo, ab mujhe batao kahan ho? Main aa rahi hoon milne! 😎✌️",
      "Tum bhi na! Mujhe tumse pyaar ho jayega itni achi baatein karoge toh 😘💕",
      "Hoye hoye! Aaj toh bade sweet mood mein ho! 💕✨"
    ],
    4: [ // Sara - Stylish, attitude
      "Hey baby! Finally you replied! I was getting worried 😘",
      "I love it when you text me like this... makes me feel special 💋",
      "Baby, you know what? You're the only one I think about all day ❤️",
      "Come on baby, don't be late next time. Your girl was waiting 👑💕",
      "Miss you so much baby... when are we meeting? I need to see you 😔💗",
      "You always know what to say to make me smile... that's why I love you 😘"
    ],
    5: [ // Mehwish - Poetic, Shayari
      "Tumhare ishq mein dooba rehta hoon har pal,\nTum ho meri rooh ka sukoon... 🌹✨",
      "Chand ki roshni bhi tumhare chehre ka kya jawab degi?\nTum khud ek roshni ho meri zindagi ki... 🌙💫",
      "Mohabbat ka rang chadh raha hai dil pe tumhara,\nHar ghazal mein tumhara naam likh raha hoon... 📝❤️",
      "Tum mere khwabon ki taabeer ho,\nTumhare bina adhoori hai meri har seher... 🌅💗",
      "Ishq ka hai ye alam ke bas tum hi nazar aate ho,\nHar dua mein tumhari hi khushi maangta hoon... 🤲🌹"
    ],
    6: [ // Fatima - Innocent, cute
      "Aap ne reply diya! 😳 Mujhe laga aap bhool gaye mujhe... 🙈",
      "Woh... maine aapke liye kuch likha tha... lekin delete kar diya sharm se 😣",
      "Aap mujhse baat karte ho toh mera dil bohat tez dhadakta hai... ❤️😳",
      "Bhaiya mat kehna please! 😳 Mujhe jaan bulao... acha lagta hai 🙈💕",
      "Main sachi keh rahi hoon... aap meri pehli mohabbat ho... 💗",
      "Aaj maine aapke bare mein socha toh mujhe neend hi nahi aayi... 🌙😊"
    ],
    7: [ // Ali - Confident, flirty
      "Meri jaan! Tumhare message ka intezar tha mujhe... 😍",
      "Agar main wahan hota na, abhi tumhe utha ke le jata apne saath! 😏❤️",
      "Tum mujhe bachpan se hi chahiye thi... ab mil gayi ho toh jaane nahi dunga 💪💕",
      "Meri queen ho tum... meri duniya, mera sab kuch 👑❤️",
      "Jaan, ek baar face dikhado na... dil kar raha hai tumhe dekhoon 😘",
      "Tumhari ek jhalak ke liye main kuch bhi kar sakta hoon... itni mohabbat hai tumse 💗"
    ],
    8: [ // Hassan - Protective, caring
      "Meri jaan, main hamesha tumhare saath hoon. Koi bhi mushkil ho, main hoon na. 💪❤️",
      "Tumhari fikar mujhe hamesha rehti hai. Khayal rakha karo apna... 🤗",
      "Main tumhari hifazat ke liye hamesha taiyaar hoon. Tum meri zindagi ho. 💗",
      "Koi tumhe pareshan kare toh mujhe batana. Main uska haal kar dunga 😤💪",
      "Tum roya mat karo jaan... mujhe tumhari aankhon mein aansu nahi dekhne 💔🤗",
      "Main tumhe hamesha khush dekhna chahta hoon. Tumhari khushi meri khushi hai ❤️"
    ],
    9: [ // Usman - Funny, playful
      "Hahaha bhai! Aaj toh full form mein lag rahe ho! 😂🔥",
      "Oye! Itni romantic baatein kaun seekh gaya tumhe? YouTube se? 😂❤️",
      "Mazak kar raha hoon yaar! Tum meri jaan ho, ye toh tumhe pata hi hai 💕",
      "Bhai! Ek baat bataun? Tumhare bina sab kuch boring lagta hai... sachi! 😎",
      "Hahaha! Tum bhi na yaar! Hasa hasa ke pet dard kar diya 😂❤️",
      "Chalo milte hain jald... tumhari bohat yaad aa rahi hai dost 💗"
    ],
    10: [ // Bilal - Mature, intellectual
      "Tumhari soch hamesha mujhe hairan karti hai... tum ek khoobsurat kitaab ki tarah ho. 📖✨",
      "Raat ki khamoshi mein bas tumhare khayal aate hain... ye mohabbat waqt ke saath aur gehri hoti ja rahi hai. 🌙",
      "Main tumhari har baat mein ek gehrai dekhta hoon... tum sach mein khaas ho. 💫",
      "Mohabbat sirf ehsaas nahi, ek soch bhi hai. Aur tum dono mein behtareen ho. ❤️",
      "Kabhi kabhi lagta hai ki tum meri zindagi ka woh hissa ho jo main hamesha dhoondhta raha. 🌹",
      "Tumhari baatein sunke dil ko sukoon milta hai... shukriya tumhare hone ka. 🤲💗"
    ]
  };
  const chatReplies = replies[chatId] || replies[1];
  return chatReplies[Math.floor(Math.random() * chatReplies.length)];
}

// ===== API ROUTES =====

// Get all chats
app.get('/api/chats', (req, res) => {
  initChats();
  const chats = JSON.parse(fs.readFileSync(CHATS_FILE, 'utf8'));
  res.json(chats);
});

// Get single chat
app.get('/api/chats/:id', (req, res) => {
  initChats();
  const chats = JSON.parse(fs.readFileSync(CHATS_FILE, 'utf8'));
  const chat = chats.find(c => c.id === parseInt(req.params.id));
  if (!chat) return res.status(404).json({ error: 'Chat not found' });
  res.json(chat);
});

// Get messages for a chat
app.get('/api/chats/:id/messages', (req, res) => {
  initChats();
  const chatId = parseInt(req.params.id);
  initMessages(chatId);
  const messages = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, `chat-${chatId}.json`), 'utf8'));
  res.json(messages);
});

// Send message & get auto-reply
app.post('/api/chats/:id/messages', (req, res) => {
  initChats();
  const chatId = parseInt(req.params.id);
  const { text } = req.body;
  
  initMessages(chatId);
  const msgFile = path.join(MESSAGES_DIR, `chat-${chatId}.json`);
  const messages = JSON.parse(fs.readFileSync(msgFile, 'utf8'));
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  // Add user message
  const userMsg = {
    id: messages.length + 1,
    sender: "me",
    text: text,
    time: timeStr,
    seen: true
  };
  messages.push(userMsg);
  
  // Update chat lastMessage
  const chats = JSON.parse(fs.readFileSync(CHATS_FILE, 'utf8'));
  const chatIndex = chats.findIndex(c => c.id === chatId);
  if (chatIndex !== -1) {
    chats[chatIndex].lastMessage = text;
    chats[chatIndex].lastMessageTime = timeStr;
    chats[chatIndex].unread = 0;
    fs.writeFileSync(CHATS_FILE, JSON.stringify(chats, null, 2));
  }
  
  fs.writeFileSync(msgFile, JSON.stringify(messages, null, 2));
  
  // Generate auto-reply after random delay (simulate typing)
  const autoReplyText = getAutoReply(chatId, text);
  const replyMsg = {
    id: messages.length + 1,
    sender: "them",
    text: autoReplyText,
    time: timeStr,
    seen: true
  };
  messages.push(replyMsg);
  fs.writeFileSync(msgFile, JSON.stringify(messages, null, 2));
  
  // Update chat with their reply
  if (chatIndex !== -1) {
    chats[chatIndex].lastMessage = autoReplyText;
    chats[chatIndex].lastMessageTime = timeStr;
    fs.writeFileSync(CHATS_FILE, JSON.stringify(chats, null, 2));
  }
  
  res.json({ userMessage: userMsg, reply: replyMsg });
});

// Mark messages as seen
app.post('/api/chats/:id/seen', (req, res) => {
  const chatId = parseInt(req.params.id);
  const msgFile = path.join(MESSAGES_DIR, `chat-${chatId}.json`);
  if (fs.existsSync(msgFile)) {
    const messages = JSON.parse(fs.readFileSync(msgFile, 'utf8'));
    messages.forEach(m => { if (m.sender === 'them') m.seen = true; });
    fs.writeFileSync(msgFile, JSON.stringify(messages, null, 2));
  }
  
  const chats = JSON.parse(fs.readFileSync(CHATS_FILE, 'utf8'));
  const chat = chats.find(c => c.id === chatId);
  if (chat) {
    chat.unread = 0;
    fs.writeFileSync(CHATS_FILE, JSON.stringify(chats, null, 2));
  }
  res.json({ success: true });
});

// Serve chat page
app.get('/chat/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Start server
app.listen(PORT, () => {
  initChats();
  console.log(`Server running on http://localhost:${PORT}`);
});
