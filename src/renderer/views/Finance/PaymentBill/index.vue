<template>
  <div class="app-container data-list">
    <tab-change :tableList="tableList" @changeTab="changeTab"></tab-change>
    <search-panel
      :model="FormPaymentData"
      ref="FormPaymentData"
      label-width="80px" box-flex right-width="328px">
      <template slot="search">
        <el-form-item label="房源名称" prop="HouseName">
          <el-input placeholder="请输入房源名称"
                    v-model="FormPaymentData.HouseName"
                    style="width: 240px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="ContractNumber">
          <el-input placeholder="合同编号"
                    v-model="FormPaymentData.ContractNumber"
                    style="width: 120px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="小区名称" prop="CommunityName">
          <el-input placeholder="请输入小区名称"
                    v-model="FormPaymentData.CommunityName"
                    style="width: 150px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="RoomNumber" class="form-item-sm">
          <el-input placeholder="请输入房间号"
                    v-model="FormPaymentData.RoomNumber"
                    style="width: 200px"
          >
          </el-input>
        </el-form-item>
        <el-form-item v-if="this.ItemIndex === 1" prop="IsReimbursement">
          <el-checkbox v-model="checked" @change="handleCheckBill">报销单</el-checkbox>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <!-- <el-form-item label="门店" prop="FullID" class="form-item-sm">
            <select-store ref="selectStore" @change="changeStore"></select-store>
          </el-form-item> -->
          <SelectOrganization v-model="FormPaymentData.FullIDNew"></SelectOrganization>
          <el-form-item label="付款类型" class="" prop="BalanceType" label-width="100px">
            <el-select v-model="FormPaymentData.BalanceType" placeholder="请选择">
              <el-option
                v-for="item in PaymentMethod"
                :key="item.Value"
                :label="item.Description"
                :value="item.Value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="业务类型" prop="BusType" label-width="100px">-->
          <!--<el-select v-model="FormPaymentData.BusType" placeholder="请选择">-->
          <!--<el-option-->
          <!--v-for="item in BusType"-->
          <!--:key="item.Value"-->
          <!--:label="item.Description"-->
          <!--:value="item.Value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="账户" prop="AccountID" class="form-item-md" label-width="100px">
            <el-select v-model="FormPaymentData.AccountID" placeholder="请选择">
              <el-option
                v-for="(item, index) in accountData"
                :key="index"
                :label="item.AccountName + item.Account"
                :value="item.KeyID"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="ItemIndex === 0" label="收款方式" class="" prop="PayWay" label-width="100px">
            <el-select v-model="FormPaymentData.PayWay" placeholder="请选择">
              <el-option
                v-for="(item, index) in paymentMethods"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else label="付款方式" class="" prop="PayWay" label-width="100px">
            <el-select v-model="FormPaymentData.PayWay" placeholder="请选择">
              <el-option
                v-for="(item, index) in paymentMethods"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="日期" prop="PaymentData">
            <el-date-picker
              v-model="FormPaymentData.PaymentData"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </template>
      <template slot="button">
        <el-button size="medium" @click="handleSearch" type="primary">查询</el-button>
        <el-button size="medium" @click="handleEmptyValue" type="primary">重置</el-button>
        <el-button size="medium" @click="handleExport" v-setbtn:Export :loading="downloadLoading" type="primary">导出
        </el-button>
        <el-button size="medium" @click="handleAddNew" v-setbtn:Add type="primary">新增</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table" v-if="ItemIndex === 0">
      <el-table
        :data="ReceiveBillDataList"
        ref="multipleTable"
        v-loading.body="listLoading"
        element-loading-text="Loading"
        height="100%"
        class="table-normal"
        @selection-change="tableSelect"
        border fit highlight-current-row>
        <el-table-column align="center" fixed="left" prop="ReceiptData" label="日期" min-width="120">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.PaymentData)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label='合同编号' width="120">
          <template slot-scope="scope">
            {{scope.row.ContractNumber}}
          </template>
        </el-table-column>
        <el-table-column label="出房人/经手人" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.OutRoomName}}
          </template>
        </el-table-column>
        <el-table-column label="主管" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.EdName}}
          </template>
        </el-table-column>
        <el-table-column label="门店经理" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.StoreManager}}
          </template>
        </el-table-column>
        <el-table-column label="小区" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.CommunityName}}
          </template>
        </el-table-column>
        <el-table-column label="房间号" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.RoomNumber}}
          </template>
        </el-table-column>
        <el-table-column label="收支类型" min-width="120" prop="InOrOut" align="center">
          <template slot-scope="scope">
            <span>{{$EnumData.getEnumDesByValue('InOrOut', 1)}}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="金额" min-width="120" align="center">
          <template slot-scope="scope">
            <span>{{$priceFormat(scope.row.PaymentMoney)}}</span>
            <span>{{scope.row.PaidMoney - 0 > 0 && ((scope.row.PaidMoney - 0) !== (scope.row.PaymentMoney - 0)) ? '(已付'+ scope.row.PaidMoney + ')': ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="明细" min-width="250" align="center">
          <template slot-scope="scope">
            {{scope.row.ProjectName}}
          </template>
        </el-table-column>
        <el-table-column label="核销状态" min-width="120" prop="VerificationStatus" align="center">
          <template slot-scope="scope">
            {{$EnumData.getEnumDesByValue('VerStatus', scope.row.VerificationStatus)}}
          </template>
        </el-table-column>
        <!--<el-table-column align="center" prop="ReceivablesDate" label="预付款" min-width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{$priceFormat(scope.row.Advance)}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="ActualDate" label="付款对象" min-width="120">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.CustomerName || '无'}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="ReceivedState" label="结算方式" min-width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.BalanceType}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="ReceivedState" label="付款账户" min-width="140">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.InitialCashBank}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="EmployeeName" label="操作人" min-width="120">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.CreaterName || '无'}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="AuditStatus" label="单据状态" min-width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{$EnumData.getEnumDesByValue('AuditStatus',scope.row.AuditStatus)}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="备注" prop="Remarks" min-width="180">
          <template slot-scope="scope">
            <table-remark
              :options="tableRemarkOptions"
              :allRemark="scope.row.Remarks || '无'"
            >
            </table-remark>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="300">
          <template slot-scope="scope">
            <table-buttons
              :options="operationOwnerButton"
              :condition="handleButtons(scope.row)"
              @handleDeleteClick="handleDelete(scope.row)"
              @handleWriteClick="handleWrite(scope.row)"
              @handleUnWriteClick="handleUnWrite(scope.row)"
              @handleDetailClick="handleDetail(scope.row)"
              @handleToPayClick="handleToPay(scope.row)"
            >
              <el-popover
                v-setbtn:Print
                v-show="scope.row.VerificationStatus===2"
                placement="right"
                width="100"
                trigger="click">
                <div class="popover-btn-list">
                  <el-button type="primary"
                             plain
                             @click="handlePrint(scope.row,1)"
                             size="mini">收款单模板1
                  </el-button>
                  <el-button type="primary"
                             plain
                             @click="handlePrint(scope.row,2)"
                             size="mini">收款单模板2
                  </el-button>
                  <el-button type="primary"
                             plain
                             @click="handlePrint(scope.row,3)"
                             size="mini">房屋押金收据1
                  </el-button>
                </div>
                <el-button slot="reference"
                           plain
                           type="primary"
                           size="mini"
                >打印
                </el-button>
              </el-popover>
            </table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="panel data-list-table" v-else>
      <el-table
        :data="PaymentBillDataList"
        ref="multipleTable"
        v-loading.body="listLoading"
        element-loading-text="Loading"
        height="100%"
        class="table-normal"
        border fit highlight-current-row>
        <el-table-column align="center" fixed="left" prop="PaymentData" label="日期" min-width="180">
          <template slot-scope="scope">
            <span class="ident" v-if="scope.row.BusinessType === 11">报销单</span>
            <span>{{$dateFormat(scope.row.PaymentData)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label='合同编号' width="120">
          <template slot-scope="scope">
            {{scope.row.ContractNumber}}
          </template>
        </el-table-column>
        <el-table-column label="出房人" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.OutRoomName}}
          </template>
        </el-table-column>
        <el-table-column label="主管" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.EdName}}
          </template>
        </el-table-column>
        <el-table-column label="门店经理" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.StoreManager}}
          </template>
        </el-table-column>
        <el-table-column label="小区" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.CommunityName}}
          </template>
        </el-table-column>
        <el-table-column label="房间号" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.RoomNumber}}
          </template>
        </el-table-column>
        <el-table-column label="收支类型" min-width="120" prop="InOrOut" align="center">
          <template slot-scope="scope">
            <span>{{$EnumData.getEnumDesByValue('InOrOut', 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="金额" min-width="140" align="center">
          <template slot-scope="scope">
            <span>{{$priceFormat(scope.row.PaymentMoney)}}</span>
            <span>{{scope.row.PaidMoney - 0 > 0 && ((scope.row.PaidMoney - 0) !== (scope.row.PaymentMoney - 0)) ? '(已付'+ scope.row.PaidMoney + ')': ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="明细" min-width="250" align="center">
          <template slot-scope="scope">
            {{scope.row.ProjectName}}
          </template>
        </el-table-column>
        <el-table-column label="核销状态" min-width="120" prop="VerificationStatus" align="center">
          <template slot-scope="scope">
            {{$EnumData.getEnumDesByValue('VerStatus', scope.row.VerificationStatus)}}
          </template>
        </el-table-column>
        <!--<el-table-column align="center" prop="ReceivablesDate" label="预付款" min-width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{$priceFormat(scope.row.Advance)}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="ActualDate" label="付款对象" min-width="120">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.CustomerName || '无'}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="ReceivedState" label="结算方式" min-width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.BalanceType}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="ReceivedState" label="付款账户" min-width="140">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.InitialCashBank}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="EmployeeName" label="操作人" min-width="120">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.CreaterName || '无'}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="PaymentData" label="付款日期" min-width="120">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{$dateFormat(scope.row.PaymentData)}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="AuditStatus" label="单据状态" min-width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{$EnumData.getEnumDesByValue('AuditStatus',scope.row.AuditStatus)}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="备注" prop="Remarks" min-width="180">
          <template slot-scope="scope">
            <table-remark
              :options="tableRemarkOptions"
              :allRemark="scope.row.Remarks || '无'"
            >
            </table-remark>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="300">
          <template slot-scope="scope">
            <table-buttons
              :options="operationOwnerButton"
              :condition="handleButtons(scope.row)"
              @handleWriteClick="handleWrite(scope.row, scope.$index)"
              @handleUnWriteClick="handleUnWrite(scope.row, scope.$index)"
              @handleDetailClick="handleDetail(scope.row)"
              @handleDeleteClick="handleDelete(scope.row, scope.$index)"
              @handlePayClick="handlePay(scope.row, scope.$index)"
            >
              <el-popover
                v-setbtn:Print
                v-show="scope.row.VerificationStatus===2"
                placement="right"
                width="100"
                trigger="click">
                <div class="popover-btn-list">
                  <el-button type="primary"
                             plain
                             @click="handlePrint(scope.row,2)"
                             v-if="scope.row.BusinessType===11"
                             size="mini">报销单模板1
                  </el-button>
                  <el-button type="primary"
                             plain
                             v-else
                             @click="handlePrint(scope.row,1)"
                             size="mini">付款单模板1
                  </el-button>

                </div>
                <el-button slot="reference"
                           plain
                           type="primary"
                           size="mini">打印
                </el-button>
              </el-popover>
            </table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="GetTableData"
    >
      <!--<el-button-->
      <!--type="danger"-->
      <!--icon="delete"-->
      <!--size="mini"-->
      <!--:disabled="tableSelected.length === 0"-->
      <!--@click="handleDeleteAll">-->
      <!--<span>批量删除</span>-->
      <!--</el-button>-->
    </bottom-tool-bar>
    <add-new-paymentsingle
      ref="newPayMentSing"
      @AddNewPaymentBill="AddNewPaymentBill"
    >
    </add-new-paymentsingle>
    <edit-pay-ment-single
      ref="editPayMentSing"
      @EditNewPaymentBill="EditNewPaymentBill"
    >
    </edit-pay-ment-single>
    <detail-paymentsingle
      ref="detailPaymentSing"
    >
    </detail-paymentsingle>
    <select-pay-amount @updateBill="updateBookKeep" ref="topay"></select-pay-amount>
    <pay-dialog @updateBill="updatePaymentBill" ref="pay"></pay-dialog>
    <print-template ref="printTemplate"></print-template>
    <expense-account-template ref="expenseAccountTemplate"></expense-account-template>
    <AddMoney ref="AddMoney" @OnMoneyClick="OnMoneyClick"></AddMoney>
  </div>
</template>
<script>
  // GetTenantList 是从API文档中定义过来的方法 暂时没有数据传入
  import { DeletePaymentSingle, GetPaymentListNew, VerificationNew } from '@/api/ownerBill' // 付款
  import { DeletePaymentNew, DeleteReceiptNew } from '../../../api/finance'
  import { GetReceiveListNew } from '@/api/tenantBill' // 收款
  // import { ShowOrganizationList } from '@/api/report'
  import { mapActions, mapGetters } from 'vuex'
  import TableButtons from '@/components/TableButtons'
  import TableRemark from '@/components/TableRemark'
  import SearchPanel from '@/components/SearchPanel' // 引入整个样式布局组件
  import BottomToolBar from '@/components/BottomToolBar' // 引入底部布局样式
  import PrintTemplate from '@/components/PrintTemplate' // 打印组件
  import ExpenseAccountTemplate from '@/components/ExpenseAccountTemplate' // 报销单组件
  import SelectOrganization from '@/components/SelectOrganization'
  import SelectPayAmount from '@/components/SelectPayAmount'
  import AddNewPaymentsingle from './components/AddNewPaymentsingle'
  import EditPayMentSingle from './components/EditPayMentSingle'
  import DetailPaymentsingle from './components/DetailPaymentsingle'
  import TabChange from '@/components/TabChange'
  import AddMoney from './components/components/addMoney'
  import PayDialog from './components/PayDialog'
  // 引入公用样式组件

  export default {
    name: 'PaymentBill',
    data() {
      return {
        PaymentBillDataList: [], // 定义表格获取数据的属性
        ReceiveBillDataList: [], // 定义表格获取数据的属性
        listLoading: false,
        pageSize: 10,
        PaymentFormList: [], // 子组件表格的值
        PayMentEditData: {}, // 父组件修改,传给子组件的值
        tableSelected: [],
        ItemIndex: 0,
        store: [],
        checked: false, // 是否只显示报销单
        downloadLoading: false, // 导出
        paymentMethods: [
          { label: '系统收款', value: 1 },
          { label: '线下收款', value: 2 }
        ],
        // 定义租客账单查询参数
        FormPaymentData: {
          HouseName: '',
          ContractNumber: '', // 业务类型
          CommunityName: '', // 支付类型
          IsReimbursement: 0, // 是否只查报销单
          RoomNumber: '',
          StartTime: '',
          EndTime: '',
          FullID: '',
          PayWay: '',
          BalanceType: '',
          AccountID: '',
          PaymentData: [],
          FullIDNew: ''
        },
        // FormReceiveData: {
        //   HouseName: '',
        //   ContractNumber: '', // 业务类型
        //   CommunityName: '', // 支付类型
        //   RoomNumber: '',
        //   StartTime: '',
        //   EndTime: '',
        //   FullID: '',
        //   PayWay: '',
        //   AccountID: '',
        // },
        operationOwnerButton: [
          {
            key: 'Detail',
            value: '详情',
            type: 'default',
            size: 'mini'
          },
          {
            key: 'Delete',
            value: '删除',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Write',
            value: '核销',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'UnWrite',
            value: '撤回核销',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'ToPay',
            value: '去支付',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Pay',
            value: '打款',
            type: 'primary',
            size: 'mini'
          }
        ],
        tableRemarkOptions: {},
        tableList: [
          { name: '收款' },
          { name: '付款' }],
        // 控制打印2的添加
        dialogVisible: false
      }
    },
    components: {
      DetailPaymentsingle,
      TableButtons,
      SearchPanel,
      BottomToolBar,
      AddNewPaymentsingle,
      EditPayMentSingle,
      TableRemark,
      PrintTemplate,
      TabChange,
      SelectOrganization,
      SelectPayAmount,
      AddMoney,
      PayDialog,
      ExpenseAccountTemplate
    },
    // 请求ajax中定义的方法
    created() {
      this.refreshAccountItem()
      // this.GetStoreData()
      console.log(this.$EnumData.getEnumListByKey('ReceiptType'))
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    methods: {
      // 获取门店的数据
      // GetStoreData() {
      //  ShowOrganizationList().then(res => {
      //     this.store = res.Data.Subbranch
      //   })
      // },
      // 获取门店
      changeStore(store) {
        console.log(store)
        this.FormPaymentData.FullID = store.fullID
      },
      ChangePayWays(value) {
        this.accountData.forEach(item => {
          if (item.KeyID === value) {
            this.FormPaymentData.BalanceType = item.AccountType
            this.FormPaymentData.InitialCashBankId = value
          }
        })
        // console.log(this.newAccountData)
      },
      changeTab(tabIndex) {
        this.ItemIndex = tabIndex
        this.GetTableData()
      },
      handleCheckBill(val) {
        if (val) {
          this.FormPaymentData.IsReimbursement = 1
        } else {
          this.FormPaymentData.IsReimbursement = 0
        }
      },
      GetTableData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        if (!this.FormPaymentData.PaymentData) {
          this.FormPaymentData.PaymentData = []
        }
        this.FormPaymentData.StartTime = this.FormPaymentData.PaymentData[0]
        this.FormPaymentData.EndTime = this.FormPaymentData.PaymentData[1]
        if (this.ItemIndex === 0) {
          return GetReceiveListNew({
            pageParam: pages,
            condition: this.FormPaymentData
          }).then(({ Data, BusCode, Msg }) => {
            console.log(Data)
            if (Data) {
              this.ReceiveBillDataList = Data.rows
              this.listLoading = false
            } else {
              return
            }
            return Data
          })
        } else {
          // debugger
          return GetPaymentListNew({
            pageParam: pages,
            condition: this.FormPaymentData
          }).then(({ Data, BusCode, Msg }) => {
            console.log(Data)
            if (Data) {
              this.PaymentBillDataList = Data.rows
              this.listLoading = false
            } else {
              return
            }
            return Data
          })
        }
      },
      // 去支付按钮
      handleToPay(item) {
        if (this.ItemIndex === 0) {
          this.$refs['topay'].open(2, item.KeyID, item.PaymentMoney, item.UnPaidMoney)
        }
      },
      // 去支付按钮
      handlePay(item) {
        if (this.ItemIndex === 1) {
          this.$refs['pay'].open(item.KeyID, item.PaymentMoney, item.UnPaidMoney)
        }
      },
      // 支付成功之后传回billObj判断
      updateBookKeep(billObj) {
        const index = this.ReceiveBillDataList.findIndex(item => {
          return item.KeyID === billObj.billId
        })
        // 重新计算列表中收款单的未收金额,如果该账单已经支付完成，修改核销状态
        const item = this.ReceiveBillDataList[index]
        const unPaidMoney = item.UnPaidMoney - 0
        const paidAmount = billObj.payAmount - 0
        // 部分付款后不修改核销状态
        // 未付金额大于支付金额
        if (unPaidMoney > paidAmount) {
          item.UnPaidMoney = billObj.unPaidAmount
          item.PaidMoney = billObj.totalPaidMoney
        }
        // 付完所有金额后修改为核销状态
        if (unPaidMoney === paidAmount) {
          // item.UnPaidMoney = 0
          // item.PaidMoney = billObj.totalPaidMoney
          // item.VerificationStatus = 2
          // item.OnLineOrOffLine = 1
          this.GetTableData()
        } else {
          this.$set(this.ReceiveBillDataList, index, item)
        }
      },
      updatePaymentBill(billObj) {
        const index = this.PaymentBillDataList.findIndex(item => {
          return item.KeyID === billObj.billId
        })
        const item = this.PaymentBillDataList[index]
        item.UnPaidMoney = +billObj.UnPaidMoney
        item.PaidMoney = +billObj.PaidMoney
        debugger
        if (item.UnPaidMoney === 0) {
          // item.VerificationStatus = 2
          this.GetTableData()
        } else {
          this.$set(this.PaymentBillDataList, index, item)
        }
      },
      tableSelect(val) {
        this.tableSelected = val
      },
      // 批量删除（暂时未有这个功能）
      handleDeleteAll() {
        const ids = []
        this.tableSelected.map(v => {
          ids.push(v.KeyID)
        })
        this.$confirm('是否批量删除当前付款单, 是否继续?', '提示', {
          type: 'warning',
          center: true
        }).then(() => {
          DeletePaymentSingle({
            ids
          }).then(() => {
            ids.map(id => {
              const index = this.PaymentBillDataList.findIndex(v => v.KeyID === id)
              this.PaymentBillDataList.splice(index, 1)
            })
            this.$message.success('删除付款单成功')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      // 单个删除按钮（暂时仅收款单有删除）
      handleDelete(row, index) {
        console.log(index)
        if (this.ItemIndex === 0) {
          this.$confirm('确定删除这条收款单记录?, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            DeleteReceiptNew({
              KeyID: row.KeyID
            }).then(({ Data, BusCode, Msg }) => {
              if (Data) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.ReceiveBillDataList.splice(index, 1)
              } else {
                this.$message({
                  type: 'info',
                  message: '删除失败!'
                })
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          this.$confirm('确定删除这条收款单记录?, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            DeletePaymentNew({
              KeyID: row.KeyID
            }).then(({ Data, BusCode, Msg }) => {
              if (Data) {
                debugger
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.PaymentBillDataList.splice(index, 1)
              } else {
                this.$message({
                  type: 'info',
                  message: '删除失败!'
                })
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      // 点击查询
      handleSearch() {
        this.$refs.bottomToolBar.search()
      },
      // 点击重置按钮
      handleEmptyValue() {
        this.$refs['FormPaymentData'].resetFields()
        // this.$refs['selectStore'].reset()
        this.checked = false
        this.FormPaymentData.FullIDNew = ''
        this.$refs.bottomToolBar.search()
      },
      // 详情按钮
      handleDetail(row) {
        this.$refs['detailPaymentSing'].open(row, this.ItemIndex)
      },
      // 点击新增按钮
      handleAddNew() {
        this.$refs['newPayMentSing'].open(this.ItemIndex)
      },
      // 点击修改按钮
      handEdit(row) {
        this.$refs['editPayMentSing'].open(row, this.ItemIndex)
        // this.PayMentEditData = Object.assign({}, row)
      },
      // 接收渲染到表格的值(新增付款单)
      AddNewPaymentBill(data, index) {
        console.log(data, index)
        if (this.ItemIndex === 0) {
          const index = this.ReceiveBillDataList.findIndex(item => {
            return item.KeyID === data.KeyID
          })
          if (index === -1) {
            this.ReceiveBillDataList.unshift(data)
            this.GetTableData()
          }
        } else {
          const index = this.PaymentBillDataList.findIndex(item => {
            return item.KeyID === data.KeyID
          })
          if (index === -1) {
            this.PaymentBillDataList.unshift(data)
            this.GetTableData()
          }
        }
      },
      // 修改付款单
      EditNewPaymentBill(data, itemIndex) {
        console.log(data, itemIndex)
        if (itemIndex === 0) {
          this.ReceiveBillDataList.forEach(item => {
            if (item.KeyID === data.KeyID) {
              item.PaymentData = data.PaymentData
              item.ContractNumber = data.ContractNumber
              item.OutRoomName = data.OutRoomName
              item.EdName = data.EdName
              item.Pic = data.Pic
              item.StoreManager = data.StoreManager
              item.CommunityName = data.CommunityName
              item.RoomNumber = data.RoomNumber
              item.InOrOut = data.InOrOut
              item.PaymentMoney = data.PaymentMoney
              item.ProjectName = data.ProjectName
              item.VerificationStatus = data.VerificationStatus
              item.Remarks = data.Remarks
            }
          })
        } else {
          this.PaymentBillDataList.forEach(item => {
            if (item.KeyID === data.KeyID) {
              item.PaymentData = data.PaymentData
              item.ContractNumber = data.ContractNumber
              item.OutRoomName = data.OutRoomName
              item.EdName = data.EdName
              item.Pic = data.Pic
              item.StoreManager = data.StoreManager
              item.CommunityName = data.CommunityName
              item.RoomNumber = data.RoomNumber
              item.InOrOut = data.InOrOut
              item.PaymentMoney = data.PaymentMoney
              item.ProjectName = data.ProjectName
              item.VerificationStatus = data.VerificationStatus
              item.Remarks = data.Remarks
            }
          })
        }
      },
      // 渲染按钮组
      handleButtons(data) {
        const btnOptions = ['Detail']
        if (data.VerificationStatus === 1 && data.PaidMoney === 0 && this.ItemIndex === 0) {
          btnOptions.push('Delete')
        }
        if (data.VerificationStatus === 1 && data.PaidMoney === 0) {
          btnOptions.push('Write')
        }
        if (data.VerificationStatus === 1 && this.ItemIndex === 0) {
          btnOptions.push('ToPay')
        }
        if (data.OnLineOrOffLine !== 1 && data.VerificationStatus === 2) {
          btnOptions.push('UnWrite')
        }
        if (data.VerificationStatus === 1 && this.ItemIndex === 1) {
          btnOptions.push('Delete')
        }
        if (data.UnPaidMoney > 0 && this.ItemIndex === 1) {
          btnOptions.push('Pay')
        }
        return btnOptions
      },
      selectable(row, index) {
        // if (row.AuditStatus === 2) {
        //   return false
        // } else {
        //   return true
        // }
      },
      ...mapActions([
        'refreshAccountItem'
      ]),
      OnMoneyClick(val) {
        this.$refs.printTemplate.open({
          busType: 'ReceiptBill',
          busNum: 2,
          title: '',
          IsShowYear: '',
          isList: 'yes',
          row: val.row,
          money: val.money
        })
      },
      handlePrint(row, type) {
        if (this.ItemIndex === 0) {
          if (type === 2) {
            // 判断有租客租金给服务费  没有直接打印
            if (row.ProjectName.indexOf('租客租金') === -1) {
              this.$refs.printTemplate.open({
                busType: 'ReceiptBill',
                busNum: type,
                title: '',
                IsShowYear: '',
                isList: 'yes',
                row,
                money: 0
              })
            } else {
              this.$refs.AddMoney.open({
                row
              })
            }
          } else {
            this.$refs.printTemplate.open({
              busType: 'ReceiptBill',
              busNum: type,
              title: '',
              IsShowYear: '',
              isList: 'yes',
              row
            })
          }
        } else {
          if (type === 1) {
            this.$refs.printTemplate.open({
              busType: 'PaymentBill',
              busNum: type,
              title: '',
              IsShowYear: '',
              isList: 'yes',
              row
            })
          }
          if (type === 2) {
            this.$refs.expenseAccountTemplate.open({ row })
          }
        }
      },
      CommonExport(Interface, textName) {
        Interface({
          pageParam: {
            size: this.pageSize,
            page: 1
          },
          HouseName: this.FormPaymentData.HouseName,
          ContractNumber: this.FormPaymentData.ContractNumber,
          CommunityName: this.FormPaymentData.CommunityName,
          RoomNumber: this.FormPaymentData.RoomNumber,
          StartTime: !this.FormPaymentData.PaymentData ? '' : this.$dateFormat(this.FormPaymentData.PaymentData[0], 'yyyy/MM/dd'),
          EndTime: !this.FormPaymentData.PaymentData ? '' : this.$dateFormat(this.FormPaymentData.PaymentData[1], 'yyyy/MM/dd'),
          FullIDNew: this.FormPaymentData.FullIDNew,
          PayWay: this.FormPaymentData.FullID,
          AccountID: this.FormPaymentData.AccountID,
          isAll: true
        }).then(response => {
          if (response.Code === 0) {
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['日期', '合同编号', '出房人', '主管', '门店经理', '小区', '房间号', '收支类型', '金额', '明细', '核销状态', '备注']
              const filterVal = ['PaymentData', 'ContractNumber', 'OutRoomName', 'EdName', 'StoreManager', 'CommunityName', 'RoomNumber', 'InOrOut', 'PaymentMoney', 'ProjectName', 'VerificationStatus', 'Remarks']
              const data = this.formatJson(filterVal, !response.Data ? [] : response.Data.rows)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: textName
              })
              this.downloadLoading = false
            })
          }
        })
      },
      //   导出
      handleExport() {
        this.downloadLoading = true
        if (this.ItemIndex === 0) {
          this.CommonExport(GetReceiveListNew, '收款单')
        } else {
          this.CommonExport(GetPaymentListNew, '付款单')
        }
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'EndTime' || j === 'StartTime') {
            return this.$dateFormat(v[j])
          } else {
            return v[j]
          }
        }))
      },
      //  核销的公用函数
      CommonWrite(text, VerType, PayOrReceiptID, VerificationStatus) {
        this.$confirm(text, '核销', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          VerificationNew({
            VerType: VerType,
            PayOrReceiptID: PayOrReceiptID,
            VerificationStatus: VerificationStatus
          }).then(({ Data, BusCode, Msg }) => {
            if (Data) {
              this.GetTableData()
              this.$message({
                type: 'success',
                message: '核销成功!'
              })
            } else {
              this.$message({
                type: 'info',
                message: '核销失败!'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消核销'
          })
        })
      },
      // 核销
      handleWrite(row, index) {
        if (this.ItemIndex === 0) {
          this.CommonWrite('确定核销该笔款项?', 1, row.KeyID, 2)
        } else {
          this.CommonWrite('确定核销该笔款项?', 2, row.KeyID, 2)
        }
        console.log(index)
      },
      //  未核销
      handleUnWrite(row) {
        if (this.ItemIndex === 0) {
          this.CommonWrite('确认这笔款项修改成未核销?', 1, row.KeyID, 1)
        } else {
          this.CommonWrite('确认这笔款项修改成未核销?', 2, row.KeyID, 1)
        }
      }
    },
    computed: {
      // 业务类型枚举(7个)
      BusType() {
        return this.$EnumData.getEnumListByKey('FinanceBusType')
      },
      // 付款类型
      PaymentMethod() {
        return this.$EnumData.getEnumListByKey('PaymentMethod')
      },
      // 收款类型
      ReceiptType() {
        return this.$EnumData.getEnumListByKey('ReceiptType')
      },
      // 收支类型
      InOrOut() {
        return this.$EnumData.getEnumListByKey('InOrOut')
      },
      // 核销状态
      VerStatus() {
        return this.$EnumData.getEnumListByKey('VerStatus')
      },
      ...mapGetters([
        'accountData'
      ])
    }
  }
</script>

<style scoped>
  .ident {
    background-color: #EF6532;
    position: absolute;
    left: 0;
    top: 0;
    font-size: 12px;
    width: 40px;
    height: 16px;
    line-height: 16px;
    border-bottom-right-radius: 4px;
    color: #fff;
  }
</style>
