<template>
  <div class="app-container data-list">
    <search-panel :model="form" ref="form" label-width="100px">
      <template slot="search">
        <el-form-item label="关键字" prop="Querykey" class="form-item-md" label-width="100px">
          <el-input placeholder="房源名称/预定人姓名/电话" v-model="form.Querykey"></el-input>
        </el-form-item>
        <SelectOrganization v-model="form.FullIDNew"></SelectOrganization>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item prop="date">
            <el-form-item label="预定提交时间" label-width="100px">
              <el-date-picker
                v-model="form.date"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
          </el-form-item>
        </div>
      </template>
      <template slot="button">
        <el-button size="medium" @click="handleSearch" type="primary">查询</el-button>
        <el-button size="medium" @click="handleReset">重置</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table table-expend">
      <el-table
        :data="OrderDatalist"
        ref="multipleTable"
        v-loading.body="listLoading"
        height="100%"
        element-loading-text="加载中.."
        class="table-normal"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand-form">
              <el-form-item label="房源名称">
                <span>{{ props.row.HouseName }}</span>
              </el-form-item>
              <el-form-item label="预定人信息">
                <span>{{ props.row.OrderName }}</span>
                <span>{{ props.row.OrderPhone }}</span>
                <span>{{ props.row.OrderCardID }}</span>
              </el-form-item>
              <el-form-item label="约定租金">
                <span>{{ $priceFormat(props.row.ConvertionMoney)}}</span>
              </el-form-item>
              <el-form-item label="预定金额">
                <span>{{$priceFormat(props.row.OrderMoney)}}</span>
              </el-form-item>
              <el-form-item label="最晚签约日">
                <span>{{$dateFormat(props.row.LastSignDate)}}</span>
              </el-form-item>
              <el-form-item label="付款方式">
                <span>押 1 付 {{props.row.PayModel}}</span>
              </el-form-item>
              <el-form-item label="最晚付款日">
                <span>提前{{props.row.AdvanceMonth}}月付款</span>
              </el-form-item>
              <el-form-item label="服务费">
                <span>{{$priceFormat(props.row.ServiceFee)}}</span>
              </el-form-item>
              <el-form-item label="约定租期">
                <span>{{$dateFormat(props.row.LeaseStartTime)}}至{{$dateFormat(props.row.LeaseEndTime)}}</span>
              </el-form-item>
              <template v-if="props.row.OrderStatus===5">
                <el-form-item label="付款状态">
                  <span>{{props.row.InOrOutStatus === 2 ? '已付款' : '未付款'}}</span>
                </el-form-item>
                <el-form-item label="取消备注">
                  <span>{{props.row.AgrOrRefRemark||'无'}}</span>
                </el-form-item>
              </template>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" label="房源名称" prop="HouseName" width="220"></el-table-column>
        <el-table-column align="center" prop="TenantInfo" label="预定人信息" min-width="180">
          <template slot-scope="scope">
            <p>{{scope.row.OrderName}}</p>
            <p>{{scope.row.OrderPhone}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="MangerInfo" label="提交人信息" min-width="180">
          <template slot-scope="scope">
            <p>{{scope.row.MangerName}}</p>
            <p>{{scope.row.MangerPhone}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="预定人身份证" prop="OrderCardID" width="170"></el-table-column>
        <el-table-column label="预定金额" min-width="100" prop="OrderMoney" align="center">
          <template slot-scope="scope">
            <span>{{$priceFormat(scope.row.OrderMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="status-col"
          label="约定租金"
          prop="ConvertionMoney"
          min-width="120"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{$priceFormat(scope.row.ConvertionMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="LastSignDate" label="最晚签约时间" min-width="150">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.LastSignDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="约定租期" min-width="230" prop="Date" align="center">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.LeaseStartTime)}}至{{$dateFormat(scope.row.LeaseEndTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="OrderSubmitTime" label="预定提交时间" min-width="150">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.OrderSubmitTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="Remark" label="备注" min-width="180">
          <template slot-scope="scope">
            <table-remark :options="tableRemarkOptions" :allRemark="scope.row.Remark || '无'"></table-remark>
          </template>
        </el-table-column>
        <el-table-column align="center" label="预定状态" prop="OrderStatus" min-width="130">
          <template slot-scope="scope">
            <span>{{$EnumData.getEnumDesByValue('OrderStatus',scope.row.OrderStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态" prop="AuditStatus" min-width="150">
          <template slot-scope="scope">
            <span>{{$EnumData.getEnumDesByValue('AuditStatus',scope.row.AuditStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核人" prop="AuditorName" min-width="150"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="220">
          <template slot-scope="scope">
            <table-buttons
              :options="operationOrderButton"
              :condition="handeleButtons(scope.row.IsAgreeOrRefuse, scope.row.OrderStatus, scope.row)"
              @handleSignContractClick="handleSignContract(scope.row)"
              @handleCancelClick="handleCancelContract(scope.row,scope.$index)"
              @handleReceiveClick="handleReceiveContract(scope.row,scope.$index)"
              @handlePrintClick="handlePrint(scope.row,scope.$index)"
              @handleEditClick="handleEdit(scope.row,scope.$index)"
              @handleEditAgentClick="handleEditAgent(scope.row,scope.$index)"
              @handleConversionClick="handleConversion(scope.row,scope.$index)"
              @handleContinueClick="handleContinue(scope.row,scope.$index)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="GetTabeledata"></bottom-tool-bar>
    <pay-box ref="payBox" @updateBillAmount="handlePayComplete"></pay-box>
    <print-template :printOpenLoading="printOpenLoading" ref="printTemplate"></print-template>
    <EditOrder ref="EditOrder" @edited="handleEdited"></EditOrder>
  </div>
</template>
<style lang="scss">
  @import './OrderList';
</style>
<script>
  // GetTenantList 是从API文档中定义过来的方法 暂时没有数据传入
  import { GetOderList, CancelOrderInfo, SelectorderInfoById } from '@/api/tenant'
  // 引入公用样式组件
  import TableButtons from '@/components/TableButtons'
  import TableRemark from '@/components/TableRemark'
  import SearchPanel from '@/components/SearchPanel' // 引入整个样式布局组件
  import BottomToolBar from '@/components/BottomToolBar' // 引入底部布局样式
  import PayBox from '@/components/PayBox'
  import SelectOrganization from '@/components/SelectOrganization'
  import PrintTemplate from './components/PrintTemplate.vue'
  import EditOrder from './components/EditOrder.vue'

  export default {
    name: 'OrderList',
    components: {
      TableButtons,
      TableRemark,
      SearchPanel,
      BottomToolBar,
      PayBox,
      PrintTemplate,
      SelectOrganization,
      EditOrder
    },
    data() {
      return {
        listLoading: true,
        printOpenLoading: false,
        OrderDatalist: [], // 列表渲染数据
        GetMoneyform: {}, // 表格当前行的数据
        pageSize: 10,
        // 定义租客账单查询参数
        form: {
          Querykey: '',
          FullIDNew: '',
          date: [],
          StartTime: '',
          EndTime: '',
          KeyID: 0
        },
        operatingIdx: null, // 当前操作数据的idx
        operationOrderButton: [
          {
            key: 'Cancel',
            value: '取消',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Receive',
            value: '去付款',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'SignContract',
            value: '签合同',
            type: 'success',
            size: 'mini'
          },
          {
            key: 'Print',
            value: '打印',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Edit',
            value: '修改',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'EditAgent',
            value: '修改',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Conversion',
            value: '转定',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Continue',
            value: '续定',
            type: 'primary',
            size: 'mini'
          }
        ],
        tableRemarkOptions: {
          // showWordCount: 10
        }
      }
    },
    activated() {
      if (this.$route.query.KeyID) {
        this.form.KeyID = this.$route.query.KeyID
      }
      this.$refs.bottomToolBar.search(1)
    },
    methods: {
      GetTabeledata(pages) {
        // 分页参数的处理
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        if (!this.form.date) {
          this.form.date = []
        }
        this.form.StartTime = this.$dateFormat(
          this.form.date[0],
          'yyyy-MM-dd hh:mm:ss'
        )
        this.form.EndTime = this.$dateFormat(
          this.form.date[1],
          'yyyy-MM-dd hh:mm:ss'
        )
        return GetOderList({
          parm: pages,
          Querykey: this.form.Querykey,
          StartTime: this.form.StartTime,
          EndTime: this.form.EndTime,
          KeyID: this.form.KeyID,
          FullIDNew: this.form.FullIDNew
        }).then(({ Data, BusCode, Msg }) => {
          if (Data) {
            this.OrderDatalist = Data.rows
            this.listLoading = false
            if (this.form.KeyID) {
              this.$nextTick(() => {
                this.$refs.multipleTable.toggleRowExpansion(this.OrderDatalist[0])
              })
              this.form.KeyID = 0
            }
          } else {
            return false
          }
          return Data
        })
      },
      // 点击查询
      handleSearch() {
        this.$refs.bottomToolBar.search()
      },
      // 点击重置按钮
      handleReset() {
        this.$refs['form'].resetFields()
        this.$refs.bottomToolBar.search()
      },
      handlePrint(row) {
        this.printOpenLoading = true
        SelectorderInfoById({
          keyID: row.KeyID
        })
          .then(({ Data }) => {
            this.$refs['printTemplate'].open(Data)
          })
          .finally(() => {
            this.printOpenLoading = false
          })
      },
      handleEdit(row, idx) {
        // 修改
        this.operatingIdx = idx
        this.$refs.EditOrder.open(row, 1)
      },
      handleEditAgent(row, idx) {
        // 修改
        this.operatingIdx = idx
        this.$refs.EditOrder.open(row, 1, true)
      },
      handleConversion(row, idx) {
        // 转定
        this.operatingIdx = idx
        this.$refs.EditOrder.open(row, 2)
      },
      handleContinue(row, idx) {
        // 续定
        this.operatingIdx = idx
        this.$refs.EditOrder.open(row, 3)
      },
      handleEdited(data, type) {
        if (type === 1) {
          this.$set(this.OrderDatalist, this.operatingIdx, data)
        } else {
          const originData = { ...this.OrderDatalist[this.operatingIdx] }
          if (type === 2) {
            originData.OrderStatus = 9
          }
          this.$set(this.OrderDatalist, this.operatingIdx, originData)
          this.OrderDatalist.unshift(data)
        }
      },
      selectable(row, index) {
        if (row.AuditStatus === 2) {
          return false
        } else {
          return true
        }
      },
      // 后台返回的按钮组渲染
      handeleButtons(tag1, tag2, row) {
        // tag1 表示是否为自己的预定单0是1不是
        /* tag2表示预定状态
           1: '待确认',
           2: '预定成功',
           3: '预定失败',
           4: '快到签约',
           5: '已取消',
           6: '待付款',
           7: '已签约',
           8: '已过期',
           9: '已转定' */

        const btnOptions = []
        if (tag2 !== 5) {
          btnOptions.push('Cancel')
        }
        if (tag2 === 6) {
          if (tag1 === 0 && row.AuditStatus === 2) {
            btnOptions.push('Receive')
          }
        } else if (tag2 === 2) {
          if (tag1 === 0) {
            btnOptions.push(
              ...['SignContract', 'Edit', 'EditAgent', 'Conversion', 'Continue']
            )
          }
        }
        if (tag2 === 2 || tag2 === 7 || tag2 === 9) {
          btnOptions.push('Print')
        }
        return btnOptions
      },
      // 签合同
      handleSignContract(row) {
        this.$router.push({
          path: '/Tenant/AddContract',
          query: {
            OrderID: row.KeyID
          }
        })
      },
      handleCancelContract(row, idx) {
        if (row.IsAgreeOrRefuse === 0) {
          // 本人的预定单不需要备注
          this.$confirm('确定要取消该预定单吗?', '提示').then(() => {
            CancelOrderInfo({
              orderId: row.KeyID
            }).then(res => {
              this.$set(this.OrderDatalist, idx, res.Data)
              this.$message({
                type: 'success',
                message: '取消成功'
              })
            })
          })
        } else {
          this.$prompt('请输入取消的备注', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            CancelOrderInfo({
              orderId: row.KeyID,
              remark: value
            }).then(res => {
              this.$set(this.OrderDatalist, idx, res.Data)
              this.$message({
                type: 'success',
                message: '取消该预定单成功'
              })
            })
          })
        }
      },
      handleReceiveContract(row, idx) {
        this.operatingIdx = idx
        this.$refs.payBox.open(
          3,
          row.KeyID,
          row.OrderMoney,
          row.OrderMoney,
          row.OrderMoney
        )
      },
      handlePayComplete(payData) {
        this.$set(this.OrderDatalist, this.operatingIdx, {
          ...this.OrderDatalist[this.operatingIdx],
          OrderStatus: 2
        })
      }
    }
  }
</script>
