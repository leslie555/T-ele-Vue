<template>
  <div class="tableBigBox">
    <div class="table-title">
      <h5>支出报表</h5>
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
        <td>{{ item.OwnerRent }}</td>
        <td>{{ item.UpgradingFee }}</td>
        <td>{{ item.RepairAndCleanFee }}</td>
        <td>{{ item.EmployeeAwardFee }}</td>
        <td>{{ item.EmployeeSalariesFee }}</td>
        <td>{{ item.TaxFee }}</td>
        <td>{{ item.OperateFee }}</td>
        <td>{{ item.TenantRentRefund }}</td>
        <td>{{ item.DepositRefund }}</td>
        <td>{{ item.ThirdPartyPayment }}</td>
        <td>{{ item.OtherFeePay }}</td>
        <td>{{ item.OtherFee  }}</td>
        <td>{{ item.TotalPay  }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'ExpendReports',
    props: {
      printData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        tHeader: ['月份', '业主租金', '升级改造费', '维修保洁费', '员工奖励', '员工薪资支出', '税收支出', '运营支出', '租客退租退款', '押金退款', '第三方还款', '其他办款（支）', '其他支出', '合计']
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
