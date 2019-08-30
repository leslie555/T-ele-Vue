<template>
  <el-dialog
    :visible="visible"
    @close="CloseDecoration"
    width="800px"
    title="装修设置"
    :center="true"
    custom-class="dialogRadius"
    append-to-body
  >
    <el-form
      label-width="120px"
      :model="DecorationForm"
      :inline="true"
      ref="DecorationForm"
      :rules="rules"
    >
      <div class="clearfix">
        <el-form-item label="实际装修时间" prop="ActDecorateStartTime">
          <el-date-picker
            type="date"
            placeholder="开始日期"
            size="small"
            v-model="DecorationForm.ActDecorateStartTime"
            style="width: 184px;"
          ></el-date-picker>
        </el-form-item>
        <span
          style="vertical-align: middle; display: inline-block; margin-bottom: -25px; margin-right: 8px;"
        >至</span>
        <el-form-item prop="ActDecorateEndTime">
          <el-date-picker
            type="date"
            placeholder="结束日期"
            size="small"
            v-model="DecorationForm.ActDecorateEndTime"
            style="width: 184px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收支时间" v-if="isNew" prop="ReceivablesDate">
          <el-date-picker
            type="date"
            placeholder
            size="small"
            style="width: 240px;"
            v-model="DecorationForm.ReceivablesDate"
          ></el-date-picker>
        </el-form-item>
      </div>
      <div class="clearfix">
        <el-form-item label="共用金额" prop="DecorateMoeny">
          <el-input
            style="width: auto"
            size="small"
            v-model="DecorationForm.DecorateMoeny"
            type="number"
            v-positive="DecorationForm.DecorateMoeny"
            @blur="calcPrice"
            min="0"
          ></el-input>&nbsp;元
          <div class="el-form-item__error" v-show="showCalcPrice">
            提示：该价格超过系统测算装修价格
          </div>
        </el-form-item>
      </div>
      <div class="clearfix" style="margin-left: 100px;">
        <el-form-item label-width="30px">
          <el-checkbox v-model="DecorationForm.IsLoan">是否使用装修贷</el-checkbox>
        </el-form-item>
        <el-form-item label="贷款金额" v-if="DecorationForm.IsLoan">
          <el-input
            style="width: auto;"
            size="small"
            v-model="DecorationForm.LoanMoeny"
            type="number"
            v-positive="DecorationForm.LoanMoeny"
            min="0"
          ></el-input>&emsp;元
        </el-form-item>
      </div>
      <div class="clearfix">
        <upload-file ref="uploadFile" title="上传附件" :img-list="DecorationForm.DecoratePicIDList"></upload-file>
      </div>
      <div class="clearfix">
        <el-form-item label="装修备注">
          <el-input
            type="textarea"
            :rows="3"
            style="width: 540px"
            v-model="DecorationForm.Remark"
            :maxlength="140"
          ></el-input>
        </el-form-item>
      </div>
      <div class="clearfix" style="text-align: center;">
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="submitForm"
            :disabled="isRenovationStatus"
            :loading="btnLoading"
          >确定</el-button>
          <el-button type="danger" plain size="small" @click="CloseDecoration">取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { UploadFile } from '@/components/UploadFile'
import { EditFitment, AddFitment } from '@/api/house'
import { StateFitment } from '../../../../../api/system'

