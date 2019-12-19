<template>
  <transition-group name="HouseFade">
    <div class="shadowPaper" @click="closeDialog" key="0" v-show="isShow"></div>
    <div
      class="HouseDialogContent"
      key="2"
      v-show="isShow"
      style="box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);"
    >
      <el-row class="DialogTitleBox">
        <el-col
          :span="16"
          class="DialogHouseTitleRight"
          :title="`${ dialogFormData.CommunityName }${ dialogFormData.Building }栋${ dialogFormData.UnitNumber }单元${ dialogFormData.RoomNumber }${ !dialogFormData.RoomName ? '' : '-'}${ !dialogFormData.RoomName ? '' : dialogFormData.RoomName}`"
        >{{ dialogFormData.CommunityName + '-'}}{{ dialogFormData.Building }}栋{{ dialogFormData.UnitNumber }}单元{{
          dialogFormData.RoomNumber }}{{ !dialogFormData.RoomName ? '' : '-'}}{{ !dialogFormData.RoomName ? '' :
          dialogFormData.RoomName}}
        </el-col>
        <el-col :span="8" class="rowRight">操作</el-col>
      </el-row>
      <el-row class="DialogContentBox">
        <el-form size="mini" :model="dialogFormData">
          <!-- 房源信息 -->
          <el-row class="DialogContent">
            <el-col :span="16" class="dialogCol">
              <el-form-item class="ContentTitle">
                <span>房源信息</span>
              </el-form-item>
              <el-form-item v-if="!dialogFormData.KeyID">
                <span>无</span>
              </el-form-item>
              <el-row v-else>
                <el-form-item label="房源编号:">
                  <span>NO.{{ dialogFormData.HouseCode }}</span>
                </el-form-item>
                <el-form-item label="合同编号:">
                  <span>{{ dialogFormData.ContractNumber_Y }}</span>
                </el-form-item>
                <el-form-item label="实际户型:">
                  <span>{{ dialogFormData.RoomCount }}室{{ dialogFormData.HallCount }}厅{{ dialogFormData.ToiletCount }}卫</span>
                </el-form-item>
                <el-form-item label="房间面积:">
                  <span>{{ dialogFormData.RentType === 1 ? dialogFormData.HouseArea : dialogFormData.RoomArea }}平米</span>
                </el-form-item>
                <el-form-item label="对外标价:">
                  <span>{{ dialogFormData.RentMoeny }}元/月 &emsp;押 {{ dialogFormData.PledgeNumber }} 付 {{ dialogFormData.PayNumber }}</span>
                </el-form-item>
                <el-form-item label="业主到期时间:">
                  <span>{{ $dateFormat(dialogFormData.EndDate_Y) }}</span>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col
              :span="8"
              class="dialogCol rowRight"
              :style="{ height: !dialogFormData.KeyID ? '' : '320px'}"
            >
              <el-button
                type="primary"
                plain
                size="small"
                class="dialogBtn"
                @click="seeDetails"
                v-setbtn:Detailed
                :showAll="true"
              >查看房源详情
              </el-button>
              <el-button
                type="primary"
                plain
                size="small"
                class="dialogBtn"
                @click="ToCompleteHouse"
                v-setbtn:EditHouse
                :showAll="true"
              >修改房源信息
              </el-button>
              <!-- <el-button type="danger" plain size="small" class="dialogBtn" @click="CompleteHouseInfo">完善房源</el-button> -->
              <!--<el-button-->
                <!--type="primary"-->
                <!--plain-->
                <!--size="small"-->
                <!--class="dialogBtn"-->
                <!--@click="openItemManage"-->
                <!--v-setbtn:Management-->
                <!--:showAll="true"-->
              <!--&gt;物品/卡号管理-->
              <!--</el-button>-->
            </el-col>
          </el-row>
          <!-- 一键发布 -->
          <!--<el-row class="DialogContent">-->
          <!--<el-col :span="16" class="dialogCol">-->
          <!--<el-row>-->
          <!--<el-form-item class="ContentTitle">-->
          <!--<span>一键发布</span>-->
          <!--</el-form-item>-->
          <!--<el-row>-->
          <!--<el-form-item label="已发平台:">-->
          <!--<span-->
          <!--v-for="(item, index) in planteList"-->
          <!--:key="index"-->
          <!--&gt;{{ `${item}${index === planteList.length - 1 ? '' : '、'}` }}</span>-->
          <!--</el-form-item>-->
          <!--</el-row>-->
          <!--</el-row>-->
          <!--</el-col>-->
          <!--<el-col :span="8" class="dialogCol rowRight" style="height: 120px;">-->
          <!--<el-button-->
          <!--type="success"-->
          <!--plain-->
          <!--size="small"-->
          <!--class="dialogBtn"-->
          <!--@click="OpenPushInfo"-->
          <!--&gt;一键发布</el-button>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <!-- 租约信息 -->
          <el-row class="DialogContent">
            <el-col :span="16" class="dialogCol">
              <el-form-item class="ContentTitle">
                <span>租约信息</span>
              </el-form-item>
              <el-row v-if="dialogFormData.tenantInfoDetail.KeyID > 0">
                <el-form-item label="租约编号:">
                  <span>{{ dialogFormData.tenantInfoDetail.ContractNumber || '' }}</span>
                </el-form-item>
                <el-form-item label="租约状态:">
                  <span>{{ $EnumData.getEnumDesByValue('RentLeaseStatus', dialogFormData.tenantInfoDetail.RentLeaseStatus) }}</span>
                </el-form-item>
                <el-form-item label="合同审核状态:">
                  <span>{{ $EnumData.getEnumDesByValue('AuditStatus', dialogFormData.tenantInfoDetail.AuditStatus) }}</span>
                </el-form-item>
                <el-form-item label="承租人姓名:">
                  <span>{{ dialogFormData.tenantInfoDetail.TenantName }}</span>
                </el-form-item>
                <el-form-item label="承租人电话:">
                  <span>{{ dialogFormData.tenantInfoDetail.TenantPhone }}</span>
                </el-form-item>
                <el-form-item label="租约起始:">
                  <span>{{ $dateFormat(dialogFormData.tenantInfoDetail.StartTime) }}至{{ $dateFormat(dialogFormData.tenantInfoDetail.EndTime) }}</span>
                </el-form-item>
                <el-form-item label="付款方式:">
                  <span>押 {{ dialogFormData.tenantInfoDetail.DepositModel }} 付 {{ dialogFormData.tenantInfoDetail.PayModel }}</span>
                </el-form-item>
              </el-row>
              <el-form-item v-else>
                <span>无</span>
              </el-form-item>
              <el-form-item class="ContentTitle">
                <span>预定信息</span>
              </el-form-item>
              <el-row v-if="dialogFormData.ord">
                <el-form-item label="姓名:">
                  <span>{{ dialogFormData.ord.OrderName }}</span>
                </el-form-item>
                <el-form-item label="电话:">
                  <span>{{ dialogFormData.ord.OrderPhone }}</span>
                </el-form-item>
                <el-form-item label="定金:">
                  <span>{{ dialogFormData.ord.OrderMoney }}</span>
                </el-form-item>
                <el-form-item label="最晚签约:">
                  <span>{{ $dateFormat(dialogFormData.ord.LastSignDate) }}</span>
                </el-form-item>
                <el-form-item label="约定租期:">
                  <span>{{ $dateFormat(dialogFormData.ord.LeaseStartTime)}} 至 {{$dateFormat(dialogFormData.ord.LeaseEndTime) }}</span>
                </el-form-item>
                <el-form-item label="预定状态:">
                  <span>{{ $EnumData.getEnumDesByValue('OrderStatus',dialogFormData.ord.OrderStatus) }}</span>
                </el-form-item>
              </el-row>
              <el-form-item v-else>
                <span>无</span>
              </el-form-item>
            </el-col>
            <el-col
              :span="8"
              class="dialogCol rowRight"
              style="position: absolute;
                    right: 0;
                    top: 0;
                    bottom: 0;"
            >
              <el-button
                type="primary"
                plain
                size="small"
                class="dialogBtn"
                @click="TenantRemark"
                v-setbtn:TenantRegistration
              >租客登记
              </el-button>
              <el-button
                type="primary"
                plain
                size="small"
                class="dialogBtn"
                v-if="IsDecorated"
                @click="TenantDetail"
                v-setbtn:TenantDetail
              >租约详情
              </el-button>
              <el-button
                type="warning"
                plain
                size="small"
                class="dialogBtn"
                @click="OpenBooking"
                v-setbtn:AddReservation
                v-if="!dialogFormData.ReservationID"
              >添加预定
              </el-button>
              <el-button
                type="warning"
                plain
                size="small"
                class="dialogBtn"
                v-setbtn:CancelReservation
                @click="CancelOrder"
                v-if="dialogFormData.ord&&dialogFormData.ReservationID"
              >取消预定
              </el-button>
              <el-button type="warning" plain size="small" class="dialogBtn" @click="OpenRev" v-setbtn:AddSubscribe>添加预约</el-button>
              <el-button
                type="warning"
                plain
                size="small"
                class="dialogBtn"
                v-setbtn:CheckTenant
                @click="openContractList"
              >查看租约
              </el-button>
            </el-col>
          </el-row>
          <!-- 管房人 -->
          <el-row class="DialogContent" v-if="2 === 2">
            <el-col :span="16" class="dialogCol" style="height: 160px; overflow: auto;">
              <el-row>
                <el-form-item class="ContentTitle">
                  <span>管房人</span>
                </el-form-item>
                <el-row>
                  <el-form-item
                    label="管房人:"
                    v-for="(item, index) in dialogFormData.Emp"
                    :key="index"
                  >
                    <span>{{ item.UserName }}</span>
                    <span>{{ item.Tel }}</span>
                  </el-form-item>
                </el-row>
              </el-row>
            </el-col>
            <el-col :span="8" class="dialogCol rowRight" style="height: 160px;">
              <!-- <el-button
                type="primary"
                plain
                size="small"
                class="dialogBtn"
                @click="OpenDecoration"
                v-setbtn:SetDecorate
              >修改管房人</el-button>-->
              <!--<select-employee allCompany @select="ChangePeople" :existedEmp="existedEmp" tips="管房人" multi-->
                               <!--v-if="isShow">-->
                <!--<el-button type="primary" @click="popoverVisible = true" plain size="mini">修改管房人</el-button>-->
              <!--</select-employee>-->
            </el-col>
          </el-row>
          <!-- 房源状态 -->
          <el-row class="DialogContent">
            <el-col :span="16" class="dialogCol">
              <el-row>
                <el-form-item class="ContentTitle">
                  <span>房源状态</span>
                </el-form-item>
                <el-row>
                  <el-form-item label="是否正在装修:">
                    <span>{{ dialogFormData.RenovationStatus !== 0 ? '是' : '否'}}</span>
                  </el-form-item>
                </el-row>
              </el-row>
            </el-col>
            <el-col :span="8" class="dialogCol rowRight" style="height: 120px;">
              <!--<el-button-->
                <!--type="success"-->
                <!--plain-->
                <!--size="small"-->
                <!--class="dialogBtn"-->
                <!--@click="OpenDecoration"-->
                <!--v-setbtn:SetDecorate-->
              <!--&gt;设置装修-->
              <!--</el-button>-->
            </el-col>
          </el-row>
          <!-- 账单信息 -->
          <el-row class="DialogContent">
            <el-col :span="16" class="dialogCol">
              <el-form-item class="ContentTitle">
                <span>账单信息</span>
              </el-form-item>
              <el-form-item v-if="dialogFormData.Badge !== 'tarnent'">
                <span>无</span>
              </el-form-item>
              <el-row v-else>
                <el-form-item label="当前欠款:">
                  <span>{{ dialogFormData.Money }}元</span>
                </el-form-item>
                <el-form-item label="租金下期付款日:">
                  <span>{{ $dateFormat(dialogFormData.NextPayTime) }}</span>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col
              :span="8"
              class="dialogCol rowRight"
              :style="{height: dialogFormData.Badge !== 'tarnent' ? '110px' : '140px'}"
            >
              <el-button
                type="primary"
                plain
                size="small"
                class="dialogBtn"
                @click="seeTenant"
                v-setbtn:BillDetailed
              >查看账单
              </el-button>
            </el-col>
          </el-row>
          <!-- 房源备注 -->
          <el-row class="DialogContent" style="background: #f3f9fe">
            <el-col :span="16" class="dialogCol" style="min-height: 86px;">
              <el-form-item class="ContentTitle">
                <span>房源备注</span>
              </el-form-item>
              <el-form-item class="ContentTitle">
                <span v-text="dialogFormData.HouseRemark"></span>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="dialogCol rowRight">
              <el-button
                type="primary"
                plain
                size="small"
                class="dialogBtn"
                @click="OpenHosueRemark"
                v-setbtn:HousingNote
              >房源备注
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </div>
    <house-decoration @CloseDecoration="CloseDecoration" key="22" ref="houseDecration"></house-decoration>
    <house-push key="26" ref="HousePush" @submit="submitHousePush"></house-push>
    <house-remark
      :visible="HosueRemarkVisible"
      @CloseRemark="CloseHosueRemark"
      key="24"
      :HouseInfo="dialogFormData"
      @ChangeRemark="ChangeRemark"
    ></house-remark>
    <booking-house key="32" ref="BookingHouseDialog" @handleSave="BookingHouseSave"></booking-house>
    <reservation-house key="27" ref="ReservationHouseDialog"></reservation-house>
    <item-manage ref="itemManage" key="29"></item-manage>
  </transition-group>
