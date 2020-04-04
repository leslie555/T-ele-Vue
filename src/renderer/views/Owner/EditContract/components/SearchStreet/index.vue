<template>
  <el-select
    v-model="streetName"
    filterable
    remote
    placeholder='请输入街道关键词'
    @focus="focusSearch"
    @change="handleStreetSelect"
    @input="handleInput"
    :remote-method="querySearchAsync"
    :disabled="disabled"
    :loading="loading"
  >
    <el-option
      v-for="item in resultList"
      :key="item.UUID"
      :label="item.Street"
      :value="item.Street"
    >
    </el-option>
  </el-select>
</template>

<script>
  import { ShowStreetByCityCodeList } from '../../../../../api/house'

  export default {
    props: {
      CityCode: String,
      value: {
        type: String,
        default: ''
      },
      disabled: Boolean
    },
    watch: {
      value: {
        handler: function(newValue, oldValue) {
          console.log(newValue)
          this.streetName = newValue
        },
        immediate: true
      }
    },
    created() {},
    data() {
      return {
        streetName: '',
        resultList: [],
        loading: false
      }
    },
    methods: {
      handleStreetSelect(val) {
        const resultItem = this.resultList.find(v => v.Street === val)
        this.$emit('select', resultItem.Street)
      },
      focusSearch() {
        this.querySearchAsync(this.streetName, 1)
      },
      querySearchAsync(queryString, type = 0) {
        if (this.loading) return
        if (type === 0 || type === 1 && !queryString) {
          this.loading = true
          console.log(type, queryString)
          ShowStreetByCityCodeList({
            Keyword: queryString,
            CityCode: this.CityCode,
            pageParam: { page: 1, size: 20 }
          })
            .then(({ Data }) => {
              this.loading = false
              this.resultList = Data || []
            })
            .catch(() => {
              this.loading = false
            })
        }
      },
      handleInput(val) {
        const resultItem = this.resultList.find(v => v.Street === val)
        this.$emit('input', resultItem.Street)
      },
      clear() {
        this.resultList = []
      }
    }
  }
</script>

<style scoped>
</style>
