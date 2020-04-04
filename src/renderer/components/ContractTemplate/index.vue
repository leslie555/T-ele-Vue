<template>
  <div class="contract-template-outer">
    <div class="print-div" @click="print">
      <a title="打印合同">
        <i class="iconfont icon-print icon-print-contract"></i>
      </a>
    </div>
    <div class="contract-template-iframe" v-loading="loading"  id="ContractTemplate">
        <div v-if="IsOwnerContract">
          <iframe id="owner-contract" scrolling="no" frameborder="0" width="800px" :height="height" :src="OwnerSrcUrl"></iframe>
        </div>
        <div v-if="!IsOwnerContract">
          <iframe id="tenant-contract" scrolling="no" frameborder="0" width="800px" :height="height" :src="TenantSrcUrl"></iframe>
        </div>
    </div>
  </div>
</template>

<script>
import printJS from 'print-js'
import nzhcn from 'nzh/cn'
import { gwUrl } from '../../config'

export default {
  name: 'ContractTemplate',
  props: {
    id: {
      default: 0
    },
    preview: {
      type: String
    }
  },
  data() {
    return {
      useToken: this.$store.state.user.token,
      nzhcn,
      IsOwnerContract: false,
      previewType: 0,
      ContractContent: {},
      OwnerSrcUrl: '',
      TenantSrcUrl: '',
      TenantTotalAmount: 0.00,
      height: 5800,
      loading: false
    }
  },
  created() {
    this.fillData()
    window.addEventListener('message', (event) => {
      if (event.data.height > 0) {
        this.height = event.data.height + 'px'
      }
    }, false)
  },

  methods: {
    fillData() {
      this.loading = true
      const ownerList = ['OwnerContractSign', 'OwnerContractDetail', 'OwnerContractPreview']
      if (ownerList.some(v => v === this.$route.name)) {
        this.IsOwnerContract = true
        if (this.id) {
          if (this.preview) {
            this.previewType = 1
          }
        }
      } else {
        if (this.id) {
          if (this.preview) {
            this.previewType = 1
          }
        }
      }
      this.OwnerSrcUrl = `${gwUrl}/OwnerContract?KeyID=${this.id}&&Token=${this.useToken}&&contractType=1&&previewType=${this.previewType}`
      this.TenantSrcUrl = `${gwUrl}/TenantContract?KeyID=${this.id}&&Token=${this.useToken}&&contractType=0&&previewType=${this.previewType}&&req=0`
      console.log('业主合同网址', this.OwnerSrcUrl, '租客合同网址', this.TenantSrcUrl)
      setTimeout(() => {
        // console.log('id', this.id)
        this.loading = false
      }, 3000)
    },
    print() {
      const item_mark = this.$el.querySelector('.contract-list-item-mark')
      item_mark && (item_mark.style.marginTop = '80px')
      printJS({
        printable: 'ContractTemplate', // 要打印区域的元素ID
        type: 'html',
        documentTitle: this.IsOwnerContract ? '房屋租赁运营管理委托协议' : '房屋租赁合同',
        // 继承原来的所有样式
        targetStyles: ['*'],
        onLoadingStart: () => {
          console.log(3)
        },
        onLoadingEnd: () => {
          console.log(4)
        },
        onPrintDialogClose: () => {
          item_mark && (item_mark.style.marginTop = '40px')
          console.log(5)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
