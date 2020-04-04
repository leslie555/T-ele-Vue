<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="200px">
      <template slot="search">
        <el-form-item label="所属业务" prop="BusType">
          <el-select v-model="ruleForm.BusType" placeholder="请选择">
            <el-option label="全部" value="0"></el-option>
            <el-option
              v-for="item in BusType"
              :key="item.Value"
              :label="item.Description"
              :value="item.Value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字" prop="ApplyName">
          <el-input v-model="ruleForm.ApplyName" placeholder="内容/申请人/合同号"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="AuditStatus">
          <el-checkbox-group v-model="ruleForm.AuditStatus">
            <el-checkbox label="1">待审核</el-checkbox>
            <el-checkbox label="2">已通过</el-checkbox>
            <el-checkbox label="3">不通过</el-checkbox>
            <el-checkbox label="4">反审核</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="申请时间" prop="ApplicationTime">
            <el-date-picker
              v-model="ruleForm.ApplicationTime"
              type="daterange"
              range-separator="-"
              :default-time="['00:00:00', '23:59:59']"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>
      </template>
      <template slot="button">
        <el-button type="primary" @click="searchApproval">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
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
        <el-table-column
          align="center"
          label="所属业务"
          fixed="left"
          width="100"
          prop="BusinessTypeName"
        ></el-table-column>
        <el-table-column align="center" label="申请人" min-width="70" prop="ApplyName"></el-table-column>
        <el-table-column align="center" label="申请时间" min-width="140" prop="ApplyTime"></el-table-column>
        <el-table-column align="center" label="合同编号" min-width="120" prop="ContractNumber"></el-table-column>
        <el-table-column align="center" label="审批内容" min-width="250" prop="AuditContent"></el-table-column>
        <el-table-column align="center" label="审批时间" min-width="140" prop="AuditTime"></el-table-column>
        <el-table-column align="center" label="状态" min-width="60" prop="AuditStatus"></el-table-column>
        <el-table-column align="center" label="备注" min-width="140" prop="AuditRemark"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <table-buttons
              :options="operation2button"
              :condition="scope.row.Operation"
              @handleViewClick="handleView(scope.row)"
              @handleAuditClick="handleAudit(scope.row)"
              @handleReAuditClick="handleReAudit(scope.row)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData"></bottom-tool-bar>
    <div>
      <excute-audit ref="excuteAudit" @updateAudit="updateAudit"></excute-audit>
    </div>
    <business-detail ref="businessDetail"></business-detail>
  </div>
</template>

<script>
  import { BottomToolBar, BusinessDetail, SearchPanel, TableButtons } from '../../components/'
  import { QueryApplyList, InverseAudit } from '../../api/Approval'
  import { dateFormat } from '../../utils/dateFormat'
  import ExcuteAudit from '../../components/ExcuteAudit'

  export default {
    name: 'MyApproval',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      ExcuteAudit,
      BusinessDetail
    },

    data() {
      return {
        ruleForm: {
          BusType: '0',
          ApplyName: '',
          ApplicationTime: ['', ''],
          AuditStatus: []
        },
        whileList: [8, 9, 17, 18, 19, 20], // 在业务类型中不展示的
        list: [],
        filterList: [],
        listLoading: false,
        pageSize: 10,
        operation2button: [
          {
            key: 'View',
            value: '查看',
            type: 'default'
          },
          {
            key: 'Audit',
            value: '审核',
            type: 'primary'
          },
          {
            key: 'ReAudit',
            value: '反审核',
            type: 'primary'
          }
        ]
      }
    },

    computed: {
      BusType() {
        return this.$EnumData.getEnumListByKey('BusinessType').filter(item => {
          return !this.whileList.includes(item.Value)
        })
      }
    },
    activated() {
      // BusType 15   首页跳转过来
      if (this.$route.query.BusType === 15) {
        this.ruleForm.BusType = 15
        this.$refs.bottomToolBar.search(3)
      } else {
        this.$refs.bottomToolBar.search(1)
      }
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
        if (!this.ruleForm.ApplicationTime) {
          this.ruleForm.ApplicationTime = []
        }
        return QueryApplyList({
          pageParam: pages,
          BusType: this.ruleForm.BusType,
          ApplyName: this.ruleForm.ApplyName,
          StartDate: this.$dateFormat(this.ruleForm.ApplicationTime[0], 'yyyy-MM-dd hh:mm:ss'),
          EndDate: this.$dateFormat(this.ruleForm.ApplicationTime[1], 'yyyy-MM-dd hh:mm:ss'),
          AuditStatus: this.ruleForm.AuditStatus
        }).then(response => {
          this.list = response.Data.rows
          this.filterTableData()
          this.listLoading = false
          return response.Data
        }).catch(() => {
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
        // 审核通过且业务类型为业主合同时，出现反审核按钮
        const Operation = item.AuditStatus === 2 && item.BusinessType === 1 ? ['View', 'ReAudit']
          : item.AuditStatus === 1 ? ['View', 'Audit'] : ['View']
        return {
          KeyID: item.KeyID,
          ProfessionID: item.ProfessionID,
          BusinessTypeName: this.$EnumData.getEnumDesByValue('BusinessType', item.BusinessType),
          BusinessType: item.BusinessType,
          ContractNumber: item.ContractNumber,
          ApplyName: item.ApplyName,
          ApplyTime: dateFormat(item.ApplyTime, 'yyyy-MM-dd hh:mm:ss'),
          AuditContent: item.AuditContent,
          AuditStatus: this.$EnumData.getEnumDesByValue('AuditStatus', item.AuditStatus),
          AuditTime: item.AuditStatus === 1 ? '' : dateFormat(item.AuditTime, 'yyyy-MM-dd hh:mm:ss'),
          AuditRemark: item.AuditRemark,
          Operation
        }
      },

      searchApproval() {
        this.$refs.bottomToolBar.search()
      },

      resetForm() {
        this.$refs.ruleForm.resetFields()
        this.$refs.bottomToolBar.search()
      },

      handleView(row) {
        // 不同审批类型实现不同跳转，具体视页面而定
        const index = this.list.findIndex(item => item.KeyID === row.KeyID)
        const oitem = this.list[index]
        this.$refs.businessDetail.open({
          type: oitem.BusinessType,
          busId: oitem.ProfessionID,
          auditId: oitem.KeyID
        })
      },

      handleAudit(row) {
        const auditIds = [row.KeyID]
        this.$refs.excuteAudit.open(auditIds)
      },

      handleReAudit(row) {
        this.$confirm('确认反审核该合同?', '提示').then(() => {
          const postData = { 'keyID': row.KeyID }
          InverseAudit(postData).then(() => {
            this.$message({
              type: 'success',
              message: '反审核成功!'
            })
            row.Operation = ['View']
            row.AuditStatus = this.$EnumData.getEnumDesByValue('AuditStatus', 4) // 4表示反审核枚举值
          })
        })
      },

      updateAudit(list) {
        const idStr = []
        list.map(item => {
          idStr.push(item.KeyID)
        })
        this.filterList.map(item => {
          if (idStr.includes(item.KeyID)) {
            const date = new Date()
            item.AuditStatus = this.$EnumData.getEnumDesByValue('AuditStatus', parseInt(list[0].AuditStatus))
            item.AuditRemark = list[0].AuditRemark
            item.AuditTime = dateFormat(date, 'yyyy-MM-dd hh:mm:ss')
            item.Operation = list[0].AuditStatus === '2' && item.BusinessType === 1 ? ['View', 'ReAudit'] : ['View']
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
