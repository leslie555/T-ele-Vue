<template>
  <div class="panel-container">
    <div class="panel-header">
      <span class="panel-title">{{title}}</span>
      <slot name="rightHeader"></slot>
      <slot name="houseHeader"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'HomePanel',
    props: {
      title: String
    }
  }
</script>

<style lang="scss" scoped>
  .panel-container {
    background: #fff;
    border-radius: 6px;
    padding: 20px;
    margin-bottom: 10px;
  }
  .panel-header {
    display: flex;
    justify-content: space-between;
  }
  .panel-title {
    font-size: 14px;
    font-weight: bold;
    color: rgba(68, 68, 68, 1);
  }
</style>
<style lang="scss">
  .panel-container .el-button--text {
    padding: 0;
    color: #001529;
  }
</style>