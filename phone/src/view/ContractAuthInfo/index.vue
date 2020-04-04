<template>
  <div class="contract-auth" v-loading="visible" :element-loading-text="loadingText">
    <!--<div class="contract-sign-box">-->
    <!--<iframe height="100%" width="100%"-->
    <!--:src="signURI"-->
    <!--v-if="signURI"-->
    <!--frameborder="0"></iframe>-->
    <!--</div>-->
    <!--<div class="bottom-box">-->
    <!--<el-button type="primary" @click="signHandle" :disabled="disabled">实名认证</el-button>-->
    <!--</div>-->
  </div>
</template>

<script>
  import request from '../../utils/request'

  export default {
    data() {
      return {
        query: this.$route.query,
        visible: false,
        loadingText: '实名认证加载中..',
        signURI: '',
        disabled: false
      }
    },
    created() {
      if (!this.query.p) {
        this.$alert('参数错误1')
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
        } else {
          this.getAuthUrl()
        }
      } catch (e) {
        this.$alert('参数错误2')
        this.disabled = true
      }
    },
    methods: {
      signHandle() {
        this.$router.push({
          path: 'ContractSign',
          query: {
            p: JSON.stringify(this.query),
            status: 2
          }
        })
      },
      getAuthUrl() {
        this.visible = true
        const query = { ...this.query }
        delete query.im
        delete query.i
        request({
          url: '/FDD/FDD/AddRealNameAuthenticateNeed?Token=' + this.query.to,
          method: 'post',
          data: {
            ReturnTWUrl: JSON.stringify(query),
            CustomerId: this.query.cu
          }
        }).then(({ Data }) => {
          console.log(Data)
          request({
            url: '/FDD/FDD/PersonalCertificationAddress?Token=' + this.query.to,
            method: 'post',
            data: {
              customerId: this.query.cu,
              Name: this.query.n,
              CardNo: this.query.i,
              Mobile: +this.query.m,
              ident_front_path: this.query.im ? this.$ImgUnit.getThumbImgUrl(this.query.im, { w: 500 }) : '',
              return_url: location.origin + location.pathname + '#/ContractSign?p=' + Data + '&to=' + this.query.to
            }
          }).then(({ BusCode, Data }) => {
            if (BusCode === 0) {
              this.visible = false
              location.href = Data
              // this.signURI = Data
            } else if (BusCode === 1) {
              this.visible = false
              this.$alert('客户信息出错，请联系管理员')
            } else if (BusCode === 2) {
              this.loadingText = '用户已实名认证，正在跳转签字页面'
              setTimeout(() => {
                this.signHandle()
                this.visible = false
              }, 1000)
            }
          }).catch(() => {
            this.disabled = true
            this.visible = false
          })
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
