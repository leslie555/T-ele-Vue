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
        <div>
            <el-form  :model="formInline" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item label="指派维修人员" prop="serviceman" style="justify-content: center;display: flex;">
                    <el-autocomplete
                        popper-class="my-autocomplete"
                        v-model="formInline.serviceman"
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
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
  </el-dialog>
</template>

<script>
import { ShowOrganizationSmallList } from '@/api/purchase'
  export default {
    name: 'designate',
    props: ['CategoryList'],
    data() {
        return {
            showDialog: false,
            titleSize: '指派',
            widthRange: '500px',
            state3: '',
            designate: [],
            formInline: {
                serviceman: ''
            },
             rules: {
                serviceman: [
                    { required: true, message: '请指派维修人员', trigger: 'change' }
                ]
             }
        }
    },
    mounted() {
        this.loadAll()
    },
    methods: {
        open(val) {
            this.showDialog = true
        },
        close() {
            this.showDialog = false
            this.resetForm('ruleForm')
        },
        loadAll() {
            ShowOrganizationSmallList({
                Keyword: ''
            }).then(({ Data, BusCode, Msg }) => {
                Data.forEach(val => {
                    val.value = val.CompanyName
                })
                this.designate = Data
            })
        },
        //   模糊查询下拉框选择
        handleSelect(val) {
            console.log(val)
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
        // handleIconClick(ev) {
        //     console.log(ev)
        // }
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!')
                } else {
                    console.log('error submit!!')
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        }
    }
  }
</script>

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
