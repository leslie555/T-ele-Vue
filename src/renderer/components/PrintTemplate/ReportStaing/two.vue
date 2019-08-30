<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
        <tr class="table-head">
          <td>房源编号</td>
          <td>物业地址</td>
          <td>区域</td>
          <td>房间号</td>
          <td>客户信息</td>
          <td>月租金(元)</td>
          <td>业务员</td>
          <td>租赁期限</td>
          <td>金融机构</td>
          <td>缴费方式</td>
          <td>开始时间</td>
          <td>到期时间</td>
          <td>应收款</td>
          <td>备注</td>
        </tr>
      </thead>
      <tbody>
        <tr class="table-head" v-for="(item, index) in printData" :key="index">
          <td>{{ item.HouseCode }}</td>
          <td>{{ item.HouseName }}</td>
          <td>{{ item.Location }}</td>
          <td>{{ item.HouseNumber }}</td>
          <td>{{ item.CustomerName }}</td>
          <td>{{ item.HouseRent }}</td>
          <td>{{ item.EmployeeName }}</td>
          <td>{{ item.LeaseTerm }}</td>
          <td>{{ $EnumData.getEnumDesByValue('TenantStageType', item.TenantStageType) }}</td>
          <td>{{ item.PayModel }}</td>
          <td>{{ $dateFormat(item.StartDate, 'yyyy-MM-dd')  }}</td>
          <td>{{ $dateFormat(item.EndDate, 'yyyy-MM-dd') }}</td>
          <td>{{ item.Receivables }}</td>
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
