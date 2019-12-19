<template>
<div>
<div>
  <el-dialog
    title="转租协议"
    @open="handleOpen"
    @closed="handleClosed"
    :visible.sync="showFormDialog"
    append-to-body
    width="480px"
  >
    <el-form
      :model="EditForm"
      :rules="rules"
      :inline="true"
      ref="ruleForm"
      label-position="right"
      label-width="100px"
      style="height: 350px; overflow: auto;"
      v-loading="formLoading"
      >
      <div class="clearfix">
        <el-form-item label="转租价格" prop="AgreePrice">
          <el-input style="width: 250px;" type="number" v-model="EditForm.AgreePrice" :maxlength="8"></el-input>
        </el-form-item>
      </div>
      <div class="clearfix">
        <el-form-item label="转租日期" prop="AgreeExpireDate">
          <el-date-picker
              v-model="EditForm.AgreeExpireDate"
              type="date"
              placeholder="请选择"
              style="width: 250px;"
            >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="clearfix" style="margin: 0 0 10px">
        <h3 style="color: #999999">银行账户信息</h3>
      </div>
      <div class="clearfix">
        <p style="margin: 30px">姓名: <span>{{ TenName }}</span></p>
      </div>
      <div class="clearfix">
        <el-form-item label="开户行" prop="OpenBankName">
          <el-input style="width: 250px;" v-model="EditForm.OpenBankName"></el-input>
        </el-form-item>
      </div>
      <div class="clearfix">
        <el-form-item label="卡号" prop="BankAccount">
          <el-input style="width: 250px;" v-model="EditForm.BankAccount"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close(1)">取消</el-button>
      <el-button type="primary" @click="handleSave" :loading="showSaveLoading">保存</el-button>
    </div>
  </el-dialog>
</div>
<div>
  <el-dialog
    title="转租协议"
    @open="handleOpen(1)"
    @closed="handleClosed(1)"
    :visible.sync="showSignDialog"
    class="order-template-dialog"
    append-to-body
    width="960px"
    v-loading="printOpenLoading"
  >
  <div class="PrintBox"  :id="uuid">
    <iframe id="sublease-bill" :src="SubleaseUrl" frameborder="0" width="100%" height="400px"></iframe>
  </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleEdit" v-if="isCheckOpen === 1">修改</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading" v-if="isCheckOpen === 1">提交</el-button>
      <el-button type="primary" @click="handleSign" v-if="isCheckOpen === 1">签字</el-button>
      <el-button type="primary" @click="handleDownload" :loading="downloadLoading">打印</el-button>
      <el-button type="primary" @click="handleDownload" :loading="downloadLoading">下载PDF</el-button>
      <el-button @click="close(2)">取消</el-button>
    </div>
    <el-dialog
      title="签字"
      :visible.sync="showQRCodeDialog"
      width="400px"
      append-to-body
      class="order-sign-dialog"
      @open="handleOpenQRCode"
      center
    >
      <div class="sign-box">
        <div class="scan-box">
          <qrcode :value="baseURI" :options="{ size: 200 }"></qrcode>
        </div>
        <div class="sign-text">请扫描二维码签字</div>
        <!-- <div class="sign-notice">
          <p>注：</p>
          <p>请扫描二维码预览合同并进行线上签约认证。</p>
        </div>-->
      </div>
      <div slot="footer">
        <el-button type="primary" @click="showQRCodeDialog=false">返回</el-button>
      </div>
    </el-dialog>
    <a :href="downloadUrl" target="_blank" style="display: none;" download :id="downloadID"></a>
  </el-dialog>
</div>
</div>
</template>

<script>
/* eslint-disable no-undef */
import uuid from '@/utils/uuid'
import Qrcode from '@xkeshi/vue-qrcode'
import { HtmlToPDF } from '@/api/system'
import { phoneURL, gwUrl, baseURL } from '@/config'
import {
  QuerySubletAgreement,
  InsertSubletAgreement,
  SubmitSubletApproval,
  EditSubletAgreement,
  SearchAfterSaleSign
} from '@/api/tenant'

