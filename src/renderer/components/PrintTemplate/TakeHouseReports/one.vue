<template>
  <div class="tableBigBox">
    <div class="table-title">
      <h5>拿房报表</h5>
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
        <td>{{ item.RentCreation }}</td>
        <td>{{ item.RentFree }}</td>
        <td>{{ item.Reform }}</td>
        <td>{{ item.NoPayFirstYear }}</td>
        <td>{{ item.DoubleTenPercent }}</td>
        <td>{{ item.Ymodel }}</td>
        <td>{{ item.FivePlusOneModel }}</td>
        <td>{{ item.TwoThreeModel }}</td>
        <td>{{ item.TwoThreeOneModel }}</td>
        <td>{{ item.OtherModel }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'TakeHouseReports',
    props: {
      printData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        tHeader: ['月份', '拿房数量', '有起租', '有免租', '改造', '第一年不付', '10%10%', 'Y模式', '5+1模式', '2333模式', '23331模式', '其他模式']
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
