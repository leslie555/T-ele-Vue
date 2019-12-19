<template>
  <div class="app-container data-list">
    <search-panel
      :model="searchForm"
      ref="searchForm"
      label-width="70px"
      box-flex
      right-width="264px"
    >
      <template slot="search">
        <el-form-item label="房源名称" prop="HouseName">
          <el-input placeholder="请输入房源名称" v-model="searchForm.HouseName"></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="ContractNumber">
          <el-input placeholder="请输入合同编号" v-model="searchForm.ContractNumber"></el-input>
        </el-form-item>
        <el-form-item label="小区名称" prop="CommunityName">
          <el-input placeholder="请输入小区名称" v-model="searchForm.CommunityName"></el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="RoomNumber">
          <el-input placeholder="请输入房间号" v-model="searchForm.RoomNumber"></el-input>
        </el-form-item>
        <!--<el-form-item label="门店" prop="CompanyID">-->
          <!--<el-select v-model="searchForm.CompanyID" clearable placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in companyInfo"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value"-->
            <!--&gt;</el-option>-->
          <!--</el-select>-->
          <!--&lt;!&ndash; <select-store ref="selectStore" type="search" @change="handleStoreChange"></select-store> &ndash;&gt;-->
        <!--</el-form-item>-->
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="收支类型" class prop="ExpensesAndReceipts" label-width="80px">
            <el-select v-model="searchForm.ExpensesAndReceipts" placeholder="请选择">
              <el-option
                v-for="item in enumInOrOut"
                :key="item.Value"
                :label="item.Description"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期" prop="Time" label-width="80px">
            <el-date-picker
              v-model="searchForm.Time"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </div>
      </template>
      <template slot="button">
        <el-button size="medium" @click="handleSearch" type="primary">查询</el-button>
        <el-button size="medium" @click="handleEmptyValue" type="primary">重置</el-button>
        <el-button size="medium" @click="handleExport" :loading="downloadLoading" type="primary">导出</el-button>
      </template>
    </search-panel>

    <div class="panel content-container">
      <div class="count-all-container">
        <span>
          收入 (元)
          <span class="maohao">:</span>
          {{countAll.ExpensesCount && $priceFormat(countAll.ExpensesCount)}}
        </span>
        <span>
          支出 (元)
          <span class="maohao">:</span>
          {{countAll.ExpensesCount && $priceFormat(countAll.ReceiptsCount)}}
        </span>
        <span>
          结余 (元)
          <span class="maohao">:</span>
          {{countAll.ExpensesCount && $priceFormat(countAll.balance)}}
        </span>
      </div>
      <div class="data-list-table">
        <el-table
          :data="tableData"
          ref="multipleTable"
          v-loading.body="listLoading"
          element-loading-text="Loading"
          height="100%"
          class="table-normal"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="日期" width="120">
            <template slot-scope="scope">{{$dateFormat(scope.row.DataTime)}}</template>
          </el-table-column>
          <el-table-column align="center" label="合同编号" prop="ContractNumber" min-width="120"></el-table-column>
          <el-table-column label="出房人/经手人" min-width="80" prop="Tenant" align="center"></el-table-column>
          <el-table-column label="主管" width="80" align="center">
            <template slot-scope="scope">{{scope.row.ExecutiveDirector}}</template>
          </el-table-column>
          <el-table-column align="center" label="店名" prop="CompanyName" min-width="120"></el-table-column>
          <el-table-column class-name="status-col" label="门店经理" width="80" align="center">
            <template slot-scope="scope">{{scope.row.manager}}</template>
          </el-table-column>
          <el-table-column align="center" prop="CommunityName" label="小区" min-width="120"></el-table-column>
          <el-table-column align="center" prop="RoomNumber" label="房间号" min-width="120"></el-table-column>
          <el-table-column align="center" label="客户姓名" prop="TenantName" min-width="100"></el-table-column>
          <el-table-column align="center" prop="ExpensesAndReceipts" label="收支类型" min-width="80">
            <template
              slot-scope="scope"
            >{{$EnumData.getEnumDesByValue('InOrOut',scope.row.ExpensesAndReceipts)}}</template>
          </el-table-column>
          <el-table-column align="center" prop="SumOfMoney" label="合计金额" min-width="80">></el-table-column>
          <el-table-column align="center" prop="Detailed" label="明细" min-width="220"></el-table-column>
          <el-table-column align="center" prop="Remark" label="备注" min-width="220"></el-table-column>
        </el-table>
      </div>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="GetTableData"></bottom-tool-bar>
  </div>
