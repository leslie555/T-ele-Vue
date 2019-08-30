<template>
    <div class="app-container userInfo-div">
        <div class="userInfo-container">
            <div class="userInfo-content">
                <div class="headportrait-div">
                    <div class="head-img">
                        <img v-if="filterUserInfo.HeadPortrait" :src="$ImgUnit.getThumbImgUrl(filterUserInfo.HeadPortrait)"/>
                        <div v-else class="head-default">
                            <i class="iconfont icon-morentouxiang icon-headporatit"></i>
                        </div>
                    </div>
                  <p>{{filterUserInfo.UserName }}</p>
                </div>
                <div class="userInfo-list">
                    <div class="userInfo-item">
                        <span class="userInfo-item-title">联系方式:</span>
                        <span class="userInfo-item-content">{{ filterUserInfo.Tel }}</span>
                        <!--<i class="iconfont icon-fuzhi icon-contact"></i>-->
                        <i class="iconfont icon-fuzhi icon-contact"
                           v-clipboard:copy="filterUserInfo.Tel"
                           v-clipboard:success="onCopy"
                           v-clipboard:error="onError"></i>
                    </div>
                    <div class="userInfo-item">
                        <span class="userInfo-item-title">组织架构:</span>
                        <span class="userInfo-item-content">{{  filterUserInfo.Organization }}</span>
                    </div>
                    <div class="userInfo-item">
                        <span class="userInfo-item-title">所属公司:</span>
                        <span class="userInfo-item-content">{{ filterUserInfo.CompanyName }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { QueryEmp } from '../../../api/usercenter'
  export default {
    data() {
      return {
        filterUserInfo: {},
        userInfo: {}
      }
    },
    created() {
      this.loadUserInfo()
    },
    computed: {
      ...mapGetters([
        'userinfo'
      ])
    },

    methods: {
      loadUserInfo() {
        const postData = { 'empID': this.userinfo.EmpID }
        QueryEmp(postData).then(response => {
          if (response) {
            this.userInfo = response.Data
            this.filterUserInfo = {
              HeadPortrait: this.userInfo.HeadPortrait,
              UserName: this.userInfo.UserName,
              Organization: this.userInfo.Organization,
              CompanyName: this.userInfo.CompanyName,
              Tel: this.userInfo.Tel,
              Functionary: this.userInfo.Functionary
            }
          }
        })
      },
      onCopy() {
        this.$message.success('复制成功')
      },
      onError() {
        this.$message.error('复制失败，请手动复制！')
      }
    }
  }
</script>

<style lang="scss" scoped>
    @import "./style";
</style>
