<template>
  <div class="sign-info">
    <div class="sign-info"></div>
    <div class="panel-title">签约信息</div>
    <div class="panel-body">
      <div class="text-box text-blue">
        <div class="text-item">
          <span>租期起始日期</span>
          <span>{{$dateFormat(ContractInfo.StartTime)}}至{{$dateFormat(ContractInfo.EndTime)}}</span>
        </div>
        <div class="text-item">
          <span>租期</span>
          <span>{{diffTime(ContractInfo.StartTime,ContractInfo.EndTime)}}</span>
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
          <span>付款方式</span>
          <span>押{{ContractInfo.DepositModel}}付{{ContractInfo.PayModel}}</span>
        </div>
        <div class="text-item">
          <span>签约时间</span>
          <span>{{$dateFormat(TenantContractOperate.SignTime)}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>房屋租金</span>
          <span>{{ContractInfo.HouseRent}}元/月</span>
        </div>
        <div class="text-item">
          <span>房屋押金</span>
          <span>{{ContractInfo.HouseDeposit}}元</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>管理服务费</span>
          <span>{{ContractInfo.ManagerFee}}元/月</span>
        </div>
        <div class="text-item">
          <span>优惠政策</span>
          <span>{{ContractInfo.DiscountPolicy}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>下期收租日</span>
          <span>{{$dateFormat(TenantContractOperate.NextPayTime)}}</span>
        </div>
        <div class="text-item">
          <span>最晚收租日</span>
          <span v-show="ContractInfo.PayTimeType==0">提前{{ContractInfo.PayDays}}天支付租金</span>
          <span v-show="ContractInfo.PayTimeType==1">固定{{ContractInfo.PayDays}}号支付租金（每期第一个月）</span>
          <span v-show="ContractInfo.PayTimeType==2">固定{{ContractInfo.PayDays}}号支付租金（每期提前一个月）</span>
        </div>
      </div>
      <div class="text-box">
        <!--<div class="text-item">-->
          <!--<span>租金包含费用</span>-->
          <!--<span>{{filterCost(ContractInfo.RentIncludeCost)}}</span>-->
        <!--</div>-->
        <div class="text-item">
          <span>水底数</span>
          <span>{{ContractInfo.WaterBaseNumber||'-'}}吨</span>
        </div>
        <div class="text-item">
          <span>电底数</span>
          <span>{{ContractInfo.ElectricityBaseNumber||'-'}}度</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item text-item-lg">
          <span>气底数</span>
          <span>{{ContractInfo.GasBaseNumber||'-'}}立方米</span>
        </div>
      </div>
      <div class="text-box" v-show="ContractInfo.IsPayStage">
        <div class="text-item">
          <span>分期类型</span>
          <span>{{$EnumData.getEnumDesByValue('TenantStageType',ContractInfo.TenantStageType)}}</span>
        </div>
        <div class="text-item">
          <span>分期起止</span>
          <span>{{$dateFormat(ContractInfo.PayStageStartTime)}}至{{$dateFormat(ContractInfo.PayStageEndTime)}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item text-item-lg">
          <span>租约状态</span>
          <span>{{$EnumData.getEnumDesByValue('RentLeaseStatus',TenantContractOperate.RentLeaseStatus)}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item text-item-lg">
          <span>装修情况</span>
          <span>{{ContractInfo.TenDecorationStr || '无'}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item text-item-lg">
          <span>家具清单</span>
          <span>{{ContractInfo.TenantEquipmentStr || '无'}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item text-item-lg">
          <span>附加条款</span>
          <span>{{ContractInfo.TenantContractRemark || '无'}}</span>
        </div>
      </div>
    </div>
    <div class="panel-title">入住人信息</div>
    <div class="panel-body">
      <div class="text-box">
        <el-table :data="LivePeopleInfoList"
                  border
                  fit
                  class="table-normal">
          <el-table-column align="center" label='入住人' min-width="140"
                           prop="LiverName"></el-table-column>
          <el-table-column align="center" label='性别' min-width="140">
            <template slot-scope="scope">
              {{$EnumData.getEnumDesByValue('Sex',scope.row.LiverSex)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label='手机' min-width="140"
                           prop="LiverPhone"></el-table-column>
          <el-table-column align="center" label='证件类型' min-width="140">
            <template slot-scope="scope">
              {{$EnumData.getEnumDesByValue('CardType',scope.row.CardType)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label='证件号' min-width="140" prop="CardID"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="panel-title">审核详情</div>
    <div class="panel-body">
      <div class="text-box">
        <div class="text-item">
          <span>审核状态</span>
          <span>{{$EnumData.getEnumDesByValue('AuditStatus',TenantContractOperate.AuditStatus)}}</span>
        </div>
        <div class="text-item">
          <span>审核人</span>
          <span>{{TenantContractOperate.AuditorName}}</span>
        </div>
      </div>
      <div class="text-box">
        <div class="text-item">
          <span>审核备注</span>
          <span>{{TenantContractOperate.AuditRemark||'无'}}</span>
        </div>
        <div class="text-item">
          <span>审核时间</span>
          <span>{{$dateFormat(TenantContractOperate.AuditTime)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { diffTime } from '../../../../../utils/dateFormat'

  export default {
    props: {
      ContractInfo: {
        type: Object,
        default() {
          return {}
        }
      },
      LivePeopleInfoList: {
        type: Array,
        default() {
          return []
        }
      },
      TenantContractOperate: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {}
    },
    computed: {
      RentIncludeCostList() {
        return this.$EnumData.getEnumListByKey('RentIncludeCost')
      }
    },
    methods: {
      diffTime,
      filterCost(str) {
        if (!str) return ''
        const result = []
        let RentIncludeCostList = []
        try {
          RentIncludeCostList = JSON.parse(str)
        } catch (e) {
          //
        }
        RentIncludeCostList.map(v => {
          const item = this.RentIncludeCostList.find(x => +x.Value === +v.KeyID)
          result.push(item.Description + ':' + v.Price + '元/月')
        })
        return result.join('，') || '无'
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "style";
</style>
