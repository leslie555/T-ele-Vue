<template>
  <div class="app-container contract-sign fixed-box" v-loading="visible" :element-loading-text="loadingText">
    <div class="contract-sign-box">
      <el-scrollbar class="vertical-scroll-hack">
        <iframe height="100%" width="100%"
                :src="signURI"
                v-if="signURI"
                frameborder="0"></iframe>
      </el-scrollbar>
    </div>
    <div class="bottom-box">
      <el-button type="primary" @click="signHandle">现场签字</el-button>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="showDialog"
      width="700px"
      append-to-body
      class="contract-sign-dialog"
      @open="open"
      center
    >
      <div class="sign-box">
        <div class="scan-box">
          <qrcode :value="baseURI" :options="{ size: 200 }"></qrcode>
        </div>
        <div class="sign-text">请扫描二维码签字</div>
        <div class="sign-notice">
          <p>注：</p>
          <p>请扫描二维码预览合同并进行线上签约认证。</p>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handleClose">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ContractTemplate from '../../../components/ContractTemplate'
  import Qrcode from '@xkeshi/vue-qrcode'
  import { phoneURL } from '../../../config'
  import { mapActions } from 'vuex'
  import store from '../../../store/index'
  import { personAuth, viewContract } from '../../../api/owner'

  export default {
    data() {
      return {
        query: this.$route.query,
        showDialog: false,
        visible: false,
        loadingText: '个人信息认证中..',
        baseURI: '',
        signURI: '',
        CustomerId: '',
        type: this.$route.name === 'OwnerContractSign' ? 0 : 1
      }
    },
    computed: {
      title() {
        return '二维码签字'
      }
    },
    created() {
      this.personAuth()
    },
    components: {
      ContractTemplate,
      Qrcode
    },
    methods: {
      ...mapActions([
        'delView'
      ]),
      signHandle() {
        this.showDialog = true
      },
      confirm() {
        const successUrl = this.type === 0 ? '/Owner/ContractList' : '/Tenant/ContractList'
        this.delView(this.$route)
        this.$router.push({
          path: successUrl
        })
      },
      open() {
        const param = {}
        param.i = this.query.IDCard
        param.m = this.query.Mobile
        param.n = encodeURIComponent(this.query.Name)
        param.c = this.query.ContractID
        param.to = store.getters.token
        param.ty = this.type
        param.cu = this.CustomerId
        param.ti = new Date().getTime()
        this.baseURI = phoneURL + 'ContractSign?p=' + JSON.stringify(param)
        console.log(this.baseURI)
      },
      personAuth() {
        this.visible = true
        return personAuth({
          Idcard: this.query.IDCard,
          Mobile: this.query.Mobile,
          Name: this.query.Name,
          ElectronicSeal: ''
        }).then(({ Data }) => {
          this.visible = false
          if (Data.Status === 0) {
            this.CustomerId = Data.CustomerId
            this.getViewContract()
          } else {
            this.authFail()
          }
        }).catch(() => {
          this.visible = false
          // this.authFail()
        })
      },
      authFail() {
        this.$confirm('个人认证失败，请核对客户，身份证和电话。', '温馨提示', {
          cancelButtonText: '返回列表',
          confirmButtonText: '重新认证'
        }).then(() => {
          this.personAuth()
        }).catch(() => {
          this.confirm()
        })
      },
      getViewContract() {
        this.visible = true
        this.loadingText = '正在生成预览'
        viewContract({
          ContractId: this.query.ContractID,
          TemplateType: this.type + 1
        }).then(({ Data }) => {
          this.signURI = decodeURIComponent(Data)
        }).finally(() => {
          this.visible = false
        })
      },
      handleClose() {
        this.showDialog = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
<style lang="scss">
  @import "global-style";
</style>
