<template>
  <div>
    <el-dialog
      title="新增回访"
      @open="handleOpen"
      @closed="handleClosed"
      :visible.sync="showFormDialog"
      append-to-body
      width="680px"
    >
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="回访结果" prop="ReturnVisitResult">
            <el-select v-model="ruleForm.ReturnVisitResult" placeholder="请选择">
              <el-option
                v-for="item in ReturnVisitResult"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="回访备注" prop="Remarks">
            <el-input
              type="textarea"
              v-model="ruleForm.Remarks"
              placeholder="请填写备注"
              :autosize="{ minRows: 4, maxRows: 6}"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取消</el-button>
        <el-button type="primary" @click="handleAdd" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { InsertContractReturnVisit } from '@/api/tenant'
export default {
  name: 'NewVisitDialog',
  data() {
    return {
      showFormDialog: false,
      addLoading: false,
      ContractID: 0,
      HouseID: 0,
      Type: '',
      ReturnVisitResult: [
        { label: '违约', value: '1' },
        { label: '续约', value: '2' },
        { label: '退房', value: '3' },
        { label: '不续约', value: '4' },
        { label: '日常回访', value: '5' }
      ],
      ruleForm: {
        ReturnVisitResult: '',
        Remarks: ''
      },
      rules: {
        ReturnVisitResult: {
          required: true, message: '请选择', trigger: 'change'
        },
        Remarks: {
          required: true, message: '请填写备注', trigger: 'blur'
        }
      }
    }
  },
  methods: {
    handleOpen() {
      // console.log('handleOpen:')
    },
    handleAdd() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.addLoading = true
          // 调新增接口
          InsertContractReturnVisit({
            HouseID: this.Type ? this.HouseID : '',
            ContractID: this.ContractID,
            ContractType: this.Type,
            ReturnVisitResult: this.ruleForm.ReturnVisitResult, // 回访结果
            Remarks: this.ruleForm.Remarks // 回访备注
          }).then(res => {
            this.showFormDialog = false
            this.$emit('addTableInfo', this.ruleForm, this.ContractID, this.Type)
            this.$refs['ruleForm'].resetFields()
            this.$message({
              message: '新增成功!',
              type: 'success'
            })
            this.addLoading = false
            console.log('新增res:', res)
          })
        } else {
          return false
        }
      })
      // console.log('handleAdd:')
    },
    handleClosed() {
      // console.log('handleClosed:')
    },
    open(item) {
      this.showFormDialog = true
      this.ContractID = item.KeyID
      this.HouseID = item.HouseID
      this.Type = item.Type
      // if (!item.Type) {
      //   console.log('业主新增:')
      // } else {
      //   console.log('租客新增:')
      // }
      // console.log('item:', item)
    },
    close() {
      this.$refs['ruleForm'].resetFields()
      this.showFormDialog = false
      // console.log('close:')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>