import { getAllEnumData } from '@/api/system'
import { localStorage } from '@/utils/storage'

const user = {
  state: {
    enumList: localStorage.get('enumList')
  },

  mutations: {
    SET_ENUM: (state, enumList) => {
      state.enumList = enumList
    }
  },

  actions: {
    // 获取枚举类型
    GetEnumList({ commit }) {
      return new Promise((resolve, reject) => {
        getAllEnumData({})
          .then(response => {
            const data = JSON.parse(response.Data)
            console.log(data)
            localStorage.set('enumList', data)
            commit('SET_ENUM', data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user
