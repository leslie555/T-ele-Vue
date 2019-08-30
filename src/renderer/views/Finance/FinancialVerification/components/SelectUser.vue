<template>
  <el-select
    filterable
    remote
    v-model="selectedUser"
    :placeholder="titleText"
    :remote-method="SearchCustomer"
    :loading="loading"
    @change="handleChange"
  >
    <el-option
      v-for="(item,idx) in CustomerList"
      :key="idx"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
  import { GetCustomerList } from '@/api/finance'
  export default {
    name: 'SelectUser',
    props: {
      value: '',
      userType: Number,
      type: Number
    },
    data() {
      return {
        loading: false,
        originList: [],
        CustomerList: null
      }
    },
    methods: {
      // 根据用户名字或手机号搜索
      SearchCustomer(val) {
        this.loading = true
        GetCustomerList({
          pageParam: {
            size: 10,
            page: 1
          },
          type: this.type,
          CustomerType: this.userType,
          KeyWord: val
        }).then(response => {
          this.loading = false
          this.originList = response.Data.rows
          this.CustomerList = response.Data.rows.map(val => ({ label: val.CustomerName, value: val.CustomerName }))
        }).catch(() => {
          this.loading = false
        })
      },
      clearCustomerList() {
        this.CustomerList = []
      },
      // 选择用户
      handleChange(val) {
        const item = this.originList.find(v => v.CustomerName === val)
        this.$emit('change', item)
      }
    },
    computed: {
      titleText() {
        let titleText = ''
        if (this.userType === 0) {
          titleText = '请输入员工姓名'
        } else if (this.userType === 1) {
          titleText = '请输入租客姓名'
        } else if (this.userType === 2) {
          titleText = '请输入业主姓名'
        }
        return titleText
      },
      selectedUser: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    }

  }
</script>

<style scoped>
</style>
