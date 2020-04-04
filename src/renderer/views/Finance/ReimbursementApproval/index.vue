<template>
  <div>
    <div class="app-container data-list">
      <search-panel :model="ruleForm" ref="ruleForm" label-width="80px">
        <template slot="search">
          <el-form-item label="房源名称" prop="HouseName" class="form-item-sm">
            <el-input
              v-model="ruleForm.HouseName"
              autocomplete="off"
              placeholder="请输入房源关键字"
              style="width: 320px"
            ></el-input>
          </el-form-item>
          <select-organization :type="3" v-model="ruleForm.FullIDNew"></select-organization>
          <el-form-item label="状态" prop="Status">
            <el-select v-model="ruleForm.Status" placeholder="请选择">
              <el-option
                :label="item.Description"
                :value="item.Value"
                v-for="item in EnumStatus"
                :key="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="more">
          <div class="clearfix">
            <el-form-item label="申请人" prop="Keyword">
              <el-input
                v-model="ruleForm.Keyword"
                autocomplete="off"
                placeholder="姓名/电话"
                style="width: 320px"
              ></el-input>
            </el-form-item>
            <el-form-item prop="ApplyTime" label="申请时间">
              <el-date-picker
                v-model="ruleForm.ApplyTime"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </div>
        </template>
        <template slot="button">
          <el-button type="primary" @click="searchAccount">查询</el-button>
          <el-button class="reset-button" type="primary" @click="keywordReset">重置</el-button>
        </template>
      </search-panel>
      <div class="panel data-list-table">
        <el-table
          :data="filterList"
          ref="multipleTable"
          v-loading.body="listLoading"
          element-loading-text="加载中"
          border
          fit
          height="100%"
          class="table-normal"
        >
          <el-table-column align="center" label="申请时间" width="100" prop="ApplyTime"></el-table-column>
          <el-table-column align="center" label="金额" min-width="100" prop="projectsMoney"></el-table-column>
          <el-table-column align="center" label="费用项目" min-width="180" prop="projectsName"></el-table-column>
          <el-table-column align="center" label="房源名称" min-width="180" prop="HouseName"></el-table-column>
          <el-table-column align="center" label="合同编号" min-width="180" prop="ContractNum"></el-table-column>
          <el-table-column align="center" label="申请人" min-width="190" prop="SEmpName"></el-table-column>
          <el-table-column align="center" label="负责人" min-width="100" prop="FEmpName"></el-table-column>
          <el-table-column align="center" label="核销人" min-width="100" prop="WritePerson"></el-table-column>
          <el-table-column align="center" label="状态" min-width="140" prop="Status"></el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="260">
            <template slot-scope="scope">
              <table-buttons
                :options="operation2button"
                :condition="scope.row.Operation"
                @handleAuditClick="handleAudit(scope.row)"
                @handleDetailClick="handleDetail(scope.row)"
                @handlePayBillClick="handlePayBill(scope.row)"
              ></table-buttons>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <bottom-tool-bar
        class="pager-div"
        ref="bottomToolBar"
        :page-size="pageSize"
        :handlePageChange="fetchData"
      ></bottom-tool-bar>
    </div>
    <approval ref="approval" @updateAudit="handleUpdateAudit"></approval>
    <generate-payment-order @handlePayment="handlePayment" ref="GeneratePaymentOrder"></generate-payment-order>
  </div>
</template>

<script>
  import {
    SearchPanel,
    TableButtons,
    BottomToolBar,
    SelectOrganization,
    GeneratePaymentOrder
  } from '../../../components/'
  import { ShowCostReturn } from '../../../api/house'
  import Approval from './components/Approval'

  export default {
    name: 'AccountManage',
    components: {
      TableButtons,
      SearchPanel,
      BottomToolBar,
      SelectOrganization,
      Approval,
      GeneratePaymentOrder
    },

    data() {
      return {
        ruleForm: {
          HouseName: '',
          FullIDNew: '',
          Status: '',
          Keyword: '',
          ApplyTime: []
        },
        list: [],
        filterList: [],
        listLoading: false,
        pageSize: 10,
        operation2button: [
          {
            key: 'Detail',
            value: '详情',
            type: 'primary',
            withoutPermission: true
          },
          {
            key: 'Audit',
            value: '审核',
            type: 'primary'
          },
          {
            key: 'PayBill',
            value: '生成付款单',
            type: 'primary'
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
        this.ruleForm.BeginTime = this.ruleForm.ApplyTime[0] || ''
        this.ruleForm.EndTime = this.ruleForm.ApplyTime[1] || ''
        this.listLoading = true
        return ShowCostReturn({
          parm: pages,
          QueryType: 2,
          ...this.ruleForm
        })
          .then(response => {
            this.list = response.Data.rows
            this.filterTableData()
            this.listLoading = false
            return response.Data
          })
          .catch(() => {
            this.listLoading = false
          })
      },

      filterTableData() {
        this.filterList = []
        this.list.map(item => {
          this.filterList.push(this.filterTableDataItem(item))
        })
      },

      filterTableDataItem(item) {
        const projects = item.reimbursementTypes
        const projectsMoney = projects.reduce((pre, cur) => {
          return pre + cur.Money
        }, 0)
        const projectsName = projects.map(v => v.BillProjectName).join('、')
        const Operation = ['Detail']
        if (item.Status === 2) {
          Operation.push('Audit')
        } else if (item.Status === 4) {
          Operation.push('PayBill')
        }
        return {
          KeyID: item.KeyID,
          ApplyTime: this.$dateFormat(item.ApplyTime),
          projectsMoney: this.$priceFormat(projectsMoney),
          projectsName,
          HouseName: item.HouseName,
          ContractNum: item.ContractNum,
          SEmpName: item.UserName + '  ' + item.Phone,
          FEmpName: item.FEmpName,
          WritePerson: item.WritePerson,
          Status: this.$EnumData.getEnumDesByValue(
            'ReimbursementStatus',
            item.Status
          ),
          Operation
        }
      },

      searchAccount() {
        this.$refs.bottomToolBar.search()
      },

      keywordReset() {
        this.$refs.ruleForm.resetFields()
        this.$refs.bottomToolBar.search()
      },

      handleAudit(row) {
        this.$refs.approval.open(row.KeyID)
      },
      handleUpdateAudit(data) {
        const idx = this.filterList.findIndex(v => v.KeyID === data.KeyID)
        this.list[idx].Status = data.Status
        this.$set(
          this.filterList,
          idx,
          this.filterTableDataItem({
            ...this.list[idx],
            Status: data.Status
          })
        )
      },
      handleDetail(row) {
        this.$router.push({
          path: '/House/ReimburseDetail',
          query: {
            KeyID: row.KeyID
          }
        })
      },
      handlePayBill(row) {
        this.$refs.GeneratePaymentOrder.open(row)
      },
      handlePayment(data) {
        const idx = this.filterList.findIndex(v => v.KeyID === data.KeyID)
        this.list[idx].Status = data.Status
        this.$set(
          this.filterList,
          idx,
          this.filterTableDataItem({
            ...this.list[idx],
            Status: data.Status
          })
        )
      }
    }
  }
</script>

<style scoped>
</style>