<template>
  <div>
    <el-dialog
      title="导出数据"
      @open="handleOpen"
      @closed="handleClosed"
      :visible.sync="showFormDialog"
      append-to-body
      width="750px"
    >
    <div class="export-title">
        <p>成都弹个房科技有限公司</p>
        <p>数据传输接收确认函</p>
    </div>
  <!-- <div class="export-title-number">编号: <span>20190909-001</span></div> -->
    <p class="export-mark-title">因接收单位/部门/接收人业务需要，需成都弹个房有限公司协助导出以下数据：</p>
    <div>
      <el-table
        :data="dataTable"
        ref="multipleTable"
        v-loading="listLoading"
        element-loading-text="加载中"
        border
        fit
        height="300px"
        class="table-normal"
      >
        <el-table-column align="center" label="小区" min-width="100" prop="CommunityName"></el-table-column>
        <el-table-column align="center" label="数据合计" min-width="100">
          <template slot-scope="scope">
            {{scope.row.Number + '条'}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="export-mark-message">
      因涉及数据安全，数据接收人需书面签署此确认函，由成都弹个房有限公司存档。数据接收人负有保密义务，因此造成的任何数据泄露由数据接收人负相应法律责任，成都弹个房有限公司有权保留对其法律诉讼的权利。
    </div>
    <div class="export-sign-info">
      <ul>
        <li>导出人：<span>{{this.ExportName}}</span></li>
        <li>所属组织：<span>{{this.SysName}}</span></li>
        <li>
            <label class="export-img-label">导出人（签字）：</label>
            <img v-if="this.ExportSignInfo" class="export-sign-img" :src="$ImgUnit.getThumbImgUrl(this.ExportSignInfo)" />
        </li>
        <li>{{this.ExportTime}}</li>
      </ul>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="signLoading"  @click="handleSignInfo">签字确认</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleExportInfo()">提交并导出</el-button>
    </div>
  <!-- 签字弹窗 -->
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
  </el-dialog>
  </div>
</template>

<script>
import {
  QueryContractDataExportNumber, // 查询数据合计条数
  QueryDataExportSignInfo, // 查询签字信息
  QueryContractDataExportList, // 列表数据导出
  InsertDataExportRecord // 提交
} from '@/api/house'
// import { BottomToolBar } from '../../../../../components' // 引入组件
import Qrcode from '@xkeshi/vue-qrcode'
import { phoneURL } from '@/config'
export default {
  name: 'VisitRecordDialog',
  components: {
    Qrcode
  },
  data() {
    return {
      showFormDialog: false,
      showQRCodeDialog: false,
      submitLoading: false,
      signLoading: false,
      submitAuditReady: false,
      Type: '',
      KeyID: 0,
      dataTable: [],
      listLoading: false,
      baseURI: '',
      queryID: 0,
      pageSize: 10,
      interval: null, // 轮训循环器
      SysName: '', // 组织名称
      ExportName: '', // 导出人
      ExportSignInfo: '', // 导出人签字
      ExportTime: '' // 导出时间
    }
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
    console.log('destoryed执行了:')
  },
  methods: {
    // 打开弹窗，开始轮询签字接口
    handleOpen(data) {
      this.submitAuditReady = false
      this.ExportSignInfo = ''
      // this.checkSignInfo(0)
      this.interval = setInterval(() => {
        this.checkSignInfo(1)
      }, 5000)
    },
    checkSignInfo(type) {
      console.log('轮询type:', type)
      QueryDataExportSignInfo({ // 查询签字接口
        KeyID: this.queryID
      }).then(({ Data }) => {
        console.log('Data:', Data)
        if (Data) {
          this.ExportSignInfo = Data
          this.submitAuditReady = true
          this.signLoading = true
          this.showQRCodeDialog = false
          this.handleClosed(type)
        }
      }).catch(() => {
        this.handleClosed()
      })
    },
    handleClosed(type) {
      if (this.interval) {
        if (!type) {
          clearInterval(this.interval)
        }
      }
      this.submitLoading = false
      console.log('handleClosed关闭了:')
    },
    handleSignInfo() {
      this.showQRCodeDialog = true
    },
    handleOpenQRCode() {
      const param = {}
      param.id = this.queryID
      param.to = this.$store.getters.token
      param.bt = 3
      const objToUrl = Object.entries(param).map(item => {
        const [k, v] = item
        return `${k}=${v}`
      }).join('&')
      this.baseURI = phoneURL + 'ordersign?' + objToUrl
      console.log(this.baseURI)
    },
    handleExportInfo() {
      if (!this.submitAuditReady) {
        this.$message.error('请签字确认后再导出！')
        return
      }
      this.submitLoading = true
      InsertDataExportRecord({
        KeyID: this.queryID
      }).then(res => {
        console.log('提交res:', res)
        if (!res.Code) {
          // 导出数据
          QueryContractDataExportList({
            CommunityID: this.KeyID,
            IsAll: false
          }).then(response => {
            console.log('response', response)
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['租客合同号', '小区', '门牌号', '业主姓名', '业主身份证号', '业主电话', '租客姓名', '租客身份证号', '租客电话']
              const filament = ['TenantContractNumber', 'CommunityName', 'HouseNumber', 'OwnerName', 'OwnerIDCard', 'OwnerPhone', 'TenantName', 'TenantCard', 'TenantPhone']
              const data = this.formatJson(filament, !response.Data ? [] : response.Data.rows)
              console.log('data:', data)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '数据导出清单'
              })
              this.submitLoading = false
              this.showFormDialog = false
            })
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    // 格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    open(data) {
      this.showFormDialog = true
      this.signLoading = false
      this.listLoading = true
      this.KeyID = data.CommunityID
      // this.$refs.bottomToolBar.search(2)
      QueryContractDataExportNumber({
        CommunityID: data.CommunityID,
        IsAll: true
      }).then(res => {
        if (!res.Code) {
          const [Year, Month, Day] = this.getYearMonthDay(res.Data.ExportTime)
          this.dataTable = res.Data.ExportCommunityNumber
          this.queryID = res.Data.KeyID
          this.ExportName = res.Data.ExportName
          this.SysName = res.Data.SysName
          this.ExportTime = Year + ' 年 ' + Month + ' 月 ' + Day + ' 日 '
        }
        this.listLoading = false
        console.log('导出数据res:', res)
      })
      console.log('data:', data)
    },
    getYearMonthDay(dateStr) {
      let result = []
      if (!dateStr) {
        return result
      }
      const patt = new RegExp('\\d{4}-\\d{2}(-\\d{2})?')
      const ymdStr = patt.exec(dateStr)
      if (ymdStr[0] === '0001-01-01') {
        return result
      }
      if (ymdStr !== null) {
        const date = new Date(ymdStr[0])
        const StartYear = date.getFullYear()
        const StartMonth = date.getMonth() + 1
        const StartDay = date.getDate()
        result = [StartYear, StartMonth, StartDay]
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss'

</style>