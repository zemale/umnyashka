// ========== UI COMPONENTS ==========

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showXPGain(amount) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = '+' + amount + ' XP';
  el.style.left = (Math.random() * 60 + 20) + '%';
  el.style.bottom = '80px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

function showBadgeUnlock(badge) {
  let modal = document.getElementById('badge-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'badge-modal';
    modal.innerHTML = `
      <div class="badge-modal-inner">
        <div class="badge-modal-emoji" id="badge-m-emoji"></div>
        <div class="badge-modal-title">Новый значок!</div>
        <div style="font-size:1.2rem;font-weight:800;color:var(--brown);margin:8px 0" id="badge-m-name"></div>
        <div class="badge-modal-desc" id="badge-m-desc"></div>
        <button class="btn btn-primary" onclick="document.getElementById('badge-modal').classList.remove('show')">Отлично! 🎉</button>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
  }
  document.getElementById('badge-m-emoji').textContent = badge.emoji;
  document.getElementById('badge-m-name').textContent = badge.name;
  document.getElementById('badge-m-desc').textContent = badge.desc;
  modal.classList.add('show');
}

function renderNavXP() {
  const xp = getXP();
  const streak = getStreak();
  const xpEl = document.getElementById('nav-xp');
  const sEl = document.getElementById('nav-streak');
  if (xpEl) xpEl.textContent = '⭐ ' + xp + ' XP';
  if (sEl) sEl.textContent = '🔥 ' + streak;
}

// Stars for difficulty
function renderStars(n) {
  return '⭐'.repeat(n) + '☆'.repeat(3 - n);
}

// Grade selector
function initGradeSelector(onChange) {
  const btns = document.querySelectorAll('.grade-btn');
  const current = getGrade();
  btns.forEach(btn => {
    const g = parseInt(btn.dataset.grade);
    if (g === current) btn.classList.add('active');
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setGrade(g);
      if (onChange) onChange(g);
    });
  });
  return current;
}

// Progress bar helper
function setProgress(fillId, pct) {
  const el = document.getElementById(fillId);
  if (el) el.style.width = pct + '%';
}
