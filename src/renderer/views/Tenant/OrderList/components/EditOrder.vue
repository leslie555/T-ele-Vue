<template>
  <el-dialog
    :visible.sync="BookingVisible"
    @close="CloseBooking"
    :title="title"
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
            <search-house
              ref="searchHouse"
              v-if="type==2"
              :type="2"
              v-model="BookingForm.HouseName"
              @select="selectedHouse"
            ></search-house>
            <span v-else style="display: inline-block; width: 200px;">{{ BookingForm.HouseName }}</span>
          </el-form-item>
          <el-form-item label="预定人姓名" prop="OrderName">
            <el-input :disabled="type!=1" v-model="BookingForm.OrderName" :maxlength="14"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="预定人电话" prop="OrderPhone">
            <el-input :disabled="type!=1" v-model="BookingForm.OrderPhone" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="预定人身份证" prop="OrderCardID">
            <el-input :disabled="type!=1" v-model="BookingForm.OrderCardID" :maxlength="18"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="预定金额" prop="OrderMoney">
            <el-input
              :disabled="type!=3"
              v-model="BookingForm.OrderMoney"
              type="number"
              @blur="$positive(BookingForm,'OrderMoney',1,false,undefined)"
              min="1"
            ></el-input>
          </el-form-item>
          <el-form-item label="约定租金" prop="ConvertionMoney">
            <el-input
              :disabled="type!=1 || isAgent"
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
              :disabled="type!=1"
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
              :disabled="type!=1"
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
              :disabled="type!=3"
              type="date"
              :picker-options="pickerOptions"
              placeholder="选择日期"
              v-model="BookingForm.LastSignDate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="最晚付款日" prop="PayModel">
            <span>提前</span>
            <el-select
              :disabled="type!=1"
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
              :disabled="type!=1 || isAgent"
              type="date"
              placeholder="开始时间"
              v-model="BookingForm.LeaseStartTime"
              style="width: 200px;"
            ></el-date-picker>
            <span>--</span>
          </el-form-item>
          <el-form-item prop="LeaseEndTime">
            <el-date-picker
              :disabled="type!=1"
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
              :disabled="type!=1"
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
  import {
    UpdateOrderInfo,
    OrderMoneyExtension,
    TurnOrderinfo
  } from '@/api/house'
  import { validatePhone, validateCard } from '@/utils/validate/rulevalidator'
  import SearchHouse from '@/components/SearchHouse'

  export default {
    name: 'EditOrder',
    components: {
      SearchHouse
    },
    data() {
      return {
        BookingVisible: false,
        btnLoading: false,
        type: 1, // 1修改 2转定 3续定
        pickerOptions: null,
        editData: null,
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
          Remark: '',
          ContractExpireDate: ''
        },
        isAgent: false,
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
    computed: {
      title() {
        return this.type === 1 ? '修改预定' : this.type === 2 ? '转定' : '续定'
      }
    },
    methods: {
      CloseBooking() {
        this.btnLoading = false
        this.BookingVisible = false
        this.BookingForm.Remark = ''
        this.$refs.searchHouse && this.$refs.searchHouse.clear()
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
              const days = Math.ceil(
                (new Date(this.BookingForm.LastSignDate).getTime() -
                  new Date(this.editData.LastSignDate).getTime()) /
                  3600 /
                  1000 /
                  24
              )
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
            const fn =
              this.type === 1
                ? UpdateOrderInfo
                : this.type === 2
                ? TurnOrderinfo
                : OrderMoneyExtension
            fn({
              ...this.BookingForm,
              LastSignDate: this.$dateFormat(this.BookingForm.LastSignDate),
              LeaseStartTime: this.$dateFormat(this.BookingForm.LeaseStartTime),
              LeaseEndTime: this.$dateFormat(this.BookingForm.LeaseEndTime)
            })
              .then(({ Data, BusCode, Msg }) => {
                const msg =
                  this.type === 1
                    ? '修改成功'
                    : this.type === 2
                    ? '转定成功'
                    : '续定成功'
                this.$message({
                  message: msg,
                  type: 'success'
                })
                this.CloseBooking()
                this.$refs['BookingHouseForm'].resetFields()
                this.$emit('edited', Data, this.type)
              })
              .catch(() => {
                this.btnLoading = false
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
      selectedHouse(houseinfo) {
        this.BookingForm.HouseID = houseinfo.HouseID
          ? houseinfo.HouseID
          : houseinfo.KeyID
        this.BookingForm.HouseKey = houseinfo.HouseKey
      },
      open(editData, type, isAgent) {
        this.isAgent = !!isAgent
        this.type = type
        this.editData = editData
        Object.assign(this.BookingForm, editData)
        this.BookingForm.LastSignDate = new Date(this.BookingForm.LastSignDate)
        this.BookingForm.LeaseStartTime = new Date(
          this.BookingForm.LeaseStartTime
        )
        this.BookingForm.LeaseEndTime = new Date(this.BookingForm.LeaseEndTime)
        if (type === 3) {
          this.pickerOptions = {
            disabledDate(time) {
              return time.getTime() <= new Date(editData.LastSignDate).getTime()
            }
          }
          this.BookingForm.LastSignDate = ''
        }
        this.btnLoading = false
        this.BookingVisible = true
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
