<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="header-logo">
      <img src="../../../assets/header-logo.png" @click="$router.push({path: '/homePage'})">
    </div>
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <div class="menu-right">
      <div class="menu-right-container">
        <el-popover placement="bottom" width="200" trigger="click">
          <div class="download-app-code-box">
            <img :src="qrcode" class="download-img">
            <div class="download-tip">手机扫码快速下载</div>
          </div>
          <div class="download-text" slot="reference">手机版</div>
        </el-popover>
        <screenfull class="screenfull"></screenfull>
        <div class="msg-container" @click="toMsgCenter">
          <i class="iconfont icon-xiaoxitongzhi msg-icon"></i>
          <div v-if="messageNumber>0&&messageNumber<=99" class="msg-number">{{messageNumber}}</div>
          <div v-if="messageNumber>99" class="msg-number msg-number-max">99+</div>
        </div>
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <i class="iconfont icon-morentouxiang user-avatar"></i>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <router-link class="inlineBlock" to="/UserCenter/UserInfo">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <router-link class="inlineBlock" to="/UserCenter/HouseCollection">
              <el-dropdown-item>我的收藏</el-dropdown-item>
            </router-link>
            <router-link class="inlineBlock" to="/UserManual/UserManualIndex">
              <el-dropdown-item>用户手册</el-dropdown-item>
            </router-link>
            <!--<router-link class="inlineBlock" to="../UserCenter/OperationLog">-->
            <!--<el-dropdown-item>-->
            <!--操作日志-->
            <!--</el-dropdown-item>-->
            <!--</router-link>-->
            <el-dropdown-item>
              <div @click="openResetPwd">修改密码</div>
              <reset-pwd ref="resetPwd"></reset-pwd>
            </el-dropdown-item>
            <template></template>
            <el-dropdown-item divided>
              <div @click="logout">退出登录</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-if="userinfo.CompanyInfo.length>1" class="userInfo-div">
          <p class="user-name">{{ userinfo.CompanyName }}</p>
          <p class="change-company" @click="toggleCompany">&lt;切换&gt;</p>
          <toggle-company ref="toggleCompany"></toggle-company>
        </div>
      </div>
    </div>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Hamburger from '@/components/Hamburger'
  import Screenfull from '@/components/Screenfull'
  import ResetPwd from '@/components/ResetPwd'
  import ToggleCompany from '@/components/ToggleCompany'

  export default {
    data() {
      return {
        qrcode: require('../../../assets/download-code.png')
      }
    },
    components: {
      Hamburger,
      Screenfull,
      ResetPwd,
      ToggleCompany
    },
    created() {
      this.$store.dispatch('SearchMsgNumber')
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'userinfo',
        'messageNumber'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      },
      toMsgCenter() {
        this.$router.push({ path: '/UserCenter/MsgCenter', query: { type: '1' }})
      },
      openResetPwd() {
        this.$refs.resetPwd.open()
      },
      toggleCompany() {
        this.$refs.toggleCompany.open()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../styles/mixin";

  .navbar {
    height: 60px;
    /*line-height: 60px;*/
    border-radius: 0 !important;
    border: none;
    background: #389ef2;
    position: fixed;
    z-index: 1002;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 0 10px 0 #389ef2;
    .header-logo {
      @include displayFlex(row, center, center);
      height: 60px;
      width: 100px;
      float: left;
      img {
        height: 20px;
        cursor: pointer;
      }
    }
    .hamburger-container {
      @include displayFlex(row, center, center);
      width: 20px;
      height: 60px;
      float: left;
    }
    .menu-right {
      position: absolute;
      right: 5px;
      .menu-right-container {
        @include displayFlex(row, center, center);
        .userInfo-div {
          @include displayFlex(column, column, center);
          height: 60px;
          .user-name {
            width: 100px;
            color: white;
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .change-company {
            text-align: left;
            color: white;
            font-size: 11px;
            cursor: pointer;
          }
        }
        .avatar-container {
          @include displayFlex(row, center, center);
          height: 60px;
          margin-right: 30px;
          .avatar-wrapper {
            cursor: pointer;
            position: relative;
            .user-avatar {
              font-size: 40px;
              color: #fff;
              width: 40px;
              height: 40px;
            }
            .el-icon-caret-bottom {
              position: absolute;
              right: -10px;
              top: 30px;
              font-size: 12px;
              color: #fff;
            }
          }
        }
        .screenfull {
          @include displayFlex(row, center, center);
          margin-right: 30px;
          color: red;
        }
        .msg-container {
          @include displayFlex(row, center, center);
          height: 60px;
          margin-right: 40px;
          position: relative;
          .msg-icon {
            font-size: 20px;
            color: white;
          }
          .msg-number {
            @include displayFlex(row, center, center);
            position: absolute;
            top: 10px;
            left: 10px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            color: white;
            font-size: 14px;
            background-color: #ff5a5a;
          }
          .msg-number-max {
            width: 27px;
            border-radius: 42%;
          }
        }
        .msg-container:hover {
          cursor: pointer;
        }
        .download-text {
          color: #fff;
          font-size: 16px;
          margin-right: 30px;
          cursor: pointer;
        }
      }
    }
  }
</style>

<style lang="scss">
  @import "../../../styles/variables";
  @import "../../../styles/mixin";
  .download-app-code-box {
    .download-img {
      width: 100%;
    }
    .download-tip {
      @include displayFlex(row, center, center);
      width: 198px;
      height: 40px;
      margin-left: -12px;
      margin-bottom: -12px;
      margin-top: 10px;
      background: $--color-primary;
      color: #fff;
    }
  }
</style>

