<template>
  <el-dialog title="审核" width="500px" :center="true" :visible.sync="modalVisibility"
             append-to-body>
    <el-form :model="ruleForm" ref="ruleForm">
      <el-form-item label="审批操作" :label-width="formLabelWidth" prop="AuditStatus">
        <el-select v-model="ruleForm.ApprovalStatus" placeholder="请选择" value="">
          <el-option
            v-for="item in AuditStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="提交给" :label-width="formLabelWidth" prop="apply" v-show="ruleForm.ApprovalStatus">
          <el-select v-model="ruleForm.SubmissionDepartment" placeholder="请选择" value="">
            <el-option
              v-for="item in apply"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      <div class="clearfix form-item-md">
        <el-form-item label="备注" :label-width="formLabelWidth" prop="Remark">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入备注"
                    v-model="ruleForm.ApprovalBZ">
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
  import { ApprovalRenovationApplication } from '@/api/house'

  export default {
    name: 'ExcuteAudit',
    data() {
      return {
        modalVisibility: false,
        loading: false,
        auditData: {},
        ruleForm: {
          SubmissionDepartment: 1,
          ApprovalStatus: 1,
          ApprovalBZ: '',
          KeyID: '',
          HouseKey: ''
        },
        AuditStatus: [{
          value: 1,
          label: '通过'
        }, {
          value: 0,
          label: '驳回'
        }],
        apply: [{
          value: 1,
          label: '采购部'
        }],
        formLabelWidth: '100px'
      }
    },
    methods: {
      open(KeyID, HouseKey) {
        // debugger
        this.loading = false
        this.ruleForm.SubmissionDepartment = 1
        this.ruleForm.ApprovalStatus = 1
        this.ruleForm.ApprovalBZ = ''
        this.ruleForm.KeyID = KeyID
        this.ruleForm.HouseKey = HouseKey
        this.modalVisibility = true
      },

      close() {
        this.modalVisibility = false
      },

      onSubmit() {
        this.loading = true
        const KeyID = this.ruleForm.KeyID
        const type = this.ruleForm.ApprovalStatus
        // debugger
        if (type === 0 && this.ruleForm.ApprovalBZ === '') {
          this.$message.error('驳回请填写备注！')
          this.loading = false
        } else if (this.ruleForm.SubmissionDepartment === '') {
          this.$message.error('驳回请填写提交部门！')
          this.loading = false
        } else {
          const SubmissionDepartment = this.ruleForm.ApprovalStatus === 0 ? 0 : 1
          const param = { ...this.ruleForm, SubmissionDepartment }
          ApprovalRenovationApplication(param).then((res) => {
            if (res.Data === 1) {
              this.$emit('approval', KeyID, type)
              this.$message({
                message: '审核成功！',
                type: 'success'
              })
              this.close()
            } else {
              this.$message.error(`审核失败: ${res.Msg || ''}`)
              this.close()
            }
          }).catch((res) => {
            // console.log('res.Msg :', res.Msg)
            this.loading = false
            this.$message.error('审核失败！')
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
