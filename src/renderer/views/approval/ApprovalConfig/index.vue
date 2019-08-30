<template>
  <div>
    <div class="app-container data-list">
      <div class="panel data-list-table">
        <el-table
          :data="fiteredTableData"
          ref="multipleTable"
          v-loading.body="listLoading"
          element-loading-text="加载中"
          border
          fit
          height="100%"
          class="table-normal"
        >
          <el-table-column align="center" label="业务类型" fixed="left" width="400" prop="BusinessType"></el-table-column>
          <el-table-column align="center" label="审核人员" min-width="120" prop="Auditor"></el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="340">
            <template slot-scope="scope">
              <table-buttons
                :options="operation2button"
                :condition="scope.row.Operation"
                @handleEditClick="handleEdit(scope.$index)"
              ></table-buttons>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div>
      <EditApprovalConfig
        :editBoxVisible="EditBoxVisible"
        @edited="handleEdited"
        @close="EditBoxVisible=false"
        :editingData.sync="editingData"
      ></EditApprovalConfig>
    </div>
  </div>
</template>

<script>
import { getQueryApplyList } from '@/api/Approval'
import TableButtons from '@/components/TableButtons'
import EditApprovalConfig from './components/EditApprovalConfig.vue'
export default {
  components: {
    TableButtons,
    EditApprovalConfig
  },
  data() {
    return {
      list: [
        {
          BusinessType: '房源',
          Approver: '刘伟',
          Operation: ['Edit']
        }
      ],
      operation2button: [
        {
          key: 'Edit',
          value: '修改',
          type: 'primary'
        },
        {
          key: 'Delete',
          value: '删除',
          type: 'danger'
        }
      ],
      listLoading: false,
      EditBoxVisible: false,
      tableData: [],
      fiteredTableData: [],
      editingData: null
    }
  },
  methods: {
    handleEdit(idx) {
      this.editingData = this.tableData[idx]
      this.EditBoxVisible = true
    },
    handleEdited() {
      this.filterTableData()
    },
    /*   editConfigInfo(data) {
        const postData = { 'data': data }
        if (data.ID !== '') {
            editApprovalConfig(postData).then(item => {
                // 修改成功
                const index = this.list.findIndex(item => {
                    return item.ID === data.ID
                })
                Object.assign(this.list[index], data)
            })
        } else {
            editApprovalConfig(postData).then(item => {
                // 新增成功
                this.list.push(data)
            })
        }
      }, */
    filterTableData() {
      this.fiteredTableData = this.tableData.map(val => {
        let Auditor = ''
        if (val.AuditorDepName && val.AuditorName) {
          Auditor = val.AuditorDepName + ',' + val.AuditorName
        } else if (!val.AuditorDepName && !val.AuditorName) {
          Auditor = '暂无'
        } else {
          Auditor = val.AuditorDepName + val.AuditorName
        }
        return {
          BusinessType: this.$EnumData.getEnumDesByValue('BusinessType', val.BusinessType),
          Auditor: Auditor,
          Operation: ['Edit']
        }
      })
    }
  },
  created() {
    this.listLoading = true
    getQueryApplyList().then(res => {
      this.tableData = res.Data
      this.filterTableData()
      this.listLoading = false
    })
  }
}
</script>
