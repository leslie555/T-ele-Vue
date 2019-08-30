<template>
  <div>
    <div v-if="!contract" class="emptyText">暂无租客信息</div>
    <div v-else>
      <panel title="基本信息">
        <div class="row">
          <item label="姓名">{{contract.TenantName}}</item>
          <item label="电话号码">{{contract.TenantPhone}}</item>
          <item label="身份证号">{{contract.TenantCard}}</item>
        </div>
        <div class="row">
          <item label="出房人">{{outRoomLiverList||'无'}}</item>
        </div>
      </panel>
      <panel title="签约信息">
        <div class="row">
          <item label="合同编号">{{contract.ContractNumber}}</item>
          <item label="合同类型">{{$EnumData.getEnumDesByValue('PaperType', contract.PaperType)}}</item>
          <item label="租金">{{contract.HouseRent||'' + '元'}}</item>
        </div>
        <div class="row">
          <item label="押金">{{contract.HouseDeposit||'' + '元'}}</item>
          <item label="租期">
            {{`${dateFormat(contract.StartTime)}至${dateFormat(
            contract.EndTime
            )} (${diffTime(contract.StartTime, contract.EndTime)})`}}
          </item>
        </div>
        <div class="row">
          <item label="付款方式">
            {{`押${cn.encodeS(contract.DepositModel||'')}付${cn.encodeS(
            contract.PayModel||''
            )}`}}
          </item>
        </div>
        <div class="row">
          <item
            :textStyle="{whiteSpace: 'initial',width: '600px'}"
            label="租金包含"
          >{{filteredInfo.RentIncludeCost || '无'}}</item>
        </div>
        <div class="row">
          <item label="递增方式">{{$EnumData.getEnumDesByValue('IncreaseType', contract.IncreaseType)}}</item>
          <item v-if="contract.IncreaseType !== 0" label="递增次数">
            {{`${cn.encodeS(contract.IncreaseFrequency||'')} 次 (第${
            contract.IncreaseNum||''
            }年)、 ${contract.IncreaseMoney||''}/年`}}
          </item>
        </div>
        <div class="row">
          <item
            label="分期方式"
          >{{$EnumData.getEnumDesByValue('TenantStageType', contract.TenantStageType)}}</item>
          <item v-if="contract.TenantStageType !== 0" label="分期起止">
            {{`${dateFormat(
            contract.PayStageStartTime
            )}至${dateFormat(contract.PayStageEndTime)}`}}
          </item>
        </div>
        <div class="row">
          <item label="最晚付款">{{filteredInfo.LastPayTime}}</item>
        </div>
        <div class="row">
          <item label="附加条款">{{contract.TenantContractRemark || '无'}}</item>
        </div>
      </panel>
      <panel title="其他信息">
        <div class="row">
          <item label="水表底数">{{contract.WaterBaseNumber || '无'}}</item>
          <item label="电表底数">{{contract.ElectricityBaseNumber || '无'}}</item>
          <item label="气表底数">{{contract.GasBaseNumber || '无'}}</item>
        </div>
      </panel>
      <panel title="图片">
        <image-preview :imgs="ImageUploadList"></image-preview>
        <span v-if="!ImageUploadList.length">无</span>
      </panel>
    </div>
  </div>
</template>

<script>
  import { FindTenantInfo } from '@/api/house'
  import Panel from './Panel'
  import Item from './Item'
  import { dateFormat, diffTime } from '@/utils/dateFormat'
  import ImagePreview from './ImagePreview'
  import cn from 'nzh/cn'
  export default {
    components: {
      Panel,
      Item,
      ImagePreview
    },
    props: {
      houseID: String
    },
    data() {
      return {
        filteredInfo: {},
        ImageUploadList: [],
        contract: {},
        OutRoominfoList: [],
        dateFormat,
        diffTime,
        cn
      }
    },
    computed: {
      outRoomLiverList() {
        const outRoom = this.OutRoominfoList.map(v => `${v.UserName} (${v.Tel})`)
        return outRoom.join(',')
      }
    },
    methods: {
      fetchData() {
        return FindTenantInfo({
          HouseID: this.houseID
        }).then(res => {
          this.ImageUploadList = res.Data.ImageUploadList
          this.contract = res.Data.TenantContractInfo
          this.OutRoominfoList = res.Data.OutRoominfoList
          this.filterContract(res.Data.TenantContractInfo)
        })
      },
      filterContract(contract) {
        const filteredInfo = {}
        if (!contract) return
        // 最晚付款
        filteredInfo.LastPayTime =
          contract.PayTimeType === 0
            ? '提前' + contract.PayDays + '天支付租金'
            : contract.PayTimeType === 1
              ? '固定' + contract.PayDays + '号支付租金（每期第一个月）'
              : '固定' + contract.PayDays + '号支付租金（每期提前一个月)'
        // 租金包含费用
        filteredInfo.RentIncludeCost = JSON.parse(contract.RentIncludeCost || '[]')
          .map(val => {
            return `${this.$EnumData.getEnumDesByValue('RentIncludeCost', val.KeyID)} (${
              val.Price
              }元)`
          })
          .join(', ')
        this.filteredInfo = filteredInfo
      }
    }
  }
</script>

<style lang="scss" scoped>
  .emptyText {
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: #666;
  }
  .row {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
  }
</style>
