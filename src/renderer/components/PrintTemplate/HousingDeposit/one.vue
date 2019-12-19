<template>
  <div class="receipt-box">
    <div class="receipt-title">
      <h5>房屋押金收据凭条</h5>
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
        <td><span>第{{newPrintData.KeyID}}号</span></td>
      </tr>
      <tr class="table-head">
        <td colspan="11"><span>付款人:{{newPrintData.OutRoomName || '无'}}</span></td>
      </tr>
      <tr class="table-head">
        <td rowspan="1" width="35%">房屋地址:<span>{{HouseInfo.CityName}}</span></td>
        <td colspan="3" width="20%" class="table-head-Pos"><span>{{HouseInfo.CommunityName}}</span><span class="table-head-text">小区</span></td>
        <td colspan="3" width="15%" class="table-head-Pos"><span>{{HouseInfo.Building}}</span><span class="table-head-text">栋</span></td>
        <td colspan="3" width="15%" class="table-head-Pos"><span>{{HouseInfo.UnitNumber}}</span><span class="table-head-text">单元</span></td>
        <td colspan="2" width="20%" class="table-head-Pos"><span>{{HouseInfo.RoomNumber}}</span><span class="table-head-text">号</span></td>
      </tr>
      <tr class="table-head">
        <td rowspan="1">人民币(大写)</td>
        <td colspan="10" class="table-head-Pos"><span>￥{{ArrAllMoney}}</span><span class="table-head-text"></span></td>
      </tr>
      <tr class="table-head">
        <td rowspan="1">截止日期</td>
        <td colspan="3" class="table-head-Pos"><span>{{arrData[0]}}</span><span class="table-head-text">年</span></td>
        <td colspan="3" class="table-head-Pos"><span>{{arrData[1]}}</span><span class="table-head-text">月</span></td>
        <td colspan="3" class="table-head-Pos"><span>{{arr1}}</span><span class="table-head-text">日</span></td>
        <td colspan="3" class="table-head-Pos"><span>共计: 月</span></td>
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
  import { ToCapChinese } from '../../../utils/priceFormat' // 数字转化成大写
  export default {
    name: 'one',
    props: {
      printData: '',
      FullID: ''
    },
    data() {
      return {
        newPrintData: {},
        newPaymentData: '',
        arrData: [],
        arr1: '',
        AllMoney: '',
        ArrAllMoney: [],
        HouseInfo: {},
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
        HouseName: ''
      }
    },
    methods: {
      GetInfo() {
        return GetReceiptDetailsNew({
          KeyID: this.printData
        }).then(({ Data, Msg, BusCode }) => {
          this.newPrintData = Data
          this.newPaymentData = Data.PaymentData
          this.HouseInfo = Data.HouseInfo
          this.arrData = this.newPaymentData.split('-')
          this.arr1 = this.arrData[2].substr(0, 2)
          // this.AllMoney = Data.ReceiptMoney
          this.AllMoney = Data.PaymentMoney
          this.ArrAllMoney = ToCapChinese(this.AllMoney)
          console.log(this.ArrAllMoney)
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
