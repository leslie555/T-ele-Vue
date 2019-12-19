<template>
  <el-dialog title="去收款" width="450px" :visible.sync="modalVisibility"
             append-to-body>
    <div class="pay-info">
      <p class="pay-amount">支付金额：¥{{amount}}</p>
      <div class="pay-mode">
        <el-radio v-model="payMode" label="1" @change="changePayMode">微信支付</el-radio>
        <el-radio v-model="payMode" label="2" @change="changePayMode">支付宝支付</el-radio>
      </div>
    </div>
    <div class="pay-img">
      <qrcode :value="payCodeUrl" :options="{ size: 200 }" v-if="payMode==2&&payCodeUrl"></qrcode>
      <img style="width: 200px;" :src="payCodeUrl" v-if="payMode==1&&payCodeUrl">
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="onSubmit">支付完成</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { GetPayCode, QueryPayStatus } from '../../api/pay'
  import Qrcode from '@xkeshi/vue-qrcode'
  import { priceFormat } from '../../utils/priceFormat'
  import { baseURL } from '../../config'

  export default {
    name: 'ToPay',
    components: {
      Qrcode
    },
    data() {
      return {
        modalVisibility: false,
        loading: false,
        formLabelWidth: '100px',
        totalAmount: '',
        totalUnpaid: '',
        amount: '',
        payMode: '1',
        payCodeUrl: '',
        billId: '',
        OrderId: '',
        orderType: ''
      }
    },
    methods: {
      // 传入参数orderType,KeyID,支付金额
      // orderType 0:待收账单 1：记账本，2：收款单
      open(orderType, id, totalAmount, unPaidAmount, amount) {
        this.payMode = '1'
        this.loading = false
        this.orderType = orderType
        this.billId = id
        this.totalAmount = totalAmount
        this.totalUnpaid = unPaidAmount
        this.amount = amount
        this.getPayCode()
        this.modalVisibility = true
      },
      close() {
        this.modalVisibility = false
      },

      getPayCode() {
        this.payCodeUrl = ''
        GetPayCode({
          orderType: this.orderType,
          bookID: this.billId,
          partAmount: this.amount,
          // W1微信,A1支付宝
          payChannelType: this.payMode === '1' ? 'W1' : 'A1'
        }).then(res => {
            if (res.Data) {
              let url = res.Data.QrcodeUrl.replace('http://testservers', 'https://testservers')
              url = url.replace('http://servers', 'https://servers')
              url = url.replace('http://127.0.0.1:1920', baseURL)
              url = url.replace('http://127.0.0.1:1921', baseURL)
              this.payCodeUrl = url
              this.OrderId = res.Data.OrderId
            }
          }
        ).catch(() => {
          // debugger
          // this.$message.error('网络错误，请稍候再试')
          this.close()
        })
      },

      queryPayStatus() {
        QueryPayStatus({
          OrderId: this.OrderId
        }).then(res => {
            if (res) {
              const BusCode = res.BusCode
              // BusCode =1 支付确认中
              // BusCode=0 支付成功
              // BusCode=2 支付失败
              if (BusCode === 1) {
                this.$message.warning('支付确认中，请稍候')
                this.loading = false
              }
              if (BusCode === 0) {
                // 删除该待收账单数据
                this.$message.success('支付成功！')
                this.payMode = '1'
                const totalAmount = this.totalAmount - 0
                const totalUnpaid = this.totalUnpaid - 0
                const payAmount = this.amount - 0
                const billObj = {
                  billId: this.billId,
                  payAmount: this.amount,
                  unPaidAmount: priceFormat(totalUnpaid - payAmount), // 未付金额 = 总未付金额-已付金额
                  totalPaidMoney: priceFormat(totalAmount - totalUnpaid + payAmount) // 总已付金额=总金额-总未付+本次支付
                }
                this.$emit('updateBillAmount', billObj)
                this.close()
              }
              if (BusCode === 2) {
                this.loading = false
                this.$confirm('支付出错，确认重新生成二维码支付？', '提示').then(() => {
                  this.getPayCode()
                })
              }
            }
          }
        ).catch(() => {
          // this.$message.error('网络错误，请稍候再试')
        })
      },

      changePayMode() {
        this.getPayCode()
      },

      onSubmit() {
        this.loading = true
        this.queryPayStatus()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .pay-info {
    color: #666;
    font-size: 16px;
    margin-bottom: 50px;
    .pay-amount {
      @include displayFlex(row, center, center)
    }
    .pay-mode {
      @include displayFlex(row, center, center)
    }
    .pay-amount {
      margin-bottom: 40px;
    }
  }

  .pay-img {
    @include displayFlex(row, center, center);
    margin-bottom: 40px;
    height: 200px;
  }
</style>
