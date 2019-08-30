<template>
  <el-form>
    <div class="clearfix">
      <el-form-item :label="title">
        <div class="upload-btn" style="position: relative;" @mouseenter="HouseInfoHover">
          <i class="iconfont icon-shangchuantupianmoren"></i>
          <span>上传图片</span>
          <div class="upload-btnBox" :style="{'display': isHover ? 'block' : 'none'}" @mouseleave="HouseInfoLeave">
            <el-scrollbar style="height: 100%;">
              <span class="upload-BtnList" @click="dialogOpen(index)" v-for="(item, index) in imgDataList" :key="index">{{ item.RoomName }}</span>
            </el-scrollbar>
          </div>
        </div>
        <el-row>
          <span style="color: #389EF2;">最多上传20张, 建议尺寸480*360以上; 每张最大5M</span>
        </el-row>
        <div class="upload-imgs" v-for="(img, imgIndex) in imgList" :key="imgIndex" v-show="img.length > 0" >
          <div class="upload-img-name">{{ imgIndex === 0 ? '公共区域图片' : imgDataList[imgIndex].RoomName + '图片' }}</div>
          <div class="upload-img-Box">
            <draggable v-model="imgList[imgIndex]">
              <div class="upload-img" v-for="(item, index) in img" :key="index">
                <img :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)" @click="$seeImage($ImgUnit.getImgUrl(item.ImageLocation))">
                <i class="iconfont icon-shanjianmoren" @click="delImg(imgIndex, index)"></i>
                <img src="../../../../../../assets/HouseList/bookPaper.png" alt="" class="upload-paper" v-show="index === 0">
              </div>
            </draggable>
          </div>
        </div>
        <el-row>
          <span style="color: #389EF2;">温馨提示: 拖动图片可以排序, 放在第一张的默认为封面, 快来试试吧!</span>
        </el-row>
        <div v-for="(img, imgIndex) in imgList" :key="imgIndex + 200">
          <upload-dialog :img-list="img" :ref="'uploadFile'+imgIndex"></upload-dialog>
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
  import { UploadDialog } from '@/components/UploadFile'
  import draggable from 'vuedraggable'

  export default {
    name: 'UploadFile',
    props: {
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
      houseCostFalData: {
        type: Array,
        default: []
      }
    },
    components: {
      UploadDialog,
      draggable
    },
    data() {
      return {
        CurIndex: -1,
        isHover: false,
        imgDataList: [{
          RoomName: '公共'
        }],
        imgList2: {}
      }
    },
    created() {
    },
    methods: {
      delImg(n, index) {
        this.$set(this.imgList, n, (() => {
          this.imgList[n].splice(index, 1)
          return this.imgList[n]
        })())
      },
      dialogOpen(index) {
        this.$refs[`uploadFile${index}`][0].open()
      },
      test(msg) {
        this.CurIndex = -2
      },
      HouseInfoHover() {
        this.isHover = true
      },
      HouseInfoLeave() {
        this.isHover = false
      }
    },
    watch: {
      houseCostFalData: {
        handler(newV, oldV) {
          if (newV !== []) {
            this.imgDataList.splice(1, this.imgDataList.length - 1)
            newV.forEach(ele => {
              if (ele.RoomName !== '整套') {
                this.imgDataList.push({
                  RoomName: ele.RoomName
                })
              }
            })
          }
        },
        immediate: true,
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'style';
</style>
<style lang="scss">
.clearfix{
  .upload-btnBox{
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
