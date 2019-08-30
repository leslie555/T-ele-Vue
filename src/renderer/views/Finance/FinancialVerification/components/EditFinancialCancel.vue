<template v-loading="loading">
  <el-dialog
    :title="EditTitle"
    width="1280px"
    class="edit-verfication-dialog"
    append-to-body
    :close-on-click-modal="true"
    @open="handleOpen"
    @close="closeDialog"
    :center="true"
    :style="{'z-index':'2017'}"
    :show-close="false"
    :visible.sync="dialogFormVisible"
  >
    <el-form
      ref="Cancelform"
      :model="searchForm"
      :rules="Searchrules"
      inline
      style="height: 525px; "
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item
            label="核销对象"
            :required="true"
            :label-width="formLabelWidth"
            prop="CustomerType"
            size="mini"
          >
            <el-select
              @change="selectedUserType"
              v-model="searchForm.CustomerType"
              placeholder="请选择"
            >
              <el-option
                v-for="AcceptType in $store.getters.enumList.EnumCustomerType"
                :key="AcceptType.Value"
                :label="AcceptType.Description"
                :value="AcceptType.Value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :required="true"
            :label-width="formLabelWidth"
            size="mini"
            prop="CustomerName"
          >
            <SelectUser
              ref="selectUser"
              :type="0"
              v-model="searchForm.CustomerName"
              @change="handleCustomerChange"
              :userType="searchForm.CustomerType"
            ></SelectUser>
          </el-form-item>
          <el-form-item
            :required="true"
            label="核销类型"
            :label-width="formLabelWidth"
            size="mini"
            prop="VerificationType"
          >
            <el-select
              @change="handleVerificationTypeChange"
              v-model="searchForm.VerificationType"
              placeholder="请选择"
            >
              <el-option label="应收冲已收" :value="1"></el-option>
              <el-option label="应付冲已付" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="业务类型"
            :required="true"
            :label-width="formLabelWidth"
            prop="BusinessType"
            size="mini"
          >
            <el-select
              @change="handleBusinessTypeChange"
              v-model="searchForm.BusinessType"
              placeholder="请选择业务类型"
            >
              <el-option
                v-for="busType in $store.getters.enumList.EnumFinanceBusType"
                :key="busType.Value"
                :label="busType.Description"
                :value="busType.Value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="核销日期"
            :label-width="formLabelWidth"
            prop="VerificationTime"
            size="mini"
          >
            <el-date-picker v-model="searchForm.VerificationTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </div>
        <div v-show="showBill">
          <div class="clearfix">
            <el-row>
              <el-button
                type="primary"
                plain
                @click="ChoiceReceivable(0)"
                size="mini"
              >{{ChoiceDocument[0]}}</el-button>
            </el-row>
            <div class="panel data-list-table">
              <template>
                <el-table
                  :data="billTableData"
                  border
                  max-height="180"
                  show-summary
                  :summary-method="getSummaries"
                  style="width: 100%"
                  class="table-normal"
                >
                  <el-table-column align="center" prop="BillNum" label="单据编号" width="150"></el-table-column>
                  <el-table-column align="center" prop="BusinessType" label="业务类型" width="130">
                    <template slot-scope="scope">
                      <div>{{$EnumData.getEnumDesByValue('FinanceBusType', scope.row.BusinessType) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="CreaterTime" label="日期" width="130">
                    <template slot-scope="scope">
                      <div>{{$dateFormat(scope.row.CreaterTime)}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="BillMoney" label="单据金额" width="130"></el-table-column>
                  <el-table-column align="center" prop="WriteOffAmount" label="已核销金额" width="130"></el-table-column>
                  <el-table-column align="center" prop="UnwrittenAmount" label="未核销金额" width="130">
                    <template slot-scope="scope">
                      <div>{{$priceFormat(scope.row.UnwrittenAmount - scope.row.VerificationMoney)}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="本次核销付款"
                    prop="VerificationMoney"
                    min-width="130"
                  >
                    <template slot-scope="scope">
                      <el-input
                        type="number"
                        v-model="scope.row.VerificationMoney"
                        style="width: 100px;"
                        min="0"
                        @blur="$positive(scope.row, 'VerificationMoney', 0, false, scope.row.UnwrittenAmount)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                      <el-button type="danger" plain @click="RemoveDocument(0,scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
          </div>
          <div class="clearfix">
            <el-row>
              <el-button
                type="primary"
                plain
                @click="ChoiceReceivable(1)"
                size="mini"
              >{{ChoiceDocument[1]}}</el-button>
            </el-row>
            <div class="panel data-list-table">
              <template>
                <el-table
                  :data="Document"
                  border
                  max-height="180"
                  :summary-method="getReceivable"
                  show-summary
                  style="width: 100%"
                  class="table-normal"
                >
                  <el-table-column align="center" prop="BillNum" label="单据编号" width="150"></el-table-column>
                  <el-table-column align="center" prop="BusinessType" label="业务类型" width="130">
                    <template slot-scope="scope">
                      <div>{{$EnumData.getEnumDesByValue('FinanceBusType', scope.row.BusinessType) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="CreaterTime" label="日期" width="130">
                    <template slot-scope="scope">
                      <div>{{$dateFormat(scope.row.CreaterTime)}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="BillMoney" label="单据金额" width="130"></el-table-column>
                  <el-table-column align="center" prop="WriteOffAmount" label="已核销金额" width="130"></el-table-column>
                  <el-table-column align="center" prop="UnwrittenAmount" label="未核销金额" width="130">
                    <template slot-scope="scope">
                      <div>{{$priceFormat(scope.row.UnwrittenAmount - scope.row.VerificationMoney)}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="本次核销付款"
                    prop="VerificationMoney"
                    min-width="130"
                  >
                    <template slot-scope="scope">
                      <el-input
                        type="number"
                        v-model="scope.row.VerificationMoney"
                        style="width: 100px;"
                        min="0"
                        @blur="$positive(scope.row, 'VerificationMoney', 0, false, scope.row.UnwrittenAmount)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                      <el-button type="danger" plain @click="RemoveDocument(1,scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="cancleSubmit">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </div>
    <SelectFinancialBill
      ref="ChoiceBill"
      :VerificationType="searchForm.VerificationType"
      :SearchVerificationType="SearchVerificationType"
      :selectedDoc="SearchVerificationType===0?billTableData:Document"
      :SearchReceiptForm="searchForm"
      @selectedDocument="handleSelectedDoc"
    ></SelectFinancialBill>
  </el-dialog>
</template>

<script>
  import SelectUser from './SelectUser'
  import SelectFinancialBill from './SelectFinancialBill'
  import { InsertWriteOff } from '@/api/finance'
  export default {
    name: 'EditFinancialCancel',
    components: {
      SelectUser,
      SelectFinancialBill
    },
    props: {
      // 应收 或应付
      EditData: null
    },
    data() {
      return {
        loading: false,
        Document: [],
        billTableData: [],
        dialogFormVisible: false,
        formLabelWidth: '80px',
        searchForm: {
          KeyID: '',
          // 账户类型
          CustomerType: 0,
          // 客户姓名
          CustomerName: '',
          // 核销类型
          VerificationType: '',
          // 业务类型
          BusinessType: '',
          //  核销单编号
          BillNum: '',
          // 核销日期
          VerificationTime: ''
        },
        Searchrules: {
          CustomerType: [{ required: true, message: '核销对象类型', trigger: 'change' }],
          CustomerName: [{ required: true, message: '核销对象姓名', trigger: 'change' }],
          VerificationType: [{ required: true, message: '核销类型', trigger: 'change' }],
          BusinessType: [{ required: true, message: '业务类型', trigger: 'change' }],
          VerificationTime: [{ required: true, message: '请选择日期', trigger: 'change' }]
        },
        SumMoneyOne: null,
        SumMoneyTwo: null,
        SearchVerificationType: null,
        oldDetails: []
      }
    },
    computed: {
      isEdit() {
        return !!this.EditData
      },
      showBill() {
        return this.searchForm.VerificationType === 1 || this.searchForm.VerificationType === 2
      },
      ChoiceDocument() {
        return this.searchForm.VerificationType === 1 ? [
          '请选择应收单据',
          '请选择收款单'
        ]
          : [
            '请选择应付单据',
            '请选择付款单'
          ]
      },
      EditTitle() {
        return this.EditData ? '修改核销' : '新增核销'
      },
      // 业务类型
      BusinessType() {
        return this.$EnumData.getEnumListByKey('FinanceBusType')
      }
    },
    methods: {
      open() {
        this.dialogFormVisible = true
      },
      handleOpen() {
        if (this.isEdit) {
          const data = this.EditData
          this.searchForm = data
          if (data.VerificationType === 1) { // 收款
            data.ReceivableList.forEach(val => {
              val.BillMoney = val['ReceivableMoney']
            })
            data.ReceiptList.forEach(val => {
              val.BillMoney = val['ReceiptMoney']
            })
            this.billTableData = data.ReceivableList
            this.Document = data.ReceiptList
          } else { // 付款
            data.PayableList.forEach(val => {
              val.BillMoney = val['PayableMoney']
            })
            data.PaymentList.forEach(val => {
              val.BillMoney = val['PaymentMoney']
            })
            this.billTableData = data.PayableList
            this.Document = data.PaymentList
          }
          // 将之前的单据存储起来与修改后做对比
          this.oldDetails = [...this.$deepCopy(this.billTableData), ...this.$deepCopy(this.Document)]
        } else {
          this.searchForm = {
            KeyID: '',
            CustomerType: 0,
            CustomerName: '',
            VerificationType: '',
            BusinessType: '',
            BillNum: '',
            VerificationTime: ''
          }
          this.billTableData = []
          this.Document = []
        }
        this.$nextTick(() => {
          this.$refs['Cancelform'].clearValidate()
        })
      },
      cancleSubmit() {
        this.dialogFormVisible = false
      },
      closeDialog() {
        this.searchForm = {
          KeyID: '',
          CustomerType: 0,
          CustomerName: '',
          VerificationType: '',
          BusinessType: '',
          BillNum: '',
          VerificationTime: ''
        }
      },
      ChoiceReceivable(val) {
        this.$refs['Cancelform'].validate(valid => {
          if (valid) {
            this.SearchVerificationType = val
            this.$refs['ChoiceBill'].open()
          }
        })
      },
      onSubmit() {
        if (!this.billTableData.length) {
          this.$message.error(`${this.searchForm.VerificationType === 1 ? '应收单据' : '应付单据'}不能为空!`)
          return
        }
        if (!this.Document.length) {
          this.$message.error(`${this.searchForm.VerificationType === 1 ? '收款单' : '付款单'}不能为空!`)
          return
        }
        if (this.SumMoneyOne !== this.SumMoneyTwo) {
          this.$message.error('核销金额不一致!')
          return
        }
        const { searchForm } = this
        const form = { ...searchForm, VerificationMoney: this.SumMoneyOne }
        const bill = this.billTableData.map(val => ({
          KeyID: val.VerDetailsID,
          BusinessType: searchForm.BusinessType,
          Type: searchForm.VerificationType === 1 ? 3 : 4,
          RelationID: val.KeyID,
          BillNum: val.BillNum,
          VerificationMoney: val.VerificationMoney
        }))
        const document = this.Document.map(val => ({
          KeyID: val.VerDetailsID,
          BusinessType: searchForm.BusinessType,
          Type: searchForm.VerificationType === 1 ? 1 : 2,
          RelationID: val.KeyID,
          BillNum: val.BillNum,
          VerificationMoney: val.VerificationMoney
        }))
        debugger
        let details = [...bill, ...document]
        this.oldDetails.forEach(val => {
          val.KeyID = val.VerDetailsID
        })
        details = this.$DiffArrFn(this.oldDetails, details, ['KeyID', 'VerificationMoney'])
        this.loading = true
        InsertWriteOff({
          ver: form,
          details
        }).then(res => {
          if (this.isEdit) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$emit('edited', res.Data)
          } else {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$emit('insert', res.Data)
          }
          this.loading = false
          this.dialogFormVisible = false
        }).catch(() => {
          this.loading = false
        })
      },
      selectedUserType(val) {
        this.searchForm.CustomerName = ''
        this.billTableData = []
        this.Document = []
        this.$refs['selectUser'].clearCustomerList() // 类型改变时,清除已有的选项
      },
      handleCustomerChange() {
        this.billTableData = []
        this.Document = []
      },
      handleVerificationTypeChange() {
        this.billTableData = []
        this.Document = []
      },
      handleBusinessTypeChange() {
        this.billTableData = []
        this.Document = []
      },
      getBillKey() {
        let billKey // 单据金额字段名,由于四种情况不一样,需要统一
        if (this.SearchVerificationType === 0 && this.searchForm.VerificationType === 1) { // 应收单据
          billKey = 'ReceivableMoney'
        } else if (this.SearchVerificationType === 0 && this.searchForm.VerificationType === 2) { // 应付单据
          billKey = 'PayableMoney'
        } else if (this.SearchVerificationType === 1 && this.searchForm.VerificationType === 1) { // 收款单
          billKey = 'ReceiptMoney'
        } else if (this.SearchVerificationType === 1 && this.searchForm.VerificationType === 2) { // 付款单
          billKey = 'PaymentMoney'
        }
        return billKey
      },
      handleSelectedDoc(list) {
        const billKey = this.getBillKey() // 获取单据金额字段名
        debugger
        list.forEach(val => {
          if (!val.VerificationMoney) { // 给本次核销金额默认为未核销金额
            val.VerificationMoney = val.UnwrittenAmount
          }
          val.BillMoney = val[billKey]
        })
        if (this.SearchVerificationType === 0) {
          this.billTableData = list
        } else if (this.SearchVerificationType === 1) {
          this.Document = list
        }
      },
      RemoveDocument(type, idx) {
        if (type === 0) {
          this.billTableData.splice(idx, 1)
        } else if (type === 1) {
          this.Document.splice(idx, 1)
        }
      },
      getReceivable(val) {
        const { columns, data } = val
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          } else if (index === 1) {
            sums[index] = ''
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = ''
          }
        })
        this.SumMoneyOne = sums[6]
        let unSum = 0
        data.forEach(item => {
          unSum += item.UnwrittenAmount - item.VerificationMoney
        })
        sums[5] = unSum
        return sums
      },
      getSummaries(param) {
        console.log(param)
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            })
          } else {
            sums[index] = ''
          }
          sums[1] = ''
        })
        this.SumMoneyTwo = sums[6]
        let unSum = 0
        data.forEach(item => {
          unSum += item.UnwrittenAmount - item.VerificationMoney
        })
        sums[5] = unSum
        return sums
      }
    }
  }

</script>

<style lang="scss">
  .edit-verfication-dialog .el-table__row td {
    padding: 0;
  }
</style>

