<template>
  <div class="app-container data-list">
    <search-panel :model="query" ref="query" label-width="80px">
      <template slot="search">
        <!--<el-form-item label="统计方式">-->
          <!--<el-select v-model="ruleForm.TaxType" placeholder="全部">-->
            <!--<el-option-->
              <!--v-for="item in enumTaxType"-->
              <!--:key="item.Value"-->
              <!--:label="item.Description"-->
              <!--:value="item.Value"-->
            <!--&gt;</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
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
      <!--<template slot="more">-->
        <!--<div class="clearfix">-->
        <!---->
        <!--</div>-->
      <!--</template>-->
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
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
        <el-table-column label="今日" prop="Today" align="center"></el-table-column>
        <el-table-column label="1-3天" align="center" prop="OneToThree"></el-table-column>
        <el-table-column label="4-7天" prop="FourToSeven" align="center"></el-table-column>
        <el-table-column label="8-10天" prop="EightToTen" align="center"></el-table-column>
        <el-table-column label="11-15天" prop="ElevenToFifteen" align="center"></el-table-column>
        <el-table-column label="15天以上" prop="FifteenAbove" align="center"></el-table-column>
        <el-table-column label="总计" prop="Total" align="center"></el-table-column>
        <el-table-column label="收租率" prop="RentRate" align="center"></el-table-column>
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
  import { SearchRentCollectionOverdue } from '@/api/report'
  import PrintTemplate from '@/components/PrintTemplate' // 打印组件

  export default {
    name: 'index',
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
          FullID: ''
        },
        ItemIndex: 0,
        tableData: [],
        listLoading: false,
        downloadLoading: false,
        pageSize: 10,
        enumTaxType: [
          { Value: 1, Description: '按合同录入时间' },
          { Value: 2, Description: '按合同开始时间' }
        ]
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
      // 获取门店
      changeStore(store) {
        console.log(store)
        this.query.FullID = store.fullID
      },
      // 导出
      handleExport() {
        this.downloadLoading = true
        SearchRentCollectionOverdue({
          param: {
            size: this.pageSize,
            page: 1
          },
          FullID: this.query.FullID,
          isAll: true
        }).then(response => {
          if (response.Code === 0) {
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['月份', '今日', '1至3天', '4至7天', '8至10天', '11至15天', '十五天以上', '合计', '收租率']
              const filterVal = ['Time', 'Today', 'OneToThree', 'FourToSeven', 'EightToTen', 'ElevenToFifteen', 'FifteenAbove', 'Total', 'RentRate']
              const data = this.formatJson(filterVal, !response.Data ? [] : response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '收租逾期报表'
              })
              this.downloadLoading = false
            })
          }
        })
      },
      // 打印
      handlePrint() {
        this.$refs.printTemplate.open({
          busType: 'RentCollectionOverdue',
          busNum: 1,
          searchData: {
            Type: this.query.Type,
            FullID: this.query.FullID
          },
          title: '收租逾期'
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
        return SearchRentCollectionOverdue({
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
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
