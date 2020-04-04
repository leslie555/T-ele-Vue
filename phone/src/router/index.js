import Vue from 'vue'
import Router from 'vue-router'
import ScanQR from '../view/ScanQR'
import OderSign from '../view/OderSign'
import ContractSign from '../view/ContractSign'
import ContractAuthInfo from '../view/ContractAuthInfo'
import UploadFile from '../view/UploadFile'
import DownloadApp from '../view/DownloadApp'
import CleaningSingle from '../view/shareProcure/CleaningSingle/index.vue'
import MovingSingle from '../view/shareProcure/MovingSingle/index.vue'
import purchaseSingle from '../view/shareProcure/purchaseSingle/index.vue'
import shareClear from '../view/shareProcure/CleaningSingle/complete.vue'
import FixingSingle from '../view/shareProcure/FixingSingle/index.vue'
import RepairingSingle from '../view/shareProcure/RepairingSingle/index.vue'
import CustomerSurvey from '../view/CustomerSurvey'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/sign',
      name: 'ScanQR',
      component: ScanQR,
      meta: {
        title: '手写签字',
        keepAlive: false
      }
    },
    {
      path: '/ordersign',
      name: 'OderSign',
      component: OderSign,
      meta: {
        title: '签字',
        keepAlive: false
      }
    },
    {
      path: '/ContractAuthInfo',
      name: 'ContractAuthInfo',
      component: ContractAuthInfo,
      meta: {
        title: '实名认证',
        keepAlive: false
      }
    },
    {
      path: '/ContractSign',
      name: 'ContractSign',
      component: ContractSign,
      meta: {
        title: '现场签字',
        keepAlive: false
      }
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadFile,
      meta: {
        title: '图片上传',
        keepAlive: false
      }
    },
    {
      path: '/download',
      name: 'download',
      component: DownloadApp,
      meta: {
        title: '弹窝App下载',
        keepAlive: false
      }
    },
    {
      path: '/CleaningSingle',
      name: 'CleaningSingle',
      component: CleaningSingle,
      meta: {
        title: '保洁单详情',
        keepAlive: false
      }
    },
    {
      path: '/shareClearComplete',
      name: 'shareClearComplete',
      component: shareClear,
      meta: {
        title: '处理完成',
        keepAlive: false
      }
    },
    {
      path: '/MovingSingle',
      name: 'MovingSingle',
      component: MovingSingle,
      meta: {
        title: '搬家单详情',
        keepAlive: false
      }
    },
    {
      path: '/FixingSingle',
      name: 'FixingSingle',
      component: FixingSingle,
      meta: {
        title: '装修单详情',
        keepAlive: false
      }
    },
    {
      path: '/purchaseSingle',
      name: 'purchaseSingle',
      component: purchaseSingle,
      meta: {
        title: '采购单详情',
        keepAlive: false
      }
    },
    {
      path: '/RepairingSingle',
      name: 'RepairingSingle',
      component: RepairingSingle,
      meta: {
        title: '维修单详情',
        keepAlive: false
      }
    },
    {
      path: '/customer_survey',
      name: 'customer_survey',
      component: CustomerSurvey,
      meta: {
        title: '客户调查表'
      }
    }
  ]
})
