export default new class {
  constructor() {
    this.noticeRef = ''
    this.isReady = !!Notification
  }
  show(options) {
    if (!this.isReady) return
    this.noticeRef = new Notification(options.title, {
      dir: 'auto',
      lang: 'zh-CN',
      tag: new Date().getTime() + '_tan',
      icon: require('../../assets/logo.png'),
      body: options.body
    })
    this.noticeRef.onclick = function() {
      window.focus()
      this.noticeRef.close()
    }
  }
  permission() {
    if (!this.isReady) return false
    return Notification.permission
  }
  requestPermission() {
    Notification.requestPermission(function(permission) {
      // 如果用户同意，就可以向他们发送通知
      if (permission === 'granted') {
        console.log(1)
      } else {
        console.log(2)
      }
    })
  }
}()
