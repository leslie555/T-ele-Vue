<template>
  <div class="app-container data-list">
    <search-panel :model="searchForm" ref="searchForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
        <el-form-item label="申请人" prop="ApplicantInfo">
          <el-input v-model="searchForm.ApplicantInfo" placeholder="姓名/电话"></el-input>
        </el-form-item>
        <SelectOrganization v-model="searchForm.FullIDNew"></SelectOrganization>
        <el-form-item label="审核状态" prop="AuditStatus">
          <el-select v-model="searchForm.AuditStatus" placeholder="请选择">
            <el-option
              :label="item.Description"
              :value="item.Value"
              v-for="item in EnumStatus"
              :key="item.Value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table :data="filterList" border fit height="100%" class="table-normal" v-loading.body="listLoading" element-loading-text="加载中">
        <el-table-column align="center" prop="CreaterName" label="申请人姓名" min-width="100"></el-table-column>
        <el-table-column align="center" prop="UserPhone" label="申请人电话" min-width="120"> </el-table-column>
        <el-table-column align="center" prop="ExportModuleName" label="数据导出模块" min-width="130"></el-table-column>
        <el-table-column align="center" label="小区" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.CommunityName || '全部'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="DateLine" label="时间段" min-width="160"> </el-table-column>
        <el-table-column align="center" prop="Total" label="数据合计（条）" min-width="120"></el-table-column>
        <el-table-column align="center" prop="CreaterTime" label="申请时间" min-width="120"></el-table-column>
        <el-table-column align="center" prop="AuditorName" label="审核人" min-width="120"></el-table-column>
        <el-table-column align="center" prop="AuditTime" label="审核时间" min-width="120"></el-table-column>
        <el-table-column align="center" label="审核状态" min-width="100">
          <template slot-scope="scope">
            <span :class="scope.row.AuditStatus === 3 ? 'pass': scope.row.AuditStatus === 4 ? 'reject': ''">{{$EnumData.getEnumDesByValue('ExportAuditStatus', scope.row.AuditStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <table-buttons
              :options="operationButton"
              :condition="handleOpration(scope.row)"
              @handleDetailClick="handleDetail(scope.row, scope.$index)"
              @handleAuditClick="handleAudit(scope.row, scope.$index)"
              @handleReAuditClick="handleReAudit(scope.row, scope.$index)"
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
    <AuditDialog ref='auditDialog' @updateAudit="updateAudit"></AuditDialog>
  </div>
</template>
<script>
  import { getDataExportAuditList } from '@/api/export'
  import {
    BottomToolBar,
    SearchPanel,
    TableButtons
    } from '../../../components'
  import AuditDialog from './components/AuditDialog'
  import SelectOrganization from '@/components/SelectOrganization'

  export default {
    name: 'ExportApprovalList',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      SelectOrganization,
      AuditDialog
    },
    data() {
      return {
        listLoading: false, // 请求列表loading
        filterList: [],
        PageSize: 10,
        isAudit: 'audit', // 判断是审核还是复核， audit/reAudit
        // 搜索条件
        searchForm: {
          ApplicantInfo: '', // 申请人
          FullIDNew: '', // 组织
          AuditStatus: 0 // 状态，
        },
        operationButton: [
          {
            key: 'Detail',
            value: '详情',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Audit',
            value: '审核',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'ReAudit',
            value: '复核',
            type: 'primary',
            size: 'mini'
          }
        ]
      }
    },
    computed: {
      Type() {
        if (this.$route.path === '/Export/ExportApprovalList') { // Type 1为审核列表 2为复核列表
          return 1
        }
        return 2
      },
      EnumStatus() {
        const EnumStatus = this.$EnumData.getEnumListByKey('ExportAuditStatus')
        return EnumStatus
      }
    },
    activated() {
      this.$refs.bottomToolBar.search(1) // 通过search调用fetchData
    },
    methods: {
      // 跳转详情界面
      handleDetail(data, index) {
        this.$router.push({
          path: '/Export/ExportAuditDetail',
          query: {
            KeyID: data.KeyID
          }
        })
      },
      // 点击审核
      handleAudit(row) {
        const auditKeyID = row.KeyID
        this.$refs.auditDialog.open(auditKeyID, this.isAudit)
      },
      handleReAudit(row) {
        this.handleAudit(row)
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
        return getDataExportAuditList({
          parm: pages,
          Type: this.Type,
          ...this.searchForm
        }).then(({ Data }) => {
          this.listLoading = false
          this.filterList = Data.rows.map(item => {
            item.AuditTime = this.$dateFormat(item.AuditTime, 'yyyy-MM-dd hh:mm')
            item.CreaterTime = this.$dateFormat(item.CreaterTime, 'yyyy-MM-dd hh:mm')
            item.DateLine = this.$dateFormat(item.StartTime) === '' ? '全部' : `${this.$dateFormat(item.StartTime)} 至 ${this.$dateFormat(item.EndTime)}`
            return item
          })
          return Data
        }).catch(err => {
          console.log('err', err)
        })
      },
      // 操作按钮
      handleOpration(item) {
        item.Operation = ['Detail']
        if (this.Type === 1 && item.AuditStatus === 1) {
          this.isAudit = 'audit'
          item.Operation.push('Audit')
        } else if (this.Type === 2 && item.AuditStatus === 2) {
          this.isAudit = 'reAudit'
          item.Operation.push('ReAudit')
        }
        console.log(item.Operation)
        return item.Operation
      },
      // 根据筛选条件查询列表
      submitForm() {
        this.$refs.bottomToolBar.search()
      },
      // 点击重置按钮
      resetForm() {
        this.$refs.searchForm.resetFields()
        this.$refs.bottomToolBar.search()
      },
      updateAudit(param, AuditName) {
        const KeyID = param.ExportApplicationID
        // 修改列表显示
        this.filterList.map(item => {
          if (item.KeyID === KeyID) {
            const date = new Date()
            item.AuditStatus = param.ProgressAuditStatus
            item.AuditRemark = param.AuditRemark
            item.AuditorName = AuditName
            item.AuditTime = this.$dateFormat(date, 'yyyy-MM-dd hh:mm')
            item.Operation = ['View']
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/mixin.scss";
  .pass {
    color: #30CD9A
  }
  .reject {
    color: #FF5959
  }
</style>
