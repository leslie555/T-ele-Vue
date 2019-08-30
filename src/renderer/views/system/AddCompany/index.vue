<template>
  <div class="app-container">
    <div class="panel">
      <steps-box :list="stepList" ref="stepBox">
        <template slot="1">
          <div class="form-item-sm">
            <el-form
              :model="form"
              label-position="right"
              ref="form"
              :rules="rules"
              label-width="120px"
              status-icon
            >
              <el-form-item label="类型">
                <el-radio v-model="form.CompanyType" :label="1">公司</el-radio>
                <el-radio v-model="form.CompanyType" :label="2">分店</el-radio>
              </el-form-item>
              <el-form-item label="所属公司">
                <el-select v-model="form.PID">
                  <el-option
                    v-for="item in showingSelections"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名称" prop="CompanyName" class="form-item-md">
                <el-input v-model="form.CompanyName" :maxlength="50"></el-input>
              </el-form-item>
              <el-form-item
                :label="form.CompanyType===1?'公司简称':'分店简称'"
                prop="CompanyAbbreviation"
                class="form-item-md"
              >
                <el-input v-model="form.CompanyAbbreviation" :maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="省份" prop="CityCode">
                <el-cascader
                  expand-trigger="hover"
                  :options="CityData"
                  separator
                  filterable
                  v-model="province"
                  @change="handleCityChange"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址" prop="Address" class="form-item-md">
                <el-input v-model="form.Address" :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="员工人数">
                <el-input
                  v-positive="form.PeopleNumber"
                  v-model.number="form.PeopleNumber"
                  class="form-item-md"
                ></el-input>
              </el-form-item>
              <el-form-item label="是否资金独立">
                <el-radio v-model="form.IsIndependent" :label="1">是</el-radio>
                <el-radio v-model="form.IsIndependent" :label="0">否</el-radio>
              </el-form-item>
              <div class="clearfix">
                <el-form-item label="分店主图">
                  <upload-file ref="uploadFile" :img-list="form.ImgList"></upload-file>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button @click="handleCancle">取消</el-button>
                <el-button type="primary" @click="handleNextStep">下一步</el-button>
              </el-form-item>
            </el-form>
          </div>
        </template>
        <template slot="2">
          <div class="form-item-sm">
            <el-form
              :model="form"
              label-position="right"
              :rules="principalRules"
              ref="principalForm"
              label-width="100px"
              status-icon
            >
              <el-form-item label="负责人姓名" class="form-item-md" prop="PrincipalUserName">
                <select-employee
                  v-if="!isEdit"
                  @empChange="handleEmpClick"
                  allCompany
                >
                  <el-input v-model="form.PrincipalUserName" placeholder="请输入负责人姓名" :maxlength="10"></el-input>
                </select-employee>
                <el-input
                  v-else
                  disabled
                  v-model="form.PrincipalUserName"
                  placeholder="请输入负责人姓名"
                  :maxlength="10"
                ></el-input>
              </el-form-item>
              <el-form-item label="负责人电话" class="form-item-md" prop="PrincipalUserPhone">
                <el-input
                  :disabled="this.isEdit"
                  v-model="form.PrincipalUserPhone"
                  placeholder="请输入负责人电话"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <span class="add-company-notice">分店负责人电话将作为分店负责人登录账号,密码不填时默认为初始密码000000</span>
              </el-form-item>
              <el-form-item>
                <el-button @click="handlePrevStep">上一步</el-button>
                <el-button type="primary" :loading="btnLoading" @click="handleSubmit">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </steps-box>
    </div>
  </div>
</template>

