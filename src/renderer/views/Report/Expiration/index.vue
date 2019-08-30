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
        <el-table-column
          label="房源编号"
          prop="HouseCode"
          align="center"
          width="260px"
          fixed="left"
        ></el-table-column>
        <el-table-column label="区域" align="center" prop="CityName" width="260"></el-table-column>
        <el-table-column label="物业地址" align="center" prop="CommunityName" width="260"></el-table-column>
        <el-table-column label="门牌号" align="center" prop="HouseNumber" width="220"></el-table-column>
        <el-table-column label="客户姓名" align="center" prop="TenantName"></el-table-column>
        <el-table-column label="客户电话" align="center" prop="TenantPhone" width="260"></el-table-column>
        <el-table-column label="押金(元)" prop="HouseDeposit" align="center" ></el-table-column>
        <el-table-column label="租金(元)" prop="HouseRent" align="center" width="260"></el-table-column>
        <el-table-column label="开始时间" align="center" width="260">
          <template slot-scope="scope">{{ $dateFormat(scope.row.StartTime, 'yyyy-MM-dd') }}</template>
        </el-table-column>
        <el-table-column label="到期时间" align="center" width="260">
          <template slot-scope="scope">{{ $dateFormat(scope.row.EndTime, 'yyyy-MM-dd') }}</template>
        </el-table-column>
        <el-table-column label="管家" prop="EmployeeName" align="center" width="260"></el-table-column>
        <el-table-column label="备注" prop="BZ" align="center" width="260" fixed="right"></el-table-column>
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
import { SelectTenantContractExcelList } from '@/api/report'
import { SearchPanel, BottomToolBar } from '@/components'
import SelectEmployee from '@/components/SelectEmployee'
import PrintTemplate from '@/components/PrintTemplate' // 打印组件

export default ({
  name: 'Expiration',
  data() {
    return {
      isDisabled: true,
      ruleForm: {
        KeyWord: '',
        Time: [],
        manger: '',
        EmployeeFullID: '',
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
      return SelectTenantContractExcelList({
        parm: pages,
        KeyWord: this.ruleForm.KeyWord,
        StartDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[0], 'yyyy/MM/dd'),
        EndDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[1], 'yyyy/MM/dd'),
        EmployeeFullID: this.ruleForm.EmployeeFullID,
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
      this.ruleForm.EmployeeFullID = !data.fullID ? data.FullID : data.fullID
      this.ruleForm.EmployeeName = !data.label ? data.UserName : data.label
    },
    search() {
      this.$refs.bottomToolBar.search()
    },
    reset() {
      this.ruleForm.KeyWord = ''
      this.ruleForm.Time = []
      this.ruleForm.EmployeeFullID = ''
      this.ruleForm.EmployeeName = ''
      this.$refs.bottomToolBar.search()
    },
    handlePrint() {
      this.$refs.printTemplate.open({
        busType: 'ReportStaing',
        busNum: 1,
        searchData: {
          KeyWord: this.ruleForm.KeyWord,
          StartDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[0], 'yyyy/MM/dd'),
          EndDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[1], 'yyyy/MM/dd'),
          EmployeeFullID: this.ruleForm.EmployeeFullID
        },
        title: '客户到期'
      })
    },
    // 导出表格
    downloadExcel() {
      this.downloadLoading = true
      SelectTenantContractExcelList({
        parm: {
          size: this.pageSize,
          page: 1
        },
        KeyWord: this.ruleForm.KeyWord,
        StartDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[0], 'yyyy/MM/dd'),
        EndDate: !this.ruleForm.Time ? '' : this.$dateFormat(this.ruleForm.Time[1], 'yyyy/MM/dd'),
        EmployeeFullID: this.ruleForm.EmployeeFullID,
        isAll: true
      }).then(response => {
        if (response.Code === 0) {
          // response.Data.rows.forEach(ele => {
          //   ele.newInfo = ele.TenantName + '-' + ele.TenantPhone
          // })
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['房源编号', '区域', '物业地址', '门牌号', '客户姓名', '客户电话', '押金', '租金', '开始时间', '到期时间', '管家', '备注']
            const filterVal = ['HouseCode', 'CityName', 'CommunityName', 'HouseNumber', 'TenantName', 'TenantPhone', 'HouseDeposit', 'HouseRent', 'StartTime', 'EndTime', 'EmployeeName', 'BZ']
            const data = this.formatJson(filterVal, !response.Data ? [] : response.Data.rows)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '客户到期报表'
            })
            this.downloadLoading = false
          })
        }
      })
    },
    // 格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'EndTime' || j === 'StartTime') {
          return this.$dateFormat(v[j])
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
