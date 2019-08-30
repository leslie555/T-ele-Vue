<template>
  <el-dialog
    :visible.sync="BookingVisible"
    @close="CloseBooking"
    title="预定"
    width="700px"
    center
    append-to-body
  >
    <el-form
      :inline="true"
      label-width="100px"
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
            <el-input v-model="BookingForm.OrderName" :maxlength="16"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="预定人电话" prop="OrderPhone">
            <el-input v-model="BookingForm.OrderPhone" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="最晚签约日" prop="LastSignDate">
            <el-date-picker type="date" placeholder="选择日期" v-model="BookingForm.LastSignDate"></el-date-picker>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="预定金额" prop="OrderMoney">
            <el-input
              v-model="BookingForm.OrderMoney"
              type="number"
              v-positive="BookingForm.OrderMoney"
              min="0"
            ></el-input>
          </el-form-item>
          <el-form-item label="约定租金" prop="ConvertionMoney">
            <el-input
              v-model="BookingForm.ConvertionMoney"
              type="number"
              v-positive="BookingForm.ConvertionMoney"
              min="0"
            ></el-input>
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
  import { validatePhone } from '@/utils/validate/rulevalidator'

  export default ({
    name: 'BookingHouse',
    data() {
      return {
        BookingVisible: false,
        btnLoading: false,
        HouseInfo: {},
        BookingForm: {
          // 房源名称
          HouseName: '',
          // 预定人名称
          OrderName: '',
          // 预定人电话
          OrderPhone: '',
          // 最晚签约时间
          LastSignDate: '',
          // 预定金额
          OrderMoney: '',
          // 约定租金
          ConvertionMoney: '',
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
          OrderPhone: [
            { required: true, message: '请输入预定人电话名', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
          LastSignDate: [
            { type: 'date', required: true, message: '请选择最晚签约时间', trigger: 'blur' }
          ],
          OrderMoney: [
            { required: true, message: '请输入预定金额', trigger: 'blur' }
          ],
          ConvertionMoney: [
            { required: true, message: '请输入约定租金', trigger: 'blur' }
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
            this.btnLoading = true
            if (this.BookingForm.LeaseStartTime.getTime() > this.BookingForm.LeaseEndTime.getTime()) {
              this.$message.error('结束时间不能早于开始时间')
              this.btnLoading = false
              return false
            }
            InsertOrderInfo({
              HouseID: !this.HouseInfo.HouseID ? this.HouseInfo.KeyID : this.HouseInfo.HouseID,
              // 房源名称
              HouseName: this.BookingForm.HouseName,
              HouseKey: this.HouseInfo.HouseKey,
              // 预定人名称
              OrderName: this.BookingForm.OrderName,
              // 预定人电话
              OrderPhone: this.BookingForm.OrderPhone,
              // 最晚签约时间
              LastSignDate: this.BookingForm.LastSignDate,
              // 预定金额
              OrderMoney: this.BookingForm.OrderMoney,
              // 约定租金
              ConvertionMoney: this.BookingForm.ConvertionMoney,
              // 约定时间
              LeaseStartTime: this.BookingForm.LeaseStartTime,
              LeaseEndTime: this.BookingForm.LeaseEndTime,
              // 备注
              Remark: this.BookingForm.Remark
            }).then(({ Data }) => {
              this.$message({
                message: '预定成功',
                type: 'success'
              })
              this.$refs['BookingHouseForm'].resetFields()
              this.CloseBooking()
              this.$emit('handleSave', Data)
              this.$confirm('是否跳转至预定单列表', '提示').then(() => {
                this.$router.push('/Tenant/OrderList')
              }).catch(() => {
                //
              })
            }).catch(() => {
              this.btnLoading = false
              this.$message({
                message: '预定失败,请检查网络',
                type: 'warning'
              })
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
      open(HouseInfo) {
        this.HouseInfo = HouseInfo
        this.btnLoading = false
        this.BookingVisible = true
      }
    },
    watch: {
      HouseInfo() {
        this.BookingForm.HouseName = this.HouseInfo.HouseName
        this.BookingForm.OrderMoney = this.HouseInfo.Deposit
        this.BookingForm.ConvertionMoney = this.HouseInfo.RentMoeny
      }
    }
  })
</script>
<style lang="scss" scoped>
</style>
