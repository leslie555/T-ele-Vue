<template>
  <div class="app-container">
    <el-row class="panel">
      <el-row>
        <div class="ConfigTitle">
          业绩测算公式配置:
        </div>
      </el-row>
      <el-row class="ConfigContent">
        <el-form :inline="true" :model="CalculateConfigForm" :rules="rules" ref="CalculateConfigForm" status-icon>
          <el-row>
            <p>公用配置</p>
            <el-form-item label="预留比例" prop="ReserveRatio">
              <el-input size="mini" v-model="CalculateConfigForm.ReserveRatio" max="100" min="0" v-positive="CalculateConfigForm.ReserveRatio" type="number"></el-input>
              <span>%</span>
            </el-form-item>
          </el-row>
          <el-row>
            <p>装修贷</p>
            <el-form-item label="装修贷年份" prop="YearRenovation">
              <el-input size="mini" v-model="CalculateConfigForm.YearRenovation" min="1" v-positive.int="CalculateConfigForm.YearRenovation" type="number"></el-input>
              <span>年</span> 
            </el-form-item>
            <el-form-item label="利率" prop="DecorationLoanInterestRate">
              <el-input size="mini" v-model="CalculateConfigForm.DecorationLoanInterestRate" v-positive="CalculateConfigForm.DecorationLoanInterestRate" min="0" max="100"  type="number"></el-input>
              <span>%</span>
            </el-form-item>
          </el-row>
          <el-row>
            <p>租客分期</p>
            <el-form-item label="利率" prop="TenantInstalmentRate">
              <el-input size="mini" v-model="CalculateConfigForm.TenantInstalmentRate" v-positive="CalculateConfigForm.TenantInstalmentRate" min="0" max="100" type="number"></el-input>
              <span>%</span>
            </el-form-item>
          </el-row>
          <el-row>
            <p>税费</p>
            <el-form-item label="税费" prop="TaxRate">
              <el-input size="mini" v-model="CalculateConfigForm.TaxRate" v-positive="CalculateConfigForm.TaxRate" min="0" max="100" type="number"></el-input>
              <span>%</span>
            </el-form-item>
          </el-row>
          <el-row>
            <p>业主分期</p>
            <el-form-item label="上浮点数" prop="FloatingPoint">
              <el-input size="mini" v-model.number="CalculateConfigForm.FloatingPoint" v-positive="CalculateConfigForm.FloatingPoint" min="0" max="100" type="number"></el-input>
              <span>%</span>
            </el-form-item>
          </el-row>
          <el-row>
            <p>首付</p>
            <el-form-item label="首年付款比例" prop="FirstYearProportion">
              <el-input size="mini" v-model="CalculateConfigForm.FirstYearProportion" v-positive="CalculateConfigForm.FirstYearProportion" min="0" max="100" type="number"></el-input>
              <span>%</span>
            </el-form-item>
            <el-form-item label="首季付款比例" prop="FirstSeasonProportion">
              <el-input size="mini" v-model="CalculateConfigForm.FirstSeasonProportion" v-positive="CalculateConfigForm.FirstSeasonProportion" min="0" max="100" type="number"></el-input>
              <span>%</span>
            </el-form-item>
            <el-form-item label="首付风控预留比例" prop="DownPaymentReserveRatio">
              <el-input size="mini" v-model="CalculateConfigForm.DownPaymentReserveRatio" v-positive="CalculateConfigForm.DownPaymentReserveRatio" min="0" max="100" type="number"></el-input>
              <span>%</span>
            </el-form-item>
          </el-row>
          <el-row>
            <p>第一年不付款</p>
            <el-form-item label="预留点数" prop="NoReserveRatio">
              <el-input size="mini" v-model="CalculateConfigForm.NoReserveRatio" v-positive="CalculateConfigForm.NoReserveRatio" min="0" max="100" type="number"></el-input>
              <span>%</span>
            </el-form-item>
          </el-row>
          <el-row>
            <p>过年收租配置</p>
            <el-form-item label="年前天数" prop="DaysBeforeNewYear">
              <el-input size="mini" v-model="CalculateConfigForm.DaysBeforeNewYear" v-positive.int="CalculateConfigForm.DaysBeforeNewYear" min="0" max="31" type="number"></el-input>
              <span>天</span>
            </el-form-item>
            <el-form-item label="年后天数" prop="DaysAfterNewYear">
              <el-input size="mini" v-model="CalculateConfigForm.DaysAfterNewYear" v-positive.int="CalculateConfigForm.DaysAfterNewYear" min="0" max="32" type="number"></el-input>
              <span>天</span>
            </el-form-item>
          </el-row>
          <el-row>
            <p>测算提醒</p>
            <el-form-item label="下月" prop="NextMonthDate">
              <el-input size="mini" v-model="CalculateConfigForm.NextMonthDate" v-positive.int="CalculateConfigForm.NextMonthDate" min="1" max="31" type="number"></el-input>
              <span style="color: #606266;">号测算</span>
            </el-form-item>
          </el-row>
          <el-row>
            <p>默认预留金额</p>
            <el-form-item label="金额" prop="ReservedMoney">
              <el-input size="mini" v-model="CalculateConfigForm.ReservedMoney" v-positive="CalculateConfigForm.ReservedMoney" min="0" type="number"></el-input>
              <span>元</span>
            </el-form-item>
          </el-row>
          <el-row>
            <p>
              分期配置&emsp;
              <i class="iconfont icon-tianjiamoren" style="color: red; font-size: 14px; cursor: pointer;" @click="addConfig"></i>
            </p>
            <div class="clearfix" v-for="(item, index) in CalculateConfigForm.StagesConfigList" :key="index">
              <el-form-item>
                <el-input size="mini" v-model="CalculateConfigForm.StagesConfigList[index].Name" placeholder="名称" :readonly="index === 0 || index === 1"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input size="mini" v-model="CalculateConfigForm.StagesConfigList[index].Rate"  placeholder="利率" @blur="$positive(CalculateConfigForm.StagesConfigList[index], 'Rate', 0, false, 100)" type="number"></el-input>
                <span>%</span>
                <i class="iconfont icon-shanjianmoren" style="margin-left: 20px; color: red; cursor: pointer;" v-if="index !== 0 && index !== 1" @click="delConfig(index)"></i>
              </el-form-item>
            </div>
          </el-row>
        </el-form>
      </el-row>
      <el-row style="text-align: center; margin-top: 20px;">
        <el-button type="primary" @click="SaveForm('CalculateConfigForm')">保存配置</el-button>
      </el-row>
    </el-row>
  </div>
