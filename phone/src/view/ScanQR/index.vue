<template>
  <div
    class="qr-sign"
    v-loading="loading"
    element-loading-text="签名上传中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <!--     <button type="" @click="clear">清除</button>
    <button @click="save">保存</button>-->
    <div class="sign-canvas">
      <canvas id="canvas">Canvas画板</canvas>
      <div class="sign-canvas-tip tip1">
        <span v-show="!hasBegined">请</span>
      </div>
      <div class="sign-canvas-tip">
        <span v-show="!hasBegined">签</span>
      </div>
      <div class="sign-canvas-tip tip3">
        <span v-show="!hasBegined">字</span>
      </div>
      <canvas id="canvas_mark" style="display: none">Canvas画板</canvas>
      <div class="sign-canvas-clear" @click="clear"></div>
    </div>
    <p class="sign-notice">此处为合同签字面板,需本人签字.</p>
    <p class="sign-notice">在签字之前请仔细阅读合同条款.</p>
    <el-button type="primary" class="sign-button" @click="save" :disabled="!hasBegined">确认</el-button>
  </div>
</template>

<script>
  import axios from 'axios'
  import request from '../../utils/request'
  import { baseURL } from '../../config'
  import Draw from './draw'

  export default {
    data() {
      return {
        draw: null,
        loading: false,
        disabled: false,
        query: this.$route.query,
        formData: {}
      }
    },
    computed: {
      hasBegined() {
        return this.draw && this.draw.hasBegined
      }
    },
    mounted() {
      this.draw = new Draw('canvas')
      this.draw.init()
    },
    methods: {
      clear: function() {
        this.draw.clear()
        this.draw.hasBegined = false
      },
      save: function() {
        this.loading = true
        const ImgStr = this.draw.save()
        this.formData = new FormData()
        this.formData.append('file', this.b64toBlob(ImgStr))
        this.formData.append('code', this.query.code || '')
        this.loading = true
        axios({
          url: baseURL + '/SystemMethod/imageUp?Token=' + this.query.to,
          method: 'post',
          data: this.formData,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        }).then(({ data }) => {
          if (data.Data && data.Data.length > 0) {
            this.getSignUrl(data.Data[0].ImageLocation)
          }
        }).catch(({ message }) => {
          this.loading = false
          this.$alert('上传签字失败，请重新提交')
        })
      },
      b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        var byteCharacters = atob(b64Data.substring(b64Data.indexOf(',') + 1))
        var byteArrays = []
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize)
          var byteNumbers = new Array(slice.length)
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
          }
          var byteArray = new Uint8Array(byteNumbers)
          byteArrays.push(byteArray)
        }
        var blob = new Blob(byteArrays, { type: contentType })
        return blob
      },
      getSignUrl(SignUrl) {
        this.draw.getNewImg().then((ImgStr) => {
          request({
            url: '/FDD/FDD/ExtsignAndSeal?Token=' + this.query.to,
            method: 'post',
            data: {
              ContractId: this.query.c,
              CustomerId: this.query.cu,
              TemplateType: +this.query.ty + 1,
              Mobile: this.query.m,
              Name: decodeURIComponent(this.query.n),
              ImgStr,
              SignUrl
            }
          }).then(({ Data }) => {
            this.loading = false
            location.href = decodeURIComponent(Data)
            // console.log(decodeURIComponent(Data))
            this.loading = false
          }).catch(({ message }) => {
            this.loading = false
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
