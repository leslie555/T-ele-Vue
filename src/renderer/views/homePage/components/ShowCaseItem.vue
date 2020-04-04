<template>
  <Panel :title="title">
    <div class="content-container">
      <div class="left">
        <div v-if="caseData[0].iconname=='zhengzu'" class="zhengzu">整</div>
        <i v-else :class="['iconfont','icon','left-color',caseData[0].iconname]"></i>
        <div class="text-container">
          <span class="label">{{caseData[0].label}}</span>
          <span class="left-color value">{{caseData[0].value+caseData[0].unit}}</span>
        </div>
      </div>
      <div class="right">
        <div v-if="caseData[1].iconname=='hezu'" class="hezu">整</div>
        <i v-else :class="['iconfont','right-color','icon',caseData[0].iconname]"></i>
        <div class="text-container">
          <span class="label">{{caseData[1].label}}</span>
          <span class="right-color value">{{caseData[1].value+caseData[1].unit}}</span>
        </div>
      </div>
    </div>
  </Panel>
</template>

<script>
  import Panel from './Panel'
  export default {
    name: 'ShowCaseItem',
    components: {
      Panel
    },
    props: {
      caseData: Array,
      title: String
    }
  }
</script>

<style lang="scss" scoped>
  .content-container {
    height: 80px;
    display: flex;
    .left,
    .right {
      flex: 1;
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .icon {
      text-align: center;
      font-size: 38px;
    }
    .text-container {
      flex: 1;
      flex-direction: column;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .label {
        font-size: 12px;
        color: #556473;
      }
      .value {
        font-size: 18px;
      }
    }
    .zhengzu,
    .hezu {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      text-align: center;
      line-height: 40px;
      color: #fff;
      font-size: 20px;
    }
    .zhengzu {
      background: #0088ff;
    }
    .hezu {
      background: #ff8241;
    }
    .left-color {
      color: #0088ff;
    }
    .right-color {
      color: #ff8241;
    }
  }
  @media screen and (min-width: 1300px) {
    .content-container {
      height: 70px;
    }
    .left,
    .right {
      align-items: flex-end;
    }
  }
</style>