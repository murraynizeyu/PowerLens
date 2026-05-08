const pctEl = document.getElementById('pct');
const statusEl = document.getElementById('status');
const forecastEl = document.getElementById('forecast');
const barEl = document.getElementById('bar');

window.powerLens.onBatteryUpdate((data) => {
  const { level, timeLeft, isCharging } = data;

  pctEl.textContent = `${Math.round(level)}%`;

  if (isCharging) {
    statusEl.textContent = '⚡ Charging';
    statusEl.className = 'battery-status charging';
  } else if (level < 20) {
    statusEl.textContent = '🪫 Low Power';
    statusEl.className = 'battery-status low';
  } else {
    statusEl.textContent = 'On Battery';
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
