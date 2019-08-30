import store from '../../store'

const hasPermission = (modName, actionName) => {
  if (!modName) return
  const modList = store.getters.userinfo.Module
  const actionList = store.getters.userinfo.Action
  let ModID = null
  const hasMod = modList.some(val => {
    if (val.EModuleName === modName) {
      ModID = val.KeyID
      return true
    }
  })
  if (!actionName) {
    return hasMod
  } else {
    if (hasMod) {
      return actionList.some(val => {
        return val.EActionName === actionName && val.ModuleID === ModID
      })
    }
    return false
  }
}

export { hasPermission }
