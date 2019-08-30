<template>
  <div class="tableBigBox">
    <div class="table-title">
      <h5>装修报表</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <td v-for="(item,index) in tHeader" :key="index">{{item}}</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData" :key="index">
        <td>{{ item.Time }}</td>
        <td>{{ item.RepairTotal }}</td>
        <td>{{ item.RepairTime }}</td>
        <td>{{ item.OwnerRepairCosts }}</td>
        <td>{{ item.RepairLoan }}</td>
        <td>{{ item.RepairLoanInteres }}</td>
        <td>{{ item.CompRepairCosts }}</td>
        <td>{{ item.RepairCostsTotal }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'RepairReports',
    props: {
      printData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        tHeader: ['月份', '装修合计（间）', '装修耗时（天）', '装修费（业主）', '装修贷', '装修贷利息', '装修费（公司代付）', '装修费合计（元）']
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
