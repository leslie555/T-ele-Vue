<template>
  <div class="app-container data-list">
    <!--<tab-change :tableList ="tableList" @changeTab="changeTab"></tab-change>-->
    <search-panel :model="query" ref="query" label-width="80px">
      <template slot="search">
        <el-form-item>
          <el-radio v-model="query.Type" label="0">月报表</el-radio>
          <el-radio v-model="query.Type" label="1">年报表</el-radio>
        </el-form-item>
        <!--<el-form-item label="月份" label-width="50px">-->
          <!--<el-date-picker-->
            <!--v-model="ruleForm.value2"-->
            <!--type="month"-->
            <!--value-format="yyyy-MM"-->
            <!--placeholder="选择月">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item label="部门">
          <select-store @change="changeStore"></select-store>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <!--<el-button type="primary" @click="reset">重置</el-button>-->
        <el-button size="medium" @click="handleExport" v-setbtn:Export type="primary">导出</el-button>
        <el-button size="medium" @click="handlePrint" v-setbtn:Print type="primary">打印</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table" style="position: relative">
      <el-table
        :data="tableData"
        v-loading.body="listLoading"
        element-loading-text="加载中"
        border
        fit
        height="100%"
        class="table-normal"
      >
        <el-table-column label="月份" prop="Time" align="center" width="160px">
          <template slot-scope="scope">{{ $dateFormat(scope.row.Time, 'yyyy-MM') }}</template>
        </el-table-column>
        <el-table-column label="0-7天" align="center" prop="ZeroToSeven"></el-table-column>
        <el-table-column label="8-15天" prop="EighToFifteen" align="center"></el-table-column>
        <el-table-column label="16-20天" prop="SixteenToTwenty" align="center"></el-table-column>
        <el-table-column label="21-30天" prop="TwentyOneToThirty" align="center"></el-table-column>
        <el-table-column label="31-50天" prop="ThirtyOneToFifty" align="center"></el-table-column>
        <el-table-column label="50天以上" prop="FiftyAbove" align="center"></el-table-column>
        <el-table-column label="空置合计" prop="Total" align="center"></el-table-column>
        <el-table-column label="空置率" prop="VacantRate" align="center"></el-table-column>
        <el-table-column label="空置成本" prop="VacantCost" align="center"></el-table-column>
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
  import { SearchPanel, BottomToolBar, ChooseDistrict, TabChange, SelectStore } from '@/components'
  import TableRemark from '@/components/TableRemark'
  import { SearchVacant } from '@/api/report'
  import PrintTemplate from '@/components/PrintTemplate' // 打印组件
  export default {
    name: 'VacantReport',
    components: {
      SearchPanel,
      BottomToolBar,
      ChooseDistrict,
      TabChange,
      SelectStore,
      TableRemark,
      PrintTemplate
    },
    data() {
      return {
        query: {
          Type: '0', // 月报表
          FullID: '' // 门店
        },
        ItemIndex: 0,
        tableData: [],
        listLoading: false,
        pageSize: 10,
        downloadLoading: false
        // enumTaxType: [
        //   { Value: 1, Description: '今日' },
        //   { Value: 2, Description: '1-3日' },
        //   { Value: 3, Description: '3-7日' },
        //   { Value: 4, Description: '7日以上' }
        // ]
      }
    },
    methods: {
      // changeTab(tab) {
      //   console.log(tab)
      //   this.ItemIndex = tab
      // },
      // select(info) {
      //   console.log(info)
      // },
      reset() {
        this.query.FullID = ''
      },
      // 获取门店
      changeStore(store) {
        console.log(store)
        debugger
        this.query.FullID = store.fullID
      },
      // 导出
      handleExport() {
        this.downloadLoading = true
        SearchVacant({
          param: {
            size: this.pageSize,
            page: 1
          },
          Type: this.query.Type,
          FullID: this.query.FullID,
          isAll: true
        }).then(response => {
          if (response.Code === 0) {
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['月份', '0-7天', '8至15天', '16至20天', '21-30天', '31至50天', '50天以上', '空置合计', '空置率', '空置成本']
              const filterVal = ['Time', 'ZeroToSeven', 'EighToFifteen', 'SixteenToTwenty', 'TwentyOneToThirty', 'ThirtyOneToFifty', 'FiftyAbove', 'Total', 'VacantRate', 'VacantCost']
              const data = this.formatJson(filterVal, !response.Data ? [] : response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '空置报表'
              })
              this.downloadLoading = false
            })
          }
        })
      },
      // 打印
      handlePrint() {
        this.$refs.printTemplate.open({
          busType: 'VacantReport',
          busNum: 2,
          searchData: {
            Type: this.query.Type,
            FullID: this.query.FullID
          },
          title: '空置报表'
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
        return SearchVacant({
          param: pages,
          query: this.query,
          isAll: false
        }).then(response => {
          if (response.Code === 0) {
            this.listLoading = false
            this.tableData = response.Data.rows
            this.records = response.Data.records
            this.isDisabled = false
            return response.Data
          }
        })
      },
      search() {
        this.$refs.bottomToolBar.search()
      },
      // 格式化
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'Time') {
            return this.$dateFormat(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
