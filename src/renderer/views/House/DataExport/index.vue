<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" box-flex right-width="470px">
      <template slot="search">
        <el-form-item label="小区" prop="CommunityName">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="ruleForm.CommunityName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入小区名称搜索"
            :maxlength="40"
            @select="handleCommunitySelect">
            <i class="el-icon-search el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.CommunityName }}</div>
              <span class="addr">{{ item.Location }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="searchForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="download">导出</el-button>
          <!-- v-setbtn:Export
          v-setbtn:ExportRecord -->
        <el-button type="primary" @click="downloadRecord">导出记录</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table
        :data="tableData"
        ref="multipleTable"
        v-loading.body="listLoading"
        element-loading-text="加载中"
        border
        fit
        height="100%"
        class="table-normal"
      >
        <el-table-column align="center" label="租客合同号" min-width="100" prop="TenantContractNumber"></el-table-column>
        <el-table-column align="center" label="小区" min-width="130" prop="CommunityName"></el-table-column>
        <el-table-column align="center" label="门牌号" min-width="160" prop="HouseNumber"></el-table-column>
        <el-table-column align="center" label="业主姓名" min-width="120" prop="OwnerName"></el-table-column>
        <el-table-column align="center" label="业主身份证号" min-width="120" prop="OwnerIDCard"></el-table-column>
        <el-table-column align="center" label="业主电话" min-width="120" prop="OwnerPhone"></el-table-column>
        <el-table-column align="center" label="租客姓名" min-width="120" prop="TenantName"></el-table-column>
        <el-table-column align="center" label="租客身份证号" min-width="120" prop="TenantCard"></el-table-column>
        <el-table-column align="center" label="租客电话" min-width="120" prop="TenantPhone"></el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="GetTableData"></bottom-tool-bar>
    <export-sign-dialog ref="exportSignDialog"></export-sign-dialog>
    <export-record-dialog ref="exportRecordDialog"></export-record-dialog>
  </div>
</template>

<script>
import {
  SearchPanel,
  BottomToolBar
  } from '../../../components' // 引入组件
import ExportSignDialog from './components/ExportSignDialog'
import ExportRecordDialog from './components/ExportRecordDialog'
import { QueryContractDataExportList } from '@/api/house' // 合同列表
import { searchCommunityList } from '../../../api/owner'
import { getCodeArrByCode } from '../../../utils/CityData'
export default {
  name: 'AgentDataExport',
  components: {
    SearchPanel,
    BottomToolBar,
    ExportSignDialog,
    ExportRecordDialog
  },
  data() {
    return {
      listLoading: false,
      isShowPopover: false,
      tableData: [],
      pageSize: 10,
      ruleForm: {
        KeyID: '',
        CommunityName: '', // 小区信息
        HouseKey: '',
        StoreID: '', // 组织架构
        TubeEmployee: '', // 管房人
        HouseID: '',
        HouseName: '',
        LeaseStatus: '',
        HouseMarkStatus: '',
        PaperType: '',
        CustomerInfo: '', // 业主姓名电话
        ContractNumber: ''
      },
      oldCommunityList: [], // 上次搜索
      // CommunityInfo: {
      //   Location: '',
      //   CityCodeMark: [],
      //   CommunityName: ''
      // } // 小区信息
      rules: {
        CommunityName: [
          { required: true, message: '请输入或选择小区名称', trigger: 'change' }
        ]
      }
    }
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
      return QueryContractDataExportList({
        parm: pages,
        CommunityID: this.ruleForm.KeyID,
        IsAll: false
      }).then(({ Data }) => {
        console.log(Data)
        if (Data) {
          this.tableData = Data.rows
          this.listLoading = false
        } else {
          return
        }
        return Data
      })
    },
    // 小区搜索接口
    querySearchAsync(queryString, cb) {
      if (this.oldCommunitySearchKey === queryString) {
        cb(this.oldCommunityList)
        return
      }
      this.oldCommunitySearchKey = queryString
      if (queryString) {
        searchCommunityList({
          CommunityName: queryString,
          parm: { page: 1, size: 20 }
        }).then(({ Data }) => {
          this.oldCommunityList = Data.rows || []
          cb(Data.rows || [])
        })
      } else {
        this.oldCommunityList = []
        cb([])
      }
    },
    handleCommunitySelect(item, type = 0) {
      console.log('item:', item)
      this.ruleForm = {
        CommunityName: item.CommunityName,
        KeyID: item.KeyID
      }

      this.ruleForm.CityCodeMark = getCodeArrByCode(this.ruleForm.CityCode)
      this.$refs.ruleForm.clearValidate()
    },
    // 查询
    searchForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$refs.bottomToolBar.search()
        }
      })
    },
    // 重置
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.ruleForm = {
        CommunityName: '',
        KeyID: ''
      }
      this.$refs.bottomToolBar.search()
    },
    // 导出
    download() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$refs['exportSignDialog'].open({
            CommunityName: this.ruleForm.CommunityName,
            KeyID: this.ruleForm.KeyID
          })
          console.log('导出:')
        } else {
          this.$message.error('请输入或选择小区名称！')
        }
      })
    },
    // 导出记录
    downloadRecord() {
      this.$refs['exportRecordDialog'].open()
    }
  }
}
</script>

<style scoped lang="scss">
// @import "./style.scss"
</style>