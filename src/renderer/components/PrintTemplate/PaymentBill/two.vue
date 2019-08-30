<template>
  <div>
    <div class="receipt-title">
      <h5>付&nbsp;&nbsp;&nbsp;款&nbsp;&nbsp;&nbsp;凭&nbsp;&nbsp;&nbsp;条</h5>
    </div>
    <table class="table-mark">
      <tr class="table-head">
        <td>日期</td>
        <td colspan="3" class="table-head-Pos"><span>{{arrData[0]}}</span><span class="table-head-text">年</span></td>
        <td colspan="3" class="table-head-Pos"><span>{{arrData[1]}}</span><span class="table-head-text">月</span></td>
        <td colspan="3" class="table-head-Pos"><span>{{arr1}}</span><span class="table-head-text">日</span></td>
        <td><span>第{{newPrintData.KeyID}}号</span></td>
      </tr>
      <tr class="table-head1">
        <td rowspan="2" width="250px">摘要</td>
        <td colspan="10" height="25px">金额</td>
      </tr>
      <tr class="table-head1">
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
      <tr class="table-head" v-if="ArrNewPrintData.length > 0"  v-for="(item, index) in ArrNewPrintData" :key="index">
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
    <div class="payment-bottom">
      <span style="margin-left:400px">审核人:{{newPrintData.AuditorName || '无'}}</span>
      <span>经手人:{{newPrintData.CurrentName || '无'}}</span>
    </div>
  </div>
</template>

<script>
  import { GetPaymentTable } from '@/api/ownerBill'
    import { ToCapChinese } from '../../../utils/priceFormat' // 数字转化成大写
  export default {
    name: 'two',
    props: {
      PrintData: ''
    },
    data() {
      return {
        newPrintData: {},
        ArrNewPrintData: [], // 循环的项目
        newPaymentData: '',
        arrData: [],
        arr1: '',
        allTotal: 0, // 合计的价格
        allTotal1: '' // 合计的价格
      }
    },
    methods: {
      GetInfo() {
        return GetPaymentTable({
          paymentID: this.PrintData
        }).then(({ Data, Msg, BusCode }) => {
          this.newPrintData = Data
          debugger
          this.ArrNewPrintData = Data.PaymentDetail
          console.log(this.ArrNewPrintData)
          this.allTotal = 0
          this.ArrNewPrintData.forEach(item => {
            this.allTotal += item.PaidMoney
          })
          this.allTotal1 = ToCapChinese(this.allTotal)
          console.log(this.allTotal)
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
    created() {
      if (this.PrintData) {
        this.GetInfo()
      }
    },
    watch: {
      PrintData() {
        this.GetInfo()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .receipt-title {
    display: flex;
    width: 100%;
    height: 20px;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  }

  h5 {
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
        text-align: center;
        vertical-align: middle
      }
    }
  }

  .payment-bottom {
    height: 30px;
    span {
      display: inline-block;
      width: 150px;
      padding-top: 10px;
    }
  }

</style>
