<template>
  <el-dialog
    width="801px"
    title="历史纪录"
    :visible.sync="historyLogVisible"
    append-to-body>
    <div class="data-list-table">
      <el-table :data="filterList"
                ref="multipleTable"
                v-loading.body="listLoading"
                element-loading-text="加载中"
                border
                fit
                height="300"
                class="table-normal">
        <el-table-column align="center" label='物品名称' width="110" prop="EquipmentName">
        </el-table-column>
        <el-table-column align="center" label='物品数量' width="90" prop="Number">
        </el-table-column>
        <el-table-column align="center" label='备注' width="120" prop="BZ">
        </el-table-column>
        <el-table-column align="center" label='操作' width="100" prop="Type">
        </el-table-column>
        <el-table-column align="center" label='操作人' width="160" prop="CreaterName">
        </el-table-column>
        <el-table-column align="center" label='操作时间' width="180" prop="CreaterTime">
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
  import { historiesLis } from '../../../../api/house'
  import { dateFormat } from '../../../../utils/dateFormat'

  export default {
    name: 'HistoryLog',

    data() {
      return {
        historyLogVisible: false,
        listLoading: false,
        list: [],
        filterList: []
      }
    },

    methods: {
      open(logData) {
        this.fetchData(logData)
        this.historyLogVisible = true
      },

      fetchData(logData) {
        this.listLoading = true
        historiesLis(logData).then(response => {
          this.list = response.Data
          this.fetchTableData()
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },

      fetchTableData() {
        this.filterList = []
        this.list.map(item => {
            this.filterList.push(this.fetchTableDataItem(item))
          }
        )
      },

      fetchTableDataItem(item) {
        return {
          EquipmentName: item.EquipmentName,
          Number: item.Number,
          BZ: item.BZ,
          Type: item.Type,
          CreaterName: item.CreaterName,
          CreaterTime: dateFormat(item.CreaterTime, 'yyyy-MM-dd hh:mm:ss')
        }
      },

      close() {
        this.historyLogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
