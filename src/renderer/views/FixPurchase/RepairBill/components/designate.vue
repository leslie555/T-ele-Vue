<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="titleSize"
    :width="widthRange"
    append-to-body
    center
    @close="close"
  >
    <div class="settlement-box">
        <div v-if="num === 1">
            <el-form  :model="formInline" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item :label="nameJudge" prop="MaintainEmpID" style="justify-content: center;display: flex;">
                    <el-autocomplete
                        popper-class="my-autocomplete"
                        v-model="formInline.MaintainEmpID"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入内容"
                        @select="handleSelect">
                        <!-- <i
                            class="el-icon-edit el-input__icon"
                            slot="suffix"
                            @click="handleIconClick">
                        </i> -->
                        <template slot-scope="props">
                            <div class="name">{{ props.item.value }}</div>
                            <!-- <span class="addr">{{ props.item.address }}</span> -->
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item style="justify-content: center;display: flex;margin-top:100px;">
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="close()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div  v-if="num === 2">
            <el-form  :model="form" ref="from" class="demo-ruleForm repairBill"  status-icon>
                <el-form-item :label="nameIMG" label-width="120px">
                    <upload-file
                    ref="uploadFile"
                    :img-list="form.ImgList"
                    class="form-item-require"
                    notice="请上传照片"
                    ></upload-file>
                </el-form-item>
                <el-form-item :label="nameRemark" label-width="120px">
                    <el-input type="textarea" v-model="form.MaintainRemark"></el-input>
                </el-form-item>
                <el-form-item style="justify-content: center;display: flex;margin-top:50px;">
                    <el-button type="primary" @click="submitForm('from')">提交</el-button>
                    <el-button @click="close()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
  </el-dialog>
</template>

