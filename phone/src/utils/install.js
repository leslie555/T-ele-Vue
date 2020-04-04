import { dateFormat } from './dateFormat'
import ImgUnit from './imgUnit'

const install = function(Vue) {
  if (install.installed) return
  install.installed = true

  // 定义属性到Vue原型中
  Object.defineProperties(Vue.prototype, {
    $dateFormat: {
      get() {
        return dateFormat
      }
    },
    $ImgUnit: {
      get() {
        return ImgUnit
      }
    }
  })
}

export default {
  install
}
