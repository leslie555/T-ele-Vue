<template>
  <div class="contract-template-outer">
    <div class="print-div" @click="print">
      <a title="打印合同">
        <i class="iconfont icon-print icon-print-contract"></i>
      </a>
    </div>
    <div id="ContractTemplate">
      <owner-contract v-if="IsOwnerContract&&Ready" :ContractContent="ContractContent"></owner-contract>
      <tenant-contract v-if="!IsOwnerContract&&Ready" :ContractContent="ContractContent"></tenant-contract>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-undef */

  import { findOwnerPreviewById } from '@/api/owner'
  import { findTenantPreviewById } from '@/api/tenant'
  import OwnerContract from './components/NewOwnerContract'
  import TenantContract from './components/NewTenantContract'
  import { priceFormat, ToCapChinese } from '../../utils/priceFormat'
  import { diffTime } from '../../utils/dateFormat'
  import { getCityNameByCode } from '../../utils/CityData'
  import { mapGetters } from 'vuex'
  import nzhcn from 'nzh/cn'

  export default {
    name: 'ContractTemplate',
    components: {
      OwnerContract,
      TenantContract
    },

    props: [
      'id'
    ],

    data() {
      return {
        nzhcn,
        IsOwnerContract: false,
        Ready: false,
        ContractContent: {},
        TenantTotalAmount: 0.00
      }
    },
    computed: {
      ...mapGetters([
        'contract'
      ])
    },
    created() {
      this.fillData()
    },

    methods: {
      fillData() {
        const ownerList = ['OwnerContractSign', 'OwnerContractDetail', 'OwnerContractPreview']
        if (ownerList.some(v => v === this.$route.name)) {
          this.IsOwnerContract = true
          if (this.id) {
            this.getOwnerContract()
          } else {
            this.filterOwnerContract(this.contract.owner.preview)
          }
        } else {
          if (this.id) {
            this.getTenantContract()
          } else {
            this.filterTenantContract(this.contract.tenant.preview)
          }
        }
      },

      getOwnerContract() {
        return findOwnerPreviewById({
          ownerID: this.id
        }).then(({ Data }) => {
          this.filterOwnerContract(Data)
        })
      },

      filterOwnerContract(item) {
        const [Year, Month, Day] = diffTime(item.HostStartTime, item.HostEndTime, 1)
        const [StartYear, StartMonth, StartDay] = this.getYearMonthDay(item.HostStartTime)
        const [EndYear, EndMonth, EndDay] = this.getYearMonthDay(item.HostEndTime)
        const [OwnerSignYear, OwnerSignMonth, OwnerSignDay] = this.getYearMonthDay(item.OwnerSignTime)
        const [ContractYear, ContractMonth, ContractDay] = this.getYearMonthDay(item.ContractTime)
        const IDType = this.$EnumData.getEnumDesByValue('IDType', item.IDType)
        const OwnerBill = this.filterOwnerBill(item)
        let nameArr = []
        let identifiArr = []
        let telArr = []
        if (item.OwnerInfo && item.OwnerInfo.length > 0) {
          item.OwnerInfo.forEach(item => {
            if (item.OwnerName) {
              nameArr.push(item.OwnerName)
            }
            if (item.OwnerIDCard) {
              identifiArr.push(item.OwnerIDCard)
            }
            if (item.OwnerPhone) {
              telArr.push(item.OwnerPhone)
            }
          })
        } else {
          nameArr = item.OwnerName ? [item.OwnerName] : []
          identifiArr = item.OwnerIDCard ? [item.OwnerIDCard] : []
          telArr = item.OwnerPhone ? [item.OwnerPhone] : []
        }
        const City = getCityNameByCode(item.CityCode, 1)

        this.ContractContent = {
          City: City ? (City[1] === '市辖区' ? City[0] : City[1]) : '',
          PaperType: item.PaperType || 0,
          OwnerName: nameArr.join(','),
          IDType,
          CompanyName: item.CompanyName || '',
          UndertakerName: item.UndertakerName || '',
          UndertakerPhone: item.UndertakerPhone || '',
          DepartmentName: item.DepartmentName || '',
          CityName: item.CityName || '', // 房屋所在区域名称
          OwnerIDCard: identifiArr.join(','),
          ContractAddress: item.ContractAddress || '',
          OwnerPhone: telArr.join(','),
          Location: item.Location || '',
          HouseArea: item.HouseArea || '', // 房屋建设面积
          PayCycle: item.PayCycle || '', // 支付周期
          DHouseKeepingTime: item.DHouseKeepingTime || 0, // 交付天数限制
          UndertakerNameUrl: item.UndertakerNameUrl || '',
          ServiceCall: item.ServiceCall || '',
          EquipmentPreview: item.EquipmentPreview || [], // 房屋设备
          WaterandelectricityPreview: item.WaterandelectricityPreview || [], // 房屋水电气数据
          OtherPreview: item.OtherPreview || [], // 其他费用
          Year,
          Month,
          Day,
          StartYear,
          StartMonth,
          StartDay,
          EndYear,
          EndMonth,
          EndDay,
          InitialPrice: item.InitialPrice || 0,
          InitialPriceChinese: ToCapChinese(item.InitialPrice),
          Total: item.Total || 0,
          TotalChinese: ToCapChinese(item.Total),
          CollectionType: item.CollectionType || 0,
          BankName: item.BankName || '',
          OpenBankName: item.OpenBankName || '',
          BankAccount: item.BankAccount || '',
          ReceiveAccount: item.ReceiveAccount,
          ReceivePeopleName: item.ReceivePeopleName,
          FreeDays: item.FreeDays || 0,
          OwnerBill,
          // 补充条款
          SignInfo: item.SignInfo || '',
          BusinessSeal: item.BusinessSeal || '',
          PersonInChargeName: item.PersonInChargeName || '',
          PersonInChargeTel: item.PersonInChargeTel || '',
          CompanyTEL: item.CompanyTEL || '',
          Store: item.Store || '',
          BusinessTel: item.BusinessTel || '',
          SealPicURL: item.SealPicURL || '',
          // Tubehouseemp: item.Tubehouseemp.length > 0 ? item.Tubehouseemp.join(',') : '',
          OwnerSignYear,
          OwnerSignMonth,
          OwnerSignDay,
          ContractYear,
          ContractMonth,
          ContractDay,
          ContractRemark: item.ContractRemark || ''
        }
        this.Ready = true
      },

      filterOwnerBill(item) {
        item.OwnerBill = item.OwnerBill || []
        const length = item.OwnerBill.length
        let result = []
        if (length > 0) {
          result = item.OwnerBill.map((item, index) => {
            const [StartYear, StartMonth, StartDay] = this.getYearMonthDay(item.BillStartDate)
            const [EndYear, EndMonth, EndDay] = this.getYearMonthDay(item.ReceivablesDate)
            return {
              Num: index + 1,
              NumChinese: nzhcn.encodeS(index + 1),
              StartYear,
              StartMonth,
              StartDay,
              EndYear,
              EndMonth,
              EndDay,
              PayMoney: priceFormat(item.BillAmount)
            }
          })
        }
        return result
      },

      getYearMonthDay(dateStr) {
        let result = []
        if (!dateStr) {
          return result
        }
        const patt = new RegExp('\\d{4}-\\d{2}(-\\d{2})?')
        const ymdStr = patt.exec(dateStr)
        if (ymdStr[0] === '0001-01-01') {
          return result
        }
        if (ymdStr !== null) {
          const date = new Date(ymdStr[0])
          const StartYear = date.getFullYear()
          const StartMonth = date.getMonth() + 1
          const StartDay = date.getDate()
          result = [StartYear, StartMonth, StartDay]
        }
        return result
      },

      getTenantContract() {
        return findTenantPreviewById({
          tenantID: this.id
        }).then(({ Data }) => {
          this.filterTenantContract(Data)
        })
      },

      filterTenantContract(item) {
        const [Year, Month, Day] = diffTime(item.StartTime, item.EndTime, 1)
        const [StartYear, StartMonth, StartDay] = this.getYearMonthDay(item.StartTime)
        const [EndYear, EndMonth, EndDay] = this.getYearMonthDay(item.EndTime)
        const [SignYear, SignMonth, SignDay] = this.getYearMonthDay(item.SignTime)
        const TenantBill = this.filterTenantBill(item)
        const TenantBillPlan = this.filterTenantBillPlan(item)
        const BookKeep = this.filterTenantBookKeep(item)
        const RentIncludeCost = this.filterRentIncludeCost(item, 0)
        const BillRentIncludeCost = this.filterRentIncludeCost(item, 1)
        const HouseEquipment = this.filterTenantHouseEquipment(item)
        const EquipmentList = this.filterTenantEquipmentList(item)

        this.ContractContent = {
          Year,
          Month,
          Day,
          HouseOwnershipName: item.HouseOwnershipName || '',
          HouseOwnershipIDCard: item.HouseOwnershipIDCard || '',
          UndertakerName: item.UndertakerName || '',
          UndertakerPhone: item.UndertakerPhone || '',
          PaperType: item.PaperType || 0,
          PrincipalUserName: item.PrincipalUserName || '',
          TenantName: item.TenantName || '',
          Location: item.Location || '',
          Pledge: item.Pledge || 0,
          PledgeStr: ToCapChinese(item.Pledge) || '',
          StartYear,
          StartMonth,
          StartDay,
          EndYear,
          EndMonth,
          EndDay,
          PayTimeType: item.PayTimeType || 0,
          PayDays: item.PayDays || 0,
          LivepeopleNumber: item.LivepeopleNumber || 0,
          MaxLivepeopleNumber: item.MaxLivepeopleNumber || 0,
          HouseRent: item.HouseRent || 0,
          HouseRentChinese: ToCapChinese(item.HouseRent),
          Sum: item.Sum || 0,
          SumChinese: ToCapChinese(item.Sum),
          PayCycle: this.$EnumData.getEnumDesByValue('PayCycle', item.PayCycle),
          DepositModel: item.DepositModel || '',
          PayModel: item.PayModel || '',
          TenantBillPlan,
          TenantTotalAmount: this.TenantTotalAmount,
          BookKeep,
          TenantBill,
          BillRentIncludeCost,
          RentIncludeCostPrice: item.RentIncludeCostPrice || 0,
          RentIncludeCost,
          ComplaintCall: item.ComplaintCall || '',
          SealPic: item.SealPic || '',
          SealPicURL: item.SealPicURL || '',
          CompanyName: item.CompanyName || '',
          SignInfo: item.SignInfo || '',
          TenantCard: item.TenantCard || '',
          TenantOutRoom: item.TenantOutRoom && item.TenantOutRoom.length > 0 ? item.TenantOutRoom.join(',') : '',
          PersonInChargeName: item.PersonInChargeName || '',
          PersonInChargeTel: item.PersonInChargeTel || '',
          TenantPhone: item.TenantPhone || '',
          Store: item.Store || '',
          SignYear,
          SignMonth,
          SignDay,
          AddressSite: item.AddressSite || '',
          HouseEquipment,
          HouseOwnershipUrl: item.HouseOwnershipUrl || '',
          CompanyNameUrl: item.CompanyNameUrl || '',
          TenantNameUrl: item.TenantNameUrl || '',
          ProxyName: item.ProxyName || '',
          DecName: item.DecName || '',
          EquipmentList,
          ContractRemark: item.ContractRemark || ''
        }
        this.Ready = true
      },
      // 租客家具清单
      filterTenantEquipmentList(item) {
          const result = []
          const equipmentList = item.TenantConTractQuipment
          if (equipmentList && equipmentList.length > 0) {
            equipmentList.forEach(item => {
              const str = item.QuipmentName + '(' + item.Number + ')'
              result.push(str)
            })
          }
          return result.join('、')
      },
      // 房源设备清单
      filterTenantHouseEquipment(item) {
        const equipArr = []
        if (item.HouseEquipment && item.HouseEquipment.length > 0) {
          item.HouseEquipment.forEach(v => {
            const regionName = v.RoomName
            const equipmentInfo = []
            v.Equipment.forEach(m => {
              equipmentInfo.push(m.EquipmentName)
            })
            const equipObj = {
              regionName,
              equipmentInfo: equipmentInfo.join('、')
            }
            equipArr.push(equipObj)
          })
        }
        return equipArr
      },
      // 其他记账
      filterTenantBookKeep(item) {
        let bookKeepList = []
        if (item.BookKeep) {
          bookKeepList = item.BookKeep.map(item2 => {
            return {
              BillProjectName: item2.BillProjectName,
              InOrOut: this.$EnumData.getEnumDesByValue('InOrOut', item2.InOrOut),
              Amount: priceFormat(item2.Amount),
              ReceivablesDate: this.$dateFormat(item2.ReceivablesDate, 'yyyy-MM-dd'),
              Remark: item2.Remark
            }
          })
        }
        return bookKeepList
      },
      // 账单计划
      filterTenantBillPlan(item) {
        const billPlanList = []
        if (item.TenantBill) {
          this.TenantTotalAmount = parseFloat(0)
          item.TenantBill.forEach((m, i) => {
            const BillPlan = {
              Title: '账期' + nzhcn.encodeS(i + 1) + ':' + this.$dateFormat(m.BillStartDate, 'yyyy-MM-dd') + '至' + this.$dateFormat(m.BillEndDate, 'yyyy-MM-dd'),
              Total: priceFormat(m.BillAmount),
              PayDate: this.$dateFormat(m.ReceivablesDate, 'yyyy-MM-dd')
            }
            this.TenantTotalAmount += parseFloat(m.BillAmount)
            const billList = m.TenantBillDetail.map(item2 => {
              return {
                BillProjectName: item2.BillProjectName,
                Amount: priceFormat(item2.Amount),
                InOrOut: this.$EnumData.getEnumDesByValue('InOrOut', item2.InOrOut)
              }
            })
            BillPlan.BillList = billList
            billPlanList.push(BillPlan)
          })
          this.TenantTotalAmount = priceFormat(this.TenantTotalAmount)
        }
        return billPlanList
      },
      // 具体付款时间
      filterTenantBill(item) {
        item.TenantBill = item.TenantBill || []
        const length = item.TenantBill.length
        let result = []
        if (length > 0) {
          result = item.TenantBill.map((item, index) => {
            const [Year, Month, Day] = this.getYearMonthDay(item.ReceivablesDate)
            return {
              NumChinese: nzhcn.encodeS(index + 1),
              Year,
              Month,
              Day,
              PayMoney: priceFormat(item.BillAmount)
            }
          })
          // if (isLeft) {
          //   result.length = Math.round(length / 2)
          // } else {
          //   result.splice(0, Math.round(length / 2))
          // }
          result.shift()
        }
        return result
      },
      // 代缴费用明细
      filterRentIncludeCost(item, type) {
        const rentIncludeCost = []
        if (item.RentIncludeCost) {
          if (type === 0) {
            item.RentIncludeCost.forEach(r => {
              if (r.Price > 0) {
                const Name = this.$EnumData.getEnumDesByValue('RentIncludeCost', r.KeyID)
                rentIncludeCost.push(Name)
              }
            })
            return rentIncludeCost.length > 0 ? rentIncludeCost.join('、') : rentIncludeCost
          } else {
            item.RentIncludeCost.forEach(r => {
              if (r.Price > 0) {
                const billObj = {
                  name: this.$EnumData.getEnumDesByValue('RentIncludeCost', r.KeyID),
                  amount: r.Price
                }
                rentIncludeCost.push(billObj)
              }
            })
            return rentIncludeCost
          }
        }
      },
      print() {
        const item_mark = this.$el.querySelector('.contract-list-item-mark')
        item_mark && (item_mark.style.marginTop = '80px')
        printJS({
          printable: 'ContractTemplate', // 要打印区域的元素ID
          type: 'html',
          documentTitle: this.IsOwnerContract ? '房屋租赁运营管理委托协议' : '房屋租赁合同',
          // 继承原来的所有样式
          targetStyles: ['*'],
          onLoadingStart: () => {
            console.log(3)
          },
          onLoadingEnd: () => {
            console.log(4)
          },
          onPrintDialogClose: () => {
            item_mark && (item_mark.style.marginTop = '40px')
            console.log(5)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
