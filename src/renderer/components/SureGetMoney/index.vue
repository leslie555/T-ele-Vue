<template>
    <el-dialog title="确认收款"
               :visible="SureGetMoneyVisible"
               width="650px"
               :append-to-body="true"
               center
               @close="CloseSurGetMoneyDialog"
               v-loading="loading"
    >
        <el-form :inline="true" label-width="100px" :model="GetMoneyform" :rules="rules" ref="GetMoneyform">
            <div class="dialog-box form-item-sm">
                <div class="clearfix">
                    <el-form-item label="收款方式" prop="PaymentWay">
                        <el-select v-model="GetMoneyform.PaymentWay" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                         </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="收款金额" prop="Amount">
                        <el-input
                                v-model="GetMoneyform.Amount"
                                :disabled="true"
                        >
                        </el-input>
                    </el-form-item>

                </div>
                <div class="clearfix">
                    <el-form-item style="margin-left: 30px">
                        <p class ="clearfix-biaoshi">应收款总金额<b>{{this.GetMoneyform.Amount}}</b>元</p>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="收款日期" prop="GetMoneydate">
                        <el-date-picker
                                v-model="GetMoneyform.GetMoneydate"
                                type="date"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="凭证编号" prop="BatchNo">
                        <el-input
                                v-model="GetMoneyform.BatchNo"
                        >
                        </el-input>
                    </el-form-item>
                </div>
                <div class="clearfix form-item-md">
                    <el-form-item label="图片凭证">
                        <upload-file ref="UploadFile"></upload-file>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="备注" prop="Remark">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 3, maxRows: 12}"
                                placeholder="请输入备注"
                                v-model="GetMoneyform.Remark"
                        >
                        </el-input>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item style="text-align: center; width: 100%;">
                        <el-button @click="Cancelreceivables">取 消</el-button>
                        <el-button type="primary"
                                   @click="Comfirmreceivables"
                        >
                            保 存
                        </el-button>
                    </el-form-item>
                </div>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
     import { SureGetTheMoney, Receivables } from '@/api/tenant' // 确认收款接口
    import { UploadFile } from '@/components/UploadFile'

    export default {
        name: 'index',
        // param.type 1 租客  2业主  100预定单
        // param.cb
        // param.ContractID  付款的时候需要传入 用于反绑财务信息
        // param.data 业主的时候 传入合同信息
        components: {
            UploadFile
        },
        props: {
            SureGetMoneyVisible: {
                type: Boolean,
                default: false
            },
            GetTablerowDatas: {
                type: Object,
                default: {}
            },
            type: {
                type: Number
            }
        },
        data() {
            return {
                GetMoneyform: {
                    ID: Number,
                    PaymentWay: '', // 支付方式
                    Amount: '', // 收款金额
                    GetMoneydate: '', // 收款日期
                    BatchNo: '', // 凭证编号
                    Remark: '' // 备注
                },
                loading: false,
                options: [{
                    value: 'WeChat',
                    label: '微信'
                }, {
                    value: 'Alipay',
                    label: '支付宝'
                }, {
                    value: 'UnionPay',
                    label: '银联'
                }, {
                    value: 'Cash',
                    label: '现金'
                }],
                // 表单验证规则
                rules: {
                    PaymentWay: [
                        { required: true, message: '请选择收款方式', trigger: 'change' }
                    ],
                    GetMoneydate: [
                        { required: true, message: '请选择收款日期', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            CloseSurGetMoneyDialog() {
                this.$refs['GetMoneyform'].resetFields()
                this.$emit('CloseReceivablesDialog')
            },
            // 取消按钮
            Cancelreceivables() {
                this.CloseSurGetMoneyDialog()
            },
            // 确认收款Ajax请求--预订单
            SaveOrder() {
                return SureGetTheMoney({
                    params: this.GetMoneyform
                    // rowsdatas: this.GetTablerowDatas 是否会传表格数据
                }).then((reponse) => {
                    // to do 后端返回的数据还是状态进行判断
                     if (reponse) {
                    this.updatetableFun()
                    this.CloseSurGetMoneyDialog()
                  } else {
                     this.$message({
                         message: '收款失败',
                         type: 'danger'
                     })
                   }
                }).catch(reason => {
                    // console.log(reason)
                    this.CloseSurGetMoneyDialog()
                })
            },
            // 确认收款ajax请求---租客
            SaveTenantReceivables() {
                return Receivables({
                    params: this.GetMoneyform
                }).then(() => {
                    this.UpdateDatasfun()
                    this.CloseSurGetMoneyDialog()
                })
            },
            // 子组件修改了数据之后传当前条数据给父组件-预定
            updatetableFun() {
                this.$emit('UpdateParentDatas', this.GetMoneyform)
            },
            // 点击确定按钮
            Comfirmreceivables() {
                this.$refs['GetMoneyform'].validate((valid) => {
                    if (valid) {
                        // console.log(1, this.GetMoneyform)
                        if (this.type === 100) {
                            this.SaveOrder()
                            alert('我是预定单!!')
                        } else {
                            if (this.type === 1) {
                                this.SaveTenantReceivables()
                                alert('我是租客收款')
                            }
                            this.$message({
                                message: '收款成功',
                                type: 'success'
                            })
                        }
                    } else {
                        this.$message.error('请正确填写内容')
                        return false
                    }
                })
            }
        },
        watch: {
            GetTablerowDatas: {
                handler(newValue, oldValue) {
                    // console.log(newValue, oldValue)
                    this.GetMoneyform.Amount = this.type === 100 ? newValue.OrderMoney : newValue.Amount
                    this.GetMoneyform.ID = this.type === 100 ? newValue.ID : newValue.ID
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .clearfix-biaoshi:before{
        content: "*";
        color: red;
    }
</style>