<script>
import { SelectPurchaseUser, EditMaintain } from '@/api/purchase'
 import { UploadFile } from '../../../../components'
  export default {
    name: 'designate',
    components: {
      UploadFile
    },
    data() {
        return {
            showDialog: false,
            titleSize: '指派',
            widthRange: '500px',
            nameJudge: '',
            nameIMG: '',
            nameRemark: '',
            designate: [],
            formInline: {
                MaintainEmpID: '',
                userID: ''
            },
             rules: null,
            num: null,
            KeyID: null,
            form: {
                ImgList: [],
                MaintainRemark: ''
            },
            bill: null,
            saveIMG: []
        }
    },
    mounted() {
        this.loadAll()
    },
    methods: {
        open(val) {
            this.showDialog = true
            this.num = val.num
            this.KeyID = val.KeyID
            this.bill = val.bill
            if (val.num === 1) {
                this.titleSize = '指派'
                this.widthRange = '500px'
                if (this.bill === 1) {
                    this.nameJudge = '指派维修人员'
                    this.rules = {
                        MaintainEmpID: [
                            { required: true, message: '请指派维修人员', trigger: 'change' }
                        ]
                    }
                } else {
                    this.nameJudge = '指派保洁人员'
                    this.rules = {
                        MaintainEmpID: [
                            { required: true, message: '请指派保洁人员', trigger: 'change' }
                        ]
                    }
                }
            } else if (val.num === 2) {
                this.titleSize = '维修完成'
                this.widthRange = '800px'
                if (this.bill === 1) {
                    this.nameIMG = '维修图片'
                    this.nameRemark = '维修备注'
                } else {
                    this.nameIMG = '保洁图片'
                    this.nameRemark = '保洁备注'
                    this.titleSize = '保洁完成'
                }
                this.form.ImgList = []
                this.form.MaintainRemark = ''
            }
        },
        close() {
            this.showDialog = false
            this.saveIMG = []
            if (this.num === 1) {
                this.resetForm('ruleForm')
            } else {
                this.resetForm('from')
            }
        },
        loadAll() {
            SelectPurchaseUser({
                Keyword: ''
            }).then(({ Data, BusCode, Msg }) => {
                Data.forEach(val => {
                    val.value = val.UserName
                })
                this.designate = Data
            })
        },
        //   模糊查询下拉框选择
        handleSelect(val) {
            console.log(val)
            this.formInline.userID = val.KeyID
        },
        //   模糊查询
        querySearch(queryString, cb) {
            console.log(this.designate)
            var designate = this.designate
            var results = queryString ? designate.filter(this.createFilter(queryString)) : designate
            // 调用 callback 返回建议列表的数据
            cb(results)
        },
        createFilter(queryString) {
            return (designate) => {
            return (designate.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
            }
        },
        submitForm(formName) {
            if (this.num === 1) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.formInline.userID === '') {
                            this.$message.error('请选择正确的指派人员')
                            return
                        }
                        if (this.bill === 1) {
                            const obj = {
                                All: {
                                    info: {
                                        KeyID: this.KeyID,
                                        State: 3,
                                        MaintainEmpID: this.formInline.userID
                                    }
                                }
                            }
                            EditMaintain(obj).then(({ Data, BusCode, Msg }) => {
                                this.$emit('refresh', 'Stock')
                                this.showDialog = false
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                })
                            })
                        } else {
                            this.showDialog = false
                            this.$emit('refresh', this.formInline.userID)
                        }
                    } else {
                        console.log('error submit!!')
                    }
                })
            } else if (this.num === 2) {
                const postData = Object.assign({}, this.form)
                postData.MaintainIDSum = this.form.ImgList.map(item => {
                    return item.KeyID
                }).join(',')
                const arr = this.deteleObject(this.$deepCopy(this.saveIMG))
                postData.MaintainImg = this.$DiffArrFn(arr, this.form.ImgList, ['KeyID'])
                if (this.bill === 1) {
                    const obj = {
                        All: {
                            info: {
                                State: 4,
                                KeyID: this.KeyID,
                                MaintainImg: postData.MaintainImg,
                                MaintainIDSum: postData.MaintainIDSum,
                                MaintainRemark: postData.MaintainRemark
                            }
                        }
                    }
                    console.log(this.form.ImgList, postData.MaintainIDSum, postData.MaintainImg, obj)
                    EditMaintain(obj).then(({ Data, BusCode, Msg }) => {
                        this.$emit('refresh', 'Stock')
                        this.showDialog = false
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        })
                    })
                } else {
                    const obj = {
                        MaintainImg: postData.MaintainImg,
                        MaintainIDSum: postData.MaintainIDSum,
                        MaintainRemark: postData.MaintainRemark
                    }
                    this.$emit('upFinish', obj)
                    this.showDialog = false
                }
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.showDialog = false
        },
        // 去重方法
        deteleObject(obj) {
             var uniques = []
            var stringify = {}
            for (var i = 0; i < obj.length; i++) {
                var keys = Object.keys(obj[i])
                keys.sort(function(a, b) {
                    return (Number(a) - Number(b))
                })
                var str = ''
                for (var j = 0; j < keys.length; j++) {
                    str += JSON.stringify(keys[j])
                    str += JSON.stringify(obj[i][keys[j]])
                }
                if (!stringify.hasOwnProperty(str)) {
                    uniques.push(obj[i])
                    stringify[str] = true
                }
            }
            return uniques
        }
    },
    watch: {
        'form.ImgList': function(val, oldVal) {
            console.log(val, oldVal)
            this.saveIMG = this.saveIMG.concat(val)
        }
    }
  }
</script>
<style lang="scss">
  .repairBill .el-form-item__content:nth-child(1){
    margin-top: -30px;
  }
</style>
<style lang="scss" scoped>
  @import "style";
  .operationAll{
      height: 80px;
      border-bottom: 1px dashed black;
    .operation{
        font-size: 14px;
        //   span :nth-child(2),span :nth-child(3){
        //       font-size: 15px;
        //       font-weight: bold;
        //   }
    }
    .operationBottom{
        margin-top: 15px;
        span{
            font-size: 16px;
            font-weight: bold;
        }
    }
  }
  .padT20{
      margin-top: 20px;
  }
    .settlement-box::-webkit-scrollbar {
        display: none;
    }
    .el-form-CanelM .el-form-item__content{
        margin-left: 0;
    }

</style>
