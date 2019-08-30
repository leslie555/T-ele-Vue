<template>
  <div class="app-container data-list">
    <search-panel ref="ruleForm" :model="CalculateInfoForm" label-width="120px">
      <template slot="search">
        <el-form-item label="关键字" label-width="60px">
          <el-input v-model="CalculateInfoForm.KeyWord"></el-input>
        </el-form-item>
        <el-form-item label="管房人">
          <el-input v-model="CalculateInfoForm.EmployeeName" style="width: 180px" :readonly="true"></el-input>
          <select-employee allCompany @dbClick="getPeople" @empChange="getPeople">
            <el-button type="primary" @click="popoverVisible = true" size="mini">选择</el-button>
          </select-employee>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="CalculateInfoForm.CalculateType">
            <el-radio :label="1">今日预算</el-radio>
            <el-radio :label="2">今日核算</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </template>
    </search-panel>
    <el-row class="panel data-list-table">
      <el-table
        :data="tableData"
        v-loading.body="listLoading"
        element-loading-text="加载中"
        border
        fit
        height="100%"
        class="table-normal"
      >
        <el-table-column label="房源名称" prop="HouseName" align="center" width="200px" fixed="left"></el-table-column>
        <el-table-column label="所属分店" prop="CompanyName" align="center"></el-table-column>
        <el-table-column label="管房人" prop="UserName" align="center">
          <template slot-scope="scope">{{ scope.row.EmployeeName }} - {{ scope.row.EmployeeTel }}</template>
        </el-table-column>
        <el-table-column label="业主" prop="OwnerName" align="center"></el-table-column>
        <el-table-column label="在租租客" prop="TenantName" align="center"></el-table-column>
        <el-table-column label="托管日期" align="center">
          <template
            slot-scope="scope"
          >{{ $dateFormat(scope.row.OwnerContractStartDate, 'yyyy/MM/dd') }} - {{ $dateFormat(scope.row.OwnerContractEndDate, 'yyyy/MM/dd') }}</template>
        </el-table-column>
        <el-table-column label="在租时间" width="260" align="center">
          <template slot-scope="scope">
            <span>{{ $dateFormat(scope.row.TenantContractStartDate, 'yyyy/MM/dd') }} - {{ $dateFormat(scope.row.TenantContractEndDate, 'yyyy/MM/dd') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="small"
              @click="ViewPerformance(scope.row.HouseID, scope.row.HouseKey)"
            >查看业绩</el-button>
            <el-button
              type="primary"
              plain
              size="small"
              @click="Calculation('1', scope.row)"
              v-if="scope.row.State === 1"
            >预算</el-button>
            <el-button
              type="success"
              plain
              size="small"
              @click="Calculation('2', scope.row)"
              v-if="scope.row.State === 2"
            >核算</el-button>
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
  </div>
</template>
<script>
import SearchPanel from '@/components/SearchPanel'
import BottomToolBar from '@/components/BottomToolBar'
import SelectEmployee from '@/components/SelectEmployee'
import { FindPerformanceList } from '@/api/calculate'

export default {
  name: 'CalculateInfo',
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
        EmployeeName: '',
        CalculateType: '0'
      },
      // 表格数据
      tableData: [],
      listLoading: false
    }
  },
  methods: {
    Calculation(type, row) {
      if (type === '1') {
        this.$router.push({
          path: '/Calculate/Calculation',
          query: {
            KeyID: row.KeyID
          }
        })
      } else {
        this.$router.push({
          path: '/Calculate/AccountingPage',
          query: {
            KeyID: row.KeyID,
            TenantContractID: row.TenantContractID,
            HouseID: row.HouseID
          }
        })
      }
    },
    ViewPerformance(HouseID, HouseKey) {
      this.$router.push({
        path: '/Calculate/ViewPerformance',
        query: {
          HouseID,
          HouseKey
        }
      })
    },
    submitForm() {
      this.search()
    },
    resetForm() {
      this.CalculateInfoForm.KeyWord = ''
      this.CalculateInfoForm.EmployeeID = ''
      this.CalculateInfoForm.EmployeeName = ''
      this.CalculateInfoForm.CalculateType = ''
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
      return FindPerformanceList({
        Parm: pages,
        KeyWord: this.CalculateInfoForm.KeyWord,
        Full: this.CalculateInfoForm.EmployeeID,
        CalculateType: this.CalculateInfoForm.CalculateType
      }).then(response => {
        if (response.Code === 0) {
          this.listLoading = false
          this.tableData = response.Data.rows
          // debugger
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
@import "style";
</style>
