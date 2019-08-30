<template>
    <el-dialog
            :visible.sync="showDialog"
            :title="text+'入住人'"
            width="760px"
            append-to-body
            center
    >
        <el-form :inline="true" label-width="130px" :model="LivePeopleData"
                 ref="LivePeopleForm" :rules="rules">
            <div class="form-item-sm">
                <div class="clearfix">
                    <el-form-item label="入住人姓名" prop="LiverName">
                        <el-input
                                v-model="LivePeopleData.LiverName"
                                maxlength="10"
                                placeholder="请输入入住人姓名"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="入住人性别">
                        <el-select v-model="LivePeopleData.LiverSex" placeholder="请选择性别">
                            <el-option
                                    :label="item.Description"
                                    :value="item.Value"
                                    v-for="item in Sex"
                                    :key="item.Value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="证件类型">
                        <el-select v-model="LivePeopleData.CardType" placeholder="请选择">
                            <el-option
                                    :label="item.Description"
                                    :value="item.Value"
                                    v-for="item in CardType"
                                    :key="item.Value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="证件号码">
                        <el-input
                                v-model="LivePeopleData.CardID"
                                maxlength="18"
                                placeholder="请输入证件号码"
                        >
                        </el-input>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="手机号" prop="LiverPhone">
                        <el-input
                                v-model="LivePeopleData.LiverPhone"
                                maxlength="11"
                                placeholder="请输入手机号"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="入住日期">
                        <el-date-picker
                                v-model="LivePeopleData.LiveInDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择入住日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="紧急联系人姓名">
                        <el-input
                                v-model="LivePeopleData.EmergencyContactName"
                                maxlength="10"
                                placeholder="请输入姓名"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="紧急联系人手机号" prop="EmergencyContactPhone">
                        <el-input
                                v-model="LivePeopleData.EmergencyContactPhone"
                                maxlength="11"
                                placeholder="请输入手机号"
                        >
                        </el-input>
                    </el-form-item>
                </div>
            </div>
        </el-form>
        <div slot="footer">
            <el-button type="primary" @click="submitForm" :loading="loading">确定</el-button>
            <el-button @click="submitCancel">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { validatePhone } from '../../../../../utils/validate/rulevalidator'

  export default {
    computed: {
      Sex() {
        return this.$EnumData.getEnumListByKey('Sex')
      },
      CardType() {
        return this.$EnumData.getEnumListByKey('CardType')
      },
      text() {
        return this.type === 0 ? '添加' : '修改'
      }
    },
    data() {
      return {
        showDialog: false,
        loading: false,
        type: 0, // 0 新增 1修改
        // 表单数据
        LivePeopleData: {
          LiverName: '',
          LiverPhone: '',
          LiverSex: '',
          CardID: '',
          CardType: '',
          LiveInDate: '',
          EmergencyContactName: '',
          EmergencyContactPhone: ''
        },
        defaultData: {},
        rules: {
          LiverName: [
            { required: true, message: '请输入入住人姓名', trigger: 'blur' }
          ],
          LiverPhone: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          EmergencyContactPhone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.defaultData = Object.assign({}, this.LivePeopleData)
    },
    methods: {
      open(row) {
        this.showDialog = true
        if (row) {
          this.type = 1
          this.LivePeopleData = Object.assign({}, row)
        } else {
          this.type = 0
          this.LivePeopleData = Object.assign({}, this.defaultData)
        }
        this.$nextTick(() => {
          this.$refs['LivePeopleForm'].clearValidate()
        })
      },
      close() {
        this.showDialog = false
      },
      // 租客合同模拟调接口的方法
      submitForm() {
        this.$refs['LivePeopleForm'].validate().then(() => {
          this.$message.success(this.text + '成功')
          this.updateTableFun()
        }).catch(() => {
          this.$message.error('请完善表单必填项!')
        })
      },
      // 完成结算之后把当前表单的数据传递给父组件
      updateTableFun() {
        this.close()
        this.$emit('success', this.LivePeopleData)
      },
      // 取消按钮
      submitCancel() {
        this.close()
      }
    }
  }
</script>

<style lang="scss" scoped>
    @import "style";
</style>
