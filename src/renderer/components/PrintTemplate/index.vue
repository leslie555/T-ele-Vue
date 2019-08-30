<template>
  <el-dialog
    title="打印预览"
    :visible.sync="dialogVisible"
    class="upload-dialog"
    append-to-body
    :width="busType === 'ReportStaing' ? '960px' : '800px'"
  >
    <div class="PrintBox">
      <div :id="uuid">
        <payment-bill-one v-if="busType == 'PaymentBill' && busNum == 1" :PrintData="KeyID"></payment-bill-one>
        <payment-bill-two v-if="busType == 'PaymentBill' && busNum == 2" :PrintData="KeyID"></payment-bill-two>
        <receipt-bill-one v-if="busType == 'ReceiptBill' && busNum == 1" :printData="KeyID"></receipt-bill-one>
        <receipt-bill-two v-if="busType == 'ReceiptBill' && busNum == 2" :printData="KeyID"></receipt-bill-two>
        <housing-deposit-one v-if="busType == 'ReceiptBill' && busNum == 3" :printData="KeyID"></housing-deposit-one>
        <report-staing-one
          v-if="busType == 'ReportStaing' && busNum == 1"
          :printData="tableArr"
          :title="tableTitle"
        ></report-staing-one>
        <report-staing-two
          v-if="busType == 'ReportStaing' && busNum == 2"
          :printData="tableArr"
          :title="tableTitle"
        ></report-staing-two>
        <customer-collection-one
          v-if="busType == 'CustomerCollection' && busNum == 1"
          :printData="tableArr"
          :title="tableTitle"
        ></customer-collection-one>
        <other-reports
          v-if="busType == 'OtherReports' && busNum == 1"
          :printData="tableArr"
          :title="tableTitle"
        ></other-reports>
        <owner-expires
          v-if="busType == 'OwnerExpires' && busNum == 1"
          :printData="tableArr"
          :title="tableTitle"
        ></owner-expires>
        <owner-payment
          v-if="busType == 'OwnerPayment' && busNum == 1"
          :printData="tableArr"
          :title="tableTitle"
        ></owner-payment>
        <achievement
          v-if="busType == 'achievement' && busNum == 1"
          :printData="tableArr"
          :title="tableTitle"
          :IsShowYear="IsShowYear"
        ></achievement>
        <measure-reports
          v-if="busType === 'MeasureReports' && busNum === 1"
          :printData="tableObj"
          :title="tableTitle">
        </measure-reports>
        <vacant-report
          v-if="busType == 'VacantReport' && busNum == 2"
          :printData="tableArr"
          :title="tableTitle"
        >
        </vacant-report>
        <break-tenant-contract
          v-if="busType == 'BreakTenantContract' && busNum == 1"
          :printData="tableArr"
          :title="tableTitle"
        >
        </break-tenant-contract>
        <break-owner-contract
          v-if="busType == 'BreakOwnerContract' && busNum == 1"
          :printData="tableArr"
          :title="tableTitle"
        >
        </break-owner-contract>
        <get-guest-collection
          v-if="busType == 'GetGuestCollection' && busNum == 1"
          :printData="tableArr"
          :title="tableTitle"
        >
        </get-guest-collection>
        <out-guest-collection
          v-if="busType == 'OutGuestCollection' && busNum == 1"
          :printData="tableArr"
          :title="tableTitle"
        >
        </out-guest-collection>
        <rent-collection-overdue
          v-if="busType == 'RentCollectionOverdue' && busNum == 1"
          :printData="tableArr"
          :title="tableTitle"
        >
        </rent-collection-overdue>
        <income-reports v-if="busType == 'IncomeReports' && busNum == 1"
                       :printData="tableArr">
        </income-reports>
        <expend-reports v-if="busType == 'ExpendReports' && busNum == 1"
                        :printData="tableArr">
        </expend-reports>
        <take-house-reports v-if="busType == 'TakeHouseReports'&& busNum == 1"
                        :printData="tableArr">
        </take-house-reports>
        <earning-reports v-if="busType == 'EarningReports'&& busNum == 1"
                         :printData="tableArr">
        </earning-reports>
        <cash-flow v-if="busType == 'CashFlow'&& busNum == 1"
                         :printData="tableArr">
        </cash-flow>
        <repair-reports
          v-if="busType == 'RepairReports'&& busNum == 1"
          :printData="tableArr"
        >
        </repair-reports>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handlePrint">打印</el-button>
    </div>
  </el-dialog>
</template>

