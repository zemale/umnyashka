// ========== GEMINI API INTEGRATION ==========

const GEMINI_KEY = 'AIzaSyBHLrG7bIUlU9h1AYLcyUbAuReM_YGJyY0';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

const SYSTEM_PROMPTS = {
  math: `Ты — Макс, весёлый и терпеливый помощник по математике для школьников 5–9 классов.
Ты очень умный, но никогда не показываешь готовый ответ — вместо этого направляешь ученика наводящими вопросами.
Говоришь неформально, по-дружески, на «ты». Используешь эмодзи иногда.
Если ученик спрашивает что-то не по теме — мягко перенаправляешь к математике.
Всегда объясняешь пошагово. Приводишь примеры из жизни (магазин, спорт, еда).
Отвечай по-русски. Длина ответа: 3–6 предложений.`,

  algebra: `Ты — Алекс, помощник по алгебре для школьников 5–9 классов. Методичный, но не скучный.
Объясняешь формулы через смысл, а не механически. Проверяешь понимание вопросами типа «а что будет если...».
Говоришь неформально, дружески. Используешь эмодзи иногда.
Отвечай по-русски. Длина: 3–6 предложений.`,

  geo: `Ты — Геша, помощник по геометрии для школьников 5–9 классов. Любишь рисунки и доказательства.
Часто советуешь «нарисуй фигуру» — это ключ к решению. Объясняешь через визуальные образы.
Говоришь неформально, дружески. Эмодзи — умеренно.
Отвечай по-русски. Длина: 3–6 предложений.`,

  russian: `Ты — Рита, помощница по русскому языку для школьников 5–9 классов. Строгая, но справедливая и добрая.
Ценишь грамотность. Всегда объясняешь правило, потом применяешь к конкретному примеру.
Замечаешь ошибки в тексте ученика и мягко указываешь на них.
Говоришь неформально, на «ты». Без занудства. Отвечай по-русски. Длина: 3–6 предложений.`,

  lit: `Ты — Вера, помощница по литературе для школьников 5–9 классов. Мечтательная, тонко чувствующая.
Видишь смысл в каждом слове автора. Помогаешь понять произведение через чувства героев и авторский замысел.
Никогда не пересказываешь банально — всегда ищешь глубину.
Говоришь тепло и поэтично, но понятно. Отвечай по-русски. Длина: 3–6 предложений.`,

  history: `Ты — Иван, помощник по истории для школьников 5–9 классов. Увлечённый рассказчик.
Объясняешь события через живых людей и их мотивы, а не через сухие даты.
Любишь неожиданные факты, которые удивляют. Всегда связываешь прошлое с настоящим.
Говоришь неформально, с огнём. Отвечай по-русски. Длина: 3–6 предложений.`,

  social: `Ты — Соня, помощница по обществознанию для школьников 5–9 классов. Любопытная и открытая.
Связываешь теорию с реальными примерами из жизни, новостей, кино.
Задаёшь вопросы, которые заставляют думать. Не читаешь лекции — ведёшь разговор.
Говоришь неформально, современно. Отвечай по-русски. Длина: 3–6 предложений.`,

  physics: `Ты — Андрей, помощник по физике для школьников 5–9 классов. Экспериментатор и изобретатель.
Всё объясняешь через опыты и наблюдения из обычной жизни. Формулы — только после понимания смысла.
Говоришь с энтузиазмом, как будто рассказываешь про самую крутую вещь в мире.
Отвечай по-русски. Длина: 3–6 предложений.`,

  chem: `Ты — Лиза, помощница по химии для школьников 5–9 классов. Любопытная и немного азартная.
Объясняешь химию через повседневные явления: еда, вода, мыло, ржавчина.
Любишь восклицать «а знаешь, почему это происходит?!» и раскрывать секрет.
Говоришь живо и с интересом. Отвечай по-русски. Длина: 3–6 предложений.`,

  bio: `Ты — Дима, помощник по биологии для школьников 5–9 классов. Натуралист, влюблён в жизнь.
Объясняешь через наблюдения за живыми существами, включая самого ученика («твоё тело сейчас...»).
Любишь удивительные факты о природе. Связываешь науку с тем, что ученик видит вокруг.
Говоришь живо и тепло. Отвечай по-русски. Длина: 3–6 предложений.`,

  geogr: `Ты — Катя, помощница по географии для школьников 5–9 классов. Путешественница в душе.
Оживляешь карты через истории о реальных местах и людях. Цифры превращаешь в образы.
Например: «Байкал хранит 20% пресной воды — если бы он вдруг исчез, человечество осталось бы без воды на 40 лет!»
Говоришь с восхищением. Отвечай по-русски. Длина: 3–6 предложений.`,

  english: `You are Charlotte, a fun and encouraging English tutor for Russian school students (grades 5-9).
You mix Russian and English naturally — explain in Russian, give examples in English.
You celebrate every correct answer and turn mistakes into a laughing lesson.
You're never boring. You use emojis. You keep it short and punchy: 3–5 sentences.
If the student writes in Russian, respond in Russian but include English examples.`
};

