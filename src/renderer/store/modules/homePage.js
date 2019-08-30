import { localStorage } from '@/utils/storage'

const homePage = {
  state: {
    HomePageRemark: localStorage.get('HomePageRemark')
  },
  mutations: {
    SET_HOME_REMARK: (state, view) => {
      state.HomePageRemark = view
    }
  },
  actions: {
    // 获取今日公告
    setHomeRemark({ commit }, data) {
      return new Promise((resolve) => {
        localStorage.set('HomePageRemark', data)
        commit('SET_HOME_REMARK', data)
        resolve()
      })
    }
  }
}
export default homePage
