<template>
  <div class="app-container data-list">
    <search-panel :model="searchForm" ref="searchForm" label-width="100px">
      <template slot="search">
        <el-form-item label="关键字" prop="Keyword" class="form-item-md">
          <el-input placeholder="请输入房源名称、房源编号、租客合同编号" v-model="searchForm.Keyword"></el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="税收类型" class prop="TaxType" label-width="100px">
            <el-select v-model="searchForm.TaxType" placeholder="请选择">
              <el-option
                v-for="item in enumTaxType"
                :key="item.Value"
                :label="item.Description"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" prop="CreaterTime" label-width="100px">
            <el-date-picker
              v-model="searchForm.CreaterTime"
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
      </template>
    </search-panel>

    <div class="panel content-container">
      <div class="count-all-container">
        <span>
          上税 (元)
          <span class="maohao">:</span>
          {{$priceFormat(countAll.PayTaxesMoney)}}
        </span>
        <span>
          退税 (元)
          <span class="maohao">:</span>
          {{$priceFormat(countAll.DrawbackMoney)}}
        </span>
        <span>
          合计税收 (元)
          <span class="maohao">:</span>
          {{$priceFormat(countAll.RevenueMoney)}}
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
          <el-table-column align="center" label="房源名称" min-width="120">
            <template slot-scope="scope">{{scope.row.HouseName}}</template>
          </el-table-column>
          <el-table-column align="center" label="房源编号" prop="HouseCode" min-width="120">
            <template slot-scope="scope">{{scope.row.HouseCode}}</template>
          </el-table-column>
          <el-table-column
            label="业主合同编号"
            min-width="120"
            prop=" OwnerContractNumber"
            align="center"
          >
            <template slot-scope="scope">{{scope.row. OwnerContractNumber}}</template>
          </el-table-column>
          <el-table-column label="租客合同编号" min-width="140" align="center">
            <template slot-scope="scope">{{scope.row.TenContractNumber}}</template>
          </el-table-column>
          <el-table-column class-name="status-col" label="租客租金" min-width="120" align="center">
            <template slot-scope="scope">{{scope.row.TenHouseRent}}</template>
          </el-table-column>
          <el-table-column align="center" prop="ActualDate" label="房间成本" min-width="120">
            <template slot-scope="scope">{{scope.row.HouseCost}}</template>
          </el-table-column>
          <el-table-column align="center" prop="TaxRates" label="税率(%)" min-width="60">
            <template slot-scope="scope">{{$priceFormat(scope.row.TaxRates, 1)}}</template>
          </el-table-column>
          <el-table-column align="center" prop="TaxRateMoney" label="税收金额" min-width="80">
            <template slot-scope="scope">{{$priceFormat(scope.row.TaxRateMoney)}}</template>
          </el-table-column>
          <el-table-column align="center" prop="EmployeeName" label="税收类型" min-width="80">
            <template
              slot-scope="scope"
            >{{$EnumData.getEnumDesByValue('TaxType',scope.row.TaxType)}}</template>
          </el-table-column>
          <el-table-column align="center" prop="CreaterTime" label="创建时间" min-width="220">
            <template slot-scope="scope">{{$dateFormat(scope.row.CreaterTime,'yyyy-MM-dd hh:mm')}}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="GetTableData"></bottom-tool-bar>
  </div>
</template>
<script>
  // GetTenantList 是从API文档中定义过来的方法
  import { QueryFinanceTax, QueryTaxrevenueInfoSubtotal } from '@/api/finance'
  // 引入公用样式组件
  import SearchPanel from '@/components/SearchPanel' // 引入整个样式布局组件
  import BottomToolBar from '@/components/BottomToolBar'
  export default {
    name: 'FinanceTax',
    data() {
      return {
        tableData: [],
        listLoading: false,
        pageSize: 10,
        searchForm: {
          parm: {
            page: 1,
            size: 10
          },
          Keyword: '',
          TaxType: '',
          StartTime: '',
          EndTime: '',
          CreaterTime: []
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
      BottomToolBar
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
        this.searchForm.parm = pages
        this.listLoading = true
        if (!this.searchForm.CreaterTime) {
          this.searchForm.CreaterTime = []
        }
        this.searchForm.StartTime = this.searchForm.CreaterTime[0]
        this.searchForm.EndTime = this.searchForm.CreaterTime[1]
        return QueryFinanceTax(this.searchForm).then(({ Data, BusCode, Msg }) => {
          QueryTaxrevenueInfoSubtotal(this.searchForm).then(res => {
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
      // 点击重置按钮
      handleEmptyValue() {
        this.$refs['searchForm'].resetFields()
        this.$refs.bottomToolBar.search()
      }
    },
    computed: {
      enumTaxType() {
        return this.$EnumData.getEnumListByKey('TaxType')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content-container {
    padding: 0;
    margin: 0;
    flex: 1 1 0%;
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

