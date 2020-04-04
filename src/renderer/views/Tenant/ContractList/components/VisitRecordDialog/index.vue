<template>
  <div>
    <el-dialog
    title="回访记录"
    @open="handleOpen"
    @closed="handleClosed"
    :visible.sync="showFormDialog"
    append-to-body
    width="900px"
  >
  <div class="new-visit">
    <el-button type="primary" size="mini" @click="handNewVisit">新增回访</el-button>
  </div>
  <div>
      <el-table
        :data="dataTable"
        ref="multipleTable"
        v-loading="listLoading"
        element-loading-text="加载中"
        border
        fit
        min-height="100%"
        class="table-normal"
      >
        <el-table-column align="center" label="回访时间" min-width="100">
          <template slot-scope="scope">
              <span>{{$dateFormat(scope.row.CreaterTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="回访人" min-width="100" prop="CreaterName"></el-table-column>
        <el-table-column align="center" label="回访结果" min-width="100">
          <template slot-scope="scope">
              <span>{{calcHousemark(scope.row.ReturnVisitResult)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="回访备注" min-width="150" prop="Remarks"></el-table-column>
      </el-table>
    </div>
  <div slot="footer" class="dialog-footer">
      <el-button @click="close()">关闭</el-button>
    </div>
  </el-dialog>
  <new-visit-dialog ref="newVisit" @addTableInfo="addTableInfo"></new-visit-dialog>
  </div>
</template>

<script>
import NewVisitDialog from '../NewVisitDialog'
import { QueryContractReturnVisit } from '@/api/tenant'
export default {
  name: 'VisitRecordDialog',
  components: {
    NewVisitDialog
  },
  data() {
    return {
      showFormDialog: false,
      Type: '',
      KeyID: 0,
      HouseID: 0,
      pageSize: 10,
      dataTable: [],
      listLoading: false
    }
  },
  computed: {
  },
  methods: {
    handleOpen() {
    },
    handleClosed() {
    },
    handNewVisit() {
      this.$refs['newVisit'].open({
        Type: this.Type,
        KeyID: this.KeyID,
        HouseID: this.HouseID
      })
    },
    open(row) {
      this.showFormDialog = true
      // this.listLoading = true
      this.Type = row.Type
      this.KeyID = row.row.KeyID
      this.HouseID = row.row.HouseID
      // console.log('row:', row)
      if (!row.Type) {
        this.fetchData(row.Type, row.row.KeyID)
        // console.log('业主合同')
      } else {
        this.fetchData(row.Type, row.row.KeyID)
        // console.log('租客合同')
      }
    },
    fetchData(type, ID) {
      this.listLoading = true
      QueryContractReturnVisit({
        parm: { page: 1, size: this.pageSize },
        ContractID: ID, // 合同ID
        ContractType: type // 合同类型 0业主 1租客
      }).then(res => {
        if (res.Code === 0) {
          this.dataTable = res.Data.rows
        }
        this.listLoading = false
        console.log('回访记录res:', res)
      })
    },
    close() {
      this.showFormDialog = false
      console.log('close:')
    },
    calcHousemark(status) {
      const statusObj = {
        1: '违约',
        2: '续约',
        3: '退房',
        4: '不续约',
        5: '日常回访'
      }
      return statusObj[status]
    },
    addTableInfo(form, ContractID, Type) {
      this.fetchData(Type, ContractID)
      // console.log('子组件传过来的form信息:', form, ContractID, Type)
    }
  }
}
</script>

<style lang="scss" scoped>
.new-visit{
  margin-bottom: 20px
}
</style>