export function filterRouter(router, ModuleNames, mod) {
  const newRouter = []
  router.forEach(val => {
    if (ModuleNames.includes(val.name)) {
      if (mod) {
        val.ModuleSort = mod.find(x => x.EModuleName === val.name).ModuleSort
      }
      if (val.children) {
        val.children = filterRouter(val.children, ModuleNames, mod)
      }
      newRouter.push(val)
    } else if (val.hidden) {
      newRouter.push(val)
    }
  })
  return newRouter
}
