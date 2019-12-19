<template>
  <el-dialog
    title="新增收付款单"
    :visible.sync="ShowPayMentDialog"
    width="1200px"
    v-loading="loading"
    :append-to-body="true"
    @close="closeDialog"
    center
  >
    <el-form
      :inline="true"
      label-width="100px"
      style="height: 500px"
      :model="PayMentData"
      ref="PayMentData"
      :rules="rules"
    >
      <el-scrollbar class="vertical-scroll">
        <div class="dialog-box form-item-sm">
          <div class="clearfix form-item-sm">
            <div class="clearfix form-item-md">
              <el-form-item label="收支类型" prop="InOrOut">
                <el-radio-group v-model="PayMentData.InOrOut" :disabled="disabled">
                  <el-radio :label="1" @change="ChangeIn(1)">收款单</el-radio>
                  <el-radio :label="2" @change="ChangeIn(2)">付款单</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="clearfix form-item-md">
              <el-form-item label="房源名称" prop="HouseName">
                <search-house v-model="PayMentData.HouseName" :type="12" @select="handleHouseSelect"></search-house>
              </el-form-item>
            </div>
          </div>
          <div class="clearfix mb-20" v-if="PaymentFormList.length > 0">
            <el-table
              :data="PaymentFormList"
              v-if="PaymentFormList.length > 0"
              ref="multipleTable"
              v-loading.body="listLoading"
              element-loading-text="Loading"
              @selection-change="tableSelect"
              height="200px"
              class="table-normal"
              width="300px"
              border
              fit
              highlight-current-row
            >
              <el-table-column align="center" type="selection" fixed="left" width="55"></el-table-column>
              <el-table-column label="类型" min-width="120" prop="InOrOut" align="center">
                <template slot-scope="scope">
                  <span class="mark_btn" v-show="scope.row.ShowImg">本月</span>
                  <span>{{$EnumData.getEnumDesByValue('InOrOut', scope.row.InOrOut)}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="明细" min-width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.ProjectName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="金额" min-width="120" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.PaidMoney}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="labelText" min-width="120" align="center">
                <template slot-scope="scope">
                  <span>{{$dateFormat(scope.row.ReceivableDate)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="备注" min-width="120" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.Remark}}</span>
                </template>
              </el-table-column>
              <!--<el-table-column label="日期" min-width="140" align="center">-->
              <!--<template slot-scope="scope">-->
              <!--{{$dateFormat(scope.row.PaymentData)}}-->
              <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column label="应付款金额" min-width="140" prop="PaidMoney" align="center">-->
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
              <!--<el-table-column align="center" label="本次付款" prop="InPaidMoney" min-width="220">-->
              <!--<template slot-scope="scope">-->
              <!--<el-input-->
              <!--v-model="PaymentFormList[scope.$index].InPaidMoney"-->
              <!--type="number"-->
              <!--@blur="$positive(PaymentFormList[scope.$index], 'InPaidMoney', 0, false, PaymentFormList[scope.$index].iop)"-->
              <!--&gt;-->
              <!--</el-input>-->
              <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column align="center" fixed="right" label="操作" min-width="180">-->
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
          <div class="clearfix form-item-md">
            <el-form-item label="金额合计" v-if="IsshowPaymentMoney" prop="PaymentMoney">
              <el-input
                v-model="PayMentData.PaymentMoney"
                type="number"
                min="0"
                :disabled="true"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="日期" prop="PaymentData">
              <el-date-picker
                v-model="PayMentData.PaymentData"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                style="width: 200px"
              ></el-date-picker>
            </el-form-item>


            <!--<el-form-item label="优惠金额" prop="Discount">-->
            <!--<el-input-->
            <!--v-model="PayMentData.Discount"-->
            <!--type="number"-->
            <!--v-positive="PayMentData.Discount"-->
            <!--min="0"-->
            <!--max="paymentCalData"-->
            <!--&gt;-->
            <!--</el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="付款金额" v-if="IsshowDisabledPaymentMoney" prop="PaymentMoney12">-->
            <!--<el-input-->
            <!--v-model="paymentCalData"-->
            <!--type="number"-->
            <!--:disabled="true"-->
            <!--v-positive="paymentCalData"-->
            <!--&gt;-->
            <!--</el-input>-->
            <!--</el-form-item>-->
          </div>
          <div class="clearfix form-item-md">
            <el-form-item label="主管">
              <el-input v-model="PayMentData.EdName" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="门店经理">
              <el-input v-model="PayMentData.StoreManager" style="width: 200px"></el-input>
            </el-form-item>
          </div>
          <span
            style="display: inline-block;margin-left: 60px;color: #888888;margin-top: -30px;margin-bottom: 30px;"
          >若主管、门店经理未填写则默认展示门店名称</span>
          <div class="clearfix form-item-md">
            <el-form-item label="上传凭证">
              <upload-file ref="uploadFile" :img-list="PayMentData.Pic"></upload-file>
            </el-form-item>
          </div>
          <div class="clearfix form-item-lg">
            <el-form-item label="备注" prop="Remarks">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 12}"
                placeholder="请输入备注"
                v-model="PayMentData.Remarks"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-scrollbar>
    </el-form>
    <div slot="footer">
      <el-button @click="SubmitCancel" type="info">取 消</el-button>
      <el-button type="primary" @click="SubmitRequire" :loading="AddButton">确 认</el-button>
    </div>
    <choice-bill ref="choicebill" @UpDataTOParent="UpDataTOParent"></choice-bill>
    <choice-payment-target ref="ChoiceTarget" @AddTargetMsg="AddTargetMsg"></choice-payment-target>
  </el-dialog>
