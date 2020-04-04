<template>
      <div class="panel app-content" v-loading="detailLoading">
        <div>
          <div class="panel-title">搬家详情</div>
          <ul class="detail-list">
            <li> <label> 房源名称 &nbsp; &nbsp; </label> <span>{{detailList.HouseName}}</span> </li>
            <li> <label> 部门 &nbsp; &nbsp; </label> <span>{{detailList.CompanyName}}</span> </li>
            <li> <label>  地址 &nbsp; &nbsp; </label> <span>{{detailList.Location}}</span> </li>
            <li> <label> 业务员 &nbsp; &nbsp; </label> <span>{{detailList.Salesman}}</span> </li>
            <li> <label> 租客 &nbsp; &nbsp; </label> <span>{{detailList.TenantName}} {{detailList.TenantTel}}</span> </li>
            <li> <label> 搬家内容 &nbsp; &nbsp; </label> <span>{{detailList.MovingContent}}</span> </li>
            <li> <label> 提交时间 &nbsp; &nbsp; </label> <span>{{$dateFormat(detailList.CreaterTime,'yyyy-MM-dd')}}</span> </li>
            <li> <label>  状态 &nbsp; &nbsp; </label> <span>{{filterState(detailList.Status)}}</span> </li>
            <li></li>
          </ul>
          <div class="detail-content">
            <p v-viewer="{url: 'data-src'}">
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
                v-model="detailList.BZ">
              </el-input>
            </p>
          </div>
        </div>
        <div v-if="detailList.Status === 6 ||　detailList.Status === 5">
          <div class="panel-title">搬家信息</div>
          <ul class="detail-list">
            <li v-if="detailList.Status === 5 ||　detailList.Status === 6"> <label>  搬家人员 &nbsp; &nbsp; </label> <span>{{detailList.MovingName}}</span> </li>
            <li v-if="detailList.Status === 6"> <label>  完成时间 &nbsp; &nbsp; </label> <span>{{$dateFormat(detailList.CompleteTime,'yyyy-MM-dd')}}</span> </li>
            <li></li>
          </ul>
          <div v-if="detailList.Status === 6" class="detail-content">
            <p v-viewer="{url: 'data-src'}">
              <label> 搬家图片 &nbsp; &nbsp; </label>
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
                v-model="detailList.MovingBZ">
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
import { ShowHouseMovingDetails } from '@/api/service'
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
      ShowHouseMovingDetails({
        KeyID: KeyID
      }).then(res => {
        console.log('搬家详情', res)
        this.detailList = res.Data.HouseRecord[0]
        // this.detailList.Status = this.filterState(res.Data.Status)
        this.imgListDetail = res.Data.ImageList
        if (res.Data.MovingImageList.length === 0) {
          this.CleaningImgList = res.Data.HandleImg
        } else {
          this.CleaningImgList = res.Data.MovingImageList
        }
        if (this.detailList.MovingBZ === '') {
          this.detailList.MovingBZ = this.detailList.HandleBZ
        }
        this.detailLoading = false
        this.stepList = res.Data.RenovationTrack
      }).catch(() => {
        this.detailLoading = false
      })
    },
    filterState(status) {
      let type = ''
      switch (status) {
        case 0:
          type = '全部'
          break
        case 1:
          type = '暂存'
          break
        case 2:
          type = '待审批（经理)'
          break
        case 3:
          type = '待审批（采购部）'
          break
        case 4:
          type = '待指派'
          break
        case 5:
          type = '待处理'
          break
        case 6:
          type = '已完成'
          break
      }
      return type
    }
  },
  beforeRouteEnter(to, from, next) {
    next()
  }
}
</script>
<style lang="scss" scoped>
@import './styles.scss'
</style>
