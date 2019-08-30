<template>
  <el-dialog
    title="充值"
    :visible.sync="isShowDialog"
    @close="closeDialog"
    width="500px"
    center
    append-to-body
  >
    <el-form
      :model="addForm"
      label-width="90px"
      label-position="right"
      :inline="true"
      :rules="rules"
      ref="CalcAddForm"
    >
      <div class="dialog-box form-item-sm">
        <el-form-item label="金额" prop="Price">
          <el-input v-model="addForm.Price" v-positive="addForm.Price" type="number"></el-input>&emsp;元
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="submitForm" type="primary" :loading="btnLoading">充值</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { Recharge } from '@/api/calculate'
export default ({
  name: 'MoneyUse',
  data() {
    return {
      isShowDialog: false,
      btnLoading: false,
      KeyID: '',
      addForm: {
        Price: ''
      },
      rules: {
        Price: [
          { required: true, message: '请填写充值金额', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open(KeyID) {
      this.KeyID = KeyID
      this.isShowDialog = true
      this.btnLoading = false
    },
    closeDialog() {
      this.$refs['CalcAddForm'].resetFields()
      this.isShowDialog = false
      this.btnLoading = false
    },
    submitForm() {
      this.$refs['CalcAddForm'].validate(valid => {
        if (valid) {
          Recharge({
            RechargeAmount: this.addForm.Price,
            KeyID: this.KeyID
          }).then(response => {
            this.$message({
              message: '充值成功',
              type: 'success'
            })
            this.$emit('RechargeSuccess', { num: response.Data, KeyID: this.KeyID })
          })
          this.$refs['CalcAddForm'].resetFields()
          this.closeDialog()
        }
      })
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
