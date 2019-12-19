<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
        <el-form-item label="房源名称" prop="HouseName">
          <el-input
            placeholder="房源名称"
            v-model="ruleForm.HouseName"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="ContractNumber">
          <el-input
            placeholder="合同编号"
            v-model="ruleForm.ContractNumber"
            style="width: 120px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="小区名称" prop="CommunityName">
          <el-input
            placeholder="小区名称"
            v-model="ruleForm.CommunityName"
            style="width: 150px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="RoomNumber">
          <el-input
            placeholder="房间号"
            v-model="ruleForm.RoomNumber"
            style="width: 200px"
          >
          </el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="收支状态" prop="InOrOutStatus">
            <el-select v-model="ruleForm.InOrOutStatus" placeholder="请选择">
              <el-option
                v-for="item in InOrOutStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收支类型" prop="InOrOut">
            <el-select v-model="ruleForm.InOrOut" placeholder="请选择">
              <el-option
                v-for="item in InOrOut"
                :key="item.Value"
                :label="item.Description"
                :value="item.Value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目" prop="MarkArr">
            <el-cascader
              v-model="ruleForm.MarkArr"
              :options="billItem.data"
              :props="billItem.props"
              expand-trigger="hover"
              filterable
              clearable
            >
            </el-cascader>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="收支日期" prop="date">
            <el-date-picker
              v-model="ruleForm.date"
              type="daterange"
              :default-time="['00:00:00', '23:59:59']"
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
        <el-button size="medium" @click="handleReset" type="primary">重置</el-button>
        <el-button size="medium" @click="handleAdd" type="primary" v-setbtn:Add>记一笔账</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table table-expend">
      <el-table :data="list"
                ref="multipleTable"
                @selection-change="tableSelect"
                v-loading.body="listLoading"
                element-loading-text="加载中"
                height="100%"
                class="noSplit"
                border fit>
        <el-table-column
          align="center"
          type="selection"
          fixed="left"
          :selectable="selectable"
          width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand-form">
              <el-form-item label="房源名称">{{props.row.HouseName}}</el-form-item>
              <el-form-item label="项目名称">{{props.row.BillProjectName}}</el-form-item>
              <el-form-item label="收支类型">{{props.row.InOrOut?$EnumData.getEnumDesByValue('InOrOut',
                props.row.InOrOut):''}}
              </el-form-item>
              <el-form-item label="金额">
                {{$priceFormat(props.row.Amount)}}
                {{props.row.PaidMoney - 0 > 0 && ((props.row.PaidMoney - 0) !== (props.row.Amount - 0)) ? '(已付'+ props.row.PaidMoney + ')': ''}}
              </el-form-item>
              <el-form-item label="收支日期">{{$dateFormat(props.row.ReceivablesDate)}}</el-form-item>
              <el-form-item label="收支状态">{{props.row.InOrOutStatus?InOrOutStatusArr[props.row.InOrOutStatus]:''}}
              </el-form-item>
              <el-form-item label="备注">
                <p>{{ props.row.Remark || '无' }}</p>
              </el-form-item>
              <el-form-item label="图片凭证">
                <div class="table-expand-img-box">
                  <template v-if="props.row.ImageUpload">
                    <div class="table-expand-img" v-for="(item,index) in props.row.ImageUpload" :key="index">
                      <img :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                           @click="$seeImage($ImgUnit.getImgUrl(item.ImageLocation))">
                    </div>
                  </template>
                  <template v-else>无</template>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label='房源名称' min-width="240" prop="HouseName">
        </el-table-column>
        <el-table-column align="center" label="收支类型" min-width="80">
          <template slot-scope="scope">
            {{scope.row.InOrOut?$EnumData.getEnumDesByValue('InOrOut', scope.row.InOrOut):''}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="项目" min-width="120" prop="BillProjectName"></el-table-column>
        <el-table-column align="center" label="金额" min-width="100">
          <template slot-scope="scope">
            {{$priceFormat(scope.row.Amount)}}
            {{scope.row.PaidMoney - 0 > 0 && ((scope.row.PaidMoney - 0) !== (scope.row.Amount - 0)) ? '(已付'+ scope.row.PaidMoney + ')': ''}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="收支日期" min-width="140">
          <template slot-scope="scope">
            {{$dateFormat(scope.row.ReceivablesDate)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="收支状态" min-width="120">
          <template slot-scope="scope">
            {{scope.row.InOrOutStatus?InOrOutStatusArr[scope.row.InOrOutStatus]:''}}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="250">
          <template slot-scope="scope">
            <table-buttons
              :showAll="true"
              :options="operation2button"
              :condition="handleButtons(scope.row)"
              @handleDeleteClick="handleDelete(scope.row)"
              @handleEditClick="handleEdit(scope.row)"
              @handleToPayClick="handlePay(scope.row)"
            >
            </table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :checkedLength="tableSelected.length" :page-size="pageSize"
                     :handlePageChange="fetchData">
      <el-button
        type="danger"
        icon="delete"
        size="mini"
        :disabled="tableSelected.length === 0"
        @click="handleDeleteAll">
        <span>批量删除</span>
      </el-button>
    </bottom-tool-bar>
    <!--<pay-box ref="topay" @updateBill="updateBookKeep"></pay-box>-->
    <SelectPayAmount ref="topay" @updateBill="updateBookKeep"></SelectPayAmount>
    <settlement ref="settlement" :bus-type="4" :api-type="1" @success="settlementSuccess"></settlement>
  </div>
</template>
<style lang="scss">
  @import "../../../styles/reset";
</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import { deleteBookKeepByIDs, getBookKeepingList } from '../../../api/finance'
  // 引入公用样式组件
  import { BottomToolBar, SearchPanel, Settlement, TableButtons, SelectPayAmount } from '../../../components'
  import uuid from '../../../utils/uuid'

  export default {
    name: 'BookKeeping',
    data() {
      return {
        list: [],
        listLoading: false,
        tableSelected: [],
        InOrOutStatus: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '未收',
            value: 1
          },
          {
            label: '已收',
            value: 2
          },
          {
            label: '未支',
            value: 3
          },
          {
            label: '已支',
            value: 4
          },
          {
            label: '部分收',
            value: 5
          },
          {
            label: '部分支',
            value: 6
          }
        ],
        InOrOutStatusArr: ['', '未收', '已收', '未支', '已支', '部分收', '部分支'],
        pageSize: 10,
        // 定义记账本查询参数
        ruleForm: {
          HouseName: '',
          ContractNumber: '',
          CommunityName: '',
          RoomNumber: '',
          InOrOutStatus: '',
          InOrOut: '',
          date: [],
          MarkArr: []
        },
        operation2button: [
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
          },
          {
            key: 'ToPay',
            value: '去支付',
            type: 'primary',
            size: 'mini'
          }
        ]
      }
    },
    components: {
      SelectPayAmount,
      TableButtons,
      SearchPanel,
      BottomToolBar,
      Settlement
    },
    // 请求ajax中定义的方法
    created() {
      this.refreshBillItem()
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    methods: {
      ...mapActions([
        'refreshBillItem'
      ]),
      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        if (!this.ruleForm.date) {
          this.ruleForm.date = []
        }
        return getBookKeepingList({
          pageParam: pages,
          condition: {
            ...this.ruleForm,
            StartTime: this.$dateFormat(this.ruleForm.date[0], 'yyyy-MM-dd hh:mm:ss'),
            EndTime: this.$dateFormat(this.ruleForm.date[0], 'yyyy-MM-dd hh:mm:ss'),
            BillProjectID: this.ruleForm.MarkArr[1]
          }
        }).then(({ Data, BusCode, Msg }) => {
          this.list = Data.rows
          this.listLoading = false
          return Data
        }).catch(() => {
          this.listLoading = false
        })
      },
      // 点击查询
      handleSearch() {
        this.$refs.bottomToolBar.search()
      },
      // 点击重置按钮
      handleReset() {
        this.$refs.ruleForm.resetFields()
        this.$refs.bottomToolBar.search()
      },
      // 点击删除
      handleDelete(row) {
        this.$confirm('确定删除这条记账本的数据？, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBookKeepByIDs({
            ids: [row.KeyID]
          }).then(({ Data, BusCode, Msg }) => {
            this.$message.success('删除成功!')
            const index = this.list.findIndex(v => v.KeyID === row.KeyID)
            this.list.splice(index, 1)
          }).catch(() => {
            // this.$message.error('删除失败!')
          })
        })
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
        this.$confirm('确定要批量记账数据？,是否继续？', '提示').then(() => {
          deleteBookKeepByIDs({
            ids
          }).then(() => {
            ids.map(id => {
              const index = this.list.findIndex(v => v.KeyID === id)
              this.list.splice(index, 1)
            })
            this.$message.success('删除合同成功')
          })
        })
      },
      // 点击修改
      handleEdit(row) {
        this.$refs['settlement'].open({
          BookKeepPara: row,
          type: 1
        })
      },
      // 点击记一笔账按钮
      handleAdd() {
        this.$refs['settlement'].open({
          BookKeepPara: {
            uuid: uuid()
          },
          type: 0
        })
      },
      // 去支付
      handlePay(item) {
        // 0：待收账单 1：记账本，2：收款单
        this.$refs['topay'].open(1, item.KeyID, item.Amount, item.UnPaidMoney)
      },
      updateBookKeep(billObj) {
        const index = this.list.findIndex(item => {
          return item.KeyID === billObj.billId
        })
        // 重新计算列表中支付账单的未收金额,如果该账单已经支付完成，修改收支状态
        const item = this.list[index]
        const unPaidMoney = item.UnPaidMoney - 0
        const paidAmount = billObj.payAmount - 0
        // 部分付款后将该数据改为部分收状态
        if (unPaidMoney > paidAmount) {
          item.UnPaidMoney = billObj.unPaidAmount
          item.PaidMoney = billObj.totalPaidMoney
          item.InOrOutStatus = 5
        }
        // 付完所有金额后修改为已收状态
        if (unPaidMoney === paidAmount) {
          item.UnPaidMoney = 0
          item.PaidMoney = billObj.totalPaidMoney
          item.InOrOutStatus = 2
        }
        this.$set(this.list, index, item)
      },
      settlementSuccess({ BookKeepList, type }) {
        BookKeepList.forEach(v => {
          v.InOrOutStatus = v.InOrOut * 2 - 1
        })
        if (type === 0) {
          // 新增
          this.list.unshift(...BookKeepList)
        } else {
          // 修改
          const item = BookKeepList[0]
          const index = this.list.findIndex(v => (v.uuid && v.uuid === item.uuid || v.KeyID && v.KeyID === item.KeyID))
          this.$set(this.list, index, item)
        }
      },
      selectable(row, index) {
        if (row.InOrOutStatus === 1 || row.InOrOutStatus === 3) {
          return true
        } else {
          return false
        }
      },
      // 渲染按钮组
      handleButtons(item) {
        let result = []
        switch (item.InOrOutStatus) {
          case 1:
            result = ['Edit', 'Delete']
            break
          case 2:
            result = []
            break
          case 3:
            result = ['Edit', 'Delete']
            break
          case 4:
            result = []
            break
          case 5:
            result = []
            break
          case 6:
            result = []
            break
        }
        if (item.HouseKey && (item.InOrOutStatus === 1 || item.InOrOutStatus === 5)) {
          result.push('ToPay')
        }
        return result
      }
    },
    computed: {
      // 计算账单项目
      ...mapGetters([
        'billItem'
      ]),
      // 收支类型(2)
      InOrOut() {
        const InOrOut = this.$EnumData.getEnumListByKey('InOrOut')
        InOrOut[0].Description = '全部'
        InOrOut[0].Value = ''
        return InOrOut
      },
      // 审核状态
      AuditStatus() {
        return this.$EnumData.getEnumListByKey('AuditStatus')
      }
    }
  }
</script>
