<template>
  <div class="panel" @keyup.enter="submitForm">
    <el-form :model="model" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" >
      <div class="select-panel">
        <div class="select-header clearfix">
          <div class="select-header-left clearfix">
            <slot name="search"></slot>
          </div>
          <div class="select-header-right clearfix">
            <slot name="button"></slot>
          </div>
        </div>
        <el-collapse-transition>
          <div class="select-content">
            <slot name="more"></slot>
          </div>
        </el-collapse-transition>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SelectPanel',
  props: {
    model: Object,
    rules: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      show: false,
      labelPosition: 'left'
    }
  },
  methods: {
    submitForm() {
      console.log('submit!')
    }
  }
}
</script>

<style lang="scss">
  @import "./style";
</style>