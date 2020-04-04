<template>
  <div class="upload-boxSigle">
    <div class="upload-content">
      <el-upload
        ref="uploadTwo"
        list-type="picture-card"
        class="avatar-uploader"
        action
        accept="image/jpeg, image/png"
        :show-file-list="false"
        :on-change="handleChange"
        :http-request="uploadFile"
        :auto-upload="true"
        :before-upload="beforeAvatarUpload"
      >
        <i v-if="ImgListCopy.length === 0" class="iconfont icon-shangchuantupianmoren"></i>
        <span v-if="ImgListCopy.length === 0" class="upload-imgSize">{{uploadText}}</span>
        <img
          v-if="ImgListCopy.length !== 0"
          :src="$ImgUnit.getThumbImgUrl(ImgListCopy[0].ImageLocation)"
          :data-src="$ImgUnit.getImgUrl(ImgListCopy[0].ImageLocation)"
          class="avatar"
        />
        <span v-if="ImgListCopy.length !== 0" class="againLoad">重新上传</span>
        <i v-if="ImgListCopy.length !== 0" class="iconfont icon-shanjianxuanzhong delete-upload" @click.stop="delImg()"></i>
      </el-upload>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { baseURL } from '../../../config'
import store from '../../../store/index'

export default {
  name: 'singleUpload',
  props: {
    imgList: {
      type: Array,
      default() {
        return []
      }
    },
    uploadText: {
        type: String,
        default: '上传图片'
    }
  },
  components: {},
  data() {
    return {
      formData: null,
      ImgListCopy: []
    }
  },
  watch: {
    imgList: {
      handler(newValue, oldValue) {
        this.ImgListCopy = [...newValue]
      },
      immediate: true
    }
  },
  beforeRouteLeave(to, from, next) {
    // 防止异常
    clearInterval(this.timer)
    clearInterval(this.timer1)
    next()
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      return true
    },
    uploadFile(file) {
      this.formData = new FormData()
      this.formData.append('file', file.file)
      this.submitUpload()
    },
    submitUpload() {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // 附加code标识
      axios({
        url: baseURL + `/SystemMethod/imageUp?Token=${store.getters.token}`,
        method: 'post',
        data: this.formData,
        config,
        onUploadProgress: progressEvent => {
          if (progressEvent.lengthComputable) {
            this.uploadProgress = Math.ceil(
              (progressEvent.loaded * 100) / progressEvent.total
            )
          }
        }
      })
        .then(({ data }) => {
          if (data.Code === 0) {
            this.ImgListCopy.unshift(...data.Data)
            this.judgeImg(1)
          } else {
            throw new Error(data.Msg)
          }
        })
        .catch(({ message }) => {
          this.uploadProgress = 0
          this.$message.error(message)
        })
    },
    delImg() {
        this.ImgListCopy = []
        this.judgeImg(2)
    },
    judgeImg(num) {
        const arr = []
        if (num !== 2) {
          arr.push(this.ImgListCopy[0])
        }
        this.$emit('watchImgList', arr)
    },
    handleChange(val) {
    }
  }
}
</script>

<style scoped lang="scss">
@import 'style';
.upload-imgSize {
  font-size: 12px;
  margin-top: 12px;
  color: #909399;
}
.delete-upload {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 16px !important;
  color: red !important;
}
</style>
<style lang="scss">
@import '../../../styles/mixin';
@import '../../../styles/variables';
.upload-boxSigle {
  .avatar-uploader .el-upload {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }
    .againLoad {
        display: none;
        position: absolute;
        bottom: 5px;
        left: 10px;
        width: 80px;
        height: 20px;
        line-height: 20px;
        background: #389ef2;
        color: white !important;
        font-size: 14px;
        border-radius: 5px;
    }
    .avatar-uploader:hover {
        .againLoad {
            display: block;
        }
    }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    border-radius: 5px;
  }
  .el-upload--picture-card {
    @include displayFlex(column, center, center);
    width: 100px;
    height: 100px;
    line-height: normal;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 0;
    i {
      font-size: 30px;
      color: $--color-text-secondary;
      margin-bottom: 10px;
    }
    span {
      font-size: 12px;
      color: $--color-text-secondary;
    }
  }
}
</style>
