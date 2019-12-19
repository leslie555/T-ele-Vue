<template>
  <el-dialog title="审核" width="500px" :center="true" :visible.sync="modalVisibility"
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
          <!--<el-option label="通过" value="2" key="1"></el-option>-->
          <!--<el-option label="驳回" value="3" key="2"></el-option>-->
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
  import { BatchExcuteAudit } from '../../api/Approval'

  export default {
    name: 'ExcuteAudit',
    data() {
      return {
        modalVisibility: false,
        loading: false,
        auditData: {},
        ruleForm: {
          AuditStatus: '2',
          Remark: ''
        },
        AuditStatus: [{
          value: '2',
          label: '通过'
        }, {
          value: '3',
          label: '驳回'
        }],
        formLabelWidth: '100px'
      }
    },

    methods: {
      open(ids) {
        this.loading = false
        this.auditData = ids
        this.ruleForm.AuditStatus = '2'
        this.ruleForm.Remark = ''
        this.modalVisibility = true
      },

      close() {
        this.modalVisibility = false
      },

      onSubmit() {
        this.loading = true
        if (this.ruleForm.AuditStatus === '3' && this.ruleForm.Remark === '') {
          this.$message.error('驳回请填写备注！')
          this.loading = false
        } else {
          const param = []
          this.auditData.map(item => {
            param.push({
              AuditStatus: this.ruleForm.AuditStatus,
              AuditRemark: this.ruleForm.Remark,
              KeyID: item
            })
          })
          BatchExcuteAudit(param).then(() => {
            this.$emit('updateAudit', param)
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
