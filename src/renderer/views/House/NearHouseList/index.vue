<template>
  <div class="app-container data-list">
    <!-- 展示部分 -->
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="100px">
      <template slot="search">
        <el-form-item label="距离" prop="Meter">
          <el-select v-model="ruleForm.Meter" placeholder="请选择">
            <el-option
              v-for="item in EnumMeter"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="submitForm">查询</el-button>
      </template>
    </search-panel>
    <div class="ShareHouseContent">
      <div class="HouseCount">
        <h4>
          附近房源
          <span>{{ HouseCount }}</span>&nbsp;套
        </h4>
      </div>
    </div>
    <el-row class="panel data-list-table ContentBox">
      <el-table
        style="width: 100%;"
        :data="tableData"
        :show-header="false"
        v-loading.body="listLoading"
        :row-style="rowStyle"
        height="100%"
        class="table-normal"
        @row-click="goDetails"
      >
        <el-table-column width="160">
          <template slot-scope="scope">
            <div style="position: relative">
              <img
                :src="$ImgUnit.getImgUrl(scope.row.ImageLocation)"
                alt="暂无房源图片"
                class="tableHouseImg"
              >
              <img :src="urls[scope.row.Badge]" alt="" style="position: absolute; top: 0; right: 0">
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <p class="tableHouseName">
              {{ scope.row.HouseName }}
            </p>
            <div class="tableHouseInfo">
              <span class="start">{{ $EnumData.getEnumDesByValue('RentType', scope.row.RentType) }}</span>
              <span>押{{ scope.row.PledgeNumber }}付{{ scope.row.PayNumber }}</span>
              <span>{{ scope.row.RoomCount }}室{{ scope.row.HallCount }}厅</span>
              <span class="end">{{ scope.row.HouseArea }} m&sup2;</span>
              <!--<span class="end">业主到期: {{ $dateFormat(scope.row.OwnerEndTime, 'yyyy-MM-dd') }}</span>-->
            </div>
            <div class="tableHouseDate">
              <span>地址: {{ scope.row.Location }}</span><span class="locationNear" @click.stop="goNear(scope.row)"><i
              class="iconfont icon-location"></i>附近房源</span>
            </div>
            <p class="tableHousePrice">{{ scope.row.RentMoeny }}元/月</p>
          </template>
        </el-table-column>
        <el-table-column style="text-align: center;" fixed="right" width="400">
          <template slot-scope="scope">
            <el-button type="primary" @click.stop="OpenBookingHouse(scope.row)" v-if="scope.row.ReserveStatus !== 3">
              预定
            </el-button>
            <!-- v-if="$store.state.user.userinfo.FullID === scope.row.FullID" -->
            <el-button type="primary" @click.stop="OpenReservationHouse(scope.row)">预约</el-button>
            <el-button type="primary" @click.stop="AddTenant(scope.row)">租客登记</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="fetchData"
      style="text-align: right"
    ></bottom-tool-bar>
    <booking-house ref="BookingHouseDialog"></booking-house>
    <reservation-house ref="ReservationHouseDialog"></reservation-house>
  </div>
</template>
<script>
  import BookingHouse from '@/components/BookingHouse'
  import ReservationHouse from '@/components/ReservationHouse'
  import BottomToolBar from '@/components/BottomToolBar'
  import { SearchPanel, SelectStore } from '@/components'
  import { SelectNearHouseList } from '@/api/house'

  export default ({
    name: 'ShareHouse',
    components: {
      BookingHouse,
      ReservationHouse,
      BottomToolBar,
      SearchPanel,
      SelectStore
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    data() {
      return {
        ruleForm: {
          Meter: this.$route.query.Meter || 2000,
          Type: 1,
          Lng: this.$route.query.Lng,
          Lat: this.$route.query.Lat,
          HouseID: this.$route.query.HouseID
        },
        query: this.$route.query,
        urls: {
          // 已租
          tarnent: require('../../../assets/ShareHouse/Havetorent.png'),
          // 已定
          order: require('../../../assets/ShareHouse/Isset.png'),
          // 待租
          empty: require('../../../assets/ShareHouse/rent.png'),
          // 装修
          draw: require('../../../assets/ShareHouse/decorate.png')
        },
        listLoading: true,
        HouseCount: 0,
        // 控制翻页
        pageSize: 10,
        // 表格数据
        rowStyle: { height: '150px', cursor: 'pointer' },
        tableData: [],
        EnumMeter: [
          {
            label: '200米内',
            value: 200
          },
          {
            label: '500米内',
            value: 500
          },
          {
            label: '1千米内',
            value: 1000
          },
          {
            label: '2千米内',
            value: 2000
          }
        ]
      }
    },
    methods: {
      submitForm() {
        this.$refs.bottomToolBar.search()
      },
      AddTenant(row) {
        this.$router.push({
          path: '/Tenant/AddContract',
          query: {
            HouseID: row.HouseID,
            HouseName: row.HouseName
          }
        })
      },
      // 预定按钮
      OpenBookingHouse(data) {
        this.$refs.BookingHouseDialog.open(data, false)
      },
      // 预约按钮
      OpenReservationHouse(data) {
        this.$refs.ReservationHouseDialog.open(data)
      },
      // 点击跳转详情
      goDetails(row, event, col) {
        this.$router.push({
          path: '/House/ShareHouseDetail',
          query: {
            id: row.HouseKey,
            HouseID: row.HouseID,
            ShareRentHouseID: row.HouseStatus === 5 ? row.HouseID : ''
          }
        })
      },
      // 请求
      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        return SelectNearHouseList({
          parm: pages,
          ...this.ruleForm
        }).then(response => {
          this.tableData = response.Data.rows
          this.HouseCount = response.Data.Param.records
          this.listLoading = false
          return response.Data
        }).catch(() => {
          this.listLoading = false
        })
      },
      goNear(row) {
        this.$router.push({
          path: '/House/NearHouseList',
          query: {
            Lng: row.Lng,
            Lat: row.Lat,
            HouseID: row.HouseID,
            Meter: this.ruleForm.Meter
          }
        })
      }
    }
  })
</script>
<style lang="scss" scoped>
  @import "style";
</style>

