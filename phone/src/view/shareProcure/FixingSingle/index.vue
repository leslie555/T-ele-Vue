<template>
  <div>
      <div class="detail_ffffff">
        <div class="detail_Top">
          <p>房源名称</p>
          <p>{{detailList.HouseName}}</p>
        </div>
        <div class="detail_Top">
          <p>地址</p>
          <p>{{detailList.CompanyName}}</p>
        </div>
        <div class="detail_Top">
          <p>钥匙位置</p>
          <p>{{detailList.KeyLocation}}</p>
        </div>
        <div class="detail_Top">
          <p>产权面积</p>
          <p>{{(detailList.RoomArea || '') + '㎡'}}</p>
        </div>
        <div class="detail_Top">
          <p>业务员</p>
          <p>{{detailList.Salesman}}</p>
        </div>
        <div class="detail_Top">
          <p>装修员工</p>
          <p>{{detailList.ZShareName}}</p>
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
          <p>{{filterState(detailList.SheetStatus)}}</p>
        </div>
      </div>
      <div class="detail_contentRemark">
        <p class="detail_title">装修项目</p>
        <div class="detail_ffffff" style="padding-top: 0">
          <div class="detail_Top" v-for="(item, index) in projectList" :key="index">
            <p>{{item.ProjectName}}</p>
            <p>{{item.ExternalPrice}}元/㎡,数量{{item.Number}},金额{{item.ExternalPriceTotalAmount}}元</p>
          </div>
        </div>
      </div>
      <div class="detail_contentRemark">
        <p class="detail_title">房源照片</p>
        <div class="detail_titleImg detail_clickImgPic" @click="show('detail_clickImgPic')" v-viewer="{movable: false}">
          <img class="detail_ImgSize" v-for="(item) in houseImg" :key="$ImgUnit.getThumbImgUrl(item.ImageLocation)" :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)" />
        </div>
      </div>
      <div class="detail_contentRemark">
        <p class="detail_title">备注</p>
        <div>
          <textarea class="detail_textarea" disabled v-model="detailList.ZXBZ"></textarea>
        </div>
      </div>
      <p  v-if="detailList.SheetStatus === 3" class="detail_title">装修单信息</p>
      <div  v-if="detailList.SheetStatus === 3" class="detail_ffffff canelPaddingTop">
        <!-- <div class="detail_Top">
          <p>维修人员</p>
          <p>{{detailList.CleaningEmpName}}</p>
        </div> -->
        <div class="detail_Top">
          <p>完成时间</p>
          <p>{{detailList.ZXCompleteTime}}</p>
        </div>
        <div class="detail_Img">
          <p>装修图片</p>
          <div class="detail_titleImg detail_clickImg" @click="show('detail_clickImg')" v-viewer="{movable: false}">
            <img class="detail_ImgSize" v-for="(item) in fixingImg" :key="$ImgUnit.getThumbImgUrl(item.ImageLocation)" :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)" />
          </div>
        </div>
        <div class="detail_Img">
          <p>装修备注</p>
          <textarea class="detail_textarea canelPadding" disabled v-model="detailList.ZXHandleBZ"></textarea>
        </div>
      </div>
      <p class="detail_title"></p>
      <div style="text-align: center;margin:20px 0;">
      <div v-if="detailList.SheetStatus !== 3" style="text-align: center;margin:20px 0;">
        <el-button style="background: #389EF2;color: #FFFFFF;" @click.stop="nextComplete">上传图片</el-button>
      </div>
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
      projectList: [],
      houseImg: [],
      fixingImg: [],
      fixRemark: ''
    }
  },
  created() {
    this.token = this.$route.query.token
    this.formData.KeyID = this.$route.query.KeyID
    Promise.all([getPerson(this.token, 1, this.$route.query.KeyID, this.$route.query.ShareID)]).then(data => {
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
      axios({
        url: baseURL + `/CompanyMethod/SDecorationSheetDetails?Token=${this.token}`,
        method: 'post',
        data: this.formData,
        config
      })
        .then(({ data }) => {
          console.log(data)
          if (data.Code === 0) {
            this.detailList = data.Data['ApplyRecord'][0]
            this.detailList.CreaterTime = dateFormat(
              data.Data['decorationSheetDetails'][0].CreaterTime,
              'yyyy-MM-dd'
            )
            this.projectList = data.Data['decorationSheetDetails']
            if (this.detailList.SheetStatus === 3) {
              this.detailList.ZXCompleteTime = dateFormat(
                this.detailList.ZXCompleteTime,
                'yyyy-MM-dd'
              )
            }
            this.houseImg = data.Data.imageList
            this.fixingImg = data.Data.ZxImageList
          } else {
            throw new Error(data.Msg)
          }
        })
        .catch(({ message }) => {})
    },
    filterState(status) {
      return status === 1
        ? '未入场'
        : status === 2
        ? '已入场'
        : status === 3
        ? '已结束'
        : status === 4
        ? '待审批(经理)'
        : '待审批(采购部)'
    },
    nextComplete() {
      this.$router.push({
        name: 'shareClearComplete',
        query: {
          KeyID: this.detailList.KeyID,
          token: this.token,
          remark: '装修备注',
          Type: 1,
          ShareID: this.$route.query.ShareID,
          routerName: 'FixingSingle'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style.scss';
</style>
