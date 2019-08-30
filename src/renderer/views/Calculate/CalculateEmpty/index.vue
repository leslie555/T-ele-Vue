<template>
  <div class="app-container data-list">
    <search-panel ref="ruleForm" :model="CalculateInfoForm" label-width="120px">
      <template slot="search">
        <el-form-item label="关键字" label-width="60px">
          <el-input v-model="CalculateInfoForm.KeyWord"></el-input>
        </el-form-item>
        <el-form-item label="管房人">
          <el-input v-model="CalculateInfoForm.EmployeeName" style="width: 180px" :readonly="true"></el-input>
          <select-employee allCompany @empChange="getPeople" @dbClick="getPeople">
            <el-button type="primary" @click="popoverVisible = true" size="mini">选择</el-button>
          </select-employee>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </template>
    </search-panel>
    <el-row class="panel data-list-table">
      <el-table :data="tableData"
                v-loading.body="listLoading"
                element-loading-text="加载中"
                border
                fit
                height="100%"
                class="table-normal">
        <el-table-column label="房源名称" prop="HouseName" align="center" width="200px" fixed="left"></el-table-column>
        <el-table-column label="所属分店" prop="CompanyName" align="center"></el-table-column>
        <el-table-column label="管房人" align="center">
          <template slot-scope="scope">
            {{ scope.row.UserName }} - {{ scope.row.Tel }}
          </template>
        </el-table-column>
        <el-table-column label="业主" prop="OwnerName" align="center"></el-table-column>
        <el-table-column label="托管日期" align="center" width="260">
          <template slot-scope="scope">
            {{ $dateFormat(scope.row.OwnerContractStartDate, 'yyyy/MM/dd') }} - {{ $dateFormat(scope.row.OwnerContractEndDate, 'yyyy/MM/dd') }}
          </template>
        </el-table-column>
        <el-table-column label="空置时间" width="260" align="center">
          <template slot-scope="scope">
            <span>
              {{ $dateFormat(scope.row.VacancyStratTime, 'yyyy/MM/dd') }} - {{ $dateFormat(scope.row.VacancyeEndTime, 'yyyy/MM/dd') }}
            </span>
          </template>-
        </el-table-column>
        <el-table-column label="空置业绩(元)" prop="VacancyeMoney" align="center" width="260" fixed="right"></el-table-column>
      </el-table>
    </el-row>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData" style="text-align: right"></bottom-tool-bar>
  </div>
</template>
<script>
import SearchPanel from '@/components/SearchPanel'
import BottomToolBar from '@/components/BottomToolBar'
import SelectEmployee from '@/components/SelectEmployee'
import { FindVacancyPerformance } from '@/api/calculate'

export default {
  name: 'CalculateEmpty',
  components: {
    SearchPanel,
    BottomToolBar,
    SelectEmployee
  },
  data() {
    return {
      pageSize: 10,
      CalculateInfoForm: {
        KeyWord: '',
        EmployeeID: '',
        EmployeeName: ''
      },
      // 表格数据
      tableData: [],
      listLoading: false
    }
  },
  methods: {
      Calculation(type) {
      this.$router.push({
        path: '/Calculate/Calculation',
        query: {
          type
        }
      })
    },
    ViewPerformance() {
      this.$router.push({
        path: '/Calculate/ViewPerformance'
      })
    },
    submitForm() {
      this.search()
      // this.CalculateInfoForm.KeyWord = ''
      // this.CalculateInfoForm.EmployeeID = ''
      // this.CalculateInfoForm.EmployeeName = ''
    },
    resetForm() {
      this.CalculateInfoForm.KeyWord = ''
      this.CalculateInfoForm.EmployeeID = ''
      this.CalculateInfoForm.EmployeeName = ''
      this.search()
    },
    getPeople(data) {
      this.CalculateInfoForm.EmployeeID = !data.fullID ? data.FullID : data.fullID
      this.CalculateInfoForm.EmployeeName = !data.label ? data.UserName : data.label
    },
    fetchData(pages) {
      if (!pages) {
        pages = {
          size: this.pageSize,
          page: 1
        }
      }
      this.listLoading = true
      return FindVacancyPerformance({
        Parm: pages,
        KeyWord: this.CalculateInfoForm.KeyWord,
        Full: this.CalculateInfoForm.EmployeeID
      }).then(response => {
        if (response.Code === 0) {
          this.listLoading = false
          if (response.Data.rows) {
            this.tableData = response.Data.rows
          }
          return response.Data
        }
      })
    },
    search() {
      this.$refs.bottomToolBar.search()
    }
  },
  activated() {
    this.$refs.bottomToolBar.search(1)
  }
}
</script>
<style lang="scss" scoped>
  @import 'style'
</style>
