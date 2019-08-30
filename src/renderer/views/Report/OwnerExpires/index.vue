<template>
  <div class="app-container data-list">
    <search-panel :model="OwnerExpiresFrom" ref="ruleForm" label-width="80px" show>
      <template slot="search">
        <el-form-item label="关键字">
          <el-input
            v-model="OwnerExpiresFrom.KeyWord"
            autocomplete="off"
            placeholder="请输入房源编码/物业地址/管房人"
            style="width: 300px"
          ></el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <el-form-item label="日期">
          <el-date-picker
            v-model="OwnerExpiresFrom.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="管房人">
          <el-input
            v-model="OwnerExpiresFrom.EmployeeName"
            style="width: 200px; margin-right: 10px;"
            :readonly="true"
          ></el-input>
          <select-employee v-show="isShowSelect" @dbClick="getPeople" @empChange="getPeople">
            <el-button type="primary" @click="popoverVisible = true" size="mini">选择</el-button>
          </select-employee>
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
        <el-table-column label="房源编号" prop="HouseCode" align="center" width="260px"></el-table-column>
        <el-table-column label="区域" align="center" prop="CityName" width="260"></el-table-column>
        <el-table-column label="物业地址" align="center" prop="CommunityName" width="260"></el-table-column>
        <el-table-column label="门牌号" align="center" prop="HouseNumber" width="180"></el-table-column>
        <el-table-column label="房主姓名" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.OwnerName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center" width="180">
          <template slot-scope="scope">
            <p>{{ scope.row.OwnerPhone }}</p>
          </template>
        </el-table-column>
        <el-table-column label="管房人" prop="EmployeeName" align="center"></el-table-column>
        <el-table-column label="托管开始时间" align="center" width="120">
           <template slot-scope="scope">{{$dateFormat(scope.row.HostStartTime, 'yyyy-MM-dd')}}</template>
        </el-table-column>
        <el-table-column label="托管到期时间" prop="HostEndTime" align="center" width="120">
          <template slot-scope="scope">{{$dateFormat(scope.row.HostEndTime, 'yyyy-MM-dd')}}</template>
        </el-table-column>
        <el-table-column label="托价" prop="JoePrice" align="center"></el-table-column>
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
import { SelectOwnerContractExcelList } from '@/api/report'
import SelectEmployee from '@/components/SelectEmployee'
export default {
  name: 'index',
  components: {
    SearchPanel,
    BottomToolBar,
    PrintTemplate,
    SelectEmployee
  },
  data() {
    return {
      isDisabled: true,
      OwnerExpiresFrom: {
        KeyWord: '',
        date: [],
        EmployeeFullID: '',
        EmployeeName: '',
        StartDate: '',
        EndDate: ''
      },
      listLoading: false,
      pageSize: 10,
      tableData: [],
      downloadLoading: false,
      isShowSelect: true,
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
      if (this.OwnerExpiresFrom.date !== null) {
        this.OwnerExpiresFrom.StartDate = this.$dateFormat(this.OwnerExpiresFrom.date[0], 'yyyy-MM-dd 00:00:00')
        this.OwnerExpiresFrom.EndDate = this.$dateFormat(this.OwnerExpiresFrom.date[1], 'yyyy-MM-dd 00:00:00')
      }
      this.listLoading = true
      return SelectOwnerContractExcelList({
        parm: pages,
        KeyWord: this.OwnerExpiresFrom.KeyWord,
        StartDate: !this.OwnerExpiresFrom.date ? '' : this.$dateFormat(this.OwnerExpiresFrom.date[0], 'yyyy-MM-dd 00:00:00'),
        EndDate: !this.OwnerExpiresFrom.date ? '' : this.$dateFormat(this.OwnerExpiresFrom.date[1], 'yyyy-MM-dd 00:00:00'),
        EmployeeFullID: this.OwnerExpiresFrom.EmployeeFullID,
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
      this.OwnerExpiresFrom.KeyWord = ''
      this.OwnerExpiresFrom.EmployeeFullID = ''
      this.OwnerExpiresFrom.EndDate = ''
      this.OwnerExpiresFrom.date = []
      this.OwnerExpiresFrom.StartDate = ''
      this.OwnerExpiresFrom.date = null
      this.OwnerExpiresFrom.EmployeeName = ''
      this.$refs.bottomToolBar.search()
    },
    printTemplate() {
      this.$refs.printTemplate.open({
        busType: 'OwnerExpires',
        busNum: 1,
        searchData: {
          KeyWord: this.OwnerExpiresFrom.KeyWord,
          StartDate: !this.OwnerExpiresFrom.date ? '' : this.$dateFormat(this.OwnerExpiresFrom.date[0], 'yyyy-MM-dd 00:00:00'),
          EndDate: !this.OwnerExpiresFrom.date ? '' : this.$dateFormat(this.OwnerExpiresFrom.date[1], 'yyyy-MM-dd 00:00:00'),
          EmployeeFullID: this.OwnerExpiresFrom.EmployeeFullID
        },
        title: '房东到期'
      })
    },
    // 导出表格
    download() {
      SelectOwnerContractExcelList({
        parm: {
          size: this.records,
          page: 1
        },
        KeyWord: this.OwnerExpiresFrom.KeyWord,
        StartDate: !this.OwnerExpiresFrom.date ? '' : this.$dateFormat(this.OwnerExpiresFrom.date[0], 'yyyy-MM-dd 00:00:00'),
        EndDate: !this.OwnerExpiresFrom.date ? '' : this.$dateFormat(this.OwnerExpiresFrom.date[1], 'yyyy-MM-dd 00:00:00'),
        EmployeeFullID: this.OwnerExpiresFrom.EmployeeFullID,
        isAll: true
      }).then(response => {
        if (response.Code === 0) {
          this.listLoading = false
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['房源编号', '区域', '物业地址', '门牌号', '房主姓名', '联系电话', '管房人', '托管开始时间', '托管到期时间', '托价', '备注']
            const filament = ['HouseCode', 'CityName', 'CommunityName', 'HouseNumber', 'OwnerName', 'OwnerPhone', 'EmployeeName', 'HostStartTime', 'HostEndTime', 'JoePrice', 'BZ']
            const data = this.formatJson(filament, !response.Data ? [] : response.Data.rows)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '房东到期报表'
            })
            this.downloadLoading = false
          })
        }
      })
    },
    // 格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'HostEndTime' || j === 'HostStartTime') {
          return this.$dateFormat(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getPeople(data) {
      this.OwnerExpiresFrom.EmployeeFullID = !data.fullID ? data.FullID : data.fullID
      this.OwnerExpiresFrom.EmployeeName = !data.label ? data.UserName : data.label
    }
  }
}
</script>

<style scoped>
</style>
