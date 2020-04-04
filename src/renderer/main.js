/**
 * Created by littleseven on 2017/3/23.
 *
 * 主程序入口
 *
 */

// 导入样式
// 导入字体
import './fonts/iconfont/iconfont.css'
// 导入Vue框架
import Vue from 'vue'
// 导入element组件
import ElementUI, { Popover } from 'element-ui' // 没有单独引入有问题
import 'element-ui/lib/theme-chalk/index.css'
import './styles/google.css'
// import './styles/element-theme-tgf/index.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
// 导入主视图文件
import App from './App'
// 导入路由
import router from './router/index'
// 导入状态管理器
import store from './store'
// 导入mock数据
// import './mock'
//  枚举类型 数组对比算法 深拷贝函数 图片url获取
// 导入轮播图片组件
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Utils from './utils/install'
//  导入时间插件
import './utils/hackManage/date'
// 导入图片查看插件
import seeImage from './components/PreviewImg/install'
// 导入时间组件
import DatePickerRange from './components/DatePickerRange'
// 导入复制插件
import VueClipboard from 'vue-clipboard2'
// 导入路由验证
import '@/permission' // permission control
// 打印组件
import 'print-js'
// 导入自动更新组件
// import './utils/update' // 发布为web的时候注释掉

if (process.env.IS_WEB === false) {
  Vue.use(require('vue-electron'))
}

// 使用element-ui
Vue.use(ElementUI)
Vue.use(Popover)
Vue.component(CollapseTransition.name, CollapseTransition)

// 使用轮播图片组件
Vue.use(Viewer)
Viewer.setDefaults({
  zIndex: 20200
})
// 使用插件
Vue.use(Utils)

// 使用图片查看插件
Vue.use(seeImage)

// 使用时间组件
Vue.component('DatePickerRange', DatePickerRange)

// 使用复制组件
Vue.use(VueClipboard)

// 导入polyfill
import 'babel-polyfill'

// 发布后是否显示提示
Vue.config.productionTip = false
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 是否开启工具调试
Vue.config.devtools = process.env.NODE_ENV === 'development'
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
