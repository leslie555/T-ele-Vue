<template>
    <el-dialog width="400px"
               :close-on-click-modal="false"
               :center="true"
               :visible.sync="dialogFormVisible"
               :before-close="close"
               append-to-body>
        <el-form ref="form" :model="form" status-icon :rules="rules" label-width="80px">
            <div class="dialog-container form-item-sm">
                <el-form-item prop="OldPwd" label="原密码">
                    <el-input type="password" v-model="form.OldPwd" placeholder="原密码"></el-input>
                </el-form-item>
                <el-form-item prop="NewPwd" label="新密码">
                    <el-input type="password" v-model="form.NewPwd" placeholder="新密码"></el-input>
                </el-form-item>
                <el-form-item prop="ConfirmPassWord" label="再次输入">
                    <el-input type="password" v-model="form.ConfirmPassWord" placeholder="再次输入"></el-input>
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :loading="loading" type="primary" @click="submitForm('form')">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { ModifyPwd } from '../../api/usercenter'
    import { mapGetters } from 'vuex'
    import { localStorage } from '@/utils/storage'

    export default {
        data() {
            const validateOldPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入原密码'))
                } else {
                    callback()
                }
            }
            const validateNewPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'))
                } else {
                    this.$refs.form.validateField('ConfirmPassWord')
                    if (value.length > 18) {
                        callback(new Error('新密码字符个数最多为18位'))
                    } else {
                        callback()
                    }
                }
            }
            const validateConfirmPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.form.NewPwd) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                dialogFormVisible: false,
                loading: false,
                form: {
                    OldPwd: '',
                    NewPwd: '',
                    ConfirmPassWord: ''
                },
                rules: {
                    OldPwd: [
                        { validator: validateOldPass, trigger: 'blur' }
                    ],
                    NewPwd: [
                        { validator: validateNewPass, trigger: 'blur' }
                    ],
                    ConfirmPassWord: [
                        { validator: validateConfirmPass, trigger: 'blur' }
                    ]
                }
            }
        },

        computed: {
            ...mapGetters([
                'userinfo'
            ])
        },

        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        const postData = { ...this.form, 'UserID': this.userinfo.UserID, 'LoginCode': this.userinfo.LoginCode }
                        ModifyPwd(postData).then(() => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            if (this.form.NewPwd === '000000') {
                              localStorage.set('isEasyPwd', 1)
                            } else {
                              localStorage.set('isEasyPwd', 0)
                            }
                            this.$refs[formName].resetFields()
                            this.close()
                        })
                    } else {
                      this.$message.error('请注意输入格式')
                      return false
                    }
                })
            },
            open() {
                this.dialogFormVisible = true
                this.loading = false
            },
            close() {
                this.dialogFormVisible = false
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
