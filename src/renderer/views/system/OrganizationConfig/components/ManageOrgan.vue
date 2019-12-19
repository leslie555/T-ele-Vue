<template>
  <el-dialog
    ref="dialog"
    :visible="manageOrganVisible"
    @close="dialogClose"
    append-to-body
    @open="handleOpen"
    :title="dialogTitle"
    :center="true"
    width="480px"
  >
    <div style="height:300px;">
      <el-scrollbar class="vertical-scroll">
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          :props="defaultOptions"
          node-key="KeyID"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
        ></el-tree>
      </el-scrollbar>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="handleConfirm">确 定</el-button>
      <el-button type="primary" @click="dialogClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // import { getTreeNodeByValue } from '@/utils/arrUtil/treeArr'
  import { ConfigurationByID, UpdateConfiguration } from '@/api/system'

  export default {
    props: {
      manageOrganVisible: Boolean,
      treeData: Array,
      EmployeeID: Number
    },
    name: 'ManageOrgan',
    data() {
      return {
        btnLoading: false,
        EmpLoading: false,
        defaultOptions: {
          label: 'SysName',
          value: 'KeyID'
        },
        dialogTitle: '配置管理的组织',
        defaultExpandedKeys: [],
        defaultCheckedKeys: [],
        oldOrgans: []
      }
    },
    methods: {
      dialogClose() {
        this.$emit('close')
      },
      handleOpen() {
        this.defaultExpandedKeys = this.treeData.reduce((pre, cur) => {
          return [...pre, ...cur.children.map(v => v.KeyID)]
        }, [])
        ConfigurationByID({
          KeyID: this.EmployeeID
        }).then(res => {
          this.$nextTick(() => {
            this.oldOrgans = res.Data
            const checked = res.Data.map(v => v.KeyID)
            this.$refs.tree.setCheckedKeys(checked)
            // this.defaultCheckedKeys = checked
          })
        })
      },
      handleConfirm() {
        this.btnLoading = true
        const nodes = this.$refs.tree.getCheckedNodes()
        if (nodes.length) {
          for (let i = 0; i < nodes.length - 1; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const pathArr = nodes[j].FullID.split('-')
              if (pathArr.includes(nodes[i].KeyID + '')) {
                nodes.splice(j, 1)
                j--
              }
            }
          }
        }
        const List = this.$DiffArrFn(this.oldOrgans, nodes, ['KeyID'])
        UpdateConfiguration({
          EmployeeID: this.EmployeeID,
          List: List.map(v => ({ KeyID: v.KeyID, ModifyStatus: v.ModifyStatus }))
        }).then(res => {
          this.btnLoading = false
          this.$message.success('配置成功')
          this.dialogClose()
        }).finally(() => {
          this.btnLoading = false
        })
      }
    }
  }
</script>
