<template>
  <div>
    <div class="detail_ffffff">
      <div class="detail_Top">
        <p>房源名称</p>
        <p>{{detailList.HouseName}}</p>
      </div>
      <div class="detail_Top">
        <p>地址</p>
        <p>{{detailList.Location}}</p>
      </div>
      <div class="detail_Top">
        <p>钥匙位置</p>
        <p>{{detailList.KeyLocation}}</p>
      </div>
      <div class="detail_Top">
        <p>产权面积</p>
        <p>{{detailList.RoomArea === 0 ? '' : detailList.RoomArea + 'm²'}}</p>
      </div>
      <div class="detail_Top">
        <p>业务员</p>
        <p>{{detailList.Salesman}}</p>
      </div>
      <div class="detail_Top">
        <p>保采购员工</p>
        <p>{{detailList.CShareName}}</p>
      </div>
      <div class="detail_Top">
        <p>部门</p>
        <p>{{detailList.CompanyName}}</p>
      </div>
      <div class="detail_Top">
        <p>提交时间</p>
        <p>{{detailList.CreaterTime}}</p>
        <!-- <p>{{dateFormat(detailList.CreaterTime,'yyyy-MM-dd')}}</p> -->
      </div>
      <div class="detail_Top">
        <p>状态</p>
        <p>{{filterState(detailList.PurchasingtStatus)}}</p>
      </div>
    </div>
    <p class="detail_title">采购项目</p>
    <div class="detail_ffffff" style="padding-top: 0">
      <div class="detail_Top" v-for="(item, index) in DecorationDetails" :key="index">
        <p>{{item.ProjectName}}</p>
        <p>{{item.ExternalPrice}}元/㎡,数量{{item.Number}},金额{{item.ExternalPriceTotalAmount}}元</p>
      </div>
    </div>
    <div class="detail_contentRemark">
      <p class="detail_title">房源照片</p>
      <div class="detail_titleImg detail_clickImgPic" @click="show('detail_clickImgPic')" v-viewer="{movable: false}">
          <img class="detail_ImgSize" v-for="(item) in imgListDetail" :key="$ImgUnit.getThumbImgUrl(item.ImageLocation)" :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)" />
        </div>
    </div>
    <div class="detail_contentRemark">
      <p class="detail_title">备注</p>
      <div>
        <textarea class="detail_textarea" disabled v-model="detailList.CGBZ"></textarea>
      </div>
    </div>
    <p v-if="detailList.PurchasingtStatus === 2" class="detail_title">采购单信息</p>
    <div v-if="detailList.PurchasingtStatus === 2" class="detail_ffffff canelPaddingTop">
      <div class="detail_Top">
        <p>完成时间</p>
        <p>{{detailList.CGCompleteTime}}</p>
      </div>
      <div class="detail_Img">
        <p>采购图片</p>
        <div class="detail_titleImg detail_clickImg" @click="show('detail_clickImg')" v-viewer="{movable: false}">
            <img class="detail_ImgSize" v-for="(item) in CleaningImgList" :key="$ImgUnit.getThumbImgUrl(item.ImageLocation)" :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)" />
          </div>
      </div>
      <div class="detail_Img">
        <p>采购备注</p>
        <textarea class="detail_textarea canelPadding" disabled v-model="detailList.CGHandleBZ"></textarea>
      </div>
    </div>
    <p class="detail_title"></p>
    <div v-if="detailList.PurchasingtStatus !== 2" style="text-align: center;margin:20px 0;">
      <el-button style="background: #389EF2;color: #FFFFFF;" @click.stop="nextComplete">上传图片</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { baseURL } from '../../../config'
import { dateFormat } from '../../../utils/dateFormat'
import getPerson from '../components/getPerson'
import showImg from '../components/showImg'
import '../components/Viewer'
export default {
  data() {
    return {
      token: '',
      formData: {
        KeyID: ''
      },
      detailList: {},
      imgListDetail: [],
      CleaningImgList: [],
      DecorationDetails: [],
      // 备注
      purchaBZ: ''
    }
  },
  created() {
    this.token = this.$route.query.token
    this.formData.KeyID = this.$route.query.KeyID
    Promise.all([getPerson(this.token, 5, this.$route.query.KeyID, this.$route.query.ShareID)]).then(data => {
      if (data[0].Code === 0) {
        this.axiosInterface()
      }
    })
  },
  methods: {
    show(val) {
      const _that = this
      showImg(_that, val)
    },
    axiosInterface() {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      return axios({
        url:
          baseURL +
          `/CompanyMethod/SPurchasingOrderDetails?Token=${this.token}`,
        method: 'post',
        data: this.formData,
        config
      })
        .then(({ data }) => {
          if (data.Code === 0) {
            this.pageSHow(data)
          } else {
            throw new Error(data.Msg)
          }
        })
        .catch(({ message }) => {})
    },
    pageSHow(data) {
      this.detailList = data.Data.ApplyRecord[0]
      this.detailList.CGCompleteTime = dateFormat(
        this.detailList.CGCompleteTime,
        'yyyy-MM-dd'
      )
      this.imgListDetail = data.Data.imageList
      this.CleaningImgList = data.Data.CgImageList
      this.DecorationDetails = data.Data.purchasingOrderDetails
      this.detailList.CreaterTime = dateFormat(
        this.DecorationDetails[0].CreaterTime,
        'yyyy-MM-dd'
      )
    },
    filterState(status) {
      return status === 1
        ? '未安装'
        : status === 2
        ? '已安装'
        : status === 3
        ? '待审批（经理）'
        : status === 4
        ? '待审批（采购部）'
        : ''
    },
    nextComplete() {
      this.$router.push({
        name: 'shareClearComplete',
        query: {
          KeyID: this.formData.KeyID,
          token: this.token,
          remark: '采购备注',
          Type: 5,
          ShareID: this.$route.query.ShareID,
          routerName: 'purchaseSingle'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style.scss';
</style>
