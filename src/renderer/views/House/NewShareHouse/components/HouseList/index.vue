<template>
  <div class="house-panel">
    <div class="panel fix-height" v-loading="loading">
      <div class="house-no-data fix-height" v-if="!houseData.length">
        暂无数据
      </div>
      <div class="house-img-panel">
        <div
          class="house-img-list-panel"
          v-for="item in houseData"
          :key="item.houseID"
          @click="goDetails(item)"
        >
          <div class="house-img-list">
            <div class="house-img">
              <img class="house-img-box" :src="$ImgUnit.getImgUrl(item.ImageLocation)" alt="暂无房源图片" />
            </div>
            <div class="house-img-right">
              <div class="house-img-title">{{item.HouseName}}</div>
              <div class="house-img-detail">
                <span class="start">{{ $EnumData.getEnumDesByValue('RentType', item.RentType) }}</span>
                <span>&nbsp;/&nbsp;</span>
                <span>押{{ item.PledgeNumber }}付{{ item.PayNumber }}</span>
                <span>&nbsp;/&nbsp;</span>
                <span>{{ item.RoomCount }}室{{ item.HallCount }}厅</span>
                <span>&nbsp;/&nbsp;</span>
                <span class="end">{{ item.HouseArea }} m&sup2;</span>
              </div>
              <div class="house-img-address">
                <span>{{item.Location}}</span>
                <span class="house-near-address" @click.stop="goNear(item)">
                  <span>
                    <!-- <i class="icon_font_new icon-icon-fujin"></i> -->
                    <i class="iconfont icon-location"></i>
                  </span>
                  <span>附近房源</span>
                </span>
              </div>
              <div class="house-img-price">{{item.RentMoeny + '元/月'}}</div>
            </div>
          </div>
          <div class="house-btn-group">
            <div class="house-btn-item">
              <el-button type="primary" size="mini" @click.stop="OpenBookingHouse(item)">预定</el-button>
              <el-button type="primary" size="mini" @click.stop="OpenReservationHouse(item)">预约</el-button>
              <el-button type="primary" size="mini" @click.stop="AddTenant(item)">租客登记</el-button>
            </div>
          </div>
          <booking-house ref="BookingHouseDialog"></booking-house>
          <reservation-house ref="ReservationHouseDialog"></reservation-house>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookingHouse from '@/components/BookingHouse'
import ReservationHouse from '@/components/ReservationHouse'
export default {
  name: 'HouseList',
  props: {
    houseData: {
      type: Array,
      default: []
    },
    listLoading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BookingHouse,
    ReservationHouse
  },
  mounted() {
  },
  watch: {
    listLoading(loading) {
      this.loading = loading
    }
  },
  data() {
    return {
      HouseList: 8,
      loading: false
    }
  },
  methods: {
    // 附件房源
    goNear(row) {
      console.log('row:', row)
      this.$router.push({
        path: '/House/NearHouseList',
        query: {
          Lng: row.Lng,
          Lat: row.Lat,
          HouseID: row.HouseID
        }
      })
    },
    // 预定
    OpenBookingHouse(data) {
      this.$refs.BookingHouseDialog[0].open(data)
      console.log('预定:', this.$refs)
    },
    // 预约
    OpenReservationHouse(data) {
      this.$refs.ReservationHouseDialog[0].open(data)
      console.log('预约:')
    },
    // 租客登记
    AddTenant(row) {
      this.$router.push({
        path: '/Tenant/AddContract',
        query: {
          HouseID: row.HouseID,
          HouseName: row.HouseName
        }
      })
    },
    // 点击跳转详情
    goDetails(row) {
      this.$router.push({
        path: '/House/ShareHouseDetail',
        query: {
          id: row.HouseKey,
          HouseID: row.HouseID,
          ShareRentHouseID: row.HouseStatus === 5 ? row.HouseID : ''
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import './style';
</style>