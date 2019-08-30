import Vue from 'vue'
import Router from 'vue-router'
import ScanQR from '../view/ScanQR'
import ContractSign from '../view/ContractSign'
import UploadFile from '../view/UploadFile'
import DownloadApp from '../view/DownloadApp'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/sign',
      name: 'ScanQR',
      component: ScanQR,
      meta: {
        title: '手写签字'
      }
    },
    {
      path: '/ContractSign',
      name: 'ContractSign',
      component: ContractSign,
      meta: {
        title: '现场签字'
      }
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadFile,
      meta: {
        title: '图片上传'
      }
    },
    {
      path: '/download',
      name: 'download',
      component: DownloadApp,
      meta: {
        title: '弹窝App下载'
      }
    }
  ]
})
