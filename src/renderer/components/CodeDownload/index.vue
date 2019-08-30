<template>
  <div class="code-dialog" v-show="showDialog">
    <transition name="scale">
      <div class="code-dialog-cover" v-if="CodeShowing">
        <div class="code-dialog-box">
          <div class="code-background">
            <img src="../../assets/Qrcode.png" alt="">
          </div>
          <div class="code-text">
            <p>弹窝APP版下载</p>
          </div>
          <!--<div class="code-ios">-->
            <!--<img src="../../assets/ios.png" width="160" height="160" alt="">-->
          <!--</div>-->
          <div class="code-android">
            <img src="../../assets/download-code.png" width="160" height="160" alt="">
          </div>
          <!--<div class="code-text-ios common">ios</div>-->
          <div class="code-text-android common">扫一扫下载</div>
          <div class="code-Slogan">
            <p>测算小工具帮你轻松控制出房价、拿房价</p>
            <p>&nbsp;&nbsp;房源一键发布、分享，提高获客效率</p>
            <p style="text-indent: -30px">掌上在线预定、签约、催租、续约、退房轻松搞定</p>
          </div>
          <div class="code-cha" @click="closeCode">
            <img src="../../assets/fuxuankuangxuanzhong-01.png" width="30" height="30" alt="">
          </div>
          <div class="code-tips">
            <el-checkbox v-model="NoPromptShowing" @change="changeValue">不再提示</el-checkbox>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { localStorage } from '../../utils/storage'

  export default {
    name: 'index',
    props: {
      CodeShowing: Boolean
    },
    data() {
      return {
        NoPromptShowing: false,
        mark: `showAppDownLoad_` + this.$store.getters.userinfo.LoginCode,
        showDialog: false
      }
    },
    created() {
      const showAppDownLoad = localStorage.get(this.mark)
      if (showAppDownLoad === 1) {
        this.showDialog = true
        localStorage.set(this.mark, 0)
      } else {
        this.showDialog = false
      }
    },
    methods: {
      closeCode() {
        this.$emit('CloseDialog')
      },
      changeValue(val) {
        if (val) {
          localStorage.set(this.mark, 2)
        } else {
          localStorage.set(this.mark, 0)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";

  .scale-enter, .scale-leave-to {
    transform: scale(0)
  }

  .scale-leave, .scale-enter-to {
    transform: scale(1)
  }

  .scale-enter-active, .scale-leave-active {
    transition: all .5s
  }
</style>
