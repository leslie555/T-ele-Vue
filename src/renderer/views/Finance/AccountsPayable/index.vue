<template>
  <div class="app-container data-list">
    <search-panel :model="form" ref="form" label-width="80px">
      <template slot="search">
        <el-form-item label="关键字" prop="keyWord" class="form-item-md">
          <el-input placeholder="账单编号/业务描述/项目名称"
                    v-model="form.keyWord"
          >
          </el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="业务类型" prop="BusType" class="form-item-sm">
            <el-select v-model="form.BusType" placeholder="请选择">
              <el-option
                v-for="item in BusType"
                :key="item.Value"
                :label="item.Description"
                :value="item.Value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PayableDate">
            <el-form-item label="应付日期">
              <el-date-picker
                v-model="form.PayableDate"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-form-item>
        </div>
      </template>
      <template slot="button">
        <el-button size="medium" @click="handleSearch" type="primary">查询</el-button>
        <el-button size="medium" @click="handleReset" type="primary">重置</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table
        :data="PaymentListDatas"
        ref="multipleTable"
        v-loading.body="listLoading"
        height="100%"
        element-loading-text="Loading"
        class="table-normal"
        border fit highlight-current-row
      >
        <el-table-column align="center" label='账单编号' prop="BillNum" min-width="160">
        </el-table-column>
        <el-table-column align="center" prop="BusinessType" label="业务类型" min-width="80">
          <template slot-scope="scope">
            <span>{{$EnumData.getEnumDesByValue('FinanceBusType', scope.row.BusinessType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务描述" min-width="130" align="center">
          <template slot-scope="scope">
            <span class="td-url"
                  @click="checkBusDetail(scope.row)">{{scope.row.HouseName || scope.row.ContractID }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" min-width="80" prop="BillProjectName" align="center">
        </el-table-column>
        <el-table-column class-name="status-col" label="应付金额" prop="PayableMoney" min-width="90" align="center">
          <template slot-scope="scope">
            <span>{{$priceFormat(scope.row.PayableMoney)}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" prop="Discount" label="优惠金额" min-width="100">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{$priceFormat(scope.row.Discount)}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="已付金额" min-width="90" prop="PaidMoney" align="center">
          <template slot-scope="scope">
            <span>{{$priceFormat(scope.row.PaidMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="UnPaidMoney" label="未付金额" min-width="90">
          <template slot-scope="scope">
            <span>{{$priceFormat(scope.row.UnPaidMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="PayableDate" label="应付日期" min-width="80">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.PayableDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="CustomerName" label="关系人" min-width="60">
        <template slot-scope="scope">
        <span>{{scope.row.CustomerName}}</span>
        </template>
        </el-table-column>
        <el-table-column align="center" prop="Remark" label="备注" min-width="150">
          <template slot-scope="scope">
            <table-remark
              :allRemark="scope.row.Remark || '无' "
            >
            </table-remark>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="GetTabeledata"
    >
    </bottom-tool-bar>
    <business-detail ref="businessDetail"></business-detail>
  </div>
</template>

<script>
  import SearchPanel from '@/components/SearchPanel' // 引入整个样式布局组件
  import BottomToolBar from '@/components/BottomToolBar' // 引入底部布局样式
  import TableRemark from '@/components/TableRemark'
  import BusinessDetail from '@/components/BusinessDetail' // 引入业务详情
  import { GetPayAbleList } from '@/api/ownerBill'

  export default {
    name: 'AccountsPayable',
    components: {
      SearchPanel,
      BottomToolBar,
      TableRemark,
      BusinessDetail
    },
    data() {
      return {
        PaymentListDatas: [],
        listLoading: false,
        pageSize: 10,
        form: {
          keyWord: '',
          PayableDate: [],
          BusType: this.$EnumData.getEnumDesByValue('FinanceBusType'),
          StartTime: '',
          EndTime: ''
        },
        tableRemarkOptions: {}
      }
    },
    created() {
      console.log(this.$store.getters.enumList)
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    methods: {
      // 查询方法
      GetTabeledata(pages) {
        // 分页参数的处理
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        if (!this.form.PayableDate) {
           this.form.PayableDate = []
        }
          this.form.StartTime = this.form.PayableDate[0]
          this.form.EndTime = this.form.PayableDate[1]
        return GetPayAbleList({
          pageParam: pages,
          condition: this.form
        }).then(response => {
          console.log(response)
          if (response) {
            this.PaymentListDatas = response.Data.rows
            this.listLoading = false
          } else {
            return
          }
          return response.Data
        })
      },
      // 点击查询按钮
      handleSearch() {
        this.$refs.bottomToolBar.search()
      },
      // 点击重置按钮
      handleReset() {
        this.$refs['form'].resetFields()
        this.$refs.bottomToolBar.search()
      },
      checkBusDetail(row) {
        let type = 0
        let busId = 0
        switch (row.BusinessType) {
          case 1:
            type = 1
            break
          case 2:
            type = 3
            break
          case 3:
            type = 10
            break
          case 4:
            type = 14
            break
          case 5:
            type = 15
            break
          case 6:
            type = 4
            break
          case 7:
            type = 5
            break
          case 8:
            type = 6
            break
          case 9:
            type = 7
            break
          case 10:
            type = 2
            break
        }
        // if (row.HouseName) {
        //   type = 2
        //   busId = row.HouseKey
        // } else {
        //   busId = row.ContractID
        // }
        busId = row.ContractID
        debugger
        this.$refs.businessDetail.open({
          type,
          busId
        })
      }
    },
    computed: {
      // 业务类型枚举(7个)
      BusType() {
        return this.$EnumData.getEnumListByKey('FinanceBusType')
      }
    }
  }
</script>

<style scoped>

</style>
