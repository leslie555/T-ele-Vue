<template>
  <div class="app-container data-list">
    <search-panel :model="FormReceiveData" ref="FormReceiveData" label-width="100px">
      <template slot="search">
        <el-form-item label="关键字" prop="keyWord" class="form-item-md">
          <el-input placeholder="单据编号/收款对象"
                    v-model="FormReceiveData.keyWord"
          >
          </el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="收款类型" class="" prop="ReceiptType" label-width="100px">
            <el-select v-model="FormReceiveData.ReceiptType" placeholder="请选择">
              <el-option
                v-for="item in ReceiptType"
                :key="item.Value"
                :label="item.Description"
                :value="item.Value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型" class="" prop="BusType" label-width="100px">
            <el-select v-model="FormReceiveData.BusType" placeholder="请选择">
              <el-option
                v-for="item in BusType"
                :key="item.Value"
                :label="item.Description"
                :value="item.Value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款账户" class="" prop="InitialCashBank" label-width="100px">
            <el-select v-model="FormReceiveData.InitialCashBank" placeholder="请选择">
              <el-option
                v-for="(item,index) in accountData"
                :key="index"
                :label="item.Account"
                :value="item.Account">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款日期" prop="ReceiptData" label-width="100px">
            <el-date-picker
              v-model="FormReceiveData.ReceiptData"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </template>
      <template slot="button">
        <el-button size="medium" @click="handleSearch" type="primary">查询</el-button>
        <el-button size="medium" @click="handleEmptyValue" type="primary">重置</el-button>
        <el-button size="medium" @click="handleAddNew" v-setbtn:Add type="primary">新增</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table
        :data="ReceiveBillDataList"
        ref="multipleTable"
        v-loading.body="listLoading"
        @selection-change="tableSelect"
        element-loading-text="Loading"
        height="100%"
        class="table-normal"
        border fit highlight-current-row>
        <el-table-column
          align="center"
          type="selection"
          fixed="left"
          :selectable="selectable"
          width="55">
        </el-table-column>
        <el-table-column align="center" label='单据编号' min-width="220">
          <template slot-scope="scope">
            {{scope.row.BillNum}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款类型" prop="ReceiptType" min-width="120">
          <template slot-scope="scope">
            <span>{{$EnumData.getEnumDesByValue('ReceiptType',scope.row.ReceiptType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务类型" min-width="120" prop="BusType" align="center">
          <template slot-scope="scope">
            <span>{{$EnumData.getEnumDesByValue('FinanceBusType', scope.row.BusinessType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收款金额" min-width="140" align="center">
          <template slot-scope="scope">
            {{$priceFormat(scope.row.ReceiptMoney)}}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="优惠金额" min-width="120" align="center">
          <template slot-scope="scope">
            <span>{{$priceFormat(scope.row.Discount)}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" prop="ReceivablesDate" label="预收款" min-width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{$priceFormat(scope.row.Advance)}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" prop="ActualDate" label="收款对象" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.CustomerName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ReceivedState" label="结算方式" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.BalanceType}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ReceivedState" label="收款账户" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.InitialCashBank}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="EmployeeName" label="操作人" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.CreaterName || '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="PaymentData" label="收款日期" min-width="120">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.ReceiptData)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="AuditStatus" label="单据状态" min-width="100">
          <template slot-scope="scope">
            <span>{{$EnumData.getEnumDesByValue('AuditStatus',scope.row.AuditStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="Remarks" min-width="180">
          <template slot-scope="scope">
            <table-remark
              :options="tableRemarkOptions"
              :allRemark="scope.row.Remarks || '无'"
            >
            </table-remark>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="230">
          <template slot-scope="scope">
            <table-buttons
              :options="operationOwnerButton"
              :condition="handleButtons(scope.row.AuditStatus)"
              @handleEditClick="handEdit(scope.row)"
              @handleDeleteClick="handleDelete(scope.row, scope.$index)"
              @handleDetailClick="handleDetail(scope.row)"
            >
              <el-popover
                v-setbtn:Print
                v-show="scope.row.AuditStatus===2"
                placement="right"
                width="100"
                trigger="click">
                <div class="popover-btn-list">
                  <el-button type="primary"
                             plain
                             @click="handlePrint(scope.row,1)"
                             size="mini">收款单模板1
                  </el-button>
                  <el-button type="primary"
                             plain
                             @click="handlePrint(scope.row,2)"
                             size="mini">收款单模板2
                  </el-button>
                  <el-button type="primary"
                             plain
                             @click="handlePrint(scope.row,3)"
                             size="mini">房屋押金收据1
                  </el-button>
                </div>
                <el-button slot="reference"
                           plain
                           type="primary"
                           size="mini">打印
                </el-button>
              </el-popover>
            </table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :checkedLength="tableSelected.length"
      :handlePageChange="GetTableData"
    >
      <el-button
        type="danger"
        icon="delete"
        size="mini"
        :disabled="tableSelected.length === 0"
        @click="handleDeleteAll">
        <span>批量删除</span>
      </el-button>
    </bottom-tool-bar>
    <add-new-receipt-single
      ref="newReceiptSingle"
      @AddNewReceiptBill="AddNewReceiptBill"
    >
    </add-new-receipt-single>
    <edit-receipt-single
      ref="editReceiptSing"
      @EditNewReceiptBill="EditNewReceiptBill"
    >
    </edit-receipt-single>
    <detail-receipt-single
      ref="detailreceipt"
    >
    </detail-receipt-single>
    <print-template ref="printTemplate"></print-template>
  </div>
</template>
<script>
  // GetTenantList 是从API文档中定义过来的方法
  import { mapActions, mapGetters } from 'vuex'
  import { DeleteReceiveSingle, GetReceiveList } from '@/api/tenantBill'
  // 引入公用样式组件
  import AddNewReceiptSingle from './components/AddNewReceiptSingle'
  import EditReceiptSingle from './components/EditReceiptSingle'
  import TableButtons from '@/components/TableButtons'
  import TableRemark from '@/components/TableRemark'
  import SearchPanel from '@/components/SearchPanel' // 引入整个样式布局组件
  import BottomToolBar from '@/components/BottomToolBar'
  import DetailReceiptSingle from './components/DetailReceiptSingle' // 引入底部布局样式
  import PrintTemplate from '@/components/PrintTemplate' // 打印组件
  export default {
    name: 'ReceiptBill',
    data() {
      return {
        ReceiveBillDataList: [], // 定义表格获取数据的属性
        listLoading: false,
        pageSize: 10,
        ReceiptEditData: {}, // 父组件修改,传给子组件的值
        tableSelected: [],
        // 定义租客账单查询参数
        FormReceiveData: {
          keyWord: '',
          BusType: this.$EnumData.getEnumDesByValue('FinanceBusType'), // 业务类型
          ReceiptType: this.$EnumData.getEnumDesByValue('ReceiptType'), // 支付类型
          ReceiptData: [],
          StartTime: '',
          EndTime: '',
          InitialCashBank: []
        },
        operationOwnerButton: [
          {
            key: 'Detail',
            value: '详情',
            type: 'default',
            size: 'mini'
          },
          {
            key: 'Edit',
            value: '修改',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Delete',
            value: '删除',
            type: 'danger',
            size: 'mini'
          }],
        tableRemarkOptions: {}
      }
    },
    components: {
      DetailReceiptSingle,
      TableButtons,
      SearchPanel,
      BottomToolBar,
      AddNewReceiptSingle,
      EditReceiptSingle,
      TableRemark,
      PrintTemplate
    },
    // 请求ajax中定义的方法
    created() {
      this.refreshAccountItem()
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    methods: {
      GetTableData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        if (!this.FormReceiveData.ReceiptData) {
          this.FormReceiveData.ReceiptData = []
        }
        this.FormReceiveData.StartTime = this.FormReceiveData.ReceiptData[0]
        this.FormReceiveData.EndTime = this.FormReceiveData.ReceiptData[1]
        return GetReceiveList({
          pageParam: pages,
          condition: this.FormReceiveData
        }).then(({ Data, BusCode, Msg }) => {
          console.log(Data)
          if (Data) {
            this.ReceiveBillDataList = Data.rows
            this.listLoading = false
          } else {
            return
          }
          return Data
        })
      },
      // 点击查询
      handleSearch() {
        this.$refs.bottomToolBar.search()
      },
      ...mapActions([
        'refreshAccountItem'
      ]),
      // 点击重置按钮
      handleEmptyValue() {
        this.$refs['FormReceiveData'].resetFields()
        this.$refs.bottomToolBar.search()
      },
      // 点击新增按钮
      handleAddNew() {
        this.$refs['newReceiptSingle'].open()
      },
      // 点击修改按钮
      handEdit(row) {
        this.$refs['editReceiptSing'].open(row)
        // this.ReceiptEditData = Object.assign({}, row)
      },
      tableSelect(val) {
        this.tableSelected = val
      },
      // 批量删除
      handleDeleteAll() {
        const ids = []
        this.tableSelected.map(v => {
          ids.push(v.KeyID)
        })
        this.$confirm('是否批量删除当前收款单, 是否继续?', '提示', {
          type: 'warning',
          center: true
        }).then(() => {
          DeleteReceiveSingle({
            ids
          }).then(() => {
            ids.map(id => {
              const index = this.ReceiveBillDataList.findIndex(v => v.KeyID === id)
              this.ReceiveBillDataList.splice(index, 1)
            })
            this.$message.success('删除收款单成功')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      // 点击单个删除按钮
      handleDelete(row, index) {
        console.log(index)
        this.$confirm('确定删除这条收款单记录?, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DeleteReceiveSingle({
            ids: [row.KeyID]
          }).then(({ Data, BusCode, Msg }) => {
            if (Data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.ReceiveBillDataList.splice(index, 1)
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
      handleDetail(row) {
        this.$refs['detailreceipt'].open(row)
      },
      // 接收渲染到表格的值(新增收款单)
      AddNewReceiptBill(data) {
        const index = this.ReceiveBillDataList.findIndex(item => {
          return item.KeyID === data.KeyID
        })
        if (index === -1) {
          this.ReceiveBillDataList.unshift(data)
          this.GetTableData()
        }
      },
      // 修改付款单
      EditNewReceiptBill(data) {
        this.ReceiveBillDataList.forEach(item => {
          if (item.KeyID === data.KeyID) {
            item.BillNum = data.BillNum
            item.ReceiptType = data.ReceiptType
            item.BusinessType = data.BusinessType
            item.ReceiptMoney = data.ReceiptMoney
            item.Discount = data.Discount
            item.Advance = data.Advance
            item.CustomerName = data.CustomerName
            item.BalanceType = data.BalanceType
            item.InitialCashBank = data.InitialCashBank
            item.EmployeeName = data.EmployeeName
            item.ReceiptData = data.ReceiptData
            item.AuditStatus = data.AuditStatus
            item.Remarks = data.Remarks
          }
        })
      },
      // 渲染按钮组
      handleButtons(tag) {
        switch (tag) {
          case 0:
            return ['Edit', 'Detail']
          case 1:
            return ['Edit', 'Delete', 'Detail']
          case 2:
            return ['Detail']
          case 3:
            return ['Edit', 'Delete', 'Detail']
        }
      },
      selectable(row, index) {
        if (row.AuditStatus === 2) {
          return false
        } else {
          return true
        }
      },
      handlePrint(row, type = 1) {
        //
        this.$refs.printTemplate.open({
          busType: 'ReceiptBill',
          busNum: type,
          title: '',
          IsShowYear: '',
          isList: 'yes',
          row
        })
      }
    },
    computed: {
      // 业务类型枚举(7个)
      BusType() {
        return this.$EnumData.getEnumListByKey('FinanceBusType')
      },
      // 付款类型
      ReceiptType() {
        return this.$EnumData.getEnumListByKey('ReceiptType')
      },
      ...mapGetters([
        'accountData'
      ])
    }
  }
</script>

<style scoped>
</style>
