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
        <p>租客</p>
        <p>{{detailList.TenantName}} {{detailList.TenantTel}}</p>
      </div>
      <div class="detail_Top">
        <p>业务员</p>
        <p>{{detailList.Salesman}}</p>
      </div>
      <div class="detail_Top">
        <p>搬家员工</p>
        <p>{{detailList.ShareName}}</p>
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
        <p>{{filterState(detailList.Status)}}</p>
      </div>
    </div>
    <div class="detail_contentRemark">
      <p class="detail_title">搬家内容</p>
      <div class>
        <textarea class="detail_textarea" disabled v-model="detailList.MovingContent"></textarea>
      </div>
    </div>
    <div class="detail_contentRemark">
      <p class="detail_title">图片凭证</p>
      <div
        class="detail_titleImg detail_clickImgPic"
        @click="show('detail_clickImgPic')"
        v-viewer="{movable: false}"
      >
        <img
          class="detail_ImgSize"
          v-for="(item) in imgListDetail"
          :key="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
          :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
        />
      </div>
    </div>
    <div class="detail_contentRemark">
      <p class="detail_title">备注</p>
      <div>
        <textarea class="detail_textarea" disabled v-model="detailList.BZ"></textarea>
      </div>
    </div>
    <p v-if="detailList.Status === 6" class="detail_title">搬家信息</p>
    <div v-if="detailList.Status === 6" class="detail_ffffff canelPaddingTop">
      <div class="detail_Top">
        <p>完成时间</p>
        <p>{{detailList.CompleteTime}}</p>
      </div>
      <div class="detail_Img">
        <p>搬家图片</p>
        <div
          class="detail_titleImg detail_clickImg"
          @click="show('detail_clickImg')"
          v-viewer="{movable: false}"
        >
          <img
            class="detail_ImgSize"
            v-for="(item) in CleaningImgList"
            :key="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
            :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
          />
        </div>
      </div>
      <div class="detail_Img">
        <p>搬家备注</p>
        <textarea class="detail_textarea canelPadding" disabled v-model="detailList.HandleBZ"></textarea>
      </div>
    </div>
    <p class="detail_title"></p>
    <div v-if="detailList.Status !== 6" style="text-align: center;margin:20px 0;">
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
      CleaningImgList: []
    }
  },
  created() {
    this.token = this.$route.query.token
    this.formData.KeyID = this.$route.query.KeyID
    Promise.all([getPerson(this.token, 4, this.$route.query.KeyID, this.$route.query.ShareID)]).then(
      data => {
        if (data[0].Code === 0) {
          this.axiosInterface()
        }
      }
    )
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
          baseURL + `/CompanyMethod/ShowHouseMovingDetails?Token=${this.token}`,
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
      this.detailList = data.Data.HouseRecord[0]
      this.detailList.CreaterTime = dateFormat(
        this.detailList.CreaterTime,
        'yyyy-MM-dd'
      )
      if (this.detailList.State === 4) {
        this.detailList.CompleteTime = dateFormat(
          this.detailList.CompleteTime,
          'yyyy-MM-dd'
        )
      }
      this.imgListDetail = data.Data.ImageList
      this.CleaningImgList = data.Data.HandleImageList
    },
    filterState(val) {
      let type = ''
      switch (val) {
        case 0:
          type = '全部'
          break
        case 1:
          type = '暂存'
          break
        case 2:
          type = '待审批（经理）'
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
    },
    nextComplete() {
      this.$router.push({
        name: 'shareClearComplete',
        query: {
          KeyID: this.formData.KeyID,
          token: this.token,
          remark: '搬家备注',
          Type: 4,
          ShareID: this.$route.query.ShareID,
          routerName: 'MovingSingle'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style.scss';
</style>
