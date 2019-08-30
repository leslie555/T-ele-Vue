<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <td>预计可入金额</td>
        <td>实际可入金额</td>
        <td v-show="IsShowYear > 0">日期</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData" :key="index">
        <td>{{item.BudgetAllAchievement}}</td>
        <td>{{item.CheckAllAchievement}}</td>
        <td v-show="IsShowYear > 0">{{ item.Time}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'index',
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
      },
      IsShowYear: {
        type: ''
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
  @import 'style';
</style>
