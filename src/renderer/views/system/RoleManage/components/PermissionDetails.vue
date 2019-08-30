<template>
  <div>
    <el-dialog v-loading="loading" title="权限管理" width="700px" @open="handleDialogOpen" append-to-body :center="true" @close="closeDialog" :visible="detailsVisible">
      <div class="permission-detail-wrap">
        <el-scrollbar class="vertical-scroll">
          <el-form :model="form" label-position="top" label-width="90px">
            <el-form-item label="权限名称" :required="true" :label-width="formLabelWidth">
              <span>{{editingData.RoleName}}</span>
            </el-form-item>
            <el-form-item label="权限内容" :required="true" :label-width="formLabelWidth">
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="parentName" label="菜单" width="80">
                </el-table-column>
                <el-table-column prop="ModuleName" label="模块" width="100">
                </el-table-column>
                <el-table-column class-name="action" label="按钮">
                  <template slot-scope="scope">
                    <span v-for="action in scope.row.ActionList" :key="action.KeyID">{{ action.ActionName }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllModuleByRoleID } from '@/api/system'
  export default {
    name: 'permissionDetails',
    props: {
      editingData: Object,
      detailsVisible: Boolean
    },
    data() {
      return {
        loading: false,
        formLabelWidth: '60px',
        form: {},
        tableData: []
      }
    },
    methods: {
      confirm() {
        this.closeDialog()
      },
      closeDialog() {
        this.$emit('close')
      },
      handleDialogOpen() {
        this.loading = true
        getAllModuleByRoleID({ RoleID: this.editingData.KeyID }).then(res => {
          const action = res.Data.Action
          const mod = res.Data.Module.filter(v => v.PID)
          const menu = res.Data.Module.filter(v => !v.PID)
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
            }
          })
          this.tableData = mod
        })
        this.loading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .permission-detail-wrap {
    height: 500px;
    .action {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      span {
        margin-right: 10px;
      }
    }
  }
</style>
