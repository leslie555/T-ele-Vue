<template>
  <div class="app-container">
    <div class="company-info-div panel">
      <div class="panel-body">
        <el-form
          status-icon
          :inline="true"
          class="demo-form-inline"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="150px"
          :disabled="IsViewPage">
          <div class="panel-title">企业信息</div>
          <div class="panel-body company-info-form">
            <div class="company-info-form-child">
              <el-form-item class="panel-body-item" label="企业名称" prop="BusinessName">
                <el-input class="panel-body-input" v-model="ruleForm.BusinessName" placeholder="公司名称"
                          :disabled="this.type==='2'" width="300px"></el-input>
              </el-form-item>
              <el-form-item class="panel-body-item" label="联系人" prop="LinkManName">
                <el-input class="panel-body-input" v-model="ruleForm.LinkManName" placeholder="公司联系人姓名"
                          :disabled="this.type==='2'"></el-input>
              </el-form-item>
              <el-form-item class="panel-body-item" label="员工数" prop="EmployeesNumber">
                <el-input class="panel-body-input"
                          v-model="ruleForm.EmployeesNumber"
                          type="number"
                          v-positive.int="ruleForm.EmployeesNumber"
                          placeholder="员工数"></el-input>
              </el-form-item>
              <el-form-item class="panel-body-item" label="省市县" prop="CityCode">
                <el-cascader
                  class="panel-body-input"
                  expand-trigger="hover"
                  :options="CityData"
                  separator=""
                  filterable
                  v-model="ruleForm.CityCode">
                </el-cascader>
              </el-form-item>
              <el-form-item class="panel-body-item" label="短信数量限制" prop="TopSendMessage">
                <el-input class="panel-body-input"
                          type="number"
                          v-model="ruleForm.TopSendMessage"
                          v-positive.int="ruleForm.TopSendMessage"
                          placeholder="发送短信数量限制"></el-input>
              </el-form-item>
              <el-form-item class="panel-body-item" label="合同失效时间" prop="EndTime">
                <el-date-picker class="panel-body-input" type="date" placeholder="选择日期"
                                v-model="ruleForm.EndTime"></el-date-picker>
              </el-form-item>
            </div>
            <div class="company-info-form-child">
              <el-form-item class="panel-body-item" label="公司电话" prop="CompanyTEL">
                <el-input class="panel-body-input" v-model="ruleForm.CompanyTEL" placeholder="公司电话"
                          :disabled="this.type==='2'"></el-input>
              </el-form-item>
              <el-form-item class="panel-body-item" label="联系人手机" prop="LinkManPhone">
                <el-input class="panel-body-input" v-model="ruleForm.LinkManPhone" placeholder="公司联系人电话"
                          :disabled="this.type==='2'" :maxlength="11"></el-input>
              </el-form-item>
              <el-form-item class="panel-body-item" label="房源数" prop="HouseNumber">
                <el-input class="panel-body-input"
                          type="number"
                          v-model="ruleForm.HouseNumber"
                          v-positive.int="ruleForm.HouseNumber"
                          placeholder="房源数"></el-input>
              </el-form-item>
              <el-form-item class="panel-body-item" label="公司地址" prop="CompanyAdress">
                <el-input class="panel-body-input" v-model="ruleForm.CompanyAdress"
                          placeholder="公司地址"></el-input>
              </el-form-item>
              <el-form-item class="panel-body-item" label="合同生效日期" prop="StartTime">
                <el-date-picker class="panel-body-input" type="date" placeholder="选择日期"
                                v-model="ruleForm.StartTime"></el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="panel-title">营业执照</div>
          <el-form-item prop="PicUrlList">
            <upload-file
              ref="uploadFile"
              title="营业执照上传"
              :img-list="ruleForm.PicUrlList"
              class="form-item-require"
              notice="请上传营业执照"
            ></upload-file>
          </el-form-item>
          <div class="panel-title">企业电子公章</div>
          <el-form-item prop="SealPicList">
            <upload-file
              ref="uploadFile"
              title="企业电子公章上传"
              :img-list="ruleForm.SealPicList"
              class="form-item-require"
              notice="请上传企业电子公章"
            ></upload-file>
          </el-form-item>
        </el-form>
        <div class="panel-body panel-body-buttons">
          <el-button
            v-if="!this.IsViewPage"
            class="save-button"
            type="primary"
            :loading="loading"
            el="saveButton"
            @click="companyInfoSave('ruleForm')">保存
          </el-button>
          <el-button
            class="return-button"
            type="primary"
            @click="companyInfoPageReturn">返回
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { addBusinessInfo, editBusinessInfo, showBusinessInfoByID } from '../../../api/admin'
  import { UploadFile } from '../../../components/'
  import { validatePhone } from '../../../utils/validate/rulevalidator'
  import { CityData, getCityNameByCode, getCodeArrByCode } from '../../../utils/CityData'

  export default {
    name: 'AddCompany',
    components: {
      UploadFile
    },

    data() {
      return {
        ID: 0,
        type: 0,
        isAdd: false,
        loading: false,
        IsViewPage: false,
        CityData,
        ruleForm: {
          BusinessName: '',
          LinkManName: '',
          EmployeesNumber: '',
          CityCode: [],
          CompanyAdress: '',
          CompanyTEL: '',
          LinkManPhone: '',
          HouseNumber: '',
          TopSendMessage: '',
          StartTime: '',
          EndTime: '',
          PicUrlList: [],
          SealPicList: []
        },
        KeyID: 0,
        rules: {
          BusinessName: [
            { required: true, message: '请输入企业名称', trigger: 'blur' },
            { min: 2, max: 18, message: '长度在 2到 18 个字符', trigger: 'blur' }
          ],
          LinkManName: [
            { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
          ],
          CityCode: [
            { required: true, message: '请选择企业所在省市县', trigger: 'blur' }
          ],
          CompanyAdress: [
            { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
          ],
          CompanyTEL: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          LinkManPhone: [
            { required: true, message: '请输入联系人电话', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ]
        }
      }
    },

    created() {
      this.ID = this.$route.query.ID || 0
      this.type = this.$route.query.type || 0
      if (this.ID <= 0) {
        this.isAdd = true
      }
      this.fetchData()
    },

    methods: {
      fetchData() {
        // 生成表单（无只读样式，无数据）
        // type:1-详情 2-修改 无参数-新增
        const postData = { 'KeyID': this.ID }
        if (!this.isAdd) {
          showBusinessInfoByID(postData).then(response => {
            const result = response.Data
            if (result !== '') {
              const companyObject = {
                BusinessName: result.BusinessName,
                CompanyTEL: result.CompanyTEL,
                LinkManName: result.LinkManName,
                LinkManID: result.LinkManID,
                LinkManPhone: result.LinkManPhone,
                EmployeesNumber: result.EmployeesNumber,
                HouseNumber: result.HouseNumber,
                CityName: result.CityName,
                CityCode: getCodeArrByCode(result.CityCode),
                CompanyAdress: result.CompanyAdress,
                TopSendMessage: result.TopSendMessage,
                StartTime: result.StartTime,
                EndTime: result.EndTime,
                PicUrlList: result.PicUrlList,
                SealPicList: result.SealPicList
              }
              this.KeyID = result.KeyID
              // 渲染表格样式
              this.ruleForm = Object.assign({}, companyObject)
              if (this.type === '1') {
                this.IsViewPage = true
                // 详情页面，全部按钮设为只读
                // 隐藏保存按钮
              }
              // 修改页面，前四个按钮设为只读
            }
          })
        }
      },

      companyInfoSave(formName) {
        if (this.ruleForm.CityCode.length === 0) {
          this.$message.error('省市县不能为空！')
          return false
        }
        if (this.ruleForm.PicUrlList.length === 0) {
          this.$message.error('营业执照不能为空！')
          return false
        }
        if (this.ruleForm.SealPicList.length === 0) {
          this.$message.error('企业公章不能为空！')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            this.ruleForm.CityCode = this.ruleForm.CityCode && this.ruleForm.CityCode.length > 1 ? this.ruleForm.CityCode.pop() : ''
            this.ruleForm.CityName = getCityNameByCode(this.ruleForm.CityCode)
            if (this.isAdd) {
              addBusinessInfo(this.ruleForm).then(() => {
                this.loading = false
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/Admin/CompanyInfo'
                })
                this.$refs[formName].resetFields()
              }).catch(() => {
                this.loading = false
              })
            }
            if (this.type === '2') {
              this.ruleForm.KeyID = this.KeyID
              editBusinessInfo(this.ruleForm).then(() => {
                this.loading = false
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            this.$message.error('请注意输入格式！')
          }
        })
      },

      companyInfoPageReturn() {
        this.$router.push({ path: '/Admin/CompanyInfo' })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
