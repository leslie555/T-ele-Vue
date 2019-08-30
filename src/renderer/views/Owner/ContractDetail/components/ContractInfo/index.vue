<template>
  <div class="contract-info">
    <div class="contract-left">
      <div class="panel-title">电子合同</div>
      <div class="contract-template">
        <contract-template :id="ContractInfo.KeyID" v-if="ContractInfo.KeyID"></contract-template>
      </div>
    </div>
    <div class="contract-right" v-if="ImageUpload.length>0||showViewPDF">
      <template v-if="showViewPDF">
        <div class="panel-title">附件</div>
        <div class="appendix-container" @click="viewPDF">
          <div class="appendix-img-container">
            <img class="appendix-img" src="../../../../../assets/PDF.png"/>
          </div>
          <div class="appendix-text">
            <p>{{type===0?`业主房屋租赁运营管理委托协议`:`租客房屋租赁合同`}}</p>
          </div>
        </div>
      </template>
      <template v-if="ImageUpload.length>0">
        <div class="panel-title">证件照片</div>
        <div class="contract-imgs">
          <div class="img-box" v-for="(item,index) in ImageUpload" :key="index">
            <img :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                 @click="$seeImage($ImgUnit.getImgUrl(item.ImageLocation))">
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import ContractTemplate from '../../../../../components/ContractTemplate'

  export default {
    props: {
      type: {
        type: Number,
        default: 0
      },
      ContractInfo: {
        type: Object,
        default() {
          return {}
        }
      },
      ContractOperate: {
        type: Object,
        default() {
          return {}
        }
      },
      ImageUpload: {
        type: Array,
        default() {
          return []
        }
      }
    },
    computed: {
      showViewPDF() {
        const flag = this.ContractInfo.PaperType === 0 && this.ContractOperate.AuditStatus === 2
        return flag
        // if (this.type === 0) {
        //   return flag && this.ContractOperate.LeaseStatus === 3
        // } else {
        //   return flag && this.ContractOperate.RentLeaseStatus === 3
        // }
      }
    },
    components: {
      ContractTemplate
    },
    methods: {
      viewPDF() {
        this.$router.push({
          path: '/Owner/ContractPDFPreview',
          query: {
            ContractID: this.ContractInfo.KeyID,
            type: this.type
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "style";
</style>

