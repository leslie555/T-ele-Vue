<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <td>月份</td>
        <td>0-7天</td>
        <td>8-15天</td>
        <td>16-20天</td>
        <td>21-30天</td>
        <td>31-50天</td>
        <td>50天以上</td>
        <td>空置合计</td>
        <td>空置率</td>
        <td>空置成本</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData" :key="index">
        <td>{{ $dateFormat(item.Time,'yyyy-MM') }}</td>
        <td>{{ item.ZeroToSeven}}</td>
        <td>{{ item.EighToFifteen}}</td>
        <td>{{ item.SixteenToTwenty}}</td>
        <td>{{ item.TwentyOneToThirty}}</td>
        <td>{{ item.ThirtyOneToFifty}}</td>
        <td>{{ item.FiftyAbove}}</td>
        <td>{{ item.Total}}</td>
        <td>{{ item.VacantRate}}</td>
        <td>{{ item.VacantCost}}</td>
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
