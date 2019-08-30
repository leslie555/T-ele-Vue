<template>
  <div class="app-container data-list">
    <search-panel :model="OtherFrom" ref="ruleForm" label-width="80px" show>
      <template slot="search">
        <el-form-item label="收款账户" class prop="Type" label-width="100px">
          <el-select v-model="OtherFrom.Type" placeholder="请选择">
            <el-option
              v-for="(item,index) in accountData"
              :key="index"
              :label="item.label"
              :value="item.Value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" class prop="State" label-width="100px">
          <el-select v-model="OtherFrom.State" placeholder="请选择">
            <el-option
              v-for="(item,index) in YearData"
              :key="index"
              :label="item.label"
              :value="item.Value"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="primary" @click="download" :loading="downloadLoading" v-setbtn:Export>导出</el-button>
        <el-button type="primary" @click="printTemplate" v-setbtn:Print>打印</el-button>
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
        <el-table-column label="预计可入金额" prop="BudgetAllAchievement " align="center" width="160px"></el-table-column>
        <el-table-column label="实际可入金额" align="center" prop="CheckAllAchievement"></el-table-column>
        <el-table-column v-show="OtherFrom.State > 0" label="日期" align="center" prop="Time"></el-table-column>
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
import { SearchPanel, BottomToolBar } from '@/components'
import PrintTemplate from '@/components/PrintTemplate' // 打印组件
import { SearchAchievement } from '@/api/report'
export default {
  name: 'index',
  components: {
    SearchPanel,
    BottomToolBar,
    PrintTemplate
  },
  data() {
    return {
      OtherFrom: {
        Type: '',
        State: ''
      },
      accountData: [
        { label: '公司', Value: 1 },
        { label: '部门', Value: 2 },
        { label: '管房人', Value: 3 }
      ],
      YearData: [
        { label: '全部', Value: 0 },
        { label: '年', Value: 1 },
        { label: '月', Value: 2 }
      ],
      listLoading: false,
      tableData: [],
      pageSize: 10,
      downloadLoading: false,
      records: 0
    }
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
      return SearchAchievement({
        parm: pages,
        Type: this.OtherFrom.Type,
        State: this.OtherFrom.State,
        isAll: false
      }).then(response => {
        if (response.Code === 0) {
          this.listLoading = false
          this.tableData = response.Data.rows
          this.records = response.Data.records
          return response.Data
        }
      })
    },
    search() {
      this.$refs.bottomToolBar.search()
    },
    reset() {
      this.OtherFrom.Type = ''
      this.OtherFrom.State = ''
      this.$refs.bottomToolBar.search()
    },
    printTemplate() {
      this.$refs.printTemplate.open({
        busType: 'achievement',
        busNum: 1,
        searchData: {
          Type: this.OtherFrom.Type,
          State: this.OtherFrom.State
        },
        title: '业绩报表',
        IsShowYear: this.OtherFrom.State
      })
      // SearchAchievement({
      //   parm: {
      //     size: this.records,
      //     page: 1
      //   },
      //   Type: this.OtherFrom.Type,
      //   State: this.OtherFrom.State,
      //   isAll: true
      // }).then(response => {
      //   if (response.Code === 0) {
      //     this.listLoading = false
      //     this.$refs.printTemplate.open({
      //       busType: 'achievement',
      //       busNum: 1,
      //       row: response.Data.rows,
      //       title: '业绩报表',
      //       IsShowYear: this.OtherFrom.State
      //     })
      //     this.downloadLoading = false
      //   }
      // })
    },
    // 导出表格
    download() {
      SearchAchievement({
        parm: {
          size: this.records,
          page: 1
        },
        Type: this.OtherFrom.Type,
        State: this.OtherFrom.State,
        isAll: true
      }).then(response => {
        if (response.Code === 0) {
          this.listLoading = false
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            var tHeader = []
            var filament = []
            if (this.OtherFrom.State === 0) {
              tHeader = ['预计可入金额', '实际可入金额']
              filament = ['BudgetAllAchievement', 'CheckAllAchievement']
            } else if (this.OtherFrom.State > 0) {
              tHeader = ['预计可入金额', '实际可入金额', '日期']
              filament = ['BudgetAllAchievement', 'CheckAllAchievement', 'Time']
            }
            const data = this.formatJson(filament, !response.Data ? [] : response.Data.rows)
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
    // 格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (this.OtherFrom.State > 0 && j === 'Time') {
          return this.$dateFormat(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>
</style>
