<template>
  <el-dialog
    title="打印预览"
    @open="handleOpen"
    @closed="handleClosed"
    :visible.sync="dialogVisible"
    class="order-template-dialog"
    append-to-body
    width="960px"
    v-loading="printOpenLoading"
  >
    <div class="PrintBox">
      <div :id="uuid">
        <div class="order-template-container">
          <h1 class="order-template-title">定金收条</h1>
          <div class="order-template-content-container">
            <p>
              今收到
              <span>{{printData.OrderName}}</span>租
              <span>{{printData.HouseName}}</span>租房定金人民币￥
              <span>{{printData.OrderMoney}}</span>元（大写
              <span>{{nzhcn.toMoney(printData.OrderMoney||'')}}</span>)。租房人已现场察看该房屋，确认合适，并同意以下租房条件签约：
            </p>
            <p>
              1. 房屋租金每月￥
              <span>{{printData.ConvertionMoney}}</span>元（不含税），押 1 付
              <span>{{printData.PayModel}}</span>，先付后租，提前
              <span>{{printData.AdvanceMonth}}</span>月交付下次房租，所有租金及押金在合同签订当即付清。若房租月付，
              <span>{{printData.OrderName}}</span>同意提供身份证、银行卡办理第三方平台支付。
              <span style="display:inline-block;width:65px;">
                <img
                  style="vertical-align: baseline;"
                  v-if="rentPeopleImgPath"
                  height="60px"
                  :src="$ImgUnit.getImgUrl(rentPeopleImgPath)"
                />
              </span>（签字）
            </p>
            <p>
              2. 租期
              <span>{{deltaRentDate}}</span>个月，自
              <span>{{new Date(printData.LeaseStartTime).getFullYear()}}</span>年
              <span>{{new Date(printData.LeaseStartTime).getMonth()+1}}</span>月
              <span>{{new Date(printData.LeaseStartTime).getDate()}}</span>日 起计租金。
            </p>
            <p>
              3. 约定
              <span>{{new Date(printData.LastSignDate).getFullYear()}}</span>年
              <span>{{new Date(printData.LastSignDate).getMonth()+1}}</span>月
              <span>{{new Date(printData.LastSignDate).getDate()}}</span>日前租房人带本人有效证件签约付清，若未按约定日期签约付款 则视为放弃，定金不作退回。
            </p>
             <p>4. 合同签署后缴纳￥ <span>{{printData.ServiceFee}}</span> 作为服务费。</p>
          </div>
          <p style="text-align:center;margin-top: 120px">本收据一式两份，双方各执一份，具有同等法律效力。</p>
          <div class="order-template-sign">
            <div class="order-template-sign-row">
              租房人签字：
              <div class="order-template-sign-img">
                <img
                  style="vertical-align: middle;"
                  v-if="rentPeopleImgPath"
                  height="60px"
                  :src="$ImgUnit.getImgUrl(rentPeopleImgPath)"
                />
              </div>
              电话：{{printData.OrderPhone}}
            </div>
          </div>
          <div class="order-template-sign">
            <div class="order-template-sign-row">
              收款人签字：
              <div class="order-template-sign-img">
                <img
                  style="vertical-align: middle;"
                  v-if="recievePeopleImgPath"
                  height="60px"
                  :src="$ImgUnit.getImgUrl(recievePeopleImgPath)"
                />
              </div>
              电话：{{printData.MangerPhone}}
            </div>
          </div>
          <div class="order-template-sign">
            <div
              class="order-template-sign-row"
            >身&nbsp;&nbsp;&nbsp;&nbsp;份&nbsp;&nbsp;&nbsp;证：{{printData.OrderCardID||''}}</div>
          </div>
          <div class="order-template-sign">
            <div class="order-template-sign-row" style="width:400px;">
              日期：
              <span>{{now.getFullYear()}}</span>年
              <span>{{now.getMonth()+1}}</span>月
              <span>{{now.getDate()}}</span>日
            </div>
          </div>
          <img class="getImg" :src="sealUrl" alt />
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handlePrint" :loading="printLoading">打印</el-button>
      <el-button type="primary" @click="handleDownload" :loading="downloadLoading">下载PDF</el-button>
      <el-button type="primary" @click="handleSign(2)">租房人签字</el-button>
      <el-button type="primary" @click="handleSign(1)">收款人签字</el-button>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="showQRCodeDialog"
      width="400px"
      append-to-body
      class="order-sign-dialog"
      @open="handleOpenQRCode"
      center
    >
      <div class="sign-box">
        <div class="scan-box">
          <qrcode :value="baseURI" :options="{ size: 200 }"></qrcode>
        </div>
        <div class="sign-text">请扫描二维码签字</div>
        <!-- <div class="sign-notice">
          <p>注：</p>
          <p>请扫描二维码预览合同并进行线上签约认证。</p>
        </div>-->
      </div>
      <div slot="footer">
        <el-button type="primary" @click="showQRCodeDialog=false">返回</el-button>
      </div>
    </el-dialog>
    <a :href="downloadUrl" target="_blank" style="display: none;" download :id="downloadID"></a>
  </el-dialog>
