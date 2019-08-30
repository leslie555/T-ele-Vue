<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
        <tr class="table-head">
          <td>房源编号</td>
          <td>区域</td>
          <td>物业地址</td>
          <td>门牌号</td>
          <td>客户姓名</td>
          <td>客户电话</td>
          <td>押金(元)</td>
          <td>租金(元)</td>
          <td>开始时间</td>
          <td>到期时间</td>
          <td>管家</td>
          <td>备注</td>
        </tr>
      </thead>
      <tbody>
        <tr class="table-head" v-for="(item, index) in printData" :key="index">
          <td>{{ item.HouseCode }}</td>
          <td>{{ item.CityName }}</td>
          <td>{{ item.CommunityName }}</td>
          <td>{{ item.HouseNumber }}</td>
          <td>{{ item.TenantName }}</td>
          <td>{{ item.TenantPhone }}</td>
          <td>{{ item.HouseDeposit }}</td>
          <td>{{ item.HouseRent }}</td>
          <td>{{ $dateFormat(item.StartTime, 'yyyy-MM-dd') }}</td>
          <td>{{ $dateFormat(item.EndTime, 'yyyy-MM-dd') }}</td>
          <td>{{ item.EmployeeName }}</td>
          <td>{{ item.BZ }}</td>
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
