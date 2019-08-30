/*  缩写:P => Permission */
<template>
  <div>
    <div class="app-container data-list">
      <search-panel :model="selectForm" label-width="80px">
        <template slot="search">
          <el-form-item label="关键字">
            <el-input v-model="selectForm.Keyword" placeholder="请输入权限名称"></el-input>
          </el-form-item>
        </template>
        <template slot="button">
          <el-button type="primary" @click="selectP">查询</el-button>
          <el-button type="primary" v-setbtn:Add @click="addP">添加+</el-button>
        </template>
      </search-panel>
      <div class="panel data-list-table">
        <el-table
          height="100%"
          :data="filteredTableData"
          v-loading="listLoading"
          element-loading-text="加载中"
          border
          fit
          style="width: 100%"
        >
          <el-table-column prop="name" label="权限名称" min-width="120" align="center"></el-table-column>
          <el-table-column prop="addTime" label="创建时间" min-width="120" align="center"></el-table-column>
          <el-table-column label="操作" min-width="200" align="center">
            <template slot-scope="scope">
              <table-buttons
                :options="buttonsOptions"
                :condition="scope.row.buttonsArr"
                @handleDetailClick="handleDetail(scope.$index)"
                @handleEditClick="handleEdit(scope.$index)"
                @handleDeleteClick="handleDelete(scope.$index)"
                @handleDisableClick="handleDisable(scope.$index)"
              ></table-buttons>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <bottom-tool-bar ref="bottomToolBar" :handlePageChange="updateAllTableData"></bottom-tool-bar>
    </div>
    <add-permission
      :addPVisible="addPVisible"
      @close="addPVisible=false"
      :editingData="editingData"
      @addedRole="addRole"
    ></add-permission>
    <permission-details
      :detailsVisible="detailsVisible"
      :editingData="editingData"
      @close="detailsVisible=false"
    ></permission-details>
  </div>
</template>

<script>
  import TableButtons from '@/components/TableButtons'
  import BottomToolBar from '@/components/BottomToolBar'
  import { getAccessConsigData, delRole } from '@/api/system'
  import AddPermission from './components/AddPermission'
  import PermissionDetails from './components/PermissionDetails.vue'
  import SearchPanel from '@/components/SearchPanel'
  export default {
    name: 'RoleManage',
    data() {
      return {
        listLoading: false,
        addPVisible: false,
        detailsVisible: false,
        selectForm: {
          Keyword: ''
        },
        tableData: [],
        filteredTableData: [],
        buttonsOptions: [
          {
            key: 'Detail',
            value: '详情',
            type: 'default',
            size: 'mini'
          },
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
        permissionName: '',
        editingData: {}
      }
    },
    components: {
      TableButtons,
      AddPermission,
      PermissionDetails,
      SearchPanel,
      BottomToolBar
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    methods: {
      updateAllTableData(pages = { page: 1, size: 10 }) {
        this.listLoading = true
        return getAccessConsigData({
          parm: pages,
          ...this.selectForm
        }).then(res => {
          this.tableData = res.Data.rows
          this.filterTableData()
          this.listLoading = false
          return res.Data
        })
      },
      addRole(data) {
        // debugger
        data.CreaterTime = this.$dateFormat(new Date())
        data.IsUse = 1
        this.tableData.push(data)
        this.filteredTableData.push(this.filterTableDataItem(data))
      },
      filterTableData() {
        const datas = this.tableData
        const table = []
        datas.forEach(val => {
          table.push(this.filterTableDataItem(val))
        })
        this.filteredTableData = table
      },
      filterTableDataItem(val) {
        return {
          name: val.RoleName,
          addTime: this.$dateFormat(val.CreaterTime),
          buttonsArr: ['Detail', 'Edit', 'Delete']
        }
      },
      selectP() {
        this.$refs.bottomToolBar.search()
      },
      addP() {
        this.addPVisible = true
        this.editingData = {}
      },
      handleDetail(index) {
        this.editingData = this.tableData[index]
        this.detailsVisible = true
      },
      handleEdit(index) {
        this.addPVisible = true
        this.editingData = this.tableData[index]
      },
      handleDelete(index) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delRole({
            KeyID: this.tableData[index].KeyID
          }).then(res => {
            this.tableData.splice(index, 1)
            this.filteredTableData.splice(index, 1)
          })
        })
      }
    }
  }
</script>
