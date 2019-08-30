<template>
  <div class="bus-detail">
    <settlement ref="settlement" :bus-type="settlementType"></settlement>
    <HouseDecoration ref="houseDecoration"></HouseDecoration>
    <detail-paymentsingle ref="detailpayment"></detail-paymentsingle>
    <detail-receipt-single ref="detailReceipt"></detail-receipt-single>
    <VerificationDetail ref="Verification"></VerificationDetail>
    <meter-reading-detail ref="detailMeterReading"></meter-reading-detail>
  </div>
</template>

<script>
  import DetailPaymentsingle from '../../views/Finance/PaymentBill/components/DetailPaymentsingle'
  import DetailReceiptSingle from '../../views/Finance/ReceiptBill/components/DetailReceiptSingle'
  import VerificationDetail from '../../views/Finance/FinancialVerification/components/FinancialDetail'
  import MeterReadingDetail from '../../views/Service/WaterAndelectricityReading/components/MeterReadingDetail'
  import Settlement from '../Settlement'
  import HouseDecoration from '../HouseDecoration'

  export default {
    components: {
      MeterReadingDetail,
      DetailPaymentsingle,
      DetailReceiptSingle,
      VerificationDetail,
      HouseDecoration,
      Settlement
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
            this.settlementType = 1
            this.$refs.settlement.open({
              BookKeepPara: {
                KeyID: busId
              },
              type: 1,
              detail: true
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
