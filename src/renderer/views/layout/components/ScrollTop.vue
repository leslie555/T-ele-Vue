<template>
    <transition name="fade" mode="out-in">
        <div class="scrollTop" v-show="showTop" @click="toTop">
            <i class="iconfont icon-huidaodingbu"></i>
        </div>
    </transition>
</template>
<script>
  export default {
    name: 'scroll-top',
    data() {
      return {
        scrollTop: 0,
        time: 0,
        dParams: 20,
        scrollState: 0
      }
    },
    computed: {
      showTop: function() {
        const value = this.scrollTop > 200
        return value
      }
    },
    mounted() {
      window.addEventListener('scroll', this.getScrollTop)
    },
    methods: {
      toTop(e) {
        if (this.scrollState) {
          return
        }
        this.scrollState = 1
        e.preventDefault()
        // let distance = document.documentElement.scrollTop || document.body.scrollTop
        const _this = this
        this.time = setInterval(function() {
          _this.gotoTop(_this.scrollTop - _this.dParams)
        }, 10)
      },
      gotoTop(distance) {
        this.dParams += 20
        distance = distance > 0 ? distance : 0
        document.documentElement.scrollTop = document.body.scrollTop = window.pageYOffset = distance
        if (this.scrollTop < 10) {
          clearInterval(this.time)
          this.dParams = 20
          this.scrollState = 0
        }
      },
      getScrollTop() {
        this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      }
    }

  }
</script>
<style scoped lang="scss">
    @import "../../../styles/variables";
    .scrollTop {
        position: fixed;
        right: 40px;
        bottom: 50px;
        cursor: pointer;
        z-index: 3000;
        i{
            font-size: 44px;
            color: #ddd;
            transition: color 1s;
            /*box-shadow: 0 2px 10px #e5e5e5;*/
            border-radius: 50%;
            &:hover{
                color: $--color-primary;
            }
        }
    }
</style>
