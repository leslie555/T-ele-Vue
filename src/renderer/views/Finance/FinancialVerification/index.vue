<template>
  <div class="app-container data-list">
    <search-panel :model="FinancialListForm" ref="ruleForm" label-width="80px">
      <template slot="search">
        <el-form-item label="关键字" prop="Keyword">
          <el-input
            v-model="FinancialListForm.KeyWord"
            autocomplete="off"
            placeholder="核销单编号/核销对象"
            style="width: 320px"
            maxlength="64"
          ></el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="核销类型" prop="LeaseStatus">
            <el-select v-model="FinancialListForm.VerificationType" placeholder="请选择核销类型">
              <el-option label="应收冲已收" :value="1"></el-option>
              <el-option label="应付冲已付" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型" prop="AuditStatus">
            <el-select v-model="FinancialListForm.BusType" placeholder="请选择业务状态">
              <el-option
                v-for="busType in $store.getters.enumList.EnumFinanceBusType"
                :key="busType.Value"
                :label="busType.Description"
                :value="busType.Value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="核销日期" prop="EntrustTime">
            <el-date-picker
              v-model="FinancialListForm.EntrustTime"
              type="daterange"
              align="right"
              :default-time="['00:00:00', '23:59:59']"
              unlink-panels
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
        <el-button type="primary" v-setbtn:Add @click="LookAddFinancial">新增</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table :data="filterList" border fit height="100%" class="table-normal">
        <el-table-column align="center" prop="BillNum" label="核销订单" min-width="130"></el-table-column>
        <el-table-column align="center" prop="VerificationType" label="核销类型" min-width="130"></el-table-column>
        <el-table-column align="center" prop="BusinessType" label="业务类型" min-width="130"></el-table-column>
        <el-table-column align="center" prop="VerificationMoney" label="核销金额" min-width="130"></el-table-column>
        <el-table-column align="center" prop="CustomerName" label="核销对象" min-width="130">
          <template slot-scope="scope">
            <div>
              {{scope.row.CustomerName}}
              <span>({{scope.row.CustomerType}})</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="VerificationTime" label="核销日期" min-width="130"></el-table-column>
        <el-table-column align="center" prop="AuditStatus" label="审核状态" min-width="130"></el-table-column>
        <el-table-column align="center" prop="CreaterName" label="操作人" min-width="130"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" min-width="230" prop="Operation">
          <template slot-scope="scope">
            <table-buttons
              :options="operation2button"
              :condition="scope.row.Operation"
              @handleDeleteClick="handleDelete(scope.row, scope.$index)"
              @handleDetailedClick="handleDetailed(scope.row.KeyID,scope.$index)"
              @handleEditClick="handleEdit(scope.row.KeyID,scope.$index)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="PageSize"
      :handlePageChange="GetVerificationDate"
    ></bottom-tool-bar>
    <EditFinancialCancel
      @insert="handleInsert"
      @edited="handleEdited"
      :EditData="editData"
      ref="EditVerification"
    ></EditFinancialCancel>
    <FinancialDetail ref="financialDetail"></FinancialDetail>
    <!--  <div>
      <FinancialCancelDetailed ref="VerificationDetailed"></FinancialCancelDetailed>
    </div>-->
  </div>
</template>

