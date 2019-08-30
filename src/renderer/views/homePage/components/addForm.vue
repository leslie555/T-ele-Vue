<template>
  <el-dialog
    :visible.sync="addRemarkVisible"
    @close="dialogClose"
    title="新增待办"
    :center="true"
    width="380px"
    append-to-body
  >
    <el-form
      :model="form"
      inline
      label-position="right"
      label-width="80px"
      :rules="rules"
      ref="homePageAddForm"
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item label="时间" prop="contact">
            <el-date-picker type="datetime" placeholder="请选择时间" v-model="form.contact"></el-date-picker>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="6" v-model="form.remark"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitAddedForm">确 定</el-button>
      <el-button type="primary" @click="dialogClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { InsertMemo, EditMemo } from '@/api/homePage'
// , EditMemo

export default {
  name: 'addRemark',
  data() {
    return {
      type: 0,
      KeyID: '',
      form: {
        remark: '',
        contact: ''
      },
      addRemarkVisible: false,
      rules: {
        contact: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请填写备注', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    dialogClose() {
      this.addRemarkVisible = false
      // this.form.remark = ''
      // this.form.contact = ''
      this.$refs['homePageAddForm'].resetFields()
      this.$emit('close')
    },
    open(type, KeyID, form) {
      this.addRemarkVisible = true
      this.type = type
      this.KeyID = KeyID
      if (type === 2) {
        this.form.remark = form.Content
        this.form.contact = form.MemoTime
      }
    },
    submitAddedForm() {
      this.$refs['homePageAddForm'].validate(valid => {
        if (valid) {
          if (this.type === 1) {
            InsertMemo({
              MemoTime: this.form.contact,
              Content: this.form.remark
            }).then(response => {
              this.$message({
                message: '添加成功!',
                type: 'success'
              })
              this.$emit('changeData', this.form)
              this.dialogClose()
            })
          } else {
            EditMemo({
              MemoTime: this.form.contact,
              Content: this.form.remark,
              KeyID: this.KeyID
            }).then(response => {
              this.$message({
                message: '修改成功!',
                type: 'success'
              })
              this.$emit('changeData', this.form)
              this.dialogClose()
            })
          }
        } else {
          this.$message.error('请完整填写备忘录')
          return false
        }
      })
    }
  }
}
</script>
