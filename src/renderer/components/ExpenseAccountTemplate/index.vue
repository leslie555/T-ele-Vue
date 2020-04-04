<template>
  <div>
    <el-dialog
      title="报销单打印模板"
      :visible.sync="expenseAccountVisible"
      width="1022px"
      append-to-body
      >
      <div class="PrintBox">
        <div :id="uuid">
          <iframe id="account-template" scrolling="no" frameborder="0" width="100%" :height="height" :src="accountUrl"></iframe>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" :loading="downloadLoading" @click="handleDownload">下载</el-button>
        <el-button type="primary" :loading="printLoading" @click="handlePrint">打印</el-button>
      </div>
      <a :href="downloadUrl" style="display: none;" target="_blank" download :id="downloadID"></a>
    </el-dialog>
  </div>
</template>

<script>
import printJS from 'print-js'
import { HtmlToPDF } from '@/api/system'
import { gwUrl, baseURL } from '@/config'
import uuid from '@/utils/uuid'
export default {
  data() {
    return {
      uuid: 'printBody_' + uuid(),
      expenseAccountVisible: false,
      downloadLoading: false,
      printLoading: false,
      accountUrl: '',
      downloadUrl: '',
      downloadID: '',
      KeyID: '',
      height: 620
    }
  },
  created() {
    window.addEventListener('message', (event) => {
      if (event.data.height > 0) {
        this.height = event.data.height + 'px'
      }
      console.log('event:', event)
    }, false)
  },
  methods: {
    close() {
      this.expenseAccountVisible = false
      this.printLoading = false
    },
    open(data) {
      this.accountUrl = `${gwUrl}/ExpenseAccount?KeyID=${data.row.ReimbursementID}&Token=${this.$store.getters.token}`
      console.log('报销单data:', data)
      console.log('accountUrl:', this.accountUrl)
      this.expenseAccountVisible = true
      this.KeyID = data.row.KeyID
      this.printLoading = false
      this.downloadID = 'downloadPrintTemplate_' + uuid()
    },
    handlePrint() {
      console.log('uuid:', this.uuid)
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
          // this.printLoading = false
          this.close()
        }
      })
    },
    handleDownload() {
      const signUrl = this.accountUrl
      console.log('下载signUrl:', signUrl)
      this.downloadLoading = true
      HtmlToPDF({
        Url: encodeURIComponent(signUrl)
      }).then(({ Data }) => {
        this.downloadUrl = baseURL + Data
        this.downloadLoading = false
        this.$nextTick(() => {
          document.getElementById(this.downloadID).click()
        })
        this.close()
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .PrintBox {
    height: 540px;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    overflow: auto;
  }
  #printBody{
    height: auto;
    width: auto;
    overflow: visible;
  }
</style>
