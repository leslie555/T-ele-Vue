<template>
  <div class="tableBigBox">
    <div class="table-title">
      <h5>现金流水</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <td v-for="(item,index) in tHeader" :key="index">{{item}}</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData" :key="index">
        <td>{{ item.YearMonth }}</td>
        <td>{{ item.AccountTypeName }}</td>
        <td>{{ item.AccountName }}</td>
        <td>{{ item.AccountNumber }}</td>
        <td>{{ item.BankName }}</td>
        <td>{{ item.InitialBalance }}</td>
        <td>{{ item.AccountAdvance }}</td>
        <td>{{ item.OutOfAccount }}</td>
        <td>{{ item.Balance }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'CashFlow',
    props: {
      printData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        tHeader: ['月份', '账户类型', '账户名称', '账号', '银行名称', '期初余额', '进账', '出账', '余额']
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
