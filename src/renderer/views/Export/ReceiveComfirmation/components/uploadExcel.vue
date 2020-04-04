<template>
  <div>
    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
    />
    <!-- <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover"> -->
    <!-- Drop excel file here or -->
    <el-button
      :loading="loading"
      style="margin-left:16px;"
      size="mini"
      type="primary"
      @click="handleUpload"
      plain
    >
      上传excel模板
    </el-button>
    <!-- <span v-show="uploadProgress !== 100">只能上传excel文件模板</span>
    <el-progress
      :text-inside="true"
      :stroke-width="16"
      :percentage="uploadProgress"
      v-show="uploadProgress > 0 &&  uploadProgress < 100"
    ></el-progress> -->
    <slot v-bind:file="rawFile"></slot>
  </div>
  <!-- </div> -->
</template>

<script>
  import { baseURL } from '@/config'
  import axios from 'axios'
  import store from '@/store/index'
  import { UploadDataExportTemplate } from '@/api/export'
  import XLSX from 'xlsx'

  export default {
    name: 'UploadExcel',
    props: {
      onSuccess: Function,
      KeyID: Number
    },
    data() {
      return {
        loading: false,
        maxLength: 1,
        rawFile: {}
        // uploadProgress: 0
      }
    },
    // computed: {
    //   buttonText() {
    //     return this.uploadProgress > 0 ? '上传中，请勿关闭' : '确定'
    //   }
    // },
    methods: {
      handleUpload() {
        this.$refs['excel-upload-input'].click()
      },
      handleClick(e) {
        const files = e.target.files
        const rawFile = files[0]
        if (!rawFile) return
        this.upload(rawFile)
      },
      upload(rawFile) {
        this.$refs['excel-upload-input'].value = null
        this.beforeUpload(rawFile)
      },
      beforeUpload(rawFile) {
        if (!this.isExcel(rawFile)) {
          this.$message.error('只支持上传excel模板')
          return false
        }
        this.renderHeadData(rawFile)
      },
      submitExcel(ExcelHeader, rawFile) {
        const formData = new FormData()
        formData.append('file', rawFile)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios({
          url:
            baseURL + `/SystemMethod/FileUpLoad?&Token=${store.getters.token}`,
          method: 'post',
          data: formData,
          config
          // onUploadProgress: progressEvent => {
          //   console.log(progressEvent)
          //   if (progressEvent.lengthComputable) {
          //     this.uploadProgress = Math.ceil(
          //       (progressEvent.loaded * 100) / progressEvent.total
          //     )
          //   }
          // }
        })
          .then(({ data }) => {
            const { Code, Data, Msg } = data
            if (Code === 0) {
              this.uploadUrl(Data, ExcelHeader, rawFile)
            } else {
              throw new Error(Msg)
            }
          })
          .catch(({ message }) => {
            this.$message.error(message)
          })
      },
      isExcel(file) {
        return /\.(xlsx|xls|csv)$/.test(file.name)
      },
      renderHeadData(rawFile) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = e => {
            const data = e.target.result
            const workbook = XLSX.read(data, { type: 'array' })
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            const ExcelHeader = this.getHeaderRow(worksheet)
            resolve({ ExcelHeader, rawFile })
          }
          reader.readAsArrayBuffer(rawFile)
        }).then(({ ExcelHeader, rawFile }) => {
          if (this.isChinese(ExcelHeader.join(''))) {
            this.submitExcel(ExcelHeader, rawFile)
          } else {
            this.$message.error('上传的模板表头格式不正确, 请参考示例')
            return
          }
        })
      },
      getHeaderRow(sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r
        /* 读取第一行表头 */
        for (C = range.s.c; C <= range.e.c; ++C) {
          const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
          let hdr = 'UNKNOWN ' + C
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
        return headers
      },
      uploadUrl(Data, ExcelHeader, rawFile) {
        return UploadDataExportTemplate({
          KeyID: this.KeyID,
          Url: Data,
          DataExportFields: ExcelHeader
        })
          .then(() => {
            this.$message.success('上传成功')
            this.rawFile = rawFile
            this.$emit('uploadTemp', Data)
          })
          .catch(err => {
            this.$message.error(err)
          })
      },
      isChinese(str) {
        // eslint-disable-next-line no-control-regex
        var re = /^[\u4e00-\u9fa5\W0-9_]+$/g
        if (re.test(str)) return true
        return false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
</style>
