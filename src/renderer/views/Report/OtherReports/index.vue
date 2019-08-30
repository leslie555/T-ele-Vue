<template>
  <div class="app-container data-list">
    <search-panel :model="OtherFrom" ref="ruleForm" label-width="80px" show>
      <template slot="search">
        <el-form-item label="关键字">
          <el-input
            v-model="OtherFrom.KeyWord"
            autocomplete="off"
            placeholder="请输入合同编码/房源名称/管房人"
            style="width: 300px"
          ></el-input>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="primary" @click="download" :loading="downloadLoading" v-setbtn:Export>导出</el-button>
        <el-button type="primary" @click="printTemplate" v-setbtn:Print :disabled="isDisabled">打印</el-button>
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
        <el-table-column label="合同编号" prop="ContractNumber" align="center" width="160px"></el-table-column>
        <el-table-column label="房源名称" align="center" prop="HouseName"></el-table-column>
        <el-table-column label="管房人" prop="EmployeeName" align="center"></el-table-column>
        <el-table-column label="备注" prop="BZ" align="center"></el-table-column>
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
import { SelectHouseExcelList } from '@/api/report'
export default {
  name: 'index',
  components: {
    SearchPanel,
    BottomToolBar,
    PrintTemplate
  },
  data() {
    return {
      isDisabled: true,
      OtherFrom: {
        KeyWord: ''
      },
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
      return SelectHouseExcelList({
        parm: pages,
        KeyWord: this.OtherFrom.KeyWord,
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
    reset() {
      this.OtherFrom.KeyWord = ''
      this.$refs.bottomToolBar.search()
    },
    printTemplate() {
      this.$refs.printTemplate.open({
        busType: 'OtherReports',
        busNum: 1,
        searchData: {
          KeyWord: this.OtherFrom.KeyWord
        },
        title: '其他报表'
      })
    },
    // 导出表格
    download() {
      SelectHouseExcelList({
        parm: {
          size: this.records,
          page: 1
        },
        KeyWord: this.OtherFrom.KeyWord,
        isAll: true
      }).then(response => {
        if (response.Code === 0) {
          this.listLoading = false
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['合同编号', '房源名称', '管房人', '备注']
            const filament = ['ContractNumber', 'HouseName', 'EmployeeName', 'BZ']
            const data = this.formatJson(filament, !response.Data ? [] : response.Data.rows)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '其他报表'
            })
            this.downloadLoading = false
          })
        }
      })
    },
    // 格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>

<style scoped>
</style>
