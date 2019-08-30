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
        <el-table-column label="月份" fixed="left" width="140px" align="center" prop="YearMonth">
        </el-table-column>
        <el-table-column label="租客租金" align="center" min-width="80px" prop="TenantRent">
        </el-table-column>
        <el-table-column label="租客押金" align="center" min-width="80px" prop="TenantDeposit">
        </el-table-column>
        <el-table-column label="定金违约" align="center" min-width="80px" prop="DepositDefault">
        </el-table-column>
        <el-table-column label="业主违约" align="center" min-width="80px" prop="OwnerDefault">
        </el-table-column>
        <el-table-column label="租客违约" align="center" min-width="80px" prop="TenantDefault">
        </el-table-column>
        <el-table-column label="租客到期（损坏、维修、保洁等扣款）" min-width="160px" align="center" prop="TenantExpireMoney">
        </el-table-column>
        <el-table-column label="业主付装修费" min-width="120px" align="center" prop="OwnerPaysDecorationFee">
        </el-table-column>
        <el-table-column label="第三方收入" min-width="120px" align="center" prop="ThirdPartyRevenue">
        </el-table-column>
        <el-table-column label="其他办款（收）" min-width="120px" align="center" prop="OtherFeeIncome">
        </el-table-column>
        <el-table-column label="其他收入" align="center" min-width="120px" prop="OtherInCome">
        </el-table-column>
        <el-table-column label="合计" fixed="right" width="100px" align="center" prop="TotalIncome">
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
  import { SelectIncomeReport } from '../../../api/report.js'

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
        accountOptions: [],
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
        SelectIncomeReport({
          param: pages,
          Type: this.form.Type,
          FullID: this.form.FullID,
          isAll: true
        }).then(response => {
          if (response.Code === 0) {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['月份', '租客租金', '租客押金', '定金违约', '业主违约', '租客违约', '租客到期（损坏、维修、保洁等扣款）', '业主付装修费', '第三方收入', '其他办款（收）', '其他收入', '合计']
              const filament = ['YearMonth', 'TenantRent', 'TenantDeposit', 'DepositDefault', 'OwnerDefault', 'TenantDefault', 'TenantExpireMoney', 'OwnerPaysDecorationFee', 'ThirdPartyRevenue', 'OtherFeeIncome', 'OtherInCome', 'TotalIncome']
              const data = this.formatJson(filament, response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '收入报表'
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
          title: '收入报表',
          IsShowYear: '',
          busType: 'IncomeReports',
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
        return SelectIncomeReport({
          param: pages,
          Type: this.form.Type,
          FullID: this.form.FullID,
          IsAll: false
        }).then(response => {
          this.records = response.Data.records
          this.listLoading = false
          this.tableData = response.Data.rows
          // this.Type = this.form.Type
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
