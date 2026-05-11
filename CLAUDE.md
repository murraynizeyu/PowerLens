# PowerLens

macOS 菜单栏电池监控应用，实时显示电量百分比和剩余时间预估。

## 技术栈
- **v2 (当前)**: Electron 33 + Node.js，纯 JavaScript，无框架
- **v1 (归档)**: Swift 5.7 + SwiftUI + IOKit，56KB 原生二进制
- 打包: electron-builder → DMG
- 部署目标: macOS 12+

## 项目结构
```
PowerLens/
├── main.js          # Electron 主进程：托盘、轮询、IPC
├── preload.js       # contextBridge 暴露 powerLens API
├── renderer/        # 弹出面板 UI（HTML/CSS/Canvas 图表）
├── Sources/         # v1 Swift 源码（仅归档）
├── build.sh         # v1 编译脚本
├── package.json     # v2 依赖与脚本
└── PowerLens.app    # 构建产物
```

## 运行方式
```bash
npm install
npm start           # 开发运行
npm run build       # 打包 DMG
```

## 关键架构
- 每 5 秒通过 `pmset`/`system_profiler`/`ioreg` 采集电池数据
- 滚动 120 样本缓冲区计算放电速率 → 剩余时间预估
- 菜单栏图标动态显示百分比（放电）或 ⚡+百分比（充电）
- 弹出面板用 Canvas 绘制迷你趋势图
- Dock 图标隐藏，纯菜单栏应用

## 注意事项
- 完全离线，无网络请求
- UI 为中文
- `app.dock.hide()` 隐藏 Dock 图标
- v1 源码仅作为参考保留，实际运行用 v2 Electron 版
