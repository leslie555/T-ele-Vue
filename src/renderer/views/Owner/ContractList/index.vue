<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
        <el-form-item label="房源名称" prop="HouseName">
          <el-input v-model="ruleForm.HouseName" placeholder="请输入房源名称"></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="ContractNumber">
          <el-input v-model="ruleForm.ContractNumber" placeholder="请输入合同编号"></el-input>
        </el-form-item>
        <el-form-item label="小区名称" prop="CommunityName">
          <el-input v-model="ruleForm.CommunityName" placeholder="请输入小区名称"></el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="HouseNumber">
          <el-input v-model="ruleForm.HouseNumber" placeholder="请输入房间号"></el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <SelectOrganization v-model="ruleForm.FullIDNew"></SelectOrganization>
          <!-- <el-form-item label="门店" prop="FullID">
            <select-store ref="selectStore" type="search" @change="handleStoreChange"></select-store>
          </el-form-item>
          <el-form-item label="门店人员" prop="EmpFullID">
            <el-select
              v-model="ruleForm.EmpFullID"
              filterable
              remote
              reserve-keyword
              placeholder="请输入出房人姓名或电话"
              :remote-method="comPeopleRemoteMethod"
              :disabled="!StoreKeyID"
              :loading="comPeopleLoading"
            >
              <el-option
                v-for="item in comPeopleResult"
                :key="item.KeyID"
                :label="item.UserName"
                :value="item.FullID"
              >
                <span style="float: left">{{ item.UserName }}</span>
                <span
                  style="float: right; color: #8492a6; font-size: 13px;margin-right: 20px"
                >{{ item.Tel }}</span>
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="租约状态" prop="LeaseStatus">
            <el-select v-model="ruleForm.LeaseStatus" placeholder="请选择租约状态">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.Description"
                :value="item.Value"
                v-for="item in LeaseStatus"
                :key="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同类型" prop="PaperType">
            <el-select v-model="ruleForm.PaperType" placeholder="请选择合同类型">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.Description"
                :value="item.Value"
                v-for="item in PaperType"
                :key="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="审核状态" prop="AuditStatus">
            <el-select v-model="ruleForm.AuditStatus" placeholder="请选择审核状态">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.Description"
                :value="item.Value"
                v-for="item in AuditStatus"
                :key="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="120px" label="托管开始时间" prop="EntrustTime1">
            <el-date-picker
              v-model="ruleForm.EntrustTime1"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              :default-time="['00:00:00', '23:59:59']"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label-width="120px" label="托管结束时间" prop="EntrustTime2">
            <el-date-picker
              v-model="ruleForm.EntrustTime2"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              :default-time="['00:00:00', '23:59:59']"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="业主电话" prop="OwnerPhone">
            <el-input v-model="ruleForm.OwnerPhone" placeholder="请输入业主电话"></el-input>
          </el-form-item>
          <el-form-item label="添加时间" prop="CreateTime">
            <el-date-picker
              v-model="ruleForm.CreateTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              :default-time="['00:00:00', '23:59:59']"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>
        <!--         <div class="clearfix form-item-sm">
          <el-form-item label="小区名称" prop="CommunityName">
            <el-input v-model="ruleForm.CommunityName" autocomplete="off" placeholder="输入小区名称"></el-input>
          </el-form-item>
          <el-form-item label="房源楼栋" prop="Building" class="form-item-xs">
            <el-input v-model="ruleForm.Building" autocomplete="off" placeholder="楼栋"></el-input>
          </el-form-item>
          <el-form-item label="单元" prop="UnitNumber" class="form-item-xs">
            <el-input v-model="ruleForm.UnitNumber" autocomplete="off" placeholder="单元"></el-input>
          </el-form-item>
          <el-form-item label="门牌号" prop="RoomNumber" class="form-item-xs">
            <el-input v-model="ruleForm.RoomNumber" autocomplete="off" placeholder="门牌号"></el-input>
          </el-form-item>
        </div>-->
      </template>
      <template slot="button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="goEditContract" v-setbtn:Add>新增合同</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table
        :data="filterList"
        ref="multipleTable"
        @selection-change="tableSelect"
        v-loading.body="listLoading"
        element-loading-text="加载中"
        border
        fit
        height="100%"
        class="table-normal"
      >
        <el-table-column
          align="center"
          type="selection"
          fixed="left"
          :selectable="selectable"
          width="55"
        ></el-table-column>
        <el-table-column align="center" label="房源名称" fixed="left" width="200" prop="HouseName"></el-table-column>
        <el-table-column align="left" header-align="center" label="合同编号" min-width="130">
          <template slot-scope="scope">
            <div>
              <i
                class="iconfont icon-shouji-copy-copy phone-flag"
                v-show="scope.row.FirstInputTerminal==1"
              ></i>
              <template
                v-if="scope.row.PaperTypeNum===1&&scope.row.ContractNumber"
              >{{scope.row.CompanyAbbreviation}}</template>
              {{scope.row.ContractNumber}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" header-align="center" label="业主信息" min-width="130">
          <template slot-scope="scope">
            <div>{{scope.row.OwnerName}}</div>
            <div>{{scope.row.OwnerPhone}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="托管时间" min-width="200">
          <template slot-scope="scope">
            <div>{{scope.row.HostStartTime}}至{{scope.row.HostEndTime}}</div>
            <div>{{scope.row.TimeLength}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下期付款日" min-width="120" prop="NextPayDate"></el-table-column>
        <el-table-column align="center" label="合同类型" min-width="100" prop="PaperType"></el-table-column>
        <el-table-column align="center" label="租约状态" min-width="100" prop="LeaseStatus"></el-table-column>
        <el-table-column align="center" label="审核状态" min-width="100" prop="AuditStatus"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="300">
          <template slot-scope="scope">
            <table-buttons
              :options="operation2button"
              :condition="scope.row.Operation"
              @handleEditClick="handleEdit(scope.row)"
              @handleAfterAuditEditClick="handleAfterAuditEdit(scope.row)"
              @handleDetailClick="handleDetail(scope.row)"
              @handleDeleteClick="handleDelete(scope.row)"
              @handleRenewClick="handleRenew(scope.row)"
              @handleCheckOutClick="handleCheckOut(scope.row)"
              @handleSignUpClick="handleSignUp(scope.row)"
              @handleSubmitAuditClick="handleSubmitAudit(scope.row)"
              @handleWithdrawClick="handleWithdraw(scope.row)"
              @handleCheckOutEditClick="handleCheckOutEdit(scope.row)"
              @handleVisitRecordClick="handleVisitRecord(scope.row)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :checkedLength="tableSelected.length"
      :page-size="pageSize"
      :handlePageChange="fetchData"
    >
      <el-button
        type="danger"
        icon="delete"
        size="mini"
        :disabled="tableSelected.length === 0"
        @click="handleDeleteAll"
      >
        <span>批量删除</span>
      </el-button>
    </bottom-tool-bar>
    <settlement ref="settlement" :bus-type="0" @success="checkOutSuccess"></settlement>
    <visit-record-dialog ref="visitRecord" ></visit-record-dialog>
  </div>
</template>
<style scoped lang="scss">
  @import "style";
</style>
<script>
  import { deleteOwnerContractByIDs, getContractList, ownerSubmitAudit, ownerWithDrawByID } from '@/api/owner'
  import { getEmployeeInfoList } from '../../../api/system'

  import { BottomToolBar, SearchPanel, Settlement, TableButtons, SelectStore, SelectOrganization } from '../../../components'
  import { diffTime } from '../../../utils/dateFormat'
  import { VisitRecordDialog } from '../../Tenant/ContractList/components'
  export default {
    name: 'OwnerContractList',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      Settlement,
      SelectStore,
      SelectOrganization,
      VisitRecordDialog
    },
    data() {
      return {
        list: [],
        filterList: [],
        listLoading: true,
        tableSelected: [],
        pageSize: 10,
        operation2button: [
          {
            key: 'Detail',
            value: '查看',
            type: 'default'
          },
          {
            key: 'Edit',
            value: '修改',
            type: 'primary'
          },
          {
            key: 'AfterAuditEdit',
            value: '修改',
            type: 'primary'
          },
          {
            key: 'Delete',
            value: '删除',
            type: 'danger'
          },
          {
            key: 'Renew',
            value: '续约',
            type: 'primary'
          },
          {
            key: 'CheckOut',
            value: '退房',
            type: 'success'
          },
          {
            key: 'CheckOutEdit',
            value: '修改退房',
            type: 'primary'
          },
          {
            key: 'SignUp',
            value: '现场签字',
            type: 'primary'
          },
          {
            key: 'SubmitAudit',
            value: '提交审核',
            type: 'primary'
          },
          {
            key: 'Withdraw',
            value: '撤回',
            type: 'danger'
          },
          {
            key: 'VisitRecord',
            value: '回访记录',
            type: 'primary'
          }
        ],
        ruleForm: {
          HouseName: '',
          FullID: '',
          LeaseStatus: '',
          AuditStatus: '',
          PaperType: '',
          EntrustTime1: [], // 托管开始
          EntrustTime2: [], // 托管结束
          CreateTime: [],
          OwnerPhone: '',
          CommunityName: '',
          ContractNumber: '',
          HouseNumber: '',
          EmpFullID: '',
          FullIDNew: ''
        },
        StoreKeyID: 0,
        comPeopleLoading: false,
        comPeopleResult: [] // 选择人员待选的数据
      }
    },
    computed: {
      LeaseStatus() {
        return this.$EnumData.getEnumListByKey('LeaseStatus')
      },
      PaperType() {
        return this.$EnumData.getEnumListByKey('PaperType')
      },
      AuditStatus() {
        return this.$EnumData.getEnumListByKey('AuditStatus')
      }
    },
    created() {
      //
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
        if (!this.ruleForm.EntrustTime1) {
          this.ruleForm.EntrustTime1 = []
        }
        if (!this.ruleForm.EntrustTime2) {
          this.ruleForm.EntrustTime2 = []
        }
        if (!this.ruleForm.CreateTime) {
          this.ruleForm.CreateTime = []
        }
        return getContractList({
          parm: pages,
          screen: {
            ...this.ruleForm,
            StartTime: this.$dateFormat(
              this.ruleForm.EntrustTime1[0],
              'yyyy-MM-dd hh:mm:ss'
            ),
            EndTime: this.$dateFormat(
              this.ruleForm.EntrustTime1[1],
              'yyyy-MM-dd hh:mm:ss'
            ),
            EndStartTime: this.$dateFormat(
              this.ruleForm.EntrustTime2[0],
              'yyyy-MM-dd hh:mm:ss'
            ),
            EndEndTime: this.$dateFormat(
              this.ruleForm.EntrustTime2[1],
              'yyyy-MM-dd hh:mm:ss'
            ),
            CreaterStartTime: this.$dateFormat(
              this.ruleForm.CreateTime[0],
              'yyyy-MM-dd hh:mm:ss'
            ),
            CreaterEndTime: this.$dateFormat(
              this.ruleForm.CreateTime[1],
              'yyyy-MM-dd hh:mm:ss'
            )
          }
        })
          .then(({ Data }) => {
            this.list = Data.rows
            this.filterTableData()
            this.listLoading = false
            return Data
          })
          .catch(() => {
            this.listLoading = false
          })
      },
      filterTableData() {
        this.filterList = []
        this.list.map(v => {
          this.filterList.push(this.filterTableDataItem(v))
        })
      },
      filterTableDataItem(v) {
        // Operation的判断操作
        let Operation = []
        if (v.LeaseStatus === 1) {
          Operation = ['Detail', 'Edit', 'Delete']
          if (v.IsSigned === 1 && v.FirstInputTerminal === 1) {
            Operation = ['Detail', 'Edit', 'SubmitAudit', 'Delete']
          }
          if (v.IsInverseAudit) {
            Operation = ['Detail', 'Edit']
          }
        } else if (v.LeaseStatus === 2) {
          Operation = ['Detail', 'SignUp', 'Withdraw']
        } else if (v.LeaseStatus === 3) {
          if (v.AuditStatus === 1) {
            Operation = ['Detail', 'Withdraw']
          } else if (v.AuditStatus === 2) {
            Operation = ['Detail', 'CheckOut', 'Renew', 'AfterAuditEdit', 'VisitRecord']
          } else if (v.AuditStatus === 3) {
            Operation = ['Detail', 'Withdraw']
          }
        } else if (v.LeaseStatus === 4) {
          if (v.AuditStatus === 1) {
            Operation = ['Detail']
          }
          if (v.AuditStatus === 2) {
            Operation = ['Detail', 'VisitRecord']
          } else if (v.AuditStatus === 3) {
            Operation = ['Detail', 'CheckOutEdit']
          }
        } else if (v.LeaseStatus === 5) {
           if (v.AuditStatus === 2) {
              Operation = ['Detail', 'VisitRecord']
            } else {
              Operation = ['Detail']
            }
          // Operation = ['Detail', 'VisitRecord']
        }
        return {
          KeyID: v.KeyID,
          HouseName: v.HouseName,
          HouseID: v.HouseID,
          HouseKey: v.HouseKey,
          OwnerName: v.OwnerName,
          OwnerPhone: v.OwnerPhone,
          CardIDFrontUrl: v.CardIDFront && v.CardIDFront.length > 0 ? v.CardIDFront[0].ImageLocation : '',
          CardIDBackUrl: v.CardIDBack && v.CardIDBack.length > 0 ? v.CardIDBack[0].ImageLocation : '',
          OwnerIDCard: v.OwnerIDCard,
          ContractNumber: v.ContractNumber,
          IsInverseAudit: v.IsInverseAudit,
          CompanyAbbreviation: v.CompanyAbbreviation,
          HostStartTime: this.$dateFormat(v.HostStartTime),
          HostEndTime: this.$dateFormat(v.HostEndTime),
          TimeLength: diffTime(v.HostStartTime, v.HostEndTime),
          NextPayDate: this.$dateFormat(v.NextPayDate),
          PaperType: this.$EnumData.getEnumDesByValue('PaperType', v.PaperType),
          PaperTypeNum: v.PaperType,
          LeaseStatus: this.$EnumData.getEnumDesByValue(
            'LeaseStatus',
            v.LeaseStatus
          ),
          LeaseStatusNum: v.LeaseStatus,
          AuditStatus: this.$EnumData.getEnumDesByValue(
            'AuditStatus',
            v.AuditStatus
          ),
          AuditStatusNum: v.AuditStatus,
          FirstInputTerminal: v.FirstInputTerminal,
          IsSigned: v.IsSigned,
          Operation
        }
      },
      handleStoreChange(val) {
        // 选择门店后的回调
        if (val) {
          this.StoreKeyID = val.id
          this.ruleForm.FullID = val.fullID
        } else {
          this.StoreKeyID = 0
          this.ruleForm.FullID = ''
          this.ruleForm.EmpFullID = ''
        }
      },
      comPeopleRemoteMethod(query) {
        // 选择门店获取数据方法
        if (query !== '') {
          this.comPeopleLoading = true
          getEmployeeInfoList({
            parm: {
              page: 1,
              size: 10
            },
            Keyword: query,
            SelectByID: this.StoreKeyID
          }).then(({ Data }) => {
            this.comPeopleLoading = false
            this.comPeopleResult = Data
          })
        } else {
          this.comPeopleResult = []
        }
      },
      submitForm() {
        console.log(this.ruleForm)
        debugger
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$refs.bottomToolBar.search()
          }
        })
      },
      resetForm() {
        this.$refs.ruleForm.resetFields()
        // this.$refs.selectStore.reset()
        this.comPeopleResult = []
        this.StoreKeyID = 0
        this.$refs.bottomToolBar.search()
      },
      handleEdit(row) {
        const query = {
          KeyID: row.KeyID
        }
        this.$router.push({
          path: '/Owner/EditContract',
          query
        })
      },
      handleAfterAuditEdit(row) {
        const query = {
          KeyID: row.KeyID,
          SafeEdit: true
        }
        this.$router.push({
          path: '/Owner/EditContract',
          query
        })
      },
      handleDelete(row) {
        this.$confirm('确定要删除该合同？', '提示').then(() => {
          deleteOwnerContractByIDs({
            ids: [row.KeyID]
          }).then(() => {
            const index = this.filterList.findIndex(v => v.KeyID === row.KeyID)
            this.filterList.splice(index, 1)
            this.$message.success('删除合同成功')
          })
        })
      },
      handleDetail(row) {
        this.$router.push({
          path: '/Owner/ContractDetail',
          query: {
            KeyID: row.KeyID
          }
        })
      },
      handleRenew(row) {
        this.$router.push({
          path: '/Owner/AddContract',
          query: {
            KeyID: row.KeyID,
            Renew: true
          }
        })
      },
      handleSignUp(row) {
        //
        this.$router.push({
          path: '/Owner/ContractSign',
          query: {
            Mobile: row.OwnerPhone,
            IDCard: row.OwnerIDCard,
            Name: row.OwnerName,
            Img: row.CardIDFrontUrl,
            ContractID: row.KeyID,
            type: 0
          }
        })
      },
      handleSubmitAudit(row) {
        this.$confirm('确定要提交审核吗？', '提示').then(() => {
          ownerSubmitAudit({
            contractID: row.KeyID
          }).then(({ Data }) => {
            const index = this.list.findIndex(v => v.KeyID === row.KeyID)
            const fIndex = this.filterList.findIndex(v => v.KeyID === row.KeyID)
            this.list[index].LeaseStatus = 3
            this.list[index].AuditStatus = 1
            this.$set(
              this.filterList,
              fIndex,
              this.filterTableDataItem(this.list[index])
            )
            this.$message.success('提交审核成功')
          })
        })
      },
      handleWithdraw(row) {
        this.$confirm('确定要撤回该合同？', '提示').then(() => {
          ownerWithDrawByID({
            contractID: row.KeyID
          }).then(({ Data }) => {
            const index = this.list.findIndex(v => v.KeyID === row.KeyID)
            const fIndex = this.filterList.findIndex(v => v.KeyID === row.KeyID)
            this.list[index].LeaseStatus = 1
            this.list[index].AuditStatus = 0
            this.$set(
              this.filterList,
              fIndex,
              this.filterTableDataItem(this.list[index])
            )
            this.$message.success('撤回合同成功')
          })
        })
      },
      handleCheckOut(row) {
        this.$refs['settlement'].open({
          BookKeepPara: {
            ContractID: row.KeyID,
            HouseID: row.HouseID,
            HouseKey: row.HouseKey,
            HouseName: row.HouseName
          }
        })
      },
      handleCheckOutEdit(row) {
        this.$refs['settlement'].open({
          BookKeepPara: {
            KeyID: row.KeyID
          },
          type: 1,
          detail: true,
          checkOutEdit: true
        })
      },
      // 回访记录
      handleVisitRecord(row) {
        this.$refs['visitRecord'].open({
          row: row,
          Type: 0
        })
        console.log('业主合同列表-回访记录row:', row)
      },
      // 批量选择
      tableSelect(val) {
        this.tableSelected = val
      },
      handleDeleteAll() {
        const ids = []
        this.tableSelected.map(v => {
          ids.push(v.KeyID)
        })
        this.$confirm('确定要批量删除合同？', '提示').then(() => {
          deleteOwnerContractByIDs({
            ids
          }).then(() => {
            ids.map(id => {
              const index = this.filterList.findIndex(v => v.KeyID === id)
              this.filterList.splice(index, 1)
            })
            this.$message.success('删除合同成功')
          })
        })
      },
      goEditContract() {
        this.$router.push({ path: '/Owner/AddContract' })
      },
      selectable(row, index) {
        if (row.LeaseStatusNum === 1) {
          return true
        } else {
          return false
        }
      },
      checkOutSuccess({ BookKeepList }) {
        // 修改合同状态为已退房
        const KeyID = BookKeepList[0].ContractID
        const index = this.list.findIndex(v => v.KeyID === KeyID)
        const fIndex = this.filterList.findIndex(v => v.KeyID === KeyID)
        this.list[index].LeaseStatus = 4
        this.list[index].AuditStatus = 1
        this.$set(
          this.filterList,
          fIndex,
          this.filterTableDataItem(this.list[index])
        )
      }
    }
  }
</script>
