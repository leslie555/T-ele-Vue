<template>
  <div class="app-container data-list">
      <search-panel :model="searchForm" ref="ruleForm" label-width="80px">
        <template slot="search">
          <el-form-item label="房源名称">
            <el-input
              v-model="searchForm.HouseName"
              autocomplete="off"
              placeholder="请输入房源名称"
              style="width: 150px"
            ></el-input>
          </el-form-item>      
          <el-form-item label="保洁状态">
            <el-select v-model="searchForm.State" placeholder="请选择" style="width: 150px;">
              <el-option
                v-for="item in CleanState"
                :key="item.StateValue"
                :label="item.StateLabel"
                :value="item.StateValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提交时间">
            <div class="block">
              <el-date-picker
                v-model="searchForm.SubmitTime"
                type="daterange"
                align="right"
                :default-time="['00:00:00', '23:59:59']"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </el-form-item>            
        </template>
        <template slot="button">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" @click="openAddForm(0)">新增</el-button>
        </template>
      </search-panel>
      <div class="panel data-list-table">
        <el-table
          :data="tableData"
          v-loading.body="listLoading"
          element-loading-text="加载中"
          border
          fit
          height="100%"
          class="table-normal"
        >
          <el-table-column label="房源名称" align="center" width="220" prop="HouseName"></el-table-column>
          <el-table-column label="地址" align="center" prop="Location" width="320"></el-table-column>
          <el-table-column label="保洁内容" align="center" width="100" prop="CleaningContent">
            <template slot-scope="scope">
              {{ scope.row.CleaningContent.length > 5 ? `${scope.row.CleaningContent.slice(0, 5)}...` : (scope.row.CleaningContent || "")}}
            </template>
          </el-table-column>
          <el-table-column label="租客信息" align="center"  width="170">
            <template slot-scope="scope">
              <p>{{ `${scope.row.TenName || ""} ${scope.row.TenPhone || ""}` }}</p> 
            </template>
          </el-table-column>
          <el-table-column label="业务员" align="center"  width="170">
            <template slot-scope="scope">
              <p>{{ `${scope.row.UserName || ""} ${scope.row.Phone || ""}` }}</p> 
            </template>
          </el-table-column>
          <el-table-column label="组织" align="center" prop="CompanyName" width="140"></el-table-column>
          <el-table-column label="提交时间" align="center" width="120">
            <template slot-scope="scope">
              {{ $dateFormat(scope.row.ReviewedCommitTime) || "" }}
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" width="120">
            <template slot-scope="scope">
              {{ scope.row.Remark&&scope.row.Remark.length > 5 ? `${scope.row.Remark.slice(0, 5)}...` : (scope.row.Remark || "") }}
            </template>            
          </el-table-column>
          <el-table-column label="状态" align="center" width="90">
            <template slot-scope="scope">
              {{ $EnumData.getEnumDesByValue("CleaningState", scope.row.State) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  width="304">
            <template slot-scope="scope">
              <table-buttons
                :options="operationList"
                :condition="scope.row.Operations"
                @handleDetailClick="handleDetail(scope.row)"
                @handleDeleteClick="handleDelete(scope.row)"
                @handleWithdrawnClick="handleWithdrawn(scope.row)"
                @handleCommitClick="handleCommit(scope.row)"
                @handleUpdateClick="handleUpdate(scope.row)"
              ></table-buttons>
          </template>
          </el-table-column>
        </el-table>
      </div>
      <bottom-tool-bar
        ref="bottomToolBar"
        :page-size="pageSize"
        :handlePageChange="fetchData"
        style="text-align: right"
      ></bottom-tool-bar>
    <edit-clean-item ref="AddForm" @success="EditNewData" :busType="busType"></edit-clean-item>
    </div>
</template>

<script>
import { SearchPanel, BottomToolBar, TableButtons } from '@/components'
import EditCleanItem from './components/EditCleanItem'
import { SelectCleaningApplyList, DeleteCleaningApply, WithdrawCleaningApply, CommitCleaningApply } from '@/api/service'

export default {
  name: 'CleanApplyList',
  components: {
    SearchPanel,
    BottomToolBar,
    EditCleanItem,
    TableButtons
  },
  data() {
    return {
      pageSize: 10,
      listLoading: false,
      isShowSelect: true,
      list: [],
      tableData: [],
      CleanState: [
        {
          StateLabel: '全部',
          StateValue: 0
        },
        {
          StateLabel: '暂存',
          StateValue: 1
        },
        {
          StateLabel: '待指派',
          StateValue: 2
        },
        {
          StateLabel: '待处理',
          StateValue: 3
        },
        {
          StateLabel: '已完成',
          StateValue: 4
        },
        {
          StateLabel: '待审批（经理）',
          StateValue: 5
        },
        {
          StateLabel: '待审批（采购部）',
          StateValue: 6
        }
      ],
      operationList: [
        {
          key: 'Detail',
          value: '详情',
          type: 'primary'
        },
        {
          key: 'Withdrawn',
          value: '撤回',
          type: 'primary'
        },
        {
          key: 'Commit',
          value: '提交',
          type: 'primary'
        },
        {
          key: 'Update',
          value: '修改',
          type: 'primary'
        },
        {
          key: 'Delete',
          value: '删除',
          type: 'danger'
        }
      ],
      searchForm: {
        HouseName: '',
        State: 0,
        SubmitTime: ['', '']
      },
      busType: 1
    }
  },
  activated() {
    this.$refs.bottomToolBar.search(1)
  },
  methods: {
    fetchData(pages) {
      if (!pages) {
        pages = {
          size: this.pageSize,
          page: 1
        }
      }
      this.listLoading = true
      return SelectCleaningApplyList({
        parm: pages,
        HouseName: this.searchForm.HouseName,
        State: this.searchForm.State,
        StartTime: this.searchForm.SubmitTime[0],
        EndTime: this.searchForm.SubmitTime[1]
      }).then(response => {
        if (response.Code === 0) {
          if (response.Data && response.Data.rows) {
            this.list = [...response.Data.rows]
            this.tableData = this.filterTableData(response.Data.rows)
          }
          this.listLoading = false
          return response.Data
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.listLoading = false
      })
    },
    search() {
      this.$refs.bottomToolBar.search()
    },
    reset() {
      this.searchForm.HouseName = ''
      this.searchForm.State = 0
      this.searchForm.SubmitTime = ['', '']
      this.$refs.bottomToolBar.search()
    },
    openAddForm(type, data = {}) {
      this.$refs.AddForm.open({ type, data })
    },
    EditNewData({ data, editType, busType }) {
      // const cloneData = Object.assign({}, data)
      // if (busType === 1) {
      //   if (editType === 0) {
      //     this.list.unshift(cloneData)
      //     data = this.filterOperation(data)
      //     this.tableData.unshift(data)
      //   } else {
      //     const index = this.list.findIndex(v => v.KeyID === data.KeyID)
      //     this.list.splice(index, 1, cloneData)
      //     data = this.filterOperation(data)
      //     this.tableData.splice(index, 1, data)
      //   }
      this.fetchData()
    },
    filterTableData(rows) {
      return rows.map(row => this.filterOperation(row))
    },
    filterOperation(row) {
      let Operations = []
        if (row.State === 1) {
          Operations = ['Detail', 'Update', 'Delete', 'Commit']
        } else if (row.State === 5 || row.State === 2 || row.State === 6) {
          Operations = ['Detail', 'Withdrawn']
        } else {
          Operations = ['Detail']
        }
      return {
        ...row,
        Operations
      }
    },
    handleUpdate(row) {
      const data = this.list.find(v => v.KeyID === row.KeyID)
      this.openAddForm(1, data)
    },
    handleCommit(row) {
      this.$confirm('确定要提交保洁申请吗？', '提示').then(() => {
        CommitCleaningApply({
          KeyID: row.KeyID,
          type: 1
        }).then(() => {
          // const index = this.tableData.findIndex(v => v.KeyID === row.KeyID)
          // row.State = 5
          // row = this.filterOperation(row)
          // this.tableData.splice(index, 1, row)
          this.fetchData()
          this.$message.success('提交成功')
        })
      })
    },
    handleWithdrawn(row) {
      this.$confirm('确定要撤回保洁申请吗？', '提示').then(() => {
        WithdrawCleaningApply({
          KeyID: row.KeyID
        }).then((res) => {
          // const index = this.tableData.findIndex(v => v.KeyID === row.KeyID)
          // row.State = 1
          // row = this.filterOperation(row)
          // this.tableData.splice(index, 1, row)
          this.fetchData()
          this.$message.success('撤回成功')
        })
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除该保洁申请？', '提示').then(() => {
        DeleteCleaningApply({
          KeyID: row.KeyID
        }).then(() => {
          const index = this.tableData.findIndex(v => v.KeyID === row.KeyID)
          this.tableData.splice(index, 1)
          this.$message.success('删除成功')
        })
      })
    },
    handleDetail(row) {
      this.$router.push({
        path: '/FixPurchase/CleaningPaperDetail',
        query: {
          KeyID: row.KeyID
        }
      })
    }
  }
}
</script>

<style lang="scss">
.data-list-tab-inline {
  top: 120px;
}
</style>
