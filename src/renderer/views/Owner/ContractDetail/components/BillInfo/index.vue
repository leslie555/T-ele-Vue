<template>
  <div class="bill-info">
    <div class="panel-title has-right-btn">
      <span>租约账单</span>
    </div>
    <div class="panel-body bill-table">
      <el-table :data="BillList" fit ref="billTable" border class="table-normal noSplit">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row[childrenKey]"
              fit
              :show-header="false"
              class="table-normal noSplit bill-expand-table"
            >
              <el-table-column align="center" width="48"></el-table-column>
              <el-table-column align="center" width="270">
                <template slot-scope="scope">{{scope.row.BillProjectName}}</template>
              </el-table-column>
              <el-table-column align="center" header-align="center" label="收支类型" min-width="100">
                <template
                  slot-scope="scope"
                >{{$EnumData.getEnumDesByValue('InOrOut', scope.row.InOrOut)}}</template>
              </el-table-column>
              <el-table-column align="center" :label="`应${headerTitle}金额（元）`" min-width="120">
                <template slot-scope="scope">{{$priceFormat(scope.row.Amount)}}</template>
              </el-table-column>
              <el-table-column align="center" :label="`应${headerTitle}款日`" min-width="120"></el-table-column>
              <el-table-column align="center" :label="`已${headerTitle}金额（元）`" min-width="100">
                <template slot-scope="scope">{{$priceFormat(scope.row.ReceivedOrPaid)}}</template>
              </el-table-column>
              <el-table-column align="center" :label="`${headerTitle}款日期`" min-width="100">
                <template>{{$dateFormat(props.row.ActualPaymentDate)}}</template>
              </el-table-column>
              <el-table-column v-if="type===1" align="center" label="核销状态" min-width="100">
                <template slot-scope="scope">{{scope.row.IsActual===1?'已核销':'未核销'}}</template>
              </el-table-column>
              <el-table-column align="center" label="备注" min-width="160">
                <template slot-scope="scope">{{scope.row.Remark}}</template>
              </el-table-column>
              <el-table-column
                v-if="type===1 && isFinancier"
                align="center"
                label="操作"
                fixed="right"
                width="160"
              >
                <template slot-scope="scope">
                  <table-buttons
                    :options="WriteOffBtn"
                    :condition="scope.row.IsActual===0?['WriteOff']:[]"
                    :showAll="true"
                    @handleWriteOffClick="handleWriteOffClick(scope.row, 1, scope.$index, props.$index)"
                  ></table-buttons>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column align="center" label="项目" width="270">
          <template slot-scope="scope">
            账期{{nzhcn.encodeS(scope.$index+1)}}：
            <span
              style="font-size: 12px"
            >（{{$dateFormat(scope.row.BillStartDate)}}至{{$dateFormat(scope.row.BillEndDate)}}）</span>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label="收支类型" min-width="100"></el-table-column>
        <el-table-column align="center" :label="`应${headerTitle}金额（元）`" min-width="120">
          <template slot-scope="scope">{{$priceFormat(scope.row.BillAmount)}}</template>
        </el-table-column>
        <el-table-column align="center" :label="`应${headerTitle}款日`" min-width="120">
          <template slot-scope="scope">{{$dateFormat(scope.row.ReceivablesDate)}}</template>
        </el-table-column>
        <el-table-column align="center" :label="`已${headerTitle}金额（元）`" min-width="100">
          <template slot-scope="scope">{{$priceFormat(scope.row.ReceivedOrPaid)}}</template>
        </el-table-column>
        <el-table-column align="center" :label="`${headerTitle}款日期`" min-width="100"></el-table-column>
        <el-table-column v-if="type===1" align="center" label="核销状态" min-width="100">
          <template
            slot-scope="scope"
          >{{scope.row.TenantBillDetail.every(val=>val.IsActual===1)?'已核销':'未核销'}}</template>
        </el-table-column>
        <el-table-column align="center" label="备注" min-width="160">
          <template slot-scope="scope">{{scope.row.Remarks}}</template>
        </el-table-column>
        <el-table-column
          v-if="type===1 && isFinancier"
          align="center"
          label="操作"
          fixed="right"
          width="160"
        >
          <template slot-scope="scope">
            <table-buttons
              :options="WriteOffBtn"
              :condition="scope.row.TenantBillDetail.some(val=>val.IsActual===0)?['WriteOff']:[]"
              :showAll="true"
              @handleWriteOffClick="handleWriteOffClick(scope.row, 0, scope.$index)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="panel-title has-right-btn">
      <span>其他记账</span>
      <div>
        <el-button size="mini" type="primary" @click="handleSettlementAdd">记一笔账</el-button>
      </div>
    </div>
    <div class="panel-body table-expend">
      <el-table :data="BookKeep" border fit class="table-normal noSplit">
        <el-table-column type="expand" fixed="left">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand-form">
              <el-form-item label="房源名称">{{props.row.HouseName}}</el-form-item>
              <el-form-item label="项目名称">{{props.row.BillProjectName}}</el-form-item>
              <el-form-item label="收支类型">
                {{props.row.InOrOut?$EnumData.getEnumDesByValue('InOrOut',
                props.row.InOrOut):''}}
              </el-form-item>
              <el-form-item label="金额">{{$priceFormat(props.row.Amount)}}</el-form-item>
              <el-form-item label="收支日期">{{$dateFormat(props.row.ReceivablesDate)}}</el-form-item>
              <!--<el-form-item label="审核状态">{{$EnumData.getEnumDesByValue('AuditStatus',-->
              <!--props.row.AuditStatus)}}-->
              <!--</el-form-item>-->
              <el-form-item label="备注">
                <p>{{ props.row.Remark || '无' }}</p>
              </el-form-item>
              <el-form-item label="图片凭证">
                <div class="table-expand-img-box">
                  <template v-if="props.row.ImageUpload">
                    <div
                      class="table-expand-img"
                      v-for="(item,index) in props.row.ImageUpload"
                      :key="index"
                    >
                      <img
                        :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                        @click="$seeImage($ImgUnit.getImgUrl(item.ImageLocation))"
                      />
                    </div>
                  </template>
                  <template v-else>无</template>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="房源名称"
          fixed="left"
          width="240"
          prop="HouseName"
        ></el-table-column>
        <el-table-column align="center" label="收支类型" min-width="80">
          <template
            slot-scope="scope"
          >{{scope.row.InOrOut?$EnumData.getEnumDesByValue('InOrOut', scope.row.InOrOut):''}}</template>
        </el-table-column>
        <el-table-column align="center" label="项目" min-width="120" prop="BillProjectName"></el-table-column>
        <el-table-column align="center" label="金额" min-width="100">
          <template slot-scope="scope">{{$priceFormat(scope.row.Amount)}}</template>
        </el-table-column>
        <el-table-column align="center" label="收支日期" min-width="140">
          <template slot-scope="scope">{{$dateFormat(scope.row.ReceivablesDate)}}</template>
        </el-table-column>
        <!--<el-table-column align="center" label="审核状态" min-width="120">-->
        <!--<template slot-scope="scope">-->
        <!--{{$EnumData.getEnumDesByValue('AuditStatus', scope.row.AuditStatus)}}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <table-buttons
              :options="operation2button"
              :condition="getCondition(scope.row)"
              :showAll="true"
              @handleUpdateClick="handleSettlementUpdate(scope.row)"
              @handleDeleteClick="handleSettlementDelete(scope.row)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <settlement ref="settlement" :bus-type="type==0?2:3" :api-type="1" @success="settlementSuccess"></settlement>
  </div>
