<template>
  <div>
    <el-dialog
      title="导出记录"
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
        <el-table-column align="center" label="导出时间" min-width="100" prop="ExportTime">
          <template slot-scope="scope">
             {{$dateFormat(scope.row.ExportTime, 'yyyy-MM-dd hh:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="导出人" max-width="150" prop="ExportName"></el-table-column>
        <el-table-column align="center" label="所属组织" min-width="150" prop="SysName"></el-table-column>
        <el-table-column align="center" label="操作" max-width="120">
          <template slot-scope="scope">
              <el-button type="success" plain size="mini" @click="handleDetail(scope.row)">数据详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom-tool">
      <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="GetTableData"></bottom-tool-bar>
    </div>

  </el-dialog>
  <data-list-detail-dialog ref="dataListDetailDialog"></data-list-detail-dialog>
  </div>
</template>

<script>
import { QueryDataExportRecordList } from '@/api/house'
import { BottomToolBar } from '../../../../../components' // 引入组件
import DataListDetailDialog from '../DataListDetailDialog'
export default {
  name: 'VisitRecordDialog',
  components: {
    DataListDetailDialog,
    BottomToolBar
  },
  data() {
    return {
      showFormDialog: false,
      Type: '',
      KeyID: 0,
      pageSize: 10,
      listTable: [
        {
          timeDate: '2019-12-16',
          Name: '姚江兰',
          Org: '时代店'
        }
      ],
      listLoading: false
    }
  },
  activated() {
    // this.$refs.bottomToolBar.search(1)
  },
  methods: {
    handleDetail(row) {
      this.$refs['dataListDetailDialog'].open(row)
      console.log('数据详情row:', row)
    },
    open(row) {
      this.showFormDialog = true
      this.GetTableData()
    },
    GetTableData(pages) {
      if (!pages) {
        pages = {
          size: this.pageSize,
          page: 1
        }
      }
      this.listLoading = true
      return QueryDataExportRecordList({
        parm: pages
      }).then(({ Data }) => {
        console.log(Data)
        if (Data) {
          this.listTable = Data.rows
          this.listLoading = false
        } else {
          return
        }
        return Data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-tool {
  margin-top: 20px;
}
</style>