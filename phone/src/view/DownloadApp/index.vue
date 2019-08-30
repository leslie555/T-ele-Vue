<template>
  <div class="download-phone">
    <img src="../../assets/download-app/download-bg.png" class="download-bg">
    <div class="logo-box">
      <img src="../../assets/download-app/logo.png">
    </div>
    <div class="title-box">
      <span>公寓运营服务云平台</span>
    </div>
    <div class="phone-box">
      <img src="../../assets/download-app/phone.png">
    </div>
    <div class="bottom-box">
      <div class="list-box">
        <div class="list-item">
          <img src="../../assets/download-app/icon-1.jpg" class="item-left">
          <div class="item-right">
            <div class="item-title">房源随时掌握</div>
            <div class="item-content">状态一目了然，其实一切很简单</div>
          </div>
        </div>
        <div class="list-item">
          <img src="../../assets/download-app/icon-2.jpg" class="item-left">
          <div class="item-right">
            <div class="item-title">租约轻松管理</div>
            <div class="item-content">合同、账单快捷登入</div>
          </div>
        </div>
        <div class="list-item">
          <img src="../../assets/download-app/icon-3.jpg" class="item-left">
          <div class="item-right">
            <div class="item-title">移动抄表计算器</div>
            <div class="item-content">摆脱纸质抄表模式</div>
          </div>
        </div>
      </div>
      <div class="download-btn" @click="downloadApp">立即下载</div>
    </div>
    <div class="mask-box" v-show="showMaskFlag" @click="hideMask()">
      <img src="../../assets/download-app/download-notice.png">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        showMaskFlag: false
      }
    },
    created() {

    },
    methods: {
      isWeChat() {
        const ua = navigator.userAgent.toLowerCase()
        const flag = ua.indexOf('micromessenger') !== -1
        if (flag) {
          return true
        } else {
          return false
        }
      },
      downloadApp() {
        if (this.isWeChat()) {
          this.showMaskFlag = true
        } else {
          location.href = 'http://h5.51tanwo.com/update.html'
        }
      },
      hideMask() {
        this.showMaskFlag = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "style";
</style>
