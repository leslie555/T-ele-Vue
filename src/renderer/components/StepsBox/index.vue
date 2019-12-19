<template>
    <div class="steps-box">
        <div class="steps-panel" v-if="list.length>1">
            <div class="steps-herder">
                <div class="step-item-title"  v-for="(item, index) in list" :key="index"
                     :class="currentStep>index?'active':''">
                    {{index+1}}.{{item.title}}
                </div>
            </div>
            <div class="steps-content">
                <div class="step-item" v-for="(item, index) in list" :key="index"
                     :class="{active:currentStep>index,current:currentStep==index+1}">
                    <div class="step-item-progress" v-if="index>0">
                        <div class="step-item-progress-inner"></div>
                    </div>
                    <div class="step-item-icon" @click="goStep(index) ">
                        <div class="step-item-icon-inner"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="steps-body">
            <!--<transition-group name="fade-transform">-->
            <div v-for="(item,key, index) in $slots" :key="key" v-show="currentStep==index+1">
                <slot :name="key"></slot>
            </div>
            <!--</transition-group>-->
        </div>
    </div>
</template>
<style scoped lang="scss">
    @import 'style';
</style>
<script>
  export default {
    name: 'StepsBox',
    props: {
      list: Array
    },
    data() {
      return {
        currentStep: 1
      }
    },
    created() {
    },
    methods: {
      nextStep() {
        if (this.currentStep < this.list.length) {
          this.currentStep++
          this.goTop()
        }
      },
      prevStep() {
        if (this.currentStep > 1) {
          this.currentStep--
          this.goTop()
        }
      },
      goStep(index) {
        if (this.currentStep > index + 1) {
          this.currentStep = index + 1
          this.goTop()
        }
      },
      goTop() {
        document.documentElement.scrollTop = document.body.scrollTop = window.pageYOffset = 0
        this.$emit('change', this.currentStep)
      }
    }
  }
</script>
