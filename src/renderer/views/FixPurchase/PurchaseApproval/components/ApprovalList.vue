<template>
  <div class="app-container data-list" :style="{top:'140px'}">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="100px">
      <template slot="search">
        <div class="clearfix">
          <el-form-item label="审核状态" prop="ReviewedStatus">
            <el-select clearable v-model="ruleForm.ReviewedStatus" placeholder="请选择">
              <el-option
                v-for="item in AuditStatusEnum"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房源名称" prop="HouseName">
            <el-input v-model="ruleForm.HouseName" placeholder="请输入房源名称"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="部门" prop="DepID">
            <select-store ref="selectStore" type="report" @change="handleStoreChange"></select-store>
          </el-form-item>
          <el-form-item label="业务员" prop="Salesman">
            <el-input placeholder="姓名/电话" v-model="ruleForm.Salesman"></el-input>
          </el-form-item>
          <el-form-item label="提交时间" prop="ApplicationTime">
            <el-date-picker
              v-model="ruleForm.SubmitTime"
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
        <el-button class="search-button" type="primary" @click="configSearch()">查询</el-button>
        <el-button class="reset-button" type="primary" @click="keywordReset()">重置</el-button>
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
        <el-table-column align="center" label="房源名称" min-width="180" prop="HouseName"></el-table-column>
        <el-table-column align="center" label="地址" min-width="180" prop="Location"></el-table-column>
        <el-table-column
          v-if="type===1"
          align="center"
          label="产权面积"
          min-width="120"
          prop="RoomArea"
        ></el-table-column>
        <el-table-column v-if="type===2" align="center" label="维修内容" prop="MaintainContent"></el-table-column>
        <el-table-column v-if="type===3" align="center" label="保洁内容" prop="CleaningContent"></el-table-column>
        <el-table-column v-if="type===4" align="center" label="搬家内容" prop="MovingContent"></el-table-column>
        <el-table-column
          v-if="type!==1"
          align="center"
          label="租客信息"
          min-width="130"
          prop="TenantName"
        ></el-table-column>
        <el-table-column align="center" label="业务员" prop="Salesman" min-width="130"></el-table-column>
        <el-table-column align="center" label="部门" min-width="120" prop="CompanyName"></el-table-column>
        <el-table-column align="center" label="提交时间" min-width="120" prop="CGBReviewedCommitTime"></el-table-column>
        <el-table-column v-if="type!==1" align="center" label="备注" min-width="120" prop="Remark"></el-table-column>
        <el-table-column align="center" label="审核状态" min-width="80" prop="ReviewedStatus">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.ReviewedStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" min-width="150">
          <template slot-scope="scope">
            <table-buttons
              :options="operationButton"
              :condition="scope.row.conditionBtn"
              @handleDetailClick="handleDetail(scope.row)"
              @handleApprovalClick="handleApproval(scope.row, scope.$index)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData"></bottom-tool-bar>
    <FixPaperAndPurchaseDialog ref="addConfigBox"></FixPaperAndPurchaseDialog>
    <AddApproval ref="AddApproval" @updateAudit="handleUpdateAudit"></AddApproval>
  </div>