export default ({
  name: 'HouseDecoration',
  data() {
    return {
      showCalcPrice: false,
      isRenovationStatus: true,
      HouseName: '',
      btnLoading: false,
      DecorationForm: {
        ActDecorateEndTime: '',
        ActDecorateStartTime: '',
        ReceivablesDate: '',
        DecorateMoeny: '',
        IsLoan: false,
        LoanMoeny: '',
        Remark: '',
        DecoratePicIDList: []
      },
      isNew: true,
      visible: false,
      HouseKey: 0,
      HouseID: 0,
      RenovationStatus: 0,
      rules: {
        ActDecorateStartTime: [
          {
            required: true, message: '请选择开始日期', trigger: 'blur'
          }
        ],
        ActDecorateEndTime: [
          {
            required: true, message: '请选择结束日期', trigger: 'blur'
          }
        ],
        ReceivablesDate: [
          {
            required: true, message: '请选择应收款日期', trigger: 'blur'
          }
        ],
        DecorateMoeny: [
          {
            required: true, message: '请填写金额', trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
    UploadFile
  },
  methods: {
    calcPrice() {
      this.$nextTick(() => {
        if (!this.DecorationForm.DecorateMoeny) {
          this.showCalcPrice = false
          return
        }
        StateFitment({
          HouseID: this.HouseID,
          fitmentMoney: +this.DecorationForm.DecorateMoeny
        }).then(({ BusCode }) => {
          if (BusCode === 1) {
            this.showCalcPrice = true
          } else {
            this.showCalcPrice = false
          }
        })
      })
    },
    CloseDecoration() {
      this.$emit('CloseDecoration')
      this.visible = false
      this.isNew = true
      this.btnLoading = false
    },
    submitForm() {
      const self = this
      this.$refs['DecorationForm'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.isNew) {
            AddFitment({
              HouseKey: this.HouseKey,
              HouseID: this.HouseID,
              HouseName: this.HouseName,
              IsDecorating: this.RenovationStatus,
              ActDecorateStartTime: this.DecorationForm.ActDecorateStartTime,
              ActDecorateEndTime: this.DecorationForm.ActDecorateEndTime,
              ReceivablesDate: this.DecorationForm.ReceivablesDate,
              DecorateMoeny: this.DecorationForm.DecorateMoeny,
              LoanMoeny: this.DecorationForm.LoanMoeny,
              IsLoan: this.DecorationForm.IsLoan ? 1 : 0,
              DecoratePicIDList: this.DecorationForm.DecoratePicIDList,
              Remark: this.DecorationForm.Remark
            }).then(response => {
              if (response.Code === 0) {
                self.$message({
                  message: '新增装修成功',
                  type: 'success'
                })
                self.$refs['DecorationForm'].resetFields()
                self.btnLoading = false
                self.CloseDecoration()
              } else {
                self.btnLoading = false
              }
            })
          } else {
            EditFitment({
              KeyID: this.DecorationForm.KeyID,
              AuditStatus: this.DecorationForm.AuditStatus,
              HouseID: this.HouseID,
              HouseName: this.HouseName,
              IsDecorating: this.RenovationStatus,
              ActDecorateStartTime: this.DecorationForm.ActDecorateStartTime,
              ActDecorateEndTime: this.DecorationForm.ActDecorateEndTime,
              DecorateMoeny: this.DecorationForm.DecorateMoeny,
              LoanMoeny: this.DecorationForm.LoanMoeny,
              IsLoan: this.DecorationForm.IsLoan ? 1 : 0,
              DecoratePicIDList: this.DecorationForm.DecoratePicIDList,
              Remark: this.DecorationForm.Remark
            }).then(response => {
              self.$message({
                message: '修改成功',
                type: 'success'
              })
              self.$refs['DecorationForm'].resetFields()
              // self.btnLoading = false
              self.CloseDecoration()
            })
          }
          this.CloseDecoration()
        }
      })
    },
    open(name, data, key, id, isRenovationStatus) {
      this.HouseName = name
      this.visible = true
      self.btnLoading = false
      this.isRenovationStatus = isRenovationStatus === 1
      if (data !== null && data.KeyID > 0) {
        this.isNew = false
        for (var index in this.DecorationForm) {
          if (index === 'IsLoan') {
            if (data[index] === 0) {
              this.DecorationForm[index] = false
            } else {
              this.DecorationForm[index] = true
            }
          } else {
            this.DecorationForm[index] = data[index]
          }
        }
        this.DecorationForm.KeyID = data.KeyID
      } else {
        this.DecorationForm = {
          ActDecorateStartTime: '',
          ActDecorateEndTime: '',
          Time: '',
          DecorateMoeny: '',
          IsLoan: false,
          LoanMoeny: '',
          Remark: '',
          DecoratePicIDList: []
        }
      }
      this.HouseKey = key
      this.HouseID = id
      this.RenovationStatus = isRenovationStatus !== 0 ? '1' : '0'
    }
  }
})
</script>
<style lang="scss" scoped>
.dialogRadius {
  border-radius: 6px;
}
</style>
