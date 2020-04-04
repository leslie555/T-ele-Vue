<template>
  <div class="app-container">
    <div class="panel">
      <div class="header">成都弹个房科技有限公司数据传输接收确认函</div>
      <p class="header-desscription">
        因接收单位/部门/接收人业务需要，需成都弹个房有限公司协助导出以下数据：
      </p>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="80px"
        :inline="true"
        :rules="rules"
        v-loading.body="bodyLoading"
      >
        <el-form-item label="选择小区">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="ruleForm.CommunityName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入小区名称搜索"
            :maxlength="40"
            @select="handleCommunitySelect"
          >
            <i class="el-icon-search el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.CommunityName }}</div>
              <span class="addr">{{ item.Location }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <!-- <el-form-item label="时间段" prop="timePeriod">
          <el-date-picker
            v-model="ruleForm.timePeriod"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item> -->
        <el-form-item label="时间段" prop="timePeriod">
          <DatePickerRange
            v-model="ruleForm.timePeriod"
            :day="1"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @changeStartTime="changeTime(0,...arguments)"
            @changeEndTime="changeTime(1,...arguments)"
          ></DatePickerRange
        ></el-form-item>
        <SelectOrganization v-model="ruleForm.FullIDNew" :type="3" />
        <!-- <div class="clearfix">
        <p class="form-tip">温馨提示：如果小区、时间段没有选择，则会默认全部</p>
      </div> -->
        <div class="clearfix">
          <el-form-item label="数据模板" prop="TemplateType">
            <el-select
              v-model="ruleForm.TemplateType"
              placeholder="请选择活动区域"
            >
              <el-option label="系统模板" :value="0"></el-option>
              <el-option label="自定义模板" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item prop="TemplateType" v-if="ruleForm.TemplateType === 0">
            <div class="system-template">
              <div class="radios-header">报表模块</div>
              <el-radio-group v-model="ruleForm.ExportModuleName" width="500px">
                <el-radio
                  class="radio-content"
                  v-for="(item, index) in reportData"
                  :key="index"
                  :label="item.TableName"
                  :value="item.SerialNumber"
                  @change="handleRadioChange(item.SerialNumber)"
                  >{{ item.TableName }}
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="item.FieldHeader.join(', ')"
                  >
                    <i class="el-icon-question" slot="reference"></i>
                  </el-popover>
                </el-radio>
              </el-radio-group>
              <div class="radios-header">客服中心模块</div>
              <el-radio-group v-model="ruleForm.ExportModuleName" width="500px">
                <el-radio
                  class="radio-content"
                  v-for="(item, index) in cusData"
                  :key="index"
                  :label="item.TableName"
                  :value="item.SerialNumber"
                  @change="handleRadioChange(item.SerialNumber)"
                  >{{ item.TableName }}
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="item.FieldHeader.join(', ')"
                  >
                    <i class="el-icon-question" slot="reference"></i>
                  </el-popover>
                </el-radio>
              </el-radio-group>
              <div class="radios-header">监察部</div>
              <el-radio-group v-model="ruleForm.ExportModuleName" width="450px">
                <el-radio
                  class="radio-content"
                  v-for="(item, index) in supervisoryData"
                  :key="index"
                  :label="item.TableName"
                  :value="item.SerialNumber"
                  @change="handleRadioChange(item.SerialNumber)"
                  >{{ item.TableName }}
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="item.FieldHeader.join(', ')"
                  >
                    <i class="el-icon-question" slot="reference"></i>
                  </el-popover>
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item v-else label="">
            <div style="margin-left: 65px;">
              <upload-excel :KeyID="ExportID" @uploadTemp="getCusTemplateUrl">
                <template slot-scope="scope">
                  <i
                    class="iconfont icon-Excel"
                    style="color: green; font-size: 20px; margin-left: 20px;"
                    v-if="scope.file.name || cusTemplateUrl"
                  ></i
                  >{{ scope.file.name || cusTemplateUrl }}
                </template>
              </upload-excel>
              <excel-header />
            </div>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="申请理由" prop="Reason">
            <el-input
              type="textarea"
              placeholder="请输入申请理由"
              v-model="ruleForm.Reason"
              :rows="2"
            >
            </el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <p class="content-tip">
            因涉及数据安全，数据接收人需书面签署此确认函，由成都弹个房有限公司存档。数据接收人负有保密义务，并保证其用途的真实性并不得用作其他途径，造成的任何数据泄露由数据接收人承担全部法律责任，情节严重者直接移交公安机关调查处理。
          </p>
        </div>
        <div class="clearfix footer-agree">
          <el-form-item
            prop="isAgree"
            label=" "
            label-width="0"
            class="clearfix"
          >
            <el-checkbox-group v-model="ruleForm.isAgree">
              <el-checkbox name="isAgree" label="1">已同意 </el-checkbox>
            </el-checkbox-group>
            <span @click="open" class="form-agreement"
              >《成都弹个房科技有限公司涉密数据管理办法》</span
            >
          </el-form-item>
        </div>
        <div class="clearfix">
          <div class="sign-info">
            <div class="sign-info-detail">
              <p>
                申请人: <span>{{ ruleForm.CreaterName }}</span>
              </p>
              <p>
                所属门店: <span>{{ ruleForm.Organization }}</span>
              </p>
              <p class="sign-info-img">
                申请人(签字):
                <img
                  v-if="this.SignInfoImg"
                  class="export-sign-img"
                  :src="$ImgUnit.getThumbImgUrl(this.SignInfoImg)"
                  width="112"
                  height="77"
                />
              </p>
            </div>
            <p class="sign-info-detail sign-info-date clearfix">
              <span> {{ ruleForm.CreaterTime[0] }} 年 </span>
              {{ ruleForm.CreaterTime[1] }} 月
              <span> {{ ruleForm.CreaterTime[2] }} 日 </span>
            </p>
          </div>
        </div>
      </el-form>
      <el-dialog
        title="签字"
        :visible.sync="showQRCodeDialog"
        width="400px"
        append-to-body
        class="order-sign-dialog"
        @open="handleOpenQRCode"
        @close="handleCloseQRCode"
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
        </div> -->
        </div>
        <div slot="footer">
          <el-button type="primary" @click="showQRCodeDialog = false"
            >返回</el-button
          >
        </div>
      </el-dialog>
      <manage-data-dialog ref="ManageDataDialog"></manage-data-dialog>
      <div class="clearfix footer-button">
        <el-button type="primary" @click="showQRCodeDialog = true"
          >签字确认</el-button
        >
        <el-button
          type="primary"
          @click="commitApply"
          :loading="showCommitLoading"
          >提交申请</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
  import {
    SearchPanel,
    SelectOrganization,
    DatePickerRange
  } from '@/components'
  import Qrcode from '@xkeshi/vue-qrcode'
  import {
    QueryDataExportheader,
    QueryDataExportEditDetail,
    AddDataExportApplyID,
    QueryDataExportApplySignInfo,
    EditDataExportApply
  } from '@/api/export'
  import { searchCommunityList } from '@/api/owner'
  import { ExcelHeader, ManageDataDialog, UploadExcel } from './components'
  import { phoneURL } from '@/config'
  import { getTreeNodeByValue } from '@/utils/arrUtil/treeArr'
  import { mapActions } from 'vuex'
  export default {
    name: 'ReceiveComfirmation',
    components: {
      SearchPanel,
      SelectOrganization,
      ManageDataDialog,
      Qrcode,
      UploadExcel,
      ExcelHeader,
      DatePickerRange
    },
    data() {
      return {
        ruleForm: {
          timePeriod: [], // 时间段
          FullIDNew: '', // 组织ID
          ExportOrgan: '', // 导出组织
          TemplateType: 0, // 数据模板类型(0:系统模板 1:自定义模板)
          ExportModule: '', // 数据导出模块ID
          ExportModuleName: '', // 数据导出模块名称
          Reason: '', // 申请理由
          isAgree: [], // 是否同意
          CommunityName: '', // 小区名字
          CommunityID: null, // 小区ID
          CreaterName: null, // 申请人
          Organization: null, // 门店名字
          CreaterTime: [] // 申请时间
        },
        oldCommunitySearchKey: '', // 小区上次搜索参数
        oldCommunityList: [], // 小区上次搜索结果
        allData: [], // 所有的表头数据
        reportData: [], // 报表模块
        cusData: [], // 客服中心模块
        supervisoryData: [], // 监察部模块
        SignInfoImg: '', // 签字图片
        editType: 0, // 0:新增 1: 修改
        ExportID: null, // 查询导出签字信息id
        showQRCodeDialog: false, // 打开二维码弹框
        baseURI: '', // 二维码
        normalList: [], // 上传excel文件
        submitAuditReady: false, // 签完字才能提交
        interval: null, // 轮询查询是否签字
        // signLoading: false, // 签字按钮loading
        showCommitLoading: false, // 提交申请按钮loading
        bodyLoading: false, // 进入页面加载loading
        cusTemplateUrl: '', // 自定义模板地址
        rules: {
          TemplateType: [
            { required: true, message: '请选择模板类型', trigger: 'blur' }
          ],
          Reason: [
            { required: true, message: '请填写申请理由', trigger: 'blur' }
          ],
          timePeriod: [{ required: false, message: '请填写时间段', trigger: 'blur' }],
          isAgree: [
            {
              required: true,
              type: 'array',
              message: '请同意',
              trigger: 'change'
            }
          ]
        }
      }
    },
    computed: {
      treeData() {
        return this.$store.state.organizationTree.treeData[3] || []
      }
    },
    created() {
      this.bodyLoading = true
      Promise.all([this.fetchExportHeader(), this.fetchApplyData()])
        .then(data => {
          this.bodyLoading = false
        })
        .catch(err => {
          this.bodyLoading = false
          throw new Error(err)
        })
    },
    methods: {
      // 小区查询
      ...mapActions(['delView', 'delCachedView']),
      querySearchAsync(queryString, cb) {
        if (this.oldCommunitySearchKey === queryString) {
          cb(this.oldCommunityList)
          return
        }
        this.oldCommunitySearchKey = queryString
        if (queryString) {
          searchCommunityList({
            CommunityName: queryString,
            parm: { page: 1, size: 20 }
          }).then(({ Data }) => {
            this.oldCommunityList = Data.rows || []
            cb(Data.rows || [])
          })
        } else {
          this.oldCommunityList = []
          cb([])
        }
      },
      // 选择小区
      handleCommunitySelect(item, type = 0) {
        this.ruleForm.CommunityName = item.CommunityName
        this.ruleForm.CommunityID = item.KeyID
        // this.$refs.ruleForm.clearValidate()
      },
      // 获取表头数据
      fetchExportHeader() {
        return QueryDataExportheader().then(({ Data }) => {
          const reportData = []
          const cusData = []
          const supervisoryData = []
          this.allData = Data
          Data.forEach(v => {
            const type = v.Type
            if (type === 1) {
              reportData.push(v)
            } else if (type === 2) {
              cusData.push(v)
            } else {
              supervisoryData.push(v)
            }
          })
          this.reportData = reportData
          this.cusData = cusData
          this.supervisoryData = supervisoryData
        })
      },
      // 数据导出列表管理办法
      open() {
        this.$refs['ManageDataDialog'].open()
      },
      // 获取申请的数据
      fetchApplyData() {
        this.editType = Number(this.$route.query.type)
        const id = Number(this.$route.query.KeyID)
        this.ExportID = id
        if (this.editType === 2) {
          AddDataExportApplyID().then(({ Data }) => {
            if (Data) {
              this.generateDetailData(Data, this.editType)
            }
          })
        } else {
          QueryDataExportEditDetail({ ExportID: this.ExportID }).then(
            ({ Data }) => {
              if (Data) {
                this.generateDetailData(Data, this.editType)
                this.submitAuditReady = true
              }
            }
          )
        }
      },
      generateDetailData(Data, type) {
        // type 0: 新增 1:修改
        if (type === 2) {
          this.ExportID = Data.KeyID
          this.ruleForm.CreaterName = Data.CreaterName
          this.ruleForm.Organization = Data.Organization
          this.ruleForm.CreaterTime = this.$dateFormat(Data.CreaterTime).split(
            '-'
          )
        } else {
          this.ruleForm.timePeriod.push(this.$dateFormat(Data.StartTime))
          this.ruleForm.timePeriod.push(this.$dateFormat(Data.EndTime))
          this.ruleForm.FullIDNew = Data.FullIDNew || ''
          this.ruleForm.ExportOrgan = Data.ExportOrgan || ''
          this.ruleForm.CommunityID = Data.CommunityID || ''
          this.ruleForm.CommunityName = Data.CommunityName || ''
          this.ruleForm.TemplateType = Data.TemplateType || 0
          this.ruleForm.ExportModule = Data.ExportModule || ''
          this.ruleForm.ExportModuleName = Data.ExportModuleName || ''
          this.ruleForm.Reason = Data.Reason || ''
          this.ruleForm.CreaterName = Data.CreaterName
          this.ruleForm.Organization = Data.Organization
          this.SignInfoImg = Data.ApplicantSignInfo
          this.ruleForm.CreaterTime = this.$dateFormat(Data.CreaterTime).split(
            '-'
          )
          if (Data.TemplateType === 1) {
            this.cusTemplateUrl = Data.UploadTemplateUrl && this.getExcelName(Data.UploadTemplateUrl)
          }
          this.ruleForm.isAgree = ['1']
        }
      },
      getExcelName(url) {
        const arr = url.split('/')
        return arr[arr.length - 1]
      },
      beforeCommit(ruleForm) {
        if (ruleForm.TemplateType === 0 && !ruleForm.ExportModuleName) {
          this.$message.error('请选择一个系统模板')
          return
        }
        if (!this.cusTemplateUrl && ruleForm.TemplateType === 1) {
          this.$message.error('请上传一个自定义的excel模板')
          return
        }
        if (ruleForm.isAgree[0] !== '1') {
          this.$message.error('请同意成都弹个房科技有限公司涉密数据管理办法')
          return
        }
        if (!this.submitAuditReady) {
          this.$message.error('请签字确认后再提交申请！')
          return
        }
        return true
      },
      createParams(ruleForm) {
        let StartTime, EndTime
        if (Array.isArray(ruleForm.timePeriod)) {
          [StartTime, EndTime] = ruleForm.timePeriod
        } else {
          StartTime = ''
          EndTime = ''
        }
        let ExportModule = ''
        debugger
        if (ruleForm.TemplateType === 0) {
          const item = this.allData.find(
            v => v.TableName === ruleForm.ExportModuleName
          )
          ExportModule = item && item.SerialNumber
        }
        ruleForm.ExportOrgan = this.getExportOrgan(ruleForm.FullIDNew)
        const dataExport = {
          ...ruleForm,
          StartTime,
          EndTime,
          ExportModule,
          KeyID: this.ExportID
        }
        const Type = this.editType // 接口Edit  Type: 1修改 2新增提交
        return {
          dataExport,
          Type
        }
      },
      // 提交申请
      commitApply() {
        const before = this.beforeCommit(this.ruleForm)
        if (before) {
          this.showCommitLoading = true
          this.$refs['ruleForm'].validate(valid => {
            if (valid) {
              const params = this.createParams(this.ruleForm)
              EditDataExportApply(params)
                .then(() => {
                  this.$message({
                    type: 'success',
                    message: '操作成功'
                  })
                  this.showCommitLoading = false
                  this.delView(this.$route)
                  this.$router.push({
                    path: '/Export/ExportApplyList'
                  })
                })
                .catch(() => {
                  this.showCommitLoading = false
                })
            } else {
              this.showCommitLoading = false
            }
          })
        }
      },
      // 通过FullIDNew获取路径name
      getExportOrgan(FullIDNew) {
        const str =
          FullIDNew[FullIDNew.length - 1] === '-'
            ? FullIDNew.slice(0, FullIDNew.length - 1)
            : FullIDNew
        const value = parseInt(str.split('-').pop())
        if (value) {
          const pathName = getTreeNodeByValue(this.treeData, value, {
            label: 'SysName',
            value: 'KeyID'
          }).pathNameArr
          return pathName
        } else {
          return []
        }
      },
      // 生成二维码
      handleOpenQRCode() {
        this.interval = setInterval(() => {
          this.checkSignInfo()
        }, 5000)
        const param = {}
        param.id = this.ExportID
        param.to = this.$store.getters.token
        param.ti = new Date().getTime()
        param.bt = 4
        const objToUrl = Object.entries(param)
          .map(item => {
            const [k, v] = item
            return `${k}=${v}`
          })
          .join('&')
        this.baseURI = phoneURL + 'ordersign?' + objToUrl
        console.log(this.baseURI)
      },
      handleCloseQRCode() {
        if (this.interval) {
          clearInterval(this.interval)
        }
      },
      // 查询是否签字
      checkSignInfo(type = 0) {
        QueryDataExportApplySignInfo({
          ExportID: this.ExportID
        })
          .then(({ Data }) => {
            if (Data) {
              if (Data.SignInfoImg !== this.SignInfoImg) {
                this.submitAuditReady = true
                this.SignInfoImg = Data
                this.showQRCodeDialog = false
              }
            }
          })
          .catch(() => {})
      },
      // 获取自定义模板地址
      getCusTemplateUrl(Data) {
        if (Data) {
          this.cusTemplateUrl = Data
        }
      },
      handleRadioChange(value, idx) {
        if (value === 20 || value === 21) {
          this.rules.timePeriod = [{ required: true, message: '请填写时间段', trigger: 'blur' }]
          if (this.ruleForm.timePeriod.length < 2) {
            const time1 = new Date()
            const time2 = new Date()
            time1.setMonth(time1.getMonth() - 1)
            this.ruleForm.timePeriod = [this.$dateFormat(time1), this.$dateFormat(time2)]
          } else {
           this.changeTime(2)
          }
        } else {
          this.rules.timePeriod = [{ required: false, message: '请填写时间段', trigger: 'blur' }]
        }
      },
      changeTime(type, time) {
        if (!this.rules.timePeriod[0].required) return
        let time1 = null
        let time2 = null
        if (type === 0) {
          time1 = new Date(time)
          if (this.ruleForm.timePeriod[1]) {
            time2 = new Date(this.ruleForm.timePeriod[1])
          } else {
            time2 = new Date(time)
            time2.setMonth(time2.getMonth() + 1)
          }
        } else if (type === 1) {
          time2 = new Date(time)
          if (this.ruleForm.timePeriod[0]) {
            time1 = new Date(this.ruleForm.timePeriod[0])
          } else {
            time1 = new Date(time)
            time1.setMonth(time1.getMonth() - 1)
          }
        } else {
          time1 = new Date(this.ruleForm.timePeriod[0])
          time2 = new Date(this.ruleForm.timePeriod[1])
        }
        time1.setMonth(time1.getMonth() + 1)
        if ((time2.getTime() - time1.getTime()) >= 0) {
          time1.setMonth(time1.getMonth() - 1)
          this.$nextTick(() => {
            if (type === 0) {
              this.ruleForm.timePeriod = [this.$dateFormat(time1), this.$dateFormat(time1.setMonth(time1.getMonth() + 1))]
            } else if (type === 1) {
              this.ruleForm.timePeriod = [this.$dateFormat(time2.setMonth(time2.getMonth() - 1)), this.$dateFormat(time2.setMonth(time2.getMonth() + 1))]
            } else {
              this.ruleForm.timePeriod = [this.$dateFormat(time1), this.$dateFormat(time1.setMonth(time1.getMonth() + 1))]
            }
          })
        }
      }
    },
    destroyed() {
      if (this.interval) {
        clearInterval(this.interval)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'style';
</style>
