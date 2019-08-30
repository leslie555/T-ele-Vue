import { Loading, Message, MessageBox } from 'element-ui'
import { ipcRenderer } from 'electron'

let loader = null
ipcRenderer.on('message', (event, text) => {
  Message.success(text)
})
ipcRenderer.on('downloadStart', () => {
  MessageBox.alert('检查到更新，下载资源包？', '提示', {
    showClose: false,
    confirmButtonText: '下载',
    callback: action => {
      ipcRenderer.send('checkForDownload')
      loader = Loading.service({
        lock: true,
        text: '下载资源包中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
  })
})
// 注意：“downloadProgress”事件可能存在无法触发的问题，只需要限制一下下载网速就好了
ipcRenderer.on('downloadProgress', (event, progressObj) => {
  // console.log(progressObj)
  // this.downloadPercent = progressObj.percent || 0;
})
ipcRenderer.on('isUpdateNow', () => {
  loader.close()
  MessageBox.alert('已下载完成，马上去更新', '提示', {
    showClose: false,
    confirmButtonText: '更新',
    callback: action => {
      ipcRenderer.send('isUpdateNow')
    }
  })
})

