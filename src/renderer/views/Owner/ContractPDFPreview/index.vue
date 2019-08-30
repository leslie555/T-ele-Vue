<template>
  <div class="app-container contract-sign fixed-box" v-loading="visible" :element-loading-text="loadingText">
    <div class="contract-sign-box">
      <iframe height="100%" width="100%"
              :src="viewUrl"
              v-if="viewUrl"
              frameborder="0"></iframe>
      <div class="btn-box">
        <!--<el-button type="primary" plain size="small" @click="printContract">打印合同</el-button>-->
        <el-button type="primary" plain size="small" @click="downloadContract">下载合同</el-button>
      </div>
    </div>
    <!--<div class="print-div" @click="printContract">-->
    <!--<a title="打印合同">-->
    <!--<i class="iconfont icon-print icon-print-contract"></i>-->
    <!--</a>-->
    <!--</div>-->
    <!--<div class="download-div" @click="downloadContract">-->
    <!--<a title="下载合同">-->
    <!--<i class="iconfont icon-xiazai icon-download-contract"></i>-->
    <!--</a>-->
    <!--</div>-->
    <a :href="downloadUrl" style="display: none;" download id="downloadContract"></a>
  </div>
</template>

<script>
  /* eslint-disable no-undef */

  import { getDownloadContract, onlyViewContract } from '../../../api/owner'

  export default {
    data() {
      return {
        query: this.$route.query,
        visible: false,
        loadingText: '合同加载中..',
        CustomerId: '',
        viewUrl: '',
        downloadUrl: ''
      }
    },
    created() {
      this.getViewUrl()
    },
    methods: {
      getViewUrl() {
        this.loadingText = '签署文件生成中...'
        return onlyViewContract({
          ContractId: this.query.ContractID,
          TemplateType: +this.query.type + 1
        }).then(({ Data }) => {
          this.viewUrl = decodeURIComponent(Data)
        }).finally(() => {
          this.visible = false
        })
      },
      printContract() {
        this.visible = true
        this.loadingText = '正在生成PDF文件...'
        getDownloadContract({
          ContractId: this.query.ContractID,
          TemplateType: +this.query.type + 1
        }).then(({ Data }) => {
          this.visible = false
          printJS({ printable: decodeURIComponent(Data), type: 'pdf' })
        }).catch(() => {
          this.visible = false
        })
      },
      downloadContract() {
        this.visible = true
        this.loadingText = '正在生成下载链接...'
        getDownloadContract({
          ContractId: this.query.ContractID,
          TemplateType: +this.query.type + 1
        }).then(({ Data }) => {
          this.visible = false
          this.downloadUrl = decodeURIComponent(Data)
          this.$nextTick(() => {
            document.getElementById('downloadContract').click()
          })
          console.log(this.downloadUrl)
        }).catch(() => {
          this.visible = false
        })
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
