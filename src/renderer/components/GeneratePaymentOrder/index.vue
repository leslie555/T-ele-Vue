<template>
  <div>
    <el-dialog
      title="生成付款单"
      :visible.sync="paymentDialogVisible"
      append-to-body
      width="50%"
    >
      <el-form
        :inline="true"
        label-width="100px"
        style="height: 500px"
        :model="PayMentOrder"
        ref="PayMentOrder"
        :rules="rules"
      >
      <el-scrollbar class="vertical-scroll">
      <div>
        <p class="payment-order-title">
          <label><span> 房源名称：</span>{{Reimbursements.HouseName}}</label>
          <label><span> 合同编号：</span>{{Reimbursements.ContractNum}}</label>
        </p>
        <div class="clearfix payment-order-table">
          <span>费用项目：</span>
           <el-table
            :data="tableData"
            border
            style="width: 80%;float: left;"
            v-loading="listLoading"
            >
            <el-table-column prop="BillProjectName" label="费用项目" align="center"></el-table-column>
            <el-table-column prop="BillProjectTypeName" label="类别" align="center">
              <!-- <template slot-scope="scope">
                {{$EnumData.getEnumDesByValue('ReimbursementStatus', scope.row.BillProjectTypeName)}}
              </template> -->
            </el-table-column>
            <el-table-column prop="Money" label="金额" align="center">
              <template slot-scope="scope">
                {{$priceFormat(scope.row.Money)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="clearfix form-item-md">
          <el-form-item label="金额合计" prop="PaymentMoney">
            <el-input
              v-model="PayMentOrder.PaymentMoney"
              type="number"
              min="0"
              :disabled="true"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="日期" prop="PaymentData">
            <el-date-picker
              v-model="PayMentOrder.PaymentData"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 200px"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="clearfix form-item-md">
          <el-form-item label="主管" prop="EdName">
            <el-input v-model="PayMentOrder.EdName" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="门店经理" prop="StoreManager">
            <el-input v-model="PayMentOrder.StoreManager" style="width: 200px"></el-input>
          </el-form-item>
        </div>
        <!-- <span
          style="display: inline-block;margin-left: 60px;color: #888888;margin-top: -30px;margin-bottom: 30px;"
        >若主管、门店经理未填写则默认展示门店名称</span> -->
        <div class="clearfix form-item-md">
          <el-form-item label="图片凭证" prop="Pic">
            <upload-file ref="uploadFile" :img-list="PayMentOrder.Pic"></upload-file>
          </el-form-item>
        </div>
        <div class="clearfix form-item-lg">
          <el-form-item label="备注" prop="Remarks">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 12}"
              placeholder="请输入备注"
              v-model="PayMentOrder.Remarks"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      </el-scrollbar>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ShowReimbursementDetails, AddPaymentNew } from '@/api/finance'
import { UploadFile } from '@/components/UploadFile'
import { priceFormat } from '@/utils/priceFormat'
export default {
  name: 'GeneratePaymentOrder',
  components: {
    UploadFile
  },
  data() {
    return {
      paymentDialogVisible: false,
      submitLoading: false,
      listLoading: false,
      tableData: [],
      Reimbursements: '',
      PayMentOrder: {
        PaymentMoney: '',
        PaymentData: '',
        EdName: '',
        StoreManager: '',
        Pic: [],
        Remarks: ''
      },
      rules: {
        PaymentData: [
          { required: true, message: '请输入付款日期', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    open(row) {
      console.log('row:', row)
      this.listLoading = true
      ShowReimbursementDetails({
        KeyID: row.KeyID
      }).then(({ Data }) => {
        if (Data) {
          this.tableData = Data.reimbursementTypes
          this.Reimbursements = Data.reimbursements[0]
          this.PayMentOrder.PaymentMoney = priceFormat(this.filtePaymentData(Data.reimbursementTypes))
          this.listLoading = false
        }
        console.log('付款单详情Data:', Data)
      })
      this.paymentDialogVisible = true
    },
    close() {
      this.paymentDialogVisible = false
      // this.PayMentOrder.Pic = []
      // this.PayMentOrder.PaymentData = ''
      // this.PayMentOrder.StoreManager = ''
      // this.PayMentOrder.EdName = ''
      // this.PayMentOrder.Remarks = ''
      this.$refs['PayMentOrder'].resetFields()
    },
    filtePaymentData(Data) {
      const Sum = Data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.Money
      }, 0)
      return Sum
    },
    handlePicDataList(PicData) {
      const picArr = PicData.map(val => {
        return val.KeyID
      })
      return picArr.join(',')
    },
    handleSubmit() {
      this.$refs['PayMentOrder'].validate((valid) => {
        if (valid) {
          // 调接口
          this.submitLoading = true
          AddPaymentNew({
            KeyID: this.Reimbursements.KeyID,
            HouseID: this.Reimbursements.HouseID,
            HouseKey: this.Reimbursements.HouseKey,
            CountMoney: this.PayMentOrder.PaymentMoney, // 总金额
            EdName: this.PayMentOrder.EdName, // 主管
            StoreManager: this.PayMentOrder.StoreManager, // 门店经理
            PaymentData: this.PayMentOrder.PaymentData, // 付款日期
            Remarks: this.PayMentOrder.Remarks, // 付款单备注
            PicIds: this.handlePicDataList(this.PayMentOrder.Pic) // 付款单图片ID
          }).then(({ Data }) => {
            if (!Data.Code) {
              this.submitLoading = false
              this.close()
              this.$message.success(Data.Msg)
              const resData = { KeyID: this.Reimbursements.KeyID, Status: Data.BusCode }
              this.$emit('handlePayment', resData)
            } else {
              this.$message.error(Data.Msg)
              this.submitLoading = false
              return false
            }
            console.log('生成付款单接口Data:', Data)
          })
        } else {
          this.$message.error('请填写完整信息!')
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './styles.scss'
</style>