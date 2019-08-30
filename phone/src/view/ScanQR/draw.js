var preHandler = function(e) {
  e.preventDefault()
}

export default class Draw {
  constructor(el) {
    this.el = el
    this.canvas = document.getElementById(this.el)
    this.canvas.width = parseInt(document.documentElement.clientWidth * 0.96)
    // this.canvas.height = 200
    this.canvas.height = parseInt(document.documentElement.clientHeight * 0.8)
    this.cxt = this.canvas.getContext('2d')
    this.stage_info = this.canvas.getBoundingClientRect()
    this.path = {
      beginX: 0,
      beginY: 0,
      endX: 0,
      endY: 0
    }
    this.hasBegined = false // 是否已开始签字
  }

  init(btn) {
    var that = this

    this.canvas.addEventListener(
      'touchstart',
      function(event) {
        that.hasBegined = true
        document.addEventListener('touchstart', preHandler, { passive: false })
        that.drawBegin(event)
      },
      { passive: false }
    )
    this.canvas.addEventListener('touchend', function(event) {
      document.addEventListener('touchend', preHandler, false)
      that.drawEnd()
    })
    this.clear(btn)
  }

  drawBegin(e) {
    var that = this
    window.getSelection()
      ? window.getSelection().removeAllRanges()
      : document.selection.empty()
    this.cxt.strokeStyle = '#000'
    this.cxt.lineWidth = 2
    this.cxt.beginPath()
    this.cxt.moveTo(
      e.changedTouches[0].clientX - this.stage_info.left,
      e.changedTouches[0].clientY - this.stage_info.top
    )
    this.path.beginX = e.changedTouches[0].clientX - this.stage_info.left
    this.path.beginY = e.changedTouches[0].clientY - this.stage_info.top
    this.canvas.addEventListener(
      'touchmove',
      function() {
        // document.querySelectorAll('.sign-canvas-tip')[0].style.display = 'none'
        that.drawing(event)
      },
      { passive: false }
    )
  }

  drawing(e) {
    this.cxt.lineTo(
      e.changedTouches[0].clientX - this.stage_info.left,
      e.changedTouches[0].clientY - this.stage_info.top
    )
    this.path.endX = e.changedTouches[0].clientX - this.stage_info.left
    this.path.endY = e.changedTouches[0].clientY - this.stage_info.top
    this.cxt.stroke()
  }

  drawEnd() {
    document.removeEventListener('touchstart', preHandler, false)
    document.removeEventListener('touchend', preHandler, false)
    document.removeEventListener('touchmove', preHandler, false)
    // canvas.ontouchmove = canvas.ontouchend = null
  }

  clear(btn) {
    this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  save() {
    return this.canvas.toDataURL('image/png', 0.92)
  }

  getNewImg() {
    return new Promise((resolve, reject) => {
      const canvas = document.getElementById(this.el + '_mark')
      const ctx = canvas.getContext('2d')
      const image = new Image()
      image.onload = () => {
        image.width = this.canvas.width / 4
        image.height = this.canvas.height / 4
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image, 0, 0, image.width, image.height)
        resolve(canvas.toDataURL('image/png'))
      }
      image.src = this.save()
      image.setAttribute('crossOrigin', 'Anonymous')
    })
  }
}
