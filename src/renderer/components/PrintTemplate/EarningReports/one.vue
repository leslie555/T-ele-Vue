<template>
  <div class="tableBigBox">
    <div class="table-title">
      <h5>业绩报表</h5>
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
        <td>{{ item.TakeHouseCount }}</td>
        <td>{{ item.VacantCount }}</td>
        <td>{{ item.OutOfHouseCount }}</td>
        <td>{{ item.RentalRate }}</td>
        <td>{{ item.TenantExpired }}</td>
        <td>{{ item.TenantRenewal }}</td>
        <td>{{ item.TenantRenewalRate }}</td>
        <td>{{ item.OwnerExpired }}</td>
        <td>{{ item.OwnerRenewal }}</td>
        <td>{{ item.OwnerRenewalRate }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'EarningReports',
    props: {
      printData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        tHeader: ['月份', '拿房数量', '空置数量', '出房数量', '出租率', '租客到期', '租客续约', '租客续约率', '业主到期', '业主续约', '业主续约率']
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
