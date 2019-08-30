<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
        <tr class="table-head">
          <td>序号</td>
          <td>合同号</td>
          <td>管房人</td>
          <td>业务员电话</td>
          <td>主管</td>
          <td>区域楼盘</td>
          <td>房号</td>
          <td>单间数</td>
          <td>空置房间号</td>
          <td>最后租客月租金</td>
          <td>押金</td>
          <td>退押金</td>
          <td>退房时间</td>
          <td>截止时间</td>
          <td>空置天数</td>
          <td>1月扣空租(金额)</td>
          <td>备注</td>
        </tr>
      </thead>
      <tbody>
        <tr class="table-head" v-for="(item, index) in printData" :key="index">
          <td>{{ item.OrderNumber }}</td>
          <td>{{ item.OwnerID }}</td>
          <td>{{ item.TubehouseempList }}</td>
          <td>{{ item.SalesmanTel }}</td>
          <td>{{ item.Director }}</td>
          <td>{{ item.CityName }}</td>
          <td>{{ item.CommunityName }}</td>
          <td>{{ item.RoomNum }}</td>
          <td>{{ item.SingleRoomNum }}</td>
          <td>{{ item.VacantRoomNum }}</td>
          <td>{{ item.LastTenantRent }}</td>
          <td>{{ item.Deposit }}</td>
          <td>{{ item.ReturnDeposit }}</td>
          <td>{{ $dateFormat(item.ReturnRoomTime, 'yyyy-MM-dd') }}</td>
          <td>{{ $dateFormat(item.ClosingDate, 'yyyy-MM-dd') }}</td>
          <td>{{ item.VacantDays }}</td>
          <td>{{ item.a }}</td>
          <td>{{ item.a }}</td>
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
