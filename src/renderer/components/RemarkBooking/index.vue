<template>
    <div>
        <el-dialog
                title="记一笔账"
                :visible.sync="showRemarkBooKingDialog"
                width="700px"
                :append-to-body="true"
                v-loading="loading"
                center
                @close="CloseDialog"
        >
            <el-scrollbar class="vertical-scroll">
                <el-form :inline="true" label-width="100px" style="height: 600px"
                         :model="RemarkBookingData"
                         ref="RemarkBookingData"
                         :rules="rules"
                >
                    <div class=" dialog-box form-item-sm">
                        <div class="clearfix">
                            <el-form-item label="收支类型" prop="InOrOut">
                                <el-radio-group v-model="RemarkBookingData.InOrOut" @change="changeText">
                                    <el-radio label="Collect">收入</el-radio>
                                    <el-radio label="Branch">支出</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                        <div class="clearfix">
                            <el-form-item label="房源" prop="House">
                                <el-radio-group v-model="RemarkBookingData.House" @change="ISshowHouse">
                                    <el-radio label="relativehouse">房源相关</el-radio>
                                    <el-radio label="norelativehouse">房源无关</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                        <div class="clearfix form-item-md " v-if="ShowSelf" style="margin-left: 20px">
                            <el-form-item label="" prop="HouseName" label-width="150px">
                                <el-input placeholder="房源地址" v-model="RemarkBookingData.HouseName"
                                          class="input-with-select">
                                    <el-button slot="append" icon="el-icon-search" @click="ShowSelectHouse"></el-button>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="clearfix form-item-sm">
                            <el-form-item :label=label[0] prop="value">
                                <el-select
                                        v-model='RemarkBookingData.value'
                                        placeholder='请选择项目'
                                >
                                    <el-option
                                            v-for='item in areaList'
                                            :key='item.value'
                                            :label='item.label'
                                            :value='item.value'
                                    >
                                    </el-option>
                                </el-select>
                                <el-select
                                        v-model='RemarkBookingData.value'
                                        placeholder='请选择子项目'
                                >
                                    <el-option
                                            v-for='item in areaList'
                                            :key='item.value'
                                            :label='item.label'
                                            :value='item.value'
                                    >
                                    </el-option>
                                </el-select>
                                <el-button plain size="mini" @click="TOSystem">自定义项目</el-button>
                            </el-form-item>
                        </div>
                        <div class="clearfix form-item-sm">
                            <el-form-item :label=label[1] prop="value1">
                                <el-select v-model="RemarkBookingData.PaymentWay" placeholder="请选择支付方式">
                                    <el-option
                                            v-for="item in PaymentMethod"
                                            :key="item.Value"
                                            :label="item.Description"
                                            :value="item.Value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="clearfix">
                            <el-form-item :label=label[2] prop="BillAmount">
                                <el-input
                                        placeholder="请输入收款金额"
                                        v-model="RemarkBookingData.BillAmount"
                                >
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="clearfix">
                            <el-form-item :label=label[3] prop="ActualDate">
                                <el-date-picker
                                        v-model="RemarkBookingData.ActualDate"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="clearfix">
                            <el-form-item label="凭证编号">
                                <el-input
                                        placeholder="请输入凭证编号"
                                        v-model="RemarkBookingData.BatchNo"
                                >
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="clearfix form-item-md">
                            <upload-file
                                    ref="UploadFile"
                                    title="图片凭证"
                                    :img-list="RemarkBookingData.url"
                            >
                            </upload-file>
                        </div>
                        <div class="clearfix form-item-lg">
                            <el-form-item label="备注">
                                <el-input
                                        type="textarea"
                                        placeholder="请输入备注"
                                        :autosize="{ minRows: 3, maxRows:72}"
                                        v-model="RemarkBookingData.Remark"
                                >
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </el-scrollbar>
            <div slot="footer">
                <el-button @click="SubmitSave">保 存</el-button>
                <el-button type="primary" @click="SubmitCancel">取 消</el-button>
            </div>
        </el-dialog>
        <house-select-dialog
                :visible="showHouseList"
                @closeDialog="CloseHouseSelect"
        >

        </house-select-dialog>
    </div>
</template>

<script>
  import { UploadFile } from '@/components/UploadFile'
  import HouseSelectDialog from '@/components/HouseSelectDialog'
  import { Save } from '@/api/tenant'

  export default {
    name: 'index',
    components: {
      UploadFile,
      HouseSelectDialog
    },
    // props: {
    //     showRemarkBooKingDialog: {
    //         type: Boolean,
    //         default: false
    //     }
    // },
    data() {
      return {
        showRemarkBooKingDialog: false,
        loading: false,
        ShowSelf: true, // 是否显示房源
        showHouseList: false, // 房源选择列表
        label: ['收款项目', '收款方式', '收款金额', '收款日期'],
        areaList: [
          { label: '北京', value: '北京' }
        ],
        RemarkBookingData: {
          InOrOut: 'Collect', //  收入and支出
          House: 'relativehouse', // 房源相关/不相关
          HouseName: '', // 房源名称
          value: '', // 项目联动框的值
          PaymentWay: '', // 收款方式
          BillAmount: '', // 收款金额
          ActualDate: '', // 收款日期
          BatchNo: '', // 凭证编号
          url: []
        },
        // 表单验证
        rules: {
          InOrOut: [{ required: true, message: '请选择收支方式', trigger: 'change' }],
          value: [{ required: true, message: '请选择项目', trigger: 'change' }],
          PaymentWay: [{ required: true, message: '请选择收款方式', trigger: 'change' }],
          BillAmount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
          ActualDate: [{ required: true, message: '请输入日期', trigger: 'blur' }]
        }
      }
    },
    methods: {
      CloseDialog() {
        this.$emit('CloseRemarkBookingDialog')
      },
      //  选中房源无关隐藏房源
      ISshowHouse(val) {
        if (val === 'relativehouse') {
          this.ShowSelf = true
        } else {
          this.ShowSelf = false
        }
      },
      // 点击保存
      SubmitSave() {
        this.$refs['RemarkBookingData'].validate((valid) => {
          if (valid) {
            return Save({
              params: this.RemarkBookingData
            }).then((response) => {
              if (response) {
                this.$emit('UpdateParentDatas', this.RemarkBookingData)
                this.CloseDialog()
                this.$message({
                  message: '记账成功!',
                  type: 'danger'
                })
              }
            })
          }
        })
      },
      // 点击取消
      SubmitCancel() {
        this.CloseDialog()
      },
      ShowSelectHouse() {
        this.showHouseList = true // 显示房源列表
      },
      CloseHouseSelect() {
        this.showHouseList = false // 关闭房源列表
      },
      // 改变收入支出的文本
      changeText(val) {
        if (val === 'Branch') {
          this.label = ['支出项目', '支出方式', '支出金额', '收出日期']
        } else {
          this.label = ['收款项目', '收款方式', '收款金额', '收款日期']
        }
      },
      TOSystem() {
        // 跳转到系统配置页面
        this.$router.push({ path: '/views/Service/WaterAndelectricityReading' })
      },
      open() {
        this.showRemarkBooKingDialog = true
      }
    },
    computed: {
      // 枚举支付方式(4种)
      PaymentMethod() {
        return this.$EnumData.getEnumListByKey('PaymentMethod')
      }
    }
  }
</script>

<style scoped>

</style>
