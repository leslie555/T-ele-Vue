<template>
  <div style="text-align:center">
    <el-button
      plain
      :type="option.type"
      size="mini"
      v-for="option in filteredOptions"
      :key="option.key"
      @click="handleClick(option)"
      ref="btn"
    >{{option.value}}</el-button>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tableButtons',
  props: {
    options: Array,
    condition: Array,
    showAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClick(option) {
      this.$emit(`handle${option.key}Click`)
    }
  },
  computed: {
    filteredOptions() {
      const actionPermission = this.$store.getters.currentActions
      return this.options.filter(val => {
        // debugger
        return this.showAll ? this.condition.find(v => v === val.key) : this.condition.find(v => v === val.key) && actionPermission.includes(val.key)
      })
    }
  }
}
</script>