</template>
<script>
  // GetTenantList 是从API文档中定义过来的方法
  import { QueryTransactionDetailsByPage, GetCountTransaction, QueryTransactionDetails } from '@/api/finance'
  // 引入公用样式组件
  import { SelectStore, SearchPanel, BottomToolBar } from '@/components'
  export default {
    name: 'FinanceTax',
    data() {
      return {
        tableData: [],
        listLoading: false,
        pageSize: 10,
        downloadLoading: false,
        searchForm: {
          Param: {
            page: 1,
            size: 10
          },
          HouseName: '',
          ContractNumber: '',
          CommunityName: '',
          RoomNumber: '',
          CompanyID: '',
          AccountInfoKeyID: +this.$route.query.accountID,
          ExpensesAndReceipts: '',
          Time: []
        },
        countAll: {
          PayTaxesMoney: '',
          DrawbackMoney: '',
          RevenueMoney: ''
        }
      }
    },
    components: {
      SearchPanel,
      BottomToolBar,
      SelectStore
    },
    // 请求ajax中定义的方法
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    methods: {
      GetTableData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.searchForm.Param = pages
        this.listLoading = true
        if (!this.searchForm.Time) {
          this.searchForm.Time = []
        }
        this.searchForm.StartTime = this.searchForm.Time[0] || ''
        this.searchForm.EndTime = this.searchForm.Time[1] || ''
        return QueryTransactionDetailsByPage(this.searchForm).then(({ Data, BusCode, Msg }) => {
          GetCountTransaction(this.searchForm).then(res => {
            this.countAll = res.Data
          })
          if (Data) {
            this.tableData = Data.rows
            this.listLoading = false
          } else {
            return
          }
          return Data
        })
      },
      // 点击查询
      handleSearch() {
        this.$refs.bottomToolBar.search()
      },
      handleStoreChange(val) {
        this.searchForm.CompanyID = val.id
      },
      // 点击重置按钮
      handleEmptyValue() {
        this.$refs['searchForm'].resetFields()
        this.$refs.bottomToolBar.search()
      },
      handleExport() {
        QueryTransactionDetails(this.searchForm).then(res => {
          if (res.Code === 0) {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['序号', '日期', '合同编号', '出房人/经手人', '主管', '店名', '门店经理', '收支', '小区名称', '房间号', '客户姓名', '明细', '收入', '支出', '结余', '备注']
              const filament = ['Num', 'DataTime', 'ContractNumber', 'Tenant', 'ExecutiveDirector', 'CompanyName', 'manager', 'ExpensesAndReceipts', 'CommunityName', 'RoomNumber', 'TenantName', 'Detailed', 'Income', 'Outcome', 'Rest', 'Remark']
              const data = this.formatJson(filament, res.Data || [])
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '账户明细'
              })
              this.downloadLoading = false
            })
          }
        }).catch(() => {
          this.downloadLoading = false
        })
      },
      // 格式化
      formatJson(filterVal, jsonData) {
        const data = jsonData.map((v, idx) => filterVal.map(j => {
          if (v[j]) {
            if (j === 'DataTime') {
              return this.$dateFormat(v[j])
            } else if (j === 'ExpensesAndReceipts') {
              return this.$EnumData.getEnumDesByValue('InOrOut', v[j])
            } else {
              return v[j]
            }
          } else {
            switch (j) {
              case 'Num':
                return idx + 1
              case 'Income':
                return v.ExpensesAndReceipts === 1 ? v.SumOfMoney : ''
              case 'Outcome':
                return v.ExpensesAndReceipts === 2 ? v.SumOfMoney : ''
              case 'Rest':
                return ''
              default:
                break
            }
          }
        }))
        const last = new Array(14).fill('')
        last[10] = this.countAll.ExpensesCount
        last[11] = this.countAll.ReceiptsCount
        last[12] = this.countAll.balance
        data.push(last)
        return data
      }
    },
    computed: {
      enumInOrOut() {
        const enumData = this.$deepCopy(this.$EnumData.getEnumListByKey('InOrOut'))
        enumData.shift()
        enumData.unshift({
          Definition: 'All',
          Description: '全部',
          Value: ''
        })
        return enumData
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content-container {
    -ms-flex: 1;
    flex: 1;
    min-height: 0;
    padding: 0;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
  }
  .count-all-container {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 12px 90px;
    margin: 12px;
    background-color: #f3f8fc;
    border: 1px solid #ebeef5;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    font-size: 14px;
  }
  .maohao {
    margin: 0 5px;
  }
</style>