<script>
  import StepsBox from '@/components/StepsBox'
  import SelectEmployee from '@/components/SelectEmployee'
  import { validatePhone } from '@/utils/validate/rulevalidator.js'
  import { addCompanyData, editCompanyData, SelectBusinessDepList } from '@/api/system'
  import { UploadFile } from '@/components/UploadFile'
  import { CityData, getCityNameByCode, getCodeArrByCode } from '@/utils/CityData'

  export default {
    components: {
      StepsBox,
      UploadFile,
      SelectEmployee
    },
    data() {
      return {
        btnLoading: false,
        CityData,
        isEdit: null,
        treeData: [],
        popoverVisible: false,
        stepList: [
          {
            title: '基础信息'
          },
          {
            title: '负责人设置'
          }
        ],
        form: {
          CompanyType: 1,
          PID: 0,
          CompanyID: 1,
          CompanyName: '',
          CompanyAbbreviation: '',
          CityCode: '',
          CityName: '',
          Address: '',
          PrincipalUserID: 0,
          PeopleNumber: '',
          IsIndependent: 1,
          ImgList: [],
          PrincipalUserName: '',
          PrincipalUserPhone: ''
        },
        province: [],
        principalForm: {},
        rules: {
          CompanyName: [
            {
              required: true,
              message: '名称不能为空',
              trigger: 'blur'
            }
          ],
          CompanyAbbreviation: [
            {
              required: true,
              message: '公司简称不能为空',
              trigger: 'blur'
            }
          ],
          Address: [
            {
              required: true,
              message: '地址不能为空',
              trigger: 'blur'
            }
          ],
          CityCode: [
            {
              required: true,
              message: '省份不能为空',
              trigger: 'change'
            }
          ]
        },
        principalRules: {
          PrincipalUserName: [
            {
              required: true,
              message: '负责人姓名不能为空',
              trigger: 'change'
            }
          ],
          PrincipalUserPhone: [
            {
              validator: validatePhone,
              trigger: ['blur', 'change']
            },
            {
              required: true,
              message: '电话不能为空',
              trigger: ['blur', 'change']
            }
          ]
        },
        allCompany: [],
        companySelections: null,
        storeSelections: null,
        showingSelections: [{ value: 0, label: '无' }],
        employList: [],
        oldPrincipalUserName: '',
        oldPrincipalTel: '',
        oldImg: []
      }
    },
    methods: {
      addPrincipal() {
      },
      handleEmpClick(val) {
        this.oldPrincipalUserName = this.principalForm.PrincipalUserName =
          val.UserName
        this.oldPrincipalTel = this.principalForm.PrincipalUserPhone = val.Tel
        this.principalForm.PrincipalUserID = val.KeyID
      },
      handleCancle() {
        this.$router.push({ path: 'CompanyManage' })
      },
      handleNextStep() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.principalForm = this.form
            this.$refs.stepBox.nextStep()
          }
        })
      },
      handleCityChange() {
        this.form.CityCode = this.province[2]
        this.form.CityName = getCityNameByCode(this.province)
      },
      handlePrevStep() {
        this.$refs.stepBox.prevStep()
      },
      handleSubmit() {
        this.$refs.principalForm.validate(valid => {
          if (valid) {
            this.btnLoading = true
            this.form.Picture = this.form.ImgList.map(v => v.KeyID).join(',')
            this.form.ImgList = this.$DiffArrFn(this.oldImg, this.form.ImgList, [
              'KeyID'
            ])
            console.log(this.oldPrincipalUserName, this.oldPrincipalTel)
            if (
              this.principalForm.PrincipalUserName !==
              this.oldPrincipalUserName ||
              this.principalForm.PrincipalUserPhone !== this.oldPrincipalTel
            ) {
              this.principalForm.PrincipalUserID = 0
            }
            if (this.isEdit) {
              editCompanyData(this.form).then(res => {
                this.btnLoading = false
                this.$router.push({ path: 'CompanyManage' })
              }).catch(res => {
                this.btnLoading = false
              })
            } else {
              // const form = Object.assign(this.form, this.principalForm)
              // debugger
              console.log(JSON.parse(JSON.stringify(this.form)))
              addCompanyData(this.form).then(res => {
                this.btnLoading = false
                this.$router.push({ path: 'CompanyManage' })
              }).catch(res => {
                this.btnLoading = false
              })
            }
          }
        })
      },
      watchCompanyType() {
        this.$watch(
          'form.CompanyType',
          val => {
            if (+val === 1 && !this.companySelections) {
              let belonging = []
              belonging = this.allCompany.filter(val => {
                return +val.CompanyType === 1
              })
              this.companySelections = belonging.map(val => {
                return {
                  value: val.KeyID,
                  label: val.CompanyName
                }
              })
              this.companySelections.unshift({
                value: 0,
                label: '无'
              })
            } else if (+val === 2 && !this.storeSelections) {
              this.storeSelections = this.allCompany.map(val => {
                return {
                  value: val.KeyID,
                  label: val.CompanyName
                }
              })
              this.storeSelections.unshift({
                value: 0,
                label: '无'
              })
            }
            this.showingSelections =
              val === 1 ? this.companySelections : this.storeSelections
          },
          {
            immediate: true
          }
        )
      }
    },
    created() {
      const query = this.$route.query.data || '{}'
      this.isEdit = query !== '{}' // 根据传过来的对象是否为空判断此时为新增还是修改
      this.copyForm = this.$deepCopy(JSON.parse(query))
      if (this.isEdit) {
        this.oldImg = this.$deepCopy(this.copyForm.ImgList)
        this.form = this.copyForm
        this.province = getCodeArrByCode(this.form.CityCode)
        this.oldPrincipalUserName = this.form.PrincipalUserName
        this.oldPrincipalTel = this.form.PrincipalUserPhone
        this.form.PrincipalUserID = this.form.PrincipalUserID
      }
      SelectBusinessDepList({ BusinessID: this.$store.getters.userinfo.BusinessID, Type: 2 }).then(res => {
        if (this.isEdit) {
          this.allCompany = res.Data.ComList.filter(v => {
            return v.KeyID !== this.form.KeyID
          })
          console.log(this.allCompany)
        } else {
          this.allCompany = res.Data.ComList
        }
        this.watchCompanyType()
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/variables";

  .add-company-notice {
    font-size: 12px;
    line-height: 12px;
    margin-top: 10px;
    color: $--color-primary;
  }
</style>
