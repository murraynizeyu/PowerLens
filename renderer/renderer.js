const pctEl = document.getElementById('pct');
const statusEl = document.getElementById('status');
const forecastEl = document.getElementById('forecast');
const canvas = document.getElementById('sparkline');
const ctx = canvas.getContext('2d');

// ── Canvas setup (HiDPI) ────────────────────────────────────────

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = 50 * dpr;
  canvas.style.height = '50px';
  ctx.scale(dpr, dpr);
}

resizeCanvas();
const cw = () => canvas.parentElement.getBoundingClientRect().width;
const ch = 50;

// ── Sparkline render ────────────────────────────────────────────

function drawChart(chartData) {
  const w = cw();
  const h = ch;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!chartData || chartData.length < 2) {
    ctx.fillStyle = '#8e8e93';
    ctx.font = '11px -apple-system, sans-serif';
    ctx.fillText('收集数据中...', 4, h / 2 + 4);
    return;
  }

  const values = chartData.map(d => d.v);
  const min = Math.floor(Math.min(...values) / 5) * 5;
  const max = Math.ceil(Math.max(...values) / 5) * 5;
  const range = max - min || 1;

  const pad = 2;
  const stepX = (w - pad * 2) / (chartData.length - 1);

  const toX = (i) => pad + i * stepX;
  const toY = (v) => pad + h - pad * 2 - ((v - min) / range) * (h - pad * 2 - 10);

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(48, 209, 88, 0.3)');
  grad.addColorStop(1, 'rgba(48, 209, 88, 0.02)');

  // Build path
  ctx.beginPath();
  ctx.moveTo(toX(0), toY(values[0]));
  for (let i = 1; i < values.length; i++) {
    ctx.lineTo(toX(i), toY(values[i]));
  }

  // Area fill
  ctx.lineTo(toX(values.length - 1), h - pad);
  ctx.lineTo(toX(0), h - pad);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(toX(0), toY(values[0]));
  for (let i = 1; i < values.length; i++) {
    ctx.lineTo(toX(i), toY(values[i]));
  }
  ctx.strokeStyle = '#30d158';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

// ── Battery updates ─────────────────────────────────────────────

window.powerLens.onBatteryUpdate((data) => {
  const { level, timeLeft, isCharging, health, chartData } = data;

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

  // Chart
  drawChart(chartData);

  // Health stats
  const cyclesEl = document.getElementById('cycles');
  const healthPctEl = document.getElementById('healthPct');
  const conditionEl = document.getElementById('condition');

  if (health) {
    cyclesEl.textContent = health.cycles != null ? health.cycles : '--';

    if (health.healthPct != null) {
      healthPctEl.textContent = health.healthPct + '%';
      healthPctEl.className = 'val ' +
        (health.healthPct >= 90 ? 'good' : health.healthPct >= 80 ? 'warn' : 'bad');
    } else {
      healthPctEl.textContent = '--';
      healthPctEl.className = 'val';
    }

    const condMap = {
      'Normal': '正常',
      'Service Recommended': '需维修',
      'Replace Soon': '即将更换',
      'Replace Now': '立即更换',
    };
    conditionEl.textContent = condMap[health.condition] || health.condition || '--';

    if (health.condition === 'Normal') {
      conditionEl.className = 'val good';
    } else if (health.condition === 'Service Recommended') {
      conditionEl.className = 'val warn';
    } else if (health.condition === 'Replace Soon' || health.condition === 'Replace Now') {
      conditionEl.className = 'val bad';
    } else {
      conditionEl.className = 'val';
    }
  }
});

// ── Gear menu ────────────────────────────────────────────────────

const gearBtn = document.getElementById('gearBtn');
const menuDrop = document.getElementById('menuDrop');

gearBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  menuDrop.classList.toggle('open');
});

document.addEventListener('click', () => {
  menuDrop.classList.remove('open');
});

window.addEventListener('blur', () => {
  menuDrop.classList.remove('open');
});

document.getElementById('restartBtn').addEventListener('click', () => {
  window.powerLens.restartApp();
});

document.getElementById('quitBtn').addEventListener('click', () => {
  window.powerLens.quitApp();
});
