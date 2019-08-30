<template>
  <div class="bill-panel">
    <el-table :data="tableList"
              ref="table"
              :span-method="arraySpanMethod"
              border
              fit
              class="table-normal noSplit">
      <el-table-column align="center" label='账单期数' min-width="180">
        <template slot-scope="scope">
          <p>
            <el-checkbox v-model="selectArr" :label="data[scope.row.pIndex].uuid" class="mr-10" :disabled="disabled">
              &nbsp;
            </el-checkbox>
            <span>账期{{nzhcn.encodeS(scope.row.pIndex+1)}}
              <!--：{{$dateFormat(data[scope.row.pIndex].BillStartDate)}}至--></span>
            <!--<span style="display:inline-block;width: 130px;text-align: left"-->
            <!--v-if="scope.row.pIndex==data.length-1||scope.row.pIndex==data.length-2&&type==1">{{$dateFormat(data[scope.row.pIndex].BillEndDate)}}</span>-->
            <!--<el-date-picker v-else v-model="data[scope.row.pIndex].BillEndDate"-->
            <!--placeholder="结束日期" size="mini"-->
            <!--@change="reCalcDate"-->
            <!--:disabled="disabled"-->
            <!--style="width: 130px"></el-date-picker>-->
          </p>
          <p class="bill-item-total">合计 ：{{$priceFormat(data[scope.row.pIndex].BillAmount)}} <i
            class="iconfont icon-tianjiamoren" @click="addBillItem(scope.row)" v-if="!disabled"></i></p>
        </template>
      </el-table-column>
      <el-table-column align="center" label='账单项目' min-width="240">
        <template slot-scope="scope">
          <span v-if="!scope.row.CanOperate">{{scope.row.BillProjectName}}</span>
          <template v-else>
            <i class="iconfont icon-shanjianmoren" @click="deleteBillItem(scope.row)"
               :class="scope.row.isFirst?'same-hidden':''" v-if="!disabled"></i>
            <el-cascader
              placeholder="项目"
              v-model="tableList[scope.$index].BillProjectIDMark"
              :options="billItem.data"
              :props="billItem.props"
              separator=">"
              expand-trigger="hover"
              @change="billProjectChange(tableList[scope.$index])"
              :disabled="disabled"
              filterable>
            </el-cascader>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label='账单金额（元）' min-width="140">
        <template slot-scope="scope">
          <el-input v-model="tableList[scope.$index].markAmount" style="width: 110px"
                    @blur="amountChange(tableList[scope.$index])"
                    type="number"
                    :disabled="disabled"
                    placeholder="金额"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label='收支类型' min-width="140">
        <template slot-scope="scope">
          <span v-if="!scope.row.CanOperate">{{$EnumData.getEnumDesByValue('InOrOut', scope.row.InOrOut)}}</span>
          <el-select v-else v-model="tableList[scope.$index].InOrOut" placeholder="请选择收支类型"
                     @change="reCalcAmount"
                     :disabled="disabled"
                     style="width: 110px;">
            <el-option
              :label="item.Description"
              :value="item.Value"
              v-for="item in InOrOut"
              :key="item.Value"
            ></el-option>
          </el-select>
          <el-button v-if="scope.row.CanOperate&&scope.row.pIndex==0" @click="useToOther(scope.row)" type="primary"
                     size="mini">批量应用
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label='应付款日' min-width="160">
        <template slot-scope="scope">
          <el-date-picker
            v-model="data[scope.row.pIndex].ReceivablesDate"
            type="date"
            placeholder="选择日期"
            @focus="saveReceiveDateChange(scope.row.pIndex)"
            @change="receiveDateChange(scope.row.pIndex)"
            :disabled="disabled"
            style="width: 150px;"
          ></el-date-picker>
        </template>
      </el-table-column>
      <div slot="append" class="bill-footer">
        <div class="foot-left">
          <el-button
            type="danger"
            icon="delete"
            size="mini"
            v-if="!disabled"
            :disabled="selectArr.length===0"
            @click="deleteBill">
            <span>删除已选</span>
          </el-button>
          <el-button
            type="primary"
            icon="add"
            size="mini"
            v-if="!disabled"
            @click="addBill">
            <span>添加账期</span>
          </el-button>
        </div>
        <div class="foot-right">
          账单总金额：{{$priceFormat(total)}}元
        </div>
      </div>
    </el-table>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import uuid from '../../../../../utils/uuid'
  import { getTreeNodeByValue } from '../../../../../utils/arrUtil'
  import nzhcn from 'nzh/cn'

  export default {
    name: 'index',
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      type: {
        type: Number, // 0业主 默认支出 1租客 默认收入
        default: 0
      },
      contract: {
        type: Object, // 合同信息
        default() {
          return {}
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters([
        'billItem'
      ]),
      InOrOut() {
        const InOrOut = this.$EnumData.getEnumListByKey('InOrOut').slice()
        InOrOut.shift()
        return InOrOut
      }
    },
    data() {
      return {
        nzhcn,
        tableList: [],
        selectArr: [],
        total: 0,
        childrenKey: 'OwnerBillDetail',
        dateMark: ''
      }
    },
    created() {
      if (this.type === 1) {
        this.childrenKey = 'TenantBillDetail'
      }
    },
    methods: {
      ...mapActions([
        'refreshBillItem'
      ]),
      initData(data) {
        this.refreshBillItem().then(() => {
          this.data.length = 0
          this.data.push(...data)
          this.data.map((item, index) => {
            item.uuid = uuid()
            item[this.childrenKey].map((cItem, cIndex) => {
              cItem.markAmount = this.$priceFormat(cItem.Amount)
              cItem.isAmountEdit = false
              cItem.BillProjectIDMark = getTreeNodeByValue(this.billItem.data, cItem.BillProjectID, this.billItem.props).pathArr
              cItem.uuid = uuid()
              cItem.isFirst = cIndex === 0
              if (!cItem.CanOperate) {
                cItem.CanOperate = false
              }
            })
          })
          this.resetData()
        })
      },
      resetData() {
        this.tableList = []
        this.data.map((item, index) => {
          item[this.childrenKey].map((cItem, cIndex) => {
            cItem.pIndex = index
            // cItem.mIndex = cIndex
            this.tableList.push(cItem)
          })
        })
        this.reCalcAmount()
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 4) {
          if (row.isFirst) {
            return [this.data[row.pIndex][this.childrenKey].length, 1]
          } else {
            return [0, 0]
          }
        }
      },
      addBillItem(row, isFirst = false) {
        const list = this.data[row.pIndex][this.childrenKey]
        const obj = {
          OwnerBillID: '',
          BillProjectID: '',
          BillProjectIDMark: [],
          BillProjectName: '',
          InOrOut: 1,
          isAmountEdit: false,
          markAmount: 0,
          Amount: 0,
          uuid: uuid(),
          CanOperate: true,
          isFirst
        }
        // 业主默认支出 租客默认收入
        if (this.type === 0) {
          obj.InOrOut = 2
        }
        list.push(obj)
        this.resetData()
      },
      deleteBillItem(row) {
        const list = this.data[row.pIndex][this.childrenKey]
        const index = list.findIndex(v => v.uuid === row.uuid)
        list.splice(index, 1)
        this.resetData()
      },
      addBill() {
        const startDate = this.contract.HostTimeMark[1]
        // if (this.data.length > 0) {
        //   startData = this.data[this.data.length - 1].BillEndDate || 0
        // }
        // startData = new Date(startData)
        // startData.setDate(startData.getDate() + 1)
        const obj = {
          BillAmount: 0,
          BillStartDate: startDate,
          BillEndDate: '',
          ReceivablesDate: '',
          uuid: uuid()
        }
        obj[this.childrenKey] = []
        if (this.type === 1) {
          debugger
          const last = this.data[this.data.length - 1]
          last[this.childrenKey].map(v => {
            v.pIndex = this.data.length
          })
          this.data.pop()
          this.data.push(obj)
          this.data.push(last)
          this.addBillItem({
            pIndex: this.data.length - 2
          }, true)
        } else {
          this.data.push(obj)
          this.addBillItem({
            pIndex: this.data.length - 1
          }, true)
        }
        this.reCalcDate()
      },
      deleteBill() {
        const cloneData = this.data.slice()
        this.$spliceArr(cloneData, v => {
          return this.selectArr.findIndex(item => item === v.uuid) !== -1
        })
        this.selectArr = []
        if (cloneData.length < this.data.length) {
          this.data.length = 0
          this.data.push(...cloneData)
          this.resetData()
        }
        this.reCalcDate()
      },
      reCalcAmount() {
        // 业主 收入为负 租客 支出为负
        this.total = 0
        this.data.map((item, index) => {
          item.BillAmount = 0
          item[this.childrenKey].map((cItem, cIndex) => {
            if (this.type === 0 && cItem.InOrOut === 1 || this.type === 1 && cItem.InOrOut === 2) {
              item.BillAmount -= +cItem.Amount
            } else {
              item.BillAmount += +cItem.Amount
            }
          })
          this.total += +item.BillAmount
        })
      },
      reCalcDate() {
        const end = this.contract.HostTimeMark[1]
        this.data.map((item, index) => {
          const max = new Date(end)
          if (index > 0) {
            const prev = this.data[index - 1]
            const current = new Date(prev.BillEndDate || 0)
            if (current.getTime() < max.getTime()) {
              current.setDate(current.getDate() + 1)
            }
            item.BillStartDate = this.$dateFormat(current)
          }
          // 判断时间不能大于租约时间
          if (new Date(item.BillEndDate || 0).getTime() > max.getTime()) {
            item.BillEndDate = max
          }
          if (new Date(item.BillStartDate || 0).getTime() > new Date(item.BillEndDate || 0).getTime()) {
            item.BillEndDate = item.BillStartDate
          }
        })
      },
      validate() {
        // 验证是否填写完整
        return new Promise((resolve, reject) => {
          for (let i = 0; i < this.data.length; i++) {
            const item = this.data[i]
            if (!item.BillEndDate || !item.ReceivablesDate) {
              return reject()
            }
            for (let j = 0; j < item[this.childrenKey].length; j++) {
              const cItem = item[this.childrenKey][j]
              if (cItem.BillProjectID === '' || !cItem.InOrOut || cItem.Amount === '') {
                return reject()
              }
            }
          }
          return resolve()
        })
      },
      billProjectChange(item) {
        const billItem = getTreeNodeByValue(this.billItem.data, item.BillProjectIDMark[1], this.billItem.props)
        item.BillProjectID = billItem.data.KeyID
        item.BillProjectName = billItem.data.Name
      },
      getValue() {
        const arr = []
        this.data.map((item, index) => {
          arr.push({ ...item })
          item[this.childrenKey].map((cItem, cIndex) => {
            const obj = { ...cItem }
            if (obj.isAmountEdit) {
              obj.Amount = obj.markAmount
            }
            arr[index][this.childrenKey][cIndex] = obj
          })
        })
        return arr
      },
      amountChange(item) {
        if (item.markAmount > 100000) {
          item.markAmount = 100000
        }
        if (item.markAmount < 0) {
          item.markAmount = 0
        }
        if (this.$priceFormat(item.Amount) !== this.$priceFormat(item.markAmount)) {
          item.Amount = item.markAmount
          item.isEdit = true
        }
        this.reCalcAmount()
      },
      useToOther(param) {
        const cloneObj = {
          OwnerBillID: param.OwnerBillID,
          BillProjectID: param.BillProjectID,
          BillProjectIDMark: param.BillProjectIDMark.slice(),
          BillProjectName: param.BillProjectName,
          InOrOut: param.InOrOut,
          isAmountEdit: false,
          markAmount: param.markAmount,
          Amount: param.Amount,
          uuid: uuid(),
          CanOperate: true,
          isFirst: false
        }
        for (let i = 0; i < this.data.length; i++) {
          const item = this.data[i]
          let flag = true
          for (let j = 0; j < item[this.childrenKey].length; j++) {
            const cItem = item[this.childrenKey][j]
            if (cItem.BillProjectID === cloneObj.BillProjectID) {
              flag = false
              if (cItem.CanOperate) {
                item[this.childrenKey].splice(j, 1, this.$deepCopy(cloneObj))
              }
            }
          }
          if (flag) {
            item[this.childrenKey].push(this.$deepCopy(cloneObj))
          }
        }
        this.resetData()
      },
      saveReceiveDateChange(index) {
        this.dateMark = this.data[index].ReceivablesDate
      },
      receiveDateChange(index) {
        const time1 = this.$dateFormat(this.dateMark)
        const time2 = this.$dateFormat(this.data[index].ReceivablesDate)
        if (!time1 || !time2) {
          return
        }
        const time1Arr = time1.split('-')
        const time2Arr = time2.split('-')
        const diffMonth = (time1Arr[0] - time2Arr[0]) * 12 + (time1Arr[1] - time2Arr[1])
        const diffDay = time2Arr[2] // 只记录多少号
        for (let i = index + 1; i < this.data.length; i++) {
          const item = this.data[i]
          item.ReceivablesDate = this.calcReceiveDate(item.ReceivablesDate, diffMonth, diffDay)
        }
      },
      calcReceiveDate(time, month, day) {
        const itemObj = new Date(time)
        itemObj.setMonth(itemObj.getMonth() - month)
        return this.$dateFormat(this.calcReceiveDay(itemObj, day))
      },
      calcReceiveDay(time, day) {
        const cloneTime = new Date(this.$dateFormat(time))
        cloneTime.setDate(day)
        if (cloneTime.getMonth() !== time.getMonth()) {
          return this.calcReceiveDay(time, day - 1)
        } else {
          return cloneTime
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style.scss";
</style>
