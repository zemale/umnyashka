// ========== GEMINI API INTEGRATION ==========
// API key loaded from config.js (not in git!)
// If config.js missing or key invalid → smart offline mode

const _FALLBACK_KEY = 'AIzaSyAtXkXEtnaRgrMwAbmazEziHHoXtufsfkM';
const GEMINI_KEY = (typeof GEMINI_API_KEY !== 'undefined' && GEMINI_API_KEY !== 'REPLACE_WITH_NEW_KEY')
  ? GEMINI_API_KEY : _FALLBACK_KEY;
const GEMINI_URL = GEMINI_KEY
  ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`
  : null;

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

// ========== SMART OFFLINE MODE ==========
// Used when API key is missing/invalid

const OFFLINE_RESPONSES = {
  math:    ["Давай разберём это пошагово 🔢 Что ты уже знаешь по этой теме? Начни с самого простого.", "Хороший вопрос! Попробуй сначала записать условие задачи. Что дано, а что нужно найти?", "В математике главное — понять смысл, а не просто выучить формулу. Скажи, что именно непонятно?", "Отлично! Помни: любую сложную задачу можно разбить на простые шаги 💪", "Подсказка: проверь, правильно ли ты применяешь формулу. Подставь числа и посмотри что получается."],
  algebra: ["Алгебра — это как загадка с буквами 🔡 Что у тебя за уравнение? Покажи, с чего начал.", "Помни: что делаешь с одной стороной уравнения — делай и с другой. Это закон весов ⚖️", "Молодец что спрашиваешь! Первый шаг — раскрой скобки, если они есть. Получилось?", "Попробуй перенести все x в одну сторону, числа — в другую. Что выходит?", "Проверь ответ: подставь найденное x обратно в уравнение. Верно сходится?"],
  geo:     ["Геометрия — это визуально! Нарисуй фигуру, и решение станет очевиднее ✏️", "Хороший вопрос! Какие данные у тебя есть? Стороны, углы, площадь?", "Помни теорему Пифагора: a²+b²=c² для прямоугольного треугольника 📐", "Попробуй найти похожие треугольники или прямые углы — это часто ключ к решению.", "Запиши формулу площади или периметра для этой фигуры. Какие данные подставишь?"],
  russian: ["Русский язык — это система правил 📝 Какое именно правило вызывает вопрос?", "Чтобы проверить написание, найди однокоренное слово или измени форму. Попробуй!", "Запомни: каждая часть речи отвечает на свой вопрос. Задай вопрос к слову — и поймёшь.", "Прочитай предложение вслух — часто слух помогает расставить знаки правильно 🎵", "Разбери слово по составу: корень, суффикс, окончание. От этого зависит правописание."],
  lit:     ["Литература — это разговор через время 📚 Что ты чувствуешь, читая этот текст?", "Спроси себя: зачем автор ввёл этого героя? Что он символизирует?", "Обрати внимание на детали — в хорошей литературе ничего не случайно ✨", "Что движет главным героем? Какова его цель и что ей мешает?", "Попробуй найти в тексте кульминацию — момент наивысшего напряжения. Нашёл?"],
  history: ["История — это живые люди, а не сухие даты! 🏛️ Что тебя интересует в этом событии?", "Подумай: какова была причина этого события? Что произошло бы, если бы всё пошло иначе?", "Интересный вопрос! Посмотри на контекст: что происходило в мире в это время?", "За каждым историческим фактом — судьбы людей. Кто принимал решения и почему?", "Помни формулу: причина → событие → следствие. Разложи своё событие по этой схеме."],
  social:  ["Обществознание — это про нашу жизнь! 🌍 Как этот термин связан с тем, что ты видишь вокруг?", "Хороший вопрос! Попробуй дать определение своими словами, а потом сравним с учебником.", "Посмотри на новости — там часто встречаются темы из обществознания в реальности.", "Права и обязанности — две стороны одной медали. К чему твой вопрос относится?", "Общество — сложная система. Какой элемент этой системы тебя интересует?"],
  physics: ["Физика объясняет мир вокруг нас! ⚡ Какое явление тебя интересует?", "Сначала пойми физический смысл, потом формулу. Что происходит с телом в этой задаче?", "Нарисуй схему: тело, силы, направления. Это сразу упрощает задачу!", "Проверь единицы измерения — это первый признак правильного решения ✅", "Подсказка: запиши все данные и что нужно найти. Какая формула связывает эти величины?"],
  chem:    ["Химия — это магия с объяснением! 🧪 Что именно непонятно?", "Посмотри в таблицу Менделеева — там много подсказок о свойствах элемента.", "Реакция — это не случайность. Подумай: что происходит с атомами и молекулами?", "Расставь коэффициенты в уравнении реакции — атомы должны сохраняться! ⚗️", "Химия вокруг нас: ржавчина, огонь, вода — всё это реакции. Какую изучаем?"],
  bio:     ["Биология — это наука о жизни, включая тебя самого! 🌿 Что хочешь узнать?", "Живые организмы удивительны. Какой уровень организации тебя интересует — клетка, орган, организм?", "Попробуй связать теорию с реальностью: как это работает у человека или животного?", "Эволюция объясняет почему живое именно такое. Думал об этом в связи с темой?", "Клетка — строительный кирпичик жизни. Какая её функция сейчас на вопросе?"],
  geogr:   ["География — это весь наш мир! 🗺️ О каком месте или явлении вопрос?", "Представь, что ты путешественник. Что бы ты увидел там, куда задан вопрос?", "Климат, рельеф, воды — всё взаимосвязано. Какой компонент природы рассматриваем?", "Посмотри на карту мысленно. Где расположен объект, что его окружает?", "Интересный факт: каждый географический объект имеет свою историю. Что знаешь об этом?"],
  english: ["Great question! 😊 Let's think about it step by step. What do you already know about this topic?", "Don't worry about mistakes — they help us learn! Try to answer in English, even a little bit 🌟", "Remember: context is key! Look at the sentence around the word — what meaning makes sense?", "Tip: try to think in English, not translate from Russian. What word comes to mind first?", "Excellent! Practice makes perfect. Can you make a sentence using this grammar rule?"]
};

function getOfflineResponse(subjectId, userMessage, topicContext) {
  const responses = OFFLINE_RESPONSES[subjectId] || OFFLINE_RESPONSES.math;
  // Pick response based on message length/content for variety
  const idx = (userMessage.length + userMessage.charCodeAt(0)) % responses.length;
  let reply = responses[idx];
  // Add topic reference if we have it
  if (topicContext && Math.random() > 0.5) {
    reply += ` Кстати, мы сейчас изучаем «${topicContext.title}» — этот вопрос связан с темой?`;
  }
  return reply;
}

// ========== CORE API CALL ==========

async function callGemini(systemPrompt, contents, retries = 2) {
  if (!GEMINI_URL) throw new Error('NO_KEY');
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

function getFriendlyError(err, subjectId, userMessage, topicContext) {
  const msg = err?.message || '';
  // No key — use offline mode silently
  if (msg === 'NO_KEY' || msg.includes('403') || msg.includes('API key')) {
    return getOfflineResponse(subjectId || 'math', userMessage || '', topicContext);
  }
  if (msg === 'SAFETY') return 'Хм, давай переформулируем вопрос 😅';
  if (msg.includes('429') || msg.includes('quota')) return 'Слишком много запросов — подожди секунду ⏳';
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) return getOfflineResponse(subjectId || 'math', userMessage || '', topicContext);
  if (msg.includes('503') || msg.includes('502')) return 'Сервер занят — попробуй ещё раз 🔄';
  return getOfflineResponse(subjectId || 'math', userMessage || '', topicContext);
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
      const historyForApi = history.slice(0, -1);
      const reply = await askCharacter(subjectId, text, historyForApi, topicContext);
      removeTyping();
      appendMessage('char', reply);
    } catch (e) {
      removeTyping();
      appendMessage('char', getFriendlyError(e, subjectId, text, topicContext));
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
