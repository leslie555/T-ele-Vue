<template>
  <div class="app-container">
  <div class="panel" v-loading="detailLoading">
    <div class="leftWidth">
      <div class="top-title">
        <span></span>
        <span>申请详情</span>
      </div>
      <div class="TopConList">
        <div class="conList" v-if="detailContent.HouseName">
          <div class="detail-conList">
              <p>房源名称: </p>
              <p>{{ detailContent.HouseName || '' }}</p>
          </div>
          <div class="detail-conList">
              <p>合同编号: </p>
              <p>{{ detailContent.ContractNum || ''}}</p>
          </div>
        </div>
        <div class="conList">
          <div class="clearfix detail-table">
            <span style="float: left">费用项目: </span>
            <el-table
              :data="costList"
              border
              :span-method="arraySpanMethod"
              style="float: left; margin-left: 10px;width: 541px"
            >
              <el-table-column
                prop="BillProjectName"
                label="费用项目"
                align="center"
                width="180"
                >
              </el-table-column>
              <el-table-column
                prop="BillProjectTypeName"
                label="类别"
                align="center"
                width="180"
                >
              </el-table-column>
              <el-table-column
                prop="Money"
                label="金额"
                align="center"
                width="180"
                >
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-form
          :inline="false"
          ref="FormImg"
          style="margin-top:20px;overflow:hidden;"
        >
        <div class="clearfix">
          <el-form-item label="图片凭证: ">
            <div class="upload-img-box" v-viewer="{url: 'data-src'}">
              <div
                class="upload-img"
                v-for="(item, index) in imageList"
                :key="index"
              >
                <img
                  :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                  :data-src="$ImgUnit.getImgUrl(item.ImageLocation)"
                />
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="clearsfix">
          <el-form-item label="备注:">
            <div class="upload-img-box">
              <el-input
                type="textarea"
                :disabled="textboolean"
                v-model="detailContent.Remark"
                :autosize="{ minRows: 2, maxRows: 6}"
              />
            </div>
          </el-form-item>
        </div>
        </el-form>
        <div class="conList">
          <div class="detail-conList">
              <p>申请人: </p>
              <p><span>{{ detailContent.UserName }}</span> <span>{{ detailContent.Phone }}</span></p>
          </div>
          <div class="detail-conList">
              <p>申请时间: </p>
              <p>{{ $dateFormat(detailContent.ApplyTime) }}</p>
          </div>
        </div>
        <div class="conList">
          <div class="detail-conList">
              <p>负责人: </p>
              <p>{{ detailContent.FEmpName }}</p>
          </div>
          <div class="detail-conList">
              <p>状态: </p>
              <p>{{ $EnumData.getEnumDesByValue('ReimbursementStatus', detailContent.Status) }}</p>
          </div>
        </div>
        <div class="conList">
          <div class="detail-conList">
              <p>核销人: </p>
              <p>{{ detailContent.WritePerson }}</p>
          </div>
          <div class="detail-conList">
              <p>核销时间: </p>
              <p>{{ $dateFormat(detailContent.WriteOffTime) }}</p>
          </div>
        </div>
      <div class="top-title" style="margin-bottom: 10px">
        <span></span>
        <span>进度跟踪</span>
      </div>
      <div class="vertical-step">
        <div class="step-list" v-for="(item, index) in trackList" :key="index">
          <div class="step-content" :class="{ 'active-circle': index === 0, 'text-danger-circle': (index === 0 && (/已驳回/.test(item.Category))) }"></div>
          <div class="step-content">
            <p :class="{ active: index === 0, 'text-danger': (index === 0 && (/已驳回/.test(item.Category))) }">{{ item.Category }}</p>
            <div class="step-line" :class="{'is-last-item': index === (trackList.length - 1)}">
              <p style="font-size: 14px;color:gray; width: 400px" v-show="item.Content">
                <el-input
                  :disabled="true"
                  type="textarea"
                  class="textareaBoder"
                  :autosize="{ minRows: 0, maxRows: 10}"
                  v-model="item.Content">
                </el-input>
              </p>
              <p style="font-size: 12px;color:gray;margin-top: 10px">{{ $dateFormat(item.CreaterTime,'yyyy-MM-dd hh:mm') }}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
import { QueryReimbursementDetails } from '@/api/house'
import { priceFormat } from '../../../../utils/priceFormat'
export default {
  name: 'reimburseDetail',
  data() {
    return {
      detailLoading: false, // 进页面加载
      imageList: [], // 图片凭证
      detailContent: {}, // 报销内容
      costList: [], // 费用项目
      textboolean: true, // 备注是否可以编辑
      trackList: [], // 进度跟踪
      cloneData: null
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
      this.detailLoading = true
      QueryReimbursementDetails({ KeyID: this.$route.query.KeyID }).then(({ Data }) => {
          if (Data) {
            const { ImageList, reimbursements, reimbursementTypes, reimbursementRecords } = Data
            this.imageList = ImageList || []
            this.detailContent = reimbursements && reimbursements[0] || {}
            this.costList = reimbursementTypes && this.filterCostList(reimbursementTypes, 'Money')
            this.trackList = reimbursementRecords || []
          }
          this.detailLoading = false
      }).catch(err => {
        this.detailLoading = false
        console.log(err)
      })
    },
    filterCostList(data, key) {
      const amount = data.reduce((prev, next) => {
        return prev + next[key]
      }, 0)
      const costItem = {
        BillProjectName: '',
        BillProjectTypeName: '',
        Money: '合计金额: ' + priceFormat(amount) + '元'
      }
      return [...data, costItem]
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
  // .textareaBoder .el-textarea__inner{
  //     border: none;
  //     resize: none;
  //     background-color: white !important;
  //     color: gray !important;
  // }
  // .textareaBoder .el-textarea__inner:hover{
  //     cursor: default;
  // }
  .top-title{
      font-size: 16px;
      overflow: hidden;
      span {
        float: left;
      }
      span:nth-child(1){
          height: 18px;
          width: 5px;
          background-color: #389ef2;
      }
      span:nth-child(2){
          margin-left: 10px;
      }
  }
  .leftWidth{
    width: 70%;
  }
  .TopConList {
    margin-top: 20px;
    .conList {
      overflow: hidden;
      padding: 12px 0;
      font-size: 14px;
      .detail-table {
        width: '100%'
      }
      .detail-conList {
        overflow: hidden;
        float: left;
        width: 33.3%;
        p {
          float: left;
        }
        p:nth-child(1){
          width: 80px;
          text-align: right;
          margin-left: -20px;
        }
        p:nth-child(2){
          margin-left: 15px;
        }
      }
    }
  }
  .upload-img-box {
    overflow: hidden;
    .upload-img{
      display: inline-block;
      margin-right: 10px;
    }
  }
  .vertical-step {
      overflow: hidden;
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
