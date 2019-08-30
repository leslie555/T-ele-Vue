<template>
  <div class="contract-sign" v-loading="visible" :element-loading-text="loadingText">
    <div class="contract-sign-box">
        <iframe height="100%" width="100%"
                :src="signURI"
                v-if="signURI"
                frameborder="0"></iframe>
    </div>
    <div class="bottom-box">
      <el-button type="primary" @click="signHandle" :disabled="disabled">现场签字</el-button>
    </div>
  </div>
</template>

<script>
  import request from '../../utils/request'

  export default {
    data() {
      return {
        query: this.$route.query,
        visible: false,
        loadingText: '预览文件生成中..',
        signURI: '',
        disabled: false
      }
    },
    created() {
      if (!this.query.p) {
        this.$alert('参数错误')
        this.disabled = true
        return
      }
      try {
        this.query = JSON.parse(this.query.p)
        const timeout = this.query.ti
        const calc = new Date().getTime() - timeout
        console.log(calc)
        if (calc > 1000 * 3600) {
          this.$alert('链接已过期')
          this.disabled = true
          return
        }
      } catch (e) {
        this.$alert('参数错误')
        this.disabled = true
        return
      }
      this.getViewContract()
    },
    methods: {
      signHandle() {
        this.$router.push({
          path: 'sign',
          query: this.query
        })
      },
      getViewContract() {
        this.visible = true
        request({
          url: '/FDD/FDD/ViewContractAndUploaddoc?Token=' + this.query.to,
          method: 'post',
          data: {
            ContractId: this.query.c,
            TemplateType: +this.query.ty + 1
          }
        }).then(({ Data }) => {
          this.visible = false
          this.signURI = decodeURIComponent(Data)
        }).catch(() => {
          this.disabled = true
          this.visible = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
<style lang="scss">
  .contract-sign {
    .el-scrollbar {
      height: 100%;
    }
    .el-scrollbar__view {
      height: 100%;
    }
  }
</style>
