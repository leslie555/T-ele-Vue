<template>
  <div class="app-container contract-detail" v-loading="detailLoading">
    <div class="base-info">
      <div class="base-info-left">
        <div class="user-info">
          <div class="img-box">
            <i class="iconfont icon-morentouxiang"></i>
            <span>{{ContractInfo.TenantName}}</span>
          </div>
          <div class="user-phone">
            <span>{{ContractInfo.TenantPhone}}</span>
            <i class="iconfont icon-fuzhi"
               v-clipboard:copy="ContractInfo.TenantPhone"
               v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
        </div>
        <div class="house-info">
          <p class="info-title">{{HouseInfo.HouseName}}</p>
          <p class="info-text">
            <span>租金：{{ContractInfo.HouseRent}}元/月</span>
            <span v-show="ContractInfo.ProxyPhone">管家：{{ContractInfo.ProxyName}}（{{ContractInfo.ProxyPhone}}）</span>
          </p>
          <p class="info-text">建筑面积：{{HouseInfo.HouseArea||'-'}}平方米</p>
          <p class="info-text">地址：{{HouseInfo.Location}}</p>
        </div>
      </div>
      <div class="base-info-right">
        <div class="right-box">
          <p class="info-title">租客信息</p>
          <div class="info-box">
            <p class="info-text">身份证号：{{ContractInfo.TenantCard}}</p>
            <p class="info-text">性别：{{$EnumData.getEnumDesByValue('Sex',ContractInfo.TenantSex)}}</p>
          </div>
          <div class="info-box">
            <template v-if="ContractInfo.IsAgent">
              <p class="info-text">代办人：{{ContractInfo.AgentName}}（{{ContractInfo.AgentPhone}}）</p>
              <p class="info-text">代办人身份证：{{ContractInfo.AgentCard}}</p>
            </template>
            <template v-else>
              <p class="info-text">代办人：无</p>
              <p class="info-text">代办人身份证：无</p>
            </template>
          </div>
          <div class="info-box">
            <p class="info-text" v-if="ContractInfo.EmergencyContactName">
              紧急联系人：{{ContractInfo.EmergencyContactName}}（{{ContractInfo.EmergencyContactPhone}}）</p>
            <p class="info-text" v-else>紧急联系人：无</p>
            <!--<p class="info-text info-full">通讯地址：{{ContractInfo.ContractAddress||'无'}}</p>-->
            <p class="info-text">电子邮箱：{{ContractInfo.Email || '无'}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="panel tabs-btn-box">
      <el-tabs v-model="activeName" class="tabs-normal">
        <el-tab-pane label="签约信息" name="0">
          <sign-info :contract-info="ContractInfo"
                     :tenant-contract-operate="TenantContractOperate"
                     :live-people-info-list="LivePeopleInfoList"
          ></sign-info>
        </el-tab-pane>
        <el-tab-pane label="财务信息" name="1" class="bill-info">
          <bill-info :bill-list="BillList" :book-keep="BookKeep" :contract-info="ContractInfo"
                     :house-info="HouseInfo" :type="1"></bill-info>
        </el-tab-pane>
        <el-tab-pane label="合同信息" name="2">
          <contract-info :contract-info="ContractInfo" :image-upload="ImageUpload" :type="1"
                         :contract-operate="TenantContractOperate"></contract-info>
        </el-tab-pane>
      </el-tabs>
      <div class="tabs-btn">
        <template v-if="$route.query.AuditID">
          <el-button type="primary" @click="handleReview" v-show="TenantContractOperate.AuditStatus==1">审核</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="handleHouseDetail" v-show="HouseInfo.HouseStatus>2">房源详情</el-button>
          <el-button type="primary" @click="handleRenew"
                     v-show="TenantContractOperate.RentLeaseStatus==3&&TenantContractOperate.AuditStatus==2">续约
          </el-button>
        </template>
      </div>
    </div>
    <settlement ref="settlement" :bus-type="1" @success="checkOutSuccess"></settlement>
    <excute-audit ref="review" @updateAudit="reviewSuccess"></excute-audit>
  </div>
</template>

<script>
  import { BillInfo, ContractInfo } from '../../Owner/ContractDetail/components'
  import { SignInfo } from './components'
  import { getContractDetail } from '../../../api/tenant'
  import { ExcuteAudit, Settlement } from '../../../components'

  export default {
    name: 'TenantContractDetail',
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
        BillList: [], // 账单信息,
        BookKeep: [],
        TenantContractOperate: {}, // 合同操作信息
        LivePeopleInfoList: [], // 入住人列表
        ImageUpload: []
      }
    },
    activated() {
      this.fetchData()
    },
    methods: {
      fetchData: function() {
        this.detailLoading = true
        getContractDetail({
          tenantID: this.$route.query.KeyID || 0,
          type: 0
        }).then(({ Data }) => {
          this.detailLoading = false
          this.initPageData(Data)
        }).catch(() => {
          this.detailLoading = false
        })
      },
      initPageData({ TenantContractInfo, HouseInfo, ImageUpload, TenantContractOperate, LivePeopleInfoList, TenantBill, BookKeep, Decoration, TenDecoration, TenantConTractQuipment }) {
        if (HouseInfo) {
          this.HouseInfo = HouseInfo
        }
        this.LivePeopleInfoList = LivePeopleInfoList || []
        this.TenantContractOperate = TenantContractOperate || {}
        this.ContractInfo = TenantContractInfo || {}
        this.ImageUpload = [...(this.ContractInfo.CardIDFront || []), ...(this.ContractInfo.CardIDBack || []), ...(ImageUpload || [])]
        if (TenantBill) {
          this.BillList = TenantBill
        }
        if (BookKeep) {
          this.BookKeep = BookKeep
        }
        if (TenantConTractQuipment) {
          let str = ''
          TenantConTractQuipment.forEach((x, i) => {
            str += `${x.QuipmentName}*${x.Number}${i < TenantConTractQuipment.length - 1 ? `、` : ''}`
          })
          this.ContractInfo.TenantEquipmentStr = str
        }
        if (TenDecoration && Decoration) {
          const list = []
          let str = ''
          Decoration.forEach(x => {
            if (x.PDecoration && x.PDecoration.length > 0) {
              let cStr = ''
              x.PDecoration.forEach((y, yi) => {
                if (TenDecoration.find(z => z.DecorationID === y.KeyID)) {
                  if (!list[x.KeyID]) {
                    list[x.KeyID] = true
                    cStr += `${x.Name}(${y.Name}、`
                  } else {
                    cStr += `${y.Name}、`
                  }
                }
                if (yi === x.PDecoration.length - 1 && cStr.length > 0) {
                  cStr = cStr.slice(0, -1) + ')、'
                }
              })
              str += cStr
            }
          })
          if (str.length > 0) {
            str = str.slice(0, -1)
          }
          this.ContractInfo.TenDecorationStr = str
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
          path: '/Tenant/AddContract',
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
        this.TenantContractOperate.RentLeaseStatus = 4
      },
      reviewSuccess(data) {
        const result = data[0]
        this.TenantContractOperate.AuditStatus = result.AuditStatus
        this.TenantContractOperate.AuditRemark = result.AuditRemark
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../Owner/ContractDetail/style";
</style>
