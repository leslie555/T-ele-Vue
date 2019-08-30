<template>
  <el-dialog
    title="新增收款单"
    :visible.sync="ShowReceiptDialog"
    width="1200px"
    v-loading="loading"
    :append-to-body="true"
    :close-on-click-modal="true"
    @close="closeDialog"
    center
  >
    <el-scrollbar class="vertical-scroll">
      <el-form
        :inline="true"
        label-width="100px"
        :model="ReceiptData"
        ref="ReceiptData"
        :rules="rules"
      >
        <div class="dialog-box form-item-sm">
          <div class="clearfix form-item-sm">
            <!--<el-form-item label="收款对象" prop="CustomerName">-->
            <!--<el-input-->
            <!--v-model="ReceiptData.CustomerName"-->
            <!--&gt;-->
            <!--</el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="收款对象" prop="CustomerType">
              <el-select
                v-model="ReceiptData.CustomerType"
                placeholder="请选择"
                @change="selectedUserType"
              >
                <el-option
                  v-for="item in AcceptType"
                  :key="item.Value"
                  :label="item.Description"
                  :value="item.Value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="CustomerName">
              <!--<el-input-->
              <!--v-model="ReceiptData.CustomerName"-->
              <!--:disabled="true"-->
              <!--&gt;-->
              <!--</el-input>-->
              <select-user
                ref="selectUser"
                :type="1"
                v-model="ReceiptData.CustomerName"
                @change="handleCustomerChange"
                :userType="ReceiptData.CustomerType"
              ></select-user>
            </el-form-item>
            <el-form-item label="收款类型" prop="ReceiptType">
              <el-select v-model="ReceiptData.ReceiptType" placeholder="请选择">
                <el-option
                  v-for="item in ReceiptType"
                  :key="item.Value"
                  :label="item.Description"
                  :value="item.Value"
                  @click.native="changeButton(item.Value)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业务类型" prop="BusinessType">
              <el-select v-model="ReceiptData.BusinessType" placeholder="请选择">
                <el-option
                  v-for="item in BusType"
                  :key="item.Value"
                  :label="item.Description"
                  :value="item.Value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收款日期" prop="ReceiptData">
              <el-date-picker
                v-model="ReceiptData.ReceiptData"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="handleChoiceBill"
                v-show="IsshowButton"
                type="primary"
                size="mini"
                plain
              >选择账单</el-button>
            </el-form-item>
          </div>
          <div class="clearfix mb-20" v-if="IsExhibition">
            <el-table
              :data="ReceiptFormList"
              v-if="ReceiptFormList.length > 0"
              ref="multipleTable"
              v-loading.body="listLoading"
              element-loading-text="Loading"
              height="200px"
              show-summary
              :summary-method="getSummaries"
              class="table-normal"
              border
              fit
              highlight-current-row
            >
              <el-table-column align="center" label="账单编号" min-width="220">
                <template slot-scope="scope">{{scope.row.BillNum}}</template>
              </el-table-column>
              <el-table-column align="center" label="业务类型" prop="BusinessType" min-width="150">
                <template slot-scope="scope">
                  <span>{{$EnumData.getEnumDesByValue('BusType', scope.row.BillType)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目名称" min-width="120" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.ProjectName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="日期" min-width="140" align="center">
                <template slot-scope="scope">{{$dateFormat(scope.row.ReceiptData)}}</template>
              </el-table-column>
              <el-table-column label="应收款金额" min-width="140" align="center">
                <template slot-scope="scope">{{$priceFormat(scope.row.PaidMoney)}}</template>
              </el-table-column>
              <el-table-column
                class-name="status-col"
                label="优惠金额"
                prop="Discount"
                min-width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{$priceFormat(scope.row.Discount)}}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" prop="UnPaidMoney" label="未收金额" min-width="180">
                <template slot-scope="scope">
                  <span>{{$priceFormat(scope.row.iop - scope.row.InPaidMoney)}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="本次收款" prop="InPaidMoney" min-width="220">
                <template slot-scope="scope">
                  <el-input
                    v-model="ReceiptFormList[scope.$index].InPaidMoney"
                    type="number"
                    @blur="$positive(ReceiptFormList[scope.$index], 'InPaidMoney', 0, false, ReceiptFormList[scope.$index].iop)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" fixed="right" label="操作" min-width="180">
                <template slot-scope="scope">
                  <table-buttons
                    :options="operationOwnerButton"
                    :condition="['Delete']"
                    :showAll="true"
                    @handleDeleteClick="handleDelete(scope.$index,scope.row)"
                  ></table-buttons>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="clearfix form-item-lg">
            <el-form-item label="备注" prop="Remarks">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 12}"
                placeholder="请输入备注"
                v-model="ReceiptData.Remarks"
              ></el-input>
            </el-form-item>
          </div>
          <div class="clearfix form-item-sm">
            <el-form-item label="结算方式" prop="BalanceType">
              <el-select v-model="ReceiptData.BalanceType" placeholder="请选择">
                <el-option
                  v-for="item in BalanceType"
                  :key="item.Value"
                  :label="item.Description"
                  :value="item.Value"
                  @click.native="ChangePayWays(item.Value)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收款账户" class prop="InitialCashBank" label-width="100px">
              <el-select v-model="ReceiptData.InitialCashBank" placeholder="请选择">
                <el-option
                  v-for="(item,index) in newAccountData"
                  :key="index"
                  :label="item.Account"
                  :value="item.Account"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优惠金额" prop="Discount">
              <el-input
                v-model="ReceiptData.Discount"
                type="number"
                v-positive="ReceiptData.Discount"
                min="0"
                max="ReceiptCalData"
              ></el-input>
            </el-form-item>
            <el-form-item label="收款金额" v-if="IsshowDisabledPaymentMoney" prop="ReceiptMoney123">
              <el-input
                v-model="ReceiptCalData"
                type="number"
                :disabled="true"
                v-positive="ReceiptCalData"
              ></el-input>
            </el-form-item>
            <el-form-item label="收款金额" v-if="IsshowPaymentMoney" prop="ReceiptMoney">
              <el-input
                v-model="ReceiptData.ReceiptMoney"
                type="number"
                v-positive="ReceiptData.ReceiptMoney"
                min="0"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
    <div slot="footer">
      <el-button @click="SubmitCancel" type="info">取 消</el-button>
      <el-button type="primary" @click="SubmitRequire" :loading="AddButton">确 认</el-button>
    </div>
    <choice-receipt-bill ref="choicebill" @UpDataTOParent="UpDataTOParent"></choice-receipt-bill>
    <!--<choice-receipt-target-->
    <!--ref="ChoiceTarget"-->
    <!--@AddTargetMsg="AddTargetMsg"-->
    <!--&gt;-->
    <!--</choice-receipt-target>-->
  </el-dialog>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import ChoiceReceiptBill from './components/ChoiceReceiptBill'
  import TableButtons from '@/components/TableButtons'
  import { AddReceiveSingle } from '@/api/tenantBill'
  // import ChoiceReceiptTarget from './components/ChoiceReceiptTarget'
  import SelectUser from '../../FinancialVerification/components/SelectUser'

  export default {
    name: 'add-new-receiptsingle',
    components: {
      ChoiceReceiptBill,
      TableButtons,
      // ChoiceReceiptTarget,
      SelectUser
    },
    data() {
      return {
        ReceiptFormList: [], // 列表的数据
        ShowReceiptDialog: false,
        listLoading: false,
        loading: false,
        AddButton: false,
        IsShowTarget: false,
        newAccountData: [],
        IsExhibition: false, // 是否展示新增项目(选择账单有数据的时候才显示表格对象)
        IsshowButton: false, // 是否显示收款账单按钮
        IsshowPaymentMoney: true, // 是否显示可填的付款金额
        IsshowDisabledPaymentMoney: false, // 是否显示不可填的付款金额
        ReceiptNewData: '',
        ReceiptData: {
          CustomerName: '', // 收款对象
          CustomerType: 0, // 客户类型
          CustomerID: '', // 客户ID
          CustomerPhone: '', // 客户电话
          ReceiptType: this.$EnumData.getEnumDesByValue('ReceiptType'), // 收款类型
          BusinessType: this.$EnumData.getEnumDesByValue('FinanceBusType'), // 业务类型
          ReceiptData: new Date(), // 收款日期
          InitialCashBank: '', // 付款账户
          BalanceType: '', // 结算方式
          Discount: '', // 优惠金额
          ReceiptMoney: '' // 收款金额
        },
        // 表单验证
        rules: {
          CustomerType: [
            { required: true, message: '请输入收款对象类型', trigger: 'change' }
          ],
          ReceiptType: [
            { required: true, message: '请输入收款类型', trigger: 'change' }
          ],
          BusinessType: [
            { required: true, message: '请输入业务类型', trigger: 'change' }
          ],
          BalanceType: [
            { required: true, message: '请输入结算方式', trigger: 'change' }
          ],
          ReceiptData: [
            { required: true, message: '请输入收款日期', trigger: 'change' }
          ],
          InitialCashBank: [
            { required: true, message: '请输入收款账户', trigger: 'change' }
          ],
          ReceiptMoney: [
            { required: true, message: '请输入收款金额', trigger: 'blur' }
          ]
        },
        operationOwnerButton: [
          {
            key: 'Delete',
            value: '删除',
            type: 'danger',
            size: 'mini'
          }],
        BalanceType: [
          {
            Description: '支付宝',
            Value: '支付宝'
          },
          {
            Description: '微信',
            Value: '微信'
          },
          {
            Description: '银行卡',
            Value: '银行卡'
          }]
      }
    },
    methods: {
      open() {
        this.AddButton = false
        this.ReceiptFormList = []
        this.IsExhibition = false
        this.ShowReceiptDialog = true
        this.refreshAccountItem()
      },
      ...mapActions([
        'refreshAccountItem'
      ]),
      ChangePayWays(value) {
        debugger
        this.ReceiptData.InitialCashBank = ''
        var newData = 0
        if (value === '银行卡') {
          newData = 1
        } else if (value === '支付宝') {
          newData = 2
        } else if (value === '微信') {
          newData = 3
        }
        this.newAccountData = this.accountData.filter(item => {
          return item.AccountType === newData
        })
        console.log(this.newAccountData)
      },
      close() {
        this.ShowReceiptDialog = false
      },
      //  子组件只有在选择账单选择了数据之后,父组件接收数据
      UpDataTOParent(data) {
        if (this.ReceiptFormList.length > 0) {
          var newData = data.filter((item) => {
            // if (this.PaymentFormList.length === 0) return true
            var isExist = true
            this.ReceiptFormList.forEach((X) => {
              if (item.KeyID === X.ReceivableID) {
                isExist = false
              }
            })
            return isExist
          })
          this.IsExhibition = true
          newData.forEach(item => {
            console.log(data) // 筛选出来的数据
            var obj = {}
            obj.ReceivableID = item.KeyID
            obj.BillNum = item.BillNum
            obj.BillType = item.BusinessType
            obj.ProjectName = item.BillProjectName
            obj.ReceiptData = item.ReceivableDate
            obj.Discount = item.Discount
            obj.PaidMoney = item.ReceivableMoney
            obj.iop = item.UnPaidMoney // 未收
            obj.UnPaidMoney = item.UnPaidMoney - obj.iop
            obj.InPaidMoney = item.UnPaidMoney
            obj.Remarks = item.Remark
            this.ReceiptFormList.push(obj)
          })
        } else {
          data.forEach(item => {
            this.IsExhibition = true
            console.log(data) // 筛选出来的数据
            var obj = {}
            obj.ReceivableID = item.KeyID
            obj.BillNum = item.BillNum
            obj.BillType = item.BusinessType
            obj.ProjectName = item.BillProjectName
            obj.ReceiptData = item.ReceivableDate
            obj.Discount = item.Discount
            obj.PaidMoney = item.ReceivableMoney
            obj.iop = item.UnPaidMoney // 未收
            obj.UnPaidMoney = item.UnPaidMoney - obj.iop
            obj.InPaidMoney = item.UnPaidMoney
            obj.Remarks = item.Remark
            this.ReceiptFormList.push(obj)
          })
        }
      },
      // 点击选择账单按钮
      handleChoiceBill() {
        if (this.ReceiptData.CustomerName === '') {
          this.$message.error('付款对象名字不能为空')
          return false
        } else if (this.ReceiptData.BusinessType === null) {
          this.$message.error('业务类型不能为空')
        } else if (this.ReceiptData.CustomerName === '' && this.ReceiptData.BusinessType === null) {
          this.$message.error('业务类型和付款对象名字不能为空')
          return false
        } else {
          this.$refs['choicebill'].open({
            QueryType: 1, // 收款单
            CustomerName: this.ReceiptData.CustomerName,
            BusType: this.ReceiptData.BusinessType, // 业务类型
            CustomerPhone: this.ReceiptData.CustomerPhone
          })
        }
      },
      // 点击取消按钮
      SubmitCancel() {
        this.$refs['ReceiptData'].resetFields()
        this.close()
      },
      // 改变收款类型, 是否显示按钮
      changeButton(index) {
        if (index === 0 || index === 1) {
          if (this.ReceiptFormList.length > 0) {
            this.IsExhibition = false
          }
          this.IsshowPaymentMoney = true
          this.IsshowDisabledPaymentMoney = false
          this.IsshowButton = false
        } else if (index === 2) {
          this.IsshowDisabledPaymentMoney = true
          this.IsshowPaymentMoney = false
          this.IsshowButton = true
        }
      },
      // 选择收款对象时的Table按钮
      // GetChoiceTarget(val) {
      //   console.log(val) // 代表的是类型
      //   this.$refs['ChoiceTarget'].open(val)
      // },
      selectedUserType(val) {
        this.ReceiptData.CustomerName = ''
        this.ReceiptFormList = []
        this.$refs['selectUser'].clearCustomerList() // 类型改变时,清除已有的选项
      },
      handleCustomerChange(val) {
        this.ReceiptData.CustomerPhone = val.CustomerPhone
        this.ReceiptFormList = []
      },
      // 接受父组件传回的一条表格数据
      AddTargetMsg(val) {
        console.log(val)
        if (val.length === 0) {
          this.ReceiptFormList = []
          this.ReceiptData.CustomerType = ''
          this.ReceiptData.CustomerName = ''
        } else {
          this.ReceiptFormList = []
          this.ReceiptData.CustomerName = val[0].CustomerName // 对象
          this.ReceiptData.CustomerID = val[0].CustomerID // 客户ID
          this.ReceiptData.CustomerPhone = val[0].CustomerPhone
          // if (val[0].CustomerName !== '') {
          //   this.IsShowTarget = true
          // } else {
          //   this.IsShowTarget = false
          // }
        }
      },
      // ----新增添加收款单-----
      AddReceiptSingleFun() {
        this.AddButton = true
        if (this.ReceiptData.ReceiptType === 2 && this.ReceiptFormList.length === 0) {
          this.$message.error('对单收款中，账单不能为空！请选择账单')
          this.AddButton = false
          return false
        } else if (this.ReceiptFormList.length > 0) {
          this.ReceiptFormList.forEach(ele => {
            ele.UnPaidMoney = ele.iop - ele.InPaidMoney
          })
          this.ReceiptData.ReceiptMoney = parseFloat(this.ReceiptNewData) - this.ReceiptData.Discount
        }
        if (this.ReceiptData.CustomerName === '') {
          this.$message.error('收款对象不能为空！')
          this.AddButton = false
          return false
        }
        debugger
        return AddReceiveSingle({
          Receipt: this.ReceiptData,
          Details: this.ReceiptFormList
        }).then(({ Data, BusCode, Msg }) => {
          if (Data) {
            console.log(Data)
            this.$emit('AddNewReceiptBill', Data)
            this.$refs['ReceiptData'].resetFields()
            this.close()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          } else {
            this.$message({
              type: 'info',
              message: '添加失败!'
            })
          }
        }).catch(() => {
          this.AddButton = false
        })
      },
      closeDialog() {
        this.$refs['ReceiptData'].resetFields()
      },
      // 点击确认按钮
      SubmitRequire() {
        this.$refs['ReceiptData'].validate((valid) => {
          if (valid) {
            this.AddReceiptSingleFun()
          }
        })
      },
      // 删除选择表单的每一项
      handleDelete(index, data) {
        this.$confirm('确定删除这条账单数据?, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // deleteHouse({
          //   keyID: row.keyID
          // }).then((reponse) => {
          //   if (reponse) {
          //     this.$message({
          //       type: 'success',
          //       message: '删除成功!'
          //     })
          //     this.ReserveDatalist.splice(index, 1)
          //   } else {
          //     this.$message({
          //       type: 'info',
          //       message: '删除失败!'
          //     })
          //   }
          // })
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.ReceiptFormList.splice(index, 1)
          if (this.ReceiptFormList.length === 0) {
            this.IsExhibition = false
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价'
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
            sums[index] += ' 元'
          } else {
            sums[index] = '--'
          }
        })
        var allsums = 0
        data.forEach(item => {
          allsums += item.iop - item.InPaidMoney
        })
        sums[6] = allsums + '元'
        this.ReceiptNewData = sums[7]
        return sums
      }
    },
    computed: {
      // 业务类型枚举(7个)
      BusType() {
        return this.$EnumData.getEnumListByKey('FinanceBusType')
      },
      // 付款类型
      ReceiptType() {
        return this.$EnumData.getEnumListByKey('ReceiptType')
      },
      // 收款对象
      AcceptType() {
        return this.$EnumData.getEnumListByKey('CustomerType')
      },
      ...mapGetters([
        'accountData'
      ]),
      // 收款金额
      ReceiptCalData() {
        if (this.ReceiptFormList.length === 0) {
          var zxy = 0
          return zxy
        } else {
          var a = 0
          this.ReceiptFormList.forEach(item => {
            a += item.InPaidMoney
          })
          const dd = a - this.ReceiptData.Discount
          return dd
        }
      }
    }
  }
</script>

<style scoped>
</style>
