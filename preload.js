const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('powerLens', {
  onBatteryUpdate: (callback) => {
    ipcRenderer.on('battery-update', (_event, data) => callback(data));
  },
});
