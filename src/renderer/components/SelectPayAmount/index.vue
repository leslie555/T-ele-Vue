<template>
  <el-dialog title="去收款" width="450px" :visible.sync="modalVisibility"
             append-to-body>
    <div class="pay-info">
      <div class="pay-item">
        <p class="bill-title">总金额：</p>
        <p class="bill-amount">¥{{amount}}</p>
      </div>
      <div class="pay-item">
        <p class="bill-title">总未收：</p>
        <p class="pay-amount">¥{{unPaidAmount}}</p>
      </div>
      <div class="pay-bottom">
        <el-form ref="form" class="pay-form" :model="form" status-icon :rules="rules" label-width="100px">
          <el-form-item prop="PayAmount" class="bill-title" label="本次支付">
            <el-input
              class="money_input"
              type="number"
              v-positive="form.PayAmount"
              :min="0"
              v-model="form.PayAmount"
              placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">去支付</el-button>
    </div>
    <pay-box ref="payBox" @updateBillAmount="updateBillAmount"></pay-box>
  </el-dialog>
</template>

<script>
  import PayBox from '../PayBox'
  export default {
    name: 'index',
    components: {
      PayBox
    },
    data() {
      const validatePayAmount = (rule, value, callback) => {
        const unPaidAmount = this.unPaidAmount - 0
        const payAmount = value - 0
        if (!payAmount) {
          callback(new Error('请输入支付金额'))
        } else if (unPaidAmount < payAmount) {
          callback(new Error('支付金额应小于总未付金额'))
        } else {
          callback()
        }
      }
      return {
        modalVisibility: false,
        amount: '',
        unPaidAmount: '',
        orderType: '',
        form: {
          BillId: '',
          PayAmount: ''
        },
        rules: {
          PayAmount: [
            { validator: validatePayAmount, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      open(orderType, id, amount, unPaidAmount) {
        this.loading = false
        this.form.BillId = id
        this.amount = amount
        this.unPaidAmount = unPaidAmount
        this.orderType = orderType
        this.form.PayAmount = unPaidAmount
        this.modalVisibility = true
      },

      close() {
        this.modalVisibility = false
      },

      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.payBox.open(this.orderType, this.form.BillId, this.amount, this.unPaidAmount, this.form.PayAmount)
          }
        })
      },
      updateBillAmount(billObj) {
        this.close()
        this.$emit('updateBill', billObj)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .pay-info {
    color: #666;
    font-size: 14px;
    padding-right: 40px;
    @include displayFlex(column,center,center);
    .pay-item {
      width: 220px;
      margin-bottom: 30px;
      @include displayFlex(row, flex-start, flex-start);
      .bill-title {
        width: 100px;
        text-align: end;
      }
      .bill-amount {
        /*margin-bottom: 40px;*/
      }
    }
    .pay-form {
      /*color: #666;*/
      /*font-size: 14px;*/
      /*margin-top: 40px;*/
      /*.bill-title {*/
        /*width: 100px;*/
        /*text-align: end;*/
      /*}*/
      .money_input {
        width: 120px;
      }
    }
  }
</style>
