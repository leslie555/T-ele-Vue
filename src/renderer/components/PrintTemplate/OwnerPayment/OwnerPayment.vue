<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <td>房源编号</td>
        <td>房主</td>
        <td>区域</td>
        <td>物业地址</td>
        <td>联系电话</td>
        <td>有效期</td>
        <td>付款日期</td>
        <td>银行名称</td>
        <td>银行卡号</td>
        <td>转款人</td>
        <td>未付金额</td>
        <td>支出金额</td>
        <td>应付金额</td>
        <td class="bz">备注</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData" :key="index">
        <td class="hx">{{ item.ContractNumber}}</td>
        <td class="hx">{{ item.OwnerName}}</td>
        <td class="hx">{{ item.CityName}}</td>
        <td class="hx">{{ item.HouseName}}</td>
        <td class="hx">{{ item.OwnerPhone}}</td>
        <td class="hx">{{ $dateFormat(item.BillStartDate, 'yyyy/MM/dd') }}--{{ $dateFormat(item.BillEndDate, 'yyyy/MM/dd') }}</td>
        <td class="hx">{{ $dateFormat(item.PayableDate, 'yyyy/MM/dd') }}--{{ $dateFormat(item.BillEndDate, 'yyyy/MM/dd') }}</td>
        <td class="hx">{{ item.BankName}}</td>
        <td class="hx">{{ item.BankAccount}}</td>
        <td  class="hx">{{ item.TransferPerson }}</td>
        <td  class="hx">{{ item.NoPaidMoney}}</td>
        <td  class="hx">{{ item.PaidMoney}}</td>
        <td  class="hx">{{ item.PayableMoney}}</td>
        <td  class="bz">{{ item.Remark}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'OwnerPayment',
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
