<template>
  <el-dialog
    title="详情"
    :visible.sync="ShowEditPayMentDialog"
    width="1200px"
    v-loading="loading"
    :append-to-body="true"
    center
  >
    <el-scrollbar class="vertical-scroll">
      <div class="detail-content">
        <div class="sign-div">
          <div class="sign-content">
            <p class="PText">合同编号: <span class="spanText">{{PayMentEditFormData.ContractNumber || '无'}}</span></p>
            <p class="PText">收支类型:<span class="spanText">{{$EnumData.getEnumDesByValue('InOrOut',PayMentEditFormData.InOrOut)}}</span></p>
            <p class="PText">出房人/经手人:<span class="spanText">{{PayMentEditFormData.OutRoomName || '无'}}</span></p>
            <p class="PText">结算方式:<span class="spanText">{{$EnumData.getEnumDesByValue('PaymentMethod',PayMentEditFormData.BalanceType) || '无'}}</span></p>
            <P class="PText">核销状态:<span class="spanText">{{$EnumData.getEnumDesByValue('VerStatus',PayMentEditFormData.VerificationStatus) || '无'}}</span></P>
          </div>
          <div class="sign-content">
            <p class="PText">小区: <span class="spanText">{{PayMentEditFormData.CommunityName || '无'}}</span></p>
            <p class="PText">合计金额:<span class="spanText">{{PayMentEditFormData.PaymentMoney + '元' || '无'}}</span></p>
            <p class="PText">主管:<span class="spanText">{{PayMentEditFormData.EdName|| '无'}}</span></p>
            <p class="PText">账户:<span class="spanText">{{PayMentEditFormData.InitialCashBank ||'无' }}</span></p>
            <p class="PText">备注:<span class="spanText">{{PayMentEditFormData.Remarks || '无'}}</span></p>
          </div>
          <div class="sign-content">
            <p class="PText">房间号:<span class="spanText">{{PayMentEditFormData.RoomNumber || '无' }}</span></p>
            <!--<p>预付款:{{PayMentEditFormData.Advance + '元' || '无'}}</p>-->
            <p class="PText">日期:<span class="spanText">{{$dateFormat(PayMentEditFormData.PaymentData) || '无'}}</span></p>
            <p class="PText">门店经理:<span class="spanText">{{PayMentEditFormData.StoreManager|| '无'}}</span></p>
          </div>
        </div>
        <div class="PText pic-proof-container">
          <p class="pic-title">图片凭证:</p>
          <div class="pic-proof" v-if="PayMentEditFormData.Pic&&PayMentEditFormData.Pic.length>0"  v-viewer="{url: 'data-src'}">
            <div class="proof-img" v-for="(item, index) in PayMentEditFormData.Pic"
                 :key="index"
            >
              <img :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                   :data-src="$ImgUnit.getImgUrl(item.ImageLocation)"
                   alt="">
            </div>
          </div>
          <span v-else class="spanText">无</span>
        </div>
        <div class="clearfix mb-20" v-if="IsExhibition">
          <el-table
            :data="PaymentFormList"
            ref="multipleTable"
            v-loading.body="listLoading"
            element-loading-text="Loading"
            height="300px"
            class="table-normal"
            border fit highlight-current-row>
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
            <el-table-column label="备注" min-width="120" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.Remark}}</span>
              </template>
            </el-table-column>
            <!--<el-table-column align="center" label='账单编号' fixed="left" min-width="220">-->
            <!--<template slot-scope="scope">-->
            <!--{{scope.row.BillNum}}-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column align="center" label="业务类型" min-width="100">-->
            <!--<template slot-scope="scope">-->
            <!--<span>{{$EnumData.getEnumDesByValue('BusType', scope.row.BillType)}}</span>-->
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
            <!--&lt;!&ndash;<el-table-column class-name="status-col" label="优惠金额" prop="Discount" min-width="120" align="center">&ndash;&gt;-->
            <!--&lt;!&ndash;<template slot-scope="scope">&ndash;&gt;-->
            <!--&lt;!&ndash;<span>{{$priceFormat(scope.row.Discount)}}</span>&ndash;&gt;-->
            <!--&lt;!&ndash;</template>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->

            <!--<el-table-column align="center" prop="UnPaidMoney" label="未付金额" min-width="160">-->
            <!--<template slot-scope="scope">-->
            <!--<span>{{$priceFormat(PaymentFormList[scope.$index].UnPaidMoney)}}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column align="center" label="本次付款" prop="InPaidMoney" min-width="220">-->
            <!--<template slot-scope="scope">-->
            <!--<el-input-->
            <!--v-model="PaymentFormList[scope.$index].InPaidMoney"-->
            <!--type="number"-->
            <!--:disabled="true"-->
            <!--v-positive="PaymentFormList[scope.$index].InPaidMoney"-->
            <!--&gt;-->
            <!--</el-input>-->
            <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </div>
      </div>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <!--<el-button @click="SubmitCancel" type="info">取 消</el-button>-->
      <el-button type="primary" @click="SubmitRequire">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { GetPaymentDetailsNew } from '@/api/ownerBill'
  import { GetReceiptDetailsNew } from '@/api/tenantBill'

  export default {
    name: 'detail-paymentsingle',
    data() {
      return {
        PaymentFormList: [], // 列表的数据
        ShowEditPayMentDialog: false,
        listLoading: false,
        loading: false,
        IsExhibition: false,
        PayMentEditFormData: {},
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
      open(row, index) {
        this.loading = true
        this.ShowEditPayMentDialog = true
        if (index === 0) {
          return GetReceiptDetailsNew({
            KeyID: row.KeyID
          }).then(({ Data, BusCode, Msg }) => {
            if (Data) {
              console.log(Data)
              this.loading = false
              this.PayMentEditFormData = Data
              this.PayMentEditFormData.InOrOut = Data.Details[0]['InOrOut']
              this.PaymentFormList = Data.Details
              if (this.PaymentFormList.length === 0) {
                this.IsExhibition = false
              } else {
                this.IsExhibition = true
              }
            }
          })
        } else {
          return GetPaymentDetailsNew({
            KeyID: row.KeyID
          }).then(({ Data, BusCode, Msg }) => {
            if (Data) {
              console.log(Data)
              this.loading = false
              this.PayMentEditFormData = Data
              this.PayMentEditFormData.InOrOut = Data.Details[0]['InOrOut']
              this.PaymentFormList = Data.Details
              if (this.PaymentFormList.length === 0) {
                this.IsExhibition = false
              } else {
                this.IsExhibition = true
              }
            }
          })
        }
      },
      close() {
        this.ShowEditPayMentDialog = false
      },
      SubmitRequire() {
        this.ShowEditPayMentDialog = false
      },
      SubmitCancel() {
        this.ShowEditPayMentDialog = false
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
      },
    //  收支类型
      InOrOut() {
        return this.$EnumData.getEnumListByKey('InOrOut')
      },
    //  核销类型
      VerStatus() {
        return this.$EnumData.getEnumListByKey('VerStatus')
      },
    //  结算方式
      PaymentMethod() {
        return this.$EnumData.getEnumListByKey('PaymentMethod')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
  .detail-content {
    height: 480px;
  }
  .PText {
    color: black;
    font-size: 15px;
  }
  .sign-div {
    @include displayFlex(row, stretch, space-around);
    .sign-content {
      flex: 1;
      .spanText {
        color: #858585;
        padding-left: 5px;
      }
    }
  }
  .pic-proof-container {
    @include displayFlex(row,flex-start,flex-start);
    .pic-title {
      min-width: 80px;
    }
    .pic-proof {
      margin-bottom: 30px;
      flex-wrap: wrap;
      @include displayFlex(row,flex-start,flex-start);
      .proof-img {
        width: 200px;
        height: 110px;
        margin-bottom: 10px;
        @include displayFlex(row, center, center);
        img {
          max-height: 110px;
          max-width: 200px;
          cursor: zoom-in;
        }
      }
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