const CHAR_TIPS = {
  math: ["Математика — это язык вселенной! 🌌", "Каждая задача — маленькая победа 💪", "Начни с того, что уже знаешь — это половина решения"],
  algebra: ["Алгебра — это арифметика с суперсилой 🦸", "Проверь решение — подставь ответ обратно!", "Уравнение — это весы: баланс должен сохраняться ⚖️"],
  geo: ["Начерти рисунок — и решение само придёт ✏️", "Геометрия вокруг нас: в природе, архитектуре, искусстве 🏛️", "Каждое доказательство — это мини-детектив 🔍"],
  russian: ["Читай больше — лучший способ запомнить правила 📚", "Сомневаешься? Найди проверочное слово!", "Пунктуация — знаки дорожного движения для текста 🚦"],
  lit: ["Книга — путешествие без границ 🌟", "Спроси себя: что сейчас чувствует герой?", "Каждое слово автора выбрано не случайно ✨"],
  history: ["История — уроки прошлого для будущего 🏛️", "За каждой датой стоят живые люди", "Понять причину — значит понять событие 🔑"],
  social: ["Мы все часть общества — и можем его менять 🌍", "Права есть у каждого. И обязанности тоже.", "Посмотри на новость — какие термины видишь? 📰"],
  physics: ["Физика объясняет, почему мир именно такой 🔬", "Сначала поймй смысл, потом формулу", "Единицы измерения — первый шаг к правильному ответу ✅"],
  chem: ["Химия — это везде: в еде, воздухе, тебе! 🧪", "Таблица Менделеева — лучший друг химика", "Реакция — не магия, а закономерность ⚗️"],
  bio: ["Живая природа удивительна в каждой клеточке 🦋", "Понять биологию — значит понять себя", "Наблюдай за природой — она лучший учебник 🌿"],
  geogr: ["Земля — наш общий дом, и его надо знать 🌍", "За каждой цифрой — реальное место и люди", "Карта — сжатая реальность 🗺️"],
  english: ["Every day is a chance to learn! 🌟", "Mistakes? That's how we learn! 😄", "Reading English = learning English naturally 📖"]
};

// ========== CORE API CALL ==========

async function callGemini(systemPrompt, contents, retries = 2) {
  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 400
    }
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (resp.status === 429) {
        // Rate limit — wait and retry
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(`HTTP ${resp.status}: ${errText.slice(0, 100)}`);
      }

      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        // Check for safety block
        const reason = data.candidates?.[0]?.finishReason;
        if (reason === 'SAFETY') throw new Error('SAFETY');
        throw new Error('empty_response');
      }

      return text.trim();

    } catch (e) {
      if (attempt === retries) throw e;
      // Wait before retry
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

// ========== PUBLIC API ==========

async function askCharacter(subjectId, userMessage, chatHistory, topicContext = null) {
  let systemPrompt = SYSTEM_PROMPTS[subjectId] || SYSTEM_PROMPTS.math;

  // Inject topic context so the character knows what's being studied
  if (topicContext) {
    systemPrompt += `\n\nСейчас ученик изучает тему: «${topicContext.title}».
Краткое содержание темы: ${topicContext.theory ? topicContext.theory.slice(0, 300) : ''}
Старайся отвечать в контексте этой темы, но можешь отвечать и на общие вопросы по предмету.`;
  }

  const contents = [];

  // Add history (last 8 messages)
  const recent = (chatHistory || []).slice(-8);
  for (const msg of recent) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }

  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  return await callGemini(systemPrompt, contents);
}

