import { dateFormat } from './dateFormat'
import { priceFormat, ToCapChinese } from './priceFormat'
import { deepCopy, DiffArrFn, isDiffObj, spliceArr } from './arrUtil'
import EnumData from './enumData'
import ImgUnit from './imgUnit'
import { positive, positiveUtil, setbtn } from './directives'
import getActions from './getActions'
import webNotification from './webNotification'
import store from '../store'

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
    $priceFormat: {
      get() {
        return priceFormat
      }
    },
    $deepCopy: {
      get() {
        return deepCopy
      }
    },
    $spliceArr: {
      get() {
        return spliceArr
      }
    },
    $isDiffObj: {
      get() {
        return isDiffObj
      }
    },
    $ToCapChinese: {
      get() {
        return ToCapChinese
      }
    },
    $DiffArrFn: {
      get() {
        return DiffArrFn
      }
    },
    $EnumData: {
      get() {
        return EnumData
      }
    },
    $ImgUnit: {
      get() {
        return ImgUnit
      }
    },
    $positive: {
      get() {
        return positiveUtil
      }
    },
    $getActions: {
      get() {
        return getActions
      }
    },
    $webNotification: {
      get() {
        return webNotification
      }
    },
    $isCompanyBoss: {
      get() {
        return store.getters.userinfo.EmpID === 100000129
      }
    }
  })

  // 定义指令
  Vue.directive('positive', positive)
  Vue.directive('setbtn', setbtn)
}

export default {
  install
}
