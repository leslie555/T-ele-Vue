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
        const addrouter = {
          EModuleName: 'FixPurchaseList',
          KeyID: 9998,
          ModifyStatus: 0,
          ModuleName: '采购部',
          ModuleSort: 1,
          PID: 0
        }
        mod.push(addrouter)
        const addrouter1 = {
          EModuleName: 'FixPaperList',
          KeyID: 9999,
          ModifyStatus: 0,
          ModuleName: '装修单',
          ModuleSort: 1,
          PID: 1
        }
        mod.push(addrouter1)
        const addrouter2 = {
          EModuleName: 'PurchasePaperList',
          KeyID: 9999,
          ModifyStatus: 0,
          ModuleName: '采购单',
          ModuleSort: 1,
          PID: 1
        }
        mod.push(addrouter2)
           const addrouter3 = {
          EModuleName: 'FixPurchaseDepartmentList',
          KeyID: 9999,
          ModifyStatus: 0,
          ModuleName: '装修-采购部',
          ModuleSort: 1,
          PID: 1
        }
        mod.push(addrouter3)
           const addrouter4 = {
          EModuleName: 'StoreHouseList',
          KeyID: 9999,
          ModifyStatus: 0,
          ModuleName: '库房',
          ModuleSort: 1,
          PID: 1
        }
        mod.push(addrouter4)
              const addrouter5 = {
          EModuleName: 'FixApplyConfigList',
          KeyID: 9999,
          ModifyStatus: 0,
          ModuleName: '装修申请项目配置',
          ModuleSort: 1,
          PID: 1
        }
        mod.push(addrouter5)
        const addrouter6 = {
        EModuleName: 'SupplyConfigList',
        KeyID: 9999,
        ModifyStatus: 0,
        ModuleName: '供货商及装修部门配置',
        ModuleSort: 1,
        PID: 1
        }
        mod.push(addrouter6)
        const addrouter7 = {
        EModuleName: 'FixSalesmanList',
        KeyID: 9999,
        ModifyStatus: 0,
        ModuleName: '装修申请',
        ModuleSort: 1,
        PID: 1
        }
        mod.push(addrouter7)
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