</template>
<script>
  import ChoiceBill from './components/ChoiceBill'
  import TableButtons from '@/components/TableButtons'
  import { AddPaymentSingleNew, GetBillListData } from '@/api/ownerBill'
  import { AddReceiveSingleNew } from '@/api/tenantBill'
  import ChoicePaymentTarget from './components/ChoicePaymentTarget'
  import SearchHouse from '../../../../components/SearchHouse'
  import { UploadFile } from '@/components/UploadFile'
  import { priceFormat } from '../../../../utils/priceFormat'

  export default {
    name: 'add-new-paymentsingle',
    components: {
      ChoiceBill,
      TableButtons,
      ChoicePaymentTarget,
      SearchHouse,
      UploadFile
    },
    data() {
      return {
        PaymentFormList: [], // 列表的数据
        ShowPayMentDialog: false,
        listLoading: false,
        loading: false,
        AddButton: false,
        // IsShowTarget: false, // 是否展示付款对象名称
        IsExhibition: false, // 是否展示新增项目(选择账单有数据的时候才显示表格对象)
        IsshowButton: false, // 是否显示收款账单按钮
        IsshowPaymentMoney: true, // 是否显示可填的付款金额
        IsshowDisabledPaymentMoney: false, // 是否显示不可填的付款金额
        paymentNewData: '', // 最原始的总金额
        ItemIndex: 0, // 判断是收入还是支出
        disabled: false,
        tableSelected: [],
        labelText: '',
        PayMentData: {
          // CustomerName: '', // 付款对象
          // CustomerType: this.$EnumData.getEnumDesByValue('CustomerType'), // 客户类型
          // CustomerID: '', // 客户ID
          // CustomerPhone: '', // 客户电话
          // PaymentType: this.$EnumData.getEnumDesByValue('PaymentType'), // 付款类型
          // BusinessType: this.$EnumData.getEnumDesByValue('FinanceBusType'), // 业务类型
          PaymentData: new Date(), // 付款日期
          BalanceType: '', // 结算方式
          // Discount: '', // 优惠金额
          PaymentMoney: '', // 付款金额
          HouseName: '',
          HouseID: '',
          HouseKey: '',
          InOrOut: 1,
          EdName: '',
          StoreManager: '',
          Pic: [] // 图片凭证
        },
        // 表单验证
        rules: {
          CustomerType: [
            { required: true, message: '请输入付款对象类型', trigger: 'change' }
            // { validator: CustomerType1, trigger: 'change' }
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
          PaymentMoney: [
            { required: true, message: '请输入付款金额', trigger: 'blur' }
          ],
          HouseName: [
            { required: true, message: '请输入房源名称', trigger: 'blur' }
          ],
          InOrOut: [
            { required: true, message: '请输入收入支出', trigger: 'change' }
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
    created() {
      //
    },
    methods: {
      open(index) {
        this.AddButton = false
        this.PaymentFormList = []
        this.IsExhibition = false
        this.ShowPayMentDialog = true
        this.PayMentData.Pic = []
        if (index === 0) {
          this.ItemIndex = 0
          this.PayMentData.InOrOut = 1 // 收入
          this.labelText = '应收日期'
        } else {
          this.ItemIndex = 1
          this.PayMentData.InOrOut = 2 // 支出
          this.labelText = '应支日期'
        }
      },
      close() {
        this.ShowPayMentDialog = false
      },
      selectable() {
      },
      // 勾选账单的项目
      tableSelect(val) {
        this.tableSelected = val
        console.log(this.tableSelected)
        if (this.tableSelected.length > 0) {
          var sum = 0
          this.tableSelected.forEach((item, index) => {
            // 当前为收款单，则收入为正，支出为负，若为负不允许保存
            // 当前为付款单，则收入为负，支出为正，若为负不允许保存
            let paidMoney = item.PaidMoney
            if ((this.PayMentData.InOrOut === 1 && item.InOrOut === 2) || (this.PayMentData.InOrOut === 2 && item.InOrOut === 1)) {
              paidMoney = -item.PaidMoney
            }
            sum += paidMoney
            this.PayMentData.PaymentMoney = priceFormat(sum)
          })
        } else if (this.tableSelected.length === 0) {
          this.PayMentData.PaymentMoney = ''
        }
      },
      // 根据搜索的房源直接获取账单列表项目
      GetItemList() {
        return GetBillListData({
          houseID: this.PayMentData.HouseID,
          HouseName: this.PayMentData.HouseName,
          inOrOut: this.PayMentData.InOrOut
        }).then(({ Data, BusCode, Msg }) => {
          console.log(Data)
          Data.map(x => {
            x.ShowImg = this.$dateFormat(x.ReceivableDate, 'yyyyMM') === this.$dateFormat(new Date(), 'yyyyMM')
          })
          this.PaymentFormList = Data
          this.editOldData = this.$deepCopy(Data) // 深拷贝老表格的数据
        })
      },
      // 搜索房源
      handleHouseSelect(item) {
        this.PayMentData.HouseID = item.KeyID
        this.PayMentData.HouseName = item.HouseName
        this.PayMentData.HouseKey = item.HouseKey
        this.GetItemList()
      },
      // 修改收支类型的时候掉接口
      ChangeIn(index) {
        this.tableSelected = []
        if (index === 1) {
          this.labelText = '应收日期'
        } else {
          this.labelText = '应支日期'
        }
        if (this.PayMentData.HouseName === '') {
          // this.$message.error('请选择房源,才能显示对应收支明细')
          return false
        }
        this.GetItemList()
      },
      //  子组件只有在账单选择了数据之后,父组件接收数据
      UpDataTOParent(data) {
        console.log(data)
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
            obj.iop = item.UnPaidMoney // 未付
            obj.UnPaidMoney = item.UnPaidMoney - obj.iop
            obj.InPaidMoney = item.UnPaidMoney
            obj.Remarks = item.Remark
            this.PaymentFormList.push(obj)
          })
          console.log(this.PaymentFormList + 'aaa')
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
            obj.iop = item.UnPaidMoney // 未付
            obj.UnPaidMoney = item.UnPaidMoney - obj.iop
            obj.InPaidMoney = item.UnPaidMoney
            obj.Remarks = item.Remark
            this.PaymentFormList.push(obj)
          })
        }
        console.log(this.PaymentFormList)
      },
      // 点击取消按钮
      SubmitCancel() {
        this.$refs['PayMentData'].resetFields()
        this.close()
      },
      // 接受父组件传回的一条表格数据
      AddTargetMsg(val) {
        console.log(val)
        if (val.length === 0) {
          this.PaymentFormList = []
          this.PayMentData.CustomerType = ''
          this.PayMentData.CustomerName = ''
        } else {
          this.PaymentFormList = []
          this.PayMentData.CustomerName = val[0].CustomerName // 对象
          this.PayMentData.CustomerID = val[0].CustomerID // 客户ID
          this.PayMentData.CustomerPhone = val[0].CustomerPhone
        }
      },
      // 根据新增收付款单的收入和支出判断调用接口
      CommonInterFace() {
        if (this.PayMentData.InOrOut === 1) {
          return AddReceiveSingleNew({
            Receipt: this.PayMentData,
            Details: this.tableSelected
          }).then(({ Data, BusCode, Msg }) => {
            if (Data) {
              console.log(Data)
              this.$emit('AddNewPaymentBill', Data, 0)
              this.$refs['PayMentData'].resetFields()
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
        } else if (this.PayMentData.InOrOut === 2) {
          return AddPaymentSingleNew({
            Payment: this.PayMentData,
            Details: this.tableSelected
          }).then(({ Data, BusCode, Msg }) => {
            if (Data) {
              console.log(Data)
              this.$emit('AddNewPaymentBill', Data, 1)
              this.$refs['PayMentData'].resetFields()
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
        }
      },
      // ----新增添加(收付)款单-----
      AddPaymentSingleFun() {
        this.AddButton = true
        // this.editNewData = this.PaymentFormList
        // var newData = this.$DiffArrFn(this.editNewData, this.editNewData)
        if (this.tableSelected.length <= 0) {
          this.$message.error('房源账单项目不能为空！请选择账单')
          this.AddButton = false
          return false
        }
        if (this.PayMentData.PaymentMoney <= 0) {
          this.$message({
            type: 'error',
            message: '金额合计不能为负!'
          })
          this.AddButton = false
          return false
        }
        if (this.ItemIndex === 0) {
          this.CommonInterFace()
        } else {
          this.CommonInterFace()
        }
      },
      // 点击确认按钮
      SubmitRequire() {
        this.$refs['PayMentData'].validate((valid) => {
          if (valid) {
            this.AddPaymentSingleFun()
          }
        })
      },
      closeDialog() {
        this.$refs['PayMentData'].resetFields()
      },
      // 删除选择表单的每一项
      handleDelete(index, data) {
        this.$confirm('确定删除这条账单数据?, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
      // 付款对象
      AcceptType() {
        return this.$EnumData.getEnumListByKey('CustomerType')
      },
      // 收支类型
      InOrOut() {
        return this.$EnumData.getEnumListByKey('InOrOut')
      },
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
          const dd = a - this.PayMentData.Discount
          return dd
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-dialog {
    height: 700px !important;
    overflow-y: scroll !important;
  }

  .mark_btn {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 12px;
    width: 30px;
    height: 16px;
    line-height: 16px;
    border-bottom-right-radius: 4px;
    background-color: #389EF2;
    color: #fff;
  }
</style>
