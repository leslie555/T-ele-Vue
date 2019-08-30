<template>
  <el-dialog
    :visible.sync="showDialog"
    title="已勘察-（请填写装修单&采购单)"
    width="80%"
    append-to-body
    center
    @close="close"
  >
    <div class="settlement-box" style="max-height:700px;;overflow-y:scroll;">
        <ItemTable v-if="num === 1 || num === 2" @changeTextArea='changeTextArea' @changeLength='changeLength' :KeyID='KeyID' ref="ItemTable"></ItemTable>
        <ItemFitment v-if="num === 1 || num === 3" @changeTextArea='changeTextArea' @changeLength='changeLength' :KeyID='KeyID' ref="ItemFitment"></ItemFitment>
        <div style="display: flex;justify-content: center;">
            <el-button @click="submitC" type="primary">提交</el-button>
        </div>
    </div>
  </el-dialog>
</template>

<script>
import { SurveyedCommit } from '@/api/purchase'
  import ItemTable from './ItemTable'
  import ItemFitment from './ItemFitment'
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
            fitmentRemark: '',
            purchaseRemark: '',
            fitmentRemarkLength: 0,
            purchaseRemarkLength: 0,
            KeyID: null
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
        changeLength(obj) {
            if (obj.index === 0) {
                this.fitmentRemarkLength = this.$deepCopy(obj).length
            } else {
                this.purchaseRemarkLength = this.$deepCopy(obj).length
            }
        },
        // 提交备注
        submitC() {
            console.log(this.fitmentRemarkLength, this.purchaseRemarkLength)
            if (this.fitmentRemarkLength === 0) {
                this.fitmentRemark = ''
            }
            if (this.purchaseRemarkLength === 0) {
                this.fitmentRemark = ''
            }
            const obj = {
                ZXBZ: this.fitmentRemark,
                CGBZ: this.purchaseRemark,
                CommitType: this.num,
                RenovationApplyRecordID: this.KeyID
            }
            SurveyedCommit(obj).then(({ Data, BusCode, Msg }) => {
                this.$message.success('提交成功')
                // 返回给列表 刷新页面 和关闭弹框
                this.$emit('watchSubmit', 1)
                this.showDialog = false
            })
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
