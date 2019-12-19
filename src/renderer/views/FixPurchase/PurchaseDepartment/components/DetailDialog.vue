<template>
  <div>
    <el-dialog title="详情" :center="true" width="800px" append-to-body :visible.sync="dialogFormVisible">
      <div class="detail-body">
        <ul class="detail-list">
          <li> <label> 房源名称: </label> <span>世豪瑞丽-7-1-809</span> </li>
          <li> <label>  地址: </label> <span>成都市高新区富华南路15号</span> </li>
          <li> <label> 业务员: </label> <span>张鑫  15266485962</span> </li>
          <li> <label> 部门: </label> <span>滨江店</span> </li>
          <li> <label> 租客: </label> <span>刘毅  15266485962</span> </li>
          <li> <label>  状态: </label> <span>已完成</span> </li>
        </ul>
        <div class="detail-content">
          <p> <label> 提交时间：</label> <span>2019-05-08</span> </p>
          <p> <label> 保洁内容: </label> <span>油烟机清洁</span> </p>
          <p> <label> 图片: </label> </p>
          <p> <label> 备注: </label> <span>世豪瑞丽-7-1-809租客周六在家，去之前提前联系</span> </p>
        </div>
        <div class="detail-info">
          <h3>保洁信息</h3>
          <ul class="detail-list">
            <li> <label>  保洁人员: </label> <span>刘力扬</span> </li>
            <li> <label>  完成时间: </label> <span>2019-08-08</span> </li>
          </ul>
          <p> <label>  保洁图片: </label>  </p>
          <p> <label>  保洁备注: </label> <span>空调灰尘堆积太多，已清洗干净</span> </p>
        </div>
        <div class="detail-step">
          <h3>保洁单进度跟踪</h3>
          <div style="height: 300px;">
            <el-steps direction="vertical" :active="1">
              <el-step title="保洁已完成">
                <template>
                  2019-05-08  16：23
                </template>
              </el-step>
              <el-step title="步骤 2"></el-step>
              <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step>
            </el-steps>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'DetailDialog',
  data() {
    return {
      dialogFormVisible: false
    }
  },
  methods: {
    open(dataList) {
      this.dialogFormVisible = true
      console.log(dataList)
    }
  }
}
</script>
<style lang="scss" scoped>
label {
  font-size: 15px;
  color: rgb(138, 138, 138)
}
p {
  // margin: 7.5px 0 7.5px;
  line-height: 30px;
}
h3 {
  margin: 20px 0 10px
}
.detail-body {
  .detail-list {
    margin-left: -40px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li {
      list-style: none;
      width: 50%;
      display: inline-block;
      margin: 7.5px 0 7.5px;
    }
  }
  .detail-content {
    padding-bottom: 15px;
    border-bottom: 1px dashed;
  }
  .detail-info {
  }
}
</style>