<script>
  import { GetVerificationList, DeleteVerification, GetVerificationDetailed } from '@/api/finance'
  import SearchPanel from '../../../components/SearchPanel'
  import TableButtons from '../../../components/TableButtons'
  import BottomToolBar from '@/components/BottomToolBar'
  import EditFinancialCancel from './components/EditFinancialCancel'
  import FinancialDetail from './components/FinancialDetail.vue'
  // import ChoiceFinancialCancel from './components/ChoiceFinancialCancel'
  // import ChoiceCancelUserName from './components/ChoiceCancelUserName'
  // import FinancialCancelDetailed from './components/FinancialCancelDetailed'
  export default {
    name: 'FinancialCancel',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      EditFinancialCancel,
      FinancialDetail
    },
    data() {
      return {
        filterList: [],
        PageSize: 10,
        editingIdx: '', // 当前修改数据的索引
        FinancialListForm: {
          KeyWord: '',
          VerificationType: '',
          BusType: '',
          EntrustTime: [],
          StartTime: '',
          EndTime: ''
        },
        // 核销单列表操作按钮
        operation2button: [
          {
            key: 'Detailed',
            value: '详细',
            type: 'primary'
          },
          {
            key: 'Edit',
            value: '修改',
            type: 'primary'
          },
          {
            key: 'Delete',
            value: '删除',
            type: 'danger'
          }
        ],
        editData: null
      }
    },
    computed: {
      // 账户类型
      AcceptType() {
        return this.$EnumData.getEnumListByKey('AcceptType')
      },
      // 业务类型
      BusType() {
        return this.$EnumData.getEnumListByKey('FinanceBusType')
      },
      // 审核状态
      AuditStatus() {
        return this.$EnumData.getEnumListByKey('AuditStatus')
      }
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    methods: {
      // 得到核销单默认列表
      GetVerificationDate(pages) {
        if (!pages) {
          pages = {
            size: this.PageSize,
            page: 1
          }
        }
        if (this.FinancialListForm.EntrustTime === null) {
          this.FinancialListForm.EntrustTime = []
        }
        this.FinancialListForm.StartTime = this.$dateFormat(this.FinancialListForm.EntrustTime[0], 'yyyy-MM-dd 00:00:00')
        this.FinancialListForm.EndTime = this.$dateFormat(this.FinancialListForm.EntrustTime[1], 'yyyy-MM-dd 00:00:00')
        return GetVerificationList({
          pageParam: pages,
          condition: this.FinancialListForm
        }).then(response => {
          this.FinancialData = response.Data.rows
          this.filterTableData()
          this.listLoading = false
          return response.Data
        })
      },
      filterTableData() {
        this.filterList = this.FinancialData.map(v => {
          return this.filterTableDataItem(v)
        })
      },
      filterTableDataItem(v) {
        // Operation的判断操作
        let Operation = []
        if (v.AuditStatus === 1 || v.AuditStatus === 3) {
          Operation = ['Edit', 'Detailed', 'Delete']
        } else if (v.AuditStatus === 2) {
          Operation = ['Detailed']
        } else {
          Operation = ['Edit', 'Detailed', 'Delete']
        }
        switch (v.VerificationType) {
          case 1:
            v.VerificationType = '应收冲已收'
            break
          case 2:
            v.VerificationType = '应付冲已付'
            break
        }
        return {
          // ID
          KeyID: v.KeyID,
          //  订单编号
          BillNum: v.BillNum,
          // 核销类型
          VerificationType: v.VerificationType,
          // 业务类型
          BusinessType: this.$EnumData.getEnumDesByValue('FinanceBusType', v.BusinessType),
          // 核销金额
          VerificationMoney: v.VerificationMoney,
          //  客户姓名
          CustomerName: v.CustomerName,
          // 核销时间
          VerificationTime: this.$dateFormat(v.VerificationTime),
          // 审核状态
          AuditStatus: this.$EnumData.getEnumDesByValue('AuditStatus', v.AuditStatus),
          // 审核人
          AuditorName: v.AuditorName,
          // 客户账户类别
          CustomerType: this.$EnumData.getEnumDesByValue('CustomerType', v.CustomerType),
          CreaterName: v.CreaterName,
          Operation: Operation
        }
      },
      // 根据查询核销单列表
      submitForm() {
        if (this.FinancialListForm.EntrustTime === null) {
          this.FinancialListForm.EntrustTime = []
        }
        this.$refs.bottomToolBar.search()
      },
      // 重新查询核销单列表
      resetForm() {
        this.FinancialListForm.KeyWord = ''
        this.FinancialListForm.VerificationType = ''
        this.FinancialListForm.BusType = ''
        this.FinancialListForm.EntrustTime = []
        this.StartTime = ''
        this.EndTime = ''
        this.$refs.bottomToolBar.search()
      },
      // 打开新增弹窗
      LookAddFinancial() {
        // this.EditBoxVisible = true
        this.editData = null
        this.$refs['EditVerification'].open()
      },
      handleDetailed(val) {
        this.$nextTick(() => {
          this.$refs['financialDetail'].open({
            KeyID: val
          })
        })
      },
      handleDelete(row, index) {
        this.$confirm('确定删除这条付款单记录?, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DeleteVerification({
            ids: [row.KeyID]
          }).then(({ Data, BusCode, Msg }) => {
            if (Data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.filterList.splice(index, 1)
            } else {
              this.$message({
                type: 'info',
                message: '删除失败!'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleEdit(keyId, idx) {
        this.editingIdx = idx
        GetVerificationDetailed({ keyId }).then(res => {
          this.editData = res.Data
          this.$refs['EditVerification'].open()
        })
      },
      handleInsert(data) {
        this.FinancialData.unshift(data)
        this.filterTableData()
      },
      handleEdited(data) {
        this.$set(this.FinancialData, this.editingIdx, data)
        this.filterTableData()
      }
    }
  }
</script>

<style scoped>
</style>
