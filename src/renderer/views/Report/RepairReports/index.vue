<template>
  <div>
    <search-panel>
      <template slot="search">
        <el-form-item>
          <el-radio-group v-model="Type">
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
        <el-table-column label="月份" fixed="left" width="120px" align="center" prop="Time">
        </el-table-column>
        <el-table-column label="装修合计（间）" align="center" min-width="80px" prop="RepairTotal">
        </el-table-column>
        <el-table-column label="装修耗时（天）" align="center" min-width="80px" prop="RepairTime">
        </el-table-column>
        <el-table-column label="装修费（业主）" align="center" min-width="80px" prop="OwnerRepairCosts">
        </el-table-column>
        <el-table-column label="装修贷" align="center" min-width="80px" prop="RepairLoan">
        </el-table-column>
        <el-table-column label="装修贷利息" align="center" min-width="80px" prop="RepairLoanInteres">
        </el-table-column>
        <el-table-column label="装修费（公司代付）" align="center" min-width="80px" prop="CompRepairCosts">
        </el-table-column>
        <el-table-column label="装修费合计（元）" fixed="right" width="140px" align="center" prop="RepairCostsTotal">
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
  import { QueryRepairReportList } from '../../../api/report.js'

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
        Type: '0',
        SelectFullID: '',
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
        this.SelectFullID = val.fullID
      },
      // 导出表格
      download() {
        const pages = {
          size: this.records,
          page: 1
        }
        QueryRepairReportList({
          param: pages,
          Type: this.Type,
          FullID: this.SelectFullID,
          isAll: true
        }).then(response => {
          if (response.Code === 0) {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['月份', '装修合计（间）', '装修耗时（天）', '装修费（业主）', '装修贷', '装修贷利息', '装修费（公司代付）', '装修费合计（元）']
              const filament = ['Time', 'RepairTotal', 'RepairTime', 'OwnerRepairCosts', 'RepairLoan', 'RepairLoanInteres', 'CompRepairCosts', 'RepairCostsTotal']
              const data = this.formatJson(filament, !response.Data ? [] : response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '装修报表'
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
            return this.Type === '1' ? this.$dateFormat(v[j], 'yyyy') : this.$dateFormat(v[j], 'yyyy-MM')
          } else {
            return v[j]
          }
        }))
      },
      printTemplate() {
        this.$refs.printTemplate.open({
          searchData: {
            FullID: this.SelectFullID,
            Type: this.Type
          },
          title: '装修报表',
          IsShowYear: '',
          busType: 'RepairReports',
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
        return QueryRepairReportList({
          param: pages,
          FullID: this.SelectFullID,
          Type: this.Type,
          isAll: false
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
    width: 350px;
  }
</style>
