<template>
  <Panel title="今日推荐房源">
    <template slot="houseHeader">
      <p class="more" @click="lookMore">查看更多></p>
    </template>
    <div v-for="(item, index) in arrData" :key="index">
      <div class="item-container">
        <img
          :src="$ImgUnit.getThumbImgUrl(item.ConverPic)"
          :data-src="$ImgUnit.getImgUrl(item.ConverPic)"
          class="img-container"
        />
        <div class="content">
          <div class="content-top">
            <div class="content-title">
              <span>{{item.HouseName}}</span>
              <span>A房间</span>
            </div>
            <div class="bonus-container">
              <span class="bonus-text">额外奖金</span>
              <span class="bonus-price">{{item.Bonus}}元</span>
            </div>
          </div>
          <div class="content-bottom">
            <span class="house-type">{{item.RentType===2?'合租':'整租'}}</span>
            <span>{{item.RentMoeny}}元/月</span>
          </div>
        </div>
      </div>
    </div>
  </Panel>
</template>

<script>
import Panel from './Panel'
import { ShowRecommendedHouseList } from '@/api/homePage'
export default {
  name: 'SuggestHouse',
  components: {
    Panel
  },
  data() {
    return {
      arrData: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      ShowRecommendedHouseList().then(({ Data }) => {
        this.arrData = Data
      })
    },
    lookMore() {
      console.log(11)
      this.$router.push({
        name: 'TenantAddContract'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.more {
  font-size: 14px;
  cursor: pointer;
}
.more:hover {
  color: #0088ff;
}
.item-container {
  margin-top: 20px;
  height: 105px;
  display: flex;
  color: #001529;
  font-size: 14px;
  .img-container {
    width: 140px;
    height: 105px;
  }
  .content {
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 18px;
    .content-top {
      display: flex;
      flex-direction: column;
      .content-title {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
      }
      .bonus-container {
        display: flex;
        font-size: 12px;
        .bonus-text {
          color: #fff;
          width: 63px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          background: #0088ff;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        .bonus-price {
          color: #0088ff;
          width: 63px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          background: #e2f4ff;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
    .content-bottom {
      display: flex;
      .house-type {
        margin-right: 35px;
      }
    }
  }
}
</style>