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
      <!--<template slot="more" v-if="ItemIndex === 0">-->
      <!--<div class="clearfix">-->
      <!--<el-form-item label="出租方式">-->
      <!--<el-select v-model="ruleForm.TaxType" placeholder="全部">-->
      <!--<el-option-->
      <!--v-for="item in enumTaxType"-->
      <!--:key="item.Value"-->
      <!--:label="item.Description"-->
      <!--:value="item.Value"-->
      <!--&gt;</el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--</div>-->
      <!--</template>-->
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
        <el-table-column label="违约数量" align="center" prop="DefaultNumber"></el-table-column>
        <el-table-column label="违约率" prop="DefaultRate" align="center"></el-table-column>
        <el-table-column label="整租违约" prop="AllDefault" align="center"></el-table-column>
        <el-table-column label="合租违约" prop="PartDefault" align="center"></el-table-column>
        <el-table-column label="违约收入" prop="DefaultIncome" align="center"></el-table-column>
        <el-table-column label="违约支出" prop="DefaultPay" align="center"></el-table-column>
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
  import { SearchBreakTenant } from '@/api/report'
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
          FullID: '' // 选择门店
        },
        ItemIndex: 0,
        tableData: [],
        listLoading: false,
        pageSize: 10,
        downloadLoading: false,
        enumTaxType: [
          { Value: '1', Description: '其他' }
        ],
        //  选项卡设置
        tableList: [
          {
            name: '租客违约'
          },
          {
            name: '业主违约'
          }
        ]
      }
    },
    methods: {
      // changeTab(tab) {
      //   console.log(tab)
      //   this.ItemIndex = tab
      // },
      // 获取门店
      changeStore(store) {
        console.log(store)
        this.query.FullID = store.fullID
      },
      // 导出表格
      handleExport() {
        this.downloadLoading = true
        SearchBreakTenant({
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
              const tHeader = ['月份', '违约数量', '违约率', '整租违约', '合租违约', '违约收入', '违约支出']
              const filterVal = ['Time', 'DefaultNumber', 'DefaultRate', 'AllDefault', 'PartDefault', 'DefaultIncome', 'DefaultPay']
              const data = this.formatJson(filterVal, !response.Data ? [] : response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '租客违约报表'
              })
              this.downloadLoading = false
            })
          }
        })
      },
      // 打印
      handlePrint() {
        this.$refs.printTemplate.open({
          busType: 'BreakTenantContract',
          busNum: 1,
          searchData: {
            Type: this.query.Type,
            FullID: this.query.FullID
          },
          title: '租客违约'
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
        return SearchBreakTenant({
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