</template>

<script>
  import { Settlement, TableButtons } from '../../../../../components'
  import { deleteBookKeepByIDs, UpdateTenIsActual } from '../../../../../api/finance'
  import uuid from '../../../../../utils/uuid'
  import { hasPermission } from '../../../../../utils/permission'
  import nzhcn from 'nzh/cn'

  export default {
    props: {
      BillList: {
        type: Array,
        default() {
          return []
        }
      },
      BookKeep: {
        type: Array,
        default() {
          return []
        }
      },
      ContractInfo: {
        type: Object,
        default() {
          return {}
        }
      },
      HouseInfo: {
        type: Object,
        default() {
          return {}
        }
      },
      type: {
        type: Number,
        default: 0
      }
    },
    computed: {
      headerTitle() {
        return this.type === 0 ? '付' : '收'
      },
      isFinancier() {
        // 根据是否有收付款单页面财务按钮的权限来判断
        return hasPermission('PaymentBill', 'Write')
      }
    },
    components: {
      Settlement,
      TableButtons
    },
    data() {
      return {
        nzhcn,
        childrenKey: 'OwnerBillDetail',
        condition: ['Update', 'Delete'],
        billID: this.$route.query.BillID,
        operation2button: [
          {
            key: 'Update',
            value: '修改',
            type: 'primary'
          },
          {
            key: 'Delete',
            value: '删除',
            type: 'danger'
          }
        ],
        WriteOffBtn: [{
          key: 'WriteOff',
          value: '核销',
          type: 'primary'
        }]
      }
    },
    created() {
      if (this.type === 1) {
        this.childrenKey = 'TenantBillDetail'
      }
    },
    watch: {
      BillList: {
        handler(newValue, oldValue) {
          if (newValue && newValue.length > 0 && this.billID) {
            const index = newValue.findIndex(v => v.KeyID === +this.billID)
            this.$nextTick(() => {
              this.$refs.billTable.toggleRowExpansion(this.BillList[index])
              // 滚动到租约账单
              document.documentElement.scrollTop = document.body.scrollTop = window.pageYOffset = 277
            })
          }
        }
      }
    },
    methods: {
      getCondition(item) {
        if (item.AuditStatus === 2) {
          return []
        } else {
          return ['Update', 'Delete']
        }
      },
      handleSettlementAdd() {
        this.$refs['settlement'].open({
          BookKeepPara: {
            ContractID: this.ContractInfo.KeyID,
            HouseName: this.HouseInfo.HouseName,
            HouseID: this.HouseInfo.KeyID,
            HouseKey: this.HouseInfo.HouseKey,
            uuid: uuid()
          },
          type: 0
        })
      },
      handleSettlementUpdate(row) {
        this.$refs['settlement'].open({
          BookKeepPara: row,
          type: 1
        })
      },
      handleSettlementDelete(row) {
        this.$confirm('确定删除这条记账数据？, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBookKeepByIDs({
            ids: [row.KeyID]
          }).then(({ Data, BusCode, Msg }) => {
            this.$message.success('删除成功!')
            const index = this.BookKeep.findIndex(v => v.KeyID === row.KeyID)
            this.BookKeep.splice(index, 1)
          }).catch(() => {
            this.$message.error('删除失败!')
          })
        })
      },
      handleWriteOffClick(row, type, index, pIndex) { // type: 0 账单 1 明细
        if (type === 0) {
          const ids = row.TenantBillDetail.map(val => val.KeyID)
          UpdateTenIsActual({
            ids
          }).then(res => {
            row.TenantBillDetail.forEach(val => {
              val.IsActual = 1 // 1 已核销 2 未核销
            })
            this.$set(this.BillList, index, row)
          })
        } else {
          const ids = [row.KeyID]
          UpdateTenIsActual({
            ids
          }).then(res => {
            const BillItem = { ...this.BillList[pIndex] }
            BillItem.TenantBillDetail[index].IsActual = 1
            this.$set(this.BillList, index, BillItem)
          })
        }
      },
      settlementSuccess({ BookKeepList, type }) {
        if (type === 0) {
          // 新增
          this.BookKeep.push(...BookKeepList)
        } else {
          // 修改
          const item = BookKeepList[0]
          const index = this.BookKeep.findIndex(v => (v.uuid && v.uuid === item.uuid || v.KeyID && v.KeyID === item.KeyID))
          this.$set(this.BookKeep, index, item)
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "style";
</style>
<style lang="scss">
  @import "global";
</style>

