<template>
     <el-dialog
             title="选择账单"
             :visible.sync="ShowChoiceDialog"
             width="1200px"
             v-loading="loading"
             :append-to-body="true"
             center
             custom-class="digHeight"
             @close="closeDialog"
     >
       <search-panel
           :model="PayMentChoiceData"
           ref="PayMentChoiceData"
           :rules="PayMentChoiceData"
           label-width="100px"
       >
          <template slot="search">
              <el-form-item label="账单编号" class="form-item-sm" prop="keyWord">
                  <el-input placeholder="单据编号"
                            v-model="PayMentChoiceData.keyWord"
                  >
                  </el-input>
              </el-form-item >
                  <el-form-item label="业务类型" class="form-item-sm"  >
                      <el-select v-model="PayMentChoiceData.BusType" disabled placeholder="请选择">
                          <el-option
                                  v-for="item in BusType"
                                  :key="item.Value"
                                  :label="item.Description"
                                  :value="item.Value">
                          </el-option>
                      </el-select>
                  </el-form-item>
              <div class="clearfix">
                  <el-form-item label="项目" class="form-item-sm mt-15" prop="MarkArr">
                      <el-cascader
                              v-model="PayMentChoiceData.MarkArr"
                              :options="billItem.data"
                              :props="billItem.props"
                              expand-trigger="hover"
                              filterable
                      >
                      </el-cascader>
                  </el-form-item>
                  <el-form-item label="付款日期" class="form-item-sm mt-15" prop="PaymentData" label-width="100px">
                      <el-date-picker
                              v-model="PayMentChoiceData.PaymentData"
                              type="daterange"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              value-format="yyyy-MM-dd"
                      >
                      </el-date-picker>
                  </el-form-item>
              </div>
          </template>
          <template slot="button">
               <el-button size="medium" @click="handleSearch" type="primary">查询</el-button>
               <el-button size="medium" @click="handleReset" type="primary">重置</el-button>
           </template>
         </search-panel>
          <div class="panel data-list-table">
              <el-table
                  :data="PaymentBillDataList"
                  ref="multipleTable"
                  v-loading.body="listLoading"
                  element-loading-text="Loading"
                  width="60%"
                  height="300px"
                  class="table-normal mb-15 hasCheckbox"
                  @selection-change="tableChangeData"
                  @select="clearChecked"
                  border fit highlight-current-row
              >
                  <el-table-column
                          align="center"
                          type="selection"
                          fixed="left"
                          width="55">
                  </el-table-column>
                  <el-table-column align="center" label='单据编号' min-width="220">
                      <template slot-scope="scope">
                          {{scope.row.BillNum}}
                      </template>
                  </el-table-column>
                  <el-table-column label="业务类型" min-width="100" align="center">
                      <template slot-scope="scope">
                          <span>{{$EnumData.getEnumDesByValue('FinanceBusType', scope.row.BusinessType)}}</span>
                      </template>
                  </el-table-column>
                <el-table-column label="业务描述" min-width="150" align="center">
                  <template slot-scope="scope">
                        <span>{{scope.row.HouseName || scope.row.ContractID }}</span>
                  </template>
                </el-table-column>
                  <el-table-column label="项目名称" min-width="100" align="center">
                      <template slot-scope="scope">
                          <span>{{scope.row.BillProjectName}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" prop="PayableDate" label="日期" min-width="120">
                      <template slot-scope="scope">
                          <span>{{$dateFormat(scope.row.PayableDate)}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column label="应付款金额" min-width="100" align="center">
                      <template slot-scope="scope">
                          <span>{{$priceFormat(scope.row.PayableMoney)}}</span>
                      </template>
                  </el-table-column>
                  <!--<el-table-column class-name="status-col" label="优惠金额" min-width="120" align="center">-->
                      <!--<template slot-scope="scope">-->
                          <!--<span>{{$priceFormat(scope.row.Discount)}}</span>-->
                      <!--</template>-->
                  <!--</el-table-column>-->
                  <el-table-column class-name="status-col" label="未付金额" min-width="100" align="center">
                      <template slot-scope="scope">
                          <span>{{$priceFormat(scope.row.UnPaidMoney)}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column class-name="status-col" label="本次金额" prop="InPaidMoney" min-width="100" align="center">
                      <template slot-scope="scope">
                          <span>{{$priceFormat(scope.row.UnPaidMoney)}}</span>
                      </template>
                  </el-table-column>
                <el-table-column align="center" prop="CustomerName" label="关系人" min-width="80">
                  <template slot-scope="scope">
                    <span>{{scope.row.CustomerName}}</span>
                  </template>
                </el-table-column>
              </el-table>
            <div class="choiceBillList">
              <p>已选单据</p>
              <ul>
                <li v-for="item in hasSelected">
                  <i
                    :class="['iconfont', 'closeIcon', 'icon-shanjianmoren']"
                    @click="RemoveItem(item)"
                  ></i>{{item.BillNum}}</li>
              </ul>
            </div>
          </div>
         <bottom-tool-bar
                 ref="bottomToolBar"
                 :page-size="pageSize"
                 :handlePageChange="GetTableData"
                 :render-first="false"
         >
         </bottom-tool-bar>

         <div slot="footer">
             <el-button @click="SubmitCancel" type="info">取 消</el-button>
             <el-button type="primary" @click="SubmitRequire">确 认</el-button>
         </div>
     </el-dialog>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import { GetPayAbleList } from '@/api/ownerBill'
    import SearchPanel from '@/components/SearchPanel' // 引入整个样式布局组件
    import BottomToolBar from '@/components/BottomToolBar' // 引入底部布局样式
  export default {
    name: 'choice-bill',
    components: {
      SearchPanel,
      BottomToolBar
    },
    data() {
      return {
        PaymentBillDataList: [],
     //   newBillData: [],
        ShowChoiceDialog: false,
        loading: false,
        listLoading: false,
        pageSize: 10,
        tableSelected: [],
        hasSelected: [],
        choiceArray: {},
        StartTime: '',
        EndTime: '',
        // 表单数据
        PayMentChoiceData: {
          keyWord: '', // 关键字
          BusType: this.$EnumData.getEnumDesByValue('FinanceBusType'), // 业务类型
          MarkArr: [], // 项目
          PaymentData: [], // 付款日期
          BillID: Number, // 每个账单对应对的数据
          CustomerName: '',
          QueryType: 2,
          CustomerPhone: ''
        }
      }
    },
    created() {
      this.refreshBillItem()
    },
    methods: {
      open(parm) {
        this.hasSelected = []
        this.ShowChoiceDialog = true
        this.PayMentChoiceData.BusType = parm.BusType
        this.PayMentChoiceData.CustomerName = parm.CustomerName
        this.PayMentChoiceData.QueryType = parm.QueryType
        this.PayMentChoiceData.CustomerPhone = parm.CustomerPhone
        this.$nextTick(() => {
          this.$refs.bottomToolBar.search()
        })
      },
      // 获取账单项目
      ...mapActions([
        'refreshBillItem'
      ]),
      // 关闭弹窗
      close() {
        this.ShowChoiceDialog = false
      },
      // 查询方法
      GetTableData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.loading = true
        this.listLoading = true
        if (!this.PayMentChoiceData.PaymentData) {
          this.PayMentChoiceData.PaymentData = []
        }
          this.PayMentChoiceData.StartTime = this.PayMentChoiceData.PaymentData[0]
          this.PayMentChoiceData.EndTime = this.PayMentChoiceData.PaymentData[1]
         return GetPayAbleList({
           pageParam: pages,
          condition: this.PayMentChoiceData
        }).then(({ Data, BusCode, Msg }) => {
          console.log(Data)
          if (Data) {
            this.PaymentBillDataList = Data.rows
            this.loading = false
            this.listLoading = false
            this.$nextTick(() => {
              this.PaymentBillDataList.forEach((ele) => {
                for (let i = 0; i <= this.hasSelected.length - 1; i++) {
                  if (ele.KeyID === this.hasSelected[i].KeyID) {
                    this.$refs.multipleTable.toggleRowSelection(ele, true)
                    break
                  }
                }
              })
            })
          } else {
            return
          }
          return Data
        })
      },
      // 点击查询
      handleSearch() {
        this.$refs.bottomToolBar.search()
      },
      // 关闭弹窗
      closeDialog() {
        this.$refs['PayMentChoiceData'].resetFields()
      },
      // 点击重置按钮
      handleReset() {
        this.$refs['PayMentChoiceData'].resetFields()
        this.$refs.bottomToolBar.search()
      },
      // 点击取消按钮
      SubmitCancel() {
        this.$refs['PayMentChoiceData'].resetFields()
        this.close()
      },
      // 点击确认按钮
      SubmitRequire() {
        this.$emit('UpDataTOParent', this.hasSelected)
        this.$refs['PayMentChoiceData'].resetFields()
        this.close() // 关闭窗口
      },
      // 多选时候的数据对象集合
      tableChangeData(selection) {
        console.log(selection)
        this.tableSelected = selection
        this.tableSelected.forEach(v => {
          let isAdd = true
          this.hasSelected.findIndex(k => {
            if (v.KeyID === k.KeyID) {
              isAdd = false
              return
            }
          })
          if (isAdd) {
            this.hasSelected.push(v)
          }
        })
        console.log(this.hasSelected)
      },
      // 删除右侧选择项
      RemoveItem(val) {
        console.log(val)
        const index = this.hasSelected.findIndex(value => {
          return value.KeyID === val.KeyID
        })
        this.hasSelected.splice(index, 1)
        this.$nextTick(() => {
          this.$refs['multipleTable'].clearSelection()
          this.PaymentBillDataList.forEach((ele, index) => {
            for (let i = 0; i <= this.hasSelected.length - 1; i++) {
              if (ele.KeyID === this.hasSelected[i].KeyID) {
                this.$refs['multipleTable'].toggleRowSelection(ele, true)
                break
              }
            }
          })
        })
      },
      // 删除表格勾选项
      clearChecked(rows, row) {
        const index = rows.findIndex(item => {
          return item.KeyID === row.KeyID
        })
        if (index < 0) {
          const ind = this.hasSelected.findIndex(item => {
            return item.KeyID === row.KeyID
          })
          if (ind >= 0) {
            this.hasSelected.splice(ind, 1)
          }
        }
      }
   },
    computed: {
      // 业务类型枚举(7个)
      BusType() {
        return this.$EnumData.getEnumListByKey('FinanceBusType')
      },
      // 项目
        ...mapGetters([
            'billItem'
        ])
    }
  }
</script>

<style lang="scss" scoped>
  .panel {
    display: flex;
    flex-direction: row;
  }
  .digHeight{
    height: 700px;
  }
  .el-dialog--center .el-dialog__body {
    text-align: initial;
    /*padding-top: 25px;*/
    /*padding-right: 25px;*/
    /*padding-bottom: 20px !important;*/
    /*padding-left: 25px;*/
    padding: 25px 25px 20px 25px !important;
  }
  .choiceBillList{
    width: 210px;
    box-sizing: border-box;
    padding: 15px;
    flex: 0 auto;
    flex-wrap: wrap;
    border: 1px solid #dcdcdc;
    height: 300px;
    margin-left: 20px;
  }
  .choiceBillList p{
    color: #4a87f0;
  }
  .choiceBillList ul{
    height: 220px;
    list-style: none;
    padding: 10px 0;
    -webkit-padding-start: 0px;
    overflow-y: scroll;
  }
  .choiceBillList ul li{
    list-style: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }
  .icon-shanjianmoren:hover::before {
    content: "\E681";
  }
  .closeIcon{
    color: red;
    cursor: pointer;
    margin-right: 8px;
    margin-left: 2px;
  }

</style>
