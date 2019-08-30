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
          <el-button v-setbtn:Add type="primary" @click.native.prevent="addStaff">新增员工</el-button>
        </template>
      </search-panel>
      <div class="panel data-list-table staff-manage-wrap">
        <div class="staff-manage-left">
          <el-scrollbar class="vertical-scroll">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="staff-manage-left-input"></el-input>
            <el-tree
              highlight-current
              class="filter-tree"
              :data="treeData"
              :props="defaultTreeProps"
              :expand-on-click-node="false"
              @node-click="handleNodeclick"
              :default-expanded-keys="defaultExpanded"
              :filter-node-method="filterTreeNode"
              node-key="fullID"
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
                  <div class="table-pricipal" v-if="scope.row.isPrincipal"></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="组织架构" prop="structure" min-width="120" align="center"></el-table-column>
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
                  @handlePrincipalClick="handlePrincipal(scope.$index)"
                  @handleCanclePrincipalClick="handleCanclePrincipal(scope.$index)"
                ></table-buttons>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <bottom-tool-bar ref="bottomToolBar" :handlePageChange="updateAllTableData"></bottom-tool-bar>
    </div>
    <add-staff
      :addStaffVisible.sync="addStaffVisible"
      :depStructure="depStructure"
      :treeData="treeData"
      :editingData="editingData"
      @close="addStaffVisible=false"
      @addedStaff="handleAddedStaff"
      @editedStaff="handleEditedStaff"
    ></add-staff>
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
      font-family: "iconfont" !important;
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
        content: "\E6D4";
        font-family: "iconfont" !important;
        font-size: 14px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
      }
    }
    .table-pricipal {
      width: 40px;
      height: 40px;
      position: absolute;
      top: 0;
      right: 0;
      background: url("../../../assets/StaffManage/principal.png");
      background-size: cover;
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
      content: "";
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
</style>

<script>
  import SearchPanel from '@/components/SearchPanel'
  import TableButtons from '@/components/TableButtons'
  import BottomToolBar from '@/components/BottomToolBar'
  import {
    addPrincipalInfo,
    delPrincipalInfo,
    dimissionEmp,
    getStaffInitData,
    isDisableEmployee,
    SelectBusinessDepList
  } from '@/api/system'
  import AddStaff from './components/AddStaff.vue'
  import getStructure from '@/utils/getStructure'

  export default {
    name: 'StaffManage',
    components: {
      TableButtons,
      SearchPanel,
      BottomToolBar,
      AddStaff
    },
    data() {
      return {
        listLoading: false,
        addStaffVisible: false,
        searchForm: {
          Keyword: '',
          BusinessID: this.$store.getters.userinfo.BusinessID
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
            key: 'Principal',
            value: '设为负责人',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'CanclePrincipal',
            value: '取消负责人',
            type: 'primary',
            size: 'mini'
          }
        ],
        buttonsArr: [],
        tableData: [],
        filteredTableData: [],
        treeData: [],
        editingData: {},
        defaultTreeProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
        typeID: '',
        selectedFullID: this.$store.getters.userinfo.BusinessID + '', // 判断左侧树点击的节点的唯一ID,默认为当前企业ID
        selectedTreeItem: { type: 'BusinessID' }, // 左侧树当前点击树节点
        depStructure: [], // 控制点击左边部门之后然后新增节点里面的组织架构,
        operatingIndex: 0,
        defaultExpanded: []
      }
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
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
        return data.label.indexOf(value) !== -1
      },
      submitSearch() {
        this.$refs.bottomToolBar.search()
      },
      resetTable() {
        this.searchForm.Keyword = ''
        if (this.typeID) {
          const type = this.typeID.match(/\D+/)[0]
          const id = +this.typeID.match(/\d+/)[0]
          this.searchForm[type] = id
          this.$refs.bottomToolBar.search()
          delete this.searchForm[type]
        } else {
          this.$refs.bottomToolBar.search()
        }
      },
      handleNodeclick(val) {
        if (this.searchForm['DepartmentID']) delete this.searchForm['DepartmentID']
        if (this.searchForm['CompanyID']) delete this.searchForm['CompanyID']
        if (this.searchForm['BusinessID']) delete this.searchForm['BusinessID']
        this.searchForm[val.type] = val.id
        this.$refs.bottomToolBar.search()
        this.selectedTreeItem = val
        this.selectedFullID = val.fullID
        this.typeID = val.type + val.id
        // delete this.searchForm[val.type]
        if (val.fullID && val.type === 'DepartmentID') {
          this.depStructure = val.fullID.match(/\d+/g).map(v => +v)
        } else {
          this.depStructure = []
        }
      },
      addStaff() {
        this.editingData = {}
        this.addStaffVisible = true
      },
      handleAddedStaff(data, depFullID) {
        if (depFullID.slice(0, this.selectedFullID.length) === this.selectedFullID) {
          this.tableData.push(data)
          this.filteredTableData.push(this.filterTableDataItem(data))
        }
      },
      handleEdit(idx) {
        const row = this.tableData[idx]
        this.editingData = row
        this.operatingIndex = idx
        this.addStaffVisible = true
      },
      handleEditedStaff(data, depFullID) {
        const hasEmp = depFullID.slice(0, this.selectedFullID.length) === this.selectedFullID
        if (hasEmp) {
          this.$set(this.tableData, this.operatingIndex, data)
          this.filterTableData()
        } else {
          this.tableData.splice(this.operatingIndex, 1)
          this.filteredTableData.splice(this.operatingIndex, 1)
        }
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
      handlePrincipal(idx) {
        const row = this.tableData[idx]
        row.Functionary = 1
        addPrincipalInfo({
          DepartmentID: row.DepartmentID,
          EmployeeID: row.KeyID
        }).then(res => {
          this.$set(this.filteredTableData, idx, this.filterTableDataItem(row))
        })
      },
      handleCanclePrincipal(idx) {
        const row = this.tableData[idx]
        row.Functionary = 0
        delPrincipalInfo({
          KeyID: row.KeyID
        }).then(res => {
          this.$set(this.filteredTableData, idx, this.filterTableDataItem(row))
        })
      },
      updateAllTableData(pages) {
        if (!pages) {
          pages = {
            size: 10,
            page: 1
          }
        }
        this.listLoading = true
        return getStaffInitData({
          parm: pages,
          ...this.searchForm
        }).then(res => {
          this.tableData = res.Data.rows
          this.filterTableData()
          this.listLoading = false
          return res.Data
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
          isPrincipal: val.Functionary, // 0不是负责人, 1是负责人
          structure: val.Organization,
          createrTime: this.$dateFormat(val.CreaterTime),
          status: val.IsDisable ? '禁用' : '启用',
          operation: this.getOperation(val)
        }
      },
      getOperation(val) {
        const operation = ['Edit', 'Delete']
        if (val.IsDisable) {
          operation.push('Enable')
        } else {
          operation.push('Disable')
        }
        if (val.Functionary) {
          operation.push('CanclePrincipal')
        } else {
          operation.push('Principal')
        }
        return operation
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    created() {
      SelectBusinessDepList({ BusinessID: this.$store.getters.userinfo.BusinessID, Type: 3 }).then(res => {
        const bus = res.Data.Bus
        const depList = res.Data.DepList.filter(v => +v.CorporationID) // 公司ID不为零的为普通部门
        let structure = getStructure(res.Data.ComList, depList)
        // 找到直属企业的部门
        const disDepartment = res.Data.DepList.filter(v => !+v.CorporationID)
        structure = structure.concat(...disDepartment.map(v => ({
          id: v.KeyID,
          label: v.DepartmentName,
          fullID: v.FullID,
          type: 'DepartmentID'
        })))
        this.treeData = [{
          id: bus.KeyID,
          label: bus.BusinessName,
          fullID: bus.KeyID,
          type: 'BusinessID',
          children: structure
        }]
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(bus.KeyID + '')
          this.defaultExpanded = [bus.KeyID + '']
        })
      })
    }
  }
</script>
