<template>
  <div class="app-container data-list">
    <el-row class="panel data-list-table">
      <el-table :data="tableData"
                v-loading.body="listLoading"
                element-loading-text="加载中"
                border
                fit
                height="100%"
                class="table-normal">
        <el-table-column label="公司名称" prop="BusinessName" align="center" width="360px" fixed="left"></el-table-column>
        <el-table-column label="余额" prop="Balance" align="center" width="260"></el-table-column>
        <el-table-column label="预算单价" align="center" width="160">
          <template slot-scope="scope">
            <el-input v-model="scope.row.BudgetMoney" @blur="SubmitBudgetMoney(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="核算单价" align="center" width="160">
          <template slot-scope="scope">
            <el-input v-model="scope.row.CheckMoney" @blur="SubmitBudgetMoney(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="预算次数" prop="BudgetNum" align="center" width="260"></el-table-column>
        <el-table-column label="核算次数" prop="CheckNum" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="260" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" @click="OpenMoney(scope.row.KeyID)">充值</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData" style="text-align: right"></bottom-tool-bar>
    <money-use ref="CalcMoneyUse" @RechargeSuccess="RechargeSuccess"></money-use>
  </div>
</template>
<script>
import SearchPanel from '@/components/SearchPanel'
import BottomToolBar from '@/components/BottomToolBar'
import SelectEmployee from '@/components/SelectEmployee'
import { GetCompanyNumList, EditCompanyNum } from '@/api/calculate'
import MoneyUse from './components/MoneyUse'

export default {
  name: 'PriceConfig',
  components: {
    SearchPanel,
    BottomToolBar,
    SelectEmployee,
    MoneyUse
  },
  data() {
    return {
      pageSize: 10,
      CalculateInfoForm: {
        KeyWord: '',
        EmployeeID: '',
        EmployeeName: ''
      },
      // 表格数据
      tableData: [],
      listLoading: false
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
      return GetCompanyNumList({
        Parm: pages
      }).then(response => {
        if (response.Code === 0) {
          this.listLoading = false
          console.log(response.Data.rows)
          this.tableData = response.Data.rows
          // debugger
          return response.Data
        }
      })
    },
    search() {
      this.$refs.bottomToolBar.search()
    },
    OpenMoney(KeyID) {
      this.$refs['CalcMoneyUse'].open(KeyID)
    },
    SubmitBudgetMoney(row) {
      EditCompanyNum({
        BudgetMoney: row.BudgetMoney,
        CheckMoney: row.CheckMoney,
        KeyID: row.KeyID
      }).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    RechargeSuccess(obj) {
      this.tableData.forEach(ele => {
        if (ele.KeyID === obj.KeyID) {
          ele.Balance = obj.num
        }
      })
    }
  },
  activated() {
    this.$refs.bottomToolBar.search(1)
  }
}
</script>
<style lang="scss" scoped>
  // @import 'style'
</style>
