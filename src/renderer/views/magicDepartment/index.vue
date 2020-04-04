<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="100px">
      <template slot="search">
        <el-form-item label="房源名称" prop="HouseName">
          <el-input v-model="ruleForm.HouseName" placeholder="请输入房源名称"></el-input>
        </el-form-item>
        <el-form-item label="出租方式" prop="RenType">
          <el-select v-model="ruleForm.RenType" placeholder="请选择">
            <el-option
              v-for="item in procureList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业主信息" prop="OwnerKeyWord">
          <el-input v-model="ruleForm.OwnerKeyWord" placeholder="请输入业主姓名或电话"></el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="小区名称" prop="CommunityName">
            <el-input v-model="ruleForm.CommunityName" placeholder="请输入小区名称"></el-input>
          </el-form-item>
          <el-form-item label="合同编号" prop="OwnerContractNumber">
            <el-input v-model="ruleForm.OwnerContractNumber" placeholder="请输入合同编号"></el-input>
          </el-form-item>
          <SelectOrganization :type="3" v-model="ruleForm.QueryFullID"></SelectOrganization>
        </div>
      </template>
      <template slot="button">
        <el-button class="search-button" type="primary" @click="SearchAll()">查询</el-button>
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
        <el-table-column align="center" label="业主租金" min-width="90" prop="OwnerMoney"></el-table-column>
        <el-table-column align="center" label="租客租金" min-width="90" prop="TenMoney"></el-table-column>
        <el-table-column align="center" label="租金差" min-width="90" prop="AvgMoney"></el-table-column>
        <el-table-column align="center" label="业主信息" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.OwnerName}} {{scope.row.OwnerPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="出租方式" min-width="80">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.RentType)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="地址" min-width="200" prop="Location"></el-table-column>
        <el-table-column align="center" label="托管起始日期" min-width="200">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.StartDate,'yyyy-MM-dd')}} 至 {{$dateFormat(scope.row.EndDate,'yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合同编号" min-width="120" prop="OwnerContractNumber"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" min-width="100">
          <template slot-scope="scope">
            <table-buttons
              :showAll="true"
              :options="operationButton"
              :condition="scope.row.conditionBtn"
              @handlefollowUpClick="handleFollowUp(scope.row)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData"></bottom-tool-bar>
    <div>
      <FollowUp ref="FollowUp"></FollowUp>
    </div>
  </div>
</template>
<script>
import {
  SearchPanel,
  TableButtons,
  BottomToolBar,
  SelectOrganization
} from '@/components'
import { ShowMagicDepartmentRentAvgMoney } from '@/api/magic'
import FollowUp from './FollowUp'
export default {
  name: 'magicDepartmentName',
  components: {
    SelectOrganization,
    TableButtons,
    SearchPanel,
    BottomToolBar,
    FollowUp
  },
  data() {
    return {
      listLoading: false,
      pageSize: 10,
      ruleForm: {
        QueryFullID: '',
        HouseName: '',
        OwnerContractNumber: '',
        CommunityName: '',
        OwnerKeyWord: '',
        RenType: 0
      },
      procureList: [
        { value: 0, label: '全部' },
        { value: 1, label: '整租' },
        { value: 2, label: '合租' }
      ],
      filterList: [],
      list: [],
      operationButton: [
        {
          key: 'followUp',
          value: '跟进',
          type: 'primary'
        }
      ]
    }
  },
  methods: {
    // 查询
    SearchAll() {
      this.$refs.bottomToolBar.search()
    },
    // 重置
    keywordReset() {
      this.$refs.ruleForm.resetFields()
      this.ruleForm.QueryFullID = ''
      this.ruleForm.RenType = 0
      this.$refs.bottomToolBar.search()
    },
    filterStatus(item) {
      var num = Number(item)
      const labelStatus = this.procureList.find(res => num === res.value)
      return labelStatus.label
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
      return ShowMagicDepartmentRentAvgMoney({
        parm: pages, // 分页参数
        ...this.ruleForm
      })
        .then(response => {
          const List = response.Data.rows
          this.filterList = []
          List.map(item => {
            this.filterList.push(this.filterTableDataItem(item))
          })
          // this.filterTableData()
          this.listLoading = false
          return response.Data
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    filterTableDataItem(item) {
      const itemChooseStatus = ['followUp']
      return {
        ...item,
        conditionBtn: itemChooseStatus // 操作按钮
      }
    },
    // 跟进
    handleFollowUp(row) {
      this.$refs.FollowUp.open(row)
    }
  }
}
</script>
<style lang="scss" scoped>
// .bottom-bar-top{
//     margin-top: 10px;
// }
.showEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 120px;
}
</style>
