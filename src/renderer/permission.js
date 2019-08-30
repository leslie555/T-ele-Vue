import router from './router/index'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.getters.token && store.getters.userinfo) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      const mod = store.getters.userinfo.Module
      if (mod) {
        const moduleNames = mod.map(v => v.EModuleName)
        if (to.meta.hidden || moduleNames.includes(to.name)) {
          if (!to.meta.hidden) {
            store.commit('SET_CURRENTACTIONS', to.name)
          }
          next()
        } else {
          next('/404')
        }
      }
      return false
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
  document.getElementById('app').className = '' // 去掉开场动画
})
