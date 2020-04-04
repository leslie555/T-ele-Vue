<template>
  <el-dialog
    :visible.sync="BookingVisible"
    @close="CloseBooking"
    title="预定"
    width="740px"
    center
    append-to-body
  >
    <el-form
      :inline="true"
      label-width="120px"
      status-icon
      :model="BookingForm"
      :rules="rules"
      ref="BookingHouseForm"
    >
      <div class="dialog-box form-item-sm">
        <div class="clearfix">
          <el-form-item label="房源名称:">
            <span style="display: inline-block; width: 200px;">{{ BookingForm.HouseName }}</span>
          </el-form-item>
          <el-form-item label="预定人姓名" prop="OrderName">
            <el-input v-model="BookingForm.OrderName" :maxlength="14"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="预定人电话" prop="OrderPhone">
            <el-input v-model="BookingForm.OrderPhone" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="预定人身份证" prop="OrderCardID">
            <el-input v-model="BookingForm.OrderCardID" :maxlength="18"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="预定金额" prop="OrderMoney">
            <el-input
              v-model="BookingForm.OrderMoney"
              type="number"
              @blur="$positive(BookingForm,'OrderMoney',1,false,undefined)"
              min="1"
            ></el-input>
          </el-form-item>
          <el-form-item label="约定租金" prop="ConvertionMoney">
            <el-input
              v-model="BookingForm.ConvertionMoney"
              type="number"
              @blur="$positive(BookingForm,'ConvertionMoney',1,false,undefined)"
              min="1"
            ></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="付款方式" prop="PayModel">
            <span>押 1 付</span>
            <el-select
              class="add-order-paymodel-select"
              v-model="BookingForm.PayModel"
              placeholder="请选择"
            >
              <el-option :label="1" :value="1"></el-option>
              <el-option :label="2" :value="2"></el-option>
              <el-option :label="3" :value="3"></el-option>
              <el-option :label="4" :value="4"></el-option>
              <el-option :label="5" :value="5"></el-option>
              <el-option :label="6" :value="6"></el-option>
              <el-option :label="7" :value="7"></el-option>
              <el-option :label="8" :value="8"></el-option>
              <el-option :label="9" :value="9"></el-option>
              <el-option :label="10" :value="10"></el-option>
              <el-option :label="11" :value="11"></el-option>
              <el-option :label="12" :value="12"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务费" prop="ServiceFee">
            <el-input
              v-model="BookingForm.ServiceFee"
              type="number"
              @blur="$positive(BookingForm,'ServiceFee',0,false,undefined)"
              min="0"
            ></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="最晚签约日" prop="LastSignDate">
            <el-date-picker
              type="date"
              :picker-options="pickerOptions"
              placeholder="选择日期"
              v-model="BookingForm.LastSignDate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="最晚付款日" prop="PayModel">
            <span>提前</span>
            <el-select
              class="add-order-advanceMonth-select"
              v-model="BookingForm.AdvanceMonth"
              placeholder="请选择"
            >
              <el-option :label="0" :value="0"></el-option>
              <el-option :label="1" :value="1"></el-option>
              <el-option :label="2" :value="2"></el-option>
              <el-option :label="3" :value="3"></el-option>
            </el-select>
            <span>月</span>
          </el-form-item>
        </div>
        <div class="clearfix form-item-md">
          <el-form-item label="约定租期" prop="LeaseStartTime" style="margin-right: 0">
            <el-date-picker
              type="date"
              placeholder="开始时间"
              v-model="BookingForm.LeaseStartTime"
              style="width: 200px;"
            ></el-date-picker>
            <span>--</span>
          </el-form-item>
          <el-form-item prop="LeaseEndTime">
            <el-date-picker
              type="date"
              placeholder="结束时间"
              v-model="BookingForm.LeaseEndTime"
              style="width: 200px;"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="clearfix form-item-md">
          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="BookingForm.Remark"
              style="width: 420px;"
              :rows="4"
              :maxlength="140"
            ></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item style="text-align: center; width: 100%;">
            <el-button type="primary" @click="submitForm" :loading="btnLoading">确定</el-button>
            <el-button type="primary" @click="CloseBooking">取消</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
  import { InsertOrderInfo } from '@/api/house'
  import { SelectExceptLastSignDate } from '@/api/tenant'
  import { validatePhone, validateCard } from '@/utils/validate/rulevalidator'

  export default {
    name: 'BookingHouse',
    data() {
      return {
        BookingVisible: false,
        btnLoading: false,
        HouseInfo: {},
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() + 3600 * 1000 * 24 < Date.now()
          }
        },
        BookingForm: {
          // 房源名称
          HouseName: '',
          // 预定人名称
          OrderName: '',
          // 预定人电话
          OrderPhone: '',
          // 预定人身份证
          OrderCardID: '',
          // 最晚签约时间
          LastSignDate: '',
          // 预定金额
          OrderMoney: '',
          // 约定租金
          ConvertionMoney: '',
          // 付款周期 押1付几
          PayModel: 3,
          // 提前几月付款
          AdvanceMonth: 1,
          // 服务费
          ServiceFee: 0,
          // 约定时间
          LeaseStartTime: '',
          LeaseEndTime: '',
          // 备注
          Remark: ''
        },
        // 表单验证规则
        rules: {
          OrderName: [
            { required: true, message: '请输入预定人姓名', trigger: 'blur' }
          ],
          OrderCardID: [
            { required: true, message: '请输入预定人身份证', trigger: 'blur' },
            { validator: validateCard, trigger: 'blur' }
          ],
          OrderPhone: [
            { required: true, message: '请输入预定人电话名', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
          LastSignDate: [
            {
              type: 'date',
              required: true,
              message: '请选择最晚签约时间',
              trigger: 'blur'
            }
          ],
          OrderMoney: [
            { required: true, message: '请输入预定金额', trigger: 'blur' }
          ],
          ConvertionMoney: [
            { required: true, message: '请输入约定租金', trigger: 'blur' }
          ],
          PayModel: [
            { required: true, message: '请输入付款方式', trigger: 'blur' }
          ],
          AdvanceMonth: [
            { required: true, message: '请输入最晚付款日', trigger: 'blur' }
          ],
          LeaseStartTime: [
            { required: true, message: '请选择开始时间', trigger: 'blur' }
          ],
          LeaseEndTime: [
            { required: true, message: '请选择结束时间', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      CloseBooking() {
        this.btnLoading = false
        this.BookingVisible = false
        this.BookingForm.Remark = ''
        this.$refs['BookingHouseForm'].resetFields()
      },
      submitForm() {
        // const self = this
        this.$refs['BookingHouseForm'].validate(valid => {
          if (valid) {
            if (
              this.BookingForm.LastSignDate &&
              this.BookingForm.OrderMoney > 0 &&
              this.BookingForm.ConvertionMoney > 0
            ) {
              const startDate = this.BookingForm.ContractExpireDate
                ? new Date(this.BookingForm.ContractExpireDate)
                : new Date()
              const days =
                Math.ceil(
                  (new Date(this.BookingForm.LastSignDate).getTime() -
                    startDate.getTime()) /
                    3600 /
                    1000 /
                    24
                ) + 1
              const maxOrderMoney = Math.ceil(
                (this.BookingForm.ConvertionMoney / 30) * 2 * days
              )
              if (+this.BookingForm.OrderMoney < maxOrderMoney) {
                this.$message.error(`预定金额不能小于${maxOrderMoney}元`)
                return false
              }
            }
            if (
              this.BookingForm.LeaseStartTime.getTime() >
              this.BookingForm.LeaseEndTime.getTime()
            ) {
              this.$message.error('结束时间不能早于开始时间')
              return false
            }
            this.btnLoading = true
            InsertOrderInfo({
              ...this.BookingForm,
              HouseID: !this.HouseInfo.HouseID
                ? this.HouseInfo.KeyID
                : this.HouseInfo.HouseID,
              HouseKey: this.HouseInfo.HouseKey,
              LastSignDate: this.$dateFormat(this.BookingForm.LastSignDate),
              ServiceFee: +this.BookingForm.ServiceFee,
              LeaseStartTime: this.$dateFormat(this.BookingForm.LeaseStartTime),
              LeaseEndTime: this.$dateFormat(this.BookingForm.LeaseEndTime)
            })
              .then(({ Data, BusCode, Msg }) => {
                if (BusCode === 2) {
                  this.$alert(Msg, '温馨提示', {
                    confirmButtonText: '我知道了'
                  })
                  this.btnLoading = false
                  return
                }
                this.$message({
                  message: '预定成功',
                  type: 'success'
                })
                this.$refs['BookingHouseForm'].resetFields()
                this.CloseBooking()
                this.$emit('handleSave', Data)
                if (Data.AuditStatus === 1) {
                  this.$alert('该预订单需要审核，请联系上级审核').then(() => {
                    this.$confirm('是否跳转至预定单列表', '提示').then(() => {
                      this.$router.push('/Tenant/OrderList')
                    })
                  })
                } else {
                  this.$confirm('是否跳转至预定单列表', '提示').then(() => {
                    this.$router.push('/Tenant/OrderList')
                  })
                }
              })
              .catch(() => {
                this.btnLoading = false
                // this.$message({
                //   message: '预定失败,请检查网络',
                //   type: 'warning'
                // })
              })
          } else {
            this.$message({
              message: '请填写完整!',
              type: 'warning'
            })
            return false
          }
        })
      },
      open(HouseInfo, hasEndContractTime = true) {
        // 如果合同未到期需调结果获取到期时间
        this.HouseInfo = HouseInfo
        this.btnLoading = false
        this.BookingVisible = true
        if (hasEndContractTime) {
          this.btnLoading = true
          SelectExceptLastSignDate({ HouseID: !this.HouseInfo.HouseID
                ? this.HouseInfo.KeyID
                : this.HouseInfo.HouseID
              })
            .then(({ Data }) => {
              this.pickerOptions = {
                disabledDate(time) {
                  return (
                    time.getTime() <= new Date(Data.ContractExpireDate).getTime()
                  )
                }
              }
              this.BookingForm.ContractExpireDate = Data.ContractExpireDate
              this.BookingForm.ContractStartDate = Data.ContractStartDate
              this.BookingForm.IsForwardHouse = Data.IsForwardHouse
              this.btnLoading = false
            })
            .finally(() => {
              this.btnLoading = false
            })
        }
      }
    },
    watch: {
      HouseInfo() {
        this.BookingForm.HouseName = this.HouseInfo.HouseName
        this.BookingForm.OrderMoney =
          this.HouseInfo.Deposit > 0 ? this.HouseInfo.Deposit : ''
        this.BookingForm.ConvertionMoney = this.HouseInfo.RentMoeny
      }
    }
  }
</script>
<style lang="scss">
  .add-order-paymodel-select .el-input,
  .add-order-advanceMonth-select .el-input {
    width: 150px !important;
  }
</style>
