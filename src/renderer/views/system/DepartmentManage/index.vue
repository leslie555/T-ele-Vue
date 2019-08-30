<template>
  <div>
    <div class="app-container data-list">
      <search-panel :model="searchForm" ref="ruleForm" label-width="80px">
        <template slot="search">
          <el-form-item label="关键字">
            <el-input v-model="searchForm.Keyword" placeholder="请输入关键词"></el-input>
          </el-form-item>
        </template>
        <template slot="button">
          <el-button type="primary" @click.prevent="submitSearch">查询</el-button>
          <el-button type="primary" @click.prevent="resetTable">重置</el-button>
          <el-button type="primary" v-setbtn:Add @click.prevent="addDepartment">新增部门</el-button>
        </template>
      </search-panel>
      <div class="panel data-list-table">
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
          <el-table-column label="部门名称" prop="departmentName" min-width="120" align="center"></el-table-column>
          <el-table-column label="所属公司/分店" prop="belongCompany" min-width="180" align="center"></el-table-column>
          <el-table-column label="部门人数" prop="departmentNumber" min-width="80" align="center"></el-table-column>
          <el-table-column label="负责人信息" prop="directorInfo" min-width="180" align="center"></el-table-column>
          <el-table-column align="center" min-width="120">
            <template slot-scope="scope">
              <table-buttons
                :options="buttonsOptions"
                :condition="scope.row.operation"
                @handleEditClick="handleEdit(scope.$index)"
                @handleDeleteClick="handleDelete(scope.$index)"
              ></table-buttons>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <bottom-tool-bar ref="bottomToolBar" :handlePageChange="updateAllTableData"></bottom-tool-bar>
    </div>
    <add-department
      :add-department-visible.sync="addDepartmentVisible"
      :editing-data="editingData"
      @close="addDepartmentVisible=false"
      @editedDepartment="handleEditedDep"
      @addedDepartment="handleAddedDep"
    ></add-department>
  </div>
</template>

<script>
import SearchPanel from '@/components/SearchPanel'
import TableButtons from '@/components/TableButtons'
import BottomToolBar from '@/components/BottomToolBar'
import { updateDepartmentData, delDepartment } from '@/api/system'
import AddDepartment from './components/addDepartment.vue'
export default {
  name: 'DepartmentManage',
  components: {
    TableButtons,
    SearchPanel,
    BottomToolBar,
    AddDepartment
  },
  data() {
    return {
      listLoading: false,
      addDepartmentVisible: false,
      searchForm: {
        Keyword: '',
        BusinessID: this.$store.getters.userinfo.BusinessID
      },
      buttonsOptions: [
        {
          key: 'Edit',
          value: '修改',
          type: 'primary',
          size: 'mini'
        },
        {
          key: 'Delete',
          value: '删除',
          type: 'danger',
          size: 'mini'
        }
      ],
      buttonsArr: [],
      tableData: [],
      filteredTableData: [],
      editingData: {}
    }
  },
  activated() {
    this.$refs.bottomToolBar.search(1)
  },
  methods: {
    submitSearch() {
      this.$refs.bottomToolBar.search()
    },
    resetTable() {
      this.searchForm.Keyword = ''
      this.$refs.bottomToolBar.search()
    },
    addDepartment() {
      this.addDepartmentVisible = true
      this.editingData = {}
    },
    handleAddedDep(data) {
      this.tableData.push(data)
      this.filteredTableData.push(this.filterTableDataItem(data))
    },
    handleEdit(idx) {
      this.operatingIndex = idx
      this.addDepartmentVisible = true
      this.editingData = this.tableData[idx]
    },
    handleEditedDep(data) {
      this.$set(this.tableData, this.operatingIndex, data)
      this.$set(
        this.filteredTableData,
        this.operatingIndex,
        this.filterTableDataItem(data)
      )
    },
    handleDelete(idx) {
      const row = this.tableData[idx]
      this.$confirm('确定删除该部门?', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDepartment({
          KeyID: row.KeyID
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.tableData.splice(idx, 1)
          this.filteredTableData.splice(idx, 1)
        })
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
        departmentName: val.DepartmentName,
        belongCompany: val.CorporationName,
        departmentNumber: val.DepPopulation,
        directorInfo: val.UserName
          ? val.UserName + ' ' + val.Tel
          : '暂无负责人',
        operation: ['Edit', 'Delete']
      }
    },
    updateAllTableData(pages) {
      if (!pages) {
        pages = {
          size: 10,
          page: 1
        }
      }
      this.listLoading = true
      return updateDepartmentData({
        parm: pages,
        ...this.searchForm
      }).then(res => {
        this.tableData = res.Data.rows
        this.filterTableData()
        this.listLoading = false
        return res.Data
      })
    }
  }
}
</script>
