<template>
  <div>
    <search-panel :model="form">
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
        <el-table-column label="拿房数量" align="center" min-width="80px" prop="TakeHouseCount">
        </el-table-column>
        <el-table-column label="空置数量" align="center" min-width="80px" prop="VacantCount">
        </el-table-column>
        <el-table-column label="出房数量" align="center" min-width="80px" prop="OutOfHouseCount">
        </el-table-column>
        <el-table-column label="出租率" align="center" min-width="80px" prop="RentalRate">
        </el-table-column>
        <el-table-column label="租客到期" align="center" min-width="80px" prop="TenantExpired">
        </el-table-column>
        <el-table-column label="租客续约" align="center" min-width="80px" prop="TenantRenewal">
        </el-table-column>
        <el-table-column label="租客续约率" align="center" min-width="80px" prop="TenantRenewalRate">
        </el-table-column>
        <el-table-column label="业主到期" align="center" min-width="80px" prop="OwnerExpired">
        </el-table-column>
        <el-table-column label="业主续约" align="center" min-width="80px" prop="OwnerRenewal">
        </el-table-column>
        <el-table-column label="业主续约率" fixed="right" width="100px" align="center" prop="OwnerRenewalRate">
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
  import { SelectPerformanceReport } from '../../../api/report.js'

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
        SelectPerformanceReport({
          param: pages,
          Type: this.form.Type,
          FullID: this.form.FullID,
          isAll: true
        }).then(response => {
          if (response.Code === 0) {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['月份', '拿房数量', '空置数量', '出房数量', '出租率', '租客到期', '租客续约', '租客续约率', '业主到期', '业主续约', '业主续约率']
              const filament = ['YearMonth', 'TakeHouseCount', 'VacantCount', 'OutOfHouseCount', 'RentalRate', 'TenantExpired', 'TenantRenewal', 'TenantRenewalRate', 'OwnerExpired', 'OwnerRenewal', 'OwnerRenewalRate']
              const data = this.formatJson(filament, response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '业绩报表'
              })
              this.downloadLoading = false
            })
          }
        })
      },
      printTemplate() {
        this.$refs.printTemplate.open({
          searchData: {
            Type: this.form.Type,
            FullID: this.form.FullID
          },
          title: '业绩报表',
          IsShowYear: '',
          busType: 'EarningReports',
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
        return SelectPerformanceReport({
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
