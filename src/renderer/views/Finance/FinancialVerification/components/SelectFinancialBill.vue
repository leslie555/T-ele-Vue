<template>
  <el-dialog
    :title="this.ChoiceBillTitle"
    ref="ChoiceType"
    width="1280px"
    append-to-body
    :close-on-click-modal="false"
    :center="true"
    :style="{'z-index':'2015'}"
    :show-close="false"
    @open="handleOpen"
    :visible.sync="dialogFormVisible"
  >
    <el-form ref="form" :model="searchForm" inline>
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item label="日期" :label-width="formLabelWidth">
            <el-date-picker
              v-model="searchForm.TimeList"
              type="daterange"
              range-separator="至"
              :default-time="['00:00:00', '23:59:59']"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="单据编号" :label-width="formLabelWidth" maxlength="64">
            <el-input v-model="searchForm.BillNum"></el-input>
          </el-form-item>
          <!-- <el-form-item label="业务类型"   :label-width="formLabelWidth">
                        <el-select v-model="SearchReceiptForm.BusType" placeholder="请选择" @change="ChoiceSearchBusType" :style="{width:'150px'}">
                            <el-option v-for="busType in $store.getters.enumList.EnumFinanceBusType"  :label="busType.Description" :value="busType.Value"></el-option>
                        </el-select>
          </el-form-item>-->
          <el-form-item :style="{'float': 'right'}">
            <el-button type="primary" @click="SearchReceipt">查询</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-table
            ref="ChoiceFinancialTableForm"
            :data="ChoiceBillData"
            tooltip-effect="dark"
            style="width:60%;"
            height="400px"
            border
            stripe
            @selection-change="changeFun"
            @select="clearChecked"
          >
            <el-table-column align="center" type="selection" width="80"></el-table-column>
            <el-table-column align="center" label="单据编号" prop="BillNum"></el-table-column>
            <el-table-column align="center" label="业务类型" prop="BusinessType">
              <template slot-scope="scope">
                <div>{{$EnumData.getEnumDesByValue('FinanceBusType', scope.row.BusinessType) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="业务描述" min-width="120" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.HouseName || scope.row.ContractID }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="日期" prop="CreaterTime">
              <template slot-scope="scope">
                <div>{{$dateFormat(scope.row.CreaterTime)}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="单据金额" prop="PaidMoney"></el-table-column>
            <el-table-column align="center" label="已核销金额" prop="WriteOffAmount"></el-table-column>
            <el-table-column align="center" label="未核销金额" prop="UnwrittenAmount"></el-table-column>
            <el-table-column align="center" label="备注" min-width="150" prop="Remark"></el-table-column>
          </el-table>
          <div class="choiceBillList">
            <p>已选单据</p>
            <ul>
              <li v-for="item in selectedListAll" :key="item.KeyID">
                <i
                  :class="['iconfont', 'closeIcon', 'icon-shanjianmoren']"
                  @click="RemoveItem(item)"
                ></i>
                {{item.BillNum}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-form>
    <bottom-tool-bar ref="bottomToolBar" :page-size="PageSize" :handlePageChange="choiceFun"></bottom-tool-bar>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="Close">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import BottomToolBar from '@/components/BottomToolBar'
  import { GetReceivableList, GetPayableList, GetPaymentList, GetReceiptList } from '@/api/finance'
  export default {
    name: 'SelectFinacialBill',
    components: {
      BottomToolBar
    },
    props: {
      SearchReceiptForm: null,
      SearchVerificationType: null,
      VerificationType: null,
      selectedDoc: null
    },
    data() {
      return {
        formLabelWidth: '80px',
        dialogFormVisible: false,
        isFirstOpen: true,
        PageSize: 10,
        searchForm: {},
        ChoiceBillData: null,
        ChoiceBillTitle: null,
        selectedList: {},
        selectedListAll: [],
        clearCheckedOrder: null,
        lastPage: '1' // 上一页
      }
    },
    computed: {
      // 业务类型
      BusType() {
        return this.$EnumData.getEnumListByKey('FinanceBusType')
      }
      /*   selectedListAll() {
          const list = Object.values(this.selectedList)
          return this.flatten(list)
        } */
    },
    watch: {
      selectedList: {
        handler(newVal) {
          const list = Object.values(this.selectedList)
          this.selectedListAll = this.flatten(list)
        },
        deep: true
      }
    },
    methods: {
      flatten(arr) {
        return arr.reduce((prev, next) => {
          return prev.concat(Array.isArray(next) ? this.flatten(next) : next)
        }, [])
      },
      open() {
        this.dialogFormVisible = true
      },
      handleOpen() {
        this.searchForm = { ...this.SearchReceiptForm, TimeList: [], BillNum: '' }
        this.searchForm.BusType = this.searchForm.BusinessType
        this.lastPage = ''
        this.$set(this.selectedList, '1', this.selectedDoc)
        if (!this.isFirstOpen) {
          this.$nextTick(() => {
            this.$refs.bottomToolBar.search()
          })
        }
        this.isFirstOpen = false
      },
      Close() {
        this.searchForm.StartTime = ''
        this.searchForm.EndTime = ''
        this.searchForm.KeyWord = ''
        if (this.SearchReceiptForm.TimeList === null) {
          this.SearchReceiptForm.TimeList = []
        }
        this.SearchReceiptForm.BillNum = ''
        this.ChoiceBillData = []
        this.dialogFormVisible = false
        this.$emit('close')
      },
      onSubmit() {
        this.$emit('selectedDocument', this.selectedListAll)
        this.dialogFormVisible = false
      },
      // 获取选中的行
      changeFun(val) {
        const curPage = this.$refs.bottomToolBar.currentPage + ''
        if (this.lastPage !== curPage && this.selectedListAll.length) {
          this.lastPage = curPage
          return
        }
        this.$set(this.selectedList, curPage, val)
        this.lastPage = curPage
      },
      // 取消勾选
      clearChecked(rows, row) {
        const curPage = this.$refs.bottomToolBar.currentPage + ''
        const index = rows.findIndex(item => {
          return item.KeyID === row.KeyID
        })
        if (index < 0) {
          const ind = this.selectedList[curPage].findIndex(item => {
            return item.KeyID === row.KeyID
          })
          if (ind >= 0) {
            this.selectedList[curPage].splice(ind, 1)
          }
        }
      },
      // 移除勾选
      RemoveItem(val) {
        const curPage = this.$refs.bottomToolBar.currentPage + ''
        const index = this.selectedList[curPage].findIndex(value => {
          return value.KeyID === val.KeyID
        })
        this.selectedList[curPage].splice(index, 1)
        this.$refs['ChoiceFinancialTableForm'].toggleRowSelection(val, false)
      },
      choiceFun(pages) {
        if (!pages) {
          pages = {
            size: this.PageSize,
            page: 1
          }
        }
        if (this.VerificationType === 1) {
          if (this.SearchVerificationType === 0) {
            this.ChoiceBillTitle = '选择应收单据'
            return GetReceivableList({
              pageParam: pages,
              condition: this.searchForm
            }).then(response => {
              this.ChoiceBillData = response.Data.rows
              this.ChoiceBillData.forEach(item => {
                item.CreaterTime = item.ReceivableDate
                item.PaidMoney = item.ReceivableMoney
              })
              this.getDefaultChecked()
              this.listLoading = false
              return response.Data
            })
          } else if (this.SearchVerificationType === 1) {
            this.ChoiceBillTitle = '选择收款单'
            return GetReceiptList({
              pageParam: pages,
              condition: this.searchForm
            }).then(response => {
              console.log(response)
              this.ChoiceBillData = response.Data.rows
              this.ChoiceBillData.forEach(item => {
                item['PaidMoney'] = item.ReceiptMoney
                item.CreaterTime = item.ReceiptData
                item.Advance = item.UnwrittenAmount
              })
              this.listLoading = false
              this.getDefaultChecked()
              return response.Data
            })
          }
        } else if (this.VerificationType === 2) {
          if (this.SearchVerificationType === 0) {
            this.ChoiceBillTitle = '选择应付单据'
            return GetPayableList({
              pageParam: pages,
              condition: this.searchForm
            }).then(response => {
              console.log(response)
              this.ChoiceBillData = response.Data.rows
              this.ChoiceBillData.forEach(item => {
                item.CreaterTime = item.PayableDate
                item.PaidMoney = item.PayableMoney
              })
              this.listLoading = false
              this.getDefaultChecked()
              return response.Data
            })
          } else if (this.SearchVerificationType === 1) {
            this.ChoiceBillTitle = '选择付款单'
            return GetPaymentList({
              pageParam: pages,
              condition: this.searchForm
            }).then(response => {
              console.log(response)
              this.ChoiceBillData = response.Data.rows
              this.ChoiceBillData.forEach(item => {
                // 因（付款，和收款单）字段无法和应收和应付统一 用自定义字段代替
                item['PaidMoney'] = item.PaymentMoney
                // 因时间无法统一 用创建时间暂存代替
                item.CreaterTime = item.PaymentData
                // 因组件无法用自定义字段统计 所以暂用 预付款字段代替使用
                item.Advance = item.UnwrittenAmount
              })
              this.listLoading = false
              this.getDefaultChecked()
              return response.Data
            })
          }
        }
      },
      getDefaultChecked() {
        const curPage = this.$refs.bottomToolBar.currentPage + ''
        if (!this.selectedList[curPage]) return
        this.$nextTick(() => {
          const curPage = this.$refs.bottomToolBar.currentPage + ''
          const listIDs = this.selectedList[curPage].map(v => v.KeyID)
          this.ChoiceBillData.forEach((ele, index) => {
            if (listIDs.includes(ele.KeyID)) {
              this.$refs['ChoiceFinancialTableForm'].toggleRowSelection(ele, true)
            }
          })
        })
      },
      // 搜索应付或应收单据
      SearchReceipt() {
        // this.ChoiceBillData = null
        if (this.searchForm.TimeList === null) {
          this.searchForm.TimeList = []
        }
        this.searchForm.StartTime = this.$dateFormat(this.searchForm.TimeList[0], 'yyyy-MM-dd 00:00:00')
        this.searchForm.EndTime = this.$dateFormat(this.searchForm.TimeList[1], 'yyyy-MM-dd 00:00:00')
        this.searchForm['KeyWord'] = this.searchForm.BillNum
        this.$refs.bottomToolBar.search()
      }
    }
  }
</script>

<style scoped>
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: start;
  }
  .choiceBillList {
    width: 240px;
    box-sizing: border-box;
    padding: 15px;
    flex: 0 auto;
    flex-wrap: wrap;
    border: 1px solid #dcdcdc;
    height: 400px;
    min-width: 210px;
    margin-left: 20px;
  }
  .choiceBillList p {
    color: #4a87f0;
  }
  .choiceBillList ul {
    height: 350px;
    list-style: none;
    padding: 10px 0;
    -webkit-padding-start: 0px;
    overflow-y: scroll;
  }
  .choiceBillList ul li {
    list-style: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }
  .icon-shanjianmoren:hover::before {
    content: "\E681";
  }
  .closeIcon {
    color: red;
    cursor: pointer;
    margin-right: 8px;
    margin-left: 2px;
  }
</style>
