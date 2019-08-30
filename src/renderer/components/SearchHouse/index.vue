<template>
  <el-select
    v-model="houseName"
    filterable
    remote
    placeholder="请输入房源关键词"
    @change="handleHouseSelect"
    @input="handleInput"
    :remote-method="querySearchAsync"
    :disabled="disabled"
    :loading="loading">
    <el-option
      v-for="item in resultList"
      :key="item.KeyID"
      :label="item.HouseName"
      :value="item.KeyID">
    </el-option>
  </el-select>
</template>

<script>
  import { searchHouseList } from '../../api/house'

  export default {
    props: {
      type: {
        type: Number,
        default: 1
      },
      value: {
        type: String,
        default: ''
      },
      disabled: Boolean
    },
    watch: {
      value: {
        handler: function(newValue, oldValue) {
          this.houseName = newValue
        },
        immediate: true
      }
    },
    created() {
    },
    data() {
      return {
        houseName: '',
        resultList: [],
        loading: false
      }
    },
    methods: {
      handleHouseSelect(val) {
        const resultItem = this.resultList.find(v => v.KeyID === val)
        this.$emit('select', resultItem)
      },
      querySearchAsync(queryString) {
        if (this.loading) return
        if (queryString !== '') {
          this.loading = true
          searchHouseList({
            HouseName: queryString,
            Type: this.type,
            para: { page: 1, size: 20 }
          }).then(({ Data }) => {
            this.loading = false
            this.resultList = Data || []
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.resultList = []
        }
      },
      handleInput(val) {
        const resultItem = this.resultList.find(v => v.KeyID === val)
        this.$emit('input', resultItem.HouseName)
      }
    }
  }
</script>

<style scoped>

</style>
