<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" show>
      <template slot="search">
        <el-form-item label="关键字">
          <el-input
            v-model="ruleForm.KeyWord"
            autocomplete="off"
            placeholder="物业地址/业主姓名/电话/房源编号"
            style="width: 350px"
          ></el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="到期时间">
            <el-date-picker
              v-model="ruleForm.Time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              :default-time="['00:00:00', '23:59:59']"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="业务员">
            <el-input
              v-model="ruleForm.EmployeeName"
              style="width: 200px; margin-right: 10px;"
              :readonly="true"
            ></el-input>
            <select-employee @dbClick="getPeople" @empChange="getPeople">
              <el-button type="primary" @click="popoverVisible = true" size="mini">选择</el-button>
            </select-employee>
          </el-form-item>
        </div>
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button
          type="primary"
          @click="downloadExcel"
          :loading="downloadLoading"
          v-setbtn:Export
        >导出</el-button>
        <el-button type="primary" @click="handlePrint" v-setbtn:Print :disabled="isDisabled">打印</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table
        :data="tableData"
        v-loading.body="listLoading"
        element-loading-text="加载中"
        border
        fit
        height="100%"
        class="table-normal"
      >
        <el-table-column label="房源编号" prop="HouseCode" align="center" width="200px" fixed="left"></el-table-column>
        <el-table-column label="物业地址" align="center" prop="HouseName" width="260"></el-table-column>
        <el-table-column label="区域" align="center" prop="Location" width="200"></el-table-column>
        <el-table-column label="房间号" align="center" prop="HouseNumber" width="200"></el-table-column>
        <el-table-column label="客户信息" align="center">
          <template slot-scope="scope">{{ scope.row.CustomerName }}</template>
        </el-table-column>
        <el-table-column label="月租金(元)" prop="HouseRent" align="center" width="100"></el-table-column>
        <el-table-column label="业务员" prop="EmployeeName" align="center" width="120"></el-table-column>
        <el-table-column label="租赁期限" prop="LeaseTerm" align="center" width="120"></el-table-column>
        <el-table-column label="金融机构" prop="TenantStageType" align="center" width="120">
          <template
            slot-scope="scope"
          >{{ $EnumData.getEnumDesByValue('TenantStageType', scope.row.TenantStageType) }}</template>
        </el-table-column>
        <el-table-column label="缴费方式" prop="PayModel" align="center" width="120"></el-table-column>
        <el-table-column label="开始时间" align="center" width="260">
          <template slot-scope="scope">{{ $dateFormat(scope.row.StartDate, 'yyyy-MM-dd') }}</template>
        </el-table-column>
        <el-table-column label="到期时间" align="center" width="260">
          <template slot-scope="scope">{{ $dateFormat(scope.row.EndDate, 'yyyy-MM-dd') }}</template>
        </el-table-column>
        <el-table-column label="应收款" prop="Receivables" align="center" width="120"></el-table-column>
        <el-table-column label="备注" prop="Remark" align="center" width="260" fixed="right"></el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="fetchData"
      style="text-align: right"
    ></bottom-tool-bar>
    <print-template ref="printTemplate"></print-template>
  </div>
</template>

<script>
import { QueryStagingExcelList } from '@/api/report'
import { SearchPanel, BottomToolBar } from '@/components'
import SelectEmployee from '@/components/SelectEmployee'
import PrintTemplate from '@/components/PrintTemplate' // 打印组件

export default ({
  name: 'HuiStaging',
  data() {
    return {
      isDisabled: true,
      ruleForm: {
        KeyWord: '',
        Time: [],
        FullID: '',
        EmployeeName: ''
      },
      // 表格数据
      tableData: [],
      pageSize: 10,
      listLoading: false,
      downloadLoading: false
    }
  },
  components: {
    SearchPanel,
    BottomToolBar,
    SelectEmployee,
    PrintTemplate
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
      return QueryStagingExcelList({
        parm: pages,
        KeyWord: this.ruleForm.KeyWord,
        StartDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[0], 'yyyy/MM/dd'),
        EndDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[1], 'yyyy/MM/dd'),
        FullID: this.ruleForm.FullID,
        isAll: false
      }).then(response => {
        if (response.Code === 0) {
          this.listLoading = false
          this.tableData = response.Data.rows
          this.isDisabled = false
          return response.Data
        }
      })
    },
    getPeople(data) {
      this.ruleForm.FullID = !data.fullID ? data.FullID : data.fullID
      this.ruleForm.EmployeeName = !data.label ? data.UserName : data.label
    },
    search() {
      this.$refs.bottomToolBar.search()
    },
    reset() {
      this.ruleForm.KeyWord = ''
      this.ruleForm.Time = []
      this.ruleForm.FullID = ''
      this.ruleForm.EmployeeName = ''
      this.$refs.bottomToolBar.search()
    },
    handlePrint() {
      this.$refs.printTemplate.open({
        busType: 'ReportStaing',
        busNum: 2,
        searchData: {
          KeyWord: this.ruleForm.KeyWord,
          StartDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[0], 'yyyy/MM/dd'),
          EndDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[1], 'yyyy/MM/dd'),
          FullID: this.ruleForm.FullID
        },
        title: '会分期'
      })
    },
    // 导出表格
    downloadExcel() {
      this.downloadLoading = true
      QueryStagingExcelList({
        parm: {
          size: this.pageSize,
          page: 1
        },
        KeyWord: this.ruleForm.KeyWord,
        StartDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[0], 'yyyy/MM/dd'),
        EndDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[1], 'yyyy/MM/dd'),
        FullID: this.ruleForm.FullID,
        isAll: true
      }).then(response => {
        if (response.Code === 0) {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['房源编号', '物业地址', '区域', '房间号', '客户信息', '月租金(元)', '业务员', '租赁期限', '金融机构', '缴费方式', '开始时间', '到期时间', '应收款', '备注']
            const filterVal = ['HouseCode', 'HouseName', 'Location', 'HouseNumber', 'CustomerName', 'HouseRent', 'EmployeeName', 'LeaseTerm', 'TenantStageType', 'PayModel', 'StartDate', 'EndDate', 'Receivables', 'Remark']
            const data = this.formatJson(filterVal, !response.Data ? [] : response.Data.rows)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '会分期报表'
            })
            this.downloadLoading = false
          })
        }
      })
    },
    // 格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'EndDate' || j === 'StartDate') {
          return this.$dateFormat(v[j])
        } else if (j === 'TenantStageType') {
          return this.$EnumData.getEnumDesByValue('TenantStageType', v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
