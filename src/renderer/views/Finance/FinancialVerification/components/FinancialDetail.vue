<template>
  <el-dialog
    title="核销单详细"
    width="1280px"
    :close-on-click-modal="true"
    @close="closeDetailed"
    append-to-body
    :center="true"
    :style="{'z-index':'2017'}"
    :show-close="false"
    :visible.sync="dialogFormVisible"
  >
    <el-form ref="form" inline style="height: 525px; ">
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-row>
            <el-row class="DetailsRow">
              <el-col :span="6">
                <span class="CancelDetailTitle">核销单编号:</span>
                <span
                  class="CancelDetailValue"
                >{{ !Detailed.BillNum && Detailed.BillNum === '' ? '有误' : Detailed.BillNum}}</span>
              </el-col>
              <el-col :span="6">
                <span class="CancelDetailTitle">核销单类型:</span>
                <span class="CancelDetailValue">{{Detailed.VerificationType === 1?'应收冲已收':'应付冲已付'}}</span>
              </el-col>
              <el-col :span="6">
                <span class="CancelDetailTitle">业务类型:</span>
                <span
                  class="CancelDetailValue"
                >{{this.$EnumData.getEnumDesByValue('FinanceBusType', Detailed.BusinessType)}}</span>
              </el-col>
              <el-col :span="6">
                <span class="CancelDetailTitle">核销对象:</span>
                <span class="CancelDetailValue">{{Detailed.CustomerName}}</span>
              </el-col>

              <el-col :span="6">
                <span class="CancelDetailTitle">核销金额:</span>
                <span class="CancelDetailValue">{{Detailed.VerificationMoney}}</span>
              </el-col>
              <el-col :span="6">
                <span class="CancelDetailTitle">核销日期:</span>
                <span class="CancelDetailValue">{{ $dateFormat(Detailed.VerificationTime)}}</span>
              </el-col>
              <el-col :span="6">
                <span class="CancelDetailTitle">审核状态:</span>
                <span
                  class="CancelDetailValue"
                >{{this.$EnumData.getEnumDesByValue('AuditStatus', Detailed.AuditStatus)}}</span>
              </el-col>
              <el-col :span="6">
                <span class="CancelDetailTitle">操作人:</span>
                <span class="CancelDetailValue">{{Detailed.CreaterName}}</span>
              </el-col>
              <el-col :span="6" :style="{'width':'100%'}">
                <span class="CancelDetailTitle">备注:</span>
                <span class="CancelDetailValue">{{Detailed.Remark}}</span>
              </el-col>
            </el-row>
          </el-row>
        </div>
        <div class="clearfix" style="margin-bottom: 20px;">
          <h4 class="HouseInfoTitle panel-title">{{PaytitleText}}</h4>
          <el-table
            :data="PaytitleList"
            border
            stripe
            show-summary
            :summary-method="getSummaries"
            max-height="200"
            style="width: 100%"
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
            <el-table-column align="center" prop="PaidMoney" label="单据金额" width="130"></el-table-column>
            <el-table-column align="center" prop="WriteOffAmount" label="已核销金额" width="130"></el-table-column>
            <el-table-column align="center" prop="UnwrittenAmount" label="未核销金额" width="130"></el-table-column>
            <el-table-column align="center" label="本次核销付款" prop="VerificationMoney" min-width="130"></el-table-column>
            <el-table-column prop="Remark" align="center" label="备注"></el-table-column>
          </el-table>
        </div>
        <div class="clearfix" style="margin-bottom: 20px;">
          <h4 class="HouseInfoTitle panel-title">{{PayOrderText}}</h4>
          <el-table
            :data="PayOrderList"
            border
            show-summary
            stripe
            :summary-method="getSummaries"
            max-height="200"
            style="width: 100%"
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
            <el-table-column align="center" prop="PaidMoney" label="单据金额" width="130"></el-table-column>
            <el-table-column align="center" prop="WriteOffAmount" label="已核销金额" width="130"></el-table-column>
            <el-table-column align="center" prop="UnwrittenAmount" label="未核销金额" width="130"></el-table-column>
            <el-table-column align="center" label="本次核销付款" prop="VerificationMoney" min-width="130"></el-table-column>
            <el-table-column prop="Remark" align="center" label="备注"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="CloseCancelInfo">取消</el-button>
      <el-button type="primary" @click="CloseCancelInfo">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { GetVerificationDetailed } from '@/api/finance'
  export default {
    name: 'FinancialCancelDetailed',
    data() {
      return {
        dialogFormVisible: false,
        PaytitleText: null,
        PayOrderText: null,
        // 应付
        PaytitleList: [],
        // 应收
        PayOrderList: [],
        Detailed: []
      }
    },
    computed: {
      // 账户类型
      AcceptType() {
        return this.$EnumData.getEnumListByKey('AcceptType')
      },
      // 业务类型
      BusType() {
        return this.$EnumData.getEnumListByKey('FinanceBusType')
      },
      // 审核状态
      AuditStatus() {
        return this.$EnumData.getEnumListByKey('AuditStatus')
      }
    },
    methods: {
      CloseCancelInfo() {
        this.dialogFormVisible = false
        this.PaytitleList = []
        this.PayOrderList = []
      },
      closeDetailed() {
        this.dialogFormVisible = false
        this.PaytitleList = []
        this.PayOrderList = []
      },
      // 查看核销单纤细
      open(val) {
        console.log(val.KeyID)
        this.dialogFormVisible = true
        const keyid = parseInt(val.KeyID)
        // 得到核销单详细信息
        return GetVerificationDetailed({
          keyId: parseInt(keyid)
        }).then(response => {
          this.UserDetailed = response.Data
          console.log(this.UserDetailed)
          if (this.UserDetailed.VerificationType === 1) {
            this.UserDetailed.ShowDetails.forEach(Show => {
              if (Show.Type === 3) {
                this.PaytitleText = '应收单据'
                // 应收列表
                this.UserDetailed.ReceivableList.forEach(Receivable => {
                  if (Show.RelationID === Receivable.KeyID) {
                    Receivable.CreaterTime = Receivable.ReceivableDate
                    //  Receivable.VerificationMoney = this.UserDetailed.VerificationMoney
                    if (this.UserDetailed.AuditStatus !== 2) {
                      Receivable.UnwrittenAmount = Receivable.UnwrittenAmount - Receivable.VerificationMoney
                    }
                    Receivable.PaidMoney = Receivable.ReceivableMoney
                    this.PaytitleList.push(Receivable)
                  }
                })
              } else if (Show.Type === 1) {
                this.PayOrderText = '收款单'
                // 收款单列表
                this.UserDetailed.ReceiptList.forEach(Receipt => {
                  if (Show.RelationID === Receipt.KeyID) {
                    Receipt['PaidMoney'] = Receipt.ReceiptMoney
                    Receipt.CreaterTime = Receipt.ReceiptData
                    // Receipt.VerificationMoney = this.UserDetailed.VerificationMoney
                    if (this.UserDetailed.AuditStatus !== 2) {
                      Receipt.UnwrittenAmount = Receipt.UnwrittenAmount - Receipt.VerificationMoney
                    }
                    this.PayOrderList.push(Receipt)
                  }
                })
              }
            })
          } else if (this.UserDetailed.VerificationType === 2) {
            this.UserDetailed.ShowDetails.forEach(Show => {
              if (Show.Type === 4) {
                this.PaytitleText = '应付单据'
                // 应付列表
                this.UserDetailed.PayableList.forEach(Payable => {
                  if (Show.RelationID === Payable.KeyID) {
                    Payable.CreaterTime = Payable.PayableDate
                    if (this.UserDetailed.AuditStatus !== 2) {
                      Payable.UnwrittenAmount = Payable.UnwrittenAmount - Payable.VerificationMoney
                    }
                    Payable.PaidMoney = Payable.PayableMoney
                    this.PaytitleList.push(Payable)
                  }
                })
              } else if (Show.Type === 2) {
                this.PayOrderText = '付款单'
                // 付款单列表
                this.UserDetailed.PaymentList.forEach(Payment => {
                  if (Show.RelationID === Payment.KeyID) {
                    // 因（付款，和收款单）字段无法和应收和应付统一 用自定义字段代替
                    Payment['PaidMoney'] = Payment.PaymentMoney
                    // 因时间无法统一 用创建时间暂存代替
                    Payment.CreaterTime = Payment.PaymentData
                    // Payment.VerificationMoney = this.UserDetailed.VerificationMoney
                    if (this.UserDetailed.AuditStatus !== 2) {
                      Payment.UnwrittenAmount = Payment.UnwrittenAmount - Payment.VerificationMoney
                    }
                    // Payment.UnwrittenAmount = Payment.UnwrittenAmount - this.UserDetailed.VerificationMoney
                    this.PayOrderList.push(Payment)
                  }
                })
              }
            })
          }
          console.log(this.PaytitleList)
          this.Detailed = this.UserDetailed
          console.log(this.Detailed)
          this.listLoading = false
          return response.Data
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
            sums[index] = ''
            sums[1] = ''
          }
        })
        sums[7] = ''
        return sums
      }
    }
  }
</script>

<style scoped>
  .el-col-6 {
    min-width: 300px;
  }
  .panel-title {
    padding-left: 10px;
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 15px;
    height: 18px;
    line-height: 18px;
    color: #303133;
    border-left: 4px solid #389ef2;
    font-weight: 400;
  }
  .CancelDetailTitle {
    width: 90px;
    text-align: right;
    display: inline-block;
    font-size: 14px;
    color: #444;
    letter-spacing: 2px;
    line-height: 30px;
  }
  .CancelDetailValue {
    padding-left: 10px;
    font-size: 14px;
    color: #666;
  }
</style>
