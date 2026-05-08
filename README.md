<p align="center">
  <img src="https://img.shields.io/badge/version-2.0-9cf" alt="version">
  <img src="https://img.shields.io/badge/platform-macOS%2012%2B-orange" alt="platform">
  <img src="https://img.shields.io/badge/Electron-33-47848F?logo=electron" alt="electron">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license">
</p>

<h1 align="center">🔋 PowerLens</h1>
<p align="center"><em>Your Mac's battery has a story to tell. Are you listening?</em></p>

---

PowerLens lives in your menu bar, quietly watching your battery and whispering how much time you have left before your Mac takes an unplanned nap. No bloat, no subscriptions, no "smart assistant" that just wants to sell you cloud storage — just a tiny app that actually tells you something useful.

> **v2.0 is here!** Now powered by Electron. Yes, the README for v1 said we'd "pretend we didn't see" an Electron port suggestion. We saw it. We did it anyway. Sometimes you just need a 98MB DMG to display two numbers. That's called progress.

<img src="https://img.shields.io/badge/status-judging%20your%20battery-yellow" alt="status">

## ✨ Features

- **Real battery level** — reads from `pmset`. System truth, zero fluff.
- **Time remaining forecast** — samples your battery drain every 5 seconds, crunches the trend, and estimates how long until darkness. Like a weather forecast, but for your laptop.
- **Menu bar native** — one click. That's it. You have work to do.
- **Smart drain estimation** — tracks actual percentage drop over time instead of guessing power draw. No more `Double.random(in: 3...8)`.
- **Visual battery bar** — color-coded bar (green / yellow / red) because words are hard.
- **Privacy-first** — doesn't phone home. Doesn't even know what `fetch()` is.

## 🚀 Install

```bash
# Download the latest DMG from Releases
# Drag PowerLens.app → Applications
# Done. That's literally it.
```

Or run from source:

```bash
git clone https://github.com/murraynizeyu/PowerLens.git
cd PowerLens
npm install
npm start
```

## 🧠 How It Works

```
Every 5 seconds:
  📊 Poll battery via pmset -g batt
  📈 Record % drop over time
  🧮 Calculate drain rate (% per hour)
  ⏳ Divide remaining % by drain rate
  🔔 Update tray + popover
```

The forecast is simple math: if you dropped 5% in 30 minutes, you'll hit zero in roughly `(remaining / 5) * 30` minutes. No neural network required.

## 🏗 Architecture

```
├── main.js          # Electron main process — tray, popover, pmset polling
├── preload.js       # IPC bridge
├── renderer/
│   ├── index.html   # Popover UI (dark mode, naturally)
│   ├── renderer.js  # UI update logic
│   └── style.css    # (inlined — it's a tiny app)
├── Sources/         # v1.x Swift source (preserved for nostalgia)
│   └── PowerLens/
└── package.json     # v2.0 Electron build config
```

The Swift source is kept in `Sources/` for anyone who wants to compare the 152KB native binary to the 98MB Electron one. For historical purposes. For science.

## 📦 Release History

| Tag   | DMG                    | Engine   | Size  | Notes                        |
|-------|------------------------|----------|-------|------------------------------|
| v2.0  | `PowerLens-2.0.0.dmg` | Electron | 98MB  | We embraced the bloat 🎉     |
| v1.0  | `PowerLens-1.0.dmg`   | Swift    | 56KB  | The pure, innocent version   |

## 🤝 Contributing

Found a bug? Have a feature idea? PRs are welcome. Suggestions to port back to Swift will be met with a thousand-yard stare.

## 📜 License

MIT — do whatever you want. If PowerLens saves your presentation from a dead battery, a GitHub star is appreciated but not legally required. If the 98MB download annoys you, there's always v1.0.

---

<p align="center">
  <sub>Built with ☕, Electron, and the quiet desperation of watching a MacBook hit 5% in a meeting.</sub>
</p>
