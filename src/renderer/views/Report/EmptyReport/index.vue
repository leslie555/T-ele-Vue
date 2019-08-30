<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px">
      <template slot="search">
        <el-form-item label="关键字">
          <el-input
            v-model="ruleForm.KeyWord"
            autocomplete="off"
            placeholder=""
            style="width: 350px"
          ></el-input>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="primary" @click="downloadExcel">导出</el-button>
        <el-button type="primary" @click="handlePrint">打印</el-button>
        <el-button
          type="primary"
          @click="downloadExcel"
          :loading="downloadLoading"
          v-setbtn:Export
        >导出</el-button>
        <el-button type="primary" @click="handlePrint" v-setbtn:Print>打印</el-button>
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
        <el-table-column
          label="序号"
          prop="OrderNumber"
          align="center"
          width="80px"
          fixed="left"
        ></el-table-column>
        <el-table-column
          label="合同号"
          prop="OwnerID"
          align="center"
          width="200px"
        ></el-table-column>
        <el-table-column label="管房人" align="center" prop="TubehouseempList" width="120"></el-table-column>
        <el-table-column label="业务员电话" align="center" prop="SalesmanTel" width="260"></el-table-column>
        <el-table-column label="主管" align="center" prop="Director"></el-table-column>
        <el-table-column label="区域" align="center" prop="CityName" width="200"></el-table-column>
        <el-table-column label="楼盘" align="center" prop="CommunityName" width="200"></el-table-column>
        <el-table-column label="房号" align="center" prop="RoomNum" width="160"></el-table-column>
        <el-table-column label="单间数" prop="SingleRoomNum" align="center" width="100"></el-table-column>
        <el-table-column label="空置房间号" prop="VacantRoomNum" align="center" width="120"></el-table-column>
        <el-table-column label="最后租客月租金" prop="LastTenantRent" align="center" width="120"></el-table-column>
        <el-table-column label="押金" align="center" width="120" prop="Deposit"></el-table-column>
        <el-table-column label="退押金" prop="ReturnDeposit" align="center" width="120"></el-table-column>
        <el-table-column label="退房时间" align="center" width="260">
          <template slot-scope="scope">{{ $dateFormat(scope.row.ReturnRoomTime, 'yyyy-MM-dd') }}</template>
        </el-table-column>
        <el-table-column label="截止时间" align="center" width="260">
          <template slot-scope="scope">{{ $dateFormat(scope.row.ClosingDate, 'yyyy-MM-dd') }}</template>
        </el-table-column>
        <el-table-column label="空置天数" prop="VacantDays" align="center" width="120"></el-table-column>
        <el-table-column label="1月扣空租(金额)" prop="a" align="center" width="160"></el-table-column>
        <el-table-column label="备注" prop="a" align="center" width="260" fixed="right"></el-table-column>
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
import { Vacant } from '@/api/report'
import { SearchPanel, BottomToolBar } from '@/components'
import SelectEmployee from '@/components/SelectEmployee'
import PrintTemplate from '@/components/PrintTemplate' // 打印组件

export default ({
  name: 'EmptyReport',
  data() {
    return {
      ruleForm: {
        KeyWord: '',
        CompanyID: 0
      },
      // 表格数据
      tableData: [],
      pageSize: 10,
      listLoading: false,
      downloadLoading: false
    }
  },
  components: {
    SearchPanel,
    BottomToolBar,
    SelectEmployee,
    PrintTemplate
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
      return Vacant({
        Param: pages,
        KeyWord: this.ruleForm.KeyWord,
        CompanyID: 0,
        isAll: false
      }).then(response => {
        if (response.Code === 0) {
          this.listLoading = false
          this.tableData = response.Data.rows
          return response.Data
        }
      })
    },
    search() {
      this.$refs.bottomToolBar.search()
    },
    reset() {
      this.ruleForm.KeyWord = ''
      this.ruleForm.CompanyID = 0
      this.$refs.bottomToolBar.search()
    },
    handlePrint() {
      this.$refs.printTemplate.open({
        busType: 'ReportStaing',
        busNum: 3,
        searchData: {
          KeyWord: this.ruleForm.KeyWord,
          CompanyID: 0
        },
        title: '空置报表'
      })
    },
    // 导出表格
    downloadExcel() {
      this.downloadLoading = true
      Vacant({
        Param: {
          size: this.pageSize,
          page: 1
        },
        KeyWord: this.ruleForm.KeyWord,
        CompanyID: 0,
        isAll: true
      }).then(response => {
        if (response.Code === 0) {
          // response.Data.rows.forEach(ele => {
          //   ele.newInfo = ele.CustomerName + '-' + ele.CustomerPhone
          // })
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['序号', '合同号', '管房人', '业务员电话', '主管', '区域', '楼盘', '房号', '单间数', '空置房间号', '最后租客月租金', '押金', '退押金', '退房时间', '截止时间', '空置天数', '1月扣空租(金额)', '备注']
            const filterVal = ['OrderNumber', 'OwnerID', 'TubehouseempList', 'SalesmanTel', 'Director', 'CityName', 'CommunityName', 'RoomNum', 'SingleRoomNum', 'VacantRoomNum', 'LastTenantRent', 'Deposit', 'ReturnDeposit', 'ReturnRoomTime', 'ClosingDate', 'VacantDays', 'a', 'a']
            const data = this.formatJson(filterVal, response.Data.rows)
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
    // 格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'ReturnRoomTime' || j === 'ClosingDate') {
          return this.$dateFormat(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
