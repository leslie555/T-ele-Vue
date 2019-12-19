<template>
  <div class="app-container contract-detail" v-loading="detailLoading">
    <div class="base-info">
      <div class="base-info-left">
        <div class="user-info">
          <div class="img-box">
            <i class="iconfont icon-morentouxiang"></i>
            <span>{{ContractInfo.OwnerName}}</span>
          </div>
          <div class="user-phone">
            <span>{{ContractInfo.OwnerPhone}}</span>
            <i class="iconfont icon-fuzhi"
               v-clipboard:copy="ContractInfo.OwnerPhone"
               v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
        </div>
        <div class="house-info">
          <p class="info-title">{{HouseInfo.HouseName}}</p>
          <p class="info-text">租金：{{ContractInfo.InitialPrice}}元/月</p>
          <p class="info-text">建筑面积：{{HouseInfo.HouseArea ||'-'}}平方米</p>
          <p class="info-text">地址：{{HouseInfo.Location}}</p>
        </div>
      </div>
      <div class="base-info-right">
        <div class="right-box">
          <p class="info-title">业主信息</p>
          <div class="info-box">
            <p class="info-text">身份证号：{{ContractInfo.OwnerIDCard}}</p>
            <p class="info-text" v-if="ContractInfo.EmergencyContactName">
              紧急联系人：{{ContractInfo.EmergencyContactName}}（{{ContractInfo.EmergencyContactPhone}}）</p>
            <p class="info-text" v-else>紧急联系人：无</p>
          </div>
          <div class="info-box">
            <template v-if="ContractInfo.IsAgent">
              <p class="info-text">代办人：{{ContractInfo.AgentName}}（{{ContractInfo.AgentPhone}}）</p>
              <p class="info-text">代办人身份证：{{ContractInfo.AgentIDCard}}</p>
            </template>
            <template v-else>
              <p class="info-text">代办人：无</p>
              <p class="info-text">代办人身份证：无</p>
            </template>
          </div>
          <div class="info-box">
            <p class="info-text info-full">通讯地址：{{ContractInfo.ContractAddress||'无'}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="panel tabs-btn-box">
      <el-tabs v-model="activeName" class="tabs-normal">
        <el-tab-pane label="签约信息" name="0">
          <sign-info :owner-info="OwnerInfo" :contract-info="ContractInfo" :contract-equipments="ContractEquipments"
                     :owner-contract-operate="OwnerContractOperate"></sign-info>
        </el-tab-pane>
        <el-tab-pane label="财务信息" name="1" class="bill-info">
          <bill-info :bill-list="BillList" :book-keep="BookKeep" :contract-info="ContractInfo"
                     :house-info="HouseInfo" :type="0"></bill-info>
        </el-tab-pane>
        <el-tab-pane label="合同信息" name="2">
          <contract-info :contract-info="ContractInfo" :image-upload="ImageUpload" :contract-operate="OwnerContractOperate" :type="0"></contract-info>
        </el-tab-pane>
      </el-tabs>
      <div class="tabs-btn">
        <template v-if="$route.query.AuditID">
          <el-button type="primary" @click="handleReview" v-show="OwnerContractOperate.AuditStatus==1">审核</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="handleHouseDetail" v-show="HouseInfo.HouseStatus>2">房源详情</el-button>
          <el-button type="primary" @click="handleRenew"
                     v-show="OwnerContractOperate.LeaseStatus==3&&OwnerContractOperate.AuditStatus==2">续约
          </el-button>
          <!--<el-button type="primary" @click="handleCheckOut"-->
                     <!--v-show="OwnerContractOperate.LeaseStatus==3&&OwnerContractOperate.AuditStatus==2">退房-->
          <!--</el-button>-->
        </template>
      </div>
    </div>
    <settlement ref="settlement" :bus-type="0" @success="checkOutSuccess"></settlement>
    <excute-audit ref="review" @updateAudit="reviewSuccess"></excute-audit>
  </div>
</template>

<script>
  import { BillInfo, ContractInfo, SignInfo } from './components'
  import { getContractDetail } from '../../../api/owner'
  import { ExcuteAudit, Settlement } from '../../../components'

  export default {
    name: 'OwnerContractDetail',
    components: {
      SignInfo,
      BillInfo,
      ContractInfo,
      Settlement,
      ExcuteAudit
    },
    data() {
      return {
        activeName: this.$route.query.Index || '0',
        detailLoading: false,
        ContractInfo: {}, // 合同信息
        HouseInfo: {}, // 房源信息
        CommunityInfo: {}, // 小区信息
        ContractEquipments: [], // 房屋设备信息
        BillList: [], // 账单信息,
        BookKeep: [], // 其他记账
        OwnerContractOperate: {}, // 合同操作信息
        ImageUpload: [],
        OwnerInfo: [] // 业主信息
      }
    },
    activated() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.detailLoading = true
        getContractDetail({
          ownerID: this.$route.query.KeyID || 0,
          type: 0
        }).then(({ Data }) => {
          this.detailLoading = false
          this.initPageData(Data)
        }).catch(() => {
          this.detailLoading = false
        })
      },
      initPageData({ OwnerContract, HouseInfo, CommunityInfo, ImageUpload, OwnerEquipments, OwnerContractOperate, OwnerBill, BookKeep, OwnerInfos }) {
        this.HouseInfo = HouseInfo || {}
        this.CommunityInfo = CommunityInfo || {}
        this.ImageUpload = ImageUpload || []
        this.ContractEquipments = OwnerEquipments || []
        this.OwnerContractOperate = OwnerContractOperate || {}
        this.ContractInfo = OwnerContract || {}
        if (OwnerBill) {
          this.BillList = OwnerBill
        }
        if (BookKeep) {
          this.BookKeep = BookKeep
        }
        if (!OwnerInfos || OwnerInfos && OwnerInfos.length === 0) {
          //
        } else {
          OwnerInfos.shift()
          this.OwnerInfo = OwnerInfos
        }
      },
      onCopy() {
        this.$message.success('复制成功')
      },
      onError() {
        this.$message.error('复制失败，请手动复制！')
      },
      handleHouseDetail() {
        this.$router.push({
          path: '/House/HouseInfo',
          query: {
            HouseKey: this.HouseInfo.HouseKey
          }
        })
      },
      handleCheckOut() {
        this.$refs['settlement'].open({
          BookKeepPara: {
            ContractID: this.ContractInfo.KeyID,
            HouseID: this.HouseInfo.KeyID,
            HouseKey: this.HouseInfo.HouseKey,
            HouseName: this.HouseInfo.HouseName
          }
        })
      },
      handleRenew(row) {
        this.$router.push({
          path: '/Owner/AddContract',
          query: {
            KeyID: this.ContractInfo.KeyID,
            Renew: true
          }
        })
      },
      handleReview() {
        // 审核
        this.$refs.review.open([this.$route.query.AuditID])
      },
      checkOutSuccess({ BookKeepList }) {
        // 修改合同状态为已退房
        this.OwnerContractOperate.LeaseStatus = 4
      },
      reviewSuccess(data) {
        const result = data[0]
        this.OwnerContractOperate.AuditStatus = result.AuditStatus
        this.OwnerContractOperate.AuditRemark = result.AuditRemark
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "style";
</style>
