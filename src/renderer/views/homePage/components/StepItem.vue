<template>
    <div class="container">
      <div class="step-container-inner" v-for="(step,i) in stepData" :key="step.label">
        <div v-if="i!==0" class="step-line">
          <span v-if="step.stepLabel" class="step-up-text">{{step.stepLabel}}</span>
        </div>
        <div class="step-item-container" @click="goRouter(step.routerName)">
          <div class="step-item-wrap">
            <div class="step-item" :style="{backgroundColor: color}">
              <i :class="['iconfont','step-icon',step.iconname]" :style="{fontSize:step.iconsize}"></i>
            </div>
            <span class="step-text">{{step.label}}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'StepItem',
  props: {
    stepData: Array,
    color: String
  },
  methods: {
    goRouter(name) {
      console.log(name)
      // this.$route.push({
      //   name
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 31px 0 31px 0;
  width: 600px;
  margin: 0 auto;
  color: #666;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  .step-container-inner {
    display: flex;
  }
  .step-line {
    width: 64px;
    height: 20px;
    margin: 0 4px;
    border-bottom: 2px #4e94f3 dashed;
    text-align: center;
    .step-up-text {
      font-size: 12px;
    }
  }
  .step-item-container {
    width: 40px;
    height: 40px;
    margin-bottom: 20px;
    display: flex;
    cursor: pointer;
    .step-item-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      .step-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: red;
        .step-icon {
          color: #fff;
        }
      }
      .step-text {
        white-space: nowrap;
        position: absolute;
        bottom: -20px;
        font-size: 14px;
      }
    }
  }
}
</style>