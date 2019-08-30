<template>
  <div class="contract-tabs">
    <div class="contract-tab" :class="{active:index==0}" @click="changeTab(0)">
      <div class="contract-tab-title">
        新签电子合同 <i>推荐</i>
      </div>
      <div class="contract-tab-content">
        适用于空房新签约场景，使用CA电子合同，实名认证{{text}}身份，公证机构颁发云证书，具备法律效力，同时管理方便
      </div>
    </div>
    <div class="contract-tab" :class="{active:index==1}" @click="changeTab(1)">
      <div class="contract-tab-title">
        纸质合同
      </div>
      <div class="contract-tab-content">
        适用于已与{{text}}签约过纸质合同场景，将合同信息补录到系统中，方便统一管理，支持在线收租。
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ContractTabs',
    props: {
      index: {
        type: Number,
        default: 0
      },
      type: {
        type: Number,
        default: 0 // 合同类型 0代表业主 1代表租客
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      text() {
        return this.type === 0 ? '业主' : '租客'
      }
    },
    created() {
      this.life().then(data => {
        console.log(data)
      })
    },
    methods: {
      changeTab(index) {
        if (this.disabled) return
        if (index === this.index) return
        this.$emit('tab-change', index, index)
      },
      findYou() {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, 3000)
        })
      },
      async life() {
        await this.findYou()
        return 'Hello,World!'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
