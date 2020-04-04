<template>
  <div class="app-container data-list">
    <search-panel :model="OwnerPaymentForm" ref="ruleForm" label-width="80px" show>
      <template slot="search">
        <div class="clearfix">
          <el-form-item label="关键字">
            <el-input
              v-model="OwnerPaymentForm.KeyWord"
              autocomplete="off"
              placeholder="银行名称/转款人/房源编号/电话/房主名字"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <SelectOrganization v-model="OwnerPaymentForm.FullIDNew"></SelectOrganization>
          <!-- <el-form-item label="门店选择">
            <select-store ref="selectStore" @change="handleChange"></select-store>
          </el-form-item> -->
        </div>
      </template>
      <template slot="more">
        <el-form-item label="付款日期">
          <el-date-picker
            v-model="OwnerPaymentForm.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-select v-model="OwnerPaymentForm.PayType" placeholder="请选择">
            <el-option
              v-for="item in PayType"
              :key="item.Value"
              :label="item.Description"
              :value="item.Value"
            ></el-option>
          </el-select>
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
        <el-table-column
          label="房源编号"
          prop="ContractNumber"
          align="center"
          width="160px"
          fixed="left"
        ></el-table-column>
        <el-table-column label="房主" align="center" prop="OwnerName"></el-table-column>
        <el-table-column label="区域" align="center" prop="CityName"></el-table-column>
        <el-table-column label="物业地址" align="center" prop="HouseName" width="260"></el-table-column>
        <el-table-column label="联系电话" align="center" prop="OwnerPhone" width="180"></el-table-column>
        <el-table-column label="有效期" align="center" width="260">
          <template slot-scope="scope">
            {{ $dateFormat(scope.row.BillStartDate, 'yyyy/MM/dd') }}--{{ $dateFormat(scope.row.BillEndDate, 'yyyy/MM/dd')
            }}
          </template>
        </el-table-column>
        <el-table-column label="付款日期" align="center" width="200">
          <template slot-scope="scope">{{$dateFormat(scope.row.PayableDate, 'yyyy-MM-dd')}}</template>
        </el-table-column>
        <el-table-column label="银行名称" prop="BankName" align="center"></el-table-column>
        <el-table-column label="银行卡号" prop="BankAccount" align="center" width="260"></el-table-column>
        <el-table-column label="转款人" prop="TransferPerson" align="center"></el-table-column>
        <el-table-column label="未付金额" prop="NoPaidMoney" align="center"></el-table-column>
        <el-table-column label="支出金额" prop="PaidMoney" align="center"></el-table-column>
        <el-table-column label="应付金额" prop="PayableMoney" align="center"></el-table-column>
        <el-table-column label="备注" prop="Remark" align="center" fixed="right"></el-table-column>
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
  import { SearchPanel, BottomToolBar, SelectStore, SelectOrganization } from '@/components'
  import PrintTemplate from '@/components/PrintTemplate' // 打印组件
  import { SelectOwnerPaymentList } from '@/api/report'

  export default {
    name: 'index',
    components: {
      SearchPanel,
      BottomToolBar,
      PrintTemplate,
      SelectStore,
      SelectOrganization
    },
    data() {
      return {
        isDisabled: true,
        OwnerPaymentForm: {
          KeyWord: '',
          date: '',
          EndTime: '',
          StartTime: '',
          PayType: 0,
          FullID: '',
          FullIDNew: ''
        },
        downloadLoading: false,
        listLoading: false,
        tableData: [],
        pageSize: 10
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
        if (this.OwnerPaymentForm.date !== null) {
          this.OwnerPaymentForm.StartTime = this.$dateFormat(this.OwnerPaymentForm.date[0], 'yyyy-MM-dd 00:00:00')
          this.OwnerPaymentForm.EndTime = this.$dateFormat(this.OwnerPaymentForm.date[1], 'yyyy-MM-dd 00:00:00')
        }
        this.listLoading = true
        return SelectOwnerPaymentList({
          ...this.OwnerPaymentForm,
          parm: pages,
          StartTime: !this.OwnerPaymentForm.date ? '' : this.$dateFormat(this.OwnerPaymentForm.date[0], 'yyyy-MM-dd 00:00:00'),
          EndTime: !this.OwnerPaymentForm.date ? '' : this.$dateFormat(this.OwnerPaymentForm.date[1], 'yyyy-MM-dd 00:00:00'),
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
      // handleChange(val) {
      //   this.OwnerPaymentForm.FullID = val.fullID
      // },
      search() {
        this.$refs.bottomToolBar.search()
      },
      reset() {
        this.OwnerPaymentForm.KeyWord = ''
        this.OwnerPaymentForm.FullID = ''
        this.OwnerPaymentForm.FullIDNew = ''
        this.OwnerPaymentForm.StartTime = ''
        this.OwnerPaymentForm.EndTime = ''
        this.OwnerPaymentForm.PayType = 0
        this.OwnerPaymentForm.date = null
        // this.$refs.selectStore.reset()
        this.$refs.bottomToolBar.search()
      },
      printTemplate() {
        this.$refs.printTemplate.open({
          busType: 'OwnerPayment',
          busNum: 1,
          searchData: {
            KeyWord: this.OwnerPaymentForm.KeyWord,
            PayType: this.OwnerPaymentForm.PayType,
            StartTime: !this.OwnerPaymentForm.date ? '' : this.$dateFormat(this.OwnerPaymentForm.date[0], 'yyyy-MM-dd 00:00:00'),
            EndTime: !this.OwnerPaymentForm.date ? '' : this.$dateFormat(this.OwnerPaymentForm.date[1], 'yyyy-MM-dd 00:00:00')
          },
          title: '房东付款'
        })
      },
      // 导出表格
      download() {
        this.downloadLoading = true
        SelectOwnerPaymentList({
          ...this.OwnerPaymentForm,
          StartTime: !this.OwnerPaymentForm.date ? '' : this.$dateFormat(this.OwnerPaymentForm.date[0], 'yyyy-MM-dd 00:00:00'),
          EndTime: !this.OwnerPaymentForm.date ? '' : this.$dateFormat(this.OwnerPaymentForm.date[1], 'yyyy-MM-dd 00:00:00'),
          isAll: true,
          parm: {
            size: this.pageSize,
            page: 1
          }
        }).then(response => {
          if (response.Code === 0) {
            this.listLoading = false
            response.Data.rows.forEach(ele => {
              ele.BillDate = `${this.$dateFormat(ele.BillStartDate, 'yyyy/MM/dd')}--${this.$dateFormat(ele.BillEndDate, 'yyyy/MM/dd')}`
            })
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['房源编号', '房主', '区域', '物业地址', '联系电话', '有效期', '付款日期', '银行名称', '银行卡号', '转款人', '未付金额', '支出金额', '应付金额', '备注']
              const filament = ['ContractNumber', 'OwnerName', 'CityName', 'HouseName', 'OwnerPhone', 'BillDate', 'PayableDate', 'BankName', 'BankAccount', 'TransferPerson', 'NoPaidMoney', 'PaidMoney', 'PayableMoney', 'Remark']
              const data = this.formatJson(filament, !response.Data ? [] : response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '房东付款报表'
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
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'PayableDate') {
            return this.$dateFormat(v[j])
          } else {
            return v[j]
          }
        }))
      }
    },
    computed: {
      PayType() {
        console.log(this.$EnumData.getEnumListByKey('EquipmentType'))
        return this.$EnumData.getEnumListByKey('CollectionType')
      }
    }
  }
</script>

<style scoped>
</style>
