<template>
  <div>
    <i @click="toggleClick" class="iconfont icon-caidanzhankai hamburger" :class="{'is-active':isActive}"></i>
  </div>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped>
.hamburger {
	display: inline-block;
	cursor: pointer;
    font-size: 15px;
	transform: rotate(90deg);
	transition: .38s;
	transform-origin: 50% 50%;
    color: #fff;
}
.hamburger.is-active {
	transform: rotate(0deg);
}
</style>