<script>
  /* eslint-disable no-undef */
  import PaymentBillOne from './PaymentBill/one'
  import ReceiptBillOne from './ReceiptBill/one'
  import PaymentBillTwo from './PaymentBill/two'
  import ReceiptBillTwo from './ReceiptBill/two'
  import HousingDepositOne from './HousingDeposit/one'
  import ReportStaingOne from './ReportStaing/one'
  import ReportStaingTwo from './ReportStaing/two'
  import CustomerCollectionOne from './CustomerCollection/one'
  import OtherReports from './OtherReports/OtherReports'
  import OwnerExpires from './OwnerExpires/OwnerExpires'
  import OwnerPayment from './OwnerPayment/OwnerPayment'
  import achievement from './achievement/one'
  import MeasureReports from './MeasureReports/one'
  import VacantReport from './VacantReport/VacantReport' // 空置报表
  import BreakTenantContract from './BreakTenantContract/BreakTenantContract' // 租客违约报表
  import BreakOwnerContract from './BreakOwnerContract/BreakOwnerContract' // 业主违约报表
  import GetGuestCollection from './GetGuestCollection/GetGuestCollection' // 拿房获客统计
  import OutGuestCollection from './OutGuestCollection/OutGuestCollection' // 出房获客统计
  import RentCollectionOverdue from './RentCollectionOverdue/RentCollectionOverdue' // 收租逾期
  import IncomeReports from './IncomeReports/one'
  import ExpendReports from './ExpendReports/one'
  import TakeHouseReports from './TakeHouseReports/one'
  import EarningReports from './EarningReports/one'
  import CashFlow from './CashFlow/one'
  import RepairReports from './RepairReports/one'

  import uuid from '../../utils/uuid'
  import {
    QueryStagingExcelList,
    SelectTenantReceiveList,
    SelectHouseExcelList,
    SelectTenantContractExcelList,
    SelectOwnerContractExcelList,
    SelectOwnerPaymentList,
    SearchAchievement,
    Calculation,
    SearchVacant,
    SearchBreakTenant,
    SearchBreakOwner,
    SearchGetGuestCollection,
    SearchOutGuestCollection,
    SearchRentCollectionOverdue,
    SelectIncomeReport,
    SelectPayReport,
    SelectTakeHouseReport,
    SelectPerformanceReport,
    SelectCashFlow,
    QueryRepairReportList
  } from '@/api/report'

  export default {
    components: {
      RepairReports,
      IncomeReports,
      PaymentBillOne,
      ReceiptBillOne,
      PaymentBillTwo,
      ReceiptBillTwo,
      ReportStaingOne,
      HousingDepositOne,
      ReportStaingTwo,
      CustomerCollectionOne,
      OtherReports,
      OwnerExpires,
      OwnerPayment,
      achievement,
      MeasureReports,
      VacantReport,
      BreakTenantContract,
      BreakOwnerContract,
      GetGuestCollection,
      OutGuestCollection,
      RentCollectionOverdue,
      ExpendReports,
      TakeHouseReports,
      EarningReports,
      CashFlow
    },
    data() {
      return {
        uuid: 'printBody_' + uuid(),
        dialogVisible: false,
        printLoading: false,
        busType: '',
        busNum: 0,
        KeyID: '',
        tableTitle: '',
        tableArr: [],
        // 测算报表专用（传递查询条件和数据）
        tableObj: {},
        IsShowYear: ''
      }
    },
    methods: {
      close() {
        this.dialogVisible = false
      },
      open({
             busType,
             busNum,
             searchData,
             title,
             IsShowYear,
             isList,
             row
           }) {
        if (isList !== 'yes' && this.$parent.$refs.bottomToolBar.getTotal() > 100) {
          this.$alert('温馨提示: 数据量过多,请导出或筛选后再打印')
          return
        } else {
          this.printLoading = false
          this.busType = busType
          this.busNum = busNum
          this.IsShowYear = IsShowYear
          this.dialogVisible = true
          if (title) {
            this.tableTitle = title
          }
          if (busType === 'PaymentBill' && busNum === 1) {
            this.KeyID = row.KeyID
          } else if (busType === 'PaymentBill' && busNum === 2) {
            this.KeyID = row.KeyID
          } else if (busType === 'ReceiptBill' && busNum === 1) {
            this.KeyID = row.KeyID
          } else if (busType === 'ReceiptBill' && busNum === 2) {
            this.KeyID = row.KeyID
          } else if (busType === 'ReceiptBill' && busNum === 3) {
            this.KeyID = row.KeyID
          } else if (busType === 'ReportStaing' && busNum === 2) {
            debugger
            QueryStagingExcelList({
              parm: {
                size: 5,
                page: 1
              },
              KeyWord: !searchData.KeyWord ? '' : searchData.KeyWord,
              StartDate: !searchData.StartDate ? '' : searchData.StartDate,
              EndDate: !searchData.EndDate ? '' : searchData.EndDate,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              EmployeeFullID: !searchData.EmployeeFullID ? '' : searchData.EmployeeFullID,
              PayType: !searchData.PayType ? '' : searchData.PayType,
              isAll: true
            }).then(response => {
              this.tableArr = !response.Data ? [] : response.Data.rows
            })
          } else if (busType === 'ReportStaing' && busNum === 1) {
            SelectTenantContractExcelList({
              parm: {
                size: 5,
                page: 1
              },
              KeyWord: !searchData.KeyWord ? '' : searchData.KeyWord,
              StartDate: !searchData.StartDate ? '' : searchData.StartDate,
              EndDate: !searchData.EndDate ? '' : searchData.EndDate,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              EmployeeFullID: !searchData.EmployeeFullID ? '' : searchData.EmployeeFullID,
              PayType: !searchData.PayType ? '' : searchData.PayType,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableArr = !response.Data ? [] : response.Data.rows
              }
            })
          } else if (busType === 'CustomerCollection' && busNum === 1) {
            // this.tableArr = row
            SelectTenantReceiveList({
              parm: {
                size: 5,
                page: 1
              },
              KeyWord: !searchData.KeyWord ? '' : searchData.KeyWord,
              StartTime: !searchData.StartTime ? '' : searchData.StartTime,
              EndTime: !searchData.EndTime ? '' : searchData.EndTime,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              EmployeeFullID: !searchData.EmployeeFullID ? '' : searchData.EmployeeFullID,
              PayType: !searchData.PayType ? '' : searchData.PayType,
              isAll: true
            }).then(response => {
              this.tableArr = !response.Data ? [] : response.Data.rows
            })
          } else if (busType === 'OtherReports' && busNum === 1) {
            // this.tableArr = row
            SelectHouseExcelList({
              parm: {
                size: 5,
                page: 1
              },
              KeyWord: !searchData.KeyWord ? '' : searchData.KeyWord,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableArr = !response.Data ? [] : response.Data.rows
              }
            })
          } else if (busType === 'OwnerExpires' && busNum === 1) {
            SelectOwnerContractExcelList({
              parm: {
                size: 5,
                page: 1
              },
              KeyWord: !searchData.KeyWord ? '' : searchData.KeyWord,
              StartDate: !searchData.StartDate ? '' : searchData.StartDate,
              EndDate: !searchData.EndDate ? '' : searchData.EndDate,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              EmployeeFullID: !searchData.EmployeeFullID ? '' : searchData.EmployeeFullID,
              PayType: !searchData.PayType ? '' : searchData.PayType,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableArr = !response.Data ? [] : response.Data.rows
              }
            })
          } else if (busType === 'OwnerPayment' && busNum === 1) {
            SelectOwnerPaymentList({
              parm: {
                size: 5,
                page: 1
              },
              KeyWord: !searchData.KeyWord ? '' : searchData.KeyWord,
              StartTime: !searchData.StartTime ? '' : searchData.StartTime,
              EndTime: !searchData.EndTime ? '' : searchData.EndTime,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              EmployeeFullID: !searchData.EmployeeFullID ? '' : searchData.EmployeeFullID,
              PayType: !searchData.PayType ? '' : searchData.PayType,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableArr = !response.Data ? [] : response.Data.rows
              }
            })
          } else if (busType === 'achievement' && busNum === 1) {
            SearchAchievement({
              parm: {
                size: 5,
                page: 1
              },
              Type: !searchData.Type ? '' : searchData.Type,
              State: !searchData.State ? '' : searchData.State,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableArr = !response.Data ? [] : response.Data.rows
              }
            })
          } else if (busType === 'MeasureReports' && busNum === 1) {
            Calculation({
              parm: {
                size: 5,
                page: 1
              },
              Type: !searchData.Type ? '' : searchData.Type,
              State: !searchData.State ? '' : searchData.State,
              CompanyID: !searchData.CompanyID ? '' : searchData.CompanyID,
              DepID: !searchData.DepID ? '' : searchData.DepID,
              HouseOwnerID: !searchData.HouseOwnerID ? '' : searchData.HouseOwnerID,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableObj = {
                  ...this.tableObj,
                  Data: response.Data.rows,
                  // 测算报表传入查询条件以动态修改打印表头
                  SearchData: searchData
                }
              }
            })
          } else if (busType === 'VacantReport' && busNum === 2) {
            SearchVacant({
              param: {
                size: 5,
                page: 1
              },
              FullID: !searchData.FullID ? '' : searchData.FullID,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableArr = !response.Data ? [] : response.Data.rows
              }
            })
          } else if (busType === 'BreakTenantContract' && busNum === 1) {
            SearchBreakTenant({
              param: {
                size: 5,
                page: 1
              },
              Type: !searchData.Type ? '' : searchData.Type,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableArr = !response.Data ? [] : response.Data.rows
              }
            })
          } else if (busType === 'BreakOwnerContract' && busNum === 1) {
            SearchBreakOwner({
              param: {
                size: 5,
                page: 1
              },
              Type: !searchData.Type ? '' : searchData.Type,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableArr = !response.Data ? [] : response.Data.rows
              }
            })
          } else if (busType === 'GetGuestCollection' && busNum === 1) {
            SearchGetGuestCollection({
              param: {
                size: 5,
                page: 1
              },
              Type: !searchData.Type ? '' : searchData.Type,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableArr = !response.Data ? [] : response.Data.rows
              }
            })
          } else if (busType === 'OutGuestCollection' && busNum === 1) {
            SearchOutGuestCollection({
              param: {
                size: 5,
                page: 1
              },
              Type: !searchData.Type ? '' : searchData.Type,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableArr = !response.Data ? [] : response.Data.rows
              }
            })
          } else if (busType === 'RentCollectionOverdue' && busNum === 1) {
            SearchRentCollectionOverdue({
              param: {
                size: 5,
                page: 1
              },
              FullID: !searchData.FullID ? '' : searchData.FullID,
              isAll: true
            }).then(response => {
              if (response.Code === 0) {
                this.tableArr = !response.Data ? [] : response.Data.rows
              }
            })
          } else if (busType === 'IncomeReports' && busNum === 1) {
            SelectIncomeReport({
              param: {
                size: 5,
                page: 1
              },
              Type: searchData.Type,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              isAll: true
            }).then(res => {
              if (res.Code === 0) {
                this.tableArr = !res.Data ? [] : res.Data.rows
              }
            })
          } else if (busType === 'ExpendReports' && busNum === 1) {
            SelectPayReport({
              param: {
                size: 5,
                page: 1
              },
              Type: searchData.Type,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              isAll: true
            }).then(res => {
              if (res.Code === 0) {
                this.tableArr = !res.Data ? [] : res.Data.rows
              }
            })
          } else if (busType === 'TakeHouseReports' && busNum === 1) {
            SelectTakeHouseReport({
              param: {
                size: 5,
                page: 1
              },
              Type: searchData.Type,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              isAll: true
            }).then(res => {
              if (res.Code === 0) {
                this.tableArr = !res.Data ? [] : res.Data.rows
              }
            })
          } else if (busType === 'EarningReports' && busNum === 1) {
            SelectPerformanceReport({
              param: {
                size: 5,
                page: 1
              },
              Type: searchData.Type,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              isAll: true
            }).then(res => {
              if (res.Code === 0) {
                this.tableArr = !res.Data ? [] : res.Data.rows
              }
            })
          } else if (busType === 'CashFlow' && busNum === 1) {
            SelectCashFlow({
              param: {
                size: 5,
                page: 1
              },
              Type: searchData.Type,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              AccountType: searchData.AccountType,
              isAll: true
            }).then(res => {
              if (res.Code === 0) {
                this.tableArr = !res.Data ? [] : res.Data.rows
              }
            })
          } else if (busType === 'RepairReports' && busNum === 1) {
            QueryRepairReportList({
              param: {
                size: 5,
                page: 1
              },
              Type: searchData.Type,
              FullID: !searchData.FullID ? '' : searchData.FullID,
              isAll: true
            }).then(res => {
              if (res.Code === 0) {
                this.tableArr = !res.Data ? [] : res.Data.rows
              }
            })
          }
        }
      },
      handlePrint() {
        this.printLoading = true
        printJS({
          printable: this.uuid, // 要打印区域的元素ID
          type: 'html',
          // 继承原来的所有样式
          targetStyles: ['*'],
          onLoadingStart: () => {
            console.log(3)
          },
          onLoadingEnd: () => {
            console.log(4)
          },
          onPrintDialogClose: () => {
            console.log(5)
            this.printLoading = false
            this.close()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
