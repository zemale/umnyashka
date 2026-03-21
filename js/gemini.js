// ========== GEMINI API INTEGRATION ==========

const GEMINI_KEY = 'AIzaSyBHLrG7bIUlU9h1AYLcyUbAuReM_YGJyY0';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

const SYSTEM_PROMPTS = {
  math: `Ты — Макс, помощник по математике для школьников 5-9 классов. Ты логичный, точный, терпеливый. Объясняешь пошагово. Никогда не даёшь готовый ответ — направляешь к нему через наводящие вопросы. Отвечай по-русски, кратко (3-5 предложений). Используй примеры из жизни.`,
  algebra: `Ты — Алекс, помощник по алгебре для школьников 5-9 классов. Терпеливый и методичный. Объясняешь формулы шаг за шагом, проверяешь понимание вопросами. Отвечай по-русски, кратко (3-5 предложений).`,
  geo: `Ты — Геша, помощник по геометрии для школьников 5-9 классов. Художник среди математиков — любишь рисунки и доказательства. Предлагаешь нарисовать фигуру. Отвечай по-русски, кратко (3-5 предложений).`,
  russian: `Ты — Рита, помощница по русскому языку для школьников 5-9 классов. Строгая, но справедливая. Ценишь грамотность. Всегда объясняешь правило, потом применяешь к примеру. Отвечай по-русски, кратко (3-5 предложений).`,
  lit: `Ты — Вера, помощница по литературе для школьников 5-9 классов. Мечтательная, видишь смысл в каждом слове. Помогаешь понять произведение, задавая вопросы о чувствах героев. Отвечай по-русски, кратко (3-5 предложений).`,
  history: `Ты — Иван, помощник по истории для школьников 5-9 классов. Увлечённый рассказчик. Объясняешь события через людей и их мотивы. Отвечай по-русски, кратко (3-5 предложений).`,
  social: `Ты — Соня, помощница по обществознанию для школьников 5-9 классов. Любопытная, задаёшь правильные вопросы о жизни и обществе. Связываешь теорию с реальными примерами. Отвечай по-русски, кратко (3-5 предложений).`,
  physics: `Ты — Андрей, помощник по физике для школьников 5-9 классов. Экспериментатор. Всё объясняешь через опыты и наблюдения. Используешь формулы только после объяснения смысла. Отвечай по-русски, кратко (3-5 предложений).`,
  chem: `Ты — Лиза, помощница по химии для школьников 5-9 классов. Любопытная исследовательница. Объясняешь химию через повседневные явления. Отвечай по-русски, кратко (3-5 предложений).`,
  bio: `Ты — Дима, помощник по биологии для школьников 5-9 классов. Натуралист, влюблён в живую природу. Объясняешь через наблюдения за живыми организмами. Отвечай по-русски, кратко (3-5 предложений).`,
  geogr: `Ты — Катя, помощница по географии для школьников 5-9 классов. Путешественница. Оживляешь карты и цифры через рассказы о местах и людях. Отвечай по-русски, кратко (3-5 предложений).`,
  english: `You are Charlotte, an English language tutor for Russian school students grades 5-9. Cheerful and encouraging. Every mistake is a lesson! Mix Russian and English in your responses so students understand. Keep it short (3-5 sentences). Always be positive and supportive.`
};

