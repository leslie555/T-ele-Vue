<template>
  <div class="tableBigBox">
    <div class="measure-title">
      <h5>测算报表</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <td v-for="(item,index) in tHeader" :key="index">{{item}}</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData.Data" :key="index">
        <td v-if="printData.SearchData.Type!=='0'" style="white-space: nowrap">{{ item.CompanyName }}</td>
        <td v-if="printData.SearchData.Type!=='0' && printData.SearchData.Type!=='1'" style="white-space: nowrap">{{ item.DepName}}
        </td>
        <td v-if="printData.SearchData.Type==='3'" style="white-space: nowrap">{{ item.OwnerName}}</td>
        <td v-if="printData.SearchData.State==='1'" style="white-space: nowrap">{{ $dateFormat(item.Time,'yyyy')}}</td>
        <td v-if="printData.SearchData.State==='2'" style="white-space: nowrap">{{ $dateFormat(item.Time,'yyyy-MM')}}</td>
        <td style="white-space: nowrap">{{ item.BudgetNum }}</td>
        <td style="white-space: nowrap">{{ item.CheckNum}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'MeasureReports',
    props: {
      printData: {
        type: Object,
        required: true
      }
    },
    computed: {
      tHeader() {
        let temp = []
        if (Object.keys(this.printData).length === 0) {
          return temp
        }
        let arr1 = []
        if (this.printData.SearchData.Type === '3') { // 测算对象为管房人
          temp = ['公司名称', '部门名称', '管房人名称']
        } else if (this.printData.SearchData.Type === '1') { // 测算对象为公司
          temp = ['公司名称']
        } else if (this.printData.SearchData.Type === '2') { // 测算对象为部门
          temp = ['公司名称', '部门名称']
        }
        // 当时间周期为统计全部时没有时间
        arr1 = this.printData.SearchData.State === '0' ? ['预算次数', '核算次数'] : ['时间', '预算次数', '核算次数']
        temp.push(...arr1)
        return temp
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
