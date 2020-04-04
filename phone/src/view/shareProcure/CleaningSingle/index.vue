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
        <p>{{detailList.TenName}} {{detailList.TenPhone}}</p>
      </div>
      <div class="detail_Top">
        <p>业务员</p>
        <p>{{detailList.UserName}} {{detailList.Phone}}</p>
      </div>
      <div class="detail_Top">
        <p>保洁员工</p>
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
        <p>{{filterState(detailList.State)}}</p>
      </div>
    </div>
    <div class="detail_contentRemark">
      <p class="detail_title">保洁内容</p>
      <div class>
        <textarea class="detail_textarea" disabled v-model="detailList.CleaningContent"></textarea>
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
        <textarea class="detail_textarea" disabled v-model="detailList.Remark"></textarea>
      </div>
    </div>
    <p v-if="detailList.State === 4" class="detail_title">保洁信息</p>
    <div v-if="detailList.State === 4" class="detail_ffffff canelPaddingTop">
      <div class="detail_Top">
        <p>完成时间</p>
        <p>{{detailList.CompleteTime}}</p>
      </div>
      <div class="detail_Img">
        <p>保洁图片</p>
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
        <p>保洁备注</p>
        <textarea class="detail_textarea canelPadding" disabled v-model="detailList.HandleBZ"></textarea>
      </div>
    </div>
    <p class="detail_title"></p>
    <div v-if="detailList.State !== 4" style="text-align: center;margin:20px 0;">
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
    Promise.all([getPerson(this.token, 3, this.$route.query.KeyID, this.$route.query.ShareID)]).then(
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
        url: baseURL + `/CompanyMethod/QueryCleningDetails?Token=${this.token}`,
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
      this.detailList = data.Data
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
      this.imgListDetail = data.Data.Img
      this.CleaningImgList = data.Data.HandleImg
    },
    filterState(status) {
      return status === 1
        ? '暂存'
        : status === 2
        ? '待指派'
        : status === 3
        ? '待处理'
        : status === 4
        ? '已完成'
        : ''
    },
    nextComplete() {
      this.$router.push({
        name: 'shareClearComplete',
        query: {
          KeyID: this.formData.KeyID,
          token: this.token,
          remark: '保洁备注',
          Type: 3,
          ShareID: this.$route.query.ShareID,
          routerName: 'CleaningSingle'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style.scss';
</style>
