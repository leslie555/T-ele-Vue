<template>
  <el-dialog :title="title" width="500px" :center="true" :visible.sync="modalVisibility"
             append-to-body>
    <el-form :model="ruleForm" ref="ruleForm">
      <el-form-item label="操作" :label-width="formLabelWidth" prop="AuditStatus">
        <el-select v-model="ruleForm.AuditStatus" placeholder="请选择" value="">
          <el-option
            v-for="item in AuditStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="clearfix form-item-md">
        <el-form-item label="备注" :label-width="formLabelWidth" prop="Remark">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入备注"
                    v-model="ruleForm.Remark">
          </el-input>
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
  import { ExcuteAudit } from '@/api/export'

  export default {
    name: 'ExcuteAudit',
    data() {
      return {
        modalVisibility: false,
        title: '审核',
        loading: false,
        auditKeyID: '',
        ruleForm: {
          AuditStatus: 2,
          Remark: ''
        },
        AuditStatus: [{
          value: 2,
          label: '通过'
        }, {
          value: 4,
          label: '驳回'
        }],
        formLabelWidth: '100px'
      }
    },

    methods: {
      open(ids, isAudit) {
        this.loading = false
        this.auditKeyID = ids
        if (isAudit === 'reAudit') {
          this.title = '复核'
        }
        this.ruleForm.AuditStatus = 2
        this.ruleForm.Remark = ''
        this.modalVisibility = true
      },

      close() {
        this.modalVisibility = false
      },

      onSubmit() {
        this.loading = true
        let myStatus
        if (this.ruleForm.AuditStatus === 4 && this.ruleForm.Remark === '') {
          this.$message.error('驳回请填写备注！')
          this.loading = false
        } else {
          if (this.title === '复核' && this.ruleForm.AuditStatus === 2) {
            // this.ruleForm.AuditStatus = 3
            myStatus = 3
          }
          const param = {
            ProgressAuditStatus: myStatus === 3 ? myStatus : this.ruleForm.AuditStatus,
            AuditRemark: this.ruleForm.Remark,
            ExportApplicationID: this.auditKeyID
          }
          ExcuteAudit(param).then(({ Data }) => {
            this.$emit('updateAudit', param, Data.AuditorName)
            this.$message({
              message: '审核成功！',
              type: 'success'
            })
            this.close()
          }).catch(() => {
            this.loading = false
            // this.$message.error('审核失败！')
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
