<template>
  <div class="app-container data-list">
    <search-panel :model="searchForm" ref="searchForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
        <el-form-item label="房源名称" prop="HouseName">
          <el-input v-model="searchForm.HouseName" placeholder="请输入房源名称"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="Keyword">
          <el-input v-model="searchForm.Keyword" placeholder="姓名/电话"></el-input>
        </el-form-item>
        <SelectOrganization v-model="searchForm.FullIDNew"></SelectOrganization>
        <el-form-item label="状态" prop="Status">
          <el-select v-model="searchForm.Status" placeholder="请选择">
            <el-option
              :label="item.Description"
              :value="item.Value"
              v-for="item in EnumStatus"
              :key="item.Value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label-width="80px" label="申请时间" prop="ApplyTime">
            <el-date-picker
              v-model="ApplyTime"
              @change="handleDate"
              type="daterange"
              align="right"
              unlink-panels
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>
      </template>
      <template slot="button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="addExpense(1)">新增</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table :data="filterList" border fit height="100%" class="table-normal" v-loading.body="listLoading" element-loading-text="加载中">
        <el-table-column align="center" prop="ApplyTime" label="申请时间" min-width="110"></el-table-column>
        <el-table-column align="center" prop="ContractNum" label="合同编号" min-width="130"> </el-table-column>
        <el-table-column align="center" prop="Money" label="金额" min-width="100">
           <template slot-scope="scope">
            <div>{{$priceFormat(scope.row.Money)}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="费用项目" min-width="130">
          <template slot-scope="scope">
            <div>{{scope.row.RenovationItems}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="HouseName" label="房源名称" min-width="130"></el-table-column>
        <el-table-column align="center" label="申请人" min-width="120">
           <template slot-scope="scope">
            <div>{{scope.row.UserName}}</div>
            <div>{{scope.row.Phone}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="FEmpName" label="负责人" min-width="120"></el-table-column>
        <el-table-column align="center" prop="WritePerson" label="核销人" min-width="120"> </el-table-column>
        <el-table-column align="center" prop="Status" label="状态" min-width="120">
          <template slot-scope="scope">
            <span>{{$EnumData.getEnumDesByValue('ReimbursementStatus', scope.row.Status)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <table-buttons
              :options="operationButton"
              :condition="handleOpration(scope.row)"
              @handleDetailClick="handleDetail(scope.row, scope.$index)"
              @handleModifyClick="handleModify(2, scope.row, scope.$index)"
              @handleWithdrawClick="handleWithdraw(scope.row,scope.$index)"
              @handleDeleteClick="handleDelete(scope.row,scope.$index)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="PageSize"
      :handlePageChange="fetchData"
    ></bottom-tool-bar>
    <addExpense @succeedExpense='succeedExpense'  ref="addExpense"></addExpense>
  </div>
</template>
<script>
  import { ShowCostReturn, EditReimbursement } from '@/api/house'
  import {
    BottomToolBar,
    SearchPanel,
    TableButtons
    } from '../../../components'
  import SelectOrganization from '@/components/SelectOrganization'
  import addExpense from './components/addExpense'
  export default {
    name: 'CostReturn',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      SelectOrganization,
      addExpense
    },
    data() {
      return {
        listLoading: false, // 请求列表loading
        filterList: [],
        PageSize: 10,
        ApplyTime: ['', ''], // 申请日期
        // 搜索条件
        searchForm: {
          BeginTime: '',
          EndTime: '',
          Status: 0, // 状态，
          HouseName: '', // 房源名称
          FullIDNew: '', // 组织架构
          Keyword: '' // 申请人
        },
        operationButton: [
          {
            key: 'Detail',
            value: '详情',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Modify',
            value: '修改',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Withdraw',
            value: '撤回',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Delete',
            value: '删除',
            type: 'danger',
            size: 'mini'
          }
        ]
      }
    },
    computed: {
      EnumStatus() {
        const EnumStatus = this.$EnumData.getEnumListByKey('ReimbursementStatus')
        return EnumStatus
      }
    },
    activated() {
      this.$refs.bottomToolBar.search(1) // 通过search调用fetchData
    },
    methods: {
      handleDate(val) {
        if (val) {
          this.searchForm.BeginTime = this.$dateFormat(val[0])
          this.searchForm.EndTime = this.$dateFormat(val[1])
        } else {
          this.searchForm.BeginTime = ''
          this.searchForm.EndTime = ''
         }
      },
      // 跳转详情界面
      handleDetail(data, index) {
        this.$router.push({
          path: '/House/ReimburseDetail',
          query: {
            KeyID: data.KeyID
          }
        })
      },
      // 修改
      handleModify(type, row) {
        this.$refs.addExpense.open(type, row)
      },
      // 撤回
      handleWithdraw(data, idx) {
        EditReimbursement({ OperationType: 3, KeyID: data.KeyID }).then(({ Data }) => {
          data.Status = 1
          this.$message.success('撤回成功')
        })
      },
      // 删除
      handleDelete(data, idx) {
        EditReimbursement({ OperationType: 2, KeyID: data.KeyID }).then(({ Data }) => {
          this.$message.success('删除成功')
          this.filterList.splice(idx, 1)
        })
      },
      // 默认加载页面查询数据方法
      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.PageSize,
            page: 1
          }
        }
        this.listLoading = true
        return ShowCostReturn({
          parm: pages,
          ...this.searchForm
        }).then(({ Data }) => {
          this.listLoading = false
          this.filterList = Data.rows.map(item => {
            item.ApplyTime = this.$dateFormat(item.ApplyTime)
            let renovationItems = ''
            let totalMoney = 0
            if (item.reimbursementTypes) {
              item.reimbursementTypes.map((todo, idx) => {
                totalMoney += todo.Money
                if (idx === 0) {
                  renovationItems += `${todo.BillProjectName}`
                } else {
                  renovationItems += `、${todo.BillProjectName}`
                }
              })
              item.RenovationItems = renovationItems
              item.Money = totalMoney
            }
            return item
          })
          return Data
        })
      },
      // 操作按钮
      handleOpration(item) {
        if (item.Status === 1 || item.Status === 3) {
          item.Operation = ['Detail', 'Modify', 'Delete']
        } else if (item.Status === 2) {
          item.Operation = ['Detail', 'Withdraw']
        } else {
          item.Operation = ['Detail']
        }
        return item.Operation
      },
      // 根据筛选条件查询列表
      submitForm() {
        this.$refs.bottomToolBar.search()
      },
      // 点击重置按钮
      resetForm() {
        this.searchForm.BeginTime = ''
        this.searchForm.EndTime = ''
        this.ApplyTime = ['', '']
        this.$refs.searchForm.resetFields()
        this.$refs.bottomToolBar.search()
      },
      // 新增
      addExpense(type) {
        this.$refs.addExpense.open(type)
      },
      succeedExpense() {
        this.$refs.bottomToolBar.search()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/mixin.scss";
</style>
