<template>
  <div class="upload-container">
    <div class="upload-box">
      <el-upload
        ref="upload"
        list-type="picture-card"
        accept="image/*"
        action=""
        :on-change="handleChange"
        :http-request="uploadFile"
        multiple
        :auto-upload="false">
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>
    <div class="btn-box">
      <el-button type="primary" @click="submitUpload" :loading="uploadProgress>0" :disabled="disabled">{{buttonText}}
      </el-button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { baseURL } from '../../config'

  export default {
    data() {
      return {
        query: this.$route.query,
        formData: null,
        tempList: [],
        uploadProgress: 0,
        fileCount: 0,
        disabled: false
      }
    },
    computed: {
      buttonText() {
        return this.uploadProgress > 0 ? '上传中，请勿关闭' : '开始上传'
      }
    },
    mounted() {
      if (!this.query.code || !this.query.token) {
        this.$alert('参数错误')
        this.disabled = true
      }
    },
    methods: {
      uploadFile(file) {
        this.formData.append('file', file.file)
        this.fileCount++
      },
      handleChange(file, fileList) {
        if (!this.beforeAvatarUpload(file.raw)) {
          const index = fileList.findIndex(v => v.uid === file.uid)
          fileList.splice(index, 1)
        }
        this.tempList = fileList
      },
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')
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
      submitUpload() {
        this.formData = new FormData()
        this.fileCount = 0
        this.$refs.upload.submit()
        if (this.fileCount === 0) {
          this.$alert('还未选择图片')
          return
        }
        this.formData.append('code', this.query.code || '')
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        // 附加code标识
        axios({
          url: baseURL + `/SystemMethod/imageUp?Token=${this.query.token}`,
          method: 'post',
          data: this.formData,
          config,
          onUploadProgress: (progressEvent) => {
            console.log(progressEvent)
            if (progressEvent.lengthComputable) {
              this.uploadProgress = Math.ceil(progressEvent.loaded * 100 / progressEvent.total)
            }
          }
        }).then(({ data }) => {
          if (data.Code === 0) {
            data.Data.reverse()
            let i = 0
            this.tempList.map(v => {
              if (v.status === 'ready') {
                data.Data[i++].uid = v.uid
                v.status = 'success'
              }
            })
            this.uploadProgress = 0
            this.$alert('上传成功,可继续上传。')
          } else {
            throw new Error(data.Msg)
          }
        }).catch(({ message }) => {
          this.uploadProgress = 0
          this.$alert(message)
        })
      }
    }
  }
</script>

<style lang="scss">
  @import './style';
</style>
