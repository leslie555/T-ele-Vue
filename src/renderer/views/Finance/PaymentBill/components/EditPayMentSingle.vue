<template>
    <el-dialog
            title="修改付款单"
            :visible.sync="ShowEditPayMentDialog"
            width="1200px"
            v-loading="loading"
            :append-to-body="true"
            center
    >
        <el-form :inline="true" label-width="100px" :model="PayMentEditFormData" ref="PayMentEditFormData" :rules="rules">
            <div class="dialog-box form-item-sm">
                <div class="clearfix form-item-sm">
                  <div class="clearfix form-item-md">
                    <el-form-item label="收支类型" prop="InOrOut">
                      <el-radio-group v-model="PayMentEditFormData.InOrOut" >
                        <el-radio :label="1"  @change = ChangeIn :disabled="changestatus">收款单</el-radio>
                        <el-radio :label="2"  @change = ChangeIn :disabled="changestatus1">付款单</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                  <div class="clearfix form-item-md">
                    <el-form-item label="房源名称" prop="HouseName">
                      <search-house v-model="PayMentEditFormData.HouseName"></search-house>
                    </el-form-item>
                  </div>
                  <div class="clearfix form-item-md">
                    <el-form-item label="上传凭证" >
                      <upload-file ref="uploadFile" :img-list="PayMentEditFormData.Pic"></upload-file>
                    </el-form-item>
                  </div>
                </div>
                <div class="clearfix mb-20" v-if="PaymentFormList.length > 0">
                    <el-table
                            :data="PaymentFormList"
                            ref="multipleTable"
                            v-loading.body="listLoading"
                            element-loading-text="Loading"
                            height="200px"
                            @selection-change="tableSelect"
                            class="table-normal"
                            border fit highlight-current-row>
                      <el-table-column
                        align="center"
                        type="selection"
                        fixed="left"
                        :selectable="selectable"
                        width="55">
                      </el-table-column>
                      <el-table-column label="类型" min-width="120" prop="InOrOut" align="center">
                        <template slot-scope="scope">
                          <span>{{$EnumData.getEnumDesByValue('InOrOut', scope.row.InOrOut)}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="明细"  min-width="150">
                        <template slot-scope="scope">
                          <span>{{scope.row.ProjectName}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="金额" min-width="120" align="center">
                        <template slot-scope="scope">
                          <span>{{scope.row.PaidMoney}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column  :label="labelText"  min-width="120" align="center">
                        <template slot-scope="scope">
                          <span>{{$dateFormat(scope.row.ReceivableDate)}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="备注" min-width="120" align="center">
                        <template slot-scope="scope">
                          <span>{{scope.row.Remarks}}</span>
                        </template>
                      </el-table-column>
                        <!--<el-table-column align="center" label='账单编号' fixed="left" min-width="220">-->
                            <!--<template slot-scope="scope">-->
                                <!--{{scope.row.BillNum}}-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column align="center" label="业务类型" min-width="150">-->
                            <!--<template slot-scope="scope">-->
                                <!--<span>{{$EnumData.getEnumDesByValue('FinanceBusType', scope.row.BillType)}}</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="项目名称" min-width="120" align="center">-->
                            <!--<template slot-scope="scope">-->
                                <!--<span>{{scope.row.ProjectName}}</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="日期" min-width="140" align="center">-->
                            <!--<template slot-scope="scope">-->
                                <!--{{$dateFormat(scope.row.PaymentData)}}-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="应付款金额" min-width="140"  prop="PaidMoney" align="center">-->
                            <!--<template slot-scope="scope">-->
                                <!--{{$priceFormat(scope.row.PaidMoney)}}-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column class-name="status-col" label="优惠金额" prop="Discount" min-width="120" align="center">-->
                            <!--<template slot-scope="scope">-->
                                <!--<span>{{$priceFormat(scope.row.Discount)}}</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->

                        <!--<el-table-column align="center" prop="UnPaidMoney" label="未付金额" min-width="180">-->
                            <!--<template slot-scope="scope">-->
                                <!--<span>{{$priceFormat(scope.row.iop - scope.row.InPaidMoney)}}</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column align="center" label="本次付款"  prop="InPaidMoney"  min-width="220">-->
                            <!--<template slot-scope="scope">-->
                                <!--<el-input-->
                                        <!--v-model="PaymentFormList[scope.$index].InPaidMoney"-->
                                        <!--type="number"-->
                                        <!--min="0"-->
                                        <!--@blur="$positive(PaymentFormList[scope.$index], 'InPaidMoney', 0, false, PaymentFormList[scope.$index].iop)"-->
                                <!--&gt;-->
                                <!--</el-input>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column align="center" fixed="right" label="操作" min-width="250">-->
                            <!--<template slot-scope="scope">-->
                                <!--<table-buttons-->
                                        <!--:options="operationOwnerButton"-->
                                        <!--:condition="['Delete']"-->
                                        <!--:showAll="true"-->
                                        <!--@handleDeleteClick="handleDelete(scope.$index,scope.row)"-->
                                <!--&gt;-->
                                <!--</table-buttons>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                    </el-table>
                </div>
                <div class="clearfix form-item-lg">
                    <el-form-item label="备注" prop="Remarks">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 3, maxRows: 12}"
                                placeholder="请输入备注"
                                v-model="PayMentEditFormData.Remarks"
                        >
                        </el-input>
                    </el-form-item>
                </div>
                <div class="clearfix form-item-md">
                  <el-form-item label="金额合计" v-if="IsshowPaymentMoney" prop="PaymentMoney">
                    <el-input
                      v-model="PayMentEditFormData.PaymentMoney"
                      type="number"
                      min="0"
                      :disabled="true"
                      style="width: 200px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="日期" prop="PaymentData">
                    <el-date-picker
                      v-model="PayMentEditFormData.PaymentData"
                      type="date"
                      placeholder="选择日期"
                      style="width: 200px"
                    >
                    </el-date-picker>
                  </el-form-item>
                    <!--<el-form-item label="结算方式" prop="PaymentType">-->
                        <!--<el-select v-model="PayMentEditFormData.BalanceType" placeholder="请选择">-->
                            <!--<el-option-->
                                    <!--v-for="item in BalanceType"-->
                                    <!--:key="item.Value"-->
                                    <!--:label="item.Description"-->
                                    <!--:value="item.Value"-->
                                    <!--@click.native = "ChangePayWays(item.Value)"-->
                            <!--&gt;-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="账户" prop="InitialCashBank" label-width="100px">-->
                        <!--<el-select v-model="PayMentEditFormData.InitialCashBank" placeholder="请选择">-->
                            <!--<el-option-->
                                    <!--v-for="(item, index) in accountData"-->
                                    <!--:key="index"-->
                                    <!--:label="item.AccountName + item.Account"-->
                                    <!--:value="item.Account"-->
                                    <!--@click.native = "ChangePayWays(item.KeyID)">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                  <el-form-item label="主管"  prop="Remarks">
                    <el-input
                      v-model="PayMentEditFormData.EdName"
                      style="width: 200px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="门店经理"  prop="Remarks">
                    <el-input
                      v-model="PayMentEditFormData.StoreManager"
                      style="width: 200px"
                    >
                    </el-input>
                  </el-form-item>
                    <!--<el-form-item label="优惠金额" prop="Discount">-->
                        <!--<el-input-->
                            <!--v-model="PayMentEditFormData.Discount"-->
                            <!--type="number"-->
                            <!--v-positive="PayMentEditFormData.Discount"-->
                            <!--min="0"-->
                        <!--&gt;-->
                        <!--</el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="付款金额" v-if="IsshowDisabledPaymentMoney" prop="PaymentMoney123">-->
                        <!--<el-input-->
                            <!--v-model="paymentCalData"-->
                            <!--type="number"-->
                            <!--:disabled="true"-->
                            <!--v-positive="paymentCalData"-->
                        <!--&gt;-->
                        <!--</el-input>-->
                    <!--</el-form-item>-->
                    <!--<span style="display: inline-block" class="pt-10">预付款:{{PayMentEditFormData.Advance}}元</span>-->
                </div>
                <span style="display: inline-block;margin-left: 60px;color: #888888" class="pt-10" >若主管、门店经理未填写则默认展示门店名称</span>
            </div>
        </el-form>
        <div slot="footer">
            <el-button @click="SubmitCancel" type="info">取 消</el-button>
            <el-button type="primary" @click="SubmitRequire" :loading="AddButton" >确 认</el-button>
        </div>
        <choice-bill
                ref="choicebill"
                @UpDataTOParent="UpDataTOParent"
        >

        </choice-bill>
      <!--<choice-payment-target-->
        <!--ref="ChoiceTarget"-->
        <!--@AddTargetMsg="AddTargetMsg"-->
      <!--&gt;-->
      <!--</choice-payment-target>-->
    </el-dialog>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import ChoiceBill from './components/ChoiceBill'
  import TableButtons from '@/components/TableButtons'
  import { EditPaymentSingleNew, GetPaymentDetailsNew } from '@/api/ownerBill'
   import { EditReceiveSingleNew, GetReceiptDetailsNew } from '@/api/tenantBill'
  import { UploadFile } from '@/components/UploadFile'

  // import ChoicePaymentTarget from './components/ChoicePaymentTarget'
  // import SelectUser from '../../FinancialVerification/components/SelectUser'
  import SearchHouse from '../../../../components/SearchHouse'

  export default {
    name: 'edit-PayMenSingle',
    components: {
      ChoiceBill,
      TableButtons,
      // SelectUser
      // ChoicePaymentTarget,
      SearchHouse,
      UploadFile
    },
    props: {},
    data() {
      return {
        PaymentFormList: [], // 列表的数据
        ShowEditPayMentDialog: false,
        listLoading: false,
        loading: false,
        AddButton: false,
        IsShowTarget: false,
        IsExhibition: false, // 是否展示新增项目(选择账单有数据的时候才显示表格对象)
        IsshowButton: true,
        disabled: false,
        newAccountData: [],
        IsshowPaymentMoney: true, // 是否显示可填的付款金额
        IsshowDisabledPaymentMoney: false, // 是否显示不可填的付款金额
        PayMentEditFormData: {},
        paymentNewData: '',
        tableSelected: [],
        changestatus: false,
        changestatus1: false,
        ItemIndex: 0,
        labelText: '',
        // editOldData: [],
        // editNewData: [],
        // 本次付款 && 优惠金额
        ControlMoney: null,
        // 表单验证
        rules: {
          CustomerType: [
            { required: true, message: '请输入付款对象类型', trigger: 'change' }
          ],
          PaymentType: [
            { required: true, message: '请输入付款类型', trigger: 'change' }
          ],
          BusinessType: [
            { required: true, message: '请输入业务类型', trigger: 'change' }
          ],
          BalanceType: [
            { required: true, message: '请输入结算方式', trigger: 'change' }
          ],
          PaymentData: [
            { required: true, message: '请输入付款日期', trigger: 'change' }
          ],
          InitialCashBank: [
            { required: true, message: '请输入付款账户', trigger: 'change' }
          ],
          PaymentMoney: [
            { required: true, message: '请输入付款金额', trigger: 'blur' }
          ],
          HouseName: [
            { required: true, message: '请输入房源名称', trigger: 'blur' }
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
      open(row, ItemIndex) {
        this.AddButton = false
        this.loading = true
        this.ShowEditPayMentDialog = true
        this.ItemIndex = ItemIndex // 判断修改收款单还是付款单
        if (this.ItemIndex === 0) {
          this.labelText = '应收日期'
        } else {
          this.labelText = '应支日期'
        }
        this.refreshAccountItem()
        if (ItemIndex === 0) {
          return GetReceiptDetailsNew({
            KeyID: row.KeyID
          }).then(({ Data, BusCode, Msg }) => {
            if (Data) {
              console.log(Data)
              this.loading = false
              this.PayMentEditFormData = Data // 表单的数据
              this.PayMentEditFormData.InOrOut = 1 // 收入
              this.changestatus1 = true
              this.changestatus = false
              this.PaymentFormList = Data.Details
              this.$nextTick(() => {
                this.TabHasSelected(1)
              })
              // this.editOldData = this.$deepCopy(Data.PaymentDetail) // 深度克隆表格老数据
            }
          })
        } else {
          debugger
          return GetPaymentDetailsNew({
            KeyID: row.KeyID
          }).then(({ Data, BusCode, Msg }) => {
            if (Data) {
              console.log(Data)
              this.loading = false
              this.PayMentEditFormData = Data // 表单的数据
              this.PayMentEditFormData.InOrOut = 2 // 支出
              this.changestatus1 = false
              this.changestatus = true
              this.PaymentFormList = Data.Details
              this.$nextTick(() => {
                this.TabHasSelected(2)
              })
              // this.editOldData = this.$deepCopy(Data.PaymentDetail) // 深度克隆表格老数据
            }
          })
        }
        // return GetPaymentTable({
        //   paymentID: row.KeyID
        // }).then(({ Data, BusCode, Msg }) => {
        //   if (Data) {
        //     console.log(Data)
        //     this.loading = false
        //     this.PayMentEditFormData = Data // 表单的数据
        //     // if (this.PayMentEditFormData.PaymentType === 0 || this.PayMentEditFormData.PaymentType === 1) {
        //     //   if (this.PayMentEditFormData.PaymentDetail.length > 0) {
        //     //       this.IsExhibition = false
        //     //   }
        //     //   this.IsshowButton = false
        //     //   this.IsshowPaymentMoney = true
        //     //   this.IsshowDisabledPaymentMoney = false
        //     // } else {
        //     //   if (this.PayMentEditFormData.PaymentDetail.length > 0) {
        //     //      this.IsExhibition = true
        //     //   }
        //     //   this.IsshowDisabledPaymentMoney = true
        //     //   this.IsshowPaymentMoney = false
        //     //   this.IsshowButton = true
        //     // }
        //     // var list = Data.PaymentDetail
        //     // list.forEach(item => {
        //     //    item.iop = item.UnPaidMoney + item.InPaidMoney
        //     //   // item.InPaidMoney = item.iop - item.UnPaidMoney === 0 ? item.UnPaidMoney : item.iop - item.UnPaidMoney
        //     // })
        //     // this.PaymentFormList = list
        //     this.editOldData = this.$deepCopy(Data.PaymentDetail) // 深度克隆表格老数据
        //   }
        // })
      },
      ...mapActions([
        'refreshAccountItem'
      ]),
      // 选中表格的数据
      TabHasSelected(index) {
        this.PaymentFormList.forEach(item => {
          if (item.InOrOut === index) {
            this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(item, true)
          }
        })
      },
      ChangePayWays(value) {
         this.accountData.forEach(item => {
           if (item.KeyID === value) {
             this.PayMentEditFormData.BalanceType = item.AccountType
             this.PayMentEditFormData.InitialCashBankId = value
           }
        })
        console.log(this.newAccountData)
      },
      close() {
        this.ShowEditPayMentDialog = false
      },
      //  子组件只有在账单选择了数据之后,父组件接收数据
      UpDataTOParent(data) {
        if (this.PaymentFormList.length > 0) {
          var newData = data.filter((item) => {
            // if (this.PaymentFormList.length === 0) return true
            var isExist = true
            this.PaymentFormList.forEach((X) => {
              if (item.KeyID === X.PayableID) {
                isExist = false
              }
            })
            return isExist
          })
          this.IsExhibition = true
          newData.forEach(item => {
            console.log(data) // 筛选出来的数据
            var obj = {}
            obj.PayableID = item.KeyID // PayableID  只是账单重复添加去重的标识ID
            obj.BillNum = item.BillNum
            obj.BillType = item.BusinessType
            obj.ProjectName = item.BillProjectName
            obj.PaymentData = item.PayableDate
            obj.Discount = item.Discount
            obj.PaidMoney = item.PayableMoney
            obj.iop = item.UnPaidMoney
            obj.UnPaidMoney = item.UnPaidMoney - obj.iop
            obj.InPaidMoney = item.UnPaidMoney
            obj.Remarks = item.Remark
            this.PaymentFormList.push(obj)
          })
        } else {
          data.forEach(item => {
            this.IsExhibition = true
            console.log(data) // 筛选出来的数据
            var obj = {}
            obj.PayableID = item.KeyID // PayableID  只是账单重复添加去重的标识ID
            obj.BillNum = item.BillNum
            obj.BillType = item.BusinessType
            obj.ProjectName = item.BillProjectName
            obj.PaymentData = item.PayableDate
            obj.Discount = item.Discount
            obj.PaidMoney = item.PayableMoney
            obj.iop = item.UnPaidMoney
            obj.UnPaidMoney = item.UnPaidMoney - obj.iop
            obj.InPaidMoney = item.UnPaidMoney
            obj.Remarks = item.Remark
            this.PaymentFormList.push(obj)
          })
        }
      },
      // 点击选择账单按钮
      handleChoiceBill() {
        if (this.PayMentEditFormData.CustomerName === '') {
          this.$message.error('付款对象名字不能为空')
          return false
        } else if (this.PayMentEditFormData.BusinessType === null) {
          this.$message.error('业务类型不能为空')
        } else if (this.PayMentEditFormData.CustomerName === '' && this.PayMentEditFormData.BusinessType === null) {
          this.$message.error('业务类型和付款对象名字不能为空')
          return false
        } else {
          this.$refs['choicebill'].open({
            QueryType: 2, // 付款单
            CustomerName: this.PayMentEditFormData.CustomerName,
            BusType: this.PayMentEditFormData.BusinessType, // 业务类型
            CustomerPhone: this.PayMentEditFormData.CustomerPhone
          })
        }
      },
      // 点击取消按钮
      SubmitCancel() {
        this.close()
      },
      // 选中的账单支付项目
      tableSelect(val) {
        this.tableSelected = val
        console.log(this.tableSelected)
        if (this.tableSelected.length > 0) {
          var sum = 0
          this.tableSelected.forEach((item, index) => {
            sum += item.PaidMoney
            this.PayMentEditFormData.PaymentMoney = sum
          })
        } else if (this.tableSelected.length === 0) {
          this.PayMentEditFormData.PaymentMoney = ''
        }
      },
      // 修改收支类型的时候掉接口
      ChangeIn() {
        this.tableSelected = []
        if (this.PayMentEditFormData.HouseName === '') {
          // this.$message.error('请选择房源,才能显示对应收支明细')
          return false
        }
        this.GetItemList()
      },
      selectable(row, index) {
        if (row.KeyID) {
          return true
        }
      },
      // 改变付款类型, 是否显示按钮
      changeButton(index) {
        if (index === 0 || index === 1) {
          if (this.PaymentFormList.length > 0) {
              this.PaymentFormList.length = []
              this.IsExhibition = false
          }
          this.IsshowButton = false
          this.IsshowPaymentMoney = true
          this.IsshowDisabledPaymentMoney = false
        } else if (index === 2) {
          if (this.PaymentFormList.length > 0) {
             this.IsExhibition = true
          }
          this.IsshowButton = true
          this.IsshowDisabledPaymentMoney = true
          this.IsshowPaymentMoney = false
        }
      },
      // 选择收款对象时的Table按钮
      // GetChoiceTarget(val) {
      //   console.log(val) // 代表的是类型
      //   this.$refs['ChoiceTarget'].open(val)
      // },
      selectedUserType(val) {
        this.PayMentEditFormData.CustomerName = ''
        this.PaymentFormList = []
        this.$refs['selectUser'].clearCustomerList() // 类型改变时,清除已有的选项
      },
      handleCustomerChange(val) {
        this.PayMentEditFormData.CustomerPhone = val.CustomerPhone
        this.PaymentFormList = []
      },
      // 接受父组件传值
      AddTargetMsg(val) {
        console.log(val)
        if (val.length === 0) {
          this.PaymentFormList = []
          this.PayMentEditFormData.CustomerName = ''
          this.PayMentEditFormData.CustomerType = ''
        } else {
          this.PaymentFormList = []
          this.PayMentEditFormData.CustomerName = val[0].CustomerName // 对象
          this.PayMentEditFormData.CustomerID = val[0].CustomerID // 客户ID
          this.PayMentEditFormData.CustomerPhone = val[0].CustomerPhone // 客户电话
        }
      },
      // ----修改付款单-----
      EditPaymentSingleFun() {
        this.AddButton = true
        this.editNewData = this.PaymentFormList // 操作过表格之后的新数据
        console.log(this.editNewData)
       //  if (this.PayMentEditFormData.PaymentType === 2 && this.editNewData.length === 0) {
       //    this.$message.error('对单付款中，账单不能为空！请选择账单')
       //    this.AddButton = false
       //    return false
       //  } else if (this.editNewData.length > 0) {
       //    this.editNewData.forEach(ele => {
       //      ele.UnPaidMoney = ele.iop - ele.InPaidMoney
       //    })
       //    this.PayMentEditFormData.PaymentMoney = parseFloat(this.paymentNewData) - this.PayMentEditFormData.Discount
       //  }
       //  var newData = this.$DiffArrFn(this.editOldData, this.editNewData, ['UnPaidMoney', 'InPaidMoney'])
       // // console.log(newData)
       //  if (this.PayMentEditFormData.CustomerName === '') {
       //    this.$message.error('收款对象不能为空！')
       //    this.AddButton = false
       //    return false
       //  }
        if (this.tableSelected.length < 0) {
          this.$message.error('房源账单项目不能为空！请选择账单')
          this.AddButton = false
          return false
        }
        if (this.ItemIndex === 0) {
          debugger
          return EditReceiveSingleNew({
            receipt: this.PayMentEditFormData,
            Details: this.tableSelected
          }).then(({ Data, BusCode, Msg }) => {
            if (Data) {
              // debugger
              this.$emit('EditNewPaymentBill', Data, 0)
              this.$refs['PayMentEditFormData'].resetFields()
              // console.log(this.$refs['PayMentEditFormData'], '320')
              this.close()
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.$message({
                type: 'info',
                message: '修改失败!'
              })
            }
          }).catch(() => {
            this.AddButton = false
          })
        } else {
          return EditPaymentSingleNew({
            Payment: this.PayMentEditFormData,
            Details: this.tableSelected
          }).then(({ Data, BusCode, Msg }) => {
            if (Data) {
              // debugger
              this.$emit('EditNewPaymentBill', Data, 1)
              this.$refs['PayMentEditFormData'].resetFields()
              this.close()
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.$message({
                type: 'info',
                message: '修改失败!'
              })
            }
          }).catch(() => {
            this.AddButton = false
          })
        }
      },
      // 点击确认按钮
      SubmitRequire() {
        this.$refs['PayMentEditFormData'].validate((valid) => {
          if (valid) {
            this.EditPaymentSingleFun()
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
          this.PaymentFormList.splice(index, 1)
          if (this.PaymentFormList.length === 0) {
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
            }, 0)
            sums[index] += '元'
          } else {
            sums[index] = '--'
          }
        })
        var allsums = 0
        data.forEach(item => {
          allsums += item.iop - item.InPaidMoney
        })
        sums[6] = allsums + '元'
        this.paymentNewData = sums[7]
        return sums
      }
    },
      computed: {
        // 业务类型枚举(7个)
        BusType() {
          return this.$EnumData.getEnumListByKey('FinanceBusType')
        },
        // 付款类型
        PaymentType() {
          return this.$EnumData.getEnumListByKey('PaymentType')
        },
        // 收款对象
        AcceptType() {
          return this.$EnumData.getEnumListByKey('AcceptType')
        },
        ...mapGetters([
          'accountData'
        ]),
        // 付款金额
        paymentCalData() {
          if (this.PaymentFormList.length === 0) {
              var zxy = 0
              return zxy
          } else {
            var a = 0
            this.PaymentFormList.forEach(item => {
              a += item.InPaidMoney
            })
            const dd = a - this.PayMentEditFormData.Discount
            return dd
          }
        },
        c() {
          var a = 0
          this.PaymentFormList.forEach(item => {
            a += item.InPaidMoney
          })
          return a
        }
    }
  }
</script>

<style scoped>

</style>
