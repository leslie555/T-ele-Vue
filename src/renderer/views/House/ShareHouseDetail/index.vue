<template>
  <div class="app-container" v-loading.lock="ShareHouseLoading" element-loading-text="拼命加载房源信息中...">
    <el-row>
      <el-card shadow="hover" v-if="HouseInfoData.length > 0">
        <el-row :gutter="40">
          <el-col :span="10">
            <el-carousel style="width: 100%; height: 360px;" height="100%" v-if="HouseInfoData[HouseInfoIndex].hosueImage.length > 0">
              <el-carousel-item
                v-for="(item, index) in HouseInfoData[HouseInfoIndex].hosueImage"
                :key="index"
                style="text-align: center;"
              >
                <img
                  :src="$ImgUnit.getImgUrl(item.ImageLocation)"
                  alt="暂无图片"
                  class="houseCarouselImg"
                >
              </el-carousel-item>
            </el-carousel>
            <el-carousel style="width: 100%; height: 360px;" height="100%" v-else>
              <el-carousel-item
                style="text-align: center;"
              >
                <img
                  :src="$ImgUnit.getImgUrl('')"
                  alt="暂无图片"
                  class="houseCarouselImg"
                >
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col :span="12">
            <el-row class="HouseTitleDetail">
              <h4 class="InfoTitle">
                <div>{{ CurName }}</div>
                <span
                  style="margin-left: 140px; font-size: 14px; cursor: pointer; color: #389ef2"
                  v-show="HouseInfoData[HouseInfoIndex].EnshrineState === 1"
                  @click="CancelCollectHouse"
                >
                  <i class="iconfont icon-shoucangshixin"></i> 已收藏
                </span>
                <span
                  style="margin-left: 140px; font-size: 14px; cursor: pointer;"
                  v-show="HouseInfoData[HouseInfoIndex].EnshrineState !== 1"
                  @click="CollectHouse"
                >
                  <i class="iconfont icon-shoucang"></i> 收藏
                </span>
              </h4>
              <el-row style="margin-top: 30px;">
                <el-row class="DetailsRow">
                  <el-col :span="9">
                    <span class="HouseDetailName">租&emsp;&emsp;金:</span>
                    <span
                      class="HouseDetailValue"
                    >&emsp;{{ HouseInfoData[HouseInfoIndex].RentMoeny }}元/月</span>
                  </el-col>
                  <el-col :span="9">
                    <span class="HouseDetailName">出租方式:</span>
                    <span
                      class="HouseDetailValue"
                    >&emsp;{{ $EnumData.getEnumDesByValue('RentType', HouseInfoData[HouseInfoIndex].RentType) }}</span>
                  </el-col>
                </el-row>
                <el-row class="DetailsRow">
                  <el-col :span="9">
                    <span class="HouseDetailName">楼&emsp;&emsp;层:</span>
                    <span
                      class="HouseDetailValue"
                    >&emsp;{{ HouseInfoData[HouseInfoIndex].InFloor }}/{{ HouseInfoData[HouseInfoIndex].TotalFloor }}({{ HouseInfoData[HouseInfoIndex].IsElevator ? '电梯' : '非电梯'}})</span>
                  </el-col>
                  <el-col :span="9">
                    <span class="HouseDetailName">房屋类型:</span>
                    <span
                      class="HouseDetailValue"
                    >&emsp;{{ $EnumData.getEnumDesByValue('HouseType', HouseInfoData[HouseInfoIndex].HouseType) }}</span>
                  </el-col>
                </el-row>
                <el-row class="DetailsRow">
                  <el-col :span="9">
                    <span class="HouseDetailName">缴费方式:</span>
                    <span
                      class="HouseDetailValue"
                    >&emsp;押{{ HouseInfoData[HouseInfoIndex].PledgeNumber }}付{{ HouseInfoData[HouseInfoIndex].PayNumber }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span style="color: #999999">业主到期时间:</span>
                    <span
                      class="HouseDetailValue"
                    >&emsp;{{ $dateFormat(HouseInfoData[HouseInfoIndex].OwnerEndTime, 'yyyy-MM-dd') }}</span>
                  </el-col>
                </el-row>
                <el-row class="DetailsRow">
                  <el-col :span="9" v-if="!HouseInfoData[HouseInfoIndex].TenEndTime">
                    <span style="color: #999999">暂无租客</span>
                  </el-col>
                  <el-col :span="9" v-else>
                    <span style="color: #999999">租客到期时间:</span>
                    <span
                      class="HouseDetailValue"
                    >&emsp;{{ $dateFormat(HouseInfoData[HouseInfoIndex].TenEndTime, 'yyyy-MM-dd') }}</span>
                  </el-col>
                </el-row>
                <el-row class="DetailsRow">
                  <el-col :span="15">
                    <span class="HouseDetailName">地&emsp;&emsp;址:</span>
                    <span
                      class="HouseDetailValue"
                    >&emsp;{{ HouseInfoData[HouseInfoIndex].Location }}-{{ HouseInfoData[HouseInfoIndex].CommunityName }}</span>
                  </el-col>
                </el-row>
              </el-row>
              <el-row style="margin-top: 20px;">
                <el-button
                  v-for="(btn, index) in HouseInfoData"
                  :key="btn.HouseId"
                  size="small"
                  :disabled="btn.ReservationID || btn.HouseStatus === 5"
                  :class="{ 'btnActive': btnActive === index}"
                  @click="changeRoom(index, btn.ReserveStatus,btn.RenovationStatus, btn.HouseStatus)"
                >{{btn.RoomName === '' ? '整租' : btn.RoomName }}{{ btn.RoomName === ''? '' : '(' + $EnumData.getEnumDesByValue('RoomType', btn.RoomType) + ')'}}</el-button>
              </el-row>
              <el-row style="margin: 20px 0 30px;" class="HouseManagerBox">
                <div
                  class="HouseManager"
                  v-for="(item, index) in HouseInfoData[0].Emp"
                  :key="index"
                >
                  <span style="margin-right: 10px; font-size: 16px; color: #389ef2;">管家</span>
                  <span style="margin-right: 10px; font-size: 16px;">{{ item.UserName }}</span>
                  <span style="margin-top: 10px; font-size: 16px;">{{ item.Tel }}</span>
                </div>
              </el-row>
              <!-- 按钮组 -->
              <el-row style="margin-top: 20px;">
                <el-button type="primary" @click="OpenBooking(CurName)" :disabled="HouseInfoData[HouseInfoIndex].ReservationID">预定</el-button>
                <el-button type="primary" @click="OpenReservation(CurName)">预约</el-button>
                <el-button type="primary" @click="AddTenant" :disabled="HouseInfoData[HouseInfoIndex].ReservationID">租客登记</el-button>
                <!--<el-button type="primary" @click="SeeInfo">合同信息</el-button>-->
              </el-row>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row class="HouseInfoListBox">
      <!-- 房间配置信息 -->
      <el-col :span="24" class="HouseInfoList panel" v-if="RoomList.length > 0">
        <h4 class="HouseInfoTitle panel-title">房间信息</h4>
        <el-table :data="RoomList" :show-header="false" :row-style="{background: '#F5FAFE'}">
          <el-table-column width="240" align="left">
            <template slot-scope="scope">
              <span style="color: #409EFF; font-size: 16px;">{{ scope.row.RoomName }}</span>
              <span style="color: #999999">
                ({{ scope.row.RoomArea }}m
                <sup>2</sup>)
              </span>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <span>【房间配置】</span>
              <span
                v-for="item in scope.row.houseEquipmentList"
                :key="item.KeyID"
                style="margin-right: 10px;"
              >{{ item.EquipmentName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <!-- 公共区域配置信息 -->
      <el-col :span="24" class="HouseInfoList panel">
        <h4 class="HouseInfoTitle panel-title">公共区域有什么</h4>
        <el-row>
          <span
            v-for="item in PublicList"
            :key="item.KeyID"
            style="font-size: 14px;"
          >{{ item.EquipmentName }}&emsp;</span>
        </el-row>
      </el-col>
      <!-- 整租价格配置 -->
      <el-col :span="24" class="HouseInfoList panel" v-if="isShowCommon">
        <h4 class="HouseInfoTitle panel-title">整租价格配置</h4>
        <el-table :data="infoTableData" :header-cell-style="{background: '#ECF5FF'}">
          <el-table-column label="房间面积（m²）" prop="HouseArea" align="center"></el-table-column>
          <el-table-column label="定金(元)" prop="Deposit" align="center"></el-table-column>
          <el-table-column label="付款方式" align="center">
            <template slot-scope="scope">押{{ scope.row.PledgeNumber }} 付 {{ scope.row.PayNumber }}</template>
          </el-table-column>
          <el-table-column label="租金(元)" prop="RentMoeny" align="center"></el-table-column>
        </el-table>
      </el-col>
      <!-- 合租价格配置 -->
      <el-col :span="24" class="HouseInfoList panel" v-if="isShowPart">
        <h4 class="HouseInfoTitle panel-title">合租价格配置</h4>
        <el-table :data="infoTableData2" :header-cell-style="{background: '#ECF5FF'}">
          <el-table-column label="房间名称" prop="RoomName" align="center"></el-table-column>
          <el-table-column label="房间类型" align="center">
            <template
              slot-scope="scope"
            >{{ $EnumData.getEnumDesByValue('RoomType', scope.row.RoomType) }}</template>
          </el-table-column>
          <el-table-column label="房间面积（m²）" prop="RoomArea" align="center"></el-table-column>
          <el-table-column label="朝向" align="center">
            <template slot-scope="scope">
              <span>{{ $EnumData.getEnumDesByValue('Toward', scope.row.Toward) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="定金(元)" prop="Deposit" align="center"></el-table-column>
          <el-table-column label="付款方式" align="center">
            <template slot-scope="scope">押{{ scope.row.PledgeNumber }} 付 {{ scope.row.PayNumber }}</template>
          </el-table-column>
          <el-table-column label="租金(元)" prop="RentMoeny" align="center"></el-table-column>
          <el-table-column label="水电气比例" prop="ShareProportion" align="center"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="HouseInfoList panel" v-if="HouseInfoData.length > 0">
        <h4 class="HouseInfoTitle panel-title">房源描述</h4>
        <p class="HouseInfoDesc">{{ HouseInfoData[0].HouseDesc }}</p>
      </el-col>
    </el-row>
    <booking-house ref="BookingHouseDialog"></booking-house>
    <reservation-house ref="ReservationHouseDialog"></reservation-house>
    <show-more
      :showMoreVisible="showMoreVisible"
      :houseInfo="houseInfo"
      :houseID="houseID"
      :houseKey="houseKey"
      @close="closeShowMore"
    ></show-more>
  </div>
</template>

<script>
import BookingHouse from '@/components/BookingHouse'
import ReservationHouse from '@/components/ReservationHouse'
import ShowMore from './components/ShowMore'
import { selectShareHouseInfoListByID, addEnshrine, delEnshrine } from '@/api/house'

export default ({
  name: 'ShareHouseDetail',
  components: {
    BookingHouse,
    ReservationHouse,
    ShowMore
  },
  data() {
    return {
      isShowCommon: true,
      isShowPart: true,
      showMoreVisible: false,
      // 房源页面数据
      HouseInfoData: [],
      houseInfo: {},
      houseID: '0',
      houseKey: '0',
      // 房源详情切换控制
      HouseInfoIndex: 0,
      // 激活btn
      btnActive: 0,
      // loading
      ShareHouseLoading: true,
      // 预约预订
      BookingVisible: false,
      ReservationVisible: false,
      // 是否收藏
      isCollect: false,
      RoomList: [],
      infoTableData: [],
      infoTableData2: [],
      PublicList: []
    }
  },
  created() {
    this.selectShareHouseInfoList()
    // console.log(this.$store.state.user.userinfo)
  },
  methods: {
    AddTenant() {
      this.$router.push({
        path: '/Tenant/AddContract',
        query: {
          HouseID: this.HouseInfoData[this.HouseInfoIndex].HouseID,
          HouseName: this.HouseInfoData[this.HouseInfoIndex].HouseName
        }
      })
    },
    CollectHouse() {
      addEnshrine({
        KeyID: this.HouseInfoData[this.HouseInfoIndex].KeyID,
        HouseID: this.HouseInfoData[this.HouseInfoIndex].HouseID,
        BusinessID: this.HouseInfoData[this.HouseInfoIndex].BusinessID,
        CompanyID: this.$store.state.user.userinfo.CompanyID,
        DepID: this.$store.state.user.userinfo.DepID,
        EmployeeID: this.$store.state.user.userinfo.EmpID,
        EnshrineState: 1
      }).then(({ Code, BusCode, Msg, Data }) => {
        if (Code === 0) {
          this.HouseInfoData[this.HouseInfoIndex].EnshrineID = Data
          this.HouseInfoData[this.HouseInfoIndex].EnshrineState = 1
          this.$message({
            message: '收藏成功',
            type: 'success'
          })
        }
      })
    },
    // 取消收藏
    CancelCollectHouse() {
      delEnshrine({
        KeyID: this.HouseInfoData[this.HouseInfoIndex].EnshrineID
      }).then(({ Code, BusCode, Msg, Data }) => {
        if (Code === 0) {
          this.HouseInfoData[this.HouseInfoIndex].EnshrineState = 2
          this.$message({
            message: '取消成功',
            type: 'success'
          })
        }
      })
    },
    // 开启弹窗
    OpenBooking() {
      this.$refs.BookingHouseDialog.open(this.HouseInfoData[this.HouseInfoIndex])
    },
    OpenReservation() {
      this.$refs.ReservationHouseDialog.open(this.HouseInfoData[this.HouseInfoIndex])
    },
    SeeInfo() {
      this.houseInfo = {
        houseName: this.HouseInfoData[this.HouseInfoIndex].HouseName,
        houseArea: this.HouseInfoData[this.HouseInfoIndex].HouseArea,
        location: this.HouseInfoData[this.HouseInfoIndex].Location,
        // 室
        RoomCount: this.HouseInfoData[this.HouseInfoIndex].RoomCount,
        // 厅
        HallCount: this.HouseInfoData[this.HouseInfoIndex].HallCount,
        // 卫
        ToiletCount: this.HouseInfoData[this.HouseInfoIndex].ToiletCount
      }
      this.houseID = this.HouseInfoData[this.HouseInfoIndex].HouseID + ''
      this.houseKey = this.HouseInfoData[this.HouseInfoIndex].HouseKey + ''
      this.showMoreVisible = true
    },
    closeShowMore() {
      this.showMoreVisible = false
    },
    // 关闭弹窗
    CloseBooking() {
      this.BookingVisible = false
    },
    CloseReservation() {
      this.ReservationVisible = false
    },
    // 获取页面信息
    selectShareHouseInfoList() {
      return selectShareHouseInfoListByID({
        HouseKey: this.$route.query.id
      }).then(({ Code, BusCode, Msg, Data }) => {
        if (Code === 0) {
          this.HouseInfoData = Data
          for (let i = 0; i <= Data.length - 1; i++) {
            if (+Data[i].HouseID === +this.$route.query.HouseID) {
              this.btnActive = i
              this.HouseInfoIndex = i
              // this.changeRoom(i)
              break
            }
          }
          // 获取房间物品表格
          this.HouseInfoData.forEach((ele, index) => {
            if (ele.EnterType !== 2) {
              if (index !== 0) {
                this.RoomList.push(ele)
              }
            } else {
              this.RoomList.push(ele)
            }
          })
          // 获取公共区域配置
          this.PublicList = this.HouseInfoData[0].houseAreaList
          // 获取价格配置
          this.infoTableCrate()
          this.ShareHouseLoading = false
          if (Data.EnshrineState === 1) {
            this.isCollect = true
          }
        }
      }).catch(response => {
        // this.$message.error('网络错误,请稍后刷新重试')
        this.ShareHouseLoading = false
      })
    },
    // 切换按钮
    changeRoom(index, ReserveStatus, RenovationStatus, HouseStatus) {
      // if (HouseStatus === 3 && (ReserveStatus === 0 || ReserveStatus === 1) && (RenovationStatus === 0)) {
      this.btnActive = index
      this.HouseInfoIndex = index
      // } else {
      //   return false
      // }
    },
    // 整租价格配置表
    infoTableDataCreate() {
      this.infoTableData.push(this.HouseInfoData[0])
    },
    infoTableData2Create(isPart) {
      if (isPart) {
        this.infoTableData2 = this.HouseInfoData
      } else {
        this.HouseInfoData.forEach((ele, index) => {
          if (index !== 0) {
            this.infoTableData2.push(ele)
          }
        })
      }
    },
    infoTableCrate() {
      switch (this.HouseInfoData[0].EnterType) {
        case 1:
          this.infoTableDataCreate()
          this.isShowPart = false
          break
        case 2:
          this.infoTableData2Create(true)
          this.isShowCommon = false
          break
        case 3:
          this.infoTableDataCreate()
          this.infoTableData2Create(false)
      }
    }
  },
  computed: {
    CurName() {
      if (this.HouseInfoData[this.HouseInfoIndex]) {
        return `${this.HouseInfoData[this.HouseInfoIndex].HouseName}`
      } else {
        return ''
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "style";
</style>
