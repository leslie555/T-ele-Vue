<template>
  <div class="app-container data-list">
    <search-panel :model="form" ref="ruleForm" show>
      <template slot="search">
        <el-form-item>
          <el-radio-group v-model="form.Type">
            <el-radio label="0">月报表</el-radio>
            <el-radio label="1">年报表</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公司">
          <select-store class="select-company" @change="changeStore">
          </select-store>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button
          type="primary"
          @click="reportsSearch">查询
        </el-button>
        <el-button
          type="primary"
          @click="download"
          v-setbtn:Export
          :loading="downloadLoading">导出
        </el-button>
        <el-button
          type="primary"
          :disabled="canPrint"
          v-setbtn:Print
          @click="printTemplate">打印
        </el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table
        :data="tableData"
        border
        stripe
        v-loading.body="listLoading"
        element-loading-text="加载中"
        :header-cell-style="{background: '#ECF5FF'}"
        max-height="600"
      >
        <el-table-column label="月份" fixed="left" width="120px" align="center" prop="YearMonth">
        </el-table-column>
        <el-table-column label="业主租金" align="center" min-width="80px" prop="OwnerRent">
        </el-table-column>
        <el-table-column label="升级改造费" align="center" min-width="100px" prop="UpgradingFee">
        </el-table-column>
        <el-table-column label="维修保洁费" align="center" min-width="100px" prop="RepairAndCleanFee">
        </el-table-column>
        <el-table-column label="员工奖励" align="center" min-width="80px" prop="EmployeeAwardFee">
        </el-table-column>
        <el-table-column label="员工薪资支出" align="center" min-width="120px" prop="EmployeeSalariesFee">
        </el-table-column>
        <el-table-column label="税收支出" align="center" min-width="80px" prop="TaxFee">
        </el-table-column>
        <el-table-column label="运营支出" align="center" min-width="80px" prop="OperateFee">
        </el-table-column>
        <el-table-column label="租客退租退款" align="center" min-width="120px" prop="TenantRentRefund">
        </el-table-column>
        <el-table-column label="押金退款" align="center" min-width="80px" prop="DepositRefund">
        </el-table-column>
        <el-table-column label="第三方还款" align="center" min-width="100px" prop="ThirdPartyPayment">
        </el-table-column>
        <el-table-column label="其他办款（支）" align="center" min-width="120px" prop="OtherFeePay">
        </el-table-column>
        <el-table-column label="其他支出" align="center" min-width="80px" prop="OtherFee">
        </el-table-column>
        <el-table-column label="合计" fixed="right" width="120px" align="center" prop="TotalPay">
        </el-table-column>
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
  import { SearchPanel, BottomToolBar, SelectStore } from '@/components'
  import PrintTemplate from '@/components/PrintTemplate' // 打印组件
  import { SelectPayReport } from '../../../api/report.js'

  export default {
    name: 'index',
    components: {
      SearchPanel,
      BottomToolBar,
      PrintTemplate,
      SelectStore
    },
    data() {
      return {
        form: {
          Type: '0',
          FullID: ''
        },
        ruleForm: {},
        canPrint: true,
        records: 0,
        tableData: [],
        listLoading: false,
        pageSize: 10,
        downloadLoading: false
      }
    },
    methods: {
      reportsSearch() {
        this.$refs.bottomToolBar.search()
      },
      changeStore(val) {
        this.form.FullID = val.fullID
      },
      // 导出表格
      download() {
        const pages = {
          size: this.records,
          page: 1
        }
        SelectPayReport({
          param: pages,
          Type: this.form.Type,
          FullID: this.form.FullID,
          isAll: true
        }).then(response => {
          if (response.Code === 0) {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['月份', '业主租金', '升级改造费', '维修保洁费', '员工奖励', '员工薪资支出', '税收支出', '运营支出', '租客退租退款', '押金退款', '第三方还款', '其他办款（支）', '其他支出', '合计']
              const filament = ['YearMonth', 'OwnerRent', 'UpgradingFee', 'RepairAndCleanFee', 'EmployeeAwardFee', 'EmployeeSalariesFee', 'TaxFee', 'OperateFee', 'TenantRentRefund', 'DepositRefund', 'ThirdPartyPayment', 'OtherFeePay', 'OtherFee', 'TotalPay']
              const data = this.formatJson(filament, response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '支出报表'
              })
              this.downloadLoading = false
            })
          }
        })
      },
      // 格式化
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'Time') {
            return this.form.Type === '1' ? this.$dateFormat(v[j], 'yyyy') : this.$dateFormat(v[j], 'yyyy-MM')
          } else {
            return v[j]
          }
        }))
      },
      printTemplate() {
        this.$refs.printTemplate.open({
          searchData: {
            Type: this.form.Type,
            FullID: this.form.FullID
          },
          title: '支出报表',
          IsShowYear: '',
          busType: 'ExpendReports',
          busNum: 1,
          row: {}
        })
      },
      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        return SelectPayReport({
          param: pages,
          Type: this.form.Type,
          FullID: this.form.FullID,
          IsAll: false
        }).then(response => {
          this.records = response.Data.records
          this.listLoading = false
          this.tableData = response.Data.rows
          this.canPrint = false
          return response.Data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .select-company {
    width: 250px;
  }
</style>
