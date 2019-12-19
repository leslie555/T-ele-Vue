<template>
  <div>
    <el-dialog
      title="数据详情"
      :visible.sync="showFormDialog"
      append-to-body
      width="800px"
    >
  <div>
    <el-table
      :data="listTable"
      ref="multipleTable"
      v-loading="listLoading"
      element-loading-text="加载中"
      border
      fit
      min-height="100%"
      class="table-normal"
    >
      <el-table-column align="center" label="小区" min-width="100" prop="CommunityName"></el-table-column>
      <el-table-column align="center" label="数据合计" min-width="100" prop="Number"></el-table-column>
    </el-table>
  </div>
  <div class="export-info">
    <div class="export-info-item clearfix">
      <p>导出人：{{this.rowData.ExportName}}</p>
      <p>
        <label class="export-img-title"> 导出人（签字）：</label>
        <img class="export-sign-info-img" :src="$ImgUnit.getThumbImgUrl(this.rowData.ExportSignInfo)" />
      </p>
    </div>
    <div class="export-info-item">
      <p>所属组织：{{this.rowData.SysName}}</p>
      <p>导出时间：{{$dateFormat(this.rowData.ExportTime, 'yyyy-MM-dd hh:mm:ss')}}</p>
    </div>
  </div>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'VisitRecordDialog',
  data() {
    return {
      showFormDialog: false,
      Type: '',
      KeyID: 0,
      pageSize: 10,
      listTable: [],
      rowData: {},
      listLoading: false
    }
  },
  methods: {
    open(row) {
      this.showFormDialog = true
      this.listTable = []
      this.rowData = row
      this.listTable.push({
        CommunityName: row.CommunityName,
        Number: row.Number + '条'
      })
      console.log('row:', row)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../../styles/mixin.scss';
.export-info {
  @include displayFlex(row, center, space-between);
  margin-top: 30px;
  .export-info-item {
    p {
      margin: 20px 0px;
    }
  }
  .export-img-title {
    float: left;
  }
  .export-sign-info-img {
    width: 120px;
    height: 120px;
  }
}
.export-info :nth-child(2) {
  margin-top: -55px;
}
</style>