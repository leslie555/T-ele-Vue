<template>
        <el-dialog
                title="编辑预定"
                :visible.sync="ShowEditDialog"
                width="650px"
                :append-to-body="true"
                center
          >
            <el-form :inline="true" label-width="100px" :model="formEditDatas" ref="formEditDatas" :rules="rules">
               <div class="dialog-box form-item-sm">
                   <div class="clearfix form-item-md">
                     <el-form-item label="房源名称" prop="HouseName">
                        <el-input
                            v-model="formEditDatas.HouseName"
                            auto-complete="off"
                            :disabled="true"
                        >
                        </el-input>
                    </el-form-item>
                   </div>
                   <div class="clearfix">
                     <el-form-item label="预定人姓名" prop="OrderName">
                    <el-input
                       v-model="formEditDatas.OrderName"
                      >
                    </el-input>
                </el-form-item>
                    </div>
                   <div class="clearfix">
                    <el-form-item label="预定人电话" prop="OrderPhone">
                    <el-input
                        v-model="formEditDatas.OrderPhone"
                    >
                    </el-input>
                </el-form-item>
                   </div>
                   <div class="clearfix">
                    <el-form-item label="最晚签约日" prop="LastSignDate" >
                    <el-date-picker
                            v-model="formEditDatas.LastSignDate"
                            type="date"
                            >
                    </el-date-picker>
                </el-form-item>
                    </div>
                   <div class="clearfix">
                       <el-form-item label="预定金额" prop="OrderMoney">
                        <el-input
                                v-model="formEditDatas.OrderMoney"
                                type="number"
                                v-positive="formEditDatas.OrderMoney"
                        >
                        </el-input>
                    </el-form-item>
                   </div>
                   <div class="clearfix form-item-sm">
                        <el-form-item label="约定租期">
                        <el-date-picker
                                v-model="formEditDatas.LeaseStartTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                            <span>至</span>
                        <el-date-picker v-model="formEditDatas.LeaseEndTime"
                                type="date"
                                value-format="yyyy-MM-dd">

                        </el-date-picker>
                         </el-form-item>
                   </div>
                   <div class="clearfix">
                     <el-form-item label="约定租金" prop="ConvertionMoney">
                    <el-input
                            v-model="formEditDatas.ConvertionMoney"
                            type="number"
                            v-positive="formEditDatas.ConvertionMoney"
                    >
                    </el-input>
                </el-form-item>
                    </div>
                   <div class="clearfix form-item-md">
                        <el-form-item label="备注" prop="Remark">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 3, maxRows: 12}"
                                    placeholder="请输入备注"
                                    v-model="formEditDatas.Remark"
                            >
                            </el-input>
                        </el-form-item>
                   </div>
                </div>
            </el-form>
             <div slot="footer">
                 <el-button @click="SubmitCencel">取 消</el-button>
                 <el-button type="primary" :loading="ButtonLoading" @click="SubmitRequire">确 定</el-button>
             </div>

        </el-dialog>
</template>
<script>
 import { EditOderList } from '@/api/tenant'
 import { validatePhone } from '../../../../utils/validate/rulevalidator'

    export default {
        name: 'order-list-edit',
        components: {},
        props: {
            // 父组件传过来一行的值
            formEditDatas: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                ShowEditDialog: false,
                // 表单验证
                rules: {
                    OrderName: [
                        { required: true, message: '请输入预定人姓名', trigger: 'blur' },
                         { min: 1, max: 12, message: '长度在1-12个字符之类', trigger: 'blur' }
                    ],
                    OrderPhone: [
                        { required: true, message: '请输入预定电话', trigger: 'blur' },
                         { validator: validatePhone, trigger: 'blur' }
                    ],
                    LastSignDate: [
                        { required: true, message: '请输入最晚签约日期', trigger: 'blur' }
                    ],
                    OrderMoney: [
                        { required: true, message: '请输入预订金额', trigger: 'blur' }
                    ],
                    ConvertionMoney: [
                        { required: true, message: '请输入约定租金', trigger: 'blur' }
                    ]
                },
                tableRemarkOptions: {},
                ButtonLoading: false
            }
        },
        methods: {
            // 打开子组件的窗口
            open() {
              this.ShowEditDialog = true
            },
           // 关闭子组件的窗口
           close() {
              this.ShowEditDialog = false
           },
            CloseEditDialog() {
                this.$refs['formEditDatas'].resetFields()
                this.close()
            },
            //  取消按钮
            SubmitCencel() {
                this.CloseEditDialog()
            },
            // 修改接口--ajax
            Editmark() {
                return EditOderList({
                    orderInfo: this.formEditDatas
                }).then((response) => {
                    if (response) {
                        this.$emit('UpdateDatas', this.formEditDatas)
                        this.ButtonLoading = false
                        this.CloseEditDialog()
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                    } else {
                        this.$message.error('修改失败')
                    }
                }).catch(reason => {
                    this.CloseEditDialog()
                })
            },
            // 确定按钮
            SubmitRequire() {
                this.$refs['formEditDatas'].validate((valid) => {
                    if (valid) {
                        this.ButtonLoading = true
                        this.Editmark()
                    } else {
                        this.$message({
                            message: '请填写必填项!',
                            type: 'error'
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
