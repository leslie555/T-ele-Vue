<template>
  <div>
    <el-dialog :title="typeList.typeName" width="800px" :center="true" :visible.sync="modalVisibility"
               append-to-body>
      <el-form ref="ruleForm" :model="form" :rules="rules" status-icon inline>
        <div class="dialog-container form-item-sm">
          <div class="clearfix">
            <el-form-item label="选择类别" :label-width="formLabelWidth" prop="CategoryName">
              <el-select v-model="form.CategoryID" placeholder="请选择">
                <el-option
                  v-for="item in columnList"
                  :key="item.KeyID"
                  :label="item.CategoryName"
                  :value="item.KeyID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌" :label-width="formLabelWidth" prop="BrandName">
              <el-input  v-model="form.BrandName"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="经销商" :label-width="formLabelWidth" prop="Distributor">
              <el-input type="text" v-model="form.Distributor" placeholder="请填写"></el-input>
            </el-form-item>
            <div>
              <el-form-item label="负责人姓名" :label-width="formLabelWidth" prop="PersonChargeName">
                <el-input type="text" v-model="form.PersonChargeName"></el-input>
              </el-form-item>
              <el-form-item label="负责人电话" :label-width="formLabelWidth" prop="PersonChargeTel">
                <el-input type="number" v-model="form.PersonChargeTel"> </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="clearfix form-item-md">
            <el-form-item label="备注" :label-width="formLabelWidth" prop="BZ">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入备注"
                        v-model="form.BZ" class="form-label-input">
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
         <el-button @click="cancleSubmit">取消</el-button>
        <el-button :loading="loading" type="primary" @click="onSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { AddSupplyCommodity, EditSupplyCommodity } from '@/api/purchase'

  export default {
    name: 'FixApplyAddDialog',
    data() {
      var checkTel = (rule, value, callback) => {
        const reg = /^1[3-9]\d{9}$/
        if (value === '') {
          callback(new Error('电话号码不能为空'))
        } else {
          if (!reg.test(value)) {
            callback(new Error('请输入正确的电话号码格式'))
          }
          callback()
        }
      }
      return {
        modalVisibility: false,
        loading: false,
        form: {
          CategoryName: '', // 类别
          BrandName: '', // 品牌
          Distributor: '', // 经销商
          PersonChargeName: '', // 负责人姓名
          PersonChargeTel: '', // 负责人电话
          BZ: '' // 备注
        },
        PersonChargeTel: '',
        typeList: {},
        columnList: [],
        formLabelWidth: '120px',
        rules: {
          BrandName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          Distributor: [
            { required: true, min: 2, max: 15, message: '请输入经销商名称', trigger: 'blur' }
          ],
          PersonChargeName: [
            { required: true, min: 2, max: 15, message: '请输入负责人姓名', trigger: 'blur' }
          ],
          PersonChargeTel: [
            { required: true, validator: checkTel, trigger: 'blur' }
          ],
          BZ: [
            { min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      open(editData, typeList, columnList) {
        this.loading = false
        this.form = this.$deepCopy(editData)
        // this.splitString()
        this.typeList = typeList
        this.columnList = this.$deepCopy(columnList)
        this.modalVisibility = true
      },
      close() {
        this.modalVisibility = false
      },
      splitString() {
        const stringArr = this.form.PersonChargeName.split(' ')
        this.PersonChargeTel = stringArr[stringArr.length - 1]
        this.PersonChargeName = stringArr[0]
      },
      onSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.form.KeyID) {
              EditSupplyCommodity(this.form).then((res) => {
                if (res.Code === 0 && res.Data === 1) {
                  console.log('修改成功res', res)
                  console.log('修改成功this.form', this.form)
                  this.$emit('editConfigInfo', this.form)
                  this.$message({
                    message: '修改成功!',
                    type: 'success'
                  })
                } else {
                  console.log('修改失败res', res)
                  this.$message({
                    message: '修改失败!',
                    type: 'error'
                  })
                }
                this.$refs.ruleForm.resetFields()
                this.close()
              }).catch(() => {
                this.loading = false
              })
            } else {
              AddSupplyCommodity(this.form).then(response => {
                console.log('新增成功', response)
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
        this.$refs.ruleForm.clearValidate()
        this.close()
      }
    }
  }
</script>

<style lang="scss" scoped>
.form-label-input {
  width: 532px;
}
</style>
