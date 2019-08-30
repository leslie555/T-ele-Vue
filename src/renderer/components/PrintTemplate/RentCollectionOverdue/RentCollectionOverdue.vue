<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <td>月份</td>
        <td>今日</td>
        <td>1-3天</td>
        <td>4-7天</td>
        <td>8-10天</td>
        <td>11-15天</td>
        <td>15天以上</td>
        <td>总计</td>
        <td>收租率</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData" :key="index">
        <td>{{ $dateFormat(item.Time,'yyyy-MM') }}</td>
        <td>{{ item.Today}}</td>
        <td>{{ item.OneToThree}}</td>
        <td>{{ item.FourToSeven}}</td>
        <td>{{ item.EightToTen}}</td>
        <td>{{ item.ElevenToFifteen}}</td>
        <td>{{ item.FifteenAbove}}</td>
        <td>{{ item.Total}}</td>
        <td>{{ item.RentRate}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'VacantReport',
    props: {
      printData: {
        type: Array,
        default: () => {
          return []
        }
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        newPrintData: this.$deepCopy(this.PrintData)
      }
    },
    methods: {
    }
  }

</script>
<style lang="scss" scoped>
  @import "style";
</style>
