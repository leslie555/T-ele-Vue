<template>
  <div class="login-bg-wrap">
    <div class="login-container">
      <div class="left-insert"></div>
      <div class="login-form-container">
        <div class="login-form-header">
          <div class="logo-png"></div>
          <p class="header-title">公寓运营服务云平台</p>
        </div>
        <div class="login-form-content" @keyup.enter="handleLogin">
          <el-form
            :model="loginForm"
            :rules="loginRules"
            ref="loginForm"
            label-position="left"
            label-width="40px"
            :hide-required-asterisk="true"
            class="login-form-input-wrap"
          >
            <el-form-item prop="username">
              <template slot="label">
                <i class="iconfont icon-yezhu" style="fontSize: 20px"></i>
              </template>
              <el-input
                v-model="loginForm.username"
                :maxlength="20"
                placeholder="请输入手机号"
                class="login-form-input"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <template slot="label">
                <i class="iconfont icon-web__shezhimima"></i>
              </template>
              <el-input
                type="password"
                v-model="loginForm.password"
                placeholder="请输入密码"
                class="login-form-input"
                :maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                @click="handleLogin"
                class="login-form-input login-form-button"
              >登录
              </el-button>
            </el-form-item>
            <a :href="download" download class="download-pc">
              <el-button type="text" v-show="browser" class="download-btn">下载PC端</el-button>
            </a>
          </el-form>
        </div>
      </div>
    </div>
    <div class="copyright">Copyright ©2018 51tanwo.com版权所有 蜀 ICP 备 18031569 号</div>
  </div>
</template>

<script>
  // import { ipcRenderer } from 'electron' // 发布为web的时候注释掉
  import { downloadUrl } from '../../config'
  import packageJson from '../../../../package'
  import { localStorage } from '../../utils/storage'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        // console.log('2222', rule, value, callback)
        if (value === '') {
          callback(new Error('账号不能为空'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: ''
        },
        browser: process.browser,
        loginRules: {
          username: [{ trigger: 'blur', validator: validateUsername }],
          password: [{ trigger: 'blur', validator: validatePass }]
        },
        loading: false,
        download: `${downloadUrl}弹窝 Setup ${packageJson.version}.exe`
      }
    },
    mounted() {
      // 发布为web的时候注释掉
      this.$nextTick(() => {
        // ipcRenderer.send('checkForUpdate')
      })
    },
    methods: {
      handleLogin() {
        if (this.loading) return
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store
              .dispatch('Login', this.loginForm)
              .then(() => {
                const mark = 'showAppDownLoad_' + this.loginForm.username
                if (!localStorage.get(mark)) { // 0 或者没有 表示可以设置为显示  1 显示 2 不再显示
                  localStorage.set(mark, 1)
                }
                // this.loading = false
                const prevPath = this.$store.getters.prevPath
                if (prevPath) {
                  this.$router.push(prevPath)
                } else {
                  this.$router.push({ path: '/' })
                }
                // 获取枚举类型数据
                this.$store.dispatch('GetEnumList')
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "style";
</style>
