<template>
  <div>
    <el-dialog :title="typeList.typeName" width="800px" :center="true" :visible.sync="modalVisibility" :destroy-on-close="false"
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
            <el-form-item label="项目名称" :label-width="formLabelWidth" prop="ProjectName">
              <el-input  v-model="form.ProjectName"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="型号" :label-width="formLabelWidth" prop="Model">
              <el-input type="text" v-model="form.Model"></el-input>
            </el-form-item>
            <el-form-item label="单位" :label-width="formLabelWidth" prop="Unit">
              <el-select v-model="form.Unit" placeholder="请选择" @change="HandleChange" v-if="form.Unit !== 11">
                <el-option
                  v-for="item in unitData"
                  :key="item.Key"
                  :label="item.Name"
                  :value="item.Key">
                </el-option>
              </el-select>
              <el-input type="text"
                :clearable="true" 
                v-model="UnitSelect"
                placeholder="请输入单位"
                autofocus
                v-else></el-input>
            </el-form-item>
            <el-form-item label="内部单价" :label-width="formLabelWidth" prop="InsidePrice">
              <el-input type="number" v-model="form.InsidePrice" v-positive="form.InsidePrice">
                <span slot="suffix">元</span>
              </el-input>
            </el-form-item>
            <el-form-item label="外部单价" :label-width="formLabelWidth" prop="ExternalPrice">
              <el-input type="number" v-model="form.ExternalPrice" v-positive="form.ExternalPrice">
                <span slot="suffix">元</span>
              </el-input>
            </el-form-item>
            
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
  import { AddRenovationApplyConfigue, EditRenovationApplyCon } from '@/api/purchase'

  export default {
    name: 'FixApplyAddDialog',

    data() {
      return {
        modalVisibility: false,
        loading: false,
        typeList: {},
        flag: false,
        form: {
          CategoryID: '',
          CategoryName: '', // 装修类别名称
          ProjectName: '', // 项目名称
          Model: '', // 型号
          Unit: '', // 单位
          InsidePrice: 0, // 内部单价
          ExternalPrice: 0, // 外部单价
          BZ: ''
        },
        UnitSelect: '',
        unitData: [],
        columnList: [],
        formLabelWidth: '120px',
        rules: {
          Unit: [
            { required: true, message: '请选择单位', trigger: 'blur' }
          ],
          ProjectName: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            { max: 20, message: '项目名称长度不能超过20个字符', trigger: 'blur' }
          ],
          // Model: [
          //   { min: 0, max: 20, message: '请输入型号', trigger: 'blur' }
          // ],
          InsidePrice: [
            { required: true, message: '长度在 0 到 20 位数字', trigger: 'blur' }
          ],
          ExternalPrice: [
            { required: true, message: '长度在 0 到 20 位数字', trigger: 'blur' }
          ],
          BZ: [
            { min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      HandleChange(index) {
        if (index === 11) {
          this.UnitSelect = ''
        }
        this.flag = true
        console.log('选择的form.Unit', this.form.Unit)
      },
      open(editData, typeList, columnList, unitData) {
        console.log('editData', editData)
        this.loading = false
        this.form = this.$deepCopy(editData)
        this.typeList = typeList
        this.columnList = this.$deepCopy(columnList)
        this.unitData = this.$deepCopy(unitData)
        this.modalVisibility = true
        console.log(this.form)
      },
      close() {
        this.modalVisibility = false
      },

      onSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.flag) {
              this.form.Unit = this.$EnumData.getEnumDesByValue('RenovationUnit', this.form.Unit)
              this.flag = false
              console.log(this.form.Unit)
            }
            if (this.form.KeyID) {
              if (this.UnitSelect) {
                // debugger
                this.form.Unit = this.UnitSelect
                console.log(this.UnitSelect)
                console.log(this.form.Unit)
              }
              EditRenovationApplyCon(this.form).then((response) => {
                //  this.form.Unit = this.$EnumData.getEnumValueByDes('RenovationUnit', this.form.Unit)
                console.log(this.form.Unit)
                console.log(this.form)
                if (response.Code === 0 && response.Data === 1) {
                  this.$emit('editConfigInfo', this.form)
                  this.$message({
                    message: '修改成功!',
                    type: 'success'
                  })
                  console.log('修改成功response', response)
                  console.log('修改成功this.form', this.form)
                } else {
                  this.$message({
                    message: '修改失败!',
                    type: 'error'
                  })
                  console.log('修改失败response', response)
                }
                this.$refs.ruleForm.resetFields()
                this.close()
              }).catch(() => {
                this.loading = false
              })
            } else {
              AddRenovationApplyConfigue(this.form).then(response => {
                if (response.Code === 0 && Object.keys(response.Data).length !== 0) {
                  this.$emit('editConfigInfo', response.Data)
                  this.$message({
                    message: '新增成功!',
                    type: 'success'
                  })
                } else {
                  console.log('新增失败', response)
                  this.$message({
                    message: '新增失败!',
                    type: 'error'
                  })
                }
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
