<template>
  <div
    class="qr-sign"
    v-loading="loading"
    :element-loading-text="loadingText"
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
      <div class="sign-canvas-tip tip2">
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
    <el-button
      type="primary"
      class="sign-button"
      @click="save"
      :disabled="!hasBegined || disableBtn"
    >确认</el-button>
  </div>
</template>

<script>
  /* eslint-disable no-undef */

  import axios from 'axios'
  import request from '../../utils/request'
  import { baseURL } from '../../config'
  import Draw from './draw'

  export default {
    data() {
      return {
        draw: null,
        loading: false,
        loadingText: '签名上传中',
        disabled: false,
        query: this.$route.query,
        disableBtn: false,
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
      clear() {
        this.draw.clear()
        this.draw.hasBegined = false
      },
      save() {
        try {
          const ImgStr = this.draw.save()
          this.formData = new FormData()
          this.formData.append('file', this.b64toBlob(ImgStr))
          this.formData.append('code', this.query.code || '')
        } catch (e) {
          this.$alert('当前手机系统版本暂不支持签字，请分享到其他手机或者非微信浏览器中打开签字！')
          return
        }
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
            this.loading = false
            const busType = (this.query.bt || 0) - 0
            let url = '/OperateMethod/UpdateOrderSignInfo'
            let param = {}
            switch (busType) {
              case 0 :
                url = '/OperateMethod/UpdateOrderSignInfo'
                param = {
                  KeyID: +this.query.id,
                  type: +this.query.ty, // 0修改租房人, 1修改收款人
                  signInfo: data.Data[0].ImageLocation
                }
                break
              case 1:
                url = '/TenantAfterSale/UpdateTenCheckOutSignInfo'
                param = {
                  KeyID: +this.query.id,
                  type: +this.query.ty, // 0租客, 1业务员
                  signInfo: data.Data[0].ImageLocation
                }
                break
              case 2:
                url = '/TenantAfterSale/SignSubletAgreement'
                param = {
                  TenContractID: +this.query.id,
                  Url: data.Data[0].ImageLocation
                }
                break
              case 3:
                url = '/OperateMethod/InsertDataExportImage'
                param = {
                  KeyID: +this.query.id,
                  Url: data.Data[0].ImageLocation
                }
                break
              case 4:
                url = '/Tool/Tool/SignDataExportApplication'
                param = {
                  ExportID: +this.query.id,
                  Url: data.Data[0].ImageLocation
                }
                break
              case 5:
                url = '/OwnerContract/OwnerContract/AgreeRentFreeSign'
                param = {
                  KeyID: +this.query.id,
                  Url: data.Data[0].ImageLocation
                }
                break
              case 6:
                url = '/OwnerContract/OwnerContract/ConsentTerminateContractSign'
                param = {
                  KeyID: +this.query.id,
                  Url: data.Data[0].ImageLocation
                }
                break
            }
            request({
              url: url + '?Token=' + this.query.to,
              method: 'post',
              data: param
            }).then(res => {
              this.disableBtn = true
              this.$alert('上传成功').then(() => {
                if (window.ReactNativeWebView) {
                  // react-native方式
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    keyID: +this.query.id,
                    imgUrl: data.Data[0].ImageLocation
                  }))
                } else if (WeixinJSBridge) {
                  WeixinJSBridge.call('closeWindow')
                }
              })
            })
          } else {
            this.loading = false
            this.$alert('上传签字失败，请重新提交')
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