</template>
<script>
  import {
    SearchPanel,
    TableButtons,
    BottomToolBar,
    SelectStore
  } from '@/components'
  import { CGBApprovalList } from '@/api/purchase'
  import FixPaperAndPurchaseDialog from '../../PurchaseDepartment/FixPaper/components/FixPaperAndPurchaseDialog.vue'
  import AddApproval from './AddApproval'
  export default {
    name: 'ApprovalList',
    props: {
      type: Number, // 1装修2维修3保洁4搬家
      ViewState: {
        type: Number,
        default: 2
      } // 1经理审批  2采购部审批
    },
    components: {
      TableButtons,
      SearchPanel,
      BottomToolBar,
      SelectStore,
      FixPaperAndPurchaseDialog,
      AddApproval
    },
    data() {
      return {
        listLoading: false,
        pageSize: 10,
        ruleForm: {
          DepID: '',
          HouseName: '',
          ReviewedStatus: '',
          Salesman: '',
          SubmitTime: []
        },
        currentRow: {},
        HouseName: '',
        AuditStatusEnum: [
          { value: 1, label: '待审核' },
          { value: 2, label: '审核通过' },
          { value: 3, label: '审核不通过' }
        ],
        filterList: [],
        list: [],
        operationButton: [
          {
            key: 'Detail',
            value: '详情',
            type: 'primary'
          },
          {
            key: 'Approval',
            value: '审核',
            type: 'primary'
          }
        ],
        operatingIdx: 0
      }
    },
    /* activated() {
                  this.$refs.bottomToolBar.search(1)
                }, */
    methods: {
      // 查询
      configSearch() {
        console.log(this.ruleForm.State)
        this.$refs.bottomToolBar.search()
      },
      // 重置
      keywordReset() {
        this.ruleForm = {
          DepID: '',
          HouseName: '',
          ReviewedStatus: '',
          Salesman: '',
          SubmitTime: []
        }
        this.$refs.bottomToolBar.search()
        // 部门选择框重置
        this.$refs.selectStore.reset()
      },
      // 选择部门过后，返回来的数据
      handleStoreChange(val) {
        // 选择部门后的回调
        if (val) {
          this.ruleForm.DepID = val.fullID
        } else {
          this.ruleForm.DepID = ''
        }
      },
      // 调接口
      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        return CGBApprovalList({
          ...this.ruleForm,
          parm: pages, // 分页参数
          Type: this.type,
          ViewState: this.ViewState,
          BeginTime: this.$dateFormat(this.ruleForm.SubmitTime[0]),
          EndTime: this.$dateFormat(this.ruleForm.SubmitTime[1])
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
      // 初始化State
      filterStatus(item) {
        const status = this.AuditStatusEnum.find(val => item === val.value)
        return status ? status.label : ''
      },
      // 根据State状态，过滤操作按钮
      filterTableDataItem(item) {
        const itemChooseStatus = ['Detail']
        const obj = {}
        if (item.ReviewedStatus === 1) {
          itemChooseStatus.push('Approval')
        }
        switch (this.type) {
          case 1:
            obj.KeyLocation = item.KeyLocation
            obj.RoomArea = item.RoomArea + 'm²'
            obj.Salesman = item.Salesman
            break
          case 2:
            obj.MaintainContent = item.MaintainContent
            obj.Salesman = item.UserName + '   ' + item.Phone
            obj.TenantName = item.TenName + '   ' + item.TenPhone
            break
          case 3:
            obj.CleaningContent = item.CleaningContent
            obj.Salesman = item.UserName + '   ' + item.Phone
            obj.TenantName = item.TenName + '   ' + item.TenPhone
            break
          case 4:
            obj.MovingContent = item.MovingContent
            obj.Salesman = item.Salesman
            obj.TenantName =
              (item.TenantName || '') + '   ' + (item.TenantTel || '')
            obj.Remark = item.BZ
            break
        }
        return {
          KeyID: item.KeyID, // KeyID
          HouseName: item.HouseName, // 房源名称
          Location: item.Location, // 地址
          CompanyName: item.CompanyName, // 部门
          CGBReviewedCommitTime: this.$dateFormat(item.CGBReviewedCommitTime), // 提交时间
          ReviewedStatus: item.ReviewedStatus, // 审核状态
          Remark: item.Remark, // 备注
          conditionBtn: itemChooseStatus, // 操作按钮
          ...obj
        }
      },
      // 详情
      handleDetail(row) {
        switch (this.type) {
          case 1:
            this.$refs.addConfigBox.open(row, { title: '装修单', titleID: 1 })
            break
          case 2:
            this.$router.push({
              path: '/FixPurchase/RepairBillDetail',
              query: {
                MaintenanceCleaing: 0,
                KeyID: row.KeyID
              }
            })
            break
          case 3:
            this.$router.push({
              path: '/FixPurchase/CleaningPaperDetail',
              query: {
                KeyID: row.KeyID
              }
            })
            break
          case 4:
            this.$router.push({
              name: 'MoveApplydetail',
              query: {
                KeyID: row.KeyID
              }
            })
            break
        }
      },
      handleApproval(row, index) {
        this.operatingIdx = index
        this.$refs.AddApproval.open({
          KeyID: row.KeyID,
          Type: this.type,
          ViewState: this.ViewState
        })
      },
      handleUpdateAudit(status) {
        const item = this.list[this.operatingIdx]
        if (status === 1) {
          // 通过
          item.ReviewedStatus = 2
        } else {
          item.ReviewedStatus = 3
        }
        this.$set(
          this.filterList,
          this.operatingIdx,
          this.filterTableDataItem(item)
        )
      }
    }
  }
</script>
<style lang="scss" scoped>
  .showEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 120px;
  }
</style>