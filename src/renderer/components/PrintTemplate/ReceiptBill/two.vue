<template>
  <div class="receipt-box">
    <div class="receipt-title">
      <h5>收&nbsp;&nbsp;&nbsp;款&nbsp;&nbsp;&nbsp;凭&nbsp;&nbsp;&nbsp;条</h5>
    </div>
    <div class="receipt-company" style="margin-bottom: 10px;">
      <div class="company-item company-item1"><span>房源名称:</span><span>{{HouseName || '无'}}</span></div>
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
      <tr class="table-head" v-if="otherMoneyArr.length > 0" v-for="(item, index) in otherMoneyArr" :key="index">
        <td rowspan="1">{{item.ProjectName}}</td>
        <td v-for="(item,index) in item.PaidMoneyMark" :key="index" style="text-align: center">
          {{item}}
        </td>
      </tr>
      <tr class="table-head" v-for="(item, index) in addmoney" :key="index">
        <td rowspan="1">{{item.ProjectName}}</td>
        <td v-for="(item,index) in item.addmoney" :key="index" style="text-align: center">
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
  import { GetReceiptDetailsNew } from '@/api/tenantBill'
   import { ToCapChinese, priceFormat } from '../../../utils/priceFormat' // 数字转化成大写
  export default {
    name: 'two',
    props: {
      printData: '',
      money: '',
      FullID: ''
    },
    data() {
      return {
        newPrintData: {},
        newPaymentDasta: '',
        ArrNewPrintData: [],
        arrData: [],
        arr1: '',
        allTotal: 0, // 合计的价格
        allTotal1: '', // 合计的价格
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
        addmoney: [],
        otherMoneyArr: [],
        HouseName: ''
      }
    },
    methods: {
      GetInfo() {
        this.addmoney = []
        this.otherMoneyArr = []
        return GetReceiptDetailsNew({
          KeyID: this.printData
        }).then(({ Data, Msg, BusCode }) => {
          debugger
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
          console.log(this.ArrNewPrintData)
          for (let i = 0; i < this.ArrNewPrintData.length; i++) {
            if (this.ArrNewPrintData[i].InOrOut === 1) {
              if (this.ArrNewPrintData[i].ProjectName !== '租客租金') {
                this.otherMoneyArr.push(this.ArrNewPrintData[i])
              }
            } else if (this.ArrNewPrintData[i].InOrOut === 2) {
              console.log(this.ArrNewPrintData[i])
              this.otherMoneyArr.push(this.ArrNewPrintData[i])
            }
          }
          console.log(this.ArrNewPrintData)
          debugger
          var allmoneyZ = 0
          Data.Details.map(v => {
            if (v.ProjectName === '租客租金') {
              allmoneyZ = allmoneyZ + v.PaidMoney
            }
          })
          // this.money为0  没有服务费
          if (this.money === 0) {
            console.log(111)
          } else {
            // 如果代收房东款项大于租客租金  服务费为0
            // Data.Details[0].PaidMoney = 100
            if (Number(this.money) >= allmoneyZ) {
              this.calculateCost('0', allmoneyZ, 1)
            } else {
              var service = allmoneyZ - Number(this.money)
              var price = priceFormat(service)
              var getMoney = priceFormat(this.money)
              this.calculateCost(price, getMoney, 2)
            }
          }
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
        })
      },
      calculateCost(val, allmoney, type) {
        if (type === 1) {
          const arr = ['0']
          for (let i = 0; i < 10; i++) {
            if (arr.length < 10) {
              arr.unshift('')
            }
          }
          const obj = {
            ProjectName: '服务费',
            addmoney: arr
          }
          allmoney = allmoney + ''
          const getArr = this.getArrcom(allmoney)
          const obj1 = {
            ProjectName: '代收房东款项',
            addmoney: getArr
          }
          this.addmoney.push(obj1)
          this.addmoney.push(obj)
        } else if (type === 2) {
          const getArr = this.getArrcom(val + '')
          const getArrDai = this.getArrcom(allmoney + '')
          const obj = {
            ProjectName: '服务费',
            addmoney: getArr
          }
          const obj1 = {
            ProjectName: '代收房东款项',
            addmoney: getArrDai
          }
          this.addmoney.push(obj1)
          this.addmoney.push(obj)
        }
      },
      getArrcom(val) {
        const arr = val.split('')
          if (arr.indexOf('.') !== -1) {
            arr.splice(arr.indexOf('.'), 1)
          } else {
            arr.push('0')
            arr.push('0')
          }
        for (let i = 0; i < 10; i++) {
          if (arr.length < 10) {
            arr.unshift('')
          }
        }
        return arr
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
  .receipt-box{
    position: relative;
  }
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
          float: right;
          margin-right: 10px;
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
</style>
