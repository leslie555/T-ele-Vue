<template>
  <el-dialog title="切换公司" width="400px" :center="true" :visible.sync="dialogFormVisible"
             append-to-body>
    <el-form class="toggle-form" ref="form" :model="form" status-icon inline>
      <div class="dialog-container form-item-sm">
        <el-form-item label="选择公司" prop="Company">
          <el-select v-model="form.Company" placeholder="请选择" value="">
            <el-option
              v-for="item in companyList"
              :key="item.KeyID"
              :label="item.CompanyName"
              :value="item.KeyID">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="onSubmit">保存</el-button>
      <el-button type="primary" @click="cancleSubmit">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { cookieStorage, localStorage, sessionStorage } from '@/utils/storage'
  import { SelectEmpCom, LoginCut } from '../../api/usercenter'

  export default {
    name: 'ToggleCompany',
    data() {
      return {
        dialogFormVisible: false,
        loading: false,
        companyList: [],
        form: {
          Company: ''
        },
        userInfo: {}
      }
    },
    computed: {
      ...mapGetters([
        'userinfo'
      ])
    },
    methods: {
      open() {
        SelectEmpCom().then(res => {
          this.companyList = res.Data
          this.form.Company = this.userinfo.CompanyID
          this.loading = false
          this.dialogFormVisible = true
        }).catch(() => {
          this.loading = false
          this.dialogFormVisible = true
        })
      },
      cancleSubmit() {
        this.close()
      },
      onSubmit() {
        const postData = { UserID: this.userinfo.UserID, CompanyID: this.form.Company }
        LoginCut(postData).then(res => {
          if (res) {
            this.clearCache()
            const data = res.Data
            try {
              data.Module = data.jurisdic.Data.Module
              data.Action = data.jurisdic.Data.Action
              data.CompanyInfo = data.jurisdic.Data.CompanyInfo
              delete data.jurisdic
            } catch (error) {
              data.Module = []
              data.Action = []
              data.CompanyInfo = []
            }
            this.setCache(data)
            this.$message.success('切换成功')
            this.close()
            // 关闭全部标签页，跳转到首页
            this.$store.dispatch('delAllViews')
            this.$router.push('/')
          }
        })
      },
      clearCache() {
        // 移除个人缓存信息及token
        this.$store.commit('SET_TOKEN', '')
        this.$store.commit('SET_USERINFO', {})
        this.$store.commit('SET_PREVPATH', '')
        cookieStorage.remove('token')
        localStorage.remove('userinfo')
        sessionStorage.remove('prevPath')
      },
      setCache(data) {
        // 重新缓存个人信息及token
        this.$store.commit('SET_TOKEN', data.Token)
        this.$store.commit('SET_USERINFO', data)
        this.$store.commit('SET_LOGOUTALERTED', true)
        cookieStorage.set('token', data.Token, 7)
        localStorage.set('userinfo', data)
        sessionStorage.set('prevPath', '')
      },
      close() {
        this.dialogFormVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .toggle-form {
    height: 150px;
  }
</style>
