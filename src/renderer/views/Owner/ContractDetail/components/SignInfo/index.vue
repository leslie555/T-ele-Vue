<template>
  <div class="sign-info">
    <div class="sign-info"></div>
    <template v-if="OwnerInfo.length>0">
      <div class="panel-title">其他业主</div>
      <div class="panel-body">
        <div class="text-box" v-for="(v,i) in OwnerInfo">
          <div class="text-item">
            <span>业主姓名</span>
            <span>{{v.OwnerName}}</span>
          </div>
          <div class="text-item">
            <span>业主电话</span>
            <span>{{v.OwnerPhone}}</span>
          </div>
          <div class="text-item">
            <span>业主身份证号</span>
            <span>{{v.OwnerIDCard}}</span>
          </div>
        </div>
      </div>
    </template>
    <div class="panel-title">签约信息</div>
    <div class="panel-body">
      <div class="text-box">
        <div class="text-item">
          <span class="text-blue">托管起始日期</span>
          <span class="text-blue">{{$dateFormat(ContractInfo.HostStartTime)}}至{{$dateFormat(ContractInfo.HostEndTime)}}</span>
        </div>
        <div class="text-item">
          <span class="text-blue">租期</span>
          <span class="text-blue">{{diffTime(ContractInfo.HostStartTime,ContractInfo.HostEndTime)}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>合同编号</span>
          <span>{{ContractInfo.ContractNumber}}</span>
        </div>
        <div class="text-item">
          <span>合同类型</span>
          <span>{{$EnumData.getEnumDesByValue('PaperType',ContractInfo.PaperType)}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>拿房价格</span>
          <span>{{ContractInfo.InitialPrice}}元/月</span>
        </div>
        <div class="text-item">
          <span>房屋押金</span>
          <span>{{ContractInfo.HouseDeposit||'-'}}元</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>付款周期</span>
          <span>{{$EnumData.getEnumDesByValue('PayCycle',ContractInfo.PayCycle)}}</span>
        </div>
        <div class="text-item">
          <span>付款模式</span>
          <span>
            <template>{{$EnumData.getEnumDesByValue('StagingModel',ContractInfo.StagingModel)}}</template>
            <template>{{payModelDes}}</template>
            <template v-if="ContractInfo.PayModel==2">{{ContractInfo.NoPayMonth}}个月</template>
          </span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>少付金额</span>
          <span>{{ContractInfo.PayLessMoney||'无'}}</span>
        </div>
        <div class="text-item">
          <span>递增方式</span>
          <span>{{$EnumData.getEnumDesByValue('IncreaseType',ContractInfo.IncreaseType)}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>免租模式</span>
          <span>{{$EnumData.getEnumDesByValue('FreePay',ContractInfo.FreePay)}}</span>
        </div>
        <div class="text-item">
          <span>免租期限</span>
          <span>{{ContractInfo.FreeDays||'无'}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>下期收租日</span>
          <span>{{$dateFormat(OwnerContractOperate.NextPayDate)}}</span>
        </div>
        <div class="text-item">
          <span>最晚付款日</span>
          <span v-show="ContractInfo.PayTimeType==0">提前{{ContractInfo.PayDays}}天支付租金</span>
          <span v-show="ContractInfo.PayTimeType==1">固定{{ContractInfo.PayDays}}号支付租金（每期第一个月）</span>
          <span v-show="ContractInfo.PayTimeType==2">固定{{ContractInfo.PayDays}}号支付租金（每期提前一个月）</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>水表度数</span>
          <span>{{ContractInfo.WaterNumber||'-'}}吨</span>
        </div>
        <div class="text-item">
          <span>电表度数</span>
          <span>{{ContractInfo.ElectricityNumber||'-'}}度</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>天然气</span>
          <span>{{ContractInfo.GasNumber||'-'}}立方米</span>
        </div>
        <div class="text-item">
          <span>水卡号</span>
          <span>{{ContractInfo.WaterCardNumber||'无'}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>气卡号</span>
          <span>{{ContractInfo.GasCardNumber||'无'}}</span>
        </div>
        <div class="text-item">
          <span>电卡号</span>
          <span>{{ContractInfo.ElectricityCardNumber||'无'}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item text-item-lg">
          <span>合同备注</span>
          <span>{{ContractInfo.ContractRemark||'无'}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item text-item-lg">
          <span>房屋设备清单</span>
          <span v-if="ContractEquipments.length>0">
            <template v-for="(item,index) in ContractEquipments">
              <template v-if="index>0">,</template>
              {{item.EquipmentName}}*{{item.EquipmentNumber}}
            </template>
          </span>
          <span v-else>无</span>
        </div>
      </div>
    </div>
    <div class="panel-title">收款信息</div>
    <div class="panel-body">
      <div class="text-box">
        <div class="text-item">
          <span>收款方式</span>
          <span>{{$EnumData.getEnumDesByValue('PaymentMethod',ContractInfo.CollectionType)}}</span>
        </div>
        <div
          class="text-item"
          v-show="ContractInfo.CollectionType==2||ContractInfo.CollectionType==3"
        >
          <span>收款人姓名</span>
          <span>{{ContractInfo.ReceivePeopleName}}</span>
        </div>
        <div class="text-item" v-show="ContractInfo.CollectionType==4">
          <span>转款账户</span>
          <span>{{ContractInfo.ReceiveAccount}}</span>
        </div>
      </div>
      <div class="text-box" v-show="ContractInfo.CollectionType>1">
        <div
          class="text-item"
          v-show="ContractInfo.CollectionType==2||ContractInfo.CollectionType==3"
        >
          <span>收款账号</span>
          <span>{{ContractInfo.ReceiveAccount}}</span>
        </div>
        <template v-if="ContractInfo.CollectionType==4">
          <div class="text-item">
            <span>银行账号</span>
            <span>{{ContractInfo.BankAccount}}</span>
          </div>
          <div class="text-item">
            <span>银行名称</span>
            <span>{{ContractInfo.BankName}}</span>
          </div>
        </template>
      </div>
      <div class="text-box" v-show="ContractInfo.CollectionType==4">
        <div class="text-item">
          <span>开户行</span>
          <span>{{ContractInfo.OpenBankName}}</span>
        </div>
      </div>
    </div>
    <div class="panel-title">审核详情</div>
    <div class="panel-body">
      <div class="text-box">
        <div class="text-item">
          <span>审核状态</span>
          <span>{{$EnumData.getEnumDesByValue('AuditStatus',OwnerContractOperate.AuditStatus)}}</span>
        </div>
        <div class="text-item">
          <span>审核人</span>
          <span>{{OwnerContractOperate.AuditorName}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>审核备注</span>
          <span>{{OwnerContractOperate.AuditRemark||'无'}}</span>
        </div>
        <div class="text-item">
          <span>审核时间</span>
          <span>{{$dateFormat(OwnerContractOperate.AuditTime)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { diffTime } from '../../../../../utils/dateFormat'

  export default {
    props: {
      OwnerInfo: {
        type: Array,
        default() {
          return []
        }
      },
      ContractInfo: {
        type: Object,
        default() {
          return {}
        }
      },
      ContractEquipments: {
        type: Array,
        default() {
          return []
        }
      },
      OwnerContractOperate: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        payModelEnum: [
          { label: '无', value: 0 },
          { label: '首付10%', value: 1 },
          { label: '第一年不付', value: 2 }
        ]
      }
    },
    computed: {
      payModelDes() {
        const model = this.payModelEnum.find(val => val.value === this.ContractInfo.PayModel)
        return model && model.label
      }
    },

    methods: {
      diffTime
    }
  }
</script>
<style scoped lang="scss">
  @import "style";
</style>
