<template>
  <div>
    <search-panel :model="form" ref="ruleForm">
      <template slot="search">
        <el-form-item>
          <el-radio-group v-model="form.Type">
            <el-radio label="1">月报表</el-radio>
            <el-radio label="2">年报表</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公司">
          <select-store class="select-company" @change="changeStore">
          </select-store>
        </el-form-item>
      </template>
      <template slot="more">
        <el-form-item label="账户类型">
          <el-select v-model="form.AccountType" placeholder="请选择">
            <el-option label="全部" value="0"></el-option>
            <el-option
              v-for="item in accountTypeList"
              :key="item.KeyID"
              :label="item.Name"
              :value="item.KeyID">
            </el-option>
          </el-select>
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
        <el-table-column label="账户类型" align="center" min-width="80px" prop="AccountTypeName">
        </el-table-column>
        <el-table-column label="账户名称" align="center" min-width="80px" prop="AccountName">
        </el-table-column>
        <el-table-column label="账号" align="center" min-width="80px" prop="AccountNumber">
        </el-table-column>
        <el-table-column label="银行名称" align="center" min-width="80px" prop="BankName">
        </el-table-column>
        <el-table-column label="期初余额" align="center" min-width="80px" prop="InitialBalance">
        </el-table-column>
        <el-table-column label="进账" align="center" min-width="80px" prop="AccountAdvance">
        </el-table-column>
        <el-table-column label="出账" align="center" min-width="80px" prop="OutOfAccount">
        </el-table-column>
        <el-table-column label="余额" fixed="right" width="100px" align="center" prop="Balance">
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
  import { SelectCashFlow } from '../../../api/report.js'

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
          FullID: '',
          AccountType: '0'
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
    computed: {
      accountTypeList() {
        return this.$EnumData.getEnumListByKey('AccountType').map(item => {
          return {
            KeyID: item.Value,
            Name: item.Description
          }
        })
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
        SelectCashFlow({
          param: pages,
          Type: this.form.Type,
          FullID: this.form.FullID,
          AccountType: this.form.AccountType,
          isAll: true
        }).then(response => {
          if (response.Code === 0) {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['月份', '账户类型', '账户名称', '账号', '银行名称', '期初余额', '进账', '出账', '余额']
              const filament = ['YearMonth', 'AccountTypeName', 'AccountName', 'AccountNumber', 'BankName', 'InitialBalance', 'AccountAdvance', 'OutOfAccount', 'Balance']
              const data = this.formatJson(filament, response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '现金流水'
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
            FullID: this.form.FullID,
            AccountType: this.form.AccountType
          },
          title: '现金流水',
          IsShowYear: '',
          busType: 'CashFlow',
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
        return SelectCashFlow({
          param: pages,
          Type: this.form.Type,
          FullID: this.form.FullID,
          AccountType: this.form.AccountType,
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
