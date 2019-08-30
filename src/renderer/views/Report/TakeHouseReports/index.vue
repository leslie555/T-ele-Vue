<template>
  <div>
    <search-panel :model="form" ref="ruleForm">
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
        <el-table-column label="有起租" align="center" min-width="80px" prop="RentCreation">
        </el-table-column>
        <el-table-column label="有免租" align="center" min-width="80px" prop="RentFree">
        </el-table-column>
        <el-table-column label="改造" align="center" min-width="80px" prop="Reform">
        </el-table-column>
        <el-table-column label="第一年不付" align="center" min-width="80px" prop="NoPayFirstYear">
        </el-table-column>
        <el-table-column label="10%10%" align="center" min-width="80px" prop="DoubleTenPercent">
        </el-table-column>
        <el-table-column label="Y模式" align="center" min-width="80px" prop="Ymodel">
        </el-table-column>
        <el-table-column label="5+1模式" align="center" min-width="80px" prop="FivePlusOneModel">
        </el-table-column>
        <el-table-column label="2333模式" align="center" min-width="80px" prop="TwoThreeModel">
        </el-table-column>
        <el-table-column label="23331模式" align="center" min-width="100px" prop="TwoThreeOneModel">
        </el-table-column>
        <el-table-column label="其他模式" fixed="right" width="100px" align="center" prop="OtherModel">
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
  import { SelectTakeHouseReport } from '../../../api/report.js'

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
        SelectTakeHouseReport({
          param: pages,
          Type: this.form.Type,
          FullID: this.form.FullID,
          isAll: true
        }).then(response => {
          if (response.Code === 0) {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['月份', '拿房数量', '有起租', '有免租', '改造', '第一年不付', '10%10%', 'Y模式', '5+1模式', '2333模式', '23331模式', '其他模式']
              const filament = ['YearMonth', 'TakeHouseCount', 'RentCreation', 'RentFree', 'Reform', 'NoPayFirstYear', 'DoubleTenPercent', 'Ymodel', 'FivePlusOneModel', 'TwoThreeModel', 'TwoThreeOneModel', 'OtherModel']
              const data = this.formatJson(filament, response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '拿房报表'
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
          title: '拿房报表',
          IsShowYear: '',
          busType: 'TakeHouseReports',
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
        return SelectTakeHouseReport({
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
