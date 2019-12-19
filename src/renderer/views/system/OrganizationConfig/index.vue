<template>
  <div class="staff-manage">
    <div class="app-container data-list">
      <search-panel :model="searchForm" ref="ruleForm" label-width="80px">
        <template slot="search">
          <el-form-item label="关键字">
            <el-input v-model="searchForm.Keyword" placeholder="请输入姓名/电话"></el-input>
          </el-form-item>
        </template>
        <template slot="button">
          <el-button type="primary" @click.native.prevent="submitSearch">查询</el-button>
          <el-button type="primary" @click.native.prevent="resetTable">重置</el-button>
          <el-button type="primary" v-setbtn:Add @click.native.prevent="addStaff">新增员工</el-button>
          <!-- <el-button type="primary" @click.native.prevent="addOrganization">新增组织</el-button> -->
        </template>
      </search-panel>
      <div
        ref="treeContainer"
        style="position: relative;"
        class="panel data-list-table staff-manage-wrap"
      >
        <div class="staff-manage-left">
          <el-scrollbar class="vertical-scroll">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="staff-manage-left-input"></el-input>
            <el-tree
              highlight-current
              class="filter-tree"
              :data="treeData"
              :props="defaultTreeProps"
              :expand-on-click-node="false"
              :default-expanded-keys="defaultExpanded"
              :filter-node-method="filterTreeNode"
              @node-click="handleNodeClick"
              @node-contextmenu="openContextMenu"
              node-key="KeyID"
              ref="tree"
              icon-class="iconfont icon-jia"
              :indent="20"
            >
              <span
                :class="node.level===1?'custom-tree-node-header':'custom-tree-node'"
                slot-scope="{ node, data }"
              >
                <i class="iconfont" :class="getStructureIcon(node, data)"></i>
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="staff-manage-right">
          <el-table
            :data="filteredTableData"
            v-loading="listLoading"
            element-loading-text="加载中"
            border
            fit
            height="100%"
            class="table-normal"
            highlight-current-row
          >
            <el-table-column label="员工信息" prop="empInfo" min-width="130" align="center">
              <template slot-scope="scope">
                <div class="table-info-auto">
                  <span>{{scope.row.username}}</span>
                  <span>{{scope.row.tel}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="组织架构" prop="structure" min-width="120" align="center"></el-table-column>
            <el-table-column label="员工级别" prop="lv" min-width="80" align="center"></el-table-column>
            <el-table-column label="角色权限" prop="IDSum" min-width="80" align="center"></el-table-column>
            <el-table-column label="入职时间" prop="createrTime" width="110" align="center"></el-table-column>
            <el-table-column label="状态" prop="status" width="60" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="360">
              <template slot-scope="scope">
                <table-buttons
                  :options="buttonsOptions"
                  :condition="scope.row.operation"
                  @handleEditClick="handleEdit(scope.$index)"
                  @handleDeleteClick="handleDelete(scope.$index)"
                  @handleDisableClick="handleDisable(scope.$index)"
                  @handleEnableClick="handleEnable(scope.$index)"
                  @handleOrganClick="handleOrgan(scope.$index)"
                ></table-buttons>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <ul
          ref="contextMenu"
          v-show="contextMenuVisible"
          :style="{left:contextMenuLeft+'px',top:contextMenuTop+'px'}"
          class="contextmenu"
        >
          <li @click="moveStaff" v-setBtn:Add>在此组织下添加人员</li>
          <li @click="addOrganization">在此组织下添加组织</li>
          <li @click="editOrganization">修改此组织</li>
          <li @click="deleteOrganization">删除此组织</li>
        </ul>
      </div>
      <bottom-tool-bar ref="bottomToolBar" :handlePageChange="updateAllTableData"></bottom-tool-bar>
    </div>
    <add-staff
      :addStaffVisible.sync="addStaffVisible"
      :curSelectedOrgan="curSelectedOrgan"
      :treeData="treeData"
      :editingData="editingStaffData"
      @close="addStaffVisible=false"
      @addedStaff="handleAddedStaff"
      @editedStaff="handleEditedStaff"
    ></add-staff>
    <move-staff
      :moveStaffVisible.sync="moveStaffVisible"
      :curOrganizationKeyID="curOrganizationKeyID"
      :treeData="treeData"
      @close="moveStaffVisible=false"
      @movedStaff="handleMovedStaff"
    ></move-staff>
    <add-organization
      :addOrganizationVisible="addOrganizationVisible"
      :curOrganizationKeyID="curOrganizationKeyID"
      :treeData="treeData"
      :editOrganizationData="editOrganizationData"
      @close="addOrganizationVisible=false"
      @addedOrganization="handleAddedOrganization"
      @editedOrganization="handleEditedOrganization"
    ></add-organization>
    <manage-organ
      :manageOrganVisible="manageOrganVisible"
      :treeData="treeData"
      :EmployeeID="curEmployeeID"
      @close="manageOrganVisible=false"
    ></manage-organ>
  </div>
</template>
<style lang='scss'>
  .staff-manage-wrap {
    overflow-y: hidden !important;
    position: relative;
  }
  .staff-manage-left {
    position: absolute;
    top: 12px;
    bottom: 12px;
    left: 12px;
    width: 330px;
    padding-right: 20px !important;
    .staff-manage-left-input {
      margin-bottom: 10px;
    }
  }

  .staff-manage-right {
    position: absolute;
    left: 350px;
    right: 12px;
    top: 12px;
    bottom: 12px;
  }

  .staff-manage .el-tree-node__content {
    height: 38px;
  }

  .staff-manage {
    .vertical-scroll {
      border-right: 1px solid #eee;
    }
    .iconfont {
      font-family: 'iconfont' !important;
      font-size: 15px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
    }
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background-color: transparent;
      color: rgb(4, 138, 247);
    }
    .el-tree-node__expand-icon {
      transform: none;
      transition: none;
      position: relative;
      z-index: 1;
    }
    .el-tree-node__expand-icon.expanded {
      transform: none;
      &::before {
        position: relative;
        z-index: 1;
        background: #fff;
        content: '\E6D4';
        font-family: 'iconfont' !important;
        font-size: 14px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
      }
    }
  }

  .custom-tree-node {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    padding-right: 15px;
    &::before {
      display: block;
      content: '';
      width: 6px;
      height: 44px;
      box-sizing: border-box;
      border-bottom: 1px dashed #ddd;
      border-left: 1px dashed #ddd;
      top: -35px;
      position: absolute;
      left: -14px;
    }
    i {
      margin-right: 10px;
    }
  }

  .custom-tree-node-header {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    padding-right: 15px;
    i {
      margin-right: 10px;
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 1000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
</style>

<script>
  import SearchPanel from '@/components/SearchPanel'
  import TableButtons from '@/components/TableButtons'
  import BottomToolBar from '@/components/BottomToolBar'
  import {
    dimissionEmp,
    isDisableEmployee,
    ShowStaffSysList,
    ShowStaffSysEmployeeinfopage,
    DeleteStaffSys
  } from '@/api/system'
  import AddOrganization from './components/AddOrganization'
  import AddStaff from './components/AddStaff'
  import MoveStaff from './components/MoveStaff'
  import ManageOrgan from './components/ManageOrgan'
  import { getTreeNodeByValue } from '@/utils/arrUtil/treeArr'

  export default {
    name: 'OrganizationManage',
    components: {
      TableButtons,
      SearchPanel,
      BottomToolBar,
      AddOrganization,
      MoveStaff,
      AddStaff,
      ManageOrgan
    },
    data() {
      return {
        listLoading: false,
        contextMenuVisible: false,
        contextMenuLeft: 0,
        contextMenuTop: 0,
        addStaffVisible: false,
        moveStaffVisible: false,
        addOrganizationVisible: false,
        manageOrganVisible: false,
        searchForm: {
          Keyword: '',
          FullID: ''
        },
        buttonsOptions: [
          {
            key: 'Delete',
            value: '离职',
            type: 'danger',
            size: 'mini'
          },
          {
            key: 'Edit',
            value: '修改',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Disable',
            value: '禁用',
            type: 'danger',
            size: 'mini'
          },
          {
            key: 'Enable',
            value: '启用',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Organ',
            value: '管理组织',
            type: 'primary',
            size: 'mini'
          }
        ],
        tableData: [],
        filteredTableData: [],
        treeData: [],
        defaultTreeProps: {
          label: 'SysName',
          value: 'KeyID'
        },
        filterText: '',
        curOrganizationKeyID: 0,
        curSelectedOrgan: 1, // 控制点击左边部门之后然后新增节点里面的组织架构,
        editingStaffData: null,
        editOrganizationData: null,
        operatingIndex: 0,
        defaultExpanded: [],
        curEmployeeID: 0
      }
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    mounted() {
      document.getElementsByTagName('body')[0].appendChild(this.$refs.contextMenu)
    },
    methods: {
      getStructureIcon(node, data) {
        switch (data.type) {
          case 'BusinessID':
            return ['icon-qiyexinxi']
          case 'CompanyID':
            return ['icon-gongsixinxi']
          case 'DepartmentID':
            return ['icon-zuzhijiagou']
          default:
            return ['icon-zuzhijiagou']
        }
      },
      filterTreeNode(value, data) {
        if (!value) return true
        return data.SysName.indexOf(value) !== -1
      },
      submitSearch() {
        this.$refs.bottomToolBar.search()
      },
      resetTable() {
        this.searchForm.Keyword = ''
        this.$refs.bottomToolBar.search()
      },
      addStaff() {
        this.editingStaffData = null
        this.addStaffVisible = true
      },
      handleAddedStaff(data, pathArr) {
        if (pathArr.includes(this.curSelectedOrgan)) {
          this.tableData.push(data)
          this.$set(
            this.filteredTableData,
            this.filteredTableData.length,
            this.filterTableDataItem(data)
          )
        }
      },
      moveStaff() {
        this.moveStaffVisible = true
      },
      handleMovedStaff(data, pathArr) {
        if (pathArr.includes(this.curSelectedOrgan)) {
          this.tableData.push(data)
          this.$set(
            this.filteredTableData,
            this.filteredTableData.length,
            this.filterTableDataItem(data)
          )
        }
      },
      addOrganization() {
        this.editOrganizationData = null
        this.addOrganizationVisible = true
      },
      handleAddedOrganization(data) {
        const node = getTreeNodeByValue(
          this.treeData,
          data.PID,
          this.defaultTreeProps
        ).data
        if (node.children) {
          node.children.push(data)
        } else {
          node.children = [data]
        }
        this.$refs.tree.append(data, data.PID)
      },
      handleEditedOrganization(data, orginPID) {
        const originPNode = getTreeNodeByValue(
          this.treeData,
          orginPID,
          this.defaultTreeProps
        ).data
        const idx = originPNode.children.findIndex(v => v.KeyID === data.KeyID)
        if (originPNode.children[idx].children) {
          data.children = originPNode.children[idx].children
        }
        if (data.PID === orginPID) {
          // 组织结构未改变
          originPNode.children[idx] = data
          this.$refs.tree.updateKeyChildren(data.PID, [...originPNode.children])
        } else {
          const pNode = getTreeNodeByValue(
            this.treeData,
            data.PID,
            this.defaultTreeProps
          ).data
          this.$refs.tree.remove(data.KeyID)
          this.$refs.tree.append(data, data.PID)
          originPNode.children.splice(idx, 1)
          pNode.children.push(data)
        }
      },
      editOrganization() {
        this.addOrganizationVisible = true
      },
      deleteOrganization() {
        this.$confirm('确定删除该组织？, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DeleteStaffSys({
            KeyID: this.editOrganizationData.KeyID
          }).then(() => {
            const PNode = getTreeNodeByValue(
              this.treeData,
              this.editOrganizationData.PID,
              this.defaultTreeProps
            ).data
            const idx = PNode.children.findIndex(
              v => v.KeyID === this.editOrganizationData.KeyID
            )
            this.$refs.tree.remove(this.editOrganizationData.KeyID)
            PNode.children.splice(idx, 1)
          })
        })
      },
      handleEdit(idx) {
        this.editingStaffData = this.tableData[idx]
        this.operatingIndex = idx
        this.addStaffVisible = true
      },
      handleEditedStaff(data, pathArr) {
        // if (pathArr.includes(this.curSelectedOrgan)) {
        this.tableData[this.operatingIndex] = data
        this.$set(
          this.filteredTableData,
          this.operatingIndex,
          this.filterTableDataItem(data)
        )
        // }
      },
      handleDelete(idx) {
        const row = this.tableData[idx]
        this.$confirm('确定离职该员工?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dimissionEmp({ KeyID: row.KeyID }).then(res => {
            this.$message({
              type: 'success',
              message: '离职成功!'
            })
            this.tableData.splice(idx, 1)
            this.filteredTableData.splice(idx, 1)
          })
        })
      },
      handleDisable(idx) {
        const row = this.tableData[idx]
        row.IsDisable = 1
        this.$confirm('确定禁用该员工?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          isDisableEmployee({ KeyID: row.KeyID, IsDisable: true }).then(res => {
            this.$message({
              type: 'success',
              message: '禁用成功!'
            })
            this.$set(this.filteredTableData, idx, this.filterTableDataItem(row))
          })
        })
      },
      handleEnable(idx) {
        const row = this.tableData[idx]
        row.IsDisable = 0
        this.$confirm('确定启用该员工?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          isDisableEmployee({ KeyID: row.KeyID, IsDisable: false }).then(res => {
            this.$message({
              type: 'success',
              message: '启用成功!'
            })
            this.$set(this.filteredTableData, idx, this.filterTableDataItem(row))
          })
        })
      },
      handleOrgan(idx) {
        this.curEmployeeID = this.tableData[idx].KeyID
        this.manageOrganVisible = true
      },
      updateAllTableData(pages) {
        if (!pages) {
          pages = {
            size: 10,
            page: 1
          }
        }
        this.listLoading = true
        return ShowStaffSysEmployeeinfopage({
          pageParam: pages,
          ...this.searchForm
        })
          .then(res => {
            this.listLoading = false
            this.tableData = res.Data.rows
            this.filterTableData()
            return res.Data
          })
          .finally(() => {
            this.listLoading = false
          })
      },
      filterTableData() {
        const tableDatas = this.tableData
        const table = []
        tableDatas.forEach(val => {
          table.push(this.filterTableDataItem(val))
        })
        this.filteredTableData = table
      },
      filterTableDataItem(val) {
        return {
          id: val.KeyID,
          pid: val.PID,
          username: val.UserName,
          tel: val.Tel,
          structure: val.Organization,
          lv: this.$EnumData.getEnumDesByValue('StaffLevel', val.Lv),
          IDSum: val.IDSum.map(v => v.RoleName).join(','),
          createrTime: this.$dateFormat(val.CreaterTime),
          status: val.IsDisable ? '禁用' : '启用',
          operation: this.getOperation(val)
        }
      },
      getOperation(val) {
        const operation = ['Edit', 'Delete', 'Organ']
        if (val.IsDisable) {
          operation.push('Enable')
        } else {
          operation.push('Disable')
        }
        return operation
      },
      handleNodeClick(node) {
        this.curSelectedOrgan = node.KeyID
        this.contextMenuVisible = false
        this.searchForm.FullID = node.FullID
        this.$refs.bottomToolBar.search()
      },
      openContextMenu(e, node) {
        this.curOrganizationKeyID = node.KeyID
        this.editOrganizationData = this.$deepCopy(node)
        this.contextMenuLeft = e.clientX + 10 // 10: margin right
        this.contextMenuTop = e.clientY
        this.contextMenuVisible = true
      },
      createTree(tree, data) {
        if (!tree.length) return
        tree.forEach(val => {
          const children = data.filter(v => v.PID === val.KeyID)
          if (children.length) {
            val.children = children
          }
          this.createTree(children, data)
        })
        return tree
      },
      closeContextMenu() {
        this.contextMenuVisible = false
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      },
      contextMenuVisible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeContextMenu)
        } else {
          document.body.removeEventListener('click', this.closeContextMenu)
        }
      }
    },
    created() {
      ShowStaffSysList({
        ShowType: 2, // 显示类型 1:显示全部 2:显示没有禁用和没有删除的
        Type: 1 // 类型 1:全部 2:自己企业下面的 3:自己权限下面的
      }).then(({ Data }) => {
        const topVal = Data.filter(v => !v.PID)
        this.treeData = this.createTree(topVal, Data)
        this.defaultExpanded = this.treeData.reduce((pre, cur) => {
          return [...pre, ...cur.children.map(v => v.KeyID)]
        }, [])
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(1)
        })
      })
    }
  }
</script>
