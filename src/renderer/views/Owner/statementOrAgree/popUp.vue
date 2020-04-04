<template>
  <el-dialog
    :title="title"
    :visible.sync="showDialog"
    width="900px"
    append-to-body
    class="order-sign-dialog"
    center
  >
    <div class="sign-box">
      <iframe :src="TerminationConsent" height="600" width="850" name="demo" frameborder="0" scrolling="auto" sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts"  ></iframe>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="showDialog=false">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { gwUrl } from '@/config'
export default {
  components: {
  },
  data() {
    return {
      showDialog: false,
      TerminationConsent: '',
      title: ''
    }
  },
  methods: {
    open(val, title, url) {
      this.title = title
      const token = this.$store.getters.userinfo.Token
      this.showDialog = true
      const KeyID = val.KeyID
      // debugger
      this.TerminationConsent = `${gwUrl}/${url}?KeyID=${KeyID}&to=${token}`
      console.log(this.TerminationConsent)
    },
    close() {
      this.showDialog = false
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
  }
}
</style>
