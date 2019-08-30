import { app, BrowserWindow, ipcMain } from 'electron'
// 注意这个autoUpdater不是electron中的autoUpdater
import { autoUpdater } from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  /*  mainWindow = new BrowserWindow({
      height: 563,
      useContentSize: true,
      width: 1000
    })*/
  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    center: true,
    useContentSize: true
  })
  mainWindow.loadURL(winURL)
  mainWindow.once('ready-to-show', () => {
    // mainWindow.maximize()
    mainWindow.show()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  updateHandle()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

function updateHandle() {
  const message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新'
  }
  autoUpdater.autoDownload = false
  autoUpdater.on('error', function(ev, err) {
    // sendUpdateMessage(message.error + ev + err)
  })
  autoUpdater.on('checking-for-update', function() {
    sendUpdateMessage(message.checking)
  })
  autoUpdater.on('update-available', function(info) {
    // sendUpdateMessage(message.updateAva)
    mainWindow.webContents.send('downloadStart', info)
  })
  autoUpdater.on('update-not-available', function(info) {
    sendUpdateMessage(message.updateNotAva)
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
    mainWindow.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    ipcMain.on('isUpdateNow', (e, arg) => {
      // some code here to handle event
      autoUpdater.quitAndInstall()
    })
    mainWindow.webContents.send('isUpdateNow')
  })

  ipcMain.on('checkForUpdate', () => {
    // 执行更新检查
    autoUpdater.checkForUpdates()
  })
  ipcMain.on('checkForDownload', () => {
    // 执行更新下载
    autoUpdater.downloadUpdate()
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text)
}
