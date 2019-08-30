<template>
  <div class="app-container data-list">
      <search-panel :model="fixApplyForm" ref="ruleForm" label-width="80px">
        <template slot="search">
          <el-form-item label="房源名称">
            <el-input
              v-model="fixApplyForm.HouseName"
              autocomplete="off"
              placeholder="请输入房源名称"
              style="width: 150px"
            ></el-input>
          </el-form-item>
          <template v-if="isCompanyLeader">
            <el-form-item label="业务员">
              <el-input
                v-model="fixApplyForm.salesManInfo"
                autocomplete="off"
                placeholder="姓名/电话"
                style="width: 150px"
              ></el-input>
            </el-form-item>
          </template>
          <el-form-item label="装修状态">
            <el-select v-model="fixApplyForm.Status" placeholder="请选择" style="width: 150px;">
              <el-option
                v-for="item in filterFix_status"
                :key="item.StatusValue"
                :label="item.StatusLabel"
                :value="item.StatusValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="button">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <template v-if="!isCompanyLeader">
            <el-button type="primary" @click="openAddForm(1)">新增</el-button>
          </template>
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
          <el-table-column label="房源名称" align="center" width="300">
            <template slot-scope="{ row }">
              {{ row.HouseName }}
            </template>
          </el-table-column>
          <el-table-column label="地址" align="center" prop="Location" width="400"></el-table-column>
          <el-table-column label="产权面积" align="center" width="100">
            <template slot-scope="scope">{{ scope.row.RoomArea }}</template>
          </el-table-column>
          <el-table-column label="业务员" align="center"  width="200">
            <template slot-scope="{ row }">
            <p>{{ row.Salesman }}</p> 
            </template>
          </el-table-column>
          <el-table-column label="部门" align="center" prop="CompanyName" width="100"></el-table-column>
          <el-table-column label="钥匙位置" align="center" prop="KeyLocation" width="100"></el-table-column>
          <el-table-column label="提交时间" align="center" prop="CreaterTime" width="120">
            <template slot-scope="{ row }">
              {{ $dateFormat(row.CreaterTime)  }}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="120">
            <template slot-scope="{ row }">
              {{ $EnumData.getEnumDesByValue("RenovationApplyRecord", row.Status) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  width="300">
            <template slot-scope="scope">
              <el-button
                v-for="(o, i) in filterOperation(scope.row).Operations"
                :key="i + ''"
                :type="o.type"
                plain
                size="mini" 
                @click="open(o.key, scope.row)">{{ o.value }}</el-button>
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
    <add-form ref="AddForm" @AddNewData="AddNewData" @EditNewData="EditNewData"></add-form>
    <approval-form ref="excuteAudit" @approval="handleAudit"></approval-form>
    </div>
</template>

<script>
import { SearchPanel, BottomToolBar } from '@/components'
// import { CityData } from '@/utils/CityData'
import { SelectRenovationApplyList, SubmitRenovationApplication, DeleteRenovationApplication, WithdrawRenovationApplication } from '@/api/House'
// import { getAllEnumData } from '@/api/system'
import addForm from './components/addForm'
import approvalForm from './components/approvalForm'
export default {
  name: 'RenovationApply',
  components: {
    SearchPanel,
    BottomToolBar,
    addForm,
    approvalForm
  },
  data() {
    return {
      pageSize: 10,
      listLoading: false,
      isShowSelect: true,
      list: [],
      tableData: [],
      // isCompanyLeader: false,
      fix_status: [
        {
          StatusLabel: '全部',
          StatusValue: 0
        },
        {
          StatusLabel: '暂存',
          StatusValue: 1
        },
        {
          StatusLabel: '待审批(经理)',
          StatusValue: 2
        },
        {
          StatusLabel: '待勘察(采购部)',
          StatusValue: 3
        },
        {
          StatusLabel: '已勘察',
          StatusValue: 4
        },
        {
          StatusLabel: '装修中',
          StatusValue: 5
        },
        {
          StatusLabel: '装修结束',
          StatusValue: 6
        }
      ],
      operations_list: [
        {
          key: 'Approval',
          value: '审批',
          type: 'primary'
        },
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
      fixApplyForm: {
        HouseName: '',
        Status: ''
      },
      handle: {}
    }
  },
  computed: {
    isCompanyLeader: function() {
      return this.$store.getters.userinfo.IsCompanyLeader
    },
    filterFix_status: function() {
      if (this.isCompanyLeader) {
        return this.fix_status.filter(v => v.StatusValue !== 1)
      }
      return this.fix_status
    }
  },
  created() {
    const keys = ['Approval', 'Detail', 'Update', 'Delete', 'Commit', 'Withdrawn']
    keys.map(v => {
      this.handle[v] = this[v]
    })
    // console.log('this.$store :', this.$store)
    // console.log('this.isCompanyLeader :', this.isCompanyLeader)
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
      return SelectRenovationApplyList({
        parm: pages,
        HouseName: this.fixApplyForm.HouseName,
        Status: this.fixApplyForm.Status,
        Salesman: this.isCompanyLeader ? this.fixApplyForm.Salesman : ''
      }).then(response => {
        if (response.Code === 0) {
          if (response.Data && response.Data.rows) {
            this.list = response.Data.rows
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
      this.fixApplyForm.HouseName = ''
      this.fixApplyForm.Status = 0
      this.fixApplyForm.Salesman = ''
      this.$refs.bottomToolBar.search()
    },
    openAddForm(type, data) {
      if (type === 1) {
        this.$refs.AddForm.open(type)
      } else {
        this.$refs.AddForm.open(type, data)
      }
    },
    AddNewData(data) {
      this.tableData.unshift(data)
    },
    EditNewData(data, status) {
      const index = this.tableData.findIndex(v => v.KeyID === data.KeyID)
      this.tableData[index] = data
    },
    handleAudit(KeyID, type) {
      const index = this.tableData.findIndex(v => v.KeyID === KeyID)
      if (type === 0) {
        this.tableData.splice(index, 1)
      } else if (type === 1) {
        debugger
        const data = { ...this.tableData[index] }
        data.Status = 3
        this.tableData.splice(index, 1, data)
      }
    },
    filterOperation(row) {
      let Operations = []
      if (!this.isCompanyLeader) {
        if (row.Status === 1) {
          Operations = this.operations_list.slice(3)
        } else if (row.Status === 2 || row.Status === 3) {
          Operations.push(this.operations_list[1])
          Operations.push(this.operations_list[2])
        } else if ([4, 5, 6].indexOf(row.Status) !== -1) {
          Operations.push(this.operations_list[1])
        }
      } else if (this.isCompanyLeader) {
        if (row.Status === 2) {
          Operations.push(this.operations_list[1])
          Operations.push(this.operations_list[0])
        } else {
          Operations.push(this.operations_list[1])
        }
      }
      return {
        ...row,
        Operations
      }
    },
    filterTableData(rows) {
      if (this.isCompanyLeader) {
        return rows.filter(v => v.Status !== 1)
      }
      return rows
    },
    Update(row) {
      this.openAddForm(2, row)
    },
    Commit(row) {
      this.$confirm('确定要提交装修申请吗？', '提示').then(() => {
        SubmitRenovationApplication({
          KeyID: row.KeyID,
          OperationStatus: 1
        }).then(() => {
          const index = this.tableData.findIndex(v => v.KeyID === row.KeyID)
          row.Status = 2
          this.tableData[index] = row
          this.$message.success('提交成功')
        })
      })
    },
    Withdrawn(row) {
      this.$confirm('确定要撤回装修申请吗？', '提示').then(() => {
        WithdrawRenovationApplication({
          KeyID: row.KeyID
        }).then((res) => {
          const index = this.tableData.findIndex(v => v.KeyID === row.KeyID)
          row.Status = 1
          this.tableData[index] = row
          this.$message.success('撤回成功')
        })
      })
    },
    Delete(row) {
      this.$confirm('确定要删除该装修申请？', '提示').then(() => {
        DeleteRenovationApplication({
          KeyID: row.KeyID,
          OperationStatus: 2
        }).then(() => {
          const index = this.tableData.findIndex(v => v.KeyID === row.KeyID)
          this.tableData.splice(index, 1)
          this.$message.success('删除成功')
        })
      })
    },
    Detail(row) {
      this.$router.push({
        path: '/FixPurchase/FixPurchaseDepartmentDetail',
        query: {
          purchaseOrfitment: 1,
          row: row
        }
      })
    },
    Approval(row) {
      this.$refs.excuteAudit.open(row.KeyID)
    },
    open(key, row) {
      this.handle[key](row)
    }
  }
}
</script>

<style lang="scss">
.data-list-tab-inline {
  top: 120px;
}
</style>
