<template>
  <div>
    <div v-if="!contract" class="emptyText">暂无房东信息</div>
    <div v-else>
      <panel title="基本信息">
        <div class="row">
          <item label="姓名">{{contract.OwnerName}}</item>
          <item label="身份证号">{{contract.OwnerIDCard}}</item>
          <item label="面积">{{houseInfo.houseArea+'m²'}}</item>
        </div>
        <div class="row">
          <item label="户型">
            {{`${houseInfo.RoomCount
            }室${houseInfo.HallCount}厅`}}
          </item>
          <item label="房源地址">{{houseInfo.location}}</item>
        </div>
      </panel>
      <panel title="签约信息">
        <div class="row">
          <item label="合同编号">{{contract.ContractNumber}}</item>
          <item label="合同类型">{{$EnumData.getEnumDesByValue('PaperType', contract.PaperType)}}</item>
          <item label="拿房价">{{contract.InitialPrice||'' + '元'}}</item>
        </div>
        <div class="row">
          <item label="押金">{{contract.HouseDeposit||'' + '元'}}</item>
          <item label="托管周期">
            {{`${dateFormat(contract.HostStartTime)}至${dateFormat(
            contract.HostEndTime
            )} (${diffTime(contract.HostStartTime, contract.HostEndTime)})`}}
          </item>
        </div>
        <div class="row">
          <item label="付款周期">{{$EnumData.getEnumDesByValue('PayCycle', contract.PayCycle)}}</item>
          <item label="付款模式">
            {{`${filteredInfo.StagingModel||''} ${
            filteredInfo.PayModel||''
            } ${filteredInfo.NoPayMonth||''}`}}
          </item>
          <item label="免租期限">{{contract.FreeDays||'' + '个月'}}</item>
        </div>
        <div class="row">
          <item label="少付金额">{{contract.PayLessMoney||'' + '元'}}</item>
          <item label="最晚付款">{{filteredInfo.LastPayTime}}</item>
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
            label="收款方式"
          >{{$EnumData.getEnumDesByValue('CollectionType',contract.CollectionType)}}</item>
          <item
            label="收款姓名"
            v-show="contract.CollectionType==2||contract.CollectionType==3"
          >{{contract.ReceivePeopleName}}</item>
          <item label="转款账户" v-show="contract.CollectionType==4">{{contract.ReceiveAccount}}</item>
          <item
            label="收款账号"
            v-show="contract.CollectionType==2||contract.CollectionType==3"
          >{{contract.ReceiveAccount}}</item>
          <item label="银行账号" v-show="contract.CollectionType==4">{{contract.BankAccount}}</item>
        </div>
        <div v-show="contract.CollectionType==4">
          <item label="银行名称">{{contract.BankName}}</item>
        </div>
        <div class="row">
          <item label="附加条款">{{contract.ContractRemark || '无'}}</item>
        </div>
      </panel>
      <panel title="其他信息">
        <div class="row">
          <item label="水表底数">{{contract.WaterNumber || '无'}}</item>
          <item label="电表底数">{{contract.ElectricityNumber || '无'}}</item>
          <item label="气表底数">{{contract.GasNumber || '无'}}</item>
        </div>
        <div class="row">
          <item label="水卡卡号">{{contract.WaterCardNumber || '无'}}</item>
          <item label="电卡卡号">{{contract.ElectricityCardNumber || '无'}}</item>
          <item label="气卡卡号">{{contract.GasCardNumber || '无'}}</item>
        </div>
        <div class="row">
          <item label="房屋设备" :textStyle="{whiteSpace: 'initial',width: '600px'}">{{equipmentList}}</item>
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
  import { FindOwnerInfo } from '@/api/house'
  import Panel from './Panel'
  import Item from './Item'
  import ImagePreview from './ImagePreview'
  import { dateFormat, diffTime } from '@/utils/dateFormat'
  import cn from 'nzh/cn'
  export default {
    components: {
      Panel,
      Item,
      ImagePreview
    },
    props: {
      houseKey: String,
      houseInfo: Object
    },
    data() {
      return {
        filteredInfo: {},
        ImageUploadList: [],
        contract: {},
        OwnerEquipmentList: [],
        dateFormat,
        diffTime,
        cn
      }
    },
    computed: {
      equipmentList() {
        const equipment = this.OwnerEquipmentList.map(v => {
          if (v.EquipmentNumber > 1) {
            return `${v.EquipmentName}*${v.EquipmentNumber}`
          } else {
            return v.EquipmentName
          }
        })
        return equipment.join('、')
      }
    },
    methods: {
      fetchData() {
        return FindOwnerInfo({
          houseKey: this.houseKey
        }).then(res => {
          this.ImageUploadList = res.Data.ImageUploadList
          this.OwnerEquipmentList = res.Data.OwnerEquipmentList
          this.contract = res.Data.OwnerContract
          this.filterContract(res.Data.OwnerContract)
        })
      },
      filterContract(contract) {
        const filteredInfo = {}
        // 付款模式
        filteredInfo.StagingModel = this.$EnumData.getEnumDesByValue(
          'StagingModel',
          contract.StagingModel
        )
        filteredInfo.NoPayMonth =
          contract.PayModel === 2 ? contract.NoPayMonth + '个月' : ''
        const modelEnum = [
          { label: '无', value: 0 },
          { label: '首付10%', value: 1 },
          { label: '第一年不付', value: 2 }
        ]
        filteredInfo.PayModel = modelEnum.find(
          v => v.value === contract.PayModel
        ).label
        // 最晚付款
        filteredInfo.LastPayTime =
          contract.PayTimeType === 0
            ? '提前' + contract.PayDays + '天支付租金'
            : contract.PayTimeType === 1
              ? '固定' + contract.PayDays + '号支付租金（每期第一个月）'
              : '固定' + contract.PayDays + '号支付租金（每期提前一个月)'
        this.isReady = true
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
