<template>
  <div class="app-container contract-sign fixed-box">
    <div class="contract-sign-box">
      <el-scrollbar class="vertical-scroll">
        <contract-template class="contract-sign-template"></contract-template>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import ContractTemplate from '../../../components/ContractTemplate'

  export default {
    data() {
      return {}
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
