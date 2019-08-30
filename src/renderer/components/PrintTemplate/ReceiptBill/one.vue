<template>
  <div>
    <div class="receipt-title">
      <h5>收&nbsp;&nbsp;&nbsp;款&nbsp;&nbsp;&nbsp;单</h5>
    </div>
    <div class="receipt-company">
      <div class="company-item company-item1"><span>收款单位:</span><span>{{newPrintData.CompanyName || '无'}}</span></div>
      <div class="company-item"><span>收款日期:</span><span style="text-align: right">{{$dateFormat(newPrintData.PaymentData) || '无'}}</span></div>
    </div>
    <table class="table-mark">
      <tr class="table-head">
        <td>收款金额:<span>{{newPrintData.PaymentMoney || '无'}}</span></td>
        <td>人民币(大写):<span> {{$ToCapChinese(newPrintData.PaymentMoney || '无')}}</span></td>
      </tr>
      <tr class="table-head">
        <!--<td>收款类型: {{$EnumData.getEnumDesByValue('ReceiptType', newPrintData.ReceiptType) || '无'}}</td>-->
        <!--<td>业务类型:{{$EnumData.getEnumDesByValue('FinanceBusType', newPrintData.BusinessType) || '无'}}</td>-->
        <td colspan="2">明细:{{newPrintData.ProjectName || '无'}}</td>
      </tr>
      <!--<tr class="table-head">-->
        <!--<td>优惠金额:{{newPrintData.Discount + '元'|| '无'}}</td>-->
        <!--<td>收款金额:{{newPrintData.ReceiptMoney || '无'}}</td>-->
      <!--</tr>-->
      <tr class="table-head">
        <td colspan="2">备注:<span>{{newPrintData.Remarks || '无'}}</span></td>
      </tr>
    </table>
    <div class="receipt-bottom">
      <div class="company-item"><span>经办人:</span><span>{{newPrintData.OutRoomName || '无'}}</span></div>
      <div class="company-item"><span>核销人:</span><span>{{newPrintData.VerificationName || '无'}}</span></div>
      <div class="company-item"><span>制单人:</span><span>{{newPrintData.CreaterName || '无'}}</span></div>
      <div class="text-item"><span>制单日期:</span><span>{{$dateFormat(newPrintData.CreaterTime) || '无'}}</span></div>
    </div>
  </div>
</template>

<script>
  // import { GetPrintID } from '@api/tenantBill'
   import { GetReceiptDetailsNew } from '@/api/tenantBill'

  export default {
    name: 'index',
    props: {
      printData: ''
    },
    data() {
      return {
        newPrintData: {}
      }
    },
    methods: {
      GetInfo() {
        return GetReceiptDetailsNew({
          KeyID: this.printData
        }).then(({ Data, Msg, BusCode }) => {
          this.newPrintData = Data
        })
      }
    },
      // 请求接口
      created() {
        if (this.printData) {
          this.GetInfo()
        }
      },
    watch: {
      printData() {
        this.GetInfo()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
