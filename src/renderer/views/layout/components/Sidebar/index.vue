<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="watchRouter"
      :collapse="true"
      background-color="#fff"
      text-color="#7d889e"
      active-text-color="#389ef2"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'
  import ScrollBar from '@/components/ScrollBar'
  import { filterRouter } from '../../../../router/filterRouter.js'

  export default {
    components: { SidebarItem, ScrollBar },
    data() {
      return {
        watchRouter: ''
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      routes() {
        const allRoutes = this.$router.options.routes
        const mod = this.$store.getters.userinfo.Module
        if (mod) {
          const moduleNames = mod.map(v => v.EModuleName)
          let routes = filterRouter(allRoutes, moduleNames, mod)
          // routes.sort((a, b) => a.ModuleSort - b.ModuleSort)
          routes.forEach(x => {
            if (x.children) {
              x.children.sort((a, b) => a.ModuleSort - b.ModuleSort)
              x.children.forEach(y => {
                if (y.children) {
                  y.children.sort((a, b) => a.ModuleSort - b.ModuleSort)
                }
              })
            }
          })
          routes = this.filterModule(routes)
          return routes
        } else {
          return allRoutes
        }
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    },
      watch: {
        // 监听路由改变 监察部被选中
        '$route': {
          handler: function(newVal, oldVal) {
            this.watchRouter = newVal.meta.rootKey || newVal.path
          },
          immediate: true
        }
      },
    methods: {
      filterModule(routes) {
        // 如果没有子集 去掉 兼容报表的菜单
        return routes.filter(x => {
          if (x.name !== 'Report') {
            return true
          }
          let flag = false
          x.children.forEach(y => {
            if (y.children.length > 0) {
              flag = true
            }
          })
          return flag
        })
      }
    }
  }
</script>
