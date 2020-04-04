<template>
  <div class="app-container data-list">
    <search-panel :model="ContractAccount" ref="ruleForm" label-width="80px">
      <template slot="search">
        <el-form-item label="房源名称">
          <el-input
            v-model="ContractAccount.HouseName"
            autocomplete="off"
            placeholder="请输入房源名称"
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <template>
          <el-form-item label="合同编号">
            <el-input
              v-model="ContractAccount.ContractNumber"
              autocomplete="off"
              placeholder="请输入合同编号"
              style="width: 150px"
            ></el-input>
          </el-form-item>
        </template>
        <el-form-item label="合同类型">
          <el-select v-model="ContractAccount.ContractType" placeholder="请选择" style="width: 150px;">
            <el-option
              v-for="item in AccountSelect"
              :key="item.Key"
              :label="item.name"
              :value="item.Key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作人">
          <el-input
            v-model="ContractAccount.EmployeeName"
            autocomplete="off"
            placeholder="请输入操作人"
            style="width: 150px"
          ></el-input>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <template>
          <el-button type="primary" @click="openAddForm()">新增</el-button>
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
        <el-table-column label="房源名称" align="center">
          <template slot-scope="scope">{{ scope.row.HouseName }}</template>
        </el-table-column>
        <el-table-column label="合同编号" align="center" prop="ContractNumber"></el-table-column>
        <el-table-column label="合同类型" align="center" width="100">
          <template
            slot-scope="scope"
          >{{ scope.row.ContractType ? '租客' : '业主' }}</template>
        </el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.EmployeeName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="业主/租客信息" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.UserName }}&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.UserPhone }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center" prop="ReviewedCommitTime">
          <template slot-scope="scope">{{ $dateFormat(scope.row.OperatingTime) }}</template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="Remark"></el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="fetchData"
      style="text-align: right"
    ></bottom-tool-bar>
    <ContractAccountAdd @refresh="refresh" ref="ContractAccountAdd"></ContractAccountAdd>
  </div>
</template>

<script>
import { SearchPanel, BottomToolBar, TableButtons } from '@/components'
// import { SelectRenovationApplyList } from '@/api/house'
import { QueryBillAdjustList } from '@/api/finance'
import ContractAccountAdd from './add'
export default {
  name: 'ContractAccount',
  components: {
    SearchPanel,
    BottomToolBar,
    TableButtons,
    ContractAccountAdd
  },
  data() {
    return {
      pageSize: 10,
      listLoading: false,
      isShowSelect: true,
      list: [],
      tableData: [],
      titleFinsh: false,
      AccountSelect: [
          {
          name: '全部',
          Key: ''
        },
        {
          name: '租客合同',
          Key: 1
        },
        {
          name: '业主合同',
          Key: 0
        }
      ],
      ContractAccount: {
        HouseName: '',
        ContractType: '',
        ContractNumber: '',
        EmployeeName: ''
      }
    }
  },
  created() {},
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
      return QueryBillAdjustList({
        parm: pages,
        HouseName: this.ContractAccount.HouseName,
        ContractType: this.ContractAccount.ContractType,
        ContractNumber: this.ContractAccount.ContractNumber,
        EmployeeName: this.ContractAccount.EmployeeName
      })
        .then(response => {
          if (response.Code === 0) {
            this.tableData = response.Data.rows
            this.listLoading = false
            return response.Data
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    refresh(val) {
        if (val) {
            this.$refs.bottomToolBar.search()
        }
    },
    search() {
      this.$refs.bottomToolBar.search()
    },
    reset() {
      this.ContractAccount.HouseName = ''
      this.ContractAccount.ContractType = ''
      this.ContractAccount.ContractNumber = ''
      this.ContractAccount.EmployeeName = ''
      this.$refs.bottomToolBar.search()
    },
    openAddForm() {
        this.$refs['ContractAccountAdd'].open()
    }
  }
}
</script>

<style lang="scss">
.data-list-tab-inline {
  top: 120px;
}
</style>
