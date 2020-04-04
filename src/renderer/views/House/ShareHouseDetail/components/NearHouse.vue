<template>
  <div class="near-house" v-loading="listLoading">
    <div class="near-item ContentBox" v-for="(item,index) in list" :key="index">
      <div style="position: relative;width: 140px;margin-right: 10px">
        <img
          :src="$ImgUnit.getImgUrl(item.ImageLocation)"
          alt="暂无房源图片"
          class="tableHouseImg"
        >
        <img :src="urls[item.Badge]" alt="" style="position: absolute; top: 0; right: 0">
      </div>
      <div style="flex: 1;">
        <p class="tableHouseName" @click="goDetail(item)">
          {{ item.HouseName }}
        </p>
        <div class="tableHouseInfo">
          <span class="start">{{ $EnumData.getEnumDesByValue('RentType', item.RentType) }}</span>
          <span>押{{ item.PledgeNumber }}付{{ item.PayNumber }}</span>
          <span>{{ item.RoomCount }}室{{ item.HallCount }}厅</span>
          <span class="end">{{ item.HouseArea }} m&sup2;</span>
        </div>
        <div class="tableHouseDate">
          <span>地址: {{ item.Location }}</span>
        </div>
        <p class="tableHousePrice">{{ item.RentMoeny }}元/月</p>
      </div>
    </div>

  </div>
</template>

<script>
  import { SelectNearHouseList } from '@/api/house'

  export default {
    name: 'NearHouse',
    props: ['lng', 'lat', 'HouseID'],
    data() {
      return {
        listLoading: true,
        list: [],
        urls: {
          // 已租
          tarnent: require('../../../../assets/ShareHouse/Havetorent.png'),
          // 已定
          order: require('../../../../assets/ShareHouse/Isset.png'),
          // 待租
          empty: require('../../../../assets/ShareHouse/rent.png'),
          // 装修
          draw: require('../../../../assets/ShareHouse/decorate.png')
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        return SelectNearHouseList({
          parm: {
            page: 1,
            size: 4
          },
          Type: 1,
          Lng: this.lng,
          Lat: this.lat,
          Meter: 2000,
          HouseID: this.HouseID,
          IsHaveImage: 1
        }).then(({ Data }) => {
          this.list = Data.rows
          this.listLoading = false
          return Data
        }).catch(() => {
          this.listLoading = false
        })
      },
      goDetail(row) {
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

<style scoped lang="scss">
  @import "../../../../styles/mixin";

  $ShareHouseBlue: #389ef2;
  $ShareHouseGray: #444444;
  $ShareHouseTitle: #999999;
  .near-house {
    min-height: 150px;
    @include displayFlex(row, flex-start, flex-start);
    flex-wrap: wrap;
  }

  .near-item {
    width: 50%;
    height: 150px;
    @include displayFlex(row, center, center);
  }

  .ContentBox {
    font-size: 14px;
    .tableHouseImg {
      width: 100%;
      height: 100px;
      border-radius: 6px;
      padding: 0;
    }

    .tableHouseDate {
      margin: 10px 0;
      padding-left: 10px;
    }

    .locationNear {
      color: #389EF2;
      font-size: 14px;
      margin-left: 20px;
    }

    .tableHouseInfo {
      margin: 10px 0;
      padding-left: 10px;
      span {
        display: inline-block;
        padding: 0 10px;
        // border-left: 1px solid #999999;
        border-right: 1px solid #999999;
        line-height: 14px;
      }
      span.start {
        padding-left: 0;
      }
      span.end {
        border: 0;
      }
    }

    .tableHouseName {
      font-size: 18px;
      cursor: pointer;
      padding-left: 10px;
      color: $ShareHouseBlue;
      // margin-top: 5px;

      span {
        margin-left: 20px;
      }

      .tableHouseManager {
        color: $ShareHouseGray;
      }
    }

    .tableHousePrice {
      color: #ff5a5a;
      font-size: 22px;
      margin: 10px 0 0 0;
      padding-left: 10px;
    }

    .tableHouseAddress {
      color: $ShareHouseTitle;
      padding-left: 10px;
    }
  }
</style>
