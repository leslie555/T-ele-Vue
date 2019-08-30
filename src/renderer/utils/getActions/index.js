import store from '../../store/index'
import router from '../../router'
function getActions() {
  debugger
  const userinfo = store.getters.userinfo
  const modName = router.history.current.name
  let modID
  for (let i = 0; i < userinfo.Module.length; i++) {
    const mod = userinfo.Module[i]
    if (mod.EModuleName === modName) {
      modID = mod.KeyID
      break
    }
  }
  const actions = userinfo.Action.filter(val => val.ModuleID === modID)
  return actions.map(v => v.EActionName)
}

export default getActions
