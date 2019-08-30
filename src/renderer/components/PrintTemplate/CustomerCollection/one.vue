<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <!-- <td>日期</td> -->
        <td>交租时间</td>
        <td>房源编号</td>
        <td>区域</td>
        <td>物业地址</td>
        <td>客户姓名</td>
        <td>客户电话</td>
        <td>房租</td>
        <td>物管费</td>
        <td>其他费</td>
        <td>实收金额</td>
        <td>业务员</td>
        <td>备注</td>
        <!-- <td>管房人</td>
        <td>主管</td>
        <td>管房人收租逾期天数</td>
        <td>金额/天</td> -->
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData" :key="index">
        <!-- <td>{{ $dateFormat(item.ReceivableDate, 'yyyy-MM-dd')}}</td> -->
        <td>{{ item.PayDate}}</td>
        <td>{{ item.ContractNumber}}</td>
        <td>{{ item.CityName}}</td>
        <td>{{ item.CommunityName}}</td>
        <td>{{ item.TenantName}}</td>
        <td>{{ item.TenantPhone}}</td>
        <td>{{ item.HouseRent}}</td>
        <td>{{ item.ManagementFee}}</td>
        <td>{{ item.OtherFee}}</td>
        <td>{{ item.PaidMoney}}</td>
        <td>{{ item.Salesman}}</td>
        <td>{{ item.ReMark}}</td>
        <!-- <td>
          <div v-if="item.HouseManager.length > 0">
            <p v-for="item in item.HouseManager">{{item}}</p>
          </div>
          <div v-else><p></p></div>
        </td>
        <td>{{ item.Zhuguan}}</td>
        <td>{{ item.HouseManagerOverdueDays}}</td>
        <td>{{ item.HouseManagerOverdueMoney}}</td> -->
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
