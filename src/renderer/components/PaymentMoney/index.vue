<template>
    <el-dialog title="确认付款"
               :visible="SurePayMoneyVisible"
               width="500px"
               :append-to-body="true"
               center
               @close="CloseSurGetMoneyDialog"
    >
        <el-form :inline="true" label-width="100px" :model="PayMoneyform" :rules="rules" ref="PayMoneyform">
            <div class="dialog-box form-item-sm">
                <div class="clearfix">
                    <el-form-item label="收款方式" prop="PaymentWay">
                        <el-select v-model="PayMoneyform.PaymentWay" placeholder="请选择">
                            <el-option
                                label="现金"
                                value="Cash"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="付款金额" prop="Amount">
                        <el-input
                                v-model="PayMoneyform.Amount"
                                :disabled="true"
                        >
                        </el-input>
                    </el-form-item>

                </div>
                <div class="clearfix">
                    <el-form-item style="margin-left: 30px">
                        <p class ="clearfix-biaoshi">应收款总金额<b>{{this.PayMoneyform.Amount}}</b>元</p>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="付款日期" prop="GetMoneydate">
                        <el-date-picker
                                v-model="PayMoneyform.GetMoneydate"
                                type="date"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="凭证编号" prop="BatchNo">
                        <el-input
                                v-model="PayMoneyform.BatchNo"
                        >
                        </el-input>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="图片凭证">
                        <el-upload
                                class="upload-demo"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="备注" prop="Remark">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 3, maxRows: 12}"
                                placeholder="请输入备注"
                                v-model="PayMoneyform.Remark"
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
    import { OffLinePay } from '@/api/OrderList' // 确认收款接口
    export default {
        name: 'index',
        // param.type 1 租客  2业主  100预定单
        // param.cb
        // param.ContractID  付款的时候需要传入 用于反绑财务信息
        // param.data 业主的时候 传入合同信息
        props: {
            SurePayMoneyVisible: {
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
                PayMoneyform: {
                    ID: Number,
                    PaymentWay: '现金', // 支付方式
                    Amount: '', // 收款金额
                    GetMoneydate: '', // 收款日期
                    BatchNo: '', // 凭证编号
                    Remark: '' // 备注
                },
                // 表单验证规则
                rules: {
                    PaymentWay: [
                        { required: true, message: '请选择收款方式', trigger: 'blur' }
                    ],
                    Amount: [
                        // { required: true, message: '收款金额', trigger: 'blur' }
                    ],
                    GetMoneydate: [
                        { required: true, message: '请选择收款日期', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            CloseSurGetMoneyDialog() {
                this.$refs['PayMoneyform'].resetFields()
                this.$emit('CloseReceivablesDialog')
            },
            // 取消按钮
            Cancelreceivables() {
                this.CloseSurGetMoneyDialog()
            },
            // 确认收款Ajax请求--预订单
            SaveOrder() {
                return OffLinePay({
                    params: this.PayMoneyform
                    // rowsdatas: this.GetTablerowDatas 是否会传表格数据
                }).then(reponse => {
                    // to do 后端返回的数据还是状态进行判断
                    // if (response) {
                    this.updatetableFun()
                    this.CloseSurGetMoneyDialog()
                    // }
                }).catch(reason => {
                    console.log(reason)
                    this.CloseSurGetMoneyDialog()
                })
            },
            // 子组件修改了数据之后传当前条数据给父组件-预定
            updatetableFun() {
                this.$emit('UpdateParentDatas', this.PayMoneyform)
            },
            // 点击保存按钮
            Comfirmreceivables() {
                this.$refs['PayMoneyform'].validate((valid) => {
                    if (valid) {
                        if (this.type === 2) {
                            this.SaveOrder()
                            alert('我是业主付款!!')
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
                    this.PayMoneyform.Amount = newValue.Amount
                    this.PayMoneyform.ID = newValue.ID
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