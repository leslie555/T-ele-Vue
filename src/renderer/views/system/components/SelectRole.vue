<template>
  <el-select v-model="roles" multiple placeholder="请选择" @change="handleChange">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    ></el-option>
  </el-select>
</template>
<script>
  export default {
    name: 'selectRole',
    props: {
      roleArr: Array,
      options: Array
    },
    data() {
      return {
        roles: [...this.roleArr]
      }
    },
    methods: {
      handleChange() {
        this.$emit('change', this.roles)
      }
    },
    created() {
      this.$watch('roleArr', function(newVal, oldVal) {
        this.roles = newVal
      })
    }
  }
</script>
