<template>
  <div class="app-container data-list">
    <search-panel :model="searchForm" ref="searchForm" label-width="80px" box-flex right-width="270px">
       <template slot="search">
          <el-form-item label="">
            <el-radio-group v-model="DateTypeStr" size="medium" :disabled="selectedDateLine" @change="handleDateType">
              <el-radio-button label="全部" ></el-radio-button>
              <el-radio-button label="今天" ></el-radio-button>
              <el-radio-button label="近3天"></el-radio-button>
              <el-radio-button label="近7天"></el-radio-button>
            </el-radio-group>
          </el-form-item >
          <el-form-item label-width="120px" label="退房日期" prop="CheckoutTime">
            <el-date-picker
              v-model="CheckoutTime"
              @change="handleDate(CheckoutTime, 1)"
              type="daterange"
              align="right"
              unlink-panels
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="处理状态" prop="ProcessingState">
            <el-select v-model="searchForm.ProcessingState" placeholder="请选择">
              <el-option
                :label="item.Description"
                :value="item.Value"
                v-for="item in ProcessingState"
                :key="item.Value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="紧急状态" prop="EmergencyState">
            <el-select v-model="searchForm.EmergencyState" placeholder="请选择">
              <el-option
                :label="item.Description"
                :value="item.Value"
                v-for="item in EmergencyState"
                :key="item.Value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房源名称" prop="HouseName">
            <el-input v-model="searchForm.HouseName" placeholder="请输入房源名称"></el-input>
          </el-form-item>
          <SelectOrganization v-model="searchForm.FullIDNew"></SelectOrganization>
          <el-form-item label-width="120px" label="退押金日期" prop="ReturnDepositTime">
            <el-date-picker
              v-model="ReturnDepositTime"
              @change="handleDate(ReturnDepositTime, 2)"
              type="daterange"
              align="right"
              unlink-panels
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="合同编号" prop="ContractNumber">
            <el-input v-model="searchForm.ContractNumber" placeholder="请输入合同编号"></el-input>
          </el-form-item>
          <el-form-item label="租客" prop="TenNameOrPhone">
            <el-input v-model="searchForm.TenNameOrPhone" placeholder="请输入租客姓名或电话"></el-input>
          </el-form-item>
        </div>
      </template>
      <template slot="button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="download" :loading="downloadLoading">导出</el-button> 
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table :data="filterList" border fit height="100%" class="table-normal" v-loading.body="listLoading" element-loading-text="加载中">
        <el-table-column align="center" prop="CheckOutDate" label="退房日期" min-width="120"></el-table-column>
        <el-table-column align="center" label="合同编号" min-width="130">
          <template slot-scope="scope">
            <span class="contract-num" @click="handleContractDetail(scope.row)">{{scope.row.ContractNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="租客信息" min-width="130">
          <template slot-scope="scope">
            <div>{{scope.row.TenantName}}</div>
            <div>{{scope.row.TenantPhone}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="HouseName" label="房源名称" min-width="130"></el-table-column>
        <el-table-column align="center" prop="HouseRent" label="租金" min-width="90"></el-table-column>
        <el-table-column align="center" prop="HouseDeposit" label="押金" min-width="90"></el-table-column>
        <el-table-column align="center" prop="ActualReceive" label="退房金额(元)" min-width="90"></el-table-column>
        <el-table-column align="center" prop="PaymentDay" label="退押金日期" min-width="90"></el-table-column>
        <el-table-column align="center" prop="BankAccount" label="银行卡号" min-width="130"></el-table-column>
        <el-table-column align="center" prop="TenBankName" label="账户名称" min-width="100"> </el-table-column>
        <el-table-column align="center" prop="OpenBankName" label="开户行" min-width="120"> </el-table-column>
        <el-table-column align="center" prop="SaleManName" label="退房人" min-width="90"> </el-table-column>
        <el-table-column align="center" prop="EmergencyState" label="紧急状态" min-width="80"> </el-table-column>
        <el-table-column align="center" prop="ProcessingState" label="处理状态" min-width="80"> </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <table-buttons
              :options="operationButton"
              :condition="scope.row.Operation"
              @handleDoneClick="handleDone(scope.row, scope.$index)"
              @handleCheckoutDetailClick="handleCheckoutDetail(scope.row,scope.$index)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="PageSize"
      :handlePageChange="fetchData"
    ></bottom-tool-bar>
    <bills-preview ref="billsPreview" is-detail hide-detail></bills-preview>
  </div>
</template>
<script>
  import { QueryReturnDeposit, ModifyHandleStatus } from '@/api/tenant'
  import {
    BottomToolBar,
    SearchPanel,
    TableButtons
    } from '../../../components'
  import SelectOrganization from '@/components/SelectOrganization'
  import { BillsPreview } from '../../Tenant/ContractList/components'

  export default {
    name: 'OwnerExpire',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      BillsPreview,
      SelectOrganization
    },
    data() {
      return {
        form: {
          Type: '0',
          FullID: ''
        }, // 导出表格
        selectedDateLine: false, // 禁用radio-group
        listLoading: false, // 请求列表loading
        downloadLoading: false, // 下载按钮loading
        totalRecords: '', // 查询到数据条数
        filterList: [],
        PageSize: 10,
        CheckoutTime: ['', ''], // 退房日期
        ReturnDepositTime: ['', ''], // 退押金日期
        DateTypeStr: '全部',
        // 搜索条件
        searchForm: {
          DateType: 0, // 时间类型（默认全部）
          StartTime: '',
          EndTime: '',
          ReturnDepositStartTime: '',
          ReturnDepositEndTime: '',
          ProcessingState: 0, // 处理状态
          EmergencyState: 0, // 紧急状态，
          HouseName: '', // 房源名称
          FullIDNew: '',
          ContractNumber: '', // 合同编号
          TenNameOrPhone: '' // 租客信息
        },
        operationButton: [
          {
            key: 'Done',
            value: '处理完成',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'CheckoutDetail',
            value: '退房详情',
            type: 'primary',
            size: 'mini'
          }]
      }
    },
    computed: {
      ProcessingState() {
        const ProcessingState = this.$EnumData.getEnumListByKey('ProcessingState')
        return ProcessingState
      },
      EmergencyState() {
        const EmergencyState = this.$EnumData.getEnumListByKey('EmergencyState')
        return EmergencyState
      }
    },
    activated() {
      this.$refs.bottomToolBar.search(1) // 通过search调用fetchData
    },
    methods: {
      handleDate(val, type) {
        if (val) {
          this.DateTypeStr = '今天'
          this.selectedDateLine = true
          this.searchForm.DateType = 0
          if (type === 1) {
            this.searchForm.StartTime = this.$dateFormat(val[0])
            this.searchForm.EndTime = this.$dateFormat(val[1])
          } else {
            this.searchForm.ReturnDepositStartTime = this.$dateFormat(val[0])
            this.searchForm.ReturnDepositEndTime = this.$dateFormat(val[1])
          }
        } else {
            this.selectedDateLine = false
            if (type === 1) {
              this.CheckoutTime = ['', '']
              this.searchForm.StartTime = ''
              this.searchForm.EndTime = ''
             } else {
              this.ReturnDepositTime = ['', '']
              this.searchForm.ReturnDepositStartTime = ''
              this.searchForm.ReturnDepositEndTime = ''
            }
         }
      },
      handleDateType() {
        if (this.DateTypeStr === '全部') {
          this.searchForm.DateType = 0
        } else if (this.DateTypeStr === '今天') {
          this.searchForm.DateType = 1
        } else if (this.DateTypeStr === '近3天') {
          this.searchForm.DateType = 2
        } else {
          this.searchForm.DateType = 3
        }
      },
      handleDone(data, index) {
        ModifyHandleStatus({ KeyID: data.KeyID }).then(({ Data }) => {
          Data.Operation = ['CheckoutDetail']
          this.filterList = [...this.filterList, Data]
          this.fetchData()
        })
      },
      // 查看退房
      handleCheckoutDetail(row) {
        this.$refs.billsPreview.open({
          contractID: row.ContractID
        })
      },
      // 默认加载页面查询数据方法
      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.PageSize,
            page: 1
          }
        }
        this.listLoading = true
        return QueryReturnDeposit({
          parm: pages,
          ...this.searchForm
          // screen: { ...this.searchForm }
        }).then(({ Data }) => {
          this.totalRecords = Data.records
          this.listLoading = false
          this.filterList = Data.rows.map(item => {
            item.CheckOutDate = this.$dateFormat(item.CheckOutDate)
            item.PaymentDay = this.$dateFormat(item.PaymentDay)
             if (item.ProcessingState === 2) {
              item.Operation = ['CheckoutDetail']
            } else {
               item.Operation = ['Done', 'CheckoutDetail']
            }
            item.ProcessingState = this.$EnumData.getEnumDesByValue('ProcessingState', item.ProcessingState)
            item.EmergencyState = this.$EnumData.getEnumDesByValue('EmergencyState', item.EmergencyState)
            return item
          })
          return Data
        })
      },
      // 进入合同详情
      handleContractDetail(row) {
        this.$router.push({
          path: '/Tenant/ContractDetail',
          query: {
            KeyID: row.ContractID // 合同ID
          }
        })
        console.log('合同编号详情row:', row)
      },
      // 根据筛选条件查询列表
      submitForm() {
        this.$refs.bottomToolBar.search()
      },
      // 点击重置按钮
      resetForm() {
        this.selectedDateLine = false
        this.DateTypeStr = '全部'
        this.searchForm.DateType = 0
        this.searchForm.StartTime = ''
        this.searchForm.EndTime = ''
        this.CheckoutTime = ['', '']
        this.ReturnDepositTime = ['', '']
        this.searchForm.ReturnDepositStartTime = ''
        this.searchForm.ReturnDepositEndTime = ''
        this.$refs.searchForm.resetFields()
        this.$refs.bottomToolBar.search()
      },
      // 导出表格
      download() {
        const pages = {
          size: this.totalRecords,
          page: 1
        }
        this.downloadLoading = true
        QueryReturnDeposit({
          parm: pages,
          ...this.searchForm,
          isAll: 1
        }).then(({ Data }) => {
            const myData = Data.rows.map(item => {
              item.CheckoutDate = this.$dateFormat(item.CheckOutDate)
              const myArr = [{ eDesc: '全部', hDesc: '全部' }, { eDesc: '不加急', hDesc: '未处理' }, { eDesc: '加急', hDesc: '已处理' }]
              item.EmergencyState = myArr[item.EmergencyState].eDesc
              item.ProcessingState = myArr[item.ProcessingState].hDesc
              item.TenantInfo = `${item.TenantName} ${item.TenantPhone}`
              item.PaymentDay = this.$dateFormat(item.PaymentDay)
              return item
            })
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['退房日期', '合同编号', '租客信息', '房源名称', '租金', '押金', '退房金额(元)', '退押金日期', '银行卡号', '账户名称', '开户行', '退房人', '紧急状态', '处理状态']
              const filement = ['CheckoutDate', 'ContractNumber', 'TenantInfo', 'HouseName', 'HouseRent', 'HouseDeposit', 'ActualReceive', 'PaymentDay', 'BankAccount', 'TenBankName', 'OpenBankName', 'SaleManName', 'EmergencyState', 'ProcessingState']
              const data = this.formatJson(filement, myData)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '租客退押金列表'
              })
              this.downloadLoading = false
            })
        })
      },
      // 导出表格格式化
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'Time') {
            return this.form.Type === '1' ? this.$dateFormat(v[j], 'yyyy') : this.$dateFormat(v[j], 'yyyy-MM')
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/mixin.scss";
  .contract-num {
    color: #49f;
    cursor: pointer;
  }
</style>
