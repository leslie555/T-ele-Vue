<template>
  <div class="clearfix">
    <el-form-item :label="title">
      <div class="upload-btn" @click="dialogOpen" v-show="!disabled">
        <i class="iconfont icon-shangchuantupianmoren"></i>
        <span>上传图片</span>
      </div>
      <div class="upload-imgs" v-show="imgList.length>0">
        <div class="upload-img" v-for="(item,index) in imgList" :key="index">
          <img :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
               @click="$seeImage($ImgUnit.getImgUrl(item.ImageLocation))">
          <i class="iconfont icon-shanjianmoren" @click="delImg(index)" v-show="!disabled"></i>
        </div>
      </div>
      <div class="upload-notice" v-show="notice&&!disabled" v-text="notice">
        
      </div>
    </el-form-item>
    <upload-dialog ref="uploadDialog" :img-list="imgList" :max-length="maxLength"></upload-dialog>
  </div>
</template>

<script>
  import UploadDialog from '../UploadDialog'
  import { delImageByCode } from '../../../api/system'

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
      }
    },
    components: {
      UploadDialog
    },
    data() {
      return {
        testImg: require('../../../assets/ShareHouse/login.jpg')
      }
    },
    created() {
      //
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'style';
</style>
