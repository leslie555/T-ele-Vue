<template>
  <div class="section-container">
    <p class="section-title">{{title}}</p>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      title: String
    }
  }
</script>

<style lang="scss" scoped>
  .section-container {
    padding-bottom: 30px;
    .section-title {
      color: #999;
      margin-bottom: 14px;
    }
  }
</style>

