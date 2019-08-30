<template>
  <div class="tableBigBox">
    <div class="table-title">
      <h5>收入报表</h5>
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
        <td>{{ item.TenantRent }}</td>
        <td>{{ item.TenantDeposit }}</td>
        <td>{{ item.DepositDefault }}</td>
        <td>{{ item.OwnerDefault }}</td>
        <td>{{ item.TenantDefault }}</td>
        <td>{{ item.TenantExpireMoney }}</td>
        <td>{{ item.OwnerPaysDecorationFee }}</td>
        <td>{{ item.ThirdPartyRevenue }}</td>
        <td>{{ item.OtherFeeIncome }}</td>
        <td>{{ item.OtherInCome }}</td>
        <td>{{ item.TotalIncome }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'IncomeReports',
    props: {
      printData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        tHeader: ['月份', '租客租金', '租客押金', '定金违约', '业主违约', '租客违约', '租客到期（损坏、维修、保洁等扣款）', '业主付装修费', '第三方收入', '其他办款（收）', '其他收入', '合计']
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
