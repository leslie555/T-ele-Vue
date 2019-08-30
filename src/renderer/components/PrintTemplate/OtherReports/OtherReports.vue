<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <td>合同编号</td>
        <td>房源信息</td>
        <td>管房人</td>
        <td>备注</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData" :key="index">
        <td>{{ item.ContractNumber }}</td>
        <td>{{ item.HouseName}}</td>
        <td>{{ item.EmployeeName}}</td>
        <td>{{ item.BZ}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'OtherReports',
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
