<template>
  <div class="app-container data-list">
    <search-panel :model="CustomerFrom" ref="ruleForm" label-width="80px" show>
      <template slot="search">
        <el-form-item label="关键字">
          <el-input
            v-model="CustomerFrom.KeyWord"
            autocomplete="off"
            placeholder="请输入房源编码/物业地址/客户姓名"
            style="width: 300px"
          ></el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <el-form-item label="日期">
          <el-date-picker
            v-model="CustomerFrom.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
        <el-table-column label="交租时间" align="center" width="200px" fixed="left" prop="PayDate"></el-table-column>
        <el-table-column label="房源编号" align="center" prop="ContractNumber" width="200px"></el-table-column>
        <el-table-column label="区域" align="center" prop="CityName" width="200px"></el-table-column>
        <el-table-column label="物业地址" align="center" prop="HouseName" width="260px"></el-table-column>
        <el-table-column label="客户姓名" prop="khxx" align="center" width="120px">
          <template slot-scope="scope">
            <p>{{scope.row.TenantName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="客户电话" prop="khxx" align="center" width="200px">
          <template slot-scope="scope">
            <p>{{scope.row.TenantPhone}}</p>
          </template>
        </el-table-column>
        <el-table-column label="房租" prop="HouseRent" align="center"></el-table-column>
        <el-table-column label="物管费" prop="ManagementFee" align="center"></el-table-column>
        <el-table-column label="其他费" prop="OtherFee" align="center"></el-table-column>
        <el-table-column label="实收金额" prop="PaidMoney" align="center"></el-table-column>
        <el-table-column label="业务员" prop="Salesman" align="center"></el-table-column>
        <el-table-column label="备注" prop="ReMark" align="center" fixed="right"></el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="fetchData"
      style="text-align: right"
    ></bottom-tool-bar>
    <!--<div class="panel count-pannel">-->
      <!--<div class="count-HouseRentTotal">-->
        <!--<span class="count-label">总房租:</span>-->
        <!--<span class="count-value">{{ HouseRentTotal }}</span>-->
      <!--</div>-->
      <!--<div class="count-HouseRentTotal">-->
        <!--<span class="count-label">总物管费:</span>-->
        <!--<span class="count-value">{{ ManagementFeeTotal }}</span>-->
      <!--</div>-->
      <!--<div class="count-HouseRentTotal">-->
        <!--<span class="count-label">总其他费用:</span>-->
        <!--<span class="count-value">{{ OtherFeeTotal }}</span>-->
      <!--</div>-->
    <!--</div>-->
    <print-template ref="printTemplate"></print-template>
  </div>
</template>

<script>
import { SearchPanel, BottomToolBar } from '@/components'
import PrintTemplate from '@/components/PrintTemplate' // 打印组件
import { SelectTenantReceiveList } from '@/api/report'
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
      HouseRentTotal: '',
      ManagementFeeTotal: '',
      OtherFeeTotal: '',
      CustomerFrom: {
        KeyWord: '',
        date: [],
        StartTime: '',
        EndTime: ''
      },
      tableData: [],
      listLoading: false,
      pageSize: 10,
      downloadLoading: false
    }
  },
  methods: {
    reset() {
      this.CustomerFrom = {
        KeyWord: '',
        date: '',
        StartTime: '',
        EndTime: ''
      }
      this.$refs.bottomToolBar.search()
      this.findCount()
    },
    search() {
      this.$refs.bottomToolBar.search()
      this.findCount()
    },
    findCount(type) {
      if (this.CustomerFrom.date !== null) {
        this.CustomerFrom.StartTime = this.$dateFormat(this.CustomerFrom.date[0], 'yyyy-MM-dd 00:00:00')
        this.CustomerFrom.EndTime = this.$dateFormat(this.CustomerFrom.date[1], 'yyyy-MM-dd 00:00:00')
      }
      // SelectTotalFee({
      //   KeyWord: this.CustomerFrom.KeyWord,
      //   StartTime: this.CustomerFrom.StartTime,
      //   EndTime: this.CustomerFrom.EndTime
      // }).then(res => {
      //   this.HouseRentTotal = res.Data.HouseRentTotal
      //   this.ManagementFeeTotal = res.Data.ManagementFeeTotal
      //   this.OtherFeeTotal = res.Data.OtherFeeTotal
      //   if (type === 'first') {
      //     this.$set(this.CustomerFrom.date, 0, res.Data.StartDate)
      //     this.$set(this.CustomerFrom.date, 1, res.Data.EndDate)
      //   }
      // })
    },
    fetchData(pages) {
      if (!pages) {
        pages = {
          size: this.pageSize,
          page: 1
        }
      }
      if (this.CustomerFrom.date !== null) {
        this.CustomerFrom.StartTime = this.$dateFormat(this.CustomerFrom.date[0], 'yyyy-MM-dd 00:00:00')
        this.CustomerFrom.EndTime = this.$dateFormat(this.CustomerFrom.date[1], 'yyyy-MM-dd 00:00:00')
      }
      this.listLoading = true
      return SelectTenantReceiveList({
        parm: pages,
        KeyWord: this.CustomerFrom.KeyWord,
        StartTime: this.CustomerFrom.StartTime,
        EndTime: this.CustomerFrom.EndTime
      }).then(response => {
        this.listLoading = false
        this.tableData = response.Data.rows
        this.isDisabled = false
        return response.Data
      })
    },
    printTemplate() {
      if (this.CustomerFrom.date !== null) {
        this.CustomerFrom.StartTime = this.$dateFormat(this.CustomerFrom.date[0], 'yyyy-MM-dd 00:00:00')
        this.CustomerFrom.EndTime = this.$dateFormat(this.CustomerFrom.date[1], 'yyyy-MM-dd 00:00:00')
      }
      this.$refs.printTemplate.open({
        busType: 'CustomerCollection',
        busNum: 1,
        searchData: {
          KeyWord: this.CustomerFrom.KeyWord,
          StartTime: this.CustomerFrom.StartTime,
          EndTime: this.CustomerFrom.EndTime
        },
        title: '客户收款'
      })
    },
    // 导出表格
    download() {
      this.downloadLoading = true
      SelectTenantReceiveList({
        parm: {
          size: this.records,
          page: 1
        },
        KeyWord: this.CustomerFrom.KeyWord,
        StartTime: this.CustomerFrom.StartTime,
        EndTime: this.CustomerFrom.EndTime,
        isAll: true
      }).then(response => {
        this.listLoading = false
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['交租时间', '房源编号', '区域', '物业地址', '客户姓名', '客户电话', '房租(元)', '物管费(元)', '其他费(元)', '实收金额', '业务员', '备注']
          const filament = ['PayDate', 'ContractNumber', 'CityName', 'HouseName', 'TenantName', 'TenantPhone', 'HouseRent', 'ManagementFee', 'OtherFee', 'PaidMoney', 'Salesman', 'ReMark']
          const data = this.formatJson(filament, !response.Data ? [] : response.Data.rows)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '客户收款报表'
          })
          this.downloadLoading = false
        })
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    // 格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'ReceivableDate') {
          return this.$dateFormat(v[j])
        } else {
          return v[j]
        }
      }))
    },
    nextMonth(date) {
      return new Date(date.getTime() + 3600 * 24 * 30 * 1000)
    }
  },
  created() {
    this.findCount('first')
  }
}
</script>

<style lang="scss" scoped>
.count-pannel {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .count-HouseRentTotal {
    width: 200px;
    .count-label {
      margin-right: 20px;
      color: #999999;
    }
    .count-value {
      color: #389ef2;
    }
  }
}
</style>
