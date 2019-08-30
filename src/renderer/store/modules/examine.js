import { localStorage } from '@/utils/storage'

const examine = {
    state: {
        activeIndex: localStorage.get('activeIndex')
    },
    mutations: {
      SET_ACTIVEINDEX: (state, activeIndex) => {
        state.activeIndex = activeIndex
      }
    },
    actions: {
      GetActiveIndex({ commit }, userInfo) {
        localStorage.set('activeIndex', userInfo)
        commit('SET_ACTIVEINDEX', userInfo)
      }
    }
  }

export default examine

