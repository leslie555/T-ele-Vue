<template>
    <div class="app-wrapper" :class="classObj">
        <sidebar class="sidebar-container"></sidebar>
        <navbar></navbar>
        <tags-view/>
        <scroll-top></scroll-top>
        <div class="main-container">
            <app-main></app-main>
        </div>
      <code-download :CodeShowing="CodeShowing" @CloseDialog="CloseDialog"></code-download>
    </div>
</template>

<script>
  import { Navbar, Sidebar, AppMain, TagsView, ScrollTop } from './components'
  import ResizeMixin from './mixin/ResizeHandler'
  import { CodeDownload } from '../../components'

  export default {
    name: 'layout',
    data() {
      return {
        CodeShowing: true
      }
    },
    components: {
      Navbar,
      Sidebar,
      AppMain,
      TagsView,
      ScrollTop,
      CodeDownload
    },
    mixins: [ResizeMixin],
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      device() {
        return this.$store.state.app.device
      },
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    methods: {
      CloseDialog() {
        this.CodeShowing = false
      }
    },
    created() {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../styles/mixin.scss";

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
    }
</style>
