<template>
  <el-select
    v-model="houseName"
    filterable
    remote
    :placeholder="type!==12?'请输入房源关键词':'请输入房源关键词或合同号'"
    @change="handleHouseSelect"
    @input="handleInput"
    :remote-method="querySearchAsync"
    :disabled="disabled"
    :loading="loading"
  >
    <el-option
      v-for="item in resultList"
      :key="item[keyWord]"
      :label="item.HouseName"
      :value="item[keyWord]"
    >
      <template v-if="type===12">
        <span style="float: left">{{ item.HouseName }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.TenantName }}</span>
      </template>
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
      keyWord: {
        type: String,
        default: 'KeyID'
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
    created() {},
    data() {
      return {
        houseName: '',
        resultList: [],
        loading: false
      }
    },
    methods: {
      handleHouseSelect(val) {
        const resultItem = this.resultList.find(v => v[this.keyWord] === val)
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
          })
            .then(({ Data }) => {
              this.loading = false
              this.resultList = Data || []
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.resultList = []
        }
      },
      handleInput(val) {
        const resultItem = this.resultList.find(v => v[this.keyWord] === val)
        this.$emit('input', resultItem.HouseName)
      },
      clear() {
        this.resultList = []
      }
    }
  }
</script>

<style scoped>
</style>
