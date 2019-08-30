import store from '../../store'
const curPage = {
  state: {
    currentActions: []
  },

  mutations: {
    SET_CURRENTACTIONS: (state, modName) => {
      const userinfo = store.getters.userinfo
      let modID
      for (let i = 0; i < userinfo.Module.length; i++) {
        const mod = userinfo.Module[i]
        if (mod.EModuleName === modName) {
          modID = mod.KeyID
          break
        }
      }
      const actions = userinfo.Action.filter(val => val.ModuleID === modID)
      state.currentActions = actions.map(v => v.EActionName)
    }
  },

  actions: {}
}

export default curPage
