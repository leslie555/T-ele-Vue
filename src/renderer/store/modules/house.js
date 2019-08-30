import { localStorage } from '@/utils/storage'

const house = {
  state: {
    HouseInfoForm: localStorage.get('HouseInfoForm')
  },
  mutations: {
    SET_HOUSE_INFO: (state, view) => {
      state.HouseInfoForm = view
    }
  },
  actions: {
    // 获取业主合同预览
    setHouseInfoForm({ commit }, data) {
      return new Promise((resolve) => {
        localStorage.set('HouseInfoForm', data)
        commit('SET_HOUSE_INFO', data)
        resolve()
      })
    }
  }
}
export default house