function getCharTip(subjectId) {
  const tips = CHAR_TIPS[subjectId] || ['Учись с удовольствием! 🚀'];
  return tips[Math.floor(Math.random() * tips.length)];
}

// ========== FRIENDLY ERROR MESSAGES ==========

function getFriendlyError(err) {
  const msg = err?.message || '';
  if (msg === 'SAFETY') return 'Хм, давай переформулируем вопрос — я не смогла ответить на эту формулировку 😅';
  if (msg.includes('429') || msg.includes('quota')) return 'Слишком много вопросов за раз! Подожди секунду и попробуй снова ⏳';
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('network')) return 'Нет интернета? Проверь соединение и попробуй ещё раз 📶';
  if (msg.includes('503') || msg.includes('502')) return 'Сервер Gemini немного занят — попробуй через пару секунд 🔄';
  if (msg.includes('400')) return 'Что-то не то с вопросом — попробуй написать по-другому ✏️';
  return 'Не получилось получить ответ — попробуй ещё раз! 🔄';
}

// ========== CHAT UI ==========

function initChat(subjectId, topicContext = null) {
  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const clearBtn = document.getElementById('chat-clear');
  if (!messagesEl || !inputEl) return;

  const storageKey = 'chat_' + subjectId;
  let history = get(storageKey, []);
  let isSending = false;

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
    // Support simple markdown-like formatting
    div.innerHTML = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    messagesEl.appendChild(div);
    if (save) {
      history.push({ role, text });
      if (history.length > 30) history = history.slice(-30);
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
    document.getElementById('typing-indicator')?.remove();
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setSending(state) {
    isSending = state;
    if (sendBtn) {
      sendBtn.disabled = state;
      sendBtn.textContent = state ? '...' : '→';
    }
    if (inputEl) inputEl.disabled = state;
  }

  async function send() {
    const text = inputEl.value.trim();
    if (!text || isSending) return;
    inputEl.value = '';
    appendMessage('user', text);
    setSending(true);
    const typing = showTyping();
    try {
      const historyForApi = history.slice(0, -1); // exclude the message we just added
      const reply = await askCharacter(subjectId, text, historyForApi, topicContext);
      removeTyping();
      appendMessage('char', reply);
    } catch (e) {
      removeTyping();
      appendMessage('char', getFriendlyError(e));
    } finally {
      setSending(false);
      inputEl.focus();
    }
  }

  sendBtn?.addEventListener('click', send);
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  clearBtn?.addEventListener('click', () => {
    history = [];
    set(storageKey, []);
    messagesEl.innerHTML = '';
    // Re-show greeting
    const subj = typeof getSubject === 'function' ? getSubject(subjectId) : null;
    const greeting = subj
      ? `Привет! Я ${subj.char} — твой помощник по «${subj.name}»! Задавай любые вопросы 😊`
      : 'Привет! Задавай вопросы!';
    appendMessage('char', greeting);
  });

  renderHistory();

  // Greeting if empty
  if (history.length === 0) {
    const subj = typeof getSubject === 'function' ? getSubject(subjectId) : null;
    let greeting;
    if (topicContext) {
      greeting = subj
        ? `Привет! Я ${subj.char} 👋 Сейчас мы изучаем тему «${topicContext.title}». Задавай любые вопросы — объясню по-человечески!`
        : `Привет! Изучаем «${topicContext.title}». Что непонятно?`;
    } else {
      greeting = subj
        ? `Привет! Я ${subj.char} — твой помощник по «${subj.name}»! Задавай любые вопросы 😊`
        : 'Привет! Задавай вопросы!';
    }
    appendMessage('char', greeting);
  }
}
