<p align="center">
  <img src="https://img.shields.io/badge/version-1.0-blue" alt="version">
  <img src="https://img.shields.io/badge/platform-macOS%2012%2B-orange" alt="platform">
  <img src="https://img.shields.io/badge/Swift-5.7-FA7343?logo=swift" alt="swift">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license">
</p>

<h1 align="center">🔋 PowerLens</h1>
<p align="center"><em>Your Mac's battery has a story to tell. Are you listening?</em></p>

---

PowerLens lives in your menu bar, quietly watching your battery and whispering how much time you have left before your Mac takes an unplanned nap. No bloat, no subscriptions, no "smart assistant" that just wants to sell you cloud storage — just a tiny Swift app that actually tells you something useful.

<img src="https://img.shields.io/badge/status-judging%20your%20battery-yellow" alt="status">

## ✨ Features

- **Real battery level** — reads directly from IOKit. No guesswork, no lies.
- **Time remaining forecast** — samples your power draw every 5 seconds and estimates how long until zero. Like a weather forecast, but for your laptop.
- **Menu bar native** — one click. That's it. You have work to do.
- **Zero dependencies** — just SwiftUI, AppKit, and a dream. The binary weighs less than your average JPEG.
- **Privacy-first** — doesn't phone home. Doesn't even know what the internet is.

## 🚀 Install

```bash
# Download the latest DMG from Releases
# Drag PowerLens.app → Applications
# Done. That's literally it.
```

Or build from source:

```bash
git clone https://github.com/murraynizeyu/PowerLens.git
cd PowerLens
bash build.sh
open PowerLens.app
```

## 🧠 How It Works

```
Every 5 seconds:
  📊 Sample battery level (IOKit)
  ⚡ Estimate power draw (mW)
  🧮 Average your usage history
  ⏳ Project remaining runtime
  🔔 Update menu bar
```

That "AI Power Forecast" badge in the UI? It's doing simple averaging over your recent samples. Turns out you don't need a neural network to divide battery capacity by power draw. But "AI" sounds cooler, and we're not above a little marketing.

## 🏗 Architecture

```
Sources/PowerLens/
├── AppMain.swift        # NSStatusBar + NSPopover setup
├── PowerManager.swift   # IOKit sampling + forecasting logic
├── PowerModel.swift     # Data model
└── MenuBarView.swift    # SwiftUI popover view
```

Everything in ~200 lines of Swift. Readable in one coffee break.

## 📦 Release Naming

Follows Apple-style semantic versioning:

| Tag   | DMG                  | What changed       |
|-------|----------------------|--------------------|
| v1.0  | `PowerLens-1.0.dmg` | Initial release 🎉 |

## 🤝 Contributing

Found a bug? Have a feature idea? PRs are welcome. Fair warning: if you suggest turning this into an Electron app, we will respectfully pretend we didn't see it.

## 📜 License

MIT — do whatever you want. If PowerLens saves your presentation from a dead battery, a GitHub star is appreciated but not legally required.

---

<p align="center">
  <sub>Built with ☕ and the quiet desperation of watching a MacBook hit 5% in a meeting.</sub>
</p>
