<template>
  <el-dialog
    ref="dialog"
    :visible="addDepartmentVisible"
    append-to-body
    @close="dialogClose"
    @closed="handleClosed"
    :title="dialogTitle"
    @open="handleOpen"
    :center="true"
    width="400px"
  >
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      inline
      label-position="right"
      label-width="80px"
      status-icon
    >
      <div class="dialog-container form-item-sm">
        <el-form-item label="部门名称" prop="DepartmentName">
          <el-input v-model="form.DepartmentName" :maxlength="20" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="组织架构" prop="structure">
          <el-cascader
            expand-trigger="hover"
            :change-on-select="true"
            separator=">"
            :disabled="disabled"
            :options="tree"
            :props="defaultOptions"
            v-model="form.structure"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="submitAddedForm">确 定</el-button>
      <el-button type="primary" @click="dialogClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    addDepartmentData,
    editDepartmentData,
    SelectBusinessDepList
  } from '@/api/system'
  import { findNodeByArr } from '@/utils/getStructure/findNodeByArr'
  import getStructure from '@/utils/getStructure'
  export default {
    props: {
      addDepartmentVisible: Boolean,
      editingData: Object
    },
    name: 'addDeparment',
    data() {
      return {
        btnLoading: false,
        form: {
          DepartmentName: '',
          structure: []
        },
        tree: [],
        defaultOptions: {
          value: 'id'
        },
        dialogTitle: '',
        disabled: false,
        rules: {
          DepartmentName: [{
            required: true,
            message: '部门名称不能为空',
            trigger: 'blur'
          }],
          structure: [{
            required: true,
            type: 'array',
            message: '组织架构不能为空',
            trigger: 'change'
          }]
        }
      }
    },
    computed: {
      userinfo() {
        return this.$store.getters.userinfo
      }
    },
    methods: {
      dialogClose() {
        this.$emit('close')
      },
      handleClosed() {
        this.form = {
          DepartmentName: '',
          structure: []
        }
      },
      submitAddedForm() {
        const _this = this
        this.$refs.form.validate(valid => {
          if (valid) {
            console.log(_this)
            this.btnLoading = true
            const idStr = this.form.FullID
            const idArr = idStr.match(/\d+-/g) // idStr: eg:1-1.2-23.24-
            debugger
            this.form.BusinessID = parseInt(idArr[0])
            this.form.CorporationID = parseInt(idArr[1])
            if (isNaN(this.form.CorporationID)) { // 公司ID不存在表示该部门直属企业下
              this.form.CorporationID = 0
              this.form.PID = this.form.BusinessID
            }
            this.form.PID = parseInt(idStr.match(/\d+.$/)[0])
            // debugger
            if (this.isEdit) {
              this.form.FullID += this.form.KeyID
              editDepartmentData(this.form).then(res => {
                this.dialogClose()
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$emit('editedDepartment', this.form)
              }).catch(res => {
                this.btnLoading = false
              })
            } else {
              this.form.FullID += '*'
              addDepartmentData(this.form).then(res => {
                this.dialogClose()
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.$emit('addedDepartment', res.Data)
              }).catch(res => {
                this.btnLoading = false
              })
            }
          }
        })
      },
      handleOpen() {
        this.btnLoading = false
        this.isEdit = Object.keys(this.editingData).length
        if (this.isEdit) {
          this.dialogTitle = '修改部门'
          this.disabled = true
          this.form = this.$deepCopy(this.editingData)
          this.form.structure = this.form.FullID.match(/\d+/g).map(v => +v)
          this.form.structure.pop()
        } else {
          this.dialogTitle = '新增部门'
          this.disabled = false
          this.$nextTick(() => {
            this.$refs.form.clearValidate()
          })
        }
        SelectBusinessDepList({ BusinessID: this.userinfo.BusinessID, Type: 3 }).then(res => {
          const bus = res.Data.Bus
          const structure = getStructure(res.Data.ComList, res.Data.DepList)
          this.tree = [{
            id: bus.KeyID,
            label: bus.BusinessName,
            fullID: bus.KeyID,
            type: 'BusinessID',
            children: structure
          }]
          if (this.form.structure.length) {
            // 如果默认有组织架构,执行一次选择组织架构的函数
            this.handleChange(this.form.structure)
          }
        })
      },
      getFullID(structArr) {
        let isFirst = true
        let flag = true
        if (!this.tree.length) return
        const node = findNodeByArr(this.tree, structArr, node => {
          if (node.type === 'BusinessID') {
            this.form.FullID = node.id + ''
          } else if (node.type === 'CompanyID') {
            this.form.CorporationName = node.label // 获取到最后一级的公司的名字
            if (isFirst) {
              this.form.FullID += '-' + node.id
              isFirst = false
            } else {
              this.form.FullID += '.' + node.id
            }
          } else {
            if (flag) {
              this.form.FullID += '-' + node.id
              flag = false
            } else {
              this.form.FullID += '.' + node.id
            }
          }
        })
        if (node.type === 'CompanyID') {
          this.form.FullID += '-'
        } else if (node.type === 'BusinessID') {
          this.form.FullID += '-'
        } else {
          this.form.FullID += '.'
        }
      },
      handleChange(val) {
        this.form.FullID = ''
        this.getFullID(val)
      }
    }
  }
</script>