</template>

<script>
  /* eslint-disable no-undef */
  import uuid from '@/utils/uuid'
  import Qrcode from '@xkeshi/vue-qrcode'
  import { getImageListByCode, HtmlToPDF } from '@/api/system'
  import { UpdateOrderInfo } from '@/api/tenant'
  import { phoneURL, gwUrl, baseURL } from '@/config'
  import nzhcn from 'nzh/cn'

  export default {
    components: {
      Qrcode
    },
    props: {
      printOpenLoading: Boolean
    },
    data() {
      return {
        nzhcn,
        imgObj: {
          '500100': require('@/assets/CommonSeal/500100.png'),
          '500105': require('@/assets/CommonSeal/500105.png'),
          '500106': require('@/assets/CommonSeal/500106.png'),
          '500108': require('@/assets/CommonSeal/500108.png'),
          '500112': require('@/assets/CommonSeal/500112.png'),
          '510100': require('@/assets/CommonSeal/510100.png'),
          '510104': require('@/assets/CommonSeal/510104.png'),
          '510105': require('@/assets/CommonSeal/510105.png'),
          '510106': require('@/assets/CommonSeal/510106.png'),
          '510107': require('@/assets/CommonSeal/510107.png'),
          '510108': require('@/assets/CommonSeal/510108.png')
        },
        uuid: 'printBody_' + uuid(),
        now: new Date(),
        dialogVisible: false,
        printLoading: false,
        printData: {},
        baseURI: '',
        signType: 1, // 1 收款人 2 租房人
        showQRCodeDialog: false,
        recievePeopleUUID: 0,
        rentPeopleUUID: 0,
        recievePeopleImgPath: '',
        rentPeopleImgPath: '',
        interval: null, // 轮训循环器
        sealUrl: '',
        downloadUrl: '',
        downloadLoading: false,
        downloadID: ''
      }
    },
    destroyed() {
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
    computed: {
      title() {
        return this.signType === 1 ? '收款人签字' : '租房人签字'
      },
      deltaRentDate() {
        const start = new Date(this.printData.LeaseStartTime)
        const end = new Date(this.printData.LeaseEndTime)
        return (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth()
      }
    },
    methods: {
      close() {
        this.dialogVisible = false
      },
      open(data) {
        this.dialogVisible = true
        this.printData = data
        this.downloadID = 'downloadOrder_' + uuid()
      },
      handleOpen() {
        this.recievePeopleImgPath = this.printData.ManagerSignInfo || ''
        this.rentPeopleImgPath = this.printData.OrderSignInfo || ''
        this.interval = setInterval(() => {
          getImageListByCode([this.recievePeopleUUID, this.rentPeopleUUID]).then(({ Data }) => {
            if (Data && Data.length) {
              const recievePeopleImgPath = Data.find(v => v.UniqueCode === this.recievePeopleUUID)
              const rentPeopleImgPath = Data.find(v => v.UniqueCode === this.rentPeopleUUID)
              if ((recievePeopleImgPath && recievePeopleImgPath.ImageLocation !== this.recievePeopleImgPath) || (recievePeopleImgPath && this.recievePeopleImgPath === '')) {
                this.recievePeopleImgPath = recievePeopleImgPath.ImageLocation
                this.printData.ManagerSignInfo = recievePeopleImgPath.ImageLocation
                UpdateOrderInfo(this.printData)
                this.showQRCodeDialog = false
              }
              if ((rentPeopleImgPath && rentPeopleImgPath.ImageLocation !== this.rentPeopleImgPath) || (rentPeopleImgPath && this.rentPeopleImgPath === '')) {
                this.rentPeopleImgPath = rentPeopleImgPath.ImageLocation
                this.printData.OrderSignInfo = rentPeopleImgPath.ImageLocation
                UpdateOrderInfo(this.printData)
                this.showQRCodeDialog = false
              }
              /* if (recievePeopleImgPath && rentPeopleImgPath) {
                clearInterval(this.interval)
              } */
            }
          })
        }, 5000)

        // 判断显示什么公司的章
        let CityCode = this.printData.CityCode
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
      },
      handleClosed() {
        if (this.interval) {
          clearInterval(this.interval)
        }
      },
      handleOpenQRCode() {
        if (this.signType === 1) {
          this.recievePeopleUUID = uuid()
        } else {
          this.rentPeopleUUID = uuid()
        }
        const param = {}
        param.to = this.$store.getters.token
        param.code = this.signType === 1 ? this.recievePeopleUUID : this.rentPeopleUUID
        param.ti = new Date().getTime()
        param.os = true // onlysign 只是签字,不进行合同的操作
        const objToUrl = Object.entries(param).map(item => {
          const [k, v] = item
          return `${k}=${v}`
        }).join('&')
        this.baseURI = phoneURL + 'sign?' + objToUrl
        console.log(this.baseURI)
      },
      handlePrint() {
        this.printLoading = true
        printJS({
          printable: this.uuid, // 要打印区域的元素ID
          type: 'html',
          // 继承原来的所有样式
          targetStyles: ['*'],
          onLoadingStart: () => {
            console.log(3)
          },
          onLoadingEnd: () => {
            console.log(4)
          },
          onPrintDialogClose: () => {
            console.log(5)
            this.printLoading = false
            this.close()
          }
        })
      },
      handleSign(type) {
        // 1 收款人 2 租房人
        this.signType = type
        this.showQRCodeDialog = true
      },
      handleDownload() {
        this.downloadLoading = true
        HtmlToPDF({
          Url: encodeURIComponent(`${gwUrl}/external/OrderTemplate?KeyID=${this.printData.KeyID}&to=${this.$store.getters.token}`)
        }).then(({ Data }) => {
          this.downloadLoading = false
          this.downloadUrl = baseURL + Data
          debugger
          this.$nextTick(() => {
            document.getElementById(this.downloadID).click()
          })
        }).catch(() => {
          this.downloadLoading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/variables";
  @import "../../../../styles/mixin";
  .PrintBox {
    height: 420px;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    overflow: auto;
  }
  #printBody {
    height: auto;
    width: auto;
    overflow: visible;
  }
  .order-sign-dialog {
    .sign-box {
      @include displayFlex(column, center, flex-start);
      width: 100%;
      .scan-box {
        padding: 5px;
        background: #f9f9f9;
        border: 1px solid #eee;
        border-radius: 5px;
      }
      .img-box {
        @include displayFlex(row, center, center);
        width: 500px;
        height: 220px;
        background: #f9f9f9;
        border: 1px solid #eee;
        border-radius: 5px;
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
      .sign-text {
        margin-top: 15px;
        font-size: 16px;
        color: $--color-text-primary;
      }
      .sign-notice {
        @include displayFlex(row, flex-start, center);
        margin-top: 30px;
        font-size: 14px;
        color: $--color-text-secondary;
        width: 430px;
        line-height: 20px;
        p:first-child {
          margin-right: 5px;
        }
      }
    }
  }
  .order-template-container {
    position: relative;
    color: #444;
    padding: 0 30px;
    line-height: 34px;
    & span {
      width: auto;
      line-height: 14px;
      position: relative;
      display: inline-block;
      border-bottom: 1px solid #333;
      padding: 4px 10px;
    }
    .order-template-content-container {
      padding: 0 60px;
    }
    .order-template-title {
      margin: 50px 0;
      text-align: center;
    }
    .order-template-sign {
      text-align: right;
      .order-template-sign-row {
        display: inline-block;
        width: 320px;
        text-align: left;
      }
      .order-template-sign-img {
        display: inline-block;
        width: 95px;
      }
    }
    .getImg {
      position: absolute;
      bottom: 69px;
      right: 64px;
      height: 110px;
      opacity: 0.9;
    }
  }
</style>
