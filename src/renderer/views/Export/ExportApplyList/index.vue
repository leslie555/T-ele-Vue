<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px">
      <template slot="search">
        <el-form-item label="申请人" prop="ApplicantInfo">
          <el-input
            v-model="ruleForm.ApplicantInfo"
            placeholder="请输入姓名/电话"
          ></el-input>
        </el-form-item>
        <SelectOrganization v-model="ruleForm.FullIDNew" />
      </template>
      <template slot="button">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="primary" @click="handleEdit(2)">提交申请</el-button>
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
        <el-table-column
          align="center"
          label="申请人姓名"
          min-width="120"
          prop="CreaterName"
        ></el-table-column>
        <el-table-column align="center" label="状态" min-width="80">
          <template slot-scope="scope">
            <span :style="{ color: showColor(scope.row.AuditStatus) }">{{
              $EnumData.getEnumDesByValue(
                'ExportAuditStatus',
                scope.row.AuditStatus
              )
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="申请人电话"
          min-width="120"
          prop="UserPhone"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="数据导出模块"
          min-width="120"
          prop="ExportModuleName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="小区"
          min-width="120"
          prop="CommunityName"
        >
          <template slot-scope="scope">
            {{ scope.row.CommunityName || '全部' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间段" min-width="200">
          <template slot-scope="scope">
            <span v-if="$dateFormat(scope.row.StartTime)"
              >{{ $dateFormat(scope.row.StartTime) }}至{{
                $dateFormat(scope.row.EndTime)
              }}</span
            >
            <span v-else>{{ '全部' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="数据合计（条)"
          min-width="120"
          prop="Total"
        >
        </el-table-column>
        <el-table-column align="center" label="申请时间" min-width="130">
          <template slot-scope="scope">
            <span>{{
              $dateFormat(scope.row.CreaterTime, 'yyyy-MM-dd hh:mm')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="审核人"
          min-width="100"
          prop="AuditorName"
        ></el-table-column>
        <el-table-column align="center" label="审核时间" min-width="130">
          <template slot-scope="scope">
            <span>{{
              $dateFormat(scope.row.AuditTime, 'yyyy-MM-dd hh:mm')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="可下载进度" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.DownloadDes }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
          min-width="200"
        >
          <template slot-scope="scope">
            <table-buttons
              :options="operation2button"
              :condition="scope.row.Operation"
              @handleDetailClick="handleDetail(scope.row)"
              @handleEditClick="handleEdit(1, scope.row)"
              @handleDeleteClick="handleDelete(scope.row)"
              @handleDownloadClick="handleDownload(scope.row)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="fetchData"
    />
    <a
      :href="downloadUrl"
      target="_blank"
      style="display: none;"
      download
      id="downloadTmp"
    ></a>
  </div>
</template>

<script>
  import {
    SearchPanel,
    SelectOrganization,
    BottomToolBar,
    TableButtons
  } from '@/components'
  import {
    QueryDataExportApplyList,
    DownLoadTemplate,
    DeleteDataExportTemplate
  } from '@/api/export'
  import { baseURL } from '@/config'
  export default {
    name: 'ExportApplyList',
    components: {
      SearchPanel,
      SelectOrganization,
      BottomToolBar,
      TableButtons
    },
    data() {
      return {
        pageSize: 10,
        ruleForm: {
          // AuditStatus: '', // 审核状态
          ApplicantInfo: '', // 申请人信息
          FullIDNew: '', // 组织ID
          Type: 0 // 列表类型 0:申请列表 1:审核列表 2:复核列表 3:上传列表
        },
        list: [], // clone一份列表数据
        filterList: [], // 处理后的列表数据
        listLoading: false, // 是否正在加载
        downloadUrl: '', // 下载地址
        operation2button: [
          {
            key: 'Detail',
            value: '详情',
            type: 'default'
          },
          {
            key: 'Edit',
            value: '修改',
            type: 'primary'
          },
          {
            key: 'Delete',
            value: '删除',
            type: 'danger'
          },
          {
            key: 'Download',
            value: '下载',
            type: 'default'
          }
        ],
        EnumDownloadState: [
          {
            label: '未生成',
            value: 0
          },
          {
            label: '已生成',
            value: 1
          },
          {
            label: '已下载',
            value: 2
          },
          {
            label: '已失效',
            value: 3
          },
          {
            label: '生成失败',
            value: 4
          }
        ]
      }
    },
    methods: {
      fetchData(pages) {
        this.listLoading = true
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        return QueryDataExportApplyList({
          parm: pages,
          ...this.ruleForm
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
        let Operation = []
        let DownloadDes = '未生成'
        const state = v.AuditStatus // 审核状态
        if (state === 1) {
          Operation = ['Detail', 'Delete']
        } else if (state === 2) {
          Operation = ['Detail']
        } else if (state === 3) {
          if (v.DownloadStatus === 1 || v.DownloadStatus === 2) {
            Operation = ['Detail', 'Download']
          } else {
            Operation = ['Detail']
          }
          const item = this.EnumDownloadState.find(
            item => item.value === v.DownloadStatus
          )
          DownloadDes = item && item.label
        } else if (state === 4) {
          Operation = ['Detail', 'Edit', 'Delete']
        }
        return {
          ...v,
          Operation,
          DownloadDes
        }
      },
      query() {
        this.$refs.bottomToolBar.search()
      },
      reset() {
        this.$refs.ruleForm.resetFields()
        this.$refs.bottomToolBar.search()
      },
      // 新增提交2 修改1
      handleEdit(type, data) {
        let KeyID
        if (data) {
          KeyID = data.KeyID
        }
        this.$router.push({
          path: '/Export/ReceiveComfirmation',
          query: {
            type,
            KeyID
          }
        })
      },
      // 详情
      handleDetail(data) {
        this.$router.push({
          path: '/Export/ExportAuditDetail',
          query: {
            KeyID: data.KeyID
          }
        })
      },
      handleDelete(data) {
        this.$confirm('确认删除该条数据?', '提示').then(() => {
          const postData = { ExportID: data.KeyID }
          DeleteDataExportTemplate(postData).then(() => {
            const index = this.filterList.findIndex(item => {
              return item.KeyID === data.KeyID
            })
            this.filterList.splice(index, 1)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      },
      beforeDownload(data) {
        // UploadStatus 自定义模板: 0: 待上传: 1 已上传 2:重新上传
        if (data.UploadStatus < 2 && data.TemplateType !== 0) {
          this.$message.warning('数据还未处理, 请稍后再试')
          return
        }
        // DownloadStatus 下载excel 0：未下载，1：已下载，2：已失效
        if (data.DownloadStatus === 2) {
          this.$message.warning('下载文件已不存在')
          return
        }
        return true
      },
      handleDownload(data) {
        // this.loadingText = '正在下载模板'
        const before = this.beforeDownload(data)
        if (before) {
          // this.listLoading = true
          if (data.TemplateType === 0) {
            this.downloadUrl = baseURL + data.DownloadTemplateUrl
          } else {
            this.downloadUrl = baseURL + data.UploadTemplateUrl
          }
          this.$nextTick(() => {
            document.getElementById('downloadTmp').click()
          })
          DownLoadTemplate({ KeyID: data.KeyID })
        }
      },
      showColor(state) {
        let color = null
        if (state === 3) {
          color = '#67C23A'
        } else if (state === 4) {
          color = '#F56C6C'
        } else {
          color = 'rgb(96, 98, 102)'
        }
        return color
      }
    }
  }
</script>
<style lang="scss" scoped></style>
