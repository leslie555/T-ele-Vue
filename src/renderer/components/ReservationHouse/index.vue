<template>
  <el-dialog :visible="ReservationVisible" @close="CloseReservation" width="670px" center title="预约" append-to-body>
    <el-form :inline="true" label-width="110px" status-icon :model="ReservationForm" :rules="rules" ref="ReservationForm">
      <el-form-item label="看房人姓名" prop="CousterName">
        <el-input v-model="ReservationForm.CousterName" :maxlength="16"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="CousterPhone">
        <el-input v-model="ReservationForm.CousterPhone" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="预约看房时间" prop="AppointTime">
        <el-date-picker type="date" placeholder="选择日期" v-model="ReservationForm.AppointTime" style="width: 185px"></el-date-picker>
      </el-form-item>
      <el-form-item label="房源名称:">
        {{ ReservationForm.HouseName }}
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="ReservationForm.Remark" style="width: 350px;" :rows="4" :maxlength="140"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center; width: 100%;">
        <el-button type="primary" @click="submitForm" :loading="btnLoading">确定</el-button>
        <el-button type="primary" @click="CloseReservation">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { AddAppointmentInfo } from '@/api/house'
import { validatePhone } from '@/utils/validate/rulevalidator'

  export default({
    name: 'ReservationHouse',
    data() {
      return {
        ReservationVisible: false,
        btnLoading: false,
        HouseInfo: {},
        ReservationForm: {
          // 看房人姓名
          CousterName: '',
          // 看房人电话
          CousterPhone: '',
          // 看房时间
          AppointTime: '',
          // 房源名称
          HouseName: '',
          // 备注
          Remark: ''
        },
        rules: {
          CousterName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          CousterPhone: [
            { required: true, message: '请输入电话号码', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
          AppointTime: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      CloseReservation() {
        this.btnLoading = false
        this.ReservationVisible = false
        this.ReservationForm.Remark = ''
        this.$refs['ReservationForm'].resetFields()
        this.$emit('CloseReservation')
      },
      submitForm() {
        this.$refs['ReservationForm'].validate(valid => {
          if (valid) {
            this.btnLoading = true
            AddAppointmentInfo({
              HouseID: this.HouseInfo.HouseID,
              // 看房人姓名
              CousterName: this.ReservationForm.CousterName,
              // 看房人电话
              CousterPhone: this.ReservationForm.CousterPhone,
              // 看房时间
              AppointTime: this.ReservationForm.AppointTime,
              // 房源名称
              HouseName: this.ReservationForm.HouseName,
              // 备注
              Remark: this.ReservationForm.Remark
            }).then(response => {
              this.$message({
                message: '预约成功',
                type: 'success'
              })
              this.$refs['ReservationForm'].resetFields()
              this.CloseReservation()
            }).catch(() => {
              this.btnLoading = false
              this.$message({
                message: '预定失败,请检查网络',
                type: 'warning'
              })
            })
          } else {
            this.$message.error('请填写完整!')
            return false
          }
        })
      },
      open(HouseInfo) {
        this.btnLoading = false
        this.HouseInfo = HouseInfo
        this.ReservationVisible = true
      }
    },
    watch: {
      HouseInfo() {
        this.ReservationForm.HouseName = `${this.HouseInfo.CommunityName}${this.HouseInfo.Building}-${this.HouseInfo.UnitNumber}-${this.HouseInfo.RoomNumber}${!this.HouseInfo.RoomName ? '' : '-'}${this.HouseInfo.RoomName}`
      }
    }
  })
</script>
<style lang="scss" scoped>

</style>