</template>
<script>
  import HouseDecoration from './component/HouseDecoration'
  import HouseRemark from './component/HouseRemark'
  import HousePush from '@/components/HousePush'
  import BookingHouse from '@/components/BookingHouse'
  import ReservationHouse from '@/components/ReservationHouse'
  import ItemManage from '@/components/ItemManage/index'
  import { editHouseInfoEmp, FindFitment, selectMyHouseEmp } from '@/api/house'
  import { CancelOrderInfo } from '@/api/tenant'
  import SelectEmployee from '@/components/SelectEmployee'
  import { mapGetters } from 'vuex'

  export default ({
    name: 'houseDetail',
    data() {
      return {
        DecorationVisible: false,
        HosueRemarkVisible: false,
        ReservationVisible: false,
        BookingVisible: false,
        HouseInfo: {},
        planteList: [],
        existedEmp: []
      }
    },
    components: {
      HouseDecoration,
      HouseRemark,
      ItemManage,
      HousePush,
      BookingHouse,
      SelectEmployee,
      ReservationHouse
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      dialogFormData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    watch: {
      'dialogFormData.HouseKey': {
        handler() {
          selectMyHouseEmp({
            MyHouseKey: this.HouseIDList
          }).then(res => {
            this.existedEmp = res.Data
          })
        }
      }
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialog')
      },
      OpenPushInfo() {
        this.$refs['HousePush'].open(this.dialogFormData.KeyID)
      },
      submitHousePush(data) {
        this.planteList = this.$deepCopy(data)
      },
      OpenDecoration() {
        // this.DecorationVisible = true
        FindFitment({
          houseKey: this.dialogFormData.HouseKey,
          houseID: this.dialogFormData.KeyID
        }).then(response => {
          this.$refs['houseDecration'].open(this.dialogFormData.HouseName, response.Data, this.dialogFormData.HouseKey, this.dialogFormData.KeyID, this.dialogFormData.RenovationStatus)
        })
      },
      CloseDecoration() {
        this.DecorationVisible = false
      },
      OpenHosueRemark() {
        this.HosueRemarkVisible = true
      },
      CloseHosueRemark() {
        this.HosueRemarkVisible = false
      },
      // 预定预约
      OpenBooking() {
        this.$refs.BookingHouseDialog.open(this.dialogFormData)
      },
      BookingHouseSave(data) {
        this.dialogFormData.ord = data
        this.dialogFormData.ReservationID = data.KeyID
        this.dialogFormData.OrderStatus = 6
      },
      CancelOrder() {
        // 自己添加的预定
         if (this.dialogFormData.ord.IsMe === 0) {
           this.$confirm('确定要取消该预定单吗?', '提示').then(() => {
             CancelOrderInfo({
               orderId: this.dialogFormData.ReservationID
             })
               .then(res => {
                 this.dialogFormData.ReservationID = 0
                 this.dialogFormData.ord = null
                 this.dialogFormData.OrderStatus = 5
                 this.$message({
                   type: 'success',
                   message: '取消成功'
                 })
               })
           })
         } else {
           this.$prompt('请输入取消的备注', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消'
           }).then(({ value }) => {
             CancelOrderInfo({
               orderId: this.dialogFormData.KeyID,
               remark: value
             })
               .then(res => {
                 this.dialogFormData.ReservationID = 0
                 this.dialogFormData.ord = null
                 this.dialogFormData.OrderStatus = 5
                 this.$message({
                   type: 'success',
                   message: '取消成功'
                 })
               })
           })
         }
      },
      OpenRev() {
        this.$refs.ReservationHouseDialog.open(this.dialogFormData)
      },
      openContractList() {
        this.$router.push({
          path: '/Tenant/ContractList/',
          query: {
            HouseKey: this.dialogFormData.HouseKey,
            HouseID: this.dialogFormData.KeyID
          }
        })
      },
      CloseRev() {
        this.ReservationVisible = false
      },
      // 批量换管房人
      ChangePeople(data) {
        editHouseInfoEmp({
          MyHouseKey: [this.dialogFormData.HouseKey],
          MyHouseEmp: data,
          type: 1
        }).then(response => {
          this.dialogFormData.Emp = response.Data
          this.$message({
            message: '修改管房人成功!',
            type: 'success'
          })
        })
      },
      openItemManage() {
        this.HouseInfo.ContractID = this.dialogFormData.ContractID_Y
        this.HouseInfo.HouseKey = this.dialogFormData.HouseKey
        this.HouseInfo.HouseID = this.dialogFormData.KeyID
        this.$refs['itemManage'].open(this.HouseInfo)
      },
      TenantDetail() {
        this.$router.push({
          path: '/Tenant/ContractDetail',
          query: {
            KeyID: this.dialogFormData.tenantInfoDetail.KeyID
          }
        })
      },
      seeDetails() {
        this.$router.push({
          path: '/House/HouseInfo',
          query: {
            HouseKey: this.dialogFormData.HouseKey
          }
        })
      },
      ToCompleteHouse() {
        this.$router.push({
          path: '/House/CompleteHouse',
          query: {
            HouseKey: this.dialogFormData.HouseKey,
            type: 'edit'
          }
        })
      },
      CompleteHouseInfo() {
        this.$router.push({
          path: '/House/CompleteHouse',
          query: {
            HouseKey: this.dialogFormData.HouseKey
          }
        })
      },
      TenantRemark() {
        // if (this.dialogFormData.ReservationID) {
        //   this.$router.push({
        //     path: '/Tenant/AddContract',
        //     query: {
        //       OrderID: this.dialogFormData.ReservationID
        //     }
        //   })
        // } else {
          this.$router.push({
            path: '/Tenant/AddContract',
            query: {
              HouseID: this.dialogFormData.KeyID
            }
          })
        // }
      },
      ChangeRemark(msg) {
        this.dialogFormData.HouseRemark = msg
      },
      seeTenant() {
        this.$router.push({
          path: '/Tenant/ContractDetail',
          query: {
            KeyID: this.dialogFormData.ContractID_Z,
            Index: '1'
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'userinfo'
      ]),
      IsDecorated() {
        if (Object.keys(this.dialogFormData).length > 0) {
          if (this.dialogFormData.tenantInfoDetail.KeyID > 0) {
            return true
          } else {
            return false
          }
        }
      },
      HouseIDList() {
        return [this.dialogFormData.HouseKey]
      }
    }
  })
</script>
<style lang="scss" scoped>
  $DialogBlue: #f3f9fe;
  $titleGray: #999999;

  .shadowPaper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 888;
  }

  .HouseDialogContent {
    width: 480px;
    height: 570px;
    position: fixed;
    top: 120px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: #ffffff;
    border-radius: 4px;
    overflow: hidden;
    z-index: 999;
    .DialogHouseTitleRight {
      max-width: 295px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .DialogTitleBox {
      font-size: 18px;
      background: $DialogBlue;
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      color: #444444;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
      .rowRight {
        text-align: center;
      }
    }
    .DialogContentBox {
      border-top: 1px solid #eeeeee;
      max-height: 520px;
      overflow: auto;
      .DialogContent {
        border-top: 1px solid #eeeeee;
      }
      .dialogCol {
        padding: 20px;
        background: #fff;
        color: #444444;
        overflow: hidden;
        .ContentTitle {
          color: $titleGray;
        }
        .el-form-item {
          margin-bottom: 5px;
        }
      }
      .rowRight {
        text-align: center;
        background: $DialogBlue;
        .dialogBtn {
          margin-bottom: 10px;
          margin-left: 0;
        }
      }
    }
  }

  // 弹窗过度效果
  .HouseFade-enter-active,
  .HouseFade-leave-active {
    transition: all 0.6s;
  }

  .HouseFade-enter,
  .HouseFade-leave-to {
    opacity: 0;
    transform: translateY(-200px);
  }
</style>
