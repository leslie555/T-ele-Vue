


<template>
  <el-dialog
    title="分享"
    :visible.sync="showQRCodeDialog"
    width="600px"
    append-to-body
    class="order-sign-dialog"
    center
  >
    <div class="sign-box">
      <div class="scan-box">
        <qrcode :value="baseURI" :options="{ size: 200 }"></qrcode>
      </div>
      <div class="sign-text">请扫描二维码</div>
    </div>
    <div class="shareLinkCon">
      <p class="shareLinkF">分享链接</p>
      <p class="shareLink shareLinkF">{{this.baseURI}}</p>
      <p class="shareLinkF">
        <el-button
          type="primary"
          plain
          size="small"
          v-if="baseURI"
          v-clipboard:copy="baseURI"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >复制链接</el-button>
      </p>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="showQRCodeDialog=false">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Qrcode from '@xkeshi/vue-qrcode'
import { phoneURL } from '@/config'
export default {
  components: {
    Qrcode
  },
  data() {
    return {
      showQRCodeDialog: false,
      baseURI: ''
    }
  },
  methods: {
    open(val, name) {
      const token = this.$store.getters.userinfo.Token
      this.baseURI = phoneURL + name + `?token=${token}&KeyID=${val.KeyID}`
      this.showQRCodeDialog = true
    },
    close() {
      this.showQRCodeDialog = false
    },
    onCopy() {
      this.$message.success('复制成功')
    },
    onError() {
      this.$message.error('复制失败！')
    }
  }
}
</script>
<style lang="scss">
.order-sign-dialog .shareLinkCon .el-button--small {
  border-radius: 0;
}
</style>
<style lang="scss" scoped>
@import '../../../styles/variables';
@import '../../../styles/mixin.scss';
.order-sign-dialog {
  .sign-box {
    @include displayFlex(column, center, flex-start);
    width: 100%;
    .scan-box {
      padding: 5px;
      background: #f9f9f9;
      border: 1px solid #eee;
      border-radius: 5px;
    }
    .img-box {
      @include displayFlex(row, center, center);
      width: 500px;
      height: 220px;
      background: #f9f9f9;
      border: 1px solid #eee;
      border-radius: 5px;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .sign-text {
      margin-top: 15px;
      font-size: 16px;
      color: $--color-text-primary;
    }
    .sign-notice {
      @include displayFlex(row, flex-start, center);
      margin-top: 30px;
      font-size: 14px;
      color: $--color-text-secondary;
      width: 430px;
      line-height: 20px;
      p:first-child {
        margin-right: 5px;
      }
    }
  }
}
.shareLinkCon {
  overflow: hidden;
  margin-top: 20px;
}
.shareLinkCon p:nth-child(1) {
  text-align: center;
  line-height: 32px;
  margin-left: 50px;
}
.shareLinkF {
  float: left;
}
.shareLink {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 300px;
  border: 1px solid #afd8fa;
  border-right: 0;
  height: 32px;
  line-height: 32px;
  margin-left: 13px;
}
</style>
