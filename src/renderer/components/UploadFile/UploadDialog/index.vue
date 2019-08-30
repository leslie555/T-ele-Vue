<template>
  <el-dialog title="选择上传方式"
             :visible.sync="dialogVisible"
             class="upload-dialog"
             @open="openDialog"
             @close="closeDialog"
             append-to-body
             width="800px">
    <div class="tabs">
      <div class="tab" :class="{active:currentIndex==0}" @click="changeTab(0)">本地上传</div>
      <div class="tab" :class="{active:currentIndex==1}" @click="changeTab(1)">扫码上传</div>
    </div>
    <div class="upload-box" v-show="currentIndex==0">
      <div class="upload-content">
        <el-scrollbar class="vertical-scroll">
          <el-upload
            ref="upload"
            list-type="picture-card"
            accept="image/jpeg,image/png"
            action=""
            :on-change="handleChange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="normalList"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadFile"
            multiple
            :auto-upload="false">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-scrollbar>
      </div>
      <div class="upload-tip">
        <el-progress :text-inside="true" :stroke-width="16" :percentage="uploadProgress"
                     v-show="uploadProgress>0"></el-progress>
        <span>只能上传jpg/png文件，且单个不超过20M </span>
      </div>
    </div>
    <div class="upload-box upload-scan" v-show="currentIndex==1">
      <div class="upload-content">
        <div class="scan-box">
          <qrcode :value="baseURI" :options="{ size: 100 }"></qrcode>
          <div class="scan-text">
            <p>扫一扫，</p>
            <p>手机端上传图片</p>
          </div>
        </div>
        <div class="scan-scroll">
          <el-scrollbar class="vertical-scroll">
            <el-upload
              ref="upload1"
              action=""
              list-type="picture-card"
              :on-preview="handlePreview"
              :on-remove="handleRemoveScan"
              :file-list="scanList">
            </el-upload>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitUpload" :loading="uploadProgress>0">{{buttonText}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Qrcode from '@xkeshi/vue-qrcode'
  import uuid from '../../../utils/uuid'
  import axios from 'axios'
  import { baseURL, phoneURL } from '../../../config'
  import store from '../../../store/index'
  import { delImageByCode, getImageListByCode } from '../../../api/system'

  export default {
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
      }
    },
    components: {
      Qrcode
    },
    computed: {
      buttonText() {
        return this.uploadProgress > 0 ? '上传中，请勿关闭' : '确定'
      }
    },
    data() {
      return {
        testImg: require('../../../assets/ShareHouse/login.jpg'),
        dialogVisible: false,
        currentIndex: 0,
        currentLength: 0,
        baseURI: '',
        scanList: [],
        normalList: [],
        tempList: [],
        formData: null,
        uploadProgress: 0,
        code: uuid(),
        fileCount: 0,
        timer: null,
        timer1: null,
        switch: true
      }
    },
    created() {
      // this.tempList = this.imgList.slice()
    },
    beforeRouteLeave(to, from, next) {
      // 防止异常
      clearInterval(this.timer)
      clearInterval(this.timer1)
      next()
    },
    methods: {
      changeTab(index) {
        if (this.currentIndex !== index) {
          this.currentIndex = index
        }
      },
      getUrl() {
        this.baseURI = phoneURL + 'upload?code=' + this.code + '&token=' + store.getters.token
      },
      initData() {
        this.code = uuid()
        if (this.tempList.length === 0) {
          this.scanList = []
          this.normalList = []
          this.imgList.map((item) => {
            item.uid = Math.ceil(Math.random() * 5000000)
            const obj = {
              name: item.KeyID,
              url: this.$ImgUnit.getImgUrl(item.ImageLocation),
              uid: item.uid
            }
            if (item.UniqueCode) {
              this.code = item.UniqueCode
              this.scanList.push(obj)
            } else {
              this.normalList.push(obj)
            }
          })
        } else {
          this.normalList = this.tempList
          this.$spliceArr(this.normalList, (item, index) => {
            return this.imgList.findIndex(v => v.uid === item.uid) === -1 && item.status === 'success'
          })
          this.$spliceArr(this.scanList, (item, index) => {
            return this.imgList.findIndex(v => v.uid === item.uid) === -1
          })
        }
        this.currentLength = this.normalList.length
      },
      getSignImage() {
        getImageListByCode([this.code]).then(({ Data }) => {
          if (Data) {
            this.switch = true
            Data.reverse()
            // this.imgList.push(Data)
            Data.map(item => {
              if (this.imgList.find(v => v.KeyID === item.KeyID)) return
              item.uid = Math.ceil(Math.random() * 5000000)
              this.scanList.push({
                name: item.KeyID,
                url: this.$ImgUnit.getImgUrl(item.ImageLocation),
                uid: item.uid
              })
              this.imgList.push(item)
            })
          }
        })
      },
      setTimer() {
        this.switch = true
        this.timer = setInterval(() => {
          if (this.switch) {
            this.switch = false
            this.timer1 = setTimeout(() => {
              this.getSignImage()
            }, 6000)
          }
        }, 1000)
      },
      deleteImg(item) {
        delImageByCode({
          keyID: item.KeyID,
          uniqueCode: item.UniqueCode
        }).then(() => {
          this.$message.success('删除成功')
        })
      },
      open() {
        this.dialogVisible = true
      },
      close() {
        this.dialogVisible = false
      },
      uploadFile(file) {
        this.formData.append('file', file.file)
        this.fileCount++
      },
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
        const isLt20M = file.size / 1024 / 1024 < 20

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!')
          return false
        }
        if (!isLt20M) {
          this.$message.error('上传图片大小不能超过 20MB!')
          return false
        }
        if (this.tempList.length + this.normalList.length > this.maxLength) {
          this.$message.error(`上传图片数量不能超过${this.maxLength}张哟!`)
          return false
        }
        return true
      },
      submitUpload() {
        this.formData = new FormData()
        this.fileCount = 0
        this.$refs.upload.submit()
        if (this.fileCount === 0) {
          this.close()
          return
        }
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
            this.imgList.push(...data.Data)
            this.close()
          } else {
            throw new Error(data.Msg)
          }
        }).catch(({ message }) => {
          this.uploadProgress = 0
          this.$message.error(message)
        })
      },
      handleChange(file, fileList) {
        if (!this.beforeAvatarUpload(file.raw)) {
          const index = fileList.findIndex(v => v.uid === file.uid)
          fileList.splice(index, 1)
        }
        this.tempList = fileList
      },
      handleRemove(file, fileList) {
        const index = this.imgList.findIndex(v => v.uid === file.uid)
        this.imgList.splice(index, 1)
      },
      handleRemoveScan(file, fileList) {
        const index = this.imgList.findIndex(v => v.uid === file.uid)
        const item = this.imgList[index]
        this.imgList.splice(index, 1)
        const index1 = this.scanList.findIndex(v => v.uid === file.uid)
        this.scanList.splice(index1, 1)
        this.deleteImg(item)
      },
      handlePreview(file) {
        this.$seeImage(this.$ImgUnit.getImgUrl(file.url))
      },
      openDialog() {
        this.initData()
        this.getUrl()
        this.setTimer()
      },
      closeDialog() {
        this.uploadProgress = 0
        clearInterval(this.timer)
        clearInterval(this.timer1)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "style";
</style>
<style lang="scss">
  .upload-dialog {
    .el-dialog__body {
      padding: 0 0 25px 0;
    }
  }

  .upload-scan {
    .el-upload-list--picture-card .el-upload-list__item {
      width: 118px;
      height: 118px;
    }
    .el-upload {
      display: none;
    }
  }
</style>
