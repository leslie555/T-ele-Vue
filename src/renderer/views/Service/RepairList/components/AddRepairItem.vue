<template>
  <div class="add-repair-wrap">
    <el-dialog
      :title="dialogTitle"
      width="740px"
      append-to-body
      @open="handleOpen"
      :center="true"
      @close="closeDialog"
      :visible="modalVisibility"
    >
      <div class="add-repair-container">
        <el-scrollbar class="vertical-scroll">
          <el-form
            :model="form"
            inline
            label-position="right"
            label-width="40px"
            ref="form"
            :rules="rules"
          >
            <div class="dialog-container form-item-sm">
              <div class="clearfix">
                <el-form-item label="项目所属费用" :required="true" :label-width="formLabelWidth">
                  <el-radio-group v-model="form.PayType">
                    <el-radio
                      v-for="item in InOrOut"
                      :key="item.Defination"
                      :label="item.Value"
                    >{{item.Description}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="维修金额" :label-width="formLabelWidth" prop="RealPay">
                  <el-input v-model.number="form.RealPay" v-positive="form.RealPay" type="number"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="房源名称" :label-width="formLabelWidth" prop="HouseName">
                  <search-house v-model="form.HouseName" @select="selectedHouse"></search-house>
                </el-form-item>
                <el-form-item label="租客姓名" :label-width="formLabelWidth" prop="TenantName">
                  <el-input v-model="form.TenantName" :maxlength="10" placeholder="请输入租客姓名"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="租客电话" :label-width="formLabelWidth" prop="TenantPhone">
                  <el-input v-model="form.TenantPhone" placeholder="请输入租客电话" :maxlength="11"></el-input>
                </el-form-item>
                <el-form-item
                  label="维修方式"
                  :required="true"
                  :label-width="formLabelWidth"
                  prop="RepairType"
                >
                  <el-select v-model="form.RepairType" style="width: 100%" placeholder="请选择">
                    <el-option label="内部维修" :value="0"></el-option>
                    <el-option label="外部维修" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="clearfix" v-if="!this.isEdit">
                <el-form-item label="收支时间" :label-width="formLabelWidth" prop="ReceivablesDate">
                  <el-date-picker v-model="form.ReceivablesDate" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="报修凭证" :label-width="formLabelWidth">
                  <upload-file ref="uploadFile" :img-list="form.MoenyPicImgList"></upload-file>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="维修图片" :label-width="formLabelWidth">
                  <upload-file ref="uploadFile" :img-list="form.RepairPicImgList"></upload-file>
                </el-form-item>
              </div>
              <div class="clearfix form-item-md">
                <el-form-item label="报修内容" :label-width="formLabelWidth" prop="RepairContent">
                  <el-input
                    type="textarea"
                    :maxlength="200"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入报修内容"
                    v-model="form.RepairContent"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="clearfix form-item-md">
                <el-form-item label="备注" :label-width="formLabelWidth" prop="RepairRemark">
                  <el-input
                    type="textarea"
                    :maxlength="200"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入备注"
                    v-model="form.RepairRemark"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="repair-button"
          :loading="loading"
          @click="submitAddedForm"
        >确 定</el-button>
        <el-button type="primary" class="repair-button" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addRepairTableList, editRepairItem } from '@/api/service'
import { validatePhone } from '@/utils/validate/rulevalidator'
import { scrollToError } from '@/utils/scrollToError'
import { UploadFile } from '@/components/UploadFile'
import SearchHouse from '@/components/SearchHouse'
export default {
  name: 'addRepairItem',
  components: {
    UploadFile,
    SearchHouse
  },
  props: {
    modalVisibility: Boolean,
    editingData: Object
  },
  data() {
    return {
      loading: false,
      form: {},
      copyForm: {},
      rules: {
        HouseName: [
          {
            required: true,
            message: '房源名称不能为空',
            trigger: 'change'
          }
        ],
        RepairContent: [
          {
            required: true,
            message: '报修内容不能为空',
            trigger: 'blur'
          }
        ],
        ReceivablesDate: [
          {
            type: 'date',
            required: true,
            message: '收支时间不能为空',
            trigger: 'change'
          }
        ],
        TenantPhone: [
          {
            validator: validatePhone,
            trigger: 'blur'
          }
        ]
      },
      formLabelWidth: '120px',
      oldRepairMoneyPic: [],
      oldRepairPicImgList: []
    }
  },
  computed: {
    InOrOut() {
      const inOrOut = this.$EnumData.getEnumListByKey('InOrOut').slice()
      inOrOut.shift()
      return inOrOut
    },
    isEdit() {
      return JSON.stringify(this.editingData) !== '{}'
    },
    dialogTitle() {
      return this.isEdit ? '修改维修详情' : '提交维修详情'
    }
  },
  methods: {
    getHouseName(houseName) {
      this.form.HouseName = houseName
    },
    closeDialog() {
      this.$emit('close')
    },
    selectedHouse(houseinfo) {
      this.form.HouseID = houseinfo.KeyID
    },
    submitAddedForm() {
      this.$refs.form.validate((valid, fileds) => {
        if (valid) {
          this.loading = true
          if (!this.isEdit) {
            console.log(JSON.parse(JSON.stringify(this.form)))
            addRepairTableList(this.form).then(
              res => {
                console.log(res)
                this.$emit('addedHouseInfo', res.Data)
                this.$refs.form.resetFields()
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.closeDialog()
              }
            ).catch(() => {
              this.loading = false
            })
          } else {
            this.form.MoenyPicImgList = this.$DiffArrFn(
              this.oldRepairMoneyPic,
              this.form.MoenyPicImgList,
              ['UniqueCode', 'ImgLocation']
            )
            this.form.RepairPicImgList = this.$DiffArrFn(
              this.oldRepairPicImgList,
              this.form.RepairPicImgList,
              ['UniqueCode', 'ImgLocation']
            )
            console.log(JSON.parse(JSON.stringify(this.form)))
            editRepairItem(this.form).then(res => {
              this.form.MoenyPicImgList = this.form.MoenyPicImgList.filter(v => v.ModifyStatus !== 3)
              this.form.RepairPicImgList = this.form.RepairPicImgList.filter(v => v.ModifyStatus !== 3)
              const info = Object.assign(this.editingData, this.form)
              this.$emit('editedRepairItem', info)
              this.loading = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.closeDialog()
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          scrollToError(fileds, this.$refs.form)
        }
      })
    },
    filter(val, arr) {
      const obj = {}
      arr.forEach(v => {
        if (val[v]) {
          obj[v] = val[v]
        }
      })
      return obj
    },
    handleOpen() {
      this.loading = false
      this.form = {
        HouseID: 0,
        HouseName: '',
        TenantName: '',
        TenantPhone: '',
        RepairType: 0,
        RealPay: '',
        PayType: 1,
        RepairContent: '',
        RepairRemark: '',
        MoenyPicImgList: [],
        RepairPicImgList: [],
        ReceivablesDate: ''
      }
      if (this.isEdit) {
        this.copyForm = this.$deepCopy(this.editingData)
        this.oldRepairMoneyPic = this.$deepCopy(this.copyForm.MoenyPicImgList)
        this.oldRepairPicImgList = this.$deepCopy(this.copyForm.RepairPicImgList)
        this.form = this.copyForm
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-repair-container {
  height: 500px;
  .repair-button {
    width: 100px;
  }
}
</style>
<style lang="scss">
.add-repair-wrap {
  .el-dialog--center .el-dialog__body {
    padding-bottom: 0;
  }
}
</style>

