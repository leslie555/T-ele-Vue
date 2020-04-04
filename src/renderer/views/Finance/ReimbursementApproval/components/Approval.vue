<template>
  <el-dialog title="审核" width="500px" :center="true" :visible.sync="modalVisibility" append-to-body>
    <el-form :model="ruleForm" ref="ruleForm">
      <el-form-item label="操作" :label-width="formLabelWidth" prop="Status">
        <el-select v-model="ruleForm.Status" placeholder="请选择" value>
          <el-option
            v-for="item in Status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
          <!--<el-option label="通过" value="2" key="1"></el-option>-->
          <!--<el-option label="驳回" value="3" key="2"></el-option>-->
        </el-select>
      </el-form-item>
      <div class="clearfix form-item-md">
        <el-form-item label="备注" :label-width="formLabelWidth" prop="ExamineRemark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="请输入备注"
            v-model="ruleForm.ExamineRemark"
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
  import { ExamineReimbursement } from '../../../../api/finance'

  export default {
    name: 'ExcuteAudit',
    data() {
      return {
        modalVisibility: false,
        loading: false,
        KeyID: '',
        ruleForm: {
          Status: 4,
          ExamineRemark: ''
        },
        Status: [
          {
            value: 4,
            label: '通过'
          },
          {
            value: 3,
            label: '驳回'
          }
        ],
        formLabelWidth: '100px'
      }
    },

    methods: {
      open(ids) {
        this.loading = false
        this.KeyID = ids
        this.ruleForm.Status = 4
        this.ruleForm.ExamineRemark = ''
        this.modalVisibility = true
      },

      close() {
        this.modalVisibility = false
      },

      onSubmit() {
        this.loading = true
        if (this.ruleForm.Status === 3 && this.ruleForm.ExamineRemark === '') {
          this.$message.error('驳回请填写备注！')
          this.loading = false
        } else {
          const param = { ...this.ruleForm, KeyID: this.KeyID }
          ExamineReimbursement(param)
            .then(() => {
              this.$emit('updateAudit', param)
              this.$message({
                message: '审核成功！',
                type: 'success'
              })
              this.close()
            })
            .catch(() => {
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