</template>
<script>
  import { validNumber } from '@/utils/validate/index'
  import { FindCalcConfig, AddCalcConfig } from '@/api/calculate'

  export default({
    name: 'CalculateConfig',
    data() {
      return {
        CalculateConfigForm: {
          ReserveRatio: '',
          YearRenovation: '',
          DecorationLoanInterestRate: '',
          TenantInstalmentRate: '',
          TaxRate: '',
          FloatingPoint: '',
          FirstYearProportion: '',
          FirstSeasonProportion: '',
          DownPaymentReserveRatio: '',
          NoReserveRatio: '',
          NextMonthDate: '',
          DaysBeforeNewYear: '',
          DaysAfterNewYear: '',
          ReservedMoney: '',
          // 分期配置
          StagesConfigList: [
            {
              Name: '会分期',
              Rate: ''
            },
            {
              Name: '元宝e家',
              Rate: ''
            }
          ]
        },
        // 表单验证
        rules: {
          ReserveRatio: [
            { required: true, message: '预留比例不能为空', trigger: 'blur' }
            // { validator: CheckNum, message: '', trigger: 'blur' }
          ],
          YearRenovation: [
            { required: true, message: '装修贷年份不能为空', trigger: 'blur' }
          ],
          DecorationLoanInterestRate: [
            { required: true, message: '利率不能为空', trigger: 'blur' }
          ],
          TenantInstalmentRate: [
            { required: true, message: '利率不能为空', trigger: 'blur' }
          ],
          TaxRate: [
            { required: true, message: '税费不能为空', trigger: 'blur' }
          ],
          FloatingPoint: [
            { required: true, message: '上浮点数不能为空', trigger: 'blur' }
          ],
          FirstYearProportion: [
            { required: true, message: '首年付款比例不能为空', trigger: 'blur' }
          ],
          FirstSeasonProportion: [
            { required: true, message: '首季付款比例不能为空', trigger: 'blur' }
          ],
          DownPaymentReserveRatio: [
            { required: true, message: '首季风控预留比例不能为空', trigger: 'blur' }
          ],
          NoReserveRatio: [
            { required: true, message: '预留点数不能为空', trigger: 'blur' }
          ],
          DaysBeforeNewYear: [
            { required: true, message: '年前天数不能为空', trigger: 'blur' }
          ],
          DaysAfterNewYear: [
            { required: true, message: '年后天数不能为空', trigger: 'blur' }
          ],
          NextMonthDate: [
            { required: true, message: '年后天数不能为空', trigger: 'blur' }
          ],
          ReservedMoney: [
            { required: true, message: '年后天数不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      SaveForm(formName) {
        const self = this
        this.$refs[formName].validate(valid => {
          if (valid) {
            var isAllCom = true
            for (var i = 0; i < this.CalculateConfigForm.StagesConfigList.length; i++) {
              if (this.CalculateConfigForm.StagesConfigList[i].Rate === '') {
                this.$message.error('分期利率不能为空')
                isAllCom = false
                break
              } else if (this.CalculateConfigForm.StagesConfigList[i].Name === '') {
                this.$message.error('分期名称不能为空')
                isAllCom = false
                break
              } else if (this.CalculateConfigForm.StagesConfigList[i].Rate < 0) {
                this.$message.error('分期利率不能为负数')
                isAllCom = false
                break
              } else if (!validNumber(this.CalculateConfigForm.StagesConfigList[i].Rate)) {
                this.$message.error('分期利率不能为非数字')
                isAllCom = false
                break
              } else if (this.CalculateConfigForm.StagesConfigList[i].Rate > 100) {
                this.$message.error('分期利率不能大于100')
                isAllCom = false
                break
              }
            }
            if (isAllCom) {
              AddCalcConfig({
                KeyID: this.KeyID,
                ReserveRatio: this.CalculateConfigForm.ReserveRatio,
                YearRenovation: this.CalculateConfigForm.YearRenovation,
                DecorationLoanInterestRate: this.CalculateConfigForm.DecorationLoanInterestRate,
                TenantInstalmentRate: this.CalculateConfigForm.TenantInstalmentRate,
                TaxRate: this.CalculateConfigForm.TaxRate,
                FloatingPoint: this.CalculateConfigForm.FloatingPoint,
                FirstYearProportion: this.CalculateConfigForm.FirstYearProportion,
                FirstSeasonProportion: this.CalculateConfigForm.FirstSeasonProportion,
                DownPaymentReserveRatio: this.CalculateConfigForm.DownPaymentReserveRatio,
                NoReserveRatio: this.CalculateConfigForm.NoReserveRatio,
                NextMonthDate: this.CalculateConfigForm.NextMonthDate,
                DaysBeforeNewYear: this.CalculateConfigForm.DaysBeforeNewYear,
                DaysAfterNewYear: this.CalculateConfigForm.DaysAfterNewYear,
                ReservedMoney: this.CalculateConfigForm.ReservedMoney,
                StagesConfigList: this.CalculateConfigForm.StagesConfigList
              }).then(response => {
                self.$message({
                  message: '保存成功!',
                  type: 'success'
                })
              })
            }
          }
        })
      },
      addConfig() {
        this.CalculateConfigForm.StagesConfigList.push({
          Name: '',
          Rate: ''
        })
      },
      delConfig(index) {
        this.CalculateConfigForm.StagesConfigList.splice(index, 1)
      }
    },
    mounted() {
      FindCalcConfig().then(response => {
        this.KeyID = response.Data.KeyID
        this.CalculateConfigForm.ReserveRatio = response.Data.ReserveRatio
        this.CalculateConfigForm.YearRenovation = response.Data.YearRenovation
        this.CalculateConfigForm.DecorationLoanInterestRate = response.Data.DecorationLoanInterestRate
        this.CalculateConfigForm.TenantInstalmentRate = response.Data.TenantInstalmentRate
        this.CalculateConfigForm.TaxRate = response.Data.TaxRate
        this.CalculateConfigForm.FloatingPoint = response.Data.FloatingPoint
        this.CalculateConfigForm.FirstYearProportion = response.Data.FirstYearProportion
        this.CalculateConfigForm.FirstSeasonProportion = response.Data.FirstSeasonProportion
        this.CalculateConfigForm.DownPaymentReserveRatio = response.Data.DownPaymentReserveRatio
        this.CalculateConfigForm.NoReserveRatio = response.Data.NoReserveRatio
        this.CalculateConfigForm.NextMonthDate = response.Data.NextMonthDate
        this.CalculateConfigForm.DaysBeforeNewYear = response.Data.DaysBeforeNewYear
        this.CalculateConfigForm.DaysAfterNewYear = response.Data.DaysAfterNewYear
        this.CalculateConfigForm.ReservedMoney = response.Data.ReservedMoney
        if (response.Data.StagesConfigList.length > 0) {
          this.CalculateConfigForm.StagesConfigList = response.Data.StagesConfigList
        }
      })
    }
  })
</script>
<style lang="scss" scoped>
@import "style";

.clearfix {
  .el-form-item {
    margin-bottom: 6px;
  }
}
</style>
