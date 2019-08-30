<template>
  <div class="app-container  data-list">
    <search-panel :model="form" ref="ruleForm" label-width="80px" show>
      <template slot="search">
        <el-form-item label="测算对象">
          <el-select v-model="form.Type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-if="form.Type === '1'" v-model="form.CompanyID" placeholder="请选择公司">
            <el-option
              v-for="item in companyList"
              :key="item.KeyID"
              :label="item.CompanyName"
              :value="item.KeyID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <select-department
            v-if="form.Type==='2'"
            @change="handleTepClick"
          >
            <el-input v-model="DepName"
                      placeholder="请选择部门"
                      :maxlength="20"></el-input>
          </select-department>
        </el-form-item>
        <el-form-item>
          <select-employee
            @empChange="handleEmpClick"
          >
            <el-input v-if="form.Type === '3'" v-model="HouseOwnerName" placeholder="请输入负责人姓名"
                      :maxlength="10"></el-input>
          </select-employee>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="统计周期">
            <el-radio-group v-model="form.TimeType">
              <el-radio label="1">年</el-radio>
              <el-radio label="2">月</el-radio>
              <el-radio label="0">统计全部</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </template>
      <template slot="button">
        <el-button
          type="primary"
          @click="measureSearch">查询
        </el-button>
        <!--<el-button-->
        <!--type="primary"-->
        <!--@click="keywordReset">重置-->
        <!--</el-button>-->
        <el-button
          type="primary"
          @click="download"
          :loading="downloadLoading">导出
        </el-button>
        <el-button
          type="primary"
          :disabled="canPrint"
          @click="printTemplate">打印
        </el-button>
        <!--<el-button-->
        <!--type="primary"-->
        <!--@click="download"-->
        <!--:loading="downloadLoading"-->
        <!--v-setbtn:Export>导出</el-button>-->
        <!--<el-button-->
        <!--type="primary"-->
        <!--@click="printTemplate"-->
        <!--v-setbtn:Print>打印</el-button>-->
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
        <el-table-column v-if="Type!=='0'" label="公司名称" align="center" prop="CompanyName">
        </el-table-column>
        <el-table-column v-if="Type!=='0' &&Type!=='1'" label="部门名称" align="center" prop="DepName">
        </el-table-column>
        <el-table-column v-if="Type==='3'" label="管房人名称" align="center" prop="OwnerName">
        </el-table-column>
        <el-table-column v-if="TimeType!=='0'" label="预算时间" align="center">
          <template slot-scope="scope">
            <div v-if="TimeType==='1'"> {{ $dateFormat(scope.row.Time,'yyyy') }}</div>
            <div v-if="TimeType==='2'">{{ $dateFormat(scope.row.Time,'yyyy-MM') }}</div>
          </template>
        </el-table-column>
        <el-table-column label=" 预算次数
            " align="center" prop="BudgetNum">
        </el-table-column>
        <el-table-column label="核算次数" align="center" prop="CheckNum">
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
  import SelectEmployee from '@/components/SelectEmployee'
  import { SearchPanel, BottomToolBar, SelectDepartment } from '@/components'
  import { selectComAuthority } from '@/api/system'
  import PrintTemplate from '@/components/PrintTemplate' // 打印组件
  import { Calculation } from '@/api/report'

  export default {
    name: 'index',
    components: {
      SearchPanel,
      BottomToolBar,
      PrintTemplate,
      SelectEmployee,
      selectComAuthority,
      SelectDepartment
    },
    data() {
      return {
        form: {
          Type: '0',
          TimeType: '1',
          CompanyID: '',
          DepID: '',
          HouseOwnerID: ''
        },
        canPrint: true,
        records: 0,
        companyList: [],
        Type: '',
        TimeType: '',
        CompanyName: '',
        DepName: '',
        HouseOwnerName: '',
        IsChooseCompany: false,
        IsChooseDep: false,
        IsChoosePrincipal: false,
        options: [
          {
            value: '0',
            label: '全部'
          }, {
            value: '1',
            label: '公司'
          }, {
            value: '2',
            label: '部门'
          }, {
            value: '3',
            label: '管房人'
          }],
        tableData: [],
        listLoading: false,
        pageSize: 10,
        downloadLoading: false
      }
    },
    created() {
      this.getCompanyList()
    },
    methods: {
      getCompanyList() {
        selectComAuthority().then(res => {
          this.companyList = res.Data.ComList
        })
      },
      handleEmpClick(val) {
        this.HouseOwnerName = val.UserName
        this.form.HouseOwnerID = val.KeyID
      },
      handleTepClick(val) {
        this.DepName = val.label
        this.form.DepID = val.id
      },
      fetchData(pages) {
        const CompanyID = this.form.Type === '1' ? this.form.CompanyID : '0'
        const DepID = this.form.Type === '2' ? this.form.DepID : '0'
        const HouseOwnerID = this.form.Type === '3' ? this.form.HouseOwnerID : '0'
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        return Calculation({
          parm: pages,
          Type: this.form.Type,
          State: this.form.TimeType,
          IsAll: false,
          CompanyID,
          DepID,
          HouseOwnerID
        }).then(response => {
          this.records = response.Data.records
          this.listLoading = false
          this.tableData = response.Data.rows
          this.Type = this.form.Type
          this.TimeType = this.form.TimeType
          this.canPrint = false
          return response.Data
        })
      },
      printTemplate() {
        const CompanyID = this.form.Type === '1' ? this.form.CompanyID : '0'
        const DepID = this.form.Type === '2' ? this.form.DepID : '0'
        const HouseOwnerID = this.form.Type === '3' ? this.form.HouseOwnerID : '0'
        this.$refs.printTemplate.open({
          searchData: {
            Type: this.form.Type,
            State: this.form.TimeType,
            CompanyID,
            DepID,
            HouseOwnerID
          },
          title: '测算报表',
          IsShowYear: '',
          busType: 'MeasureReports',
          busNum: 1,
          row: {}
        })
      },
      // 导出表格
      download() {
        const CompanyID = this.form.Type === '1' ? this.form.CompanyID : '0'
        const DepID = this.form.Type === '2' ? this.form.DepID : '0'
        const HouseOwnerID = this.form.Type === '3' ? this.form.HouseOwnerID : '0'
        const pages = {
          size: this.records,
          page: 1
        }
        Calculation({
          parm: pages,
          Type: this.form.Type,
          State: this.form.TimeType,
          CompanyID,
          DepID,
          HouseOwnerID,
          isAll: true
        }).then(response => {
          if (response.Code === 0) {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
              let tHeader = []
              let filament = []
              let arr1 = []
              let arr2 = []
              if (this.form.Type === '3') { // 测算对象为管房人
                tHeader = ['公司名称', '部门名称', '管房人名称']
                filament = ['CompanyName', 'DepName', 'OwnerName']
              } else if (this.form.Type === '1') { // 测算对象为公司
                tHeader = ['公司名称']
                filament = ['CompanyName']
              } else if (this.form.Type === '2') { // 测算对象为部门
                tHeader = ['公司名称', '部门名称']
                filament = ['CompanyName', 'DepName']
              }
              // 当时间周期为统计全部时没有时间
              arr1 = this.form.TimeType === '0' ? ['预算次数', '核算次数'] : ['时间', '预算次数', '核算次数']
              arr2 = this.form.TimeType === '0' ? ['BudgetNum', 'CheckNum'] : ['Time', 'BudgetNum', 'CheckNum']
              tHeader.push(...arr1)
              filament.push(...arr2)
              const data = this.formatJson(filament, response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '测算报表'
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
            return this.form.TimeType === '1' ? this.$dateFormat(v[j], 'yyyy') : this.$dateFormat(v[j], 'yyyy-MM')
          } else {
            return v[j]
          }
        }))
      },
      measureSearch() {
        this.$refs.bottomToolBar.search()
      }
      //
      // keywordReset() {
      //   this.$refs.ruleForm.resetFields()
      //   this.$refs.bottomToolBar.search()
      // }
    }
  }
</script>

<style scoped>

</style>
