<template>
  <el-dialog title="房源配置" width="800px" :center="true" :visible.sync="dialogFormVisible"
             append-to-body>
    <el-scrollbar class="vertical-scroll">
      <el-form class="config-form" ref="form" :model="form" :rules="rules" status-icon inline>
        <div class="dialog-container form-item-sm">
          <div class="clearfix">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="EquipmentName">
              <el-input v-model="form.EquipmentName"></el-input>
            </el-form-item>
            <el-form-item label="类型" :label-width="formLabelWidth" prop="EquipmentType">
              <el-select v-model="form.EquipmentType" placeholder="请选择" value="">
                <el-option
                  v-for="item in EquipmentType"
                  :key="item.Value"
                  :label="item.Description"
                  :value="item.Value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="clearfix">
            <el-form-item label="数量" :label-width="formLabelWidth" prop="EquipmentNumber">
              <el-input type="number"
                        v-positive.int="form.EquipmentNumber"
                        :min="MoveOutNumber"
                        v-model="form.EquipmentNumber"
              ></el-input>
            </el-form-item>
            <el-form-item label="单价" :label-width="formLabelWidth" prop="SingleDirectCost">
              <el-input type="number"
                        v-positive="form.SingleDirectCost"
                        :min="1"
                        v-model="form.SingleDirectCost"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="上传图片" :label-width="formLabelWidth">
            <upload-file
              ref="uploadFile"
              :img-list="form.EquImgList"
              class="form-item-require"
              notice="请上传房屋设备照片"
            ></upload-file>
          </el-form-item>
          <div class="clearfix form-item-md">
            <el-form-item label="备注" :label-width="formLabelWidth" prop="BZ">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入备注"
                        v-model="form.BZ">
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" element-loading-text="保存中" type="primary" @click="onSubmit">保存</el-button>
      <el-button type="primary" @click="cancleSubmit">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { UploadFile } from '../../../../../components/'
  import { addequipment, editEquipment } from '../../../../../api/house'

  export default {
    name: 'EditHouseConfig',
    components: {
      UploadFile
    },

    data() {
      return {
        form: {},
        loading: false,
        dialogFormVisible: false,
        MoveOutNumber: 0,
        formLabelWidth: '120px',
        rules: {
          EquipmentName: [
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
          ],
          BZ: [
            { min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'change' }
          ]
        }
      }
    },

    computed: {
      EquipmentType() {
        return this.$EnumData.getEnumListByKey('EquipmentType')
      }
    },

    methods: {
      open(editData) {
        this.loading = false
        this.form = this.$deepCopy(editData)
        // 计算已搬出数量，限定修改的总数不能小于已搬出数量
        this.MoveOutNumber = this.form.EquipmentNumber - this.form.ResidueNumber
        this.dialogFormVisible = true
      },

      close() {
        this.dialogFormVisible = false
      },

      onSubmit() {
        this.loading = true
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const postData = Object.assign({}, this.form)
            postData.EquipmentImg = this.form.EquImgList.map(item => {
              return item.KeyID
            }).join(',')
            if (this.form.KeyID) {
              editEquipment(postData).then(() => {
                this.$emit('editConfigInfo', postData)
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$refs.form.resetFields()
                this.close()
              }).catch(() => {
                this.loading = false
              })
            } else {
              addequipment(postData).then(response => {
                this.$emit('editConfigInfo', response.Data)
                this.loading = false
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.$refs.form.resetFields()
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
        this.$refs.form.resetFields()
        this.close()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .config-form {
    height: 480px;
  }
</style>
