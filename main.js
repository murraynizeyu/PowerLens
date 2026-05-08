const { app, Tray, BrowserWindow, screen, nativeImage } = require('electron');
const path = require('path');
const { execSync } = require('child_process');

let tray = null;
let popover = null;
let monitorTimer = null;

// ── Battery helpers ──────────────────────────────────────────────

function getBatteryInfo() {
  try {
    const output = execSync('pmset -g batt', { encoding: 'utf8' });
    const pctMatch = output.match(/(\d+)%/);
    const batteryLevel = pctMatch ? parseInt(pctMatch[1], 10) : 100;

    const timeMatch = output.match(/(\d+):(\d{2})/);
    let rawTime = null;
    if (timeMatch) {
      rawTime = parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);
    }

    const isCharging = output.includes('charging') || output.includes('AC Power');

    return { batteryLevel, rawTime, isCharging };
  } catch {
    return { batteryLevel: 100, rawTime: null, isCharging: false };
  }
}

// ── Power usage estimation ───────────────────────────────────────

let samples = [];

function collectSample() {
  const info = getBatteryInfo();
  samples.push({
    timestamp: Date.now(),
    batteryLevel: info.batteryLevel,
  });
  if (samples.length > 120) samples.shift();
  return info;
}

function forecast(samples) {
  if (samples.length < 5) return 'Calculating...';

  let totalDrop = 0;
  let totalTime = 0;
  for (let i = 1; i < samples.length; i++) {
    const dt = (samples[i].timestamp - samples[i - 1].timestamp) / 1000 / 3600; // hours
    const drop = samples[i - 1].batteryLevel - samples[i].batteryLevel;
    if (drop > 0 && dt > 0) {
      totalDrop += drop;
      totalTime += dt;
    }
  }

  if (totalTime === 0 || totalDrop === 0) return 'Calculating...';

  const drainRate = totalDrop / totalTime; // % per hour
  const current = samples[samples.length - 1].batteryLevel;
  const hoursLeft = current / drainRate;

  const h = Math.floor(hoursLeft);
  const m = Math.floor((hoursLeft - h) * 60);
  return `${h}h ${m}m left`;
}

// ── Tray icon generation ─────────────────────────────────────────

function createTrayIcon(level) {
  const size = 18;
  const canvas = nativeImage.createEmpty();

  // Use a simple emoji-like rendering via a data URL
  // We draw programmatically using nativeImage from a small buffer
  const { createCanvas } = (() => {
    try { return require('canvas'); } catch { return null; }
  })();

  // Fallback: use a simple template icon
  const pct = Math.round(level / 25) * 25;
  const icons = {
    0: 'battery.0',
    25: 'battery.25',
    50: 'battery.50',
    75: 'battery.75',
    100: 'battery.100',
  };
  const name = icons[pct] || 'battery.100';

  // Use system battery icon by creating a tiny transparent icon
  // and setting a template title
  const img = nativeImage.createEmpty();
  return { img, title: `${Math.round(level)}%` };
}

// ── Popover window ───────────────────────────────────────────────

function createPopover() {
  if (popover) {
    if (!popover.isDestroyed()) popover.close();
    popover = null;
    return;
  }

  try {
    var trayBounds = tray.getBounds();
  } catch {
    return; // tray is gone, likely quitting
  }
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  popover = new BrowserWindow({
    width: 240,
    height: 160,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  popover.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  popover.once('ready-to-show', () => {
    const popoverBounds = popover.getBounds();
    const x = Math.round(trayBounds.x + trayBounds.width / 2 - popoverBounds.width / 2);
    const y = Math.round(trayBounds.y - popoverBounds.height - 4);

    popover.setPosition(
      Math.max(4, Math.min(x, width - popoverBounds.width - 4)),
      Math.max(4, y)
    );
    popover.show();
  });

  popover.on('blur', () => {
    if (popover && !popover.isDestroyed()) {
      popover.close();
    }
    popover = null;
  });

  popover.on('closed', () => {
    popover = null;
  });
}

// ── IPC handlers ──────────────────────────────────────────────────

function sendBatteryUpdate() {
  if (!popover || popover.isDestroyed()) return;
  const info = collectSample();
  const timeLeft = forecast(samples);
  popover.webContents.send('battery-update', {
    level: info.batteryLevel,
    timeLeft,
    isCharging: info.isCharging,
    rawTime: info.rawTime,
  });
}

// ── App lifecycle ─────────────────────────────────────────────────

app.whenReady().then(() => {
  // Create tray with dynamic title
  tray = new Tray(nativeImage.createEmpty());
  tray.setTitle('🔋');

  tray.on('click', () => {
    createPopover();
  });

  // Initial sample
  const info = collectSample();
  tray.setTitle(`${Math.round(info.batteryLevel)}%`);

  // Update every 5 seconds
  setInterval(() => {
    if (!tray || tray.isDestroyed()) return;
    const info = collectSample();
    if (!info.isCharging) {
      tray.setTitle(`${Math.round(info.batteryLevel)}%`);
    } else {
      tray.setTitle(`⚡${Math.round(info.batteryLevel)}%`);
    }
    sendBatteryUpdate();
  }, 5000);

  app.dock.hide();
});

app.on('window-all-closed', () => {
  // Don't quit; it's a menu bar app
});

app.on('before-quit', () => {
  if (popover && !popover.isDestroyed()) popover.close();
});
