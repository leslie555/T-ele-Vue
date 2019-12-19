<template>
  <el-dialog
    :visible.sync="showDialog"
    title="添加代收房东款项"
    width = "30%"
    append-to-body
    center
    @close="close"
  >
    <div class="settlement-box">
        <p class="sizeTi">*从2019年10月1日起，租客租金需拆为两部分：️代收房东；️服务费，请填写时注意。</p>
        <el-form :rules="rules" ref="ruleForm" class="demo-ruleForm" :model="ruleForm" label-width="120px">
            <el-form-item label="代收房东款项" prop="money">
                <el-input type="number" v-model="ruleForm.money" placeholder="请输入代收房东款项"></el-input>
            </el-form-item>
            <el-form-item class="addMoneyTY"  style="margin-left:65px;">
                <el-button @click="close('ruleForm')">取消</el-button>
                <el-button type="primary" @click="submitData('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'addMoney',
    data() {
        return {
            showDialog: false,
            ruleForm: {
                money: ''
            },
            rules: {
                money: [
                    { required: true, message: '请输入代收房东款项', trigger: 'blur' }
                ]
            },
            row: null
        }
    },
    mounted() {
    },
    methods: {
        open(val) {
            console.log(val)
            this.row = val.row
            this.showDialog = true
        },
        close() {
            this.showDialog = false
            this.$refs['ruleForm'].resetFields()
        },
        // 提交
        submitData() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    if (this.ruleForm.money < 0) {
                        this.$message.error('不能为负数')
                        return
                    }
                    var obj = {
                        money: this.ruleForm.money,
                        row: this.row
                    }
                    this.$emit('OnMoneyClick', obj)
                    this.close()
                }
            })
        }
    }
  }
</script>

<style lang="scss" scoped>
.sizeTi{
    color: red;
    font-size: 12px;
    margin-bottom: 30px;
    margin-left: 13px;
}
</style>
