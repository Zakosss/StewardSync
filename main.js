const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './window/logo.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // devTools: false,
      sandbox: false
    }
  })

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