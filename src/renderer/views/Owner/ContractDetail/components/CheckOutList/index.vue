<template>
  <div v-if="ContractInfo.KeyID ">
    <p class="check-list-title">
      收支合计：
      <span
        class="check-list-text"
        :style="{color: count1-count2<0?'#ff5a5a':'#038B5E'}"
      >{{$priceFormat(count1 - count2)}}元</span>
    </p>
    <div>
      <div class="panel-title">收入</div>
      <p class="table-list-title">
        收入合计：
        <span class="table-list-text">{{$priceFormat(count1)}}元</span>
      </p>
      <div class="data-list-table">
        <el-table
          :data="list1"
          ref="multipleTable"
          v-loading.body="listLoading"
          element-loading-text="加载中"
          border
          fit
          class="table-normal"
        >
          <el-table-column
            align="center"
            fixed="left"
            prop="PaymentData"
            label="日期"
            min-width="180"
          >
            <template slot-scope="scope">
              <span>{{$dateFormat(scope.row.PaymentData)}}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="金额" min-width="140" align="center">
            <template slot-scope="scope">
              <span>{{$priceFormat(scope.row.PaymentMoney)}}</span>
              <!-- <span>{{scope.row.PaidMoney - 0 > 0 && ((scope.row.PaidMoney - 0) !== (scope.row.PaymentMoney - 0)) ? '(已付'+ scope.row.PaidMoney + ')': ''}}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="房间号" min-width="120" align="center">
            <template slot-scope="scope">{{scope.row.RoomNumber}}</template>
          </el-table-column>
          <el-table-column label="明细" min-width="250" align="center">
            <template slot-scope="scope">{{scope.row.ProjectName}}</template>
          </el-table-column>
          <el-table-column align="center" label="备注" prop="Remarks" min-width="180">
            <template slot-scope="scope">
              <table-remark :allRemark="scope.row.Remarks || '无'"></table-remark>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <bottom-tool-bar
        class="pager-div align-right"
        ref="bottomToolBar"
        :page-size="pageSize"
        :handlePageChange="fetchData1"
      ></bottom-tool-bar>
    </div>
    <div class="check-item-container">
      <div class="panel-title">支出</div>
      <p class="table-list-title">
        支出合计：
        <span class="table-list-text">{{$priceFormat(count2)}}元</span>
      </p>
      <el-table
        :data="list2"
        ref="multipleTable"
        v-loading.body="listLoading"
        element-loading-text="加载中"
        border
        fit
        class="table-normal"
      >
        <el-table-column align="center" fixed="left" prop="PaymentData" label="日期" min-width="180">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.PaymentData)}}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="金额" min-width="140" align="center">
          <template slot-scope="scope">
            <span>{{$priceFormat(scope.row.PaymentMoney)}}</span>
            <!-- <span>{{scope.row.PaidMoney - 0 > 0 && ((scope.row.PaidMoney - 0) !== (scope.row.PaymentMoney - 0)) ? '(已付'+ scope.row.PaidMoney + ')': ''}}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="房间号" min-width="120" align="center">
          <template slot-scope="scope">{{scope.row.RoomNumber}}</template>
        </el-table-column>
        <el-table-column label="明细" min-width="250" align="center">
          <template slot-scope="scope">{{scope.row.ProjectName}}</template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="Remarks" min-width="180">
          <template slot-scope="scope">
            <table-remark :allRemark="scope.row.Remarks || '无'"></table-remark>
          </template>
        </el-table-column>
      </el-table>
      <bottom-tool-bar
        class="pager-div align-right"
        ref="bottomToolBar"
        :page-size="pageSize"
        :handlePageChange="fetchData2"
      ></bottom-tool-bar>
    </div>
  </div>
</template>

<script>
  import { BottomToolBar, TableRemark } from '@/components'
  import {
    QueryIncomeByOwner,
    QueryExpendByOwner,
    TotalIncomeByOwner,
    TotalExpendByOwner
  } from '@/api/owner'
  export default {
    props: {
      ContractInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    name: 'CheckOutList',
    components: {
      BottomToolBar,
      TableRemark
    },
    data() {
      return {
        list1: [],
        list2: [],
        count1: 0,
        count2: 0,
        listLoading: false,
        pageSize: 10
      }
    },
    watch: {
      'ContractInfo.KeyID': {
        handler(value) {
          if (value) {
            TotalIncomeByOwner({
              ownerContractID: value
            }).then(res => {
              this.count1 = res.Data
            })
            TotalExpendByOwner({
              ownerContractID: value
            }).then(res => {
              this.count2 = res.Data
            })
          }
        }
      }
    },
    methods: {
      fetchData1(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        return QueryIncomeByOwner({
          pageParam: pages,
          ownerContractID: this.ContractInfo.KeyID
        })
          .then(response => {
            this.list1 = response.Data.rows
            this.listLoading = false
            return response.Data
          })
          .catch(() => {
            this.listLoading = false
          })
      },
      fetchData2(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        return QueryExpendByOwner({
          pageParam: pages,
          ownerContractID: this.ContractInfo.KeyID
        })
          .then(response => {
            this.list2 = response.Data.rows
            this.listLoading = false
            return response.Data
          })
          .catch(() => {
            this.listLoading = false
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .check-list-title {
    margin: 30px 0;
    .check-list-text {
      color: #038b5e;
    }
  }
  .align-right {
    text-align: right;
  }
  .check-item-container {
    margin-top: 60px;
  }
  .table-list-title {
    text-align: center;
    color: #389ef2;
    margin: 14px 0;
    .table-list-text {
      color: #444444;
    }
  }
</style>