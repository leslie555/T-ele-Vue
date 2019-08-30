<template>
  <el-dialog
    :visible="EditVisible"
    @close="close"
    :title="type === 1 ? '新增租客' : '修改'"
    :center="true"
    width="840px"
    append-to-body
  >
    <el-form
      :model="EditFormData"
      label-position="right"
      label-width="100px"
      :inline="true"
      :rules="rules"
      style="height: 500px; overflow: auto;"
      ref="editForm"
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix" style="marginBottom: 10px">
          <h3 style="color: #999999">租客信息</h3>
        </div>
        <div class="clearfix">
          <el-form-item label="租客姓名" prop="TenantName">
            <el-input style="width: 200px;" v-model="EditFormData.TenantName" :maxlength="8"></el-input>
          </el-form-item>
          <el-form-item label="租客电话" prop="TenantTel">
            <el-input style="width: 200px;" v-model="EditFormData.TenantTel" :maxlength="11"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="性别" prop="TenantSex">
            <el-select v-model="EditFormData.TenantSex" placeholder="请选择性别">
              <el-option
                :label="item.Description"
                :value="item.Value"
                v-for="item in Sex"
                :key="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄段" prop="AgeGroup">
            <el-select v-model="EditFormData.AgeGroup" placeholder="请选择年龄段">
              <el-option
                :label="item.Description"
                :value="item.Value"
                v-for="item in AgeGroup"
                :key="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix" style="margin: 0 0 10px">
          <h3 style="color: #999999">需求信息</h3>
        </div>
        <div class="clearfix form-item-sm">
          <el-form-item label="期望租金" prop="MinExpectedRent">
            <el-col :span="10">
              <el-input type="number"
                        v-positive="EditFormData.MinExpectedRent"
                        :min="0"
                        v-model="EditFormData.MinExpectedRent"></el-input>
            </el-col>
            <el-col class="line" :span="4">——</el-col>
            <el-col class="right-rent" :span="10">
              <el-input type="number"
                        v-positive="EditFormData.MaxExpectedRent"
                        :min="0"
                        v-model="EditFormData.MaxExpectedRent"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="期望区域" prop="RegionStr">
            <el-cascader
              :options="CityData"
              v-model="EditFormData.RegionStr"
              expand-trigger="hover"
              separator
              filterable
              style="width: 200px;"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="入住类型" prop="LiveType">
            <el-select
              v-model="EditFormData.LiveType"
              placeholder="请选择">
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in LiveType"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="入住时间" prop="LiveTime">
            <el-date-picker class="panel-body-input" type="date" placeholder="选择日期"
                            v-model="EditFormData.LiveTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="租期" prop="LeaseTerm">
            <el-select
              v-model="EditFormData.LeaseTerm"
              placeholder="请选择">
              <el-option
                :label="item.Description"
                :value="item.Value"
                v-for="item in LeaseTerm"
                :key="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item
            label="备注">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入备注"
              maxlength="400"
              v-model="EditFormData.Remarks"
              style="width: 500px;"
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button type="primary" @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { CityData } from '@/utils/CityData'
  import { validatePhone } from '@/utils/validate/rulevalidator'
  import { AddTenantResources, EditTenantResources } from '../../../../../api/resource'

  export default {
    name: 'EditTenantInfo',
    data() {
      return {
        CityData,
        EditVisible: false,
        type: '',
        EditFormData: {
          TenantName: '',
          TenantTel: '',
          TenantSex: '',
          AgeGroup: '',
          MinExpectedRent: '',
          MaxExpectedRent: '',
          RegionStr: [],
          LiveType: 0,
          LiveTime: '',
          LeaseTerm: '',
          Remarks: ''
        },
        LiveType: [
          {
            label: '整租',
            value: 0
          },
          {
            label: '合租',
            value: 1
          }
        ],
        data: {},
        // 表单验证
        rules: {
          TenantName: [
            { required: true, message: '请输入租客姓名', trigger: 'blur' }
          ],
          TenantTel: [
            { required: true, message: '请输入租客电话', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
          MinExpectedRent: [
            { required: true, message: '请输入期望租金', trigger: 'blur' }
          ],
          // MaxExpectedRent: [
          //   { required: true, message: '请输入期望租金（数字）', trigger: 'blur' }
          // ],
          RegionStr: [
            { required: true, message: '请选择所属区域', trigger: 'blur' }
          ]
        },
        btnLoading: false
      }
    },
    computed: {
      Sex() {
        return this.$EnumData.getEnumListByKey('Sex')
      },
      AgeGroup() {
        return this.$EnumData.getEnumListByKey('AgeGroup')
      },
      LeaseTerm() {
        return this.$EnumData.getEnumListByKey('LeaseTerm')
      }
    },
    methods: {
      open(type, data) {
        this.type = type
        this.btnLoading = false
        this.EditVisible = true
        if (data) {
          this.EditFormData = this.$deepCopy(data)
        }
      },
      submitForm() {
        // 新增租客私客
        this.$refs['editForm'].validate(valid => {
          if (valid) {
            if (!this.EditFormData.MinExpectedRent || !this.EditFormData.MaxExpectedRent) {
              this.$message({
                type: 'error',
                message: '请填写期望租金'
              })
              return false
            }
            this.btnLoading = true
            if (this.type === 1) {
              // this.EditFormData.Region = this.EditFormData.RegionList.length > 0 ? this.EditFormData.RegionList[this.EditFormData.RegionList.length - 1] : ''
              AddTenantResources(this.EditFormData).then(response => {
                if (response.Code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  })
                  this.$emit('AddNewData', response.Data)
                  this.btnLoading = false
                  this.EditFormData = {
                    TenantName: '',
                    TenantTel: '',
                    TenantSex: '',
                    AgeGroup: '',
                    MinExpectedRent: '',
                    MaxExpectedRent: '',
                    RegionStr: [],
                    LiveType: '',
                    LiveTime: '',
                    LeaseTerm: '',
                    Remarks: ''
                  }
                  this.close()
                }
              }).catch(() => {
                this.btnLoading = false
              })
            } else {
              // 编辑租客信息（私客和公客共用）
              // this.EditFormData.Region = this.EditFormData.RegionList.length > 0 ? this.EditFormData.RegionList[this.EditFormData.RegionList.length - 1] : ''
              EditTenantResources(this.EditFormData).then(response => {
                if (response.Code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  // console.log(this.EditFormData)
                  // debugger
                  this.$emit('EditNewData', this.EditFormData)
                  this.btnLoading = false
                  this.close()
                }
              }).catch(() => {
                this.btnLoading = false
              })
            }
          }
        })
      },
      close() {
        this.$refs.editForm.resetFields()
        this.EditVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .line {
    color: #999999;
    position: absolute;
    left: 215px;
    z-index: 999;
    width: 60px;
  }
  .right-rent {
    position: absolute;
    left: 260px;
  }
</style>
