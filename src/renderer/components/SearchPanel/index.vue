<template>
  <div class="panel" @keyup.enter="submitForm">
    <el-form :model="model" :inline="true" :rules="rules" status-icon ref="ruleForm" :label-width="labelWidth" @submit.native.prevent>
      <div class="search-panel">
        <div class="search-header clearfix" :class="boxFlex?`search-header-flex`:`search-header-normal`">
          <div class="search-header-left">
            <slot name="search"></slot>
            <div class="search-header-toggle" @click="toggleCondition()" v-show="$slots['more']&&!show">
              <span>更多条件</span>
              <i :class="iconClass"></i>
            </div>
          </div>
          <div class="search-header-right" :style="boxFlex?{width: rightWidth}:{}">
            <slot name="button"></slot>
          </div>
        </div>
        <el-collapse-transition>
          <div class="search-content" v-show="showMore||show">
            <slot name="more"></slot>
          </div>
        </el-collapse-transition>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'SearchPanel',
    props: {
      labelWidth: String,
      boxFlex: {
        type: Boolean,
        default: false
      },
      rightWidth: String,
      model: Object,
      show: {
        type: Boolean,
        default: false
      },
      rules: {
        type: Object,
        default: function() {
          return {}
        }
      },
      search: Function
    },
    data() {
      return {
        showMore: false
      }
    },
    computed: {
      iconClass() {
        return this.showMore ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      }
    },
    methods: {
      toggleCondition() {
        this.showMore = !this.showMore
      },
      validate() {
        return this.$refs.ruleForm.validate(...arguments)
      },
      validateField() {
        return this.$refs.ruleForm.validateField(...arguments)
      },
      resetFields() {
        return this.$refs.ruleForm.resetFields(...arguments)
      },
      clearValidate() {
        return this.$refs.ruleForm.clearValidate(...arguments)
      },
      submitForm() {
        if (this.search) {
          this.search()
          return
        }
        const bottomTool = this.$parent.$refs.bottomToolBar
        if (bottomTool) {
          bottomTool.search()
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "style";
</style>
