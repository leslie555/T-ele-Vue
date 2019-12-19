<template>
  <div class="app-container contract-sign fixed-box">
    <div class="contract-sign-box">
      <el-scrollbar class="vertical-scroll">
        <!-- 112321 -->
        <contract-template class="contract-sign-template" :id="id" preview="preview"></contract-template>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import ContractTemplate from '../../../components/ContractTemplate'

  export default {
    data() {
      return {
        id: this.$route.query.KeyID
      }
    },
    components: {
      ContractTemplate
    }
  }
</script>

<style lang="scss" scoped>
  @import "../ContractSign/style";
</style>
<style lang="scss">
  @import "../ContractSign/global-style";
</style>
