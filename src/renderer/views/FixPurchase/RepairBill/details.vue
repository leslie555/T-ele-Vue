<template>
      <div class="app-container">
          <div class="panel" v-loading="detailLoading">
                <div class="leftWidth">
                    <div class="TopTittle">
                        <span></span>
                        <span>申请详情</span>
                    </div>
                    <div class="TopConList">
                        <div class="conList">
                            <div class="detail-conList">
                                <p>房源名称：</p>
                                <p>{{ detailsList.HouseName }}</p>
                            </div>
                            <div class="detail-conList">
                                <!-- <p>部门：</p> -->
                                <p>组织：</p>
                                <p>{{ detailsList.CompanyName }}</p>
                            </div>
                            <div class="detail-conList">
                                <p>地址：</p>
                                <p>{{ detailsList.Location }}</p>
                            </div>
                        </div>
                        <div class="conList">
                            <!-- <div class="detail-conList">
                                <p>产权面积：</p>
                                <p>{{ detailsList.RoomArea }}</p>
                            </div> -->
                            <div class="detail-conList">
                                <p>业务员：</p>
                                <p>{{ detailsList.UserName }}
                                    <span style="margin-left:10px;">{{ detailsList.Phone }}</span></p>
                            </div>
                            <div class="detail-conList">
                                <p>租客：</p>
                                <p>{{ detailsList.TenName }}
                                    <span style="margin-left:10px;">{{ detailsList.TenPhone }}</span></p>
                            </div>
                        </div>
                        <div class="conList">
                            <div class="detail-conList">
                                <p>提交时间：</p>
                                <p>{{ $dateFormat(detailsList.CreaterTime) }}</p>
                            </div>
                            <div class="detail-conList">
                                <p>状态：</p>
                                <p>{{ getFullStatus(detailsList.State) }}</p>
                            </div>
                        </div>
                        <div class="conList">
                            <div class="detail-conList">
                                <p>维修内容：</p>
                                <p>{{ detailsList.MaintainContent }}</p>
                            </div>
                        </div>
                    </div>
                    <el-form label-width="70px"  :inline="false" ref="FormImg" style="margin-top:10px;overflow:hidden;">
                        <el-form-item label="图片:">
                            <div class="upload-img-Box" v-viewer="{url: 'data-src'}">
                                <div
                                class="upload-img"
                                v-for="(item, index) in detailsList.imageSumList"
                                :key="index"
                                >
                                <img
                                    :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                                    :data-src="$ImgUnit.getImgUrl(item.ImageLocation)"
                                >
                                </div>
                            </div>
                            </el-form-item>
                            <el-form-item label="备注:">
                            <el-input type="textarea" :disabled='textboolean' v-model="detailsList.Remark"></el-input>
                        </el-form-item>
                    </el-form>
                    <div v-if="detailsList.State !== 1 && detailsList.State !== 2">
                        <div class="TopTittle">
                            <span></span>
                            <span>维修信息</span>
                        </div>
                        <div class="leftWidth">
                            <div class="TopConList">
                                <div class="conList">
                                    <div class="detail-conList">
                                        <p>维修人员：</p>
                                        <p>{{ detailsList.MaintainEmpName }}</p>
                                    </div>
                                    <div v-if="detailsList.State !== 5 && detailsList.State !== 3" class="detail-conList">
                                        <p>完成时间：</p>
                                        <p>{{ $dateFormat(detailsList.CompleteTime) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-form v-if="detailsList.State !== 5 && detailsList.State !== 3" label-width="80px"  :inline="false" ref="FormImg" style="margin-top:10px;overflow:hidden;">
                            <el-form-item label="维修图片:">
                                <div class="upload-img-Box" v-viewer="{url: 'data-src'}">
                                    <div
                                    class="upload-img"
                                    v-for="(item, index) in (detailsList.MaintainIDSumList.length > 0 ? detailsList.MaintainIDSumList : detailsList.HandleImgList)"
                                    :key="index"
                                    >
                                    <img
                                        :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                                        :data-src="$ImgUnit.getImgUrl(item.ImageLocation)"
                                    >
                                    </div>
                                </div>
                                </el-form-item>
                                <el-form-item label="维修备注:">
                                <el-input type="textarea" :disabled='textboolean' v-model="detailsList.repairRemark"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="TopTittle">
                        <span></span>
                        <span>进度跟踪</span>
                    </div>
                    <div class="verticalStep">
                        <div  class="stepList" v-for="(item, key) in detailsList.Progresstrack" :key = key>
                            <div class="fl"></div>
                            <div class="fl">
                                <p style="font-size: 15px;">{{ item.Category }}</p>
                                <p style="font-size: 14px;color:gray;">
                                    <el-input
                                    :disabled="true"
                                    type="textarea"
                                    class="textareaBoder"
                                    :autosize="{ minRows: 0, maxRows: 10}"
                                    v-model="item.Content">
                                    </el-input>
                                </p>
                                <p style="font-size: 12px;color:gray;">{{ $dateFormat(item.CreaterTime,'yyyy-MM-dd hh:mm:ss') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
          </div>
      </div>
</template>

<script>
  import { SelectMaintainDetailByID } from '@/api/purchase'
  export default {
    name: 'detail-repairBill',
    data() {
      return {
          detailLoading: false,
          // 文本框判断
          textboolean: true,
          // 判断路由是从采购还是装修进来
          MaintenanceCleaning: null,
          // 申请详情字段显示
          detailsList: {},
          KeyID: null
      }
    },
    methods: {
        // 调用详情的接口
        getDetailData(KeyID) {
          SelectMaintainDetailByID({
              KeyID: KeyID
          }).then(({ Data, BusCode, Msg }) => {
            //   this.detailsStepList = Data.RenovationTrack
              this.detailsList = Data
              this.detailsList.repairRemark = Data.HandleBZ || Data.MaintainRemark
            //   this.imageList = Data.imageList
            //   this.tableData = Data.DecorationDetails
          })
        },
        // tabel 判断状态
        getFullStatus(status) {
           return status === 1 ? '暂存' : status === 2 ? '待指派' : status === 3 ? '待维修' : status === 4 ? '处理完成' : status === 5 ? '转装修' : ''
        }
    },
    created() {
      // 为1 装修经理进来 为0 采购部进来
    //   this.purchaseOrfitment = Number(this.$route.query.purchaseOrfitment)
      // 获取详情接口
      this.getDetailData(this.$route.query.KeyID)
      // 获取详情KeyID
      this.KeyID = this.$route.query.KeyID
    },
      // 判断那个页面进入的详情
    beforeRouteEnter(to, from, next) {
      if (to.query.MaintenanceCleaning === 0) {
        to.meta.title = '维修详情'
      } else if (to.query.MaintenanceCleaning === 1) {
        to.meta.title = '维修申请详情'
      }
      next()
    }
  }
</script>
<style lang="scss">
    .textareaBoder .el-textarea__inner{
        border: none;
        resize: none;
        background-color: white !important;
        color: gray !important;
    }
    .textareaBoder .el-textarea__inner:hover{
        cursor: default;
    }
</style>
<style lang="scss" scoped>
  @import "../../../styles/mixin.scss";
  .detail-content {
    min-height: 480px;
    width: 90%;
    margin: 0 auto;
    background-color: white;
  }
  p{
     margin-bottom: 10px;
   }

  .TopTittle{
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
  .TopConList{
      margin-top: 20px;
    .conList{
        overflow: hidden;
            padding: 12px 0;
            font-size: 14px;
        .detail-conList{
            overflow: hidden;
            float: left;
            width: 33.3%;
            p{
                float: left;
                color: #606266;
            }
            p:nth-child(1){
                width: 70px;
                text-align: right;
            }
            p:nth-child(2){
                margin-left: 20px;
            }
        }
    }
  }
  .fitmentItem{
      font-size: 14px;
      margin-right: 20px;
  }
  .marginT20{
      margin: 30px 0;
  }
  .verticalStep{
      color: #389ef2;
      overflow: hidden;
      .stepList{
          overflow: hidden;
          margin-top: 20px;
        .fl{
            float: left;
        }
        .fl:nth-child(1){
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #389ef2;
            margin-top: 5px;
            margin-right: 20px;
        }
        .fl:nth-child(2){
            p{
                margin-bottom: 0;
            }
            p:nth-child(2){
                margin: 10px 0
            }
        }
      }
  }
  .upload-img-Box{
      overflow: hidden;
  }
  .upload-img{
    float: left;
    margin-right: 10px;
  }
</style>
