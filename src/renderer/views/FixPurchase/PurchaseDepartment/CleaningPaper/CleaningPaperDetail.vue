<template>
      <div class="panel app-content" v-loading="detailLoading">
        <div>
          <div class="panel-title">保洁详情</div>
          <ul class="detail-list">
            <li> <label> 房源名称 &nbsp; &nbsp; </label> <span>{{detailList.HouseName}}</span> </li>
            <li> <label> 部门 &nbsp; &nbsp; </label> <span>{{detailList.CompanyName}}</span> </li>
            <li> <label>  地址 &nbsp; &nbsp; </label> <span>{{detailList.Location}}</span> </li>
            <li> <label> 业务员 &nbsp; &nbsp; </label> <span>{{detailList.UserName}} {{detailList.Phone}}</span> </li>
            <li> <label> 租客 &nbsp; &nbsp; </label> <span>{{detailList.TenName}} {{detailList.TenPhone}}</span> </li>
            <li> <label> 保洁内容 &nbsp; &nbsp; </label> <span>{{detailList.CleaningContent}}</span> </li>
            <li> <label> 提交时间 &nbsp; &nbsp; </label> <span>{{$dateFormat(detailList.CreaterTime,'yyyy-MM-dd')}}</span> </li>
            <li> <label>  状态 &nbsp; &nbsp; </label> <span>{{filterState(detailList.State)}}</span> </li>
            <li></li>
          </ul>
          <div class="detail-content">
            <p  v-viewer="{url: 'data-src'}">
              <!-- <label class="img-detail"> 图片 &nbsp; &nbsp; </label> -->
              <label> 图片 &nbsp; &nbsp; </label>
              <span
              v-for="(item, index) in imgListDetail"
              :key="index"
              >
                <img class="img-preview" :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                      :data-src="$ImgUnit.getImgUrl(item.ImageLocation)"
                >
              </span>
               </p>
            <p> <label> 备注 &nbsp; &nbsp; </label>
                <!-- <span>{{detailList.Remark}}</span> -->
                <el-input
                class="remark-style"
                type="textarea"
                :rows="2"
                :disabled="true"
                v-model="detailList.Remark">
              </el-input>
            </p>
          </div>
        </div>
        <div v-if="detailList.State === 3 || detailList.State === 4">
          <div class="panel-title">保洁信息</div>
          <ul class="detail-list">
            <li v-if="detailList.State !== 2 && detailList.State === 3 || detailList.State === 4"> <label>  保洁人员 &nbsp; &nbsp; </label> <span>{{detailList.CleaningEmpName}}</span> </li>
            <li v-if="detailList.State !== 2 && detailList.State === 4"> <label>  完成时间 &nbsp; &nbsp; </label> <span>{{$dateFormat(detailList.CompleteTime,'yyyy-MM-dd')}}</span> </li>
            <li></li>
          </ul>
          <div v-if="detailList.State !== 2 && detailList.State === 4" class="detail-content">
            <p  v-viewer="{url: 'data-src'}">
              <label> 保洁图片 &nbsp; &nbsp; </label>
              <span
              v-for="(item, index) in CleaningImgList"
              :key="index"
              >
                <img class="img-preview" :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                      :data-src="$ImgUnit.getImgUrl(item.ImageLocation)"
                >
              </span>
            </p>
            <p> <label> 备注 &nbsp; &nbsp; </label>
              <!-- <span>{{detailList.CleaningRemark}}</span> -->
              <el-input
                class="remark-style"
                type="textarea"
                :rows="2"
                :disabled="true"
                v-model="detailList.CleaningRemark">
              </el-input>
             </p>
          </div>
        </div>
        <div>
          <div class="panel-title">进度跟踪</div>
          <div class="detail-step">
             <div
              class="step-radio"
              v-for="(item, index) in stepList"
              :key="index"
             >
                <i></i>
                <div class="step-active">{{ item.Category }}</div>
                <div class="step-remark"> {{item.Content}} </div>
                <div class="step-date">{{$dateFormat(item.CreaterTime,'yyyy-MM-dd hh:mm:ss') }}</div>
             </div>
          </div>
        </div>
      </div>
</template>
<script>
import { QueryCleningDetails } from '@/api/purchase'
export default {
  name: 'cleaning-paper-detailList',
  data() {
    return {
      detailList: {},
      imgListDetail: [],
      CleaningImgList: [],
      stepList: [],
      KeyID: null,
      detailLoading: false,
      procureList: [
        { value: 0, label: '全部' },
        { value: 1, label: '暂存' },
        { value: 2, label: '待指派' },
        { value: 3, label: '待处理' },
        { value: 4, label: '已完成' }
      ]
    }
  },
  created() {
    console.log('created')
    this.queryCleaning(this.$route.query.KeyID)
    this.KeyID = this.$route.query.KeyID
  },
  methods: {
    queryCleaning(KeyID) {
      // console.log(this.$route)
      // const { KeyID } = this.$route.query
      this.detailLoading = true
      QueryCleningDetails({
        KeyID: KeyID
      }).then(res => {
        console.log('保洁详情', res)
        this.detailList = res.Data
        // this.detailList.State = this.filterState(res.Data.State)
        this.imgListDetail = res.Data.Img
        if (res.Data.CleaningImg.length === 0) {
          this.CleaningImgList = res.Data.HandleImg
        } else {
          this.CleaningImgList = res.Data.CleaningImg
        }
        if (this.detailList.CleaningRemark === '') {
          this.detailList.CleaningRemark = this.detailList.HandleBZ
        }
        this.detailLoading = false
        this.stepList = res.Data.RenovationPlanTrack
      })
    },
    filterState(status) {
       return status === 1 ? '暂存' : status === 2 ? '待指派' : status === 3 ? '待处理' : status === 4 ? '已完成' : ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next()
  }
}
</script>
<style lang="scss" scoped>
@import './styles'
</style>