export default {
  name: 'SubleaseTemplate',
  components: {
    Qrcode
  },
  data() {
    return {
      uuid: 'printSubleaseBody_' + uuid(),
      baseURI: '',
      showQRCodeDialog: false,
      interval: null, // 轮训循环器
      downloadUrl: '',
      downloadLoading: false,
      submitAuditReady: false,
      showFormDialog: false,
      showSignDialog: false,
      showSaveLoading: false,
      formLoading: false,
      printLoading: false,
      printOpenLoading: false,
      submitLoading: false,
      SubleaseUrl: '',
      subleaseContent: {},
      EditForm: {
        AgreePrice: '',
        AgreeExpireDate: '',
        OpenBankName: '',
        BankAccount: ''
      },
      useToken: this.$store.state.user.token,
      // 表单验证
      rules: {
        AgreePrice: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        AgreeExpireDate: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        OpenBankName: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        BankAccount: [
          { required: true, message: '请填写', trigger: 'blur' }
        ]
      },
      cloneData: {},
      IsSave: '',
      TenContractID: '',
      TenName: '',
      cloneRow: {},
      isCheckOpen: 1,
      count: 0,
      downloadID: ''
    }
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    handleOpen(type = 0) {
      if (type === 0) {
        this.formLoading = true
        QuerySubletAgreement({ TenContractID: this.TenContractID }).then(({ Data }) => {
          if (Data) {
            this.IsSave = Data.IsSave
            this.EditForm.AgreePrice = Data.AgreePrice || null
            this.EditForm.AgreeExpireDate = this.$dateFormat(Data.AgreeExpireDate)
            if (Data.IsSave === 1) {
              this.TenName = Data.TenName
            }
            this.EditForm.OpenBankName = Data.OpenBankName
            this.EditForm.BankAccount = Data.BankAccount
            this.cloneData = Data
          }
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      } else {
        this.downloadID = 'downloadSublease_' + uuid()
        this.checkSignInfo(0)
        this.interval = setInterval(() => {
          this.checkSignInfo(1)
        }, 5000)
      }
    },
    handleClosed(type = 0) {
      if (this.interval && type === 1) {
        clearInterval(this.interval)
      }
    },
    close(index) {
      if (index === 1) {
        this.showFormDialog = false
        this.EditForm.AgreeExpireDate = ''
        this.EditForm.AgreePrice = ''
        this.EditForm.OpenBankName = ''
        this.EditForm.BankAccount = ''
        this.$refs['ruleForm'].clearValidate()
      } else {
        this.showSignDialog = false
      }
    },
    checkSignInfo(type) {
      SearchAfterSaleSign({
        TenContractID: this.TenContractID
      }).then(({ Data }) => {
        if (type === 0) {
          if (Data.TenSignInfo) {
            this.count++
          }
        } else {
          let count = 0
          if (Data.TenSignInfo) {
            count++
          }
          if (count !== this.count) {
            // 刷新 iframe
            this.showQRCodeDialog = false
            const doc = document.getElementById(`sublease-bill`)
            doc.setAttribute('src', doc.getAttribute('src'))
            this.count = count
          }
        }
        if (Data.TenSignInfo) {
          this.submitAuditReady = true
          this.handleClosed(1)
        }
      }).catch(() => {
        this.handleClosed(1)
      })
    },
    handleOpenQRCode() {
      const param = {}
      param.id = this.TenContractID
      param.to = this.$store.getters.token
      param.ti = new Date().getTime()
      param.bt = 2
      const objToUrl = Object.entries(param).map(item => {
        const [k, v] = item
        return `${k}=${v}`
      }).join('&')
      this.baseURI = phoneURL + 'ordersign?' + objToUrl
    },
    handlePrint() {
      this.printLoading = true
      printJS({
        printable: this.uuid, // 要打印区域的元素ID
        type: 'html',
        // 继承原来的所有样式
        targetStyles: ['*'],
        onLoadingStart: () => {
          console.log(3)
        },
        onLoadingEnd: () => {
          console.log(4)
        },
        onPrintDialogClose: () => {
          console.log(5)
          this.printLoading = false
        }
      })
    },
    handleSave() {
      this.showSaveLoading = true
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const fn = this.IsSave === 0 ? InsertSubletAgreement : EditSubletAgreement
          this.IsSave = 1
          fn({
            IsSave: this.IsSave,
            TenContractID: this.TenContractID,
            HouseID: this.cloneData.HouseID,
            HouseName: this.cloneData.HouseName,
            AgreePrice: this.EditForm.AgreePrice,
            AgreeExpireDate: this.EditForm.AgreeExpireDate,
            SalesmanSignInfo: this.cloneData.SalesmanSignInfo,
            TenSignInfo: this.cloneData.TenSignInfo,
            TenName: this.TenName,
            BankAccount: this.EditForm.BankAccount,
            OpenBankName: this.EditForm.OpenBankName
          }).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.showFormDialog = false
            this.showSignDialog = true
            this.showSaveLoading = false
            this.isCheckOpen = 1
            this.SubleaseUrl = `${gwUrl}/SubletAgreement?TenContractID=${this.TenContractID}&&to=${this.useToken}`
          }).catch(() => {
            this.showSaveLoading = false
          })
        } else {
          this.showSaveLoading = false
        }
      })
    },
    open(row, type) {
      // type 0:保存 1:修改 2查看
      this.cloneRow = row
      this.TenContractID = row && row.KeyID
      this.TenName = row && row.TenantName
      if (type === 2) {
        this.SubleaseUrl = `${gwUrl}/SubletAgreement?TenContractID=${this.TenContractID}&&to=${this.useToken}`
        this.isCheckOpen = 0
        this.showSignDialog = true
      } else {
        this.showFormDialog = true
      }
    },
    handleEdit() {
      this.showFormDialog = true
      this.showSignDialog = false
    },
    handleSign() {
      // 签字
      this.showQRCodeDialog = true
    },
    handleDownload() {
      // 下载
      // 打印暂时用下载方式
      this.downloadLoading = true
      HtmlToPDF({
        Url: encodeURIComponent(this.SubleaseUrl)
      }).then(({ Data }) => {
        this.downloadLoading = false
        this.downloadUrl = baseURL + Data
        this.$nextTick(() => {
          document.getElementById(this.downloadID).click()
        })
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    handleSubmit() {
      this.submitLoading = true
      if (!this.submitAuditReady) {
        this.$message.error('请签完字后再提交审核！')
        this.submitLoading = false
        return
      }
      SubmitSubletApproval({ TenContractID: this.TenContractID }).then((res) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.cloneRow.RentLeaseStatus = 6
        this.cloneRow.AuditStatus = 1
        this.$emit('submitSublease', this.cloneRow)
        this.submitLoading = false
        this.close(2)
      }).catch(() => {
        this.submitLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../../styles/variables";
  @import "../../../../../styles/mixin";
  .PrintBox {
    height: 420px;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    overflow: auto;
  }
  .order-sign-dialog {
    .sign-box {
      @include displayFlex(column, center, flex-start);
      width: 100%;
      .scan-box {
        padding: 5px;
        background: #f9f9f9;
        border: 1px solid #eee;
        border-radius: 5px;
      }
      .img-box {
        @include displayFlex(row, center, center);
        width: 500px;
        height: 220px;
        background: #f9f9f9;
        border: 1px solid #eee;
        border-radius: 5px;
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
      .sign-text {
        margin-top: 15px;
        font-size: 16px;
        color: $--color-text-primary;
      }
      .sign-notice {
        @include displayFlex(row, flex-start, center);
        margin-top: 30px;
        font-size: 14px;
        color: $--color-text-secondary;
        width: 430px;
        line-height: 20px;
        p:first-child {
          margin-right: 5px;
        }
      }
    }
  }
</style>
