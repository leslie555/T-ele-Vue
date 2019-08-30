<template>
  <div>
    <div class="app-container">
      <ul class="nav-list panel-style">
        <li
          :class="index === activeIndex? 'active-li': ''"
          v-for="(nav, index) in NavList"
          :key="nav.key"
          @click="handleLiClick(index)"
        >{{nav.label}}</li>
      </ul>
      <div class="main">
          <router-view />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HomePageExamine',
  data() {
    return {
      activeIndex: 0,
      NavList: [
        {
          key: 0,
          path: 'ContractLandlord',
          label: '业主合同'
        },
        {
          key: 1,
          path: 'TenantContract',
          label: '租客合同'
        },
        {
          key: 2,
          path: 'HouseResources',
          label: '房源'
        },
        {
          key: 3,
          path: 'Finance',
          label: '财务'
        }
      ]
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   debugger
  //   next(vm => {
  //     // 因为当钩子执行前，组件实例还没被创建
  //     // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
  //     console.log(vm.activeIndex, '456')
  //     debugger
  //     vm.$router.push({
  //       path: '/Examine/' + this.NavList[vm.activeIndex].path
  //     })
  //     // return '/Examine/' + this.NavList[vm.activeIndex].path
  //   })
  // },
  watch: {
    // 监听路由改变 监察部被选中
    '$route': {
      handler: function(newVal, oldVal) {
        if (oldVal !== undefined) {
          if (newVal.meta.routerKey === 'HomePageExamine' && oldVal.meta.routerKey === 'HomePageExamine') {
            if (newVal.name === 'ContractLandlordList') {
              this.activeIndex = 0
            }
          }
        } else {
          this.activeIndex = newVal.name === 'ContractLandlordList' ? 0 : newVal.name === 'ContractTenantList' ? 1 : newVal.name === 'HouseResourcesList' ? 2 : 3
        }
      },
      immediate: true
    }
  },
  computed: {
    key() {
      return this.$route.fullPath
    }
  },
  methods: {
    handleLiClick(index) {
      this.activeIndex = index
      this.$router.push({
        path: '/Examine/' + this.NavList[index].path
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .app-container{
    padding:10px;
  }
  .main{
    float: left;
    margin-left: 10px;
  }
  .nav-list{
    width: 220px;
    float: left;
    list-style: none;
    padding: 0;
    margin: 0;
    &>li{
      height: 70px;
      line-height: 70px;
      font-size: 14px;
      padding-left: 40px;
      color: #999;
      box-sizing: border-box;
      // border-left: 5px solid #fff;
      cursor: pointer;
    }
    &>li:hover{
      background-color: #f3f9fe;
    }
    &>.active-li{
      border-left: 5px solid #389ef2;
      color: #389ef2;
      background-color: #f3f9fe;
    }
  }
  .label-num{
    &>.label-list{
      list-style: none;
      cursor: pointer;
      &>li{
        float: left;
        padding: 0px 35px;
        font-size: 16px
      }
      .select-label{
        color: #389ef2;
        font-weight: bold;
      }
    }
  }
  .search-list{
    margin-top: 50px;
  }
  // 清浮动
  .clearfix::after{
    content: "";
    display: block;
    clear: both;
    height: 0;
    visibility: hidden;
  }
  // 浮动
  .float{
    float: left;
  }
  .panel-style{
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    transition: 0.3s;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
</style>
