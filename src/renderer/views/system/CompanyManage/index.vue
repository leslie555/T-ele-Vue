<template>
  <div class="app-container data-list">
    <search-panel :model="searchForm" ref="ruleForm" label-width="80px">
      <template slot="search">
        <el-form-item label="关键字">
          <el-input v-model="searchForm.Keyword" placeholder="请输入关键词"></el-input>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click.native.prevent="submitSearch">查询</el-button>
        <el-button type="primary" @click.native.prevent="resetTable">重置</el-button>
        <el-button type="primary" v-setbtn:Add @click.native.prevent="addCompany">新增公司</el-button>
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
        <el-table-column label="名称" prop="companyName" fixed="left" width="120" align="center"></el-table-column>
        <el-table-column label="公司简称" prop="CompanyAbbreviation" min-width="120" align="center"></el-table-column>
        <el-table-column label="所属公司" prop="belongCompany" min-width="120" align="center"></el-table-column>
        <el-table-column label="地址" prop="address" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="table-info-auto">
              <span>{{scope.row.city}}</span>
              <span>{{scope.row.address}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="companyType" min-width="80" align="center"></el-table-column>
        <el-table-column label="是否财务独立" prop="isInDependent" min-width="110" align="center"></el-table-column>
        <el-table-column label="负责人信息" width="180" align="center">
          <template slot-scope="scope">
            <div class="table-info-auto" v-if="scope.row.username">
              <span>{{scope.row.username}}</span>
              <span>{{scope.row.tel}}</span>
            </div>
            <div v-for="item in scope.row.principalInfo" :key="item.Tel" class="table-info-auto">
              <span>{{item.UserName}}</span>
              <span>{{item.Tel}}</span>
            </div>
            <!--<span v-else>暂无负责人</span>-->
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="60" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="260" align="center">
          <template slot-scope="scope">
            <table-buttons
              :options="buttonsOptions"
              :condition="scope.row.operation"
              @handleEditClick="handleEdit(scope.row.id)"
              @handleSetChargeClick="handleSetCharge(scope.row.id)"
              @handleDisableClick="handleDisable(scope.$index)"
              @handleEnableClick="handleEnable(scope.$index)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <select-principal ref="selectPrincipal" @GetPrincipalData="setPrincipal"></select-principal>
    <bottom-tool-bar ref="bottomToolBar" :handlePageChange="updateAllTableData"></bottom-tool-bar>
  </div>
</template>

<script>
  import SearchPanel from '@/components/SearchPanel'
  import BottomToolBar from '@/components/BottomToolBar'
  import TableButtons from '@/components/TableButtons'
  import SelectPrincipal from '../components/SelectPrincipal'
  import { updateCompanyData, isDisableCompany } from '@/api/system'

  export default {
    name: 'CompanyManage',
    components: {
      TableButtons,
      SearchPanel,
      BottomToolBar,
      SelectPrincipal
    },
    data() {
      return {
        listLoading: false,
        searchForm: {
          Keyword: '',
          ZBID: 1
        },
        buttonsOptions: [
          {
            key: 'Edit',
            value: '修改',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'SetCharge',
            value: '设置负责人',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Delete',
            value: '删除',
            type: 'danger',
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
          }
        ],
        tableData: [],
        filteredTableData: []
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
      findIndexByID(id) {
        return this.filteredTableData.findIndex(val => {
          return id === val.id
        })
      },
      addCompany() {
        this.$router.push({ path: 'AddCompanyInfo' })
      },
      handleEdit(id) {
        const index = this.findIndexByID(id)
        this.$router.push({
          path: 'EditCompanyInfo',
          query: {
            data: JSON.stringify(this.tableData[index])
          }
        })
      },
      handleSetCharge(id) {
        debugger
        const index = this.findIndexByID(id)
        const data = this.filteredTableData[index]
        this.$refs.selectPrincipal.open(data)
      },
      // 设置负责人回调
      setPrincipal(data) {
        // 修改列表负责人数据
        const index = this.findIndexByID(data.KeyID)
        debugger
        this.$set(this.filteredTableData[index], 'principalInfo', data.PrincipalData)
      },
      handleDisable(idx) {
        const row = this.tableData[idx]
        row.IsDisable = 1
        this.$confirm('确定禁用该公司?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          isDisableCompany({ KeyID: row.KeyID, IsDisable: true }).then(res => {
            this.$message({
              type: 'success',
              message: '禁用成功!'
            })
            row.operation = ['Edit', 'SetCharge', 'Enable']
            this.$set(this.filteredTableData, idx, this.filterTableDataItem(row))
          })
        })
      },
      handleEnable(idx) {
        const row = this.tableData[idx]
        row.IsDisable = 0
        this.$confirm('确定启用该公司?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          isDisableCompany({ KeyID: row.KeyID, IsDisable: false }).then(res => {
            this.$message({
              type: 'success',
              message: '启用成功!'
            })
            row.operation = ['Edit', 'SetCharge', 'Disable']
            this.$set(this.filteredTableData, idx, this.filterTableDataItem(row))
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
          id: val.KeyID,
          companyName: val.CompanyName,
          CompanyAbbreviation: val.CompanyAbbreviation,
          belongCompany: val.belonging || '无',
          city: val.CityName,
          address: val.Address,
          companyType: val.CompanyType === 1 ? '公司' : '分店',
          isInDependent: val.IsIndependent ? '是' : '否',
          username: val.PrincipalUserName,
          tel: val.PrincipalUserPhone,
          principalInfo: val.PrincipalInfo,
          status: val.IsDisable ? '禁用' : '启用',
          operation: val.IsDisable ? ['Edit', 'SetCharge', 'Enable'] : ['Edit', 'SetCharge', 'Disable']
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
        return updateCompanyData({
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
