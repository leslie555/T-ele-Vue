<template>
  <div class="bus-detail">
    <settlement ref="settlement" :bus-type="settlementType"></settlement>
    <HouseDecoration ref="houseDecoration"></HouseDecoration>
    <detail-paymentsingle ref="detailpayment"></detail-paymentsingle>
    <detail-receipt-single ref="detailReceipt"></detail-receipt-single>
    <VerificationDetail ref="Verification"></VerificationDetail>
    <meter-reading-detail ref="detailMeterReading"></meter-reading-detail>
    <FixPaperAndPurchaseDialog ref="addConfigBox"></FixPaperAndPurchaseDialog>
    <bills-preview ref="billsPreview" is-detail hide-detail></bills-preview>
    <sublease-template ref="subleaseTemplate"></sublease-template>
  </div>
</template>

<script>
  import DetailPaymentsingle from '../../views/Finance/PaymentBill/components/DetailPaymentsingle'
  import DetailReceiptSingle from '../../views/Finance/ReceiptBill/components/DetailReceiptSingle'
  import VerificationDetail from '../../views/Finance/FinancialVerification/components/FinancialDetail'
  import MeterReadingDetail from '../../views/Service/WaterAndelectricityReading/components/MeterReadingDetail'
  import FixPaperAndPurchaseDialog from '../../views/FixPurchase/PurchaseDepartment/FixPaper/components/FixPaperAndPurchaseDialog'
  import { SubleaseTemplate, BillsPreview } from '../../views/Tenant/ContractList/components'

  import Settlement from '../Settlement'
  import HouseDecoration from '../HouseDecoration'

  export default {
    components: {
      MeterReadingDetail,
      DetailPaymentsingle,
      DetailReceiptSingle,
      VerificationDetail,
      HouseDecoration,
      Settlement,
      FixPaperAndPurchaseDialog,
      SubleaseTemplate,
      BillsPreview
    },
    data() {
      return {
        settlementType: 0
      }
    },
    methods: {
      open({
        type = 0,
        busId = 0,
        auditId = 0
      }) {
        // 不同审批类型实现不同跳转，具体视页面而定
        let url = ''
        let query = {}
        switch (type) {
          case 1: // 业主合同
            url = '/Owner/ContractDetail'
            query = { KeyID: busId }
            break
          case 2: // 房源
            url = '/House/HouseInfo'
            query = { HouseKey: busId }
            break
          case 3: // 租客合同
            url = '/Tenant/ContractDetail'
            query = { KeyID: busId }
            break
          case 4: // 装修
            this.$refs.houseDecoration.open(busId)
            break
          case 5: // 预订单
            url = '/Tenant/OrderList'
            query = { KeyID: busId }
            break
          case 6: // 报修维修
            url = '/Service/RepairList'
            query = { KeyID: busId }
            break
          case 7: // 水电气
            this.$refs.detailMeterReading.open({
              ProfessionID: busId
            })
            break
          case 10: // 记账本
            this.settlementType = 4
            this.$refs.settlement.open({
              BookKeepPara: {
                KeyID: busId
              },
              type: 1,
              detail: true
            })
            break
          case 11: // 收款单
            this.$refs.detailReceipt.open({
              KeyID: busId
            })
            break
          case 12: // 付款单
            this.$refs.detailpayment.open({
              KeyID: busId
            })
            break
          case 13: // 核销单
            this.$refs.Verification.open({
              KeyID: busId
            })
            break
          case 14: // 业主结账
            this.settlementType = 0
            this.$refs.settlement.open({
              BookKeepPara: {
                KeyID: busId
              },
              type: 1,
              detail: true
            })
            break
          case 15: // 租客结账
            this.$refs.billsPreview.open({
              contractID: busId
            })
            break
          case 16: // 转租
            this.$refs.subleaseTemplate.open({
              KeyID: busId
            }, 2)
            break
          case 17: // 维修
            this.$router.push({
              path: '/FixPurchase/RepairBillDetail',
              query: {
                MaintenanceCleaing: 0,
                KeyID: busId
              }
            })
            break
          case 18: // 搬家
            this.$router.push({
              name: 'MoveApplydetail',
              query: {
                KeyID: busId
              }
            })
            break
          case 19: // 装修
            this.$refs.addConfigBox.open({ KeyID: busId }, { title: '装修单', titleID: 1 })
            break
          case 20: // 保洁
            this.$router.push({
              path: '/FixPurchase/CleaningPaperDetail',
              query: {
                KeyID: busId
              }
            })
            break
        }
        if (auditId) {
          query.AuditID = auditId
        }
        if (!url) return
        this.$router.push({
          path: url,
          query
        })
      }
    }
  }
</script>

<style scoped>
</style>
