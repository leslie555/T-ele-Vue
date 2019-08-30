<template>
  <div class="dialog-container">
    <el-dialog
      title="权限管理"
      @open="handleDialogOpen"
      append-to-body
      @close="handleDialogClose"
      width="700px"
      :center="true"
      :visible="addPVisible"
    >
      <div class="add-permission-container">
        <el-scrollbar class="vertical-scroll">
          <el-form
            :model="form"
            label-position="top"
            label-width="90px"
            ref="form"
            :rules="rules"
            status-icon
          >
            <div class="clearfix form-item-lg">
              <el-form-item label="权限名称" prop="RoleName" :maxlength="20">
                <el-input placeholder="请输入权限名称" v-model="form.RoleName"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="权限内容" :required="true">
              <el-table :data="PTableData" border style="width: 100%">
                <el-table-column prop="parentName" label="菜单" width="80"></el-table-column>
                <el-table-column width="120">
                  <template slot="header" slot-scope="slot">
                    <el-checkbox v-model="checkAllMod" @change="handleCheckAllModChange">模块</el-checkbox>
                  </template>
                  <template slot-scope="scope">
                    <el-checkbox
                      :label="scope.row.KeyID"
                      v-model="checkedMod"
                      @change="handleModuleChange(scope.row)"
                    >{{scope.row.ModuleName}}</el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot="header" slot-scope="slot">
                    <el-checkbox v-model="checkAllAction" @change="handleCheckAllActionChange">按钮</el-checkbox>
                  </template>
                  <template slot-scope="scope">
                    <div class="role-checkbox">
                      <el-checkbox
                        v-if="scope.row.ActionList"
                        :indeterminate="scope.row.isIndeterminate"
                        v-model="scope.row.checkAll"
                        @change="handleCheckAllChange(scope.row)"
                      >全选</el-checkbox>
                      <el-checkbox-group
                        v-model="scope.row.checkedAction"
                        @change="handlePermissionsChange(scope.row)"
                      >
                        <el-checkbox
                          v-for="action in scope.row.ActionList"
                          :label="action.KeyID"
                          :key="action.KeyID"
                        >{{action.ActionName}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="submitAddedForm">确 定</el-button>
        <el-button type="primary" @click="handleDialogClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getPermissionDetails } from '@/api/system'
import { getAllModule, getAllModuleByRoleID, saveRole } from '@/api/system'
// import { sessionStorage } from '@/utils/storage'
export default {
  name: 'addPermission',
  props: {
    editingData: Object,
    addPVisible: Boolean
  },
  data() {
    return {
      btnLoading: false,
      form: {},
      rules: {
        RoleName: [
          {
            required: true,
            message: '权限名称不能为空',
            trgger: 'blur'
          }
        ]
      },
      formLabelWidth: '40px',
      PTableData: null,
      checkedMod: [],
      oldRoleData: null,
      checkAllMod: false,
      checkAllAction: false,
      menuID: [] // 所有菜单的ID数组
    }
  },
  methods: {
    submitAddedForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          const newAction = this.PTableData.reduce((pre, cur) => {
            if (cur.checkedAction) {
              pre.push(...cur.checkedAction)
            }
            return pre
          }, []).map(v => {
            return { KeyID: v }
          })
          const newMod = this.checkedMod.map(v => {
            return { KeyID: v }
          })
          newMod.push(...this.menuID) // 将所有菜单的ID添加到已选的模块权限中
          this.form.Action = newAction
          this.form.Module = newMod
          if (this.isEdit) {
            const oldAction = this.oldRoleData.Action.map(v => {
              return { KeyID: v.KeyID }
            })
            const oldMod = this.oldRoleData.Module.map(v => {
              return { KeyID: v.KeyID }
            })
            this.form.Action = this.$DiffArrFn(oldAction, newAction, ['KeyID'])
            this.form.Module = this.$DiffArrFn(oldMod, newMod, ['KeyID'])
          }
          saveRole({ jurisdiction: JSON.stringify(this.form) }).then(res => {
            const ID = res.Data
            if (this.isEdit) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$emit('editedRole', this.form)
            } else {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.form.KeyID = ID
              this.$emit('addedRole', this.form)
            }
            this.handleDialogClose()
          }).catch(res => {
            this.btnLoading = false
          })
        }
      })
    },
    handleModuleChange(row) {
      this.checkAllMod = this.checkedMod.length === this.PTableData.length
      if (row.checkAll !== undefined) {
        row.checkAll = this.checkedMod.includes(row.KeyID)
      }
      if (row.ActionList) {
        this.handleCheckAllChange(row)
      }
    },
    handleCheckAllChange(row) {
      this.checkAllAction =
        this.PTableData.filter(v => v.checkAll).length ===
        this.PTableData.filter(v => v.checkAll !== undefined).length
      if (row.checkAll) {
        if (!this.checkedMod.includes(row.KeyID)) {
          // 选中的模块数组没有这个模块才添加进去
          this.checkedMod.push(row.KeyID)
        }
        row.checkedAction = row.ActionList.map(val => {
          return val.KeyID
        })
      } else {
        row.checkedAction = []
      }
      this.checkAllMod = this.checkedMod.length === this.PTableData.length
      row.isIndeterminate = false
    },
    handlePermissionsChange(row) {
      if (row.checkedAction && row.checkedAction.length) {
        const checkedCount = row.checkedAction.length
        if (!this.checkedMod.includes(row.KeyID)) {
          this.checkedMod.push(row.KeyID)
        }
        row.checkAll = checkedCount === row.ActionList.length
        row.isIndeterminate =
          checkedCount > 0 && checkedCount < row.ActionList.length
      } else {
        row.checkAll = false
        row.isIndeterminate = false
      }
      this.checkAllAction =
        this.PTableData.filter(v => v.checkAll).length ===
        this.PTableData.filter(v => v.checkAll !== undefined).length
      this.checkAllMod = this.checkedMod.length === this.PTableData.length
    },
    handleCheckAllModChange(val) {
      if (val) {
        this.checkedMod = this.PTableData.map(v => v.KeyID)
        this.PTableData.forEach(v => {
          this.handleModuleChange(v)
        })
      } else {
        this.checkedMod = []
        this.PTableData.forEach(v => {
          this.handleModuleChange(v)
        })
      }

      this.checkAllMod = this.checkedMod.length === this.PTableData.length
    },
    handleCheckAllActionChange(v) {
      if (v) {
        this.PTableData.forEach(val => {
          if (val.checkAll !== undefined) {
            val.checkAll = true
            this.handleCheckAllChange(val)
          } else {
            if (!this.checkedMod.includes(val.KeyID)) {
              // 选中的模块数组没有这个模块才添加进去
              this.checkedMod.push(val.KeyID)
            }
            this.handleModuleChange(val)
          }
        })
      } else {
        this.PTableData.forEach(val => {
          if (val.checkAll !== undefined) {
            val.checkAll = false
            this.handleCheckAllChange(val)
          }
        })
      }
      this.checkAllMod = this.checkedMod.length === this.PTableData.length
    },
    handleDialogOpen() {
      this.btnLoading = false
      this.isEdit = !!Object.keys(this.editingData).length
      this.checkedMod = []
      this.checkAllMod = false
      this.checkAllAction = false
      this.PTableData.forEach(val => {
        if (val.checkAll !== undefined) {
          val.checkAll = false
        }
        val.checkedAction = []
      })
      if (this.isEdit) {
        this.form = {
          RoleID: this.editingData.KeyID,
          RoleName: this.editingData.RoleName
        }
        getAllModuleByRoleID({
          RoleID: this.editingData.KeyID
        }).then(res => {
          this.oldRoleData = res.Data
          const action = res.Data.Action.map(v => v.KeyID)
          const mod = res.Data.Module.map(v => v.KeyID)
          this.PTableData.forEach(val => {
            if (mod.includes(val.KeyID)) {
              this.checkedMod.push(val.KeyID)
              if (val.ActionList) {
                val.checkedAction = val.ActionList.filter(v => {
                  return action.includes(v.KeyID)
                }).map(v => v.KeyID)
                this.handlePermissionsChange(val) // 解决全选和半选没有勾上的问题
              }
            }
          })
        })
      } else {
        this.form = {
          RoleName: this.editingData.RoleName
        }
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleDialogClose() {
      this.$emit('close')
    }
  },
  created() {
    getAllModule().then(res => {
      const action = res.Data.Action
      const mod = res.Data.Module.filter(v => v.PID)
      const menu = res.Data.Module.filter(v => !v.PID)
      this.menuID = menu.map(v => { return { KeyID: v.KeyID } })
      mod.forEach(val => {
        val.parentName = menu.find(v => v.KeyID === val.PID).ModuleName
      })
      action.forEach((val, index) => {
        const idx = mod.findIndex(v => {
          return v.KeyID === +val.ModuleID
        })
        if (idx !== -1) {
          mod[idx].ActionList = mod[idx].ActionList ? mod[idx].ActionList : []
          mod[idx].ActionList.push(action[index])
          mod[idx].checkedAction = []
          mod[idx].isIndeterminate = false
          mod[idx].checkAll = false
        }
      })
      this.PTableData = mod
      console.log(JSON.parse(JSON.stringify(this.PTableData)))
    })
  }
}
</script>

<style lang="scss">
.add-permission-container {
  height: 500px;
  .role-checkbox {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    .el-checkbox-group {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      .el-checkbox {
        margin-left: 20px;
      }
    }
  }
}
</style>
