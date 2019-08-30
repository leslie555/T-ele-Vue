<template>
  <div class="app-container contract-sign fixed-box" v-loading="visible" :element-loading-text="loadingText">
    <div class="contract-sign-box">
      <iframe height="100%" width="100%"
              :src="signUrl"
              v-if="signUrl"
              frameborder="0"></iframe>
      <div class="btn-box">
        <el-button type="primary" plain size="small"
                   v-if="signUrl"
                   v-clipboard:copy="signUrl"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">复制链接</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { getFddAuthUrl, personAuth } from '../../../api/owner'

  export default {
    data() {
      return {
        query: this.$route.query,
        type: this.$route.name === 'OwnerContractSign' ? 0 : 1,
        visible: false,
        loadingText: '个人信息认证中..',
        CustomerId: '',
        signUrl: ''
      }
    },
    created() {
      this.initMassage()
      this.personAuth()
    },
    methods: {
      ...mapActions([
        'delView'
      ]),
      initMassage() {
        window.addEventListener('message', (event) => {
          if (event.origin && event.origin.indexOf('www.51tanwo.com') !== -1) {
            console.log(event.data)
            if (+event.data.status === 0) {
              // 成功
              this.delView(this.$route)
              this.$router.replace({
                path: this.type === 0 ? '/Owner/ContractDetail' : '/Tenant/ContractDetail',
                query: {
                  KeyID: this.query.ContractID
                }
              })
            }
          }
        }, false)
      },
      personAuth() {
        this.visible = true
        return personAuth({
          Idcard: this.query.IDCard,
          Mobile: this.query.Mobile,
          Name: this.query.Name,
          ElectronicSeal: ''
        }).then(({ Data }) => {
          if (Data.Status === 0) {
            this.CustomerId = Data.CustomerId
            this.getSignUrl()
          } else {
            this.$confirm('个人认证失败', '温馨提示', {
              cancelButtonText: '返回上一页',
              confirmButtonText: '重新认证'
            }).then(() => {
              this.delView(this.$route)
              this.$router.back()
            }).catch(() => {
              this.personAuth()
            })
          }
        }).finally(() => {
          if (!this.CustomerId) {
            this.visible = false
          }
        })
      },

      getSignUrl() {
        this.loadingText = '签署文件生成中...'
        return getFddAuthUrl({
          ContractId: this.query.ContractID,
          CustomerId: this.CustomerId,
          TemplateType: this.type + 1,
          BCustomerId: '02E27683E4FC2AC722E61A98B5EB4E4A ',
          Mobile: this.query.Mobile,
          Name: this.query.Name
        }).then(({ Data }) => {
          this.signUrl = decodeURIComponent(Data)
        }).finally(() => {
          this.visible = false
        })
      },
      onCopy() {
        this.$message.success('复制成功')
      },
      onError() {
        this.$message.error('复制失败！')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
<style lang="scss">
  @import "global-style";
</style>
