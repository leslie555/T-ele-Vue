<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="titleStatus"
    width="80%"
    append-to-body
    center
    @close="close"
  >
    <div class="settlement-box" style="max-height:700px;;overflow-y:scroll;">
        <ItemTable v-if="num === 1 || num === 2" @changeTextArea='changeTextArea'  @changeData='changeData' :ShowRenovationProject='ShowRenovationProject' :KeyID='KeyID' :Status='CGZXStatus' ref="ItemTable"></ItemTable>
        <ItemFitment v-if="num === 1 || num === 3" @changeTextArea='changeTextArea'  @changeData='changeData'  :ShowRenovationProject='ShowRenovationProject' :KeyID='KeyID' :Status='CGZXStatus' ref="ItemFitment"></ItemFitment>
        <div v-if="CGZXStatus !== 1" v-loading="BTNloading" style="display: flex;justify-content: center;">
            <el-button @click="submitC" type="primary">提交</el-button>
        </div>
    </div>
  </el-dialog>
</template>

<script>
import { SurveyedCommit, ShowRenovationProject } from '@/api/purchase'
  import ItemTable from './ItemTable'
  import ItemFitment from './ItemFitment'
  import comparisonArr from '../../utils/arrUtil/diffArr'
  export default {
    name: 'fixPurchaseSurver',
    components: {
        ItemTable,
        ItemFitment
    },
    data() {
        return {
            showDialog: false,
            // 判断是弹出的那个弹框
            num: null,
            fitmentData: [],
            purchaseData: [],
            fitmentRemark: '',
            purchaseRemark: '',
            fitmentRemarkLength: 0,
            purchaseRemarkLength: 0,
            KeyID: null,
            ShowRenovationProject: [],
            titleStatus: '',
            // 0为 可以新增  1为不能
            CGZXStatus: 0,
            BTNloading: false
        }
    },
    mounted() {
    },
    methods: {
        open(val) {
            this.showDialog = val.survey
            // 强制刷新页面
            this.num = 10
            this.$nextTick(() => {
                this.num = val.num
            })
            this.KeyID = val.KeyID
            if (val.num === 1) {
                this.titleStatus = '已勘察-（请填写装修单&采购单)'
                 this.CGZXStatus = 0
            } else if (val.num === 2) {
                this.titleStatus = '装修单'
                // 1 2 可以增删改查 状态6完成不能（其余状态可以）
                if (val.row.SheetStatus < 3) {
                    if (val.row.Status !== 6) {
                        this.CGZXStatus = 0
                    } else {
                        this.CGZXStatus = 1
                    }
                } else {
                    this.CGZXStatus = 1
                }
            } else if (val.num === 3) {
                this.titleStatus = '采购单'
                if (val.row.PurchasingtStatus < 2) {
                    if (val.row.Status !== 6) {
                        this.CGZXStatus = 0
                    } else {
                        this.CGZXStatus = 1
                    }
                } else {
                    this.CGZXStatus = 1
                }
            }
            console.log(val.row.SheetStatus, val.row.PurchasingtStatus)
            this.selectApi()
        },
        close() {
            this.showDialog = false
        },
        // 接口文本框的数据
        changeTextArea(obj) {
            // 0 装修 1采购
            if (obj.index === 0) {
                this.fitmentRemark = this.$deepCopy(obj).val
                console.log(this.fitmentRemark, 'fitmentRemark')
            } else {
                this.purchaseRemark = this.$deepCopy(obj).val
                console.log(this.purchaseRemark, 'purchaseRemark')
            }
        },
        // changeLength(obj) {
        //     if (obj.index === 0) {
        //         this.fitmentRemarkLength = this.$deepCopy(obj).length
        //     } else {
        //         this.purchaseRemarkLength = this.$deepCopy(obj).length
        //     }
        // },
        fitmentJudge() {
            let num = 0
            let switchJudge = true
            if (this.num === 1 || this.num === 2) {
                this.fitmentData.forEach(val => {
                    if (val.ModifyStatus === 3) {
                        num++
                    }
                    if (val.SupplyCommodityCategoryID === '') {
                        this.$message.error('请填写装修部门')
                        switchJudge = false
                        return
                    }
                    if (val.RenovationApplyConfigueID === '') {
                        this.$message.error('请填写项目名称')
                        switchJudge = false
                        return
                    }
                    if (val.Number === '' || val.Number === 0 || val.Number === '0') {
                        this.$message.error('请填写数量')
                        switchJudge = false
                        return
                    }
                })
                if (this.num === 2) {
                    if (num === this.fitmentData.length) {
                        this.$message.error('请填写装修列表信息')
                        switchJudge = false
                    }
                }
            }
            return switchJudge
        },
        purchaseJudge() {
            let num = 0
            let switchJudge = true
            if (this.num === 1 || this.num === 3) {
                this.purchaseData.forEach(val => {
                    if (val.ModifyStatus === 3) {
                        num++
                    }
                    if (val.SupplyCommodityCategoryID === '' || val.SupplyCommodityConfigueID === '') {
                        this.$message.error('请填写供货商')
                        switchJudge = false
                        return
                    }
                    if (val.RenovationApplyConfigueID === '') {
                        this.$message.error('请填写项目名称')
                        switchJudge = false
                        return
                    }
                    if (val.Number === '' || val.Number === 0 || val.Number === '0') {
                        this.$message.error('请填写数量')
                        switchJudge = false
                        return
                    }
                })
                if (this.num === 3) {
                    if (num === this.purchaseData.length) {
                        this.$message.error('请填写装修列表信息')
                        switchJudge = false
                    }
                }
            }
            return switchJudge
        },
        // 提交备注
        submitC() {
            var getFitmentJudge = this.fitmentJudge()
            if (!getFitmentJudge) {
                return
            }
            var getPurchaseJudge = this.purchaseJudge()
            if (!getPurchaseJudge) {
                return
            }
            const obj = {
                ZXBZ: this.fitmentRemark,
                CGBZ: this.purchaseRemark,
                CommitType: this.num,
                ZXJSON: JSON.stringify(this.fitmentData),
                CGJSON: JSON.stringify(this.purchaseData),
                RenovationApplyRecordID: this.KeyID
            }
            this.BTNloading = true
            SurveyedCommit(obj).then(({ Data, BusCode, Msg }) => {
                this.$message.success('提交成功')
                // 返回给列表 刷新页面 和关闭弹框
                this.$emit('watchSubmit', 1)
                this.showDialog = false
                this.BTNloading = false
            }).catch(() => {
                this.BTNloading = false
            })
        },
        // 下拉框的接口
        async selectApi() {
            const [project] = await Promise.all([ShowRenovationProject()])
            this.ShowRenovationProject = project.Data
        },
        changeData(data) {
            if (data.index === 0) {
                const deepNewData = this.$deepCopy(data.data)
                const deepOldData = this.$deepCopy(data.oldData)
                // deepNewData.forEach(val => {
                //     delete val.ids
                // })
                // deepOldData.forEach(val => {
                //     delete val.ids
                // })
                console.log(deepNewData, deepOldData, 'test1')
                this.fitmentData = comparisonArr(deepOldData, deepNewData, ['KeyID', 'ProjectName', 'Number', 'RenovationApplyCategoryID', 'RenovationApplyRecordID', 'SupplyCommodityCategoryID'])
                console.log(this.fitmentData, 'test2')
                return
            } else {
                const deepNewData = this.$deepCopy(data.data)
                const deepOldData = this.$deepCopy(data.oldData)
                console.log(deepNewData, deepOldData, 'test3')
                this.purchaseData = comparisonArr(deepOldData, deepNewData, ['KeyID', 'Number', 'SupplyCommodityCategoryID', 'SupplyCommodityConfigueID', 'RenovationApplyConfigueID'])
                console.log(this.purchaseData, 'test4')
            }
        }
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
  // 不兼容 火狐 和 IEs
  .settlement-box::-webkit-scrollbar {
        display: none;
    }
</style>