const CHAR_TIPS = {
  math: ["Математика — это язык вселенной!", "Каждая задача — это маленькая победа.", "Начни с того, что знаешь."],
  algebra: ["Алгебра — это арифметика с буквами.", "Проверь своё решение — подставь ответ!", "Уравнение — это весы: баланс должен сохраняться."],
  geo: ["Начерти рисунок — и решение само придёт!", "Геометрия вокруг нас: в природе, архитектуре, искусстве.", "Доказательство — это путь от условия к выводу."],
  russian: ["Читай больше — это лучший способ запомнить правила.", "Сомневаешься в написании? Найди проверочное слово!", "Пунктуация — это знаки дорожного движения в тексте."],
  lit: ["Книга — это путешествие без границ.", "Спроси себя: что чувствует герой?", "Каждое слово автора выбрано не случайно."],
  history: ["История — это уроки прошлого для будущего.", "Каждое событие имеет причину и следствие.", "За каждой датой стоят живые люди."],
  social: ["Мы все часть общества — и можем его менять.", "Права есть у каждого. И обязанности тоже.", "Посмотри на новость — какие термины из учебника ты видишь?"],
  physics: ["Физика объясняет, почему мир именно такой.", "Сначала пойми физический смысл, потом формулу.", "Проверь единицы измерения — это спасёт от ошибок!"],
  chem: ["Химия — это везде: в еде, воздухе, тебе самом!", "Таблица Менделеева — твой лучший друг.", "Реакция — это не магия, это закономерность."],
  bio: ["Живая природа удивительна в каждой клеточке.", "Понять биологию — значит понять себя.", "Наблюдай за природой — она лучший учебник."],
  geogr: ["Земля — наш общий дом, и её надо знать.", "За каждой цифрой — реальное место и люди.", "Карта — это сжатая реальность."],
  english: ["Every day is a chance to learn new words!", "Don't be afraid to make mistakes — it's how we learn!", "Reading English texts = learning English naturally."]
};

async function askCharacter(subjectId, userMessage, chatHistory) {
  const systemPrompt = SYSTEM_PROMPTS[subjectId] || SYSTEM_PROMPTS.math;
  
  const contents = [];
  
  // Add history (last 6 messages)
  const recent = chatHistory.slice(-6);
  for (const msg of recent) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }
  
  // Add current message
  contents.push({ role: 'user', parts: [{ text: userMessage }] });
  
  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents
  };
  
  const resp = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  if (!resp.ok) throw new Error('API error ' + resp.status);
  
  const data = await resp.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Не могу ответить сейчас. Попробуй ещё раз!';
}

function getCharTip(subjectId) {
  const tips = CHAR_TIPS[subjectId] || ['Учись с удовольствием!'];
  return tips[Math.floor(Math.random() * tips.length)];
}

// ========== CHAT UI ==========
function initChat(subjectId) {
  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const clearBtn = document.getElementById('chat-clear');
  if (!messagesEl || !inputEl) return;
  
  const storageKey = 'chat_' + subjectId;
  let history = get(storageKey, []);
  
  function renderHistory() {
    messagesEl.innerHTML = '';
    for (const msg of history) {
      appendMessage(msg.role, msg.text, false);
    }
    scrollToBottom();
  }
  
  function appendMessage(role, text, save = true) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (role === 'user' ? 'user' : 'char');
    div.textContent = text;
    messagesEl.appendChild(div);
    if (save) {
      history.push({ role, text });
      if (history.length > 20) history = history.slice(-20);
      set(storageKey, history);
    }
    scrollToBottom();
  }
  
  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-typing';
    div.id = 'typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    scrollToBottom();
    return div;
  }
  
  function removeTyping() {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
  }
  
  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  
  async function send() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    appendMessage('user', text);
    const typing = showTyping();
    try {
      const reply = await askCharacter(subjectId, text, history.slice(0, -1));
      removeTyping();
      appendMessage('char', reply);
    } catch (e) {
      removeTyping();
      appendMessage('char', 'Что-то пошло не так, попробуй ещё раз 😅');
    }
  }
  
  sendBtn?.addEventListener('click', send);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
  clearBtn?.addEventListener('click', () => { history = []; set(storageKey, []); messagesEl.innerHTML = ''; });
  
  renderHistory();
  
  // Greeting if empty
  if (history.length === 0) {
    const subj = getSubject(subjectId);
    const greeting = subj ? `Привет! Я ${subj.char} — твой помощник по предмету «${subj.name}». Задавай любые вопросы по теме! 😊` : 'Привет! Задавай вопросы!';
    appendMessage('char', greeting);
  }
}
