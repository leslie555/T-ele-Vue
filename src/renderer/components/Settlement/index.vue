<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="textArr[0]"
    width="1100px"
    append-to-body
    center
    @close="close"
    class="has-scroll"
  >
    <div class="settlement-box">
      <el-form :inline="true" label-width="110px" style="height: 500px" :model="BookKeepInfo"
               ref="SettlementForm" :rules="rules">
        <el-scrollbar class="vertical-scroll">
          <div class="dialog-box form-item-sm">
            <div class="clearfix" v-if="busType==4">
              <el-form-item label="房源" prop="IsHouse">
                <el-radio-group v-model="BookKeepInfo.IsHouse" :disabled="disabled||editType==1">
                  <el-radio :label="1">房源相关</el-radio>
                  <el-radio :label="0">房源无关</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="clearfix form-item-md" v-if="showHouseInput">
              <el-form-item label="房源名称" prop="HouseName" v-if="!onlyShowHouse">
                <search-house v-model="BookKeepInfo.HouseName"
                              @select="handleHouseSelect" :disabled="disabled"></search-house>
              </el-form-item>
              <el-form-item label="房源名称" prop="HouseName" v-else>
                <el-input v-model="BookKeepInfo.HouseName" disabled></el-input>
              </el-form-item>
            </div>
            <div class="clearfix form-item-require" v-if="showAddProject">
              <el-form-item label="记账类型">
                <el-button size="medium" type="primary" plain @click="addProject" icon="el-icon-plus">
                  添加
                </el-button>
              </el-form-item>
            </div>
            <div class="clearfix form-item-sm" v-for="(item, index) in BookKeepProjectList" :key="index">
              <el-form-item :label="showAddProject||index>0?' ':'记账类型'">
                <el-select
                  v-model="item.InOrOut"
                  placeholder="收支类型"
                  class="form-item-xs"
                  :disabled="disabled"
                >
                  <el-option
                    :label="item.Description"
                    :value="item.Value"
                    v-for="item in InOrOut"
                    :key="item.Value"
                  ></el-option>
                </el-select>
                <el-cascader
                  placeholder="项目"
                  v-model="item.BillProjectIDMark"
                  :options="billItem.data"
                  :props="billItem.props"
                  separator=">"
                  expand-trigger="hover"
                  filterable
                  class="ml-5"
                  :disabled="disabled"
                >
                </el-cascader>
                <el-input
                  placeholder="金额"
                  v-model="item.Amount"
                  type="number"
                  @blur="$positive(item,'Amount',0,false,1000000)"
                  class="ml-5 form-item-xs"
                  style="width: 100px"
                  :disabled="disabled"
                >
                </el-input>
                <el-input
                  placeholder="备注"
                  v-model="item.Remark"
                  class="ml-5 form-item-xs"
                  :disabled="disabled"
                >
                </el-input>
                <el-checkbox v-if="showEntireHouse" v-model="item.IsEntireHouse" :true-label="1" :false-label="0"
                             class="ml-10"
                             :disabled="disabled">记为整套房
                </el-checkbox>
                <i class="iconfont icon-shanjianmoren ml-10" @click="deleteProject(index)"
                   v-show="showAddProject"></i>
              </el-form-item>
            </div>
            <div class="clearfix form-item-sm">
              <el-form-item label="收支日期" prop="ReceivablesDate">
                <el-date-picker
                  v-model="BookKeepInfo.ReceivablesDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请输入收支日期"
                  :disabled="disabled"
                >
                </el-date-picker>
                <el-checkbox v-model="BookKeepInfo.IsBreachContract" class="ml-10" v-if="busType==1"
                             :disabled="disabled">是否违约
                </el-checkbox>
              </el-form-item>
              <el-form-item label="凭证编号">
                <el-input v-model="BookKeepInfo.VoucherID" placeholder="请输入凭证编号"
                          :disabled="disabled"
                          maxlength="30"></el-input>
              </el-form-item>
            </div>
            <div class="clearfix form-item-sm">

            </div>
            <div class="clearfix form-item-sm">
              <upload-file :imgList="BookKeepInfo.ImageUpload" title="图片凭证" :disabled="disabled"></upload-file>
            </div>
            <!--<div class="clearfix form-item-lg">-->
            <!--<el-form-item label="备注">-->
            <!--<el-input-->
            <!--type="textarea"-->
            <!--:autosize="{ minRows: 4, maxRows:7}"-->
            <!--placeholder="请输入备注"-->
            <!--maxlength="400"-->
            <!--v-model="BookKeepInfo.Remark"-->
            <!--:disabled="disabled"-->
            <!--&gt;-->
            <!--</el-input>-->
            <!--</el-form-item>-->
            <!--</div>-->
          </div>
        </el-scrollbar>
      </el-form>
    </div>
    <div slot="footer" v-if="!disabled">
      <el-button type="primary" @click="submitForm" :loading="loading">保 存</el-button>
      <el-button @click="submitCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { getTreeNodeByValue } from '../../utils/arrUtil'
  import uuid from '../../utils/uuid'
  import { ownerCheckOut, ownerEditCheckOut } from '../../api/owner'
  import { tenantCheckOut, tenantEditCheckOut } from '../../api/tenant'
  import { editBookKeep, getBookKeepByID, insertBookKeep } from '../../api/finance'
  import SearchHouse from '../../components/SearchHouse'
  import { UploadFile } from '../../components/UploadFile'

  export default {
    props: {
      busType: { // 0 业主退房 1 租客退房 2 业主记账 3 租客记账 4 记账本
        type: Number,
        default: 0
      },
      apiType: { // 0 不调用接口 1 调用接口
        type: Number,
        default: 1
      }
    },
    components: {
      UploadFile,
      SearchHouse
    },
    computed: {
      ...mapGetters([
        'billItem'
      ]),
      showEntireHouse() {
        const firstFlag = this.BookKeepInfo.IsHouse === 1 && this.BookKeepInfo.RentType === 2
        const secondFlag = this.busType === 4
        return firstFlag && secondFlag
      },
      InOrOut() {
        const InOrOut = this.$EnumData.getEnumListByKey('InOrOut')
        InOrOut.shift()
        return InOrOut
      },
      textArr() {
        switch (this.busType) {
          case 0 :
            if (this.disabled) {
              return ['业主退房结账详情']
            } else {
              return ['业主合同退房', '退房成功']
            }
          case 1 :
            if (this.disabled) {
              return ['租客退房结账详情']
            } else {
              return ['租客合同退房', '退房成功']
            }
          case 2 :
            return ['业主合同记账', '保存成功']
          case 3 :
            return ['租客合同记账', '保存成功']
          case 4 :
            if (this.disabled) {
              return ['记账详情']
            } else {
              return ['记一笔账', '保存成功']
            }
        }
      },
      showHouseInput() {
        return this.BookKeepInfo.IsHouse === 1
      },
      showAddProject() {
        return this.editType === 0 || this.editType === 1 && this.busType < 2 && this.checkOutEdit
      }
    },
    data() {
      return {
        showDialog: false,
        loading: false,
        editType: 0, // 0 新增 1 修改
        checkOutEdit: false, // 退房结账修改标识
        onlyShowHouse: false,
        disabled: false,
        ProjectList: [],
        prevType: 0,
        // 表单数据
        BookKeepInfo: {
          HouseID: '',
          HouseKey: '',
          HouseName: '',
          RentType: 1,
          IsHouse: 1,
          ContractType: '',
          ContractID: '',
          ReceivablesDate: '',
          IsBreachContract: false,
          VoucherID: '',
          Remark: '',
          ImageUpload: []
        },
        defaultBookKeepInfo: {},
        BookKeepProjectList: [],
        defaultProjectData: {
          BillProjectID: '',
          BillProjectIDMark: [],
          BillProjectName: '',
          Amount: '',
          InOrOut: '',
          IsEntireHouse: 0,
          Remark: ''
        },
        rules: {
          ReceivablesDate: [
            { required: true, message: '请选择记账日期', trigger: 'blur' }
          ],
          HouseName: [
            { required: true, message: '请选择房源', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.defaultBookKeepInfo = { ...this.BookKeepInfo } // 拷贝一份来用
    },
    methods: {
      ...mapActions([
        'refreshBillItem'
      ]),
      async open({
                   BookKeepPara = {}, /* HouseKey = '',HouseID = '',HouseName = '',RentType='',ContractID = '',BillProjectID 等 */
                   type = 0, // 新增还是修改
                   detail = false,
                   checkOutEdit = false
                 }) {
        // 后端突然不返IsHouse字段了 自己构建
        if (type === 1 && this.busType === 4) {
          if (BookKeepPara.HouseKey) {
            BookKeepPara.IsHouse = 1
          } else {
            BookKeepPara.IsHouse = 0
          }
        }
        BookKeepPara = { ...BookKeepPara }
        this.loading = false
        this.showDialog = true
        this.editType = type
        this.checkOutEdit = checkOutEdit
        this.refreshBillItem()
        // 存在 this.busType 更新不及时的问题
        await new Promise(resolve => {
          setTimeout(function() {
            resolve()
          }, 10)
        })
        if (detail) {
          if (!this.checkOutEdit) {
            this.disabled = true
          }
          let markType = 0
          switch (this.busType) {
            case 0:
              markType = 0
              break
            case 1:
              markType = 1
              break
            case 4:
              markType = 2
              break
          }
          await getBookKeepByID({
            id: BookKeepPara.KeyID,
            type: markType
          }).then(({ Data }) => {
            this.BookKeepInfo = { ...this.defaultBookKeepInfo, ...Data.bookKeepPara }
            if (markType === 0 || markType === 1) {
              this.BookKeepInfo.IsHouse = 1
            }
            Data.bookKeep.map(v => {
              const billItem = getTreeNodeByValue(this.billItem.data, v.BillProjectID, this.billItem.props)
              v.BillProjectIDMark = billItem.pathArr
            })
            this.BookKeepProjectList = Data.bookKeep
          }).catch(() => {
            this.BookKeepInfo = { ...this.defaultBookKeepInfo }
            this.BookKeepProjectList = []
          })
        } else {
          // 绑定相关数据
          if (BookKeepPara.ImageUpload && BookKeepPara.ImageUpload.length > 0) {
            BookKeepPara.ImageUpload = this.$deepCopy(BookKeepPara.ImageUpload)
          } else {
            BookKeepPara.ImageUpload = []
          }
          this.BookKeepInfo = { ...this.defaultBookKeepInfo, ...BookKeepPara }
          this.BookKeepProjectList = []
          if (this.editType === 1) {
            const billItem = getTreeNodeByValue(this.billItem.data, BookKeepPara.BillProjectID, this.billItem.props)
            this.BookKeepProjectList.push({
              BillProjectID: BookKeepPara.BillProjectID,
              BillProjectIDMark: billItem.pathArr,
              BillProjectName: BookKeepPara.BillProjectName,
              Amount: BookKeepPara.Amount,
              InOrOut: BookKeepPara.InOrOut,
              Remark: BookKeepPara.Remark,
              IsEntireHouse: BookKeepPara.IsEntireHouse || 0
            })
          }
        }
        // 不是合同中的才能修改
        if (this.BookKeepInfo.HouseName && this.busType !== 4 || this.busType === 4 && this.editType === 1 && this.BookKeepInfo.ContractID > 0) {
          this.onlyShowHouse = true
        }
        // 是否违约反绑
        if (this.BookKeepInfo.IsBreachContract === 1) {
          this.BookKeepInfo.IsBreachContract = true
        }
        this.$nextTick(() => {
          this.$refs.SettlementForm.clearValidate()
        })
      },
      close() {
        this.showDialog = false
        this.onlyShowHouse = false
      },
      addProject() {
        this.BookKeepProjectList.push(Object.assign({}, this.defaultProjectData))
      },
      // 删除金额的某一项
      deleteProject(index) {
        this.BookKeepProjectList.splice(index, 1)
      },
      buildData() {
        // 组装数据
        if (this.busType === 0 || this.busType === 2) {
          this.BookKeepInfo.ContractType = 0
        } else if (this.busType === 1 || this.busType === 3) {
          this.BookKeepInfo.ContractType = 1
        }
        this.BookKeepProjectList.map(v => {
          const billItem = getTreeNodeByValue(this.billItem.data, v.BillProjectIDMark[1], this.billItem.props)
          v.BillProjectID = billItem.data.KeyID
          v.BillProjectName = billItem.data.Name
          debugger
          switch (this.busType) {
            case 0:
              v.IsEntireHouse = 1
              break
            case 1:
              v.IsEntireHouse = 0
              break
            case 2:
              v.IsEntireHouse = 1
              break
            case 3:
              if (this.editType === 0) {
                v.IsEntireHouse = this.BookKeepInfo.RentType === 1 ? 1 : 0
              }
              break
            case 4:
              if (this.BookKeepInfo.IsHouse === 0) {
                v.IsEntireHouse = 0
              } else if (this.BookKeepInfo.RentType === 1) {
                v.IsEntireHouse = 1
              }
              break
          }
        })
      },
      getOnlyBookKeepList() {
        let ImageUpload = []
        if (this.BookKeepInfo.ImageUpload && this.BookKeepInfo.ImageUpload.length > 0) {
          ImageUpload = this.$deepCopy(this.BookKeepInfo.ImageUpload)
        }
        return this.BookKeepProjectList.map(v => {
          if (this.BookKeepProjectList.length > 1) {
            v.uuid = uuid()
          }
          return { ...this.BookKeepInfo, ...v, ImageUpload }
        })
      },
      validateProject() {
        return new Promise((resolve, reject) => {
          const flag = this.BookKeepProjectList.some(v => {
            if (v.BillProjectIDMark.length === 0 || v.InOrOut === '' || v.Amount === '') {
              return true
            }
          })
          if (flag || this.BookKeepProjectList.length === 0) {
            reject()
          } else {
            resolve()
          }
        })
      },
      // 租客合同模拟调接口的方法
      submitForm() {
        Promise.all([
          this.$refs['SettlementForm'].validate(),
          this.validateProject()
        ]).then(() => {
          this.buildData()
          // 是否调用接口
          if (this.apiType === 0) {
            this.updateTableFun()
          } else {
            let fn = null
            let param = {
              bookKeepPara: this.BookKeepInfo,
              bookKeep: this.BookKeepProjectList
            }
            let flag = true
            if (this.busType === 0) {
              if (this.editType === 0) {
                fn = ownerCheckOut
              } else {
                fn = ownerEditCheckOut
              }
            } else if (this.busType === 1) {
              if (this.editType === 0) {
                fn = tenantCheckOut
              } else {
                fn = tenantEditCheckOut
              }
              param.bookKeepPara.IsBreachContract = param.bookKeepPara.IsBreachContract ? 1 : 0
            } else if (this.editType === 0) {
              fn = insertBookKeep
            } else {
              fn = editBookKeep
              param = {
                bookKeep: this.getOnlyBookKeepList()[0]
              }
              flag = false
            }
            this.loading = true
            return fn(param).then(({ Data, BusCode, Msg }) => {
              if (flag) {
                this.updateTableFun(Data)
              } else {
                this.updateTableFun([Data])
              }
              this.$message.success(this.textArr[1])
            }).catch(res => {
              this.loading = false
            })
          }
        }).catch(() => {
          this.$message.error('请完善表单必填项!')
        })
      },
      // 完成结算之后把当前表单的数据传递给父组件
      updateTableFun(data) {
        this.close()
        this.$emit('success', {
          BookKeepList: data || this.getOnlyBookKeepList(),
          type: this.editType
        })
      },
      // 取消按钮
      submitCancel() {
        this.close()
      },
      handleHouseSelect(item) {
        this.BookKeepInfo.HouseID = item.KeyID
        this.BookKeepInfo.HouseName = item.HouseName
        this.BookKeepInfo.HouseKey = item.HouseKey
        this.BookKeepInfo.RentType = item.RentType
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
