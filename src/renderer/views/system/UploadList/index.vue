<template>
  <div class="app-container data-list">
    <search-panel :model="searchForm" ref="searchForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
        <el-form-item label="申请人" prop="ApplicantInfo">
          <el-input v-model="searchForm.ApplicantInfo" placeholder="姓名/电话"></el-input>
        </el-form-item>
        <SelectOrganization v-model="searchForm.FullIDNew"></SelectOrganization>
        <el-form-item label="上传状态" prop="AuditStatus">
          <el-select v-model="searchForm.UploadStatus" placeholder="请选择">
            <el-option
              :label="item.Description"
              :value="item.Value"
              v-for="item in EnumStatus"
              :key="item.Value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table :data="filterList" border fit height="100%" class="table-normal" v-loading.body="listLoading" :element-loading-text="loadingText">
        <el-table-column align="center" prop="CreaterName" label="申请人姓名" min-width="100"></el-table-column>
        <el-table-column align="center" prop="UserPhone" label="申请人电话" min-width="120"> </el-table-column>
        <el-table-column align="center" label="小区" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.CommunityName || '全部'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="DateLine" label="时间段" min-width="160"></el-table-column>
        <el-table-column align="center" prop="Total" label="数据合计（条）" min-width="110"></el-table-column>
        <el-table-column align="center" prop="CreaterTime" label="申请时间" min-width="120"></el-table-column>
        <el-table-column align="center" prop="AuditorName" label="审核人" min-width="120"></el-table-column>
        <el-table-column align="center" prop="AuditTime" label="审核时间" min-width="120"></el-table-column>
        <el-table-column align="center" label="上传状态" min-width="100">
          <template slot-scope="scope">
            <span>{{$EnumData.getEnumDesByValue('ExportUploadStatus', scope.row.UploadStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <table-buttons
              :options="operationButton"
              :condition="handleOpration(scope.row)"
              @handleDetailClick="handleDetail(scope.row, scope.$index)"
              @handleDownloadTmpClick="handleDownloadTmp(scope.row, scope.$index)"
              @handleUploadClick="handleUpload(scope.row, scope.$index)"
              @handleReUploadClick="handleUpload(scope.row, scope.$index)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="PageSize"
      :handlePageChange="fetchData"
    ></bottom-tool-bar>
    <a :href="downloadUrl" style="display: none;" download id="uploadList"></a>
    <!-- <uploadExcel ref="upload-excel" :KeyID="KeyID" v-show="false"> </uploadExcel> -->
    <UploadSingleFile ref="uploadSingleFile" @onSubmitFile="handleSubmitFile"></UploadSingleFile>
  </div>
</template>
<script>
  import { getDataExportAuditList, DownLoadTemplate } from '@/api/export'
  import {
    BottomToolBar,
    SearchPanel,
    TableButtons
    } from '../../../components'
  import AuditDialog from '../../../views/Export/ExportApprovalList/components/AuditDialog'
  import SelectOrganization from '@/components/SelectOrganization'
  // import UploadExcel from '../../Export/ReceiveComfirmation/components/uploadExcel'
  import UploadSingleFile from '@/components/UploadFile/UploadSingleFile'
  import { baseURL } from '@/config'
  import { UploadDataExportTemplate } from '@/api/export'

  export default {
    name: 'ExportApprovalList',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      SelectOrganization,
      AuditDialog,
      UploadSingleFile
    },
    data() {
      return {
        listLoading: false, // 请求列表loading
        filterList: [],
        PageSize: 10,
        downloadUrl: '', // 下载模板地址
        loadingText: '',
        KeyID: 888,
        index: 0, // 点击操作的数据下标
        // 搜索条件
        searchForm: {
          ApplicantInfo: '', // 申请人
          FullIDNew: '', // 组织
          UploadStatus: 0, // 上传状态，
          Type: 3
        },
        operationButton: [
          {
            key: 'Detail',
            value: '详情',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'DownloadTmp',
            value: '下载模板',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Upload',
            value: '上传',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'ReUpload',
            value: '重新上传',
            type: 'primary',
            size: 'mini'
          }
        ]
      }
    },
    computed: {
      EnumStatus() {
        const EnumStatus = this.$EnumData.getEnumListByKey('ExportUploadStatus')
        return EnumStatus
      }
    },
    activated() {
      this.$refs.bottomToolBar.search(1) // 通过search调用fetchData
    },
    methods: {
      // 跳转详情界面
      handleDetail(data, index) {
        this.$router.push({
          path: '/Export/ExportAuditDetail',
          query: {
            KeyID: data.KeyID
          }
        })
      },
      // 默认加载页面查询数据方法
      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.PageSize,
            page: 1
          }
        }
        this.listLoading = true
        this.loadingText = '加载中'
        return getDataExportAuditList({
          parm: pages,
          ...this.searchForm
        }).then(({ Data }) => {
          this.listLoading = false
          this.filterList = Data.rows.map(item => {
            item.AuditTime = this.$dateFormat(item.AuditTime, 'yyyy-MM-dd hh:mm')
            item.CreaterTime = this.$dateFormat(item.CreaterTime, 'yyyy-MM-dd hh:mm')
            item.DateLine = this.$dateFormat(item.StartTime) === '' ? '全部' : `${this.$dateFormat(item.StartTime)} 至 ${this.$dateFormat(item.EndTime)}`
            return item
          })
          return Data
        }).catch(err => {
          console.log('err', err)
        })
      },
      // 操作按钮
      handleOpration(item) {
        item.Operation = ['Detail', 'DownloadTmp']
        if (item.UploadStatus === 1) {
          item.Operation.push('Upload')
        } else {
          item.Operation.push('ReUpload')
        }
        return item.Operation
      },
      // 根据筛选条件查询列表
      submitForm() {
        this.$refs.bottomToolBar.search()
      },
      // 点击重置按钮
      resetForm() {
        this.$refs.searchForm.resetFields()
        this.$refs.bottomToolBar.search()
      },
      // 下载模板
      handleDownloadTmp(data) {
        this.loadingText = '正在下载模板'
        this.downloadUrl = baseURL + data.UploadTemplateUrl
        this.$nextTick(() => {
          document.getElementById('uploadList').click()
        })
        DownLoadTemplate({ KeyID: data.KeyID })
      },
      // 打开上传文件弹窗
      handleUpload(row, idx) {
        this.KeyID = row.KeyID
        this.index = idx
        this.$refs['uploadSingleFile'].open(this.KeyID)
      },
      // 上传文件
      handleSubmitFile(Data) {
        UploadDataExportTemplate({
            KeyID: this.KeyID,
            url: Data
          }).then(() => {
            this.$message.success('上传成功')
            this.filterList.map((item, index) => {
              if (index === this.index) {
                item.UploadStatus = 2
                item.Operation = ['Detail', 'DownloadTmp', 'ReUpload']
              }
            })
          }).catch((err) => {
            this.$message.error(err)
          })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/mixin.scss";
</style>
