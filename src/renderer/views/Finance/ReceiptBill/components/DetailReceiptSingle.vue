<template>
  <el-dialog
    title="详情"
    :visible.sync="ShowReceiptDialog"
    width="1200px"
    v-loading="loading"
    height="700px"
    :append-to-body="true"
    center
  >
    <!--<el-form :inline="true" label-width="100px" :model="PayMentEditFormData" ref="PayMentEditFormData">-->
    <div class="sign-div">
      <div class="sign-content">
        <p>单据编号: {{ReceiptEditFormData.BillNum || '无'}}</p>
        <p>收款金额:{{ReceiptEditFormData.ReceiptMoney || '无'}}</p>
        <p>收款日期:{{$dateFormat(ReceiptEditFormData.ReceiptData) || '无'}}</p>
        <p>单据状态:{{$EnumData.getEnumDesByValue('AuditStatus',ReceiptEditFormData.AuditStatus) || '无'}}</p>
        <p>付款账户:{{ReceiptEditFormData.InitialCashBank || '无'}}</p>
        <p>备注:{{ReceiptEditFormData.Remarks || '无'}}</p>
      </div>
      <div class="sign-content">
        <p>收款类型: {{$EnumData.getEnumDesByValue('ReceiptType', ReceiptEditFormData.ReceiptType) || '无'}}</p>
        <p>优惠金额: {{ReceiptEditFormData.Discount + '元'|| '无'}}</p>
        <p>收款对象: {{ReceiptEditFormData.CustomerName || '无'}}</p>
        <p>操作人: {{ReceiptEditFormData.CreaterName || '无'}}</p>
      </div>
      <div class="sign-content">
        <p>业务类型:{{$EnumData.getEnumDesByValue('BusType', ReceiptEditFormData.BusinessType) || '无'}}</p>
        <!--<p>预收款:{{ReceiptEditFormData.ReceiptMoney + '元' || '无'}}</p>-->
        <p>结算方式:{{ReceiptEditFormData.BalanceType|| '无'}}</p>
      </div>
    </div>
    <div class="panel2 mt-10">
      <div class="panel-title">关联账单</div>
    </div>
    <div class="clearfix mb-20" v-if="IsExhibition">
      <el-table
        :data="ReceiptFormList"
        ref="multipleTable"
        v-loading.body="listLoading"
        element-loading-text="Loading"
        height="300px"
        :summary-method="getSummaries"
        show-summary
        class="table-normal"
        border fit highlight-current-row>
        <el-table-column align="center" label='账单编号' fixed="left" min-width="220">
          <template slot-scope="scope">
            {{scope.row.BillNum}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="业务类型" min-width="100">
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
          <template slot-scope="scope">
            {{$dateFormat(scope.row.ReceiptData)}}
          </template>
        </el-table-column>
        <el-table-column label="应收款金额" min-width="140"  prop="PaidMoney" align="center">
          <template slot-scope="scope">
            {{$priceFormat(scope.row.PaidMoney)}}
          </template>
        </el-table-column>
        <!--<el-table-column class-name="status-col" label="优惠金额" prop="Discount" min-width="120" align="center">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{$priceFormat(scope.row.Discount)}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column align="center" prop="UnPaidMoney" label="未付金额" min-width="160">
          <template slot-scope="scope">
            <span>{{$priceFormat(ReceiptFormList[scope.$index].UnPaidMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="本次收款" prop="InPaidMoney" min-width="220">
          <template slot-scope="scope">
            <el-input
              v-model="ReceiptFormList[scope.$index].InPaidMoney"
              type="number"
              :disabled="true"
              v-positive="ReceiptFormList[scope.$index].InPaidMoney"
            >
            </el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--</el-form>-->
    <div slot="footer">
      <el-button @click="SubmitCancel" type="info">取 消</el-button>
      <el-button type="primary" @click="SubmitRequire">确 认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { GetReceiptTable } from '@/api/tenantBill'

  export default {
    name: 'detail-receipt-single',
    data() {
      return {
        ReceiptFormList: [], // 列表的数据
        ShowReceiptDialog: false,
        listLoading: false,
        loading: false,
        IsExhibition: false,
        ReceiptEditFormData: {},
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
          }],
        InitialCashBank: [{
          label: '中国工商银行',
          Value: '中国工商银行'
        }]
      }
    },
    methods: {
      open(row) {
        this.loading = true
        this.ShowReceiptDialog = true
        return GetReceiptTable({
          receiptID: row.KeyID
        }).then(({ Data, BusCode, Msg }) => {
          if (Data) {
            console.log(Data)
            this.loading = false
            this.ReceiptEditFormData = Data
            this.ReceiptFormList = Data.ReceiptDetail
            if (this.ReceiptFormList.length === 0) {
              this.IsExhibition = false
            } else {
              this.IsExhibition = true
            }
          }
        })
      },
      close() {
        this.ShowReceiptDialog = false
      },
      SubmitRequire() {
        this.ShowReceiptDialog = false
      },
      SubmitCancel() {
        this.ShowReceiptDialog = false
      },
      // 统计账单详情
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
            sums[index] += ' 元'
          } else {
            sums[index] = '--'
          }
        })
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
  .sign-div {
    @include displayFlex(row, stretch, space-around);
    .sign-content {
      flex: 1;
    }
  }
  p{
    margin-bottom: 10px;
  }
  .panel2{
    padding-left: 14px;
    margin-bottom: 10px;
    font-size: 16px;
    position: relative;
    .panel-title:before{
      content: '';
      position: absolute;
      height: 16px;
      width: 4px;
      margin-top: -8px;
      top: 50%;
      left: 0;
      background: #389ef2;
    }
  }
</style>
