<template>
  <el-dialog title="上传文件"
             :visible.sync="dialogVisible"
             class="upload-dialog"
             @open="openDialog"
             @close="closeDialog"
             append-to-body
             width="500px">
    <div class="upload-box">
      <div class="upload-content">
        <el-scrollbar class="vertical-scroll">
          <el-upload
            drag
            limit="1"
            ref="upload"
            class="upload-demo"
            action=""
            :on-change="handleChange"
            :on-remove="handleRemove"
            :http-request="uploadFile"
            :file-list="fileLists"
            :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__text">仅限单个文件上传</div>
          </el-upload>
        </el-scrollbar>
      </div>
    </div>
    <div class="upload-tip">
      <el-progress :text-inside="true" :stroke-width="16" :percentage="uploadProgress"
                  v-show="uploadProgress>0"></el-progress>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitUpload" :loading="uploadProgress>0">{{buttonText}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import axios from 'axios'
  import { baseURL } from '../../../config'
  import store from '../../../store/index'

  export default {
    computed: {
      buttonText() {
        return this.uploadProgress > 0 ? '上传中，请勿关闭' : '确定'
      }
    },
    data() {
      return {
        dialogVisible: false,
        currentLength: 0,
        tempData: {},
        fileLists: [],
        formData: null,
        uploadProgress: 0,
        fileCount: 0,
        switch: true
      }
    },
    methods: {
      open() {
        this.dialogVisible = true
      },
      close() {
        this.dialogVisible = false
      },
      uploadFile(file) {
        this.formData.append('file', file.file)
      },
      submitUpload() {
        this.formData = new FormData()
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
          url: baseURL + `/SystemMethod/FileUpLoad?Token=${store.getters.token}`,
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
            if (this.tempData.status === 'ready') {
              this.tempData.status = 'success'
            }
            this.fileLists.push(data.Data)
            this.$emit('onSubmitFile', this.fileLists[0]) // 触发父组件的函数，调用具体上传接口
            this.fileLists.pop()
            this.close()
          } else {
            throw new Error(data.Msg)
          }
        }).catch(({ message }) => {
          this.uploadProgress = 0
          this.$message.error(message)
        })
      },
      // on-change添加和上传时才会调用
      handleChange(file, fileList) {
        this.tempData = file // 只能上传单个文件
        this.fileCount++
      },
      handleRemove(file, fileList) {
        this.fileLists.pop()
        this.fileCount--
      },
      openDialog() {
        this.fileLists = []
        this.fileCount = 0
      },
      closeDialog() {
        this.uploadProgress = 0
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./style.scss";
</style>
<style lang="scss">
  .upload-dialog {
    .el-dialog__body {
      padding: 0 0 50px 0;
    }
  }
</style>
