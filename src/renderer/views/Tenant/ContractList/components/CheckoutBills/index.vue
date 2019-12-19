<template>
  <el-dialog
    width="940px"
    append-to-body
    center
    @close="close"
    class="has-scroll"
    title="租客合同退房"
    :visible.sync="showDialog">
    <div class="checkout-bills-box">
      <el-form :inline="true" label-width="110px" style="height: 500px" ref="CheckoutBillsForm">
        <el-scrollbar class="vertical-scroll">
          <div class="dialog-box form-item-sm">
            <div class="clearfix">
              <el-form-item label="活动名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="活动区域">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-scrollbar>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer" v-if="!disabled">
      <el-button type="primary" @click="submitForm" :loading="loading">保 存</el-button>
      <el-button @click="submitCancel">取 消</el-button>
    </div>
      <bills-preview ref="billsPreview"></bills-preview>
</el-dialog>
</template>

<script>
import BillsPreview from '../BillsPreview'
export default {
  name: 'CheckoutBills',
  components: {
    BillsPreview
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      disabled: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    open(data) {
      this.showDialog = true
      console.log('data:', data)
    },
    close() {
      this.showDialog = false
      console.log('close:')
    },
    // 取消按钮
    submitCancel() {
      this.close()
    },
    // 提交按钮
    submitForm() {
      this.showDialog = false
      this.$refs['billsPreview'].open({ a: 1 })
      console.log('提交表单:')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "style";
</style>
