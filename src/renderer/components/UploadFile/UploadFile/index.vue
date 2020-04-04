<template>
  <div class="clearfix">
    <el-form-item v-if="!single" :label="title" :required="required">
      <div class="upload-btn" @click="dialogOpen" v-show="!disabled">
        <i class="iconfont icon-shangchuantupianmoren"></i>
        <span>上传图片</span>
      </div>
      <div class="upload-imgs" v-show="imgList.length>0" v-viewer="{url: 'data-src'}">
        <div class="upload-img" v-for="(item,index) in imgList" :key="index">
          <img :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
               :data-src="$ImgUnit.getImgUrl(item.ImageLocation)">
          <i class="iconfont icon-shanjianmoren" @click="delImg(index)" v-show="!disabled"></i>
        </div>
      </div>
      <div class="upload-notice" v-show="notice&&!disabled" v-text="notice">
      </div>
    </el-form-item>
    <el-form-item v-if="single" :label="title" :required="required">
        <singleUpload :imgList="imgList" :upload-text="uploadText" @watchImgList="watchImgList"></singleUpload>
      <div class="upload-notice" v-show="notice&&!disabled" v-text="notice">
      </div>
    </el-form-item>
    <slot></slot>
    <upload-dialog ref="uploadDialog" :img-list="imgList" :max-length="maxLength"></upload-dialog>
  </div>
</template>

<script>
  import UploadDialog from '../UploadDialog'
  import { delImageByCode } from '../../../api/system'
  import singleUpload from './sigleIndex'
  export default {
    name: 'UploadFile',
    props: {
      maxLength: { // 电脑最大上传图片个数
        type: Number,
        default: 20
      },
      imgList: {
        type: Array,
        default() {
          return []
        }
      },
      title: {
        type: String,
        default: ''
      },
      notice: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      required: {
        type: Boolean,
        default: false
      },
      single: {
        type: Boolean,
        default: false
      },
      uploadText: {
        type: String,
        default: '上传图片'
      }
    },
    components: {
      UploadDialog,
      singleUpload
    },
    data() {
      return {
        testImg: require('../../../assets/ShareHouse/login.jpg'),
        copyImgList: []
      }
    },
    methods: {
      delImg(index) {
        const item = this.imgList[index]
        if (item.UniqueCode) {
          delImageByCode({
            keyID: item.KeyID,
            uniqueCode: item.UniqueCode
          })
        }
        this.imgList.splice(index, 1)
      },
      dialogOpen() {
        this.$refs.uploadDialog.open()
      },
      // liu
      watchImgList(val) {
        this.$emit('watchImgList', val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'style';
</style>
