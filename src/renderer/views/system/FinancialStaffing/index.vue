<template>
  <div class="app-container data-list">
    <search-panel :model="CommunityForm" label-width="80px">
      <template slot="search">
        <el-form-item label="关键字">
          <el-input v-model="CommunityForm.Keyword" clearable placeholder="员工姓名"></el-input>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="ClearData">重置</el-button>
        <el-button type="primary" @click="EditFormOpen()"  v-setbtn:Add>新增+</el-button>
      </template>
    </search-panel>
    <el-row class="panel data-list-table">
      <el-table :data="tableData" border :header-cell-style="{background: '#F5FAFE'}">
        <el-table-column label="员工" width="220" prop="UserName" align="center" fixed="left"></el-table-column>
        <el-table-column label="所属部门" prop="DepartmentName" align="center" width="500"></el-table-column>
        <el-table-column label="负责门店" prop="ComInfoList" align="center">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.ComInfoList"
              :key="index"
            >{{ `${item.CompanyName}${index !== scope.row.ComInfoList.length - 1 ? '、' : ''} ` }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" plain @click="EditFormOpen(scope.row)"  v-setbtn:edit>修改</el-button>
            <el-button type="danger" size="small" plain @click="deleteData(scope.row.KeyID, scope.$index)" v-setbtn:delete>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="fetchData"
      style="text-align: right"
    ></bottom-tool-bar>
    <edit-form ref="editForm" @SubmitEditForm="SubmitEditForm" @EditForm="EditForm"></edit-form>
  </div>
</template>
<script>
import BottomToolBar from '@/components/BottomToolBar'
import { CityData, getCityNameByCode } from '../../../utils/CityData'
import editForm from './components/editForm'
import { ShowHQDirectInfoByPage, DeleteHQDirectInfo } from '@/api/system'
import { SearchPanel } from '@/components'

export default ({
  name: 'FinancialStaffing',
  components: {
    BottomToolBar,
    editForm,
    SearchPanel
  },
  data() {
    return {
      pageSize: 10,
      listLoading: false,
      CityData,
      CommunityForm: {
        CityCode: ['', '', ''],
        Keyword: ''
      },
      // 表格数据测试用
      tableData: []
    }
  },
  methods: {
    fetchData(pages) {
      if (!pages) {
        pages = {
          size: this.pageSize,
          page: 1
        }
      }
      this.listLoading = true
      return ShowHQDirectInfoByPage({
        parm: pages,
        Keyword: this.CommunityForm.Keyword
      }).then(response => {
        if (response.Code === 0) {
          this.listLoading = false
          this.tableData = response.Data.rows
          return response.Data
        }
      })
    },
    search() {
      this.$refs.bottomToolBar.search()
    },
    ClearData() {
      this.CommunityForm.CityCode = ['', '', '']
      this.CommunityForm.Keyword = ''
      this.search()
    },
    GetCityName(data) {
      return getCityNameByCode(data)
    },
    EditFormOpen(data, index) {
      if (!data) {
        data = 0
      }
      this.$refs.editForm.open(data)
    },
    SubmitEditForm() {
      // const index = this.tableData.findIndex(v => v.KeyID === data.KeyID)
      // const item = { ...this.tableData[index], ...data }
      // this.tableData.splice(index, 1, item)
      this.search()
    },
    EditForm(data) {
      this.tableData.forEach((ele, index) => {
        if (ele.KeyID === data.KeyID) {
          this.$set(this.tableData, index, data)
          console.log(this.tableData, data)
        }
      })
    },
    deleteData(KeyID, index) {
      this.$confirm('此操作将删除该项配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteHQDirectInfo({
          KeyID
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.tableData.splice(index, 1)
        })
      })
    }
  }
})
</script>
<style lang='scss' scoped>
.PaginationBox {
  text-align: center;
  margin-top: 40px;
}
</style>
