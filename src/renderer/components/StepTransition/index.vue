<template>
    <div class="step-slide-box">
        <transition name="step-slide">
            <slot name="step1"></slot>
        </transition>
        <transition name="step-slide-reverse">
            <slot name="step2"></slot>
        </transition>
    </div>
</template>
<script>
    export default {
      name: 'stepTransition',
      data() {
        return {}
      }
    }
</script>

<style lang="scss" scoped>
    @import '../../styles/mixin.scss';
    .step-slide-box {
      @include stepSlide(0.8s, 100%);
    }
</style>

