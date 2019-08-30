<template>
  <el-dialog
    title="修改审批配置"
    width="700px"
    center
    append-to-body
    :visible="editBoxVisible"
    @open="handleOpen"
    @close="closeDialog"
  >
    <div class="aprproval-config">
      <div class="bussiness-type">业务类型: {{BusinessType}}</div>
      <div class="select-containter">
        <div class="approver-selecting">
          <p class="select-title">请选择审核人员</p>
          <el-scrollbar class="vertical-scroll">
            <el-tree
              :data="treeData"
              show-checkbox
              auto-expand-parent
              :default-expanded-keys="defaultExpandedKey"
              :default-checked-keys="checkedListID"
              @check="handleCheck"
              node-key="id"
              ref="tree"
              :indent="20"
              highlight-current
              :props="defaultProps"
            ></el-tree>
          </el-scrollbar>
        </div>
        <div class="approver-selected">
          <p class="select-title">已选择</p>
          <el-scrollbar class="vertical-scroll">
            <ul class="selected-list">
              <li
                class="selected-item"
                v-for="checkedItem in checkedList"
                :key="checkedItem.id"
              >{{checkedItem.label}}</li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="submitForm">确 定</el-button>
      <el-button type="primary" @click="handleDialogClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import getStructure from '@/utils/getStructure'
import { findNodeByID } from '@/utils/getStructure/findNodeByID'
import { selectComAuthority } from '@/api/system'
import { editApplyConfig } from '@/api/Approval'
export default {
  name: 'EditApprovalConfig',
  props: {
    editingData: Object,
    editBoxVisible: Boolean
  },
  data() {
    return {
      btnLoading: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkedList: [],
      BusinessType: '',
      defaultExpandedKey: []
    }
  },
  computed: {
    checkedListID() {
      if (this.editingData) {
        return this.editingData.AuditorDepID.split(',')
          .concat(...this.editingData.AuditorID.split(','))
          .filter(v => v)
      } else {
        return []
      }
    }
  },
  methods: {
    submitForm() {
      this.btnLoading = true
      const deps = this.checkedList.filter(v => v.type === 'DepartmentID')
      const emps = this.checkedList.filter(v => v.type === 'EmployeeID')
      const AuditorDepID = deps.map(v => v.id).join(',')
      const AuditorID = emps.map(v => v.id).join(',')
      const AuditorDepName = deps.map(v => v.label).join(',')
      const AuditorName = emps.map(v => v.label).join(',')
      const form = Object.assign(this.editingData, {
        AuditorDepID,
        AuditorID,
        AuditorDepName,
        AuditorName
      })
      editApplyConfig(form).then(res => {
        this.$emit('edited')
        this.closeDialog()
      }).catch(res => {
        this.btnLoading = false
      })
    },
    closeDialog() {
      this.$emit('close')
    },
    handleDialogClose() {
      this.closeDialog()
    },
    handleOpen() {
      this.btnLoading = false
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.checkedListID)
        if (this.checkedListID.length) {
          this.defaultExpandedKey = this.checkedListID
        } else {
          this.defaultExpandedKey = [this.$store.getters.userinfo.CompanyID]
        }
      })
      this.checkedList = this.checkedListID.map(val => {
        return findNodeByID(this.treeData, val)
      })
      this.BusinessType = this.$EnumData.getEnumDesByValue('BusinessType', this.editingData.BusinessType)
    },
    handleCheck(val1, val2) {
      this.checkedList = val2.checkedNodes.filter(val => {
        return !val.children
      })
      this.filter(this.checkedList)
    },
    filter(list) {
      if (list && list.length) {
        const obj = {}
        list.forEach((val, index) => {
          if (val.type === 'EmployeeID') {
            if (!obj.hasOwnProperty(val.pid + '')) {
              obj[val.pid] = 1
            } else {
              obj[val.pid]++
            }
          }
        })
        Object.entries(obj).forEach(v => {
          const pid = v[0]
          const childrenCount = v[1]
          const pNode = findNodeByID(this.treeData, pid)
          if (pNode && pNode.children.length === childrenCount) {
            const startNum = this.checkedList.findIndex(val => {
              return +val.pid === pNode.id
            })
            this.checkedList.splice(startNum, childrenCount, pNode)
          }
        })
      }
    },
    handleDisabled(tree) {
      tree.forEach(val => {
        if (val.type === 'CompanyID') {
          val.disabled = true
        }
        if (val.children) {
          this.handleDisabled(val.children)
        }
      })
    }
  },
  created() {
    selectComAuthority().then(res => {
      this.treeData = getStructure(
        res.Data.ComList,
        res.Data.DepList,
        res.Data.EmpList,
        'children'
      )
      console.log(this.treeData)
      this.handleDisabled(this.treeData)
    })
  }
}
</script>

<style lang="scss" scoped>
.aprproval-config {
  list-style: none;
  height: 326px;
  .select-title {
    height: 32px;
    margin-bottom: 10px;
    font-size: 12px;
    line-height: 32px;
    color: #999;
    padding-left: 20px;
    background-color: #f3f9fe;
  }
  .vertical-scroll {
    height: 218px;
  }
  .bussiness-type {
    font-size: 14px;
    color: #444;
    margin-bottom: 40px;
  }
  .select-containter {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    .approver-selecting {
      height: 260px;
      width: 354px;
      margin-right: 20px;
      box-shadow: 0 1px 10px #ddd;
    }
    .approver-selected {
      height: 260px;
      width: 260px;
      box-shadow: 0 1px 10px #ddd;
      .selected-list {
        padding-left: 20px;
        list-style: none;
        margin: 0; 
        .selected-item {
          font-size: 12px;
          line-height: 20px;
          color: #666;
        }
      }
    }
  }
}
</style>
