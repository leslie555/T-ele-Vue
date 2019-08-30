<template>
  <div>
    <el-dialog title="财务配置" width="800px" :center="true" :visible.sync="modalVisibility"
               append-to-body>
      <el-form ref="ruleForm" :model="form" :rules="rules" status-icon inline>
        <div class="dialog-container form-item-sm">
          <div class="clearfix">
            <el-form-item label="所属类别" :label-width="formLabelWidth" prop="PID">
              <el-select v-model="form.PID" placeholder="请选择">
                <el-option
                  v-for="item in columnList"
                  :key="item.KeyID"
                  :label="item.Name"
                  :value="item.KeyID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目名称" :label-width="formLabelWidth" prop="Name">
              <el-input  v-model="form.Name"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="金额(元)" :label-width="formLabelWidth" prop="Price">
            <el-input type="number" v-model="form.Price" min="1" v-positive="form.Price"></el-input>
          </el-form-item>
            <el-form-item label=" " :label-width="0" prop="IsReplace">
              <el-checkbox v-model="form.IsReplace">是否代收代缴</el-checkbox>
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
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="onSubmit">保存</el-button>
        <el-button type="primary" @click="cancleSubmit">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { AddBillItem } from '../../../../api/ownerBill'

  export default {
    name: 'EditFinancialConfig',

    data() {
      return {
        modalVisibility: false,
        loading: false,
        form: {
          PID: '',
          Name: '',
          Price: '',
          Remark: '',
          IsReplace: false
        },
        columnList: [],
        formLabelWidth: '120px',
        rules: {
          Name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          Remark: [
            { min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      open(editData, columnList) {
        this.loading = false
        this.form = this.$deepCopy(editData)
        this.columnList = this.$deepCopy(columnList)
        this.modalVisibility = true
      },

      close() {
        this.modalVisibility = false
      },

      onSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.form.KeyID) {
              AddBillItem(this.form).then(() => {
                this.$emit('editConfigInfo', this.form)
                this.$message({
                  message: '修改成功!',
                  type: 'success'
                })
                this.$refs.ruleForm.resetFields()
                this.close()
              }).catch(() => {
                this.loading = false
              })
            } else {
              // console.log(this.form)
              AddBillItem(this.form).then(response => {
                this.$emit('editConfigInfo', response.Data)
                this.$message({
                  message: '新增成功!',
                  type: 'success'
                })
                this.$refs.ruleForm.resetFields()
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
</style>
