<template>
  <div class="app-container data-list">
    <!--<tab-change :tableList ="tableList" @changeTab="changeTab"></tab-change>-->
    <search-panel :model="query" ref="query" label-width="80px">
      <template slot="search">
        <el-form-item>
          <el-radio v-model="query.Type" label="0">月报表</el-radio>
          <el-radio v-model="query.Type" label="1">年报表</el-radio>
        </el-form-item>
        <!--<el-form-item label="小区">-->
        <!--<choose-district @select="select"></choose-district>-->
        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
        <!--<el-form-item label="月份">-->
        <!--<el-date-picker-->
        <!--v-model="ruleForm.value2"-->
        <!--type="month"-->
        <!--placeholder="选择月">-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item label="部门">
          <select-store @change="changeStore"></select-store>
        </el-form-item>
        <!--</template>-->
        <!--<template slot="more">-->
        <!--<div class="clearfix">-->
        <!--<el-form-item label="获客渠道">-->
        <!--<el-select v-model="ruleForm.TaxType" placeholder="请选择">-->
        <!--<el-option-->
        <!--v-for="item in enumTaxType"-->
        <!--:key="item.Value"-->
        <!--:label="item.Description"-->
        <!--:value="item.Value"-->
        <!--&gt;</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--</div>-->
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button size="medium" @click="handleExport" v-setbtn:Export type="primary">导出</el-button>
        <el-button size="medium" @click="handlePrint"  v-setbtn:Print type="primary">打印</el-button>
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
        <el-table-column label="中介" align="center" prop="Intermediary"></el-table-column>
        <el-table-column label="物业" prop="Property" align="center"></el-table-column>
        <el-table-column label="转介绍" prop="Introduction" align="center"></el-table-column>
        <el-table-column label="网络" prop="Network" align="center"></el-table-column>
        <el-table-column label="上门" prop="Door" align="center"></el-table-column>
        <el-table-column label="其他" prop="Other" align="center"></el-table-column>
        <el-table-column label="合计" prop="Total" align="center"></el-table-column>
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
   import { SearchGetGuestCollection } from '@/api/report'
  import PrintTemplate from '@/components/PrintTemplate' // 打印组件

  export default {
    name: 'index',
    components: {
      SearchPanel,
      BottomToolBar,
      ChooseDistrict,
      TabChange,
      SelectStore,
      PrintTemplate
    },
    data() {
      return {
        query: {
          Type: '0', // 月报表
          FullID: ''
        },
        ItemIndex: 0,
        tableData: [],
        listLoading: false,
        pageSize: 10,
        downloadLoading: false,
        enumTaxType: [
          { Value: '1', Description: '其他' }
        ]
        // //  选项卡设置
        // tableList: [
        //   {
        //     name: '出房'
        //   },
        //   {
        //     name: '拿房'
        //   }
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
      // 获取门店
      changeStore(store) {
        console.log(store)
        this.query.FullID = store.fullID
      },
      // 导出
      handleExport() {
        this.downloadLoading = true
        SearchGetGuestCollection({
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
              const tHeader = ['月份', '中介', '物业', '转介绍', '网络', '上门', '其他', '合计']
              const filterVal = ['Time', 'Intermediary', 'Property', 'Introduction', 'Network', 'Door', 'Other', 'Total']
              const data = this.formatJson(filterVal, !response.Data ? [] : response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '拿房获客报表'
              })
              this.downloadLoading = false
            })
          }
        })
      },
      // 打印
      handlePrint() {
        this.$refs.printTemplate.open({
          busType: 'GetGuestCollection',
          busNum: 1,
          searchData: {
            Type: this.query.Type,
            FullID: this.query.FullID
          },
          title: '拿房获客统计'
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
        return SearchGetGuestCollection({
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
  /*.changeItem {*/
  /*height: 40px;*/
  /*display: flex;*/
  /*flex-direction: row;*/
  /*.changeItemMargin {*/
  /*span {*/
  /*padding-left: 40px;*/
  /*}*/
  /*.InRoom {*/
  /*padding-left: 50px;*/
  /*font-size: 16px;*/
  /*}*/
  /*}*/
  /*}*/
</style>
