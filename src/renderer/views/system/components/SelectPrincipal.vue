<template>
  <el-dialog
    :visible="FormVisible"
    @close="close"
    title="设置负责人"
    :center="true"
    width="400px"
    append-to-body
  >
    <el-form
      :model="form"
      label-position="right"
      label-width="100px"
      :inline="true"
      style="overflow: auto;"
      ref="principalForm"
    >
      <el-form-item label="负责人姓名">
        <select-employee
          ref="selectEmp"
          @select="handlePrincipalSelect"
          multi
          allCompany
          :existedEmp="principalData"
        >
          <el-input
            v-model="form.principalNames"
            :readonly="true"
            placeholder="请输入负责人姓名"
            :maxlength="10"
          ></el-input>
        </select-employee>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ConfirmChoose">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import SelectEmployee from '@/components/SelectEmployee'
  import { EditCompanyPrincipalInfo } from '@/api/system'

  export default {
    name: 'SelectPrincipal',
    components: {
      SelectEmployee
    },
    data() {
      return {
        FormVisible: false,
        companyID: '',
        principalData: [],
        principalInfo: [], // 原始数据
        Emp: [],
        form: {
          principalNames: ''
        }
      }
    },
    methods: {
      open(data) {
        this.principalInfo = data.principalInfo || []
        this.principalData = this.principalInfo.map(v => ({
          KeyID: v.EmployeeID,
          UserName: v.UserName,
          FullID: v.FullID
        }))
        const nameArr = []
        if (data && data.principalInfo) {
          data.principalInfo.forEach(item => {
            nameArr.push(item.UserName)
          })
        }
        // 填充输入框
        this.form.principalNames = nameArr.join(',')
        this.companyID = data.id
        // 渲染选择负责人选项
        this.FormVisible = true
        /* this.$nextTick(() => {
          this.$refs.selectEmp.getCompanyOrganism()
        }) */
      },
      // 获取负责人信息
      handlePrincipalSelect(val) {
        val.forEach(v => {
          const existedItem = this.principalInfo.find(item => item.EmployeeID === v.KeyID)
          v.EmployeeID = v.KeyID
          if (existedItem) {
            v.KeyID = existedItem.KeyID
          } else {
            v.KeyID = ''
          }
        })
        const nameArr = val.filter(val => val.ModifyStatus !== 3).map(v => v.UserName)
        this.Emp = val
        this.form.principalNames = nameArr.join(',')
      },
      ConfirmChoose() {
        const postData = {
          CompanyID: this.companyID,
          Emp: this.Emp.map(item => {
            return {
              KeyID: item.KeyID,
              EmployeeID: item.EmployeeID,
              ModifyStatus: item.ModifyStatus
            }
          })
        }
        EditCompanyPrincipalInfo(postData).then(res => {
          this.$message({
            type: 'success',
            message: '设置成功!'
          })
          const backData = {
            KeyID: this.companyID,
            PrincipalData: res.Data || this.principalInfo
          }
          this.$emit('GetPrincipalData', backData)
          this.companyID = ''
          this.principalInfo = []
          this.Emp = []
          this.form.principalNames = ''
          this.close()
        })
      },
      close() {
        this.FormVisible = false
      }
    }
  }
</script>

<style scoped>
</style>
