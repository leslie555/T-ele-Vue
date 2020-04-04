<template>
  <div class="home-container-wrap">
    <div class="home-container">
      <div class="main-content">
        <div class="left-content-container">
          <wait-to-handle></wait-to-handle>
          <div class="show-case-container">
            <show-case-item title="出房拿房" :caseData="showCase1"></show-case-item>
            <show-case-item title="管理房源" :caseData="showCase2"></show-case-item>
          </div>
        </div>
        <div class="step-box-container">
          <step-box></step-box>
        </div>
      </div>
      <div class="right-content-container">
        <div class="show-case-container1">
          <show-case-item title="出房拿房" :caseData="showCase1"></show-case-item>
          <show-case-item title="管理房源" :caseData="showCase2"></show-case-item>
        </div>
        <suggest-house></suggest-house>
      </div>
    </div>
  </div>
</template>

<script>
  import { WaitToHandle, ShowCaseItem, StepBox, SuggestHouse } from './components'
  import { ShowHomePageHouseInfoCount, HomePageOutTakeHouse } from '@/api/homePage'
  export default {
    name: 'homePageIndex',
    components: {
      WaitToHandle,
      ShowCaseItem,
      StepBox,
      SuggestHouse
    },
    data() {
      return {
        isFirstEnter: true,
        showCase1: [
          {
            label: '本月出房',
            value: 0,
            unit: '单',
            iconname: 'icon-index-chufang'
          },
          {
            label: '本月拿房',
            value: 0,
            unit: '单',
            iconname: 'icon-index-nafang'
          }
        ],
        showCase2: [
          {
            label: '整租房源',
            value: 0,
            unit: '套',
            iconname: 'zhengzu'
          },
          { label: '合租房源', value: 0, unit: '间', iconname: 'hezu' }
        ]
      }
    },
    created() {
      this.init()
    },
    // activated() {
    //     this.init()
    // },
    methods: {
      init() {
        ShowHomePageHouseInfoCount().then(({ Data }) => {
          this.showCase2[0].value = Data.HouseCountZ
          this.showCase2[1].value = Data.HouseCountH
        })
        HomePageOutTakeHouse().then(({ Data }) => {
          this.showCase1[0].value = Data.OutHouseNumber
          this.showCase1[1].value = Data.TakeHouseNumber
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .home-container-wrap {
    overflow: hidden;
  }
  .home-container {
    margin: 10px;
    display: flex;
    flex-wrap: nowrap;
  }
  .main-content {
    display: flex;
    flex: 1;
    margin-right: 10px;
  }
  @media screen and (min-width: 1300px) {
    .left-content-container {
      width: 400px;
      min-width: 400px;
      margin-right: 10px;
    }
    .step-box-container {
      // width: 766px;
      flex: 1;
    }
    .right-content-container {
      width: 550px;
    }
    .show-case-container1 {
      display: none;
    }
  }
  @media screen and (max-width: 1300px) {
    .main-content {
      flex-direction: column;
    }
    .show-case-container {
      display: none;
    }
  }
</style>
<style lang="scss">
</style>