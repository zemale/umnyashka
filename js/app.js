// ========== UMNYASHKA APP.JS ==========
// localStorage helpers, XP/badge system, routing utils

const LEVELS = [
  { name: 'Новичок', min: 0, max: 100 },
  { name: 'Ученик', min: 101, max: 300 },
  { name: 'Знаток', min: 301, max: 700 },
  { name: 'Умник', min: 701, max: 1500 },
  { name: 'УмНяшка', min: 1501, max: Infinity }
];

const SUBJECTS = [
  { id: "math", name: "Математика", char: "Макс", emoji: "🔢", color: "#5ba8c4" },
  { id: "algebra", name: "Алгебра", char: "Алекс", emoji: "📐", color: "#7ab8a0" },
  { id: "geo", name: "Геометрия", char: "Геша", emoji: "📏", color: "#8ba0c4" },
  { id: "russian", name: "Русский язык", char: "Рита", emoji: "✍️", color: "#c4908b" },
  { id: "lit", name: "Литература", char: "Вера", emoji: "📚", color: "#b08bc4" },
  { id: "history", name: "История", char: "Иван", emoji: "🏛", color: "#c4a45b" },
  { id: "social", name: "Обществознание", char: "Соня", emoji: "🌍", color: "#7ab893" },
  { id: "physics", name: "Физика", char: "Андрей", emoji: "⚡", color: "#5ba8c4" },
  { id: "chem", name: "Химия", char: "Лиза", emoji: "🧪", color: "#82b87a" },
  { id: "bio", name: "Биология", char: "Дима", emoji: "🌿", color: "#6ba882" },
  { id: "geogr", name: "География", char: "Катя", emoji: "🗺", color: "#e8845a" },
  { id: "english", name: "Английский", char: "Charlotte", emoji: "🇬🇧", color: "#5b8ac4" }
];

// ========== GET / SET ==========
function get(key, def = null) {
  try { const v = localStorage.getItem('umnyashka_' + key); return v !== null ? JSON.parse(v) : def; } catch { return def; }
}
function set(key, val) {
  try { localStorage.setItem('umnyashka_' + key, JSON.stringify(val)); } catch(e) { console.warn('Storage error', e); }
}

// ========== XP ==========
function getXP() { return get('xp', 0); }

function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];
}

function getLevelProgress(xp) {
  const lvl = getLevel(xp);
  if (lvl.max === Infinity) return { pct: 100, current: xp - lvl.min, total: 0, next: '' };
  const current = xp - lvl.min;
  const total = lvl.max - lvl.min;
  const nextLvl = LEVELS[LEVELS.indexOf(lvl) + 1];
  return { pct: Math.min(100, Math.round(current / total * 100)), current, total, next: nextLvl ? nextLvl.name : '' };
}

function addXP(amount, source) {
  const prev = getXP();
  const next = prev + amount;
  set('xp', next);
  
  const prevLvl = getLevel(prev).name;
  const nextLvl = getLevel(next).name;
  
  showXPGain(amount);
  showToast(`+${amount} XP — ${source}`, 'xp');
  
  if (prevLvl !== nextLvl) {
    setTimeout(() => showToast(`🎉 Новый уровень: ${nextLvl}!`, 'badge'), 1000);
  }
  
  updateNavXP();
  return next;
}

// ========== BADGES ==========
function getBadges() { return get('badges', []); }

function checkBadge(badgeId) {
  const badges = getBadges();
  if (badges.includes(badgeId)) return false;
  badges.push(badgeId);
  set('badges', badges);
  
  fetch('data/badges.json').then(r => r.json()).then(all => {
    const badge = all.find(b => b.id === badgeId);
    if (badge) {
      showBadgeUnlock(badge);
      addXP(badge.xp_bonus, 'Значок: ' + badge.name);
    }
  }).catch(() => {
    showBadgeUnlock({ emoji: '🏅', name: badgeId, desc: 'Значок получен!' });
  });
  return true;
}

// ========== TOPICS ==========
function markTopicDone(subjectId, grade, topicId, xp) {
  const topics = get('topics', {});
  const key = `${subjectId}_${grade}_${topicId}`;
  if (topics[key]) return false;
  topics[key] = true;
  set('topics', topics);
  updateStreak();
  addXP(xp || 20, 'Тема пройдена');
  
  // Check first step badge
  if (Object.keys(topics).length === 1) checkBadge('first_step');
  
  // Count topics per subject
  const subjectDone = Object.keys(topics).filter(k => k.startsWith(subjectId + '_')).length;
  if (subjectDone >= 5) checkBadge(subjectId + '_master');
  if (Object.keys(topics).length >= 10) checkBadge('ten_topics');
  if (Object.keys(topics).length >= 50) checkBadge('fifty_topics');
  
  return true;
}

function isTopicDone(subjectId, grade, topicId) {
  const topics = get('topics', {});
  return !!topics[`${subjectId}_${grade}_${topicId}`];
}

function getProgress(subjectId, grade, totalTopics) {
  const topics = get('topics', {});
  const done = Object.keys(topics).filter(k => k.startsWith(`${subjectId}_${grade}_`)).length;
  return { done, total: totalTopics, pct: totalTopics ? Math.round(done / totalTopics * 100) : 0 };
}

// ========== STREAK ==========
function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  let streak = get('streak', { count: 0, last: null });
  const dates = get('active_dates', []);
  
  if (!dates.includes(today)) {
    dates.push(today);
    if (dates.length > 60) dates.shift();
    set('active_dates', dates);
  }
  
  if (streak.last === today) return streak.count;
  
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (streak.last === yesterday) {
    streak.count++;
  } else {
    streak.count = 1;
  }
  streak.last = today;
  set('streak', streak);
  
  if (streak.count >= 7) checkBadge('week_streak');
  if (streak.count >= 30) checkBadge('month_streak');
  
  return streak.count;
}

function getStreak() {
  return get('streak', { count: 0, last: null }).count;
}

// ========== PROFILE ==========
function getProfile() { return get('profile', { nickname: 'Умняшка', avatar: '🦊' }); }
function setProfile(data) { set('profile', data); }

// ========== GRADE ==========
function getGrade() { return parseInt(get('grade', 7)); }
function setGrade(g) { set('grade', g); }

// ========== NAV ==========
function updateNavXP() {
  const xpEl = document.getElementById('nav-xp');
  const streakEl = document.getElementById('nav-streak');
  if (xpEl) xpEl.textContent = '⭐ ' + getXP() + ' XP';
  if (streakEl) streakEl.textContent = '🔥 ' + getStreak();
}

function initNav() {
  const links = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.nav-hamburger');
  if (hamburger && links) {
    hamburger.addEventListener('click', () => links.classList.toggle('open'));
  }
  updateNavXP();
  updateStreak();
}

// ========== EXERCISES XP ==========
function completeExercises(subjectId, grade, topicId, xp) {
  const key = `ex_${subjectId}_${grade}_${topicId}`;
  if (get(key)) return false;
  set(key, true);
  addXP(xp || 10, 'Упражнения');
  
  // Stats
  const exDone = get('exercises_done', 0);
  set('exercises_done', exDone + 1);
  
  return true;
}

// ========== SUBJECT LOOKUP ==========
function getSubject(id) { return SUBJECTS.find(s => s.id === id); }

// Init
document.addEventListener('DOMContentLoaded', initNav);
