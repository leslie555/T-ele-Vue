<template>
  <el-dialog title="审核" width="500px" :center="true" :visible.sync="modalVisibility" append-to-body>
    <el-form :model="ruleForm" ref="ruleForm">
      <el-form-item label="操作" :label-width="formLabelWidth" prop="Operation">
        <el-select v-model="ruleForm.Operation" placeholder="请选择" value>
          <el-option
            v-for="item in AuditStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="clearfix form-item-md">
        <el-form-item label="备注" :label-width="formLabelWidth" prop="AuditRemark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="请输入备注"
            v-model="ruleForm.AuditRemark"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="onSubmit">保存</el-button>
      <el-button type="primary" @click="cancleSubmit">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { CGBApprovalOperation } from '@/api/purchase'

  export default {
    name: 'AddApproval',
    data() {
      return {
        modalVisibility: false,
        loading: false,
        auditData: {},
        ruleForm: {
          Operation: 1,
          AuditRemark: ''
        },
        AuditStatus: [{
          value: 1,
          label: '通过'
        }, {
          value: 2,
          label: '驳回'
        }],
        formLabelWidth: '100px'
      }
    },

    methods: {
      open(param) {
        this.loading = false
        Object.assign(this.ruleForm, param)
        this.ruleForm.Operation = 1
        this.ruleForm.AuditRemark = ''
        this.modalVisibility = true
      },

      close() {
        this.modalVisibility = false
      },

      onSubmit() {
        this.loading = true
        if (this.ruleForm.Operation === 2 && this.ruleForm.Remark === '') {
          this.$message.error('驳回请填写备注！')
          this.loading = false
        } else {
          CGBApprovalOperation(this.ruleForm).then(() => {
            this.$emit('updateAudit', this.ruleForm.Operation)
            this.$message({
              message: '审核成功！',
              type: 'success'
            })
            this.close()
          }).catch(() => {
            this.loading = false
          })
        }
      },

      cancleSubmit() {
        this.close()
      }
    }
  }
</script>

<style scoped>
</style>
