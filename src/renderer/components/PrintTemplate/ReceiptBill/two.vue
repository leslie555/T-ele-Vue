<template>
  <div>
    <div class="receipt-title">
      <h5>收&nbsp;&nbsp;&nbsp;款&nbsp;&nbsp;&nbsp;凭&nbsp;&nbsp;&nbsp;条</h5>
    </div>
    <table class="table-mark">
      <tr class="table-head">
        <td>日期</td>
        <td colspan="3" class="table-head-Pos"><span>{{arrData[0]}}</span><span class="table-head-text">年</span></td>
        <td colspan="3" class="table-head-Pos"><span>{{arrData[1]}}</span><span class="table-head-text">月</span></td>
        <td colspan="3" class="table-head-Pos"><span>{{arr1}}</span><span class="table-head-text">日</span></td>
        <td><span>第5号</span></td>
      </tr>
      <tr class="table-head1">
        <td rowspan="2" width="250px">摘要</td><td colspan="10" height="25px">金额</td>
      </tr>
      <tr class="table-head1" >
        <td>千</td>
        <td>百</td>
        <td>十</td>
        <td>万</td>
        <td>千</td>
        <td>百</td>
        <td>十</td>
        <td>元</td>
        <td>角</td>
        <td>分</td>
      </tr>
      <tr class="table-head" v-if="ArrNewPrintData.length > 0" v-for="(item, index) in ArrNewPrintData" :key="index">
        <td rowspan="1">{{item.ProjectName}}</td>
        <td v-for="(item,index) in item.PaidMoneyMark" :key="index" style="text-align: center">
          {{item}}
        </td>
      </tr>
      <tr class="table-head">
        <td rowspan="1"><span>合&nbsp;&nbsp;&nbsp;计</span></td>
        <td colspan="10">{{allTotal1}}</td>
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
  import { GetReceiptDetailsNew } from '@/api/tenantBill'
   import { ToCapChinese } from '../../../utils/priceFormat' // 数字转化成大写
  export default {
    name: 'two',
    props: {
      printData: ''
    },
    data() {
      return {
        newPrintData: {},
        newPaymentDasta: '',
        ArrNewPrintData: [],
        arrData: [],
        arr1: '',
        allTotal: 0, // 合计的价格
        allTotal1: '' // 合计的价格
      }
    },
    methods: {
      GetInfo() {
        return GetReceiptDetailsNew({
          KeyID: this.printData
        }).then(({ Data, Msg, BusCode }) => {
          this.newPrintData = Data
          this.ArrNewPrintData = Data.Details
          this.allTotal = 0
          this.ArrNewPrintData.forEach(item => {
            this.allTotal += item.PaidMoney
          })
          this.allTotal1 = ToCapChinese(this.allTotal)
          this.newPaymentData = Data.PaymentData
          this.arrData = this.newPaymentData.split('-')
          this.arr1 = this.arrData[2].substr(0, 2)
          this.ArrNewPrintData.map(v => {
            v.PaidMoneyMark = Math.floor(v.PaidMoney * 100) + ''
            v.PaidMoneyMark = v.PaidMoneyMark.split('')
            debugger
            for (let i = 0; i < 10; i++) {
              if (v.PaidMoneyMark.length < 10) {
                v.PaidMoneyMark.unshift('')
              }
            }
          })
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
  .receipt-title {
    display: flex;
    width: 100%;
    /*height: 20px;*/
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
    padding-top: 30px;
  }
  h5{
    font-size: 24px;
    color: #444444;
    font-family: 'SimHei';
  }
  .table-mark {
    border-collapse: collapse;
    width: 100%;
    .table-head {
      height: 30px;
      color: #444444;
      td {
        border: 1px solid #999999;
        padding-left: 10px;
        font-size: 14px;
      }
      .table-head-Pos {
        position: relative;
        .table-head-text {
          position: absolute;
          right: 10px;
        }
      }
    }
    .table-head1 {
      height: 35px;
      color: #444444;
      td {
        border: 1px solid #999999;
        padding-left: 10px;
        font-size: 14px;
        text-align:center;
        vertical-align:middle
      }
    }
  }
  .receipt-bottom {
    margin-top: 30px;
    margin-bottom:50px;
    .company-item {
      display: inline-block;
      margin-right:55px;
      width: 120px;
    }
    .text-item{
      display: inline-block;
      margin-left: 30px;
    }
  }

</style>
