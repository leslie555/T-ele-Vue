<template>
  <div>
    <el-popover
      v-if="allRemark.length>remarkOptions.showWordCount"
      :placement="remarkOptions.placement"
      :title="title"
      :width="remarkOptions.width"
      :trigger="remarkOptions.trigger"
      :content="allRemark"
      ref="popover"
    ></el-popover>
    <span v-popover:popover>{{simplifiedRemark}}</span>
  </div>
</template>

<script>
export default {
  name: 'tableRemark',
  props: {
    options: {
      type: Object,
      default: () => { }
    },
    allRemark: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '备注'
    }
  },
  data() {
    return {
      defaultOptions: {
        showWordCount: 10,
        placement: 'right',
        trigger: 'hover',
        width: '200'
      }
    }
  },
  computed: {
    simplifiedRemark() {
      if (this.allRemark) {
        return this.allRemark.length > this.remarkOptions.showWordCount
          ? this.allRemark.substr(0, this.remarkOptions.showWordCount) + '...'
          : this.allRemark
      } else {
        return ''
      }
    },
    remarkOptions() {
      return Object.assign(this.defaultOptions, this.options)
    }
  }
}
</script>
