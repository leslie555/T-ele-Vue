<template>
  <div class="app-container">
    <el-row>
      <el-form :data="CalcForm" :inline="true">
        <!-- 租客租约信息 -->
        <div class="CalcformItem panel">
          <h4 class="panel-title">租客租约信息</h4>
          <div class="CalcformContent">
            <el-row>
              <!-- <el-form-item label="开始时间:">
                <span class="ContentMsg">{{ $dateFormat(CalcForm.TenantContractStartDate) }}</span>
              </el-form-item> -->
              <el-form-item label="开始时间:">
                <el-date-picker type="date" v-model="CalcForm.TenantContractStartDate"></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间:">
                <el-date-picker type="date" v-model="CalcForm.TenantContractEndDate"></el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="结束时间:">
                <span class="ContentMsg">{{ $dateFormat(CalcForm.TenantContractEndDate) }}</span>
              </el-form-item> -->
              <el-form-item label="月租:">
                <!-- <span class="ContentMsg">{{ CalcForm.TenantRent }}元</span> -->
                <el-input v-model="CalcForm.TenantRent"></el-input>
              </el-form-item>
              <el-form-item label="是否分期:">
                <span class="ContentMsg">{{ CalcForm.TenantIsByStages ? '是' : '否'}}</span>
              </el-form-item>
            </el-row>
            <el-form-item label="付款方式:">
              <span class="ContentMsg">{{ $EnumData.getEnumDesByValue('PayCycle', CalcForm.TenantPayCycle) }}</span>
            </el-form-item>
            <el-form-item label="上次租客结束日期:">
              <el-date-picker type="date" v-model="CalcForm.TenantLastEndTime"></el-date-picker>
              <!-- <span class="ContentMsg">{{ $dateFormat(CalcForm.TenantLastEndTime) }}</span> -->
            </el-form-item>
          </div>
        </div>
        <!-- 业主租约信息 -->
        <div class="CalcformItem panel">
          <h4 class="panel-title">业主租约信息</h4>
          <div class="CalcformContent">
            <el-row>
              <!-- <el-form-item label="开始时间:">
                <span class="ContentMsg">{{ $dateFormat(CalcForm.OwnerContractStartDate) }}</span>
              </el-form-item>
              <el-form-item label="结束时间:">
                <span class="ContentMsg">{{ $dateFormat(CalcForm.OwnerContractEndDate) }}</span>
              </el-form-item> -->
              <el-form-item label="开始时间:">
                <el-date-picker type="date" v-model="CalcForm.OwnerContractStartDate"></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间:">
                <el-date-picker type="date" v-model="CalcForm.OwnerContractEndDate"></el-date-picker>
              </el-form-item>
              <el-form-item label="月租:">
                <!-- <span class="ContentMsg">{{ CalcForm.TakeHousePrices }}元</span> -->
                <el-input v-model="CalcForm.TakeHousePrices"></el-input>
              </el-form-item>
              <el-form-item label="是否分期:">
                <span class="ContentMsg">{{ CalcForm.OwnerIsByStages !== '0' ? '是' : '否'}}</span>
              </el-form-item>
            </el-row>
            <el-form-item label="付款方式:">
              <span class="ContentMsg">{{ $EnumData.getEnumDesByValue('PayCycle', CalcForm.OwnerPayCycle) }}</span>
            </el-form-item>
            <el-form-item label="是否有免租:">
              <span class="ContentMsg">{{ CalcForm.OwnerFreePay ? '是' : '否'}}</span>
            </el-form-item>
          </div>
        </div>
        <!-- 装修信息 -->
        <div class="CalcformItem panel">
          <h4 class="panel-title">装修信息</h4>
          <div class="CalcformContent">
            <el-row>
              <el-form-item label="是否装修贷:">
                <span class="ContentMsg">{{ CalcForm.IsDecorationLoan !== '0' ? '否' : '是'}}</span>
              </el-form-item>
            </el-row>
          </div>
        </div>
        <!-- 上次业绩 -->
        <div class="CalcformItem panel">
          <h4 class="panel-title">上次业绩</h4>
          <div class="CalcformContent">
            <el-row>
              <el-form-item>
                <el-checkbox v-model="isUseOldData">是否录入上次业绩</el-checkbox>
              </el-form-item>
            </el-row>
            <transition name="oldData">

            </transition>
            <el-row v-if="isUseOldData">
              <el-form-item label="总业绩:">
                <!-- 字段待定 -->
                <el-input v-model="TotalPerformance"></el-input>
              </el-form-item>
              <el-form-item label="已入业绩:">
                <!-- 字段待定 -->
                <el-input v-model="ReservePerformance"></el-input>
              </el-form-item>
              <el-form-item label="预留业绩:">
                <!-- 字段待定 -->
                <el-input v-model="TotalTheoreticalPerformance"></el-input>
              </el-form-item>
            </el-row>
          </div>
        </div>
        <!-- 收入支出项 -->
        <div class="CalcformItem panel">
          <h4 class="panel-title">收入支出项</h4>
          <div class="CalcformContent" style="padding: 0">
            <el-row style="margin: 20px 0;">
              <el-button type="success" plain @click="ShowDialog">添加</el-button>
              <el-button type="primary" plain @click="showRes">查看结果</el-button>
            </el-row>
            <el-row>
              <el-table :data="CalcTableData" :header-cell-style="{background: '#ECF5FF'}" border max-height="400">
                <el-table-column label="应收/应付" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.ReceivableOrPayable === 1 ? '应收' : '应付'}}
                  </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.BillType === 1 ? '租客' : '业主'}}
                  </template>
                </el-table-column>
                <el-table-column prop="ItemName" label="收支项目" align="center"></el-table-column>
                <el-table-column prop="InOrOut" label="收入/支出" align="center">
                  <template slot-scope="scope">
                    {{ $EnumData.getEnumDesByValue('InOrOut', scope.row.InOrOut) }}
                  </template>
                </el-table-column>
                <el-table-column label="时间" align="center">
                  <template slot-scope="scope">
                    {{ $dateFormat(scope.row.BudgetDate) }}
                  </template>
                </el-table-column>
                <el-table-column label="金额" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.Price.toFixed(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="danger" @click="deleteNew(scope.$index, scope.row)" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </div>
      </el-form>
    </el-row>
    <el-row style="text-align: center;">
      <el-button type="primary" @click="submitCalc">开始预算</el-button>
    </el-row>
    <add-form ref="CalculationAddForm" @addNewItem="addNewData"></add-form>
    <check-res ref="CalculationRes"></check-res>
  </div>
</template>
<script>
import addForm from './components/addForm'
import checkRes from './components/checkRes'
import { FindCalcRequest, Budget, FindBudgetResult } from '@/api/calculate'

export default {
  name: 'Calculation',
  components: {
    addForm,
    checkRes
  },
  data() {
    return {
      SendFalForm: {},
      CalcForm: {
        TenantContractStartDate: new Date(),
        TenantContractEndDate: new Date(),
        TenantRent: '2250',
        TenantIsByStages: true,
        TenantPayCycle: '0',
        TenantLastEndTime: new Date(),
        OwnerContractStartDate: '',
        OwnerContractEndDate: '',
        TakeHousePrices: '',
        OwnerIsByStages: false,
        OwnerPayCycle: 'MouthPay',
        OwnerFreePay: true,
        IsDecorationLoan: false
      },
      CalcTableData: [],
      // 控制弹窗显示
      isShowDialog: false,
      TotalPerformance: '',
      ReservePerformance: '',
      TotalTheoreticalPerformance: '',
      // 查看结果弹窗显示
      isShowRes: false,
      // 控制是否录入上次业绩
      isUseOldData: false
    }
  },
  created() {
    console.log(this.$store.getters)
    FindCalcRequest({
      type: this.$route.query.type,
      KeyID: this.$route.query.KeyID
    }).then(response => {
      console.log(response)
      for (var i in this.CalcForm) {
        this.CalcForm[i] = response.Data[i]
      }
      this.SendFalForm = this.$deepCopy(response.Data)
      if (!response.Data.FinanceBillShowList) {
        this.CalcTableData = []
      } else {
        this.CalcTableData = response.Data.FinanceBillShowList
      }
    })
  },
  methods: {
    deleteNew(index, row) {
      this.CalcTableData.splice(index, 1)
    },
    ShowDialog() {
      this.$refs['CalculationAddForm'].open()
    },
    addNewData(obj) {
      var _obj = obj
      this.CalcTableData.unshift(_obj)
    },
    showRes() {
      FindBudgetResult({
        HouseID: this.SendFalForm.HouseID,
        TenantContractID: this.SendFalForm.TenantContractID
      }).then(response => {
        this.$refs['CalculationRes'].open(response.Data)
      })
    },
    submitCalc() {
        this.SendFalForm.TenantContractStartDate = this.CalcForm.TenantContractStartDate
        this.SendFalForm.TenantContractEndDate = this.CalcForm.TenantContractEndDate
        this.SendFalForm.TenantRent = this.CalcForm.TenantRent
        this.SendFalForm.TenantIsByStages = this.CalcForm.TenantIsByStages
        this.SendFalForm.TenantPayCycle = this.CalcForm.TenantPayCycle
        this.SendFalForm.TenantLastEndTime = this.CalcForm.TenantLastEndTime
        this.SendFalForm.OwnerContractStartDate = this.CalcForm.OwnerContractStartDate
        this.SendFalForm.OwnerContractEndDate = this.CalcForm.OwnerContractEndDate
        this.SendFalForm.TakeHousePrices = this.CalcForm.TakeHousePrices
        this.SendFalForm.OwnerIsByStages = this.CalcForm.OwnerIsByStages
        this.SendFalForm.OwnerPayCycle = this.CalcForm.OwnerPayCycle
        this.SendFalForm.OwnerFreePay = this.CalcForm.OwnerFreePay
        this.SendFalForm.IsDecorationLoan = this.CalcForm.IsDecorationLoan
        this.SendFalForm.TotalPerformance = this.TotalPerformance
        this.SendFalForm.ReservePerformance = this.ReservePerformance
        this.SendFalForm.TotalTheoreticalPerformance = this.TotalTheoreticalPerformance
        this.SendFalForm.FinanceBillShowList = this.CalcTableData
      Budget(this.SendFalForm).then(response => {
        if (response.Code === 0) {
          this.$message({
            type: 'success',
            message: '测算成功!'
          })
        }
      })
    }
  },
  computed: {
    // 付款方式
    TenantPayCycle() {
      var payCycle = this.CalcForm.TenantPayCycle
      switch (payCycle) {
        case 'MouthPay':
          return '月付'
        case 'SeasonPay':
          return '季付'
        case 'HalfPay':
          return '半年付'
        case 'YearPay':
          return '年付'
      }
    },
    OwnerPayCycle() {
      var payCycle = this.CalcForm.OwnerPayCycle
      switch (payCycle) {
        case 'MouthPay':
          return '月付'
        case 'SeasonPay':
          return '季付'
        case 'HalfPay':
          return '半年付'
        case 'YearPay':
          return '年付'
      }
    }
  }
}
</script>
<style lang='scss' scoped>
  @import 'style'
</style>
