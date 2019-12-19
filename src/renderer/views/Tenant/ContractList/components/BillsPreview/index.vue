<template>
  <el-dialog
    width="940px"
    append-to-body
    center
    @open="handleOpen"
    @closed="handleClosed"
    class="has-scroll"
    title="退房预览签字"
    :visible.sync="dialogVisible">
    <div class="bills-preview-box" :id="uuid">
      <iframe id="bills-preview" frameborder="0" width="100%" height="100%" :src="billsPreviewUrl"></iframe>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit()" v-show="!isDetail">提交</el-button>
      <el-button type="primary" @click="handleSign(0)" v-show="!isDetail">租客签字</el-button>
      <el-button type="primary" @click="handleSign(1)" v-show="!isDetail">退房人签字</el-button>
      <el-button type="primary" :loading="downloadLoading" @click="handleDownload">打印</el-button>
      <el-button type="primary" :loading="downloadLoading" @click="handleDownload">下载PDF</el-button>
      <el-button @click="close">关 闭</el-button>
    </div>
    <el-dialog
      :title="signTitle"
      :visible.sync="showQRCodeDialog"
      width="400px"
      append-to-body
      class="order-sign-dialog"
      @open="handleOpenQRCode"
      center
    >
      <div class="sign-box">
        <div class="scan-box">
          <qrcode :value="baseURI" :options="{ size: 200 }"></qrcode>
        </div>
        <div class="sign-text">请扫描二维码签字</div>
        <!-- <div class="sign-notice">
          <p>注：</p>
          <p>请扫描二维码预览合同并进行线上签约认证。</p>
        </div>-->
      </div>
      <div slot="footer">
        <el-button type="primary" @click="showQRCodeDialog=false">返回</el-button>
      </div>
    </el-dialog>
    <a :href="downloadUrl" target="_blank" style="display: none;" download :id="downloadID"></a>
</el-dialog>
</template>

<script>
/* eslint-disable no-undef */
import uuid from '@/utils/uuid'
import Qrcode from '@xkeshi/vue-qrcode'
import { HtmlToPDF } from '@/api/system'
import { SearchCheckOutSign, SubmitCheckoutApproval } from '../../../../../api/tenant'
import { phoneURL, gwUrl, baseURL } from '@/config'
import { mapActions } from 'vuex'

export default {
  name: 'BillsPreview',
  props: {
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contractID: 0,
      uuid: 'printCheckoutBody_' + uuid(),
      signTitle: '',
      dialogVisible: false,
      printLoading: false,
      baseURI: '',
      signType: 1, // 0 租客 1 退房人
      showQRCodeDialog: false,
      interval: null, // 轮训循环器
      billsPreviewUrl: '',
      downloadUrl: '',
      downloadLoading: false,
      submitAuditReady: false,
      submitLoading: false,
      count: 0,
      downloadID: ''
    }
  },
  components: {
    Qrcode
  },
  created() {
    //
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    ...mapActions([
      'delView'
    ]),
    open(data) {
      this.contractID = data && data.contractID
      this.billsPreviewUrl = `${gwUrl}/AllCheckout?KeyID=${this.contractID}&to=${this.$store.getters.token}`
      this.dialogVisible = true
      this.downloadID = 'downloadCheckOut_' + uuid()
    },
    close() {
      this.dialogVisible = false
    },
    handleOpen(data) {
      this.checkSignInfo(0)
      this.interval = setInterval(() => {
        this.checkSignInfo(1)
      }, 5000)
    },
    checkSignInfo(type) {
      SearchCheckOutSign({
        KeyID: this.contractID
      }).then(({ Data }) => {
        if (type === 0) {
          if (Data.TenSignInfo) {
            this.count++
          }
          if (Data.SalesmanSignInfo) {
            this.count++
          }
        } else {
          let count = 0
          if (Data.TenSignInfo) {
            count++
          }
          if (Data.SalesmanSignInfo) {
            count++
          }
          if (count !== this.count) {
            // 刷新 iframe
            this.showQRCodeDialog = false
            const doc = document.getElementById(`bills-preview`)
            doc.setAttribute('src', doc.getAttribute('src'))
            this.count = count
          }
        }
        if (Data.TenSignInfo && Data.SalesmanSignInfo) {
          this.submitAuditReady = true
          this.handleClosed()
        }
      }).catch(() => {
        this.handleClosed()
      })
    },
    handleClosed() {
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
    handleOpenQRCode() {
      const param = {}
      param.id = this.contractID
      param.to = this.$store.getters.token
      param.ti = new Date().getTime()
      param.ty = this.signType
      param.bt = 1
      const objToUrl = Object.entries(param).map(item => {
        const [k, v] = item
        return `${k}=${v}`
      }).join('&')
      this.baseURI = phoneURL + 'ordersign?' + objToUrl
      console.log(this.baseURI)
    },
    handlePrint() {
      this.printLoading = true
      printJS({
        printable: this.uuid, // 要打印区域的元素ID
        type: 'html',
        // 继承原来的所有样式
        targetStyles: ['*'],
        onLoadingStart: () => {
          console.log(3)
        },
        onLoadingEnd: () => {
          console.log(4)
        },
        onPrintDialogClose: () => {
          console.log(5)
          this.printLoading = false
        }
      })
    },
    handleSign(type) {
      // 0 租客 1 退房人
      this.signType = type
      this.showQRCodeDialog = true
    },
    handleDownload() {
      // 打印暂时用下载方式
      this.downloadLoading = true
      HtmlToPDF({
        Url: encodeURIComponent(this.billsPreviewUrl)
      }).then(({ Data }) => {
        this.downloadLoading = false
        this.downloadUrl = baseURL + Data
        this.$nextTick(() => {
          document.getElementById(this.downloadID).click()
        })
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    handleSubmit() {
      if (!this.submitAuditReady) {
        this.$message.error('请签完字后再提交审核！')
        return
      }
      this.submitLoading = true
      SubmitCheckoutApproval({
        KeyID: this.contractID
      }).then(() => {
        this.submitLoading = false
        this.dialogVisible = false
        this.$alert('提交审核成功', '温馨提示').then(() => {
          this.delView(this.$route)
          this.$router.push({
            path: '/Tenant/ContractList'
          })
        })
      }).catch(() => {
        this.submitLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../../styles/variables";
  @import "../../../../../styles/mixin";
  // @import "style";
  .bills-preview-box {
    height: 600px;
    // overflow: auto;
  }
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
</style>
