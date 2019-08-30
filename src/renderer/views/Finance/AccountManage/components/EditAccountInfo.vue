<template>
  <div>
    <el-dialog title="账户管理" width="800px" :center="true" :visible.sync="modalVisibility"
               append-to-body>
      <el-scrollbar class="vertical-scroll">
        <el-form class="account-form" ref="ruleForm" :model="form" :rules="rules" status-icon inline>
          <div class="dialog-container form-item-sm">
            <div class="clearfix">
              <el-form-item label="账户类型" :label-width="formLabelWidth" prop="AccountType">
                <el-select v-model="form.AccountType" placeholder="请选择" @change="toggleAccountType">
                  <el-option
                    v-for="item in accountTypeList"
                    :key="item.KeyID"
                    :label="item.Name"
                    :value="item.KeyID">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="账户名称" :label-width="formLabelWidth" prop="AccountName">
                <el-input v-model="form.AccountName"></el-input>
              </el-form-item>
            </div>
            <div v-if="IsBankType" class="clearfix">
              <el-form-item label="银行名称" :label-width="formLabelWidth" prop="BankName">
                <el-input v-model="form.BankName"></el-input>
              </el-form-item>
              <el-form-item label="开户行" :label-width="formLabelWidth" prop="OpenBank">
                <el-input v-model="form.OpenBank"></el-input>
              </el-form-item>
            </div>
            <div class="clearfix">
              <el-form-item label="账号" :label-width="formLabelWidth" prop="Account">
                <el-input v-model="form.Account"></el-input>
              </el-form-item>
              <el-form-item v-if="!IsEdit" label="期初余额" :label-width="formLabelWidth" prop="BeginningBalance">
                <el-input v-model="form.BeginningBalance"></el-input>
              </el-form-item>
            </div>
            <div class="clearfix">
              <el-form-item v-if="!IsEdit" label="建账日期" :label-width="formLabelWidth" prop="CreateAccountTime">
                <el-date-picker class="panel-body-input" type="date" placeholder="选择日期"
                                v-model="form.CreateAccountTime"></el-date-picker>
              </el-form-item>
              <el-form-item label="汇付商户号" :label-width="formLabelWidth" prop="HuifuMemberId">
                <el-input v-model="form.HuifuMemberId"></el-input>
              </el-form-item>
            </div>
            <div class="clearfix form-item-md">
              <el-form-item label="所属门店" :label-width="formLabelWidth" prop="Store">
                <el-select v-model="form.Store" multiple filterable placeholder="请选择">
                  <el-option
                    v-for="item in StoreOptions"
                    :key="item.KeyID"
                    :label="item.CompanyName"
                    :value="item.KeyID">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="clearfix" v-if="!IsBankType">
              <el-form-item label="上传图片" :label-width="formLabelWidth">
                <upload-file
                  ref="uploadFile"
                  :img-list="form.ImageUpload"
                  :max-length="1"
                  class="form-item-require"
                  notice="请上传微信/支付宝收钱码照片"
                ></upload-file>
              </el-form-item>
            </div>
            <div class="clearfix form-item-md">
              <el-form-item label="备注" :label-width="formLabelWidth" prop="Remark">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入备注"
                          v-model="form.Remark">
                </el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="onSubmit">保存</el-button>
        <el-button type="primary" @click="cancleSubmit">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { UploadFile } from '../../../../components/'
  import { InsertAccountInfo, UpdateAccountInfo, QueryAccountInfoCompanyList } from '../../../../api/finance'

  export default {
    name: 'EditAccountInfo',
    components: {
      UploadFile
    },
    data() {
      return {
        StoreOptions: [],
        SelectStores: [],
        modalVisibility: false,
        loading: false,
        form: {
          KeyID: '',
          AccountType: '1',
          AccountName: '',
          BankName: '',
          OpenBank: '',
          BeginningBalance: '',
          Account: '',
          CreateAccountTime: '',
          Store: [],
          HuifuMemberId: '',
          ImageUpload: [],
          Remark: ''
        },
        IsEdit: false,
        IsBankType: false,
        accountTypeList: [],
        formLabelWidth: '120px',
        rules: {
          AccountName: [
            { required: true, message: '请输入账户名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          BankName: [
            { required: true, message: '请输入银行名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          OpenBank: [
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          BeginningBalance: [
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          Account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 2, max: 22, message: '长度在 2 到 22 个字符', trigger: 'blur' }
          ],
          Store: [
            { required: true, message: '请选择分店', trigger: 'blur' }
          ],
          Remark: [
            { min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      open(editData) {
        this.loading = false
        this.initData(editData)
        this.modalVisibility = true
      },

      initData(editData) {
        QueryAccountInfoCompanyList().then(res => {
          if (res) {
            const resArr = res.Data.filter(item => {
              return !item.Status || editData.Store.includes(item.KeyID)
            })
            this.StoreOptions = resArr.map(item => {
              return {
                CompanyName: item.CompanyName,
                KeyID: item.KeyID
              }
            })
          }
          this.form = this.$deepCopy(editData)
          this.IsEdit = editData.KeyID > 0
          this.IsBankType = editData.AccountType === 1
          this.accountTypeList = this.$EnumData.getEnumListByKey('AccountType').map(item => {
            return {
              KeyID: item.Value,
              Name: item.Description
            }
          })
        })
      },

      close() {
        this.form = {
          AccountType: 1,
          AccountName: '',
          BankName: '',
          OpenBank: '',
          BeginningBalance: '',
          Account: '',
          CreateAccountTime: '',
          CompanyInfo: [],
          Store: [],
          HuifuMemberId: '',
          ImageUpload: [],
          Remark: ''
        }
        this.$refs.ruleForm.clearValidate()
        this.modalVisibility = false
      },

      toggleAccountType() {
        if (this.form.AccountType === 1) {
          this.IsBankType = true
        } else if (this.form.AccountType === 2 || this.form.AccountType === 3) {
          this.IsBankType = false
        }
      },

      getSubmitData() {
        const item = this.form
        const postData = {
          AccountType: item.AccountType,
          AccountName: item.AccountName,
          Account: item.Account,
          Store: item.Store,
          Remark: item.Remark,
          HuifuMemberId: item.HuifuMemberId
        }
        // 非银行账户不传银行名称和开户行,要传二维码照片
        if (!this.IsBankType) {
          postData.ImageUpload = item.ImageUpload
        } else {
          postData.BankName = item.BankName
          postData.OpenBank = item.OpenBank
        }
        if (this.IsEdit) {
          // 编辑时不修改期初余额和建账日期
          postData.KeyID = item.KeyID
        } else {
          postData.BeginningBalance = item.BeginningBalance
          postData.CreateAccountTime = item.CreateAccountTime
        }
        return postData
      },

      onSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.form.Store.length <= 0) {
              this.$message.error('请选择分店！')
            }
            this.loading = true
            const postData = this.getSubmitData()
            if (this.form.KeyID) {
              UpdateAccountInfo(postData).then(() => {
                postData.CompanyInfo = this.StoreOptions.filter(v =>
                  postData.Store.includes(v.KeyID))
                this.$emit('editAccountInfo', postData)
                this.$message({
                  message: '修改成功!',
                  type: 'success'
                })
                this.close()
              }).catch(() => {
                this.loading = false
              })
            } else {
              InsertAccountInfo(postData).then(response => {
                this.$emit('editAccountInfo', response.Data)
                this.$message({
                  message: '新增成功!',
                  type: 'success'
                })
                this.close()
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            this.$message.error('请注意输入格式！')
          }
        })
      },

      cancleSubmit() {
        this.close()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .account-form {
    height: 480px;
  }
  .select-store {
    width: 200px;
  }
</style>
