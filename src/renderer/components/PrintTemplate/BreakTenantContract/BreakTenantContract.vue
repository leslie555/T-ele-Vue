<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <td>时间</td>
        <td>违约数量</td>
        <td>违约率</td>
        <td>整租违约</td>
        <td>合租违约</td>
        <td>违约收入</td>
        <td>违约支出</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData" :key="index">
        <td>{{ $dateFormat(item.Time,'yyyy-MM') }}</td>
        <td>{{ item.DefaultNumber}}</td>
        <td>{{ item.DefaultRate}}</td>
        <td>{{ item.AllDefault}}</td>
        <td>{{ item.PartDefault}}</td>
        <td>{{ item.DefaultIncome}}</td>
        <td>{{ item.DefaultPay}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'BreakTenantContract',
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
