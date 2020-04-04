<template>
  <el-dialog
    title="涉密数据管理办法"
    :visible.sync="showDatalog"
    append-to-body
    width="620px"
  >
    <div class="data-header">
      成都弹个房科技有限公司 涉密数据管理办法
    </div>
    <div class="data-content">
      <p>为保守公司机密，维护公司安全和利益，规范和加强数据泄密查处工作，对匿名举报、实名举报、检查发现的涉嫌泄露公司数据机密的线索，依法调查或者移交公安机关调查处理，制定本办法。</p>
      <p>本办法所称“泄露公司秘密”包括但不限于下列行为：</p>
      <p>（一）使公司数据机密被不应知悉者知悉的；</p>
      <p>（二）使公司数据机密超出了限定的接触范围，而不能证明未被不应知悉者知悉的</p>
      <p>（三）通过任何形式泄露“弹窝”系统上的任何数据。</p>
      <p>本办法由成都弹个房科技有限公司负责解释。 本办法自2018年1月1日起施行。</p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ManageDataDialog',
  data() {
    return {
      showDatalog: false
    }
  },
  methods: {
    open() {
      this.showDatalog = true
    },
    close() {
      this.showDatalog = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .data-header {
    margin: 0 auto;
    text-align: center;
    height: 36px;
    width: 180px;
    line-height: 20px;
    margin-bottom: 41px;
    margin-top: 31px;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
  }
  .data-content {
    font-size: 14px;
    color: #444444;
    line-height: 23px;
  }
</style>
