const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('node:path')

const { F1TelemetryClient, constants } = require('@racehub-io/f1-telemetry-client');
const { PACKETS } = constants;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './window/img/logo.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // devTools: false,
      sandbox: false
    }
  })

  const client = new F1TelemetryClient({ port: 20777 });

  client.on(PACKETS.participants, data => {
    win.webContents.send('participants',data)
  })

  client.on(PACKETS.lapData, data => {
    win.webContents.send('lapData',data)
  })

  client.start();

  win.loadFile('./window/index.html')
}

app.whenReady().then(() => {
  var currentTime = 0
  var duration = 800

  ipcMain.handle("playback:update", async (e,percent) => {
    console.log(percent)
    currentTime = duration*percent
    return [currentTime,duration]
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})