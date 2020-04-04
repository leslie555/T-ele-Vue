<template>
  <div class="receipt-box">
    <div class="receipt-title">
      <h5>收&nbsp;&nbsp;&nbsp;款&nbsp;&nbsp;&nbsp;单</h5>
    </div>
    <div class="receipt-company" style="margin-bottom:22px;">
      <div>
        <div class="company-item"><span>收款单位:</span><span>{{newPrintData.CompanyName || '无'}}</span></div>
        <div class="company-item" style="float: right;"><span>租客名称:</span><span style="text-align: right">{{newPrintData.Abstract || ''}}</span></div>
      </div>
      <div style="margin-top: 10px;">
        <div class="company-item"><span>房源名称:</span><span>{{HouseName || '无'}}</span></div>
        <div class="company-item" style="float: right;"><span>收款日期:</span><span style="text-align: right">{{$dateFormat(newPrintData.PaymentData) || '无'}}</span></div>
      </div>
    </div>
    <!-- <table class="table-mark">
      <tr class="table-head">
        <td>收款金额:<span>{{newPrintData.PaymentMoney || '无'}}</span></td>
        <td>人民币(大写):<span> {{$ToCapChinese(newPrintData.PaymentMoney || '无')}}</span></td>
      </tr>
      <tr class="table-head">
        <td colspan="2">明细:{{newPrintData.ProjectName || '无'}}</td>
      </tr>
      <tr class="table-head">
        <td colspan="2">备注:<span>{{newPrintData.Remarks || '无'}}</span></td>
      </tr>
    </table> -->
    <table class="table-mark">
      <!-- <tr class="table-head">
        <td>日期</td>
        <td colspan="3" class="table-head-Pos"><span>{{arrData[0]}}</span><span class="table-head-text">年</span></td>
        <td colspan="3" class="table-head-Pos"><span>{{arrData[1]}}</span><span class="table-head-text">月</span></td>
        <td colspan="3" class="table-head-Pos"><span>{{arr1}}</span><span class="table-head-text">日</span></td>
        <td><span>第5号</span></td>
      </tr> -->
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
        <td rowspan="1"><span>合&nbsp;&nbsp;&nbsp;计：{{this.allTotal || 0}}</span></td>
        <td colspan="10">{{allTotal1}}</td>
      </tr>
    </table>
    <div class="receipt-bottom">
      <div class="company-item"><span>经办人:</span><span>{{newPrintData.OutRoomName || '无'}}</span></div>
      <div class="company-item"><span>核销人:</span><span>{{newPrintData.VerificationName || '无'}}</span></div>
      <div class="company-item"><span>制单人:</span><span>{{newPrintData.CreaterName || '无'}}</span></div>
      <div class="text-item"><span>制单日期:</span><span>{{$dateFormat(newPrintData.CreaterTime) || '无'}}</span></div>
    </div>
          <img class="getImg" :src="sealUrl" alt="">
  </div>
</template>

<script>
  // import { GetPrintID } from '@api/tenantBill'
   import { GetReceiptDetailsNew } from '@/api/tenantBill'
   import { getMenuDataByCityCode } from '../../../utils/CityData'
  import { ToCapChinese } from '../../../utils/priceFormat' // 数字转化成大写
  export default {
    name: 'index',
    props: {
      printData: '',
      FullID: ''
    },
    data() {
      return {
        newPrintData: {},
        imgObj: {
          '500100': require('../../../assets/CommonSeal/500100.png'),
          '500105': require('../../../assets/CommonSeal/500105.png'),
          '500106': require('../../../assets/CommonSeal/500106.png'),
          '500108': require('../../../assets/CommonSeal/500108.png'),
          '500112': require('../../../assets/CommonSeal/500112.png'),
          '510100': require('../../../assets/CommonSeal/510100.png'),
          '510104': require('../../../assets/CommonSeal/510104.png'),
          '510105': require('../../../assets/CommonSeal/510105.png'),
          '510106': require('../../../assets/CommonSeal/510106.png'),
          '510107': require('../../../assets/CommonSeal/510107.png'),
          '510108': require('../../../assets/CommonSeal/510108.png')
        },
        sealUrl: '',
        HouseName: '',
        ArrNewPrintData: []
      }
    },
    methods: {
      GetInfo() {
        this.ArrNewPrintData = []
        return GetReceiptDetailsNew({
          KeyID: this.printData
        }).then(({ Data, Msg, BusCode }) => {
          // if (Data.ProjectName.indexOf(',') !== -1) {
          //   var num = 0
          //   var arr = []
          //   var ArrName = Data.ProjectName.split(',')
          //   ArrName.map(v => {
          //     if (v === '租客租金') {
          //       num++
          //     } else {
          //       arr.push(v)
          //     }
          //   })
          //   if (num > 0) {
          //     arr.push('服务费')
          //     arr.push('代收房东款项')
          //   }
          //   var proName = ''
          //   for (let i = 0; i < arr.length; i++) {
          //     proName = proName + arr[i] + ','
          //   }
          //   Data.ProjectName = proName
          // } else {
          //   if (Data.ProjectName.indexOf('租客租金') !== -1) {
          //     Data.ProjectName = '服务费,代收房东款项'
          //   }
          // }
          // 房源名称
          this.HouseName = Data.HouseInfo.HouseName
          // 判断显示什么公司的章
          let CityCode = Data.HouseInfo.CityCode
          if (CityCode.slice(0, 2) === '50') {
            if (!this.imgObj[CityCode]) {
              CityCode = '500100'
            }
          } else if (CityCode.slice(0, 2) === '51') {
            if (!this.imgObj[CityCode]) {
              CityCode = '510100'
            }
          }
          this.sealUrl = this.imgObj[CityCode]
          Data.CompanyName = getMenuDataByCityCode(CityCode).company
          this.newPrintData = Data

          this.ArrNewPrintData = Data.Details
          this.allTotal = 0
          this.ArrNewPrintData.forEach(item => {
            if (item.InOrOut === 2) {
              this.allTotal -= item.PaidMoney
            } else {
              this.allTotal += item.PaidMoney
            }
          })
          this.allTotal1 = ToCapChinese(this.allTotal)
          this.newPaymentData = Data.PaymentData
          this.arrData = this.newPaymentData.split('-')
          this.arr1 = this.arrData[2].substr(0, 2)
          this.ArrNewPrintData.map(v => {
            if (v.InOrOut === 2) {
              v.PaidMoneyMark = Math.floor(v.PaidMoney * 100) + ''
              v.PaidMoneyMark = v.PaidMoneyMark.split('')
              v.PaidMoneyMark.unshift('—')
              for (let i = 0; i < 10; i++) {
                if (v.PaidMoneyMark.length < 10) {
                  v.PaidMoneyMark.unshift('')
                }
              }
            } else if (v.InOrOut === 1) {
              v.PaidMoneyMark = Math.floor(v.PaidMoney * 100) + ''
              v.PaidMoneyMark = v.PaidMoneyMark.split('')
              for (let i = 0; i < 10; i++) {
                if (v.PaidMoneyMark.length < 10) {
                  v.PaidMoneyMark.unshift('')
                }
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
  @import "style";
  .getImg{
    position: absolute;
    bottom: 10px;
    right: 65px;
    height: 110px;
    opacity: .9;
  }
  .table-mark{
    position: relative;
  }
    .receipt-box{
    position: relative;
  }
</style>
