const pctEl = document.getElementById('pct');
const statusEl = document.getElementById('status');
const forecastEl = document.getElementById('forecast');
const barEl = document.getElementById('bar');

// ── Battery updates ──────────────────────────────────────────────

window.powerLens.onBatteryUpdate((data) => {
  const { level, timeLeft, isCharging } = data;

  pctEl.textContent = `${Math.round(level)}%`;

  if (isCharging) {
    statusEl.textContent = '⚡ 充电中';
    statusEl.className = 'battery-status charging';
  } else if (level < 20) {
    statusEl.textContent = '🪫 电量不足';
    statusEl.className = 'battery-status low';
  } else {
    statusEl.textContent = '使用电池';
    statusEl.className = 'battery-status';
  }

  forecastEl.textContent = `⏳ ${timeLeft}`;

  barEl.style.width = `${level}%`;
  barEl.classList.remove('low', 'medium');
  if (level < 20) {
    barEl.classList.add('low');
  } else if (level < 50) {
    barEl.classList.add('medium');
  }
});

// ── Gear menu ────────────────────────────────────────────────────

const gearBtn = document.getElementById('gearBtn');
const menuDrop = document.getElementById('menuDrop');
const gearWrap = document.getElementById('gearWrap');

gearBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  menuDrop.classList.toggle('open');
});

// Close menu when clicking outside
document.addEventListener('click', () => {
  menuDrop.classList.remove('open');
});

// Close menu on blur (popover loses focus)
window.addEventListener('blur', () => {
  menuDrop.classList.remove('open');
});

// Menu actions
document.getElementById('restartBtn').addEventListener('click', () => {
  window.powerLens.restartApp();
});

document.getElementById('quitBtn').addEventListener('click', () => {
  window.powerLens.quitApp();
});
