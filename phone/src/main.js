import Vue from 'vue'
import App from './App'
import router from './router'
import {
  Button,
  Loading,
  Scrollbar,
  Upload,
  Form,
  FormItem,
  Input,
  Radio
} from 'element-ui'
import 'normalize.css'
import './rem'
import D, { Alert, Confirm } from 'wc-messagebox'
import 'wc-messagebox/style.css'
import wxAlert from './assets/wechat-messagebox/Alert'
import wxConfirm from './assets/wechat-messagebox/Confirm'
import Utils from './utils/install'
Vue.use(require('vue-wechat-title'))
Vue.use(Utils)
Vue.use(Button)
Vue.use(Loading)
Vue.use(Scrollbar)
Vue.use(Upload)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Radio)
Vue.config.productionTip = false
Vue.use(D)
Vue.use(Confirm, {
  component: wxConfirm
})
Vue.use(Alert, {
  component: wxAlert
})
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
