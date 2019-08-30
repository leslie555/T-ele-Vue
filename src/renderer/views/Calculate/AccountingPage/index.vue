<template>
  <div class="app-container">
    <el-row>
      <el-form :data="CalcForm" :inline="true">
        <!-- 当前结果 -->
        <div class="CalcformItem panel">
          <h4 class="panel-title">当前结果</h4>
          <div class="CalcformContent">
            <el-row>
              <!-- <el-form-item label="开始时间:">
                <span class="ContentMsg">{{ $dateFormat(CalcForm.TenantContractStartDate) }}</span>
              </el-form-item>-->
              <el-form-item label="预算时间:">
                <el-date-picker type="date" v-model="CalcForm.BudgetTime"></el-date-picker>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="总业绩:">
                <!-- <span
                  class="ContentMsg"
                >{{ $EnumData.getEnumDesByValue('PayCycle', CalcForm.TenantPayCycle) }}</span> -->
                <el-input v-model="CalcForm.BudgetAllAchievement"></el-input>
              </el-form-item>
              <el-form-item label="预留业绩:">
                <el-input v-model="CalcForm.BudgetOutAchievement"></el-input>
                <!-- <span class="ContentMsg">{{ $dateFormat(CalcForm.TenantLastEndTime) }}</span> -->
              </el-form-item>
              <el-form-item label="业务员业绩:">
                <el-input v-model="CalcForm.BudgetInAchievement"></el-input>
                <!-- <span class="ContentMsg">{{ $dateFormat(CalcForm.TenantLastEndTime) }}</span> -->
              </el-form-item>
            </el-row>
            <el-row>
              <el-table
                :data="AchievementList"
                :header-cell-style="{background: '#ECF5FF'}"
                border
                max-height="300"
                style="width: 1200px;"
              >
                <el-table-column label="可入次数" align="center" fixed="left" width="220">
                  <template slot-scope="scope">{{ scope.$index + 1 }}次可入</template>
                </el-table-column>
                <el-table-column label="预算金额(元)" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.BudgetInAchievement.toFixed(2) }}</span>  
                  </template>
                </el-table-column>
                <el-table-column label="可入时间" align="center">
                  <template slot-scope="scope">
                    {{ $dateFormat(scope.row.Time) }}
                  </template>
                </el-table-column>
                <el-table-column label="核算金额(元)" align="center">
                  <template slot-scope="scope">
                    <span :class="scope.row.isChecking === 'checking' ? 'isNew' : ''">{{ scope.row.CheckInAchievement.toFixed(2) }}</span>  
                  </template>
                </el-table-column>
                <el-table-column label="核算时间" align="center">
                  <template slot-scope="scope">
                    <span :class="scope.row.isChecking === 'checking' ? 'isNew' : ''">{{ $dateFormat(scope.row.ChecktTime) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </div>
        <!-- 未收账单 -->
        <div class="CalcformItem panel">
          <h4 class="panel-title">未收账单</h4>
          <div>
            <el-row>
              <el-table
                :data="NoCalcTableData"
                :header-cell-style="{background: '#ECF5FF'}"
                border
                max-height="400"
              >
                <el-table-column label="账单编号" align="center" prop="BillNum"></el-table-column>
                <el-table-column label="业务类型" align="center">
                  <template slot-scope="scope">{{ $EnumData.getEnumDesByValue('BusinessType', scope.row.BusinessType)  }}</template>
                </el-table-column>
                <el-table-column prop="ItemName" label="收支项目" align="center"></el-table-column>
                <el-table-column label="应收金额" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.ReceivableMoney.toFixed(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="优惠金额" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.Discount.toFixed(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="已收金额" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.PaidMoney.toFixed(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="未收金额" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.UnPaidMoney.toFixed(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="应收日期" align="center">
                  <template slot-scope="scope">{{ $dateFormat(scope.row.BudgetDate) }}</template>
                </el-table-column>
                <el-table-column label="审核日期" align="center">
                  <template slot-scope="scope">{{ $dateFormat(scope.row.AuditTime) }}</template>
                </el-table-column>
                <!-- <el-table-column prop="Remark" label="备注" align="center"></el-table-column> -->
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      @click="deleteNoNew(scope.$index, scope.row)"
                      size="small"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </div>
        <!-- 收入支出项 -->
        <div class="CalcformItem panel">
          <h4 class="panel-title">收入支出项</h4>
          <div class="CalcformContent" style="padding: 0">
            <el-row style="margin: 20px 0;">
              <el-button type="success" plain @click="ShowDialog">添加</el-button>
              <!-- <el-button type="primary" plain @click="showRes">查看结果</el-button> -->
            </el-row>
            <el-row>
              <el-table
                :data="CalcTableData"
                :header-cell-style="{background: '#ECF5FF'}"
                border
                max-height="400"
              >
                <el-table-column label="应收/应付" align="center">
                  <template
                    slot-scope="scope"
                  >{{ scope.row.ReceivableOrPayable === 1 ? '应收' : '应付'}}</template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                  <template slot-scope="scope">{{ scope.row.BillType === 1 ? '租客' : '业主'}}</template>
                </el-table-column>
                <el-table-column prop="ItemName" label="收支项目" align="center"></el-table-column>
                <el-table-column prop="InOrOut" label="收入/支出" align="center">
                  <template
                    slot-scope="scope"
                  >{{ $EnumData.getEnumDesByValue('InOrOut', scope.row.InOrOut) }}</template>
                </el-table-column>
                <el-table-column label="时间" align="center">
                  <template slot-scope="scope">{{ $dateFormat(scope.row.BudgetDate) }}</template>
                </el-table-column>
                <el-table-column label="金额" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.Price.toFixed(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      @click="deleteNew(scope.$index, scope.row)"
                      size="small"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </div>
      </el-form>
    </el-row>
    <el-row style="text-align: center;">
      <el-button type="primary" @click="submitCalc">开始核算</el-button>
    </el-row>
    <add-form ref="CalculationAddForm" @addNewItem="addNewData"></add-form>
    <check-res ref="CalculationRes"></check-res>
  </div>
</template>
<script>
import addForm from './components/addForm'
import checkRes from './components/checkRes'
import { FindAdjustAccounts, business } from '@/api/calculate'

export default {
  name: 'AccountingPage',
  components: {
    addForm,
    checkRes
  },
  data() {
    return {
      SendFalForm: {},
      CalcForm: {
        BudgetTime: '',
        BudgetAllAchievement: '',
        BudgetOutAchievement: '',
        BudgetInAchievement: ''
      },
      CalcTableData: [],
      NoCalcTableData: [],
      AchievementList: [],
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
    FindAdjustAccounts({
      KeyID: this.$route.query.KeyID,
      HouseID: this.$route.query.HouseID,
      TenantContractID: this.$route.query.TenantContractID
    }).then(response => {
      console.log(response)
      if (!response.Data.Achievement) {
        console.log(2)
      } else {
        for (var i in this.CalcForm) {
          this.CalcForm[i] = response.Data.Achievement[i]
        }
      }
      this.SendFalForm = this.$deepCopy(response.Data)
      if (response.Data.AchievementList.length > 0) {
        this.AchievementList = response.Data.AchievementList
      }
      if (!response.Data.FinanceBillAccounting) {
        this.CalcTableData = []
        this.NoCalcTableData = []
      } else {
        this.CalcTableData = response.Data.FinanceBillAccounting.Budget
        this.NoCalcTableData = response.Data.FinanceBillAccounting.Calculation
      }
    })
  },
  methods: {
    deleteNew(index, row) {
      this.CalcTableData.splice(index, 1)
    },
    deleteNoNew(index, row) {
      this.NoCalcTableData.splice(index, 1)
    },
    ShowDialog() {
      this.$refs['CalculationAddForm'].open()
    },
    addNewData(obj) {
      var _obj = obj
      this.CalcTableData.unshift(_obj)
    },
    submitCalc() {
      this.SendFalForm.Achievement.BudgetTime = this.CalcForm.BudgetTime
      this.SendFalForm.Achievement.BudgetAllAchievement = this.CalcForm.BudgetAllAchievement
      this.SendFalForm.Achievement.BudgetOutAchievement = this.CalcForm.BudgetOutAchievement
      this.SendFalForm.Achievement.BudgetInAchievement = this.CalcForm.BudgetInAchievement
      this.SendFalForm.AchievementList = this.AchievementList
      this.SendFalForm.FinanceBillAccounting.Budget = this.CalcTableData
      this.SendFalForm.FinanceBillAccounting.Calculation = this.NoCalcTableData
      business(this.SendFalForm).then(response => {
        if (response.Code === 0) {
          for (var i = 0; i < this.AchievementList.length; i++) {
            if (this.AchievementList[i].KeyID === response.Data.KeyID) {
              this.$set(this.AchievementList, i, response.Data)
              this.AchievementList[i].isChecking = 'checking'
            }
          }
          this.$message({
            type: 'success',
            message: '核算成功!'
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
@import "style";
</style>
