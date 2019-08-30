import SeeImageComponent from './index.vue'

const SeeImage = {}

SeeImage.install = Vue => {
  const SeeImageConstructor = Vue.extend(SeeImageComponent)

  const instance = new SeeImageConstructor()

  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)

  Vue.directive('drag', // 自定义指令                                      JS
    {
      bind: function(el, binding) {
        const oDiv = el // 当前元素
        oDiv.onmousedown = function(e) {
          e.preventDefault()
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - oDiv.offsetLeft
          const disY = e.clientY - oDiv.offsetTop

          document.onmousemove = function(e) {
            // 通过事件委托，计算移动的距离
            const l = e.clientX - disX
            const t = e.clientY - disY
            // 移动当前元素
            oDiv.style.left = l + 'px'
            oDiv.style.top = t + 'px'
            // 将此时的位置传出去
            binding.value({ x: e.pageX, y: e.pageY })
          }
          document.onmouseup = function(e) {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  )

  Vue.prototype.$seeImage = (src) => {
    instance.currentImg = src
    instance.isShowImageDialog = true
  }
}

export default SeeImage
