<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px"  show>
      <template slot="search">
        <el-form-item label="关键字">
          <el-input
            v-model="ruleForm.KeyWord"
            autocomplete="off"
            placeholder=""
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="ruleForm.FinancialType"
            filterable
            placeholder="请选择"
            style="width: 120px;"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              style="width: 120px;"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="primary" @click="openForm(1)" v-setbtn:Add>新增</el-button>
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
        <el-table-column label="类型" prop="AssetsType" align="center" width="120px" fixed="left">
          <template
            slot-scope="scope"
          >{{ $EnumData.getEnumDesByValue('AssetsType', scope.row.AssetsType) }}</template>
        </el-table-column>
        <el-table-column label="级次" align="center" prop="Gradation"></el-table-column>
        <el-table-column label="科目编码" align="center" prop="SubjectCode"></el-table-column>
        <el-table-column label="科目名称" prop="SubjectName" align="center" width="260"></el-table-column>
        <el-table-column label="助记码" prop="MnemonicCode" align="center" width="260"></el-table-column>
        <el-table-column label="外币币种" align="center" width="260" prop="ForeignCurrency"></el-table-column>
        <el-table-column label="计量单位" prop="Unit" align="center"></el-table-column>
        <el-table-column label="辅助账类型" prop="AuxiliaryAccountType" align="center"></el-table-column>
        <el-table-column label="账页格式" prop="Format" align="center"></el-table-column>
        <el-table-column label="余额方向" prop="Direction" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="openForm(2, scope.row)">修改</el-button>
            <el-button
              type="danger"
              plain
              size="mini"
              @click="delTableData(scope.row.KeyID, scope.$index)"
            >删除</el-button>
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
    <edit-form
      ref="SubjectEditForm"
      @AddNewFinancial="AddNewFinancial"
      @EditNewFinancial="EditNewFinancial"
    ></edit-form>
  </div>
</template>

<script>
import { FindFinancialSubjectList, DelFinancialSubject } from '@/api/report'
import { SearchPanel, BottomToolBar } from '@/components'
import editForm from './components/editForm'
// EditFinancialSubject, AddFinancialSubject, DelFinancialSubject

export default ({
  name: 'FinancialSubject',
  data() {
    return {
      ruleForm: {
        KeyWord: '',
        Time: [],
        FinancialType: 0,
        manger: '',
        EmployeeFullID: '',
        EmployeeName: ''
      },
      // 表格数据
      tableData: [],
      pageSize: 10,
      listLoading: false,
      // 可删除
      options: [{
        value: 0,
        label: '全部'
      }, {
        value: 1,
        label: '资产'
      }, {
        value: 2,
        label: '负债'
      }, {
        value: 3,
        label: '共同'
      }, {
        value: 4,
        label: '权益'
      }, {
        value: 5,
        label: '成本'
      }, {
        value: 6,
        label: '损益'
      }]
    }
  },
  components: {
    SearchPanel,
    BottomToolBar,
    editForm
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
      return FindFinancialSubjectList({
        Param: pages,
        KeyWord: this.ruleForm.KeyWord,
        AssetsType: this.ruleForm.FinancialType
      }).then(response => {
        if (response.Code === 0) {
          if (response.Data.rows) {
            this.tableData = response.Data.rows
          }
          this.listLoading = false
          return response.Data
        }
      })
    },
    search() {
      this.$refs.bottomToolBar.search()
    },
    reset() {
      this.ruleForm.KeyWord = ''
      this.ruleForm.FinancialType = 0
      this.$refs.bottomToolBar.search()
    },
    delTableData(KeyID, index) {
      const self = this
      this.$confirm('是否删除该条科目数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DelFinancialSubject({
          KeyID
        }).then(response => {
          if (response.Code === 0) {
            self.$message({
              message: '删除成功',
              type: 'success'
            })
            self.tableData.splice(index, 1)
          }
        })
      })
    },
    openForm(type, obj) {
      this.$refs.SubjectEditForm.open(type, obj)
    },
    AddNewFinancial(form) {
      this.search()
    },
    EditNewFinancial(form) {
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].KeyID === form.KeyID) {
          this.$set(this.tableData, i, this.$deepCopy(form))
          break
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
