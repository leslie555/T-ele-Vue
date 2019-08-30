<template>
  <div class="item-container">
    <span class="item-label">{{label}}</span>
    <span class="item-text" :style="textStyle">
      <slot></slot>
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      label: String,
      textStyle: Object
    }
  }
</script>

<style lang="scss" scoped>
  .item-container {
    width: 240px;
    white-space: nowrap;
    .item-label {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      width: 60px;
      text-align: justify;
      text-align-last: justify;
      margin: 0 10px 0 0;
      color: #444;
      vertical-align: top;
    }
    .item-text {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      color: #888;
      white-space: nowrap;
    }
  }
</style>

