<template>
  <div class="app-container">
    <div class="panel" v-loading="listLoading">
      <!-- 导出详情  -->
      <div class="top-title">
        <span class="ident"></span>
        <span>导出详情</span>
      </div>
      <div>
        <div>
          <div class="detail-conList">
              <p class="elP">状态: </p>
              <p class="elP">{{ detailContent.AuditStatus || '' }}</p>
          </div>
          <div class="detail-conList">
              <p class="elP">申请人: </p>
              <p class="elP">{{ detailContent.CreaterName || ''}}</p>
          </div>
          <div class="detail-conList">
              <p class="elP">所属组织: </p>
              <p class="elP">{{ detailContent.Organization || ''}}</p>
          </div>
        </div>
        <div class="data-list-table">
          <el-table :data="tableList" border fit class="table-normal" element-loading-text="加载中">
            <el-table-column align="center" prop="ExportModuleName" label="数据导出模板" min-width="130"> </el-table-column>
            <el-table-column align="center" label="小区" min-width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.CommunityName || '全部' }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="时间段" min-width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.DateLine || '全部' }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="ExportOrgan" label="组织" min-width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.ExportOrgan || '全部' }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="DataExportFields" label="数据导出字段" min-width="90"> </el-table-column>
            <el-table-column align="center" prop="Total" label="数据合计" min-width="80"> </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 申请理由 -->
      <div class="top-title" style="padding-top: 20px">
        <span class="ident"></span>
        <span>申请理由</span>
        <div class="reason">{{applyReason.Reason}}</div>
      </div>
      <div>
        <div class="detail-conList">
            <p class="elP">申请人（签字）: </p>
            <div class="elP picP" v-if="applyReason.ApplicantSignInfo"><img :src="$ImgUnit.getThumbImgUrl(applyReason.ApplicantSignInfo)" width="100px" height="70px"></div>
        </div>
        <div class="detail-conList">
            <p class="elP">申请时间: </p>
            <p class="elP">{{applyReason.CreaterTime}}</p>
            <!-- 将下方的p的高设为和上方图片一样，让文字垂直居中 -->
            <div v-if="applyReason.ApplicantSignInfo" style="display:inline-block; width:0; height:70px;vertical-align: middle;"></div> 
        </div>
      </div>
      
       <!-- 进度跟踪 -->
      <div class="step-progress">
        <div class="top-title">
          <span class="ident"></span>
          <span>进度跟踪</span>
        </div>
        <div class="vertical-step">
          <div class="step-list" v-for="(item, index) in trackList" :key="index">
            <!-- 待修改枚举枚举 -->
            <div class="step-content" :class="{ 'active-circle': index === 0, 'text-danger-circle': (index === 0 && (/已驳回/.test(item.ProgressAuditStatus))) }"></div>
            <div class="step-content">
              <p :class="{ active: index === 0, 'text-danger': (index === 0 && (/已驳回/.test(item.ProgressAuditStatus))) }">{{ item.ProgressContent }}</p>
              <div class="step-line" :class="{'is-last-item': index === (trackList.length - 1)}">
                <p style="font-size: 14px;color:gray; width: 400px" v-show="item.AuditRemark">
                  {{item.AuditRemark}}
                </p>
                <p style="font-size: 12px;color:gray;margin-top: 10px">{{$dateFormat(item.AuditTime, 'yyyy-MM-dd hh:mm')}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAuditDetail, getAuditDetailProgress } from '@/api/export'
export default {
  name: 'AuditDetail',
  data() {
    return {
      listLoading: false, // 进页面加载
      detailContent: {}, // 详情内容
      tableList: [], // 表格数据
      applyReason: {}, // 申请
      trackList: [] // 进度跟踪
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.costList.length - 1) {
        if (columnIndex === 2) {
          return [1, 3]
        } else {
          return [0, 0]
        }
      }
    },
    fetchData() {
      this.listLoading = true
      getAuditDetail({ ExportID: this.$route.query.KeyID }).then(({ Data }) => {
          if (Data) {
            // 详情
            this.detailContent = {
              AuditStatus: this.$EnumData.getEnumDesByValue('ExportAuditStatus', Data.AuditStatus),
              CreaterName: Data.CreaterName,
              Organization: Data.Organization
            }
            // 表格
            this.tableList = [
              {
                ExportModuleName: Data.ExportModuleName,
                CommunityName: Data.CommunityName,
                DateLine: this.$dateFormat(Data.StartTime) && `${this.$dateFormat(Data.StartTime)}至${this.$dateFormat(Data.EndTime)}`,
                ExportOrgan: Data.ExportOrgan,
                DataExportFields: Data.DataExportFields,
                Total: Data.Total
              }
            ]
            // 理由
            this.applyReason = {
              Reason: Data.Reason,
              ApplicantSignInfo: Data.ApplicantSignInfo,
              CreaterTime: this.$dateFormat(Data.CreaterTime, 'yyyy-MM-dd hh:mm')
            }
          }
          this.listLoading = false
      }).catch(err => {
        this.listLoading = false
        console.log(err)
      })
      getAuditDetailProgress({ ExportID: this.$route.query.KeyID }).then(({ Data }) => {
        if (Data) {
          this.trackList = Data.map(item => {
            item.ProgressAuditStatus = this.$EnumData.getEnumDesByValue('ExportAuditStatus', item.ProgressAuditStatus)
            return item
          })
          console.log('track', this.trackList)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
  .top-title {
    margin-top: 20px;
    .ident {
      display:inline-block;
      margin-bottom: -3px;
      height: 18px;
      width: 5px;
      background-color: #389ef2;
    }
    .reason {
      margin-top: 20px;
      margin-left: 1rem;
    }
  }
  .detail-conList {
    float: left;
    margin-right: 110px;
    margin-top: 26px;
    margin-bottom: 20px;
    .elP {
      display: inline-block;
    }
    .picP {
      vertical-align: middle;
    }
  }
  .step-progress{
    clear: both;
    padding-top: 20px;
  }
  .vertical-step {
      overflow: hidden;
      margin-top:20px;
      .step-list {
        overflow: hidden;
      .step-content {
        float: left;
      }        
      .step-content:nth-child(1) {
          overflow: hidden;
          margin-top: 5px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #999999;
          margin-left: 20px;
        }
        .active-circle {
          background-color: #389ef2 !important;
        }
        .text-danger-circle {
          background-color: rgb(255, 0, 0) !important;
        }
      .step-content:nth-child(2) {
        font-size: 14px;
        color: #666666;
        p {
          margin-top: 2px;
        }
        div p {
          margin: 10px 0;
        }
        .active {
          color: #389ef2
        }
        .text-danger {
          color: rgb(255, 0, 0)
        }
        .step-line {
          padding-top: 10px;
          margin-left: -5px;
          padding-bottom: 8px;
          border-color: #999999;
          border-left-width: 1px;
          border-left-style: dashed;
          padding-left: 10px;
        }
        .is-last-item {
          border-left-width: 0;
        }
      }
    }
  }
</style>