<template>
  <div class="detail_containTwo" v-loading="loading">
    <div>
      <!-- <p class="detail_titleTwo">上传照片</p>
        <div style="background: #ffffff; min-height: 120px">
          <span v-for="(item, index) in tempList" class="detail_ImgSizeSpan" :key="index">
            <img class="detail_ImgSize" :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)" />
          </span>
          <span class="detail_upload" @click="uploadImgClick">上传图片</span>
      </div>-->
      <p class="detail_titleTwo">上传照片</p>
      <div style="background: #ffffff; min-height: 120px;">
        <div style="padding-top:10px;">
          <el-upload
            accept="image/*"
            action
            ref="upload"
            list-type="picture-card"
            :on-change="handleChange"
            :auto-upload="false"
            :on-remove="handleRemove"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            </div>
          </el-upload>
        </div>
      </div>
    </div>
    <div>
      <p style="text-indent: 20px;">{{remark}}</p>
      <textarea class="picture_remark" v-model="CleaningRemark"></textarea>
    </div>
    <div class="detail_completeOk">
      <el-button class="detail_completeOkBtn" @click="completeOk" size="small">提交</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { baseURL } from '../../../config'
export default {
  data() {
    return {
      tempList: [],
      CleaningRemark: '',
      disabled: false,
      formData: null,
      loading: false,
      remark: this.$route.query.remark,
      HandleImageID: ''
    }
  },
  methods: {
    completeOk() {
      this.submitUpload()
    },
    handleRemove(file, fileList) {
      const index = this.tempList.findIndex(v => v.uid === file.uid)
      this.tempList.splice(index, 1)
    },
    handleChange(file, fileList) {
      if (this.beforeAvatarUpload(file.raw)) {
        this.tempList.push(file)
      }
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png'
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isJPG) {
        this.$alert('上传头像图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt20M) {
        this.$alert('上传头像图片大小不能超过 20MB!')
        return false
      }
      return true
    },
    async submitUpload() {
      this.formData = new FormData()
      for (let i = 0; i < this.tempList.length; i++) {
        this.formData.append('file', this.tempList[i].raw)
      }
      if (this.tempList.length === 0) {
        this.$alert('还未选择图片')
        return
      }
      this.loading = true
      await this.submitImg()
    },
    submitImg() {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios({
        url: baseURL + `/SystemMethod/imageUp?Token=${this.$route.query.token}`,
        method: 'post',
        data: this.formData,
        config
      })
        .then(({ data }) => {
          if (data.Code === 0) {
            const list = data.Data
            var a = ''
            list.map(v => {
              a += v.KeyID + ','
            })
            this.HandleImageID = a.substr(0, a.length - 1)
            this.submitFinsh()
          } else {
            throw new Error(data.Msg)
          }
        })
        .catch(({ message }) => {
          this.loading = false
          this.$alert(message)
        })
    },
    submitFinsh() {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      const obj = {
        Type: this.$route.query.Type,
        HandleImageID: this.HandleImageID,
        HandleBZ: this.CleaningRemark,
        KeyID: this.$route.query.KeyID
      }
      axios({
        url:
          baseURL +
          `/CompanyMethod/HandleComplete?Token=${this.$route.query.token}`,
        method: 'post',
        data: obj,
        config
      })
        .then(({ data }) => {
          if (data.Code === 0) {
            this.$router.push({
              name: this.$route.query.routerName,
              query: {
                KeyID: this.$route.query.KeyID,
                token: this.$route.query.token,
                ShareID: this.$route.query.ShareID
              }
            })
            this.loading = false
          } else {
            throw new Error(data.Msg)
          }
        })
        .catch(({ message }) => {
          this.loading = false
          this.$alert(message)
        })
    }
  }
}
</script>
<style lang="scss">
.detail_containTwo .el-upload--picture-card {
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
}
.detail_containTwo .el-upload-list--picture-card .el-upload-list__item {
  width: 100px !important;
  height: 100px !important;
}
</style>
<style lang="scss" scoped>
@import '../style.scss';
</style>
