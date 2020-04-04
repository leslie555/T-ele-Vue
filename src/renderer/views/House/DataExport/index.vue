<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" box-flex right-width="470px">
      <template slot="search">
        <el-form-item label="小区" prop="CommunityName" width="500">
          <el-select
            v-model="ruleForm.CommunityName"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入小区名称搜索"
            :remote-method="CommunityInfoRemoteMethod"
            :disabled="false"
            @change="CommunityInfoChange"
            :loading="CommunityInfoLoading">
            <el-option
              v-for="item in CommunityInfoResult"
              :key="item.KeyID"
              :label="item.CommunityName"
              :value="item.KeyID"
            >
            <template slot-scope="scope">
              <div class="name">{{ item.CommunityName }}</div>
            </template>
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="searchForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="primary" v-setbtn:Export @click="download">导出</el-button>
          <!-- v-setbtn:Export
          v-setbtn:ExportRecord -->
        <el-button type="primary" v-setbtn:ExportRecord @click="downloadRecord">导出记录</el-button>
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
import { QueryContractDataExportList, searchCommunityList } from '@/api/house' // 合同列表
// import { getCodeArrByCode } from '../../../utils/CityData'
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
        CommunityID: [],
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
      CommunityInfoList: [], // 小区搜索列表
      CommunityInfoLoading: false, // 小区搜索加载flag
      CommunityInfoResult: [], // 小区搜索列表 - 接口返回数据
      rules: {
        CommunityName: [
          { required: true, message: '请输入或选择小区名称', trigger: 'blur' }
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
        CommunityID: this.ruleForm.CommunityID,
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
      // this.ruleForm = {
      //   CommunityName: '',
      //   KeyID: ''
      // }
      this.CommunityInfoList = []
      this.ruleForm.CommunityID = []
      this.$refs.bottomToolBar.search()
    },
    // 导出
    download() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$refs['exportSignDialog'].open({
            CommunityInfoList: this.CommunityInfoList,
            CommunityID: this.ruleForm.CommunityID
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
    },
    // 小区搜索
    CommunityInfoRemoteMethod(query) {
      if (query !== '') {
        this.CommunityInfoLoading = true
        searchCommunityList({
          parm: {
            page: 1,
            size: 20
          },
          CommunityName: query
        }).then(({ Data }) => {
          console.log('Data.rows:', Data.rows)
          this.CommunityInfoLoading = false
          this.CommunityInfoResult = Data.rows
        })
      } else {
        this.CommunityInfoResult = []
      }
    },
    // 小区多选事件监听
    CommunityInfoChange(data) {
      this.ruleForm.CommunityID = data
      // 删除
      if (data.length < this.CommunityInfoList.length) {
        this.CommunityInfoList.map((v, i) => {
          if (!data.find(x => x === v.KeyID)) {
            this.CommunityInfoList.splice(i, 1)
          }
        })
      } else {
        // 新增
        const id = data[data.length - 1]
        const item = this.CommunityInfoResult.find(x => x.KeyID === id)
        this.CommunityInfoList.push({
          KeyID: item.KeyID,
          CommunityName: item.CommunityName
        })
      }
      console.log('CommunityID:', data)
      console.log('CommunityInfoList:', this.CommunityInfoList)
    }
  }
}
</script>

<style scoped lang="scss">
// @import "./style.scss"
.el-select {
  width: 600px;
}
</style>