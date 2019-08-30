import { login, logout } from '@/api/login'
import { cookieStorage, localStorage, sessionStorage } from '@/utils/storage'
import router from '../../router'

const user = {
  state: {
    token: cookieStorage.get('token'),
    userinfo: localStorage.get('userinfo'),
    prevPath: sessionStorage.get('prevPath') // 保存登录过期时用户正在操作的页面路径和query参数
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userinfo) => {
      state.userinfo = userinfo
    },
    SET_PREVPATH: (state, path) => {
      state.prevPath = path
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(response => {
            const data = response.Data
            try {
              data.Module = data.jurisdic.Data.Module
              // 二级菜单兼容性修改
              data.Module.push(...[{
                'KeyID': -1,
                'ModuleName': '财务',
                'EModuleName': 'ReportFinance',
                'ModuleSort': '98',
                'PID': -1,
                'ModifyStatus': 0
              }, {
                'KeyID': -1,
                'ModuleName': '业务',
                'EModuleName': 'BusFinance',
                'ModuleSort': '99',
                'PID': -1,
                'ModifyStatus': 0
              }, {
                'KeyID': -1,
                'ModuleName': '其他',
                'EModuleName': 'OtherFinance',
                'ModuleSort': '100',
                'PID': -1,
                'ModifyStatus': 0
              }])
              data.Action = data.jurisdic.Data.Action
              data.CompanyInfo = data.jurisdic.Data.CompanyInfo
              delete data.jurisdic
            } catch (error) {
              data.Module = []
              data.Action = []
              data.CompanyInfo = []
            }
            cookieStorage.set('token', data.Token, 7)
            localStorage.set('userinfo', data)
            commit('SET_TOKEN', data.Token)
            commit('SET_USERINFO', data)
            commit('SET_LOGOUTALERTED', true)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 调用后端接口后登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout({
          token: state.token
        })
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_USERINFO', {})
            commit('SET_PREVPATH', '')
            cookieStorage.remove('token')
            localStorage.remove('userinfo')
            sessionStorage.remove('prevPath')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        const prevPath = {
          path: router.history.current.path,
          query: router.history.current.query
        }
        commit('SET_TOKEN', '')
        cookieStorage.remove('token')
        commit('SET_PREVPATH', prevPath)
        sessionStorage.set('prevPath', prevPath)
        resolve()
      })
    }
  }
}

export default user
