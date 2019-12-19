<template>
  <div class="app-container contract-detail">
    <div class="panel" v-loading="detailLoading">
      <steps-box :list="stepList" ref="steps">
        <template slot="1" v-if="checkoutType===1">
          <div class="contract-step1">
            <el-form :model="ruleForm" ref="ruleForm" width="800">
              <div class="centerDiv">
                <div>
                  <el-form-item label="水电气预付金" prop="DefaultPrepayment">
                    <el-input
                      placeholder="请填写"
                      maxlength="14"
                      v-model="ruleForm.DefaultPrepayment"
                      class="inputWidth"
                    ></el-input>
                    <p class="subph">水电气预付金于退房当日多退少补</p>
                  </el-form-item>
                </div>
                <el-form-item label="租客搬离日期" prop="DefaultAgreeRemoveDate">
                  <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择日期"
                    v-model="ruleForm.DefaultAgreeRemoveDate"
                    class="inputWidth"
                  ></el-date-picker>
                  <p class="subph">搬离前结清所有费用、保证设施设备完好，过期不搬有权封门换锁</p>
                </el-form-item>
                <el-form-item label="退还金额" prop="DefaultReturnMonry">
                  <el-input
                    placeholder="请填写"
                    maxlength="14"
                    v-model="ruleForm.DefaultReturnMonry"
                    class="inputWidth"
                  ></el-input>
                  <p class="subph">此处为租客同意此房剩余房租及押金退还金额</p>
                </el-form-item>
                <!-- <el-form-item label="租客卡号" prop="DefaultTransferCardNumber">
                  <el-input
                    placeholder="请填写"
                    v-model="ruleForm.DefaultTransferCardNumber"
                    class="inputWidth"
                  ></el-input>
                </el-form-item> -->
              </div>
            </el-form>
          </div>
          <div class="clearfix block-center order-btn-box">
            <el-button type="primary" @click="next(0)">下一步</el-button>
          </div>
        </template>
        <div :slot="checkoutType+1" class="order-contract">
          <div class="order-contract-title">退房收款清单</div>
          <div class="order-contract-label">
            <h4 class="order-contract-num">合同号：{{ContractNumber}}</h4>
            <p>
              <label>
                门店：
                <span>{{CompanyName}}</span>
              </label>
              <label>
                经理：
                <span>{{ManagerName}}</span>
              </label>
              <label>
                经手人：
                <span>{{EmployeeName}}</span>
              </label>
              <label>
                楼盘/房号：
                <span>{{HouseName}}</span>
              </label>
            </p>
          </div>
          <div class="order-contract-table1">
            <!-- <el-form :model="ruleFormInput" :rules="rules" ref="ruleFormInput"> -->
            <el-table
              :data="filterList1"
              ref="multipleTable"
              v-loading.body="listLoading"
              element-loading-text="加载中"
              border
              fit
              height="184px"
              width="100%"
              class="table-normal"
            >
              <el-table-column align="center" prop="title"></el-table-column>
              <el-table-column align="center" label="起数">
                <template slot-scope="scope">
                  {{scope.row.WaterBaseNumber}}
                  {{scope.row.ElectricityBaseNumber}}
                  {{scope.row.GasBaseNumber}}
                </template>
              </el-table-column>
              <el-table-column align="center" label="止数">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.$index === 0"
                    v-model="scope.row.WaterEndNumber"
                    type="number"
                    placeholder="请填写"
                  ></el-input>
                  <el-input
                    v-if="scope.$index === 1"
                    v-model="scope.row.ElectricityEndNumber"
                    placeholder="请填写"
                    type="number"
                  ></el-input>
                  <el-input
                    v-if="scope.$index === 2"
                    v-model="scope.row.GasEndNumber"
                    placeholder="请填写"
                    type="number"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="金额">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.$index === 0"
                    v-model="scope.row.WaterMoney"
                    placeholder="请填写"
                    type="number"
                  ></el-input>
                  <el-input
                    v-if="scope.$index === 1"
                    v-model="scope.row.ElectricityMoney"
                    placeholder="请填写"
                    type="number"
                  ></el-input>
                  <el-input
                    v-if="scope.$index === 2"
                    v-model="scope.row.GasMoney"
                    placeholder="请填写"
                    type="number"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="是否结清">
                <template slot-scope="scope">
                  <el-select
                    v-if="scope.$index === 0"
                    v-model="scope.row.WaterIsSettle"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in IsSettle"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-if="scope.$index === 1"
                    v-model="scope.row.ElectricityIsSettle"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in IsSettle"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-if="scope.$index === 2"
                    v-model="scope.row.GasIsSettle"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in IsSettle"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
            <!-- </el-form> -->
          </div>
          <div class="order-contract-table1">
            <el-table
              :data="filterList2"
              ref="multipleTable"
              v-loading.body="listLoading"
              element-loading-text="加载中"
              border
              fit
              height="184px"
              width="100%"
              class="table-normal"
            >
              <el-table-column align="center" prop="title"></el-table-column>
              <el-table-column align="center" label="截止年月日">
                <template slot-scope="scope">
                  <el-date-picker
                    v-if="scope.$index === 0"
                    v-model="scope.row.NetWorkDate"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                  <el-date-picker
                    v-if="scope.$index === 1"
                    v-model="scope.row.ManageDate"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                  <el-date-picker
                    v-if="scope.$index === 2"
                    v-model="scope.row.CleanDate"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column align="center" label="金额">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.$index === 0"
                    v-model="scope.row.NetWorkMoney"
                    placeholder="请填写"
                    type="number"
                  ></el-input>
                  <el-input
                    v-if="scope.$index === 1"
                    v-model="scope.row.ManageMoney"
                    placeholder="请填写"
                    type="number"
                  ></el-input>
                  <el-input
                    v-if="scope.$index === 2"
                    v-model="scope.row.CleanMoney"
                    placeholder="请填写"
                    type="number"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="是否结清">
                <template slot-scope="scope">
                  <el-select
                    v-if="scope.$index === 0"
                    v-model="scope.row.NetWorkIsSettle"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in IsSettle"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-if="scope.$index === 1"
                    v-model="scope.row.ManageIsSettle"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in IsSettle"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-if="scope.$index === 2"
                    v-model="scope.row.CleanIsSettle"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in IsSettle"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="order-contract-table1">
            <el-table
              :data="filterList3"
              ref="multipleTable"
              v-loading.body="listLoading"
              element-loading-text="加载中"
              :span-method="arraySpanMethod"
              border
              fit
              height="135px"
              width="100%"
              class="table-normal"
            >
              <el-table-column align="center" prop="title"></el-table-column>
              <el-table-column align="center" label="门卡">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.$index === 0"
                    v-model="scope.row.DoorCardCount"
                    type="number"
                    placeholder="请填写"
                  ></el-input>
                  <el-input
                    v-if="scope.$index === 1"
                    v-model="scope.row.KeyPlacement"
                    placeholder="请填写"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="水卡">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.WaterCardCount" placeholder="请填写" type="number"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="电卡">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ElecCardCount" placeholder="请填写" type="number"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="钥匙">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.KeyCount" placeholder="请填写" type="number"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="order-contract-table1">
            <el-table
              :data="filterList4"
              ref="multipleTable"
              v-loading.body="listLoading"
              element-loading-text="加载中"
              border
              fit
              height="122px"
              width="100%"
              class="table-normal"
            >
              <el-table-column label="到期多居住" header-align="center" align="center">
                <el-table-column label="天数" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.ExpireLiveDay" placeholder="请填写" type="number"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="金额" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.ExpireLiveDayMoney" placeholder="请填写" type="number"></el-input>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column align="center" header-align="center" label="违约退房">
                <el-table-column align="center" header-align="center" label="金额">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.DefaultMoney" placeholder="请填写" type="number"></el-input>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
          <div class="order-contract-table1">
            <div class="order-contract-tab">
              <span>设施设备损坏维修</span>
              <el-button type="primary" plain size="mini" @click="addEquipment">添加设备</el-button>
            </div>
            <el-table
              :data="filterList5"
              ref="multipleTable"
              v-loading.body="listLoading"
              element-loading-text="加载中"
              border
              fit
              min-height="100%"
              width="100%"
              class="table-normal"
            >
              <el-table-column label="设备" align="center">
                <template slot-scope="scope">
                  <!--<span>{{ scope.row.EquipmentName }}</span>-->
                    <!--<el-input-->
                      <!--ref="addInput"-->
                      <!--autofocus="true"-->
                      <!--v-model="currEquipmentName"-->
                      <!--placeholder="请填写名称"-->
                      <!--@blur="saveRow(scope.row)"-->
                    <!--&gt;</el-input>-->
                    <el-autocomplete
                      popper-class="my-autocomplete"
                      v-model="filterList5[scope.$index].EquipmentName"
                      :fetch-suggestions="querySearchAsync"
                      placeholder="请填写名称或者选择设备"
                      :maxlength="40"
                      @select="handleCommunitySelect(...arguments,filterList5[scope.$index])">
                    <i class="el-icon-search el-input__icon" slot="suffix"></i>
                      <template slot-scope="{ item }">
                        <div class="name">{{ item }}</div>
                      </template>
                  </el-autocomplete>
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <el-select v-model="filterList5[scope.$index].EquipmentState" placeholder="请选择">
                    <el-option
                      v-for="item in tableOption"
                      :key="item.EquipmentState"
                      :label="item.EquipmentName"
                      :value="item.EquipmentState"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    plain
                    size="mini"
                    @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="order-contract-count">
              <label>维修等共计金额：</label>
              <el-input v-model="RepairMoney" placeholder="请填写" type="number"></el-input>元
            </div>
            <div class="order-contract-info">
              <p>
                房租
                  <el-input v-model="HouseRent" placeholder="请填写" type="number"></el-input>元/押金
                  <el-input v-model="HouseDeposit" placeholder="请填写" type="number"></el-input>元/押金
                元 (凭合同押金条，再财务核实)-需支付费用
                <el-input v-model="NeedPay" placeholder="请填写" type="number"></el-input>元
                =收到实退￥
                <span>{{getActualReceive}}</span>元，大写：
                <span>{{this.$ToCapChinese(getActualReceive)}}</span>,此后双方无任何纠纷，款项于30个工作日
                  <el-date-picker
                    v-model="PaymentDay"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                  日打到客户下面对应账上。
              </p>
            </div>
            <p class="order-contract-bank-info">
              <label>客户本人银行卡号:</label>
              <el-input v-model="BankAccount" placeholder="请填写" type="number"></el-input>
              <label>户名:</label>
              <el-input v-model="TenBankName" placeholder="请填写"></el-input>
              <label>开户行:</label>
              <el-input v-model="OpenBankName" placeholder="请填写"></el-input>
            </p>

            <div class="order-contract-signInfo">
              <ul>
                <li>
                  <span class="order-contractImg-title"> 租客确认签字：</span>
                  <img class="order-contractImg-size" :src="$ImgUnit.getThumbImgUrl(TenSignInfo)"/>
                </li>
                <li>
                  租客身份证号：
                  <span>{{TenantCard}}</span>
                </li>
                <li>
                  租客电话号码：
                  <span>{{TenantPhone}}</span>
                </li>
              </ul>
              <ul>
                <li>
                  合同起止日期：
                  <span>{{this.$dateFormat(ContractStartDate)}}</span>
                </li>
                <li>
                  退房当天日期：
                  <span>{{this.$dateFormat(CheckOutDate)}}</span>
                </li>
                <li>
                  <span class="order-contractImg-title"> 退房人确认签字:</span>
                  <img class="order-contractImg-size" :src="$ImgUnit.getThumbImgUrl(SalesmanSignInfo)"/>
                </li>
              </ul>
            </div>
            <div class="order-contract-client-info">
              <p>裁下客户联客户留存：</p>
              <p class="order-contract-footer">
                本人
                <span>
                  {{TenantName}}
                  （身份证号：
                  <strong>{{ TenantCard }}</strong>）
                </span>有关
                <span>{{HouseName}}</span>的房子同意以上退房款项￥
                <span>{{getActualReceive}}</span>元（大写：
                <span>{{this.$ToCapChinese(getActualReceive)}}</span>）
                于30个工作日
                  <span>{{PaymentDay}}</span>
                日打入本人银行卡号：
                <span>{{BankAccount}}</span>此后双方无任何纠纷。
              </p>
              <p>
              <span class="order-contract-footer">
                <img class="contractImg-size" :src="$ImgUnit.getThumbImgUrl(TenSignInfo)"/>
              </span>
               <span>退房时保持房内家电家具设施完好，房屋干净整洁，请租客配合验房，并请带走您的所有私人物品。谢谢！祝您生活愉快。</span>
               </p>
            </div>
          </div>

          <div class="clearfix block-center order-btn-box">
            <el-button type="info" @click="prev(1)" class="mr-20" v-show="checkoutType===1">上一步</el-button>
            <el-button
              type="primary"
              class="mr-20"
              @click="handleSaveInfo"
              :loading="SaveLoading"
            >保存</el-button>
          </div>
        </div>
      </steps-box>
    </div>

    <bills-preview ref="billsPreview"></bills-preview>
  </div>
</template>

<script>
import BillsPreview from '../components/BillsPreview'
import { StepsBox } from '../../../../components'
import {
  InsertTenCheckOutAgreement,
  SelectTenCheckOutAgreement,
  UpdateTenCheckOutAgreement
} from '../../../../api/tenant'
import { dateFormat } from '../../../../utils/dateFormat'
export default {
  name: 'TenantCheckoutBill',
  components: {
    BillsPreview,
    StepsBox
  },
  data() {
    return {
      ContractNumber: '',
      HouseName: '',
      CompanyName: '',
      ManagerName: '',
      EmployeeName: '',
      CompanyAbbreviation: '',
      IsDefault: '', // 是否违约
      updateStatus: false,
      TenContractID: '',
      KeyID: '',
      query: this.$route.query, // KeyID,type
      checkoutType: +this.$route.query.type, // 0 正常退房 1 违约退房
      listLoading: false,
      detailLoading: false,
      SaveLoading: false,
      isAddRow: false,
      input: '',
      lastEdit: 0,
      addColumnName: '',
      currEquipmentName: '',
      lastIndex: 0,
      CompanyNameUrl: '',
      ruleFormInput: {

      },
      ruleForm: {
        DefaultPrepayment: '',
        DefaultAgreeRemoveDate: '',
        DefaultReturnMonry: ''
      },
      RepairMoney: '', // 维修共计金额
      HouseRent: '', // 房租
      HouseDeposit: '', // 房屋押金
      NeedPay: '', // 需支付费用
      ActualReceive: '', // 收到实退
      PaymentDay: '', // 款项打款日
      BankAccount: '', // 客户银行卡号
      TenBankName: '', // 户名
      OpenBankName: '', // 开户行
      TenSignInfo: '', // 租客签字
      TenantName: '', // 租客签字
      TenantCard: '', // 租客身份证号
      TenantPhone: '', // 租客电话号码
      ContractStartDate: '', // 合同起止日期
      CheckOutDate: '', // 退房当天日期
      SalesmanSignInfo: '', // 退房人签字
      Equipment: [], // 添加设备清单
      filterList1: [
        { WaterBaseNumber: '', WaterEndNumber: '', title: '水', WaterMoney: '', WaterIsSettle: '' },
        { ElectricityBaseNumber: '', ElectricityEndNumber: '', title: '电', ElectricityMoney: '', ElectricityIsSettle: '' },
        { GasBaseNumber: '', GasEndNumber: '', title: '气', GasMoney: '', GasIsSettle: '' }
      ],
      filterList2: [
        { title: '网', NetWorkDate: [], NetWorkMoney: '', NetWorkIsSettle: '' },
        { title: '物管卫生', ManageDate: [], ManageMoney: '', ManageIsSettle: '' },
        { title: '保洁费用', CleanDate: [], CleanMoney: '', CleanIsSettle: '' }
      ],
      filterList3: [
        { DoorCardCount: '', WaterCardCount: '', ElecCardCount: '', KeyCount: '', title: '数量' },
        { KeyPlacement: '', title: '钥匙放置处' }
      ],
      filterList4: [
        { ExpireLiveDay: '', ExpireLiveDayMoney: '', DefaultMoney: '' }
      ],
      filterList5: [],
      IsSettle: [{
        value: '1',
        label: '是'
      }, {
        value: '0',
        label: '否'
      }],
      tableOption: [{
        EquipmentState: 0,
        EquipmentName: '正常'
      }, {
        EquipmentState: 1,
        EquipmentName: '损坏'
      }],
      stepList: [
        { title: '违约退房协议' },
        { title: '退房收款清单' }
      ],
      defaultEqu: ['照明灯', '开关', '插座', '遥控器', '晾衣杆', '窗帘', '门锁',
        '水龙头', '地漏', '地板', '墙面', '电视', '冰箱', '洗衣机', '空调', '热水器', '燃气灶',
        '油烟机', '橱柜', '花洒', '浴霸灯', '洗漱台', '衣柜', '床（垫）', '沙发', '茶几', '电视柜',
        '餐桌椅', '鞋柜', '床头柜']
    }
  },
  computed: {
    getActualReceive() {
     return Number(this.HouseRent) + Number(this.HouseDeposit) - this.NeedPay
    //  return Number(this.NeedPay) + 7 - 1
    }
  },
  created() {
    this.ContractNumber = this.query.ContractNumber
    this.HouseName = this.query.HouseName
    this.CompanyAbbreviation = this.query.CompanyAbbreviation
    this.detailLoading = true
    SelectTenCheckOutAgreement({
      KeyID: this.query.KeyID,
      IsDefault: this.checkoutType,
      HouseKey: this.query.HouseKey
    }).then(res => {
      this.detailLoading = false
      const { Data } = res
      if (res.Code === 0) {
        this.KeyID = res.Data.KeyID
        // this.TenContractID = res.Data.TenContractID
        if (res.Data.KeyID === 0) {
          this.updateStatus = false // KeyID等于0， 保存时为新增状态
          this.CompanyName = Data.CompanyName
          this.CompanyNameUrl = Data.CompanyNameUrl
          this.ContractStartDate = Data.ContractStartDate
          this.CheckOutDate = Data.CheckOutDate
          this.EmployeeName = Data.EmployeeName
          this.ManagerName = Data.ManagerName
          this.SalesmanSignInfo = Data.SalesmanSignInfo
          this.TenSignInfo = Data.TenSignInfo
          this.TenantCard = Data.TenantCard
          this.TenantName = Data.TenantName
          this.TenantPhone = Data.TenantPhone
          this.HouseRent = Data.HouseRent
          this.HouseDeposit = Data.HouseDeposit
          this.PaymentDay = dateFormat(Data.PaymentDay)
          this.NeedPay = Data.NeedPay
          this.filterList1[0].WaterBaseNumber = Data.WaterBaseNumber
          this.filterList1[1].ElectricityBaseNumber = Data.ElectricityBaseNumber
          this.filterList1[2].GasBaseNumber = Data.GasBaseNumber
        } else {
          this.updateStatus = true // KeyID大于0， 保存时为修改状态
          this.ruleForm.DefaultPrepayment = Data.DefaultPrepayment || ''
          this.ruleForm.DefaultAgreeRemoveDate = dateFormat(Data.DefaultAgreeRemoveDate)
          this.ruleForm.DefaultReturnMonry = Data.DefaultReturnMonry || ''
          this.TenBankName = Data.TenBankName // 户名
          this.OpenBankName = Data.OpenBankName // 开户行
          this.filterList1[0].WaterBaseNumber = Data.WaterBaseNumber || ''
          this.filterList1[0].WaterEndNumber = Data.WaterEndNumber || ''
          this.filterList1[0].WaterMoney = Data.WaterMoney || ''
          this.filterList1[0].WaterIsSettle = Data.WaterIsSettle.toString()
          this.filterList1[1].ElectricityBaseNumber = Data.ElectricityBaseNumber || ''
          this.filterList1[1].ElectricityEndNumber = Data.ElectricityEndNumber || ''
          this.filterList1[1].ElectricityMoney = Data.ElectricityMoney || ''
          this.filterList1[1].ElectricityIsSettle = Data.ElectricityIsSettle.toString()
          this.filterList1[2].GasBaseNumber = Data.GasBaseNumber || ''
          this.filterList1[2].GasEndNumber = Data.GasEndNumber || ''
          this.filterList1[2].GasMoney = Data.GasMoney || ''
          this.filterList1[2].GasIsSettle = Data.GasIsSettle.toString()
          this.filterList2[0].NetWorkDate = [dateFormat(Data.NetWorkStartDate), dateFormat(Data.NetWorkEndDate)]
          this.filterList2[0].NetWorkIsSettle = Data.NetWorkIsSettle.toString()
          this.filterList2[0].NetWorkMoney = Data.NetWorkMoney || ''
          this.filterList2[1].ManageDate = [dateFormat(Data.ManageStartDate), dateFormat(Data.ManageEndDate)]
          this.filterList2[1].ManageIsSettle = Data.ManageIsSettle.toString()
          this.filterList2[1].ManageMoney = Data.ManageMoney || ''
          this.filterList2[2].CleanDate = [dateFormat(Data.CleanStartDate), dateFormat(Data.CleanEndDate)]
          this.filterList2[2].CleanIsSettle = Data.CleanIsSettle.toString()
          this.filterList2[2].CleanMoney = Data.CleanMoney || ''
          this.filterList3[0].DoorCardCount = Data.DoorCardCount || ''
          this.filterList3[0].WaterCardCount = Data.WaterCardCount || ''
          this.filterList3[0].ElecCardCount = Data.ElecCardCount || ''
          this.filterList3[0].KeyCount = Data.KeyCount || ''
          this.filterList3[1].KeyPlacement = Data.KeyPlacement
          this.filterList4[0].ExpireLiveDay = Data.ExpireLiveDay || ''
          this.filterList4[0].ExpireLiveDayMoney = Data.ExpireLiveDayMoney || ''
          this.filterList4[0].DefaultMoney = Data.DefaultMoney || ''
          this.filterList5 = Data.Equipment
          this.RepairMoney = Data.RepairMoney || ''
          this.HouseRent = Data.HouseRent
          this.HouseDeposit = Data.HouseDeposit
          this.NeedPay = Data.NeedPay
          this.ActualReceive = Data.ActualReceive
          this.PaymentDay = dateFormat(Data.PaymentDay)
          this.BankAccount = Data.BankAccount
          this.TenSignInfo = Data.TenSignInfo
          this.TenantName = Data.TenantName
          this.TenantCard = Data.TenantCard
          this.TenantPhone = Data.TenantPhone
          this.ContractStartDate = Data.ContractStartDate
          this.CheckOutDate = Data.CheckOutDate
          this.SalesmanSignInfo = Data.SalesmanSignInfo
          this.HouseName = Data.HouseName
          this.CompanyName = Data.CompanyName
          this.ManagerName = Data.ManagerName
          this.EmployeeName = Data.EmployeeName
          this.TenantCard = Data.TenantCard
        }
      }
      console.log('res:', res)
    }).catch(() => {
      this.detailLoading = false
    })
    if (this.checkoutType === 0) {
      this.stepList.splice(0, 1)
    }
  },
  methods: {
    next(index) {
      this.$refs.steps.nextStep()
    },
    prev() {
      this.$refs.steps.prevStep()
    },
    // 删除当前行
    handleDelete(index, row) {
      this.filterList5.splice(index, 1)
    },
    // 添加设备
    addEquipment() {
      this.isAddRow = true
      this.currEquipmentName = ''
      this.filterList5.push({
        id: Math.random(),
        EquipmentName: '',
        EquipmentState: 1
      })
      this.lastIndex = this.filterList5[this.filterList5.length - 1].id
      // setTimeout(() => {
      //   this.$refs['addInput'].focus()
      // }, 10)
    },
    saveRow(row) {
      debugger
      if (this.currEquipmentName === '') {
        return
      }
      this.isAddRow = false
      row.EquipmentName = this.currEquipmentName
    },
    handleCommunitySelect(item, row) {
      row.EquipmentName = item
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        cb(this.defaultEqu.filter(x => {
          return x.indexOf(queryString) !== -1
        }))
      } else {
        cb(this.defaultEqu)
      }
    },
    // (新增、修改)合同
    handleSaveInfo() {
      // updateStatus 为 true 则修改， 否则新增
      //
      const ID = this.KeyID !== 0 ? this.KeyID : this.query.KeyID
      const apiRequest = this.updateStatus === true ? UpdateTenCheckOutAgreement : InsertTenCheckOutAgreement
      this.SaveLoading = true
      apiRequest({
        KeyID: ID,
        TenContractID: this.query.KeyID,
        IsDefault: this.checkoutType,
        HouseName: this.query.HouseName,
        HouseID: this.query.HouseID,
        HouseKey: this.query.HouseKey,
        WaterEndNumber: this.filterList1[0].WaterEndNumber, // 水止数
        WaterMoney: this.filterList1[0].WaterMoney, // 水金额
        WaterIsSettle: this.filterList1[0].WaterIsSettle, // 水是否结清
        ElectricityEndNumber: this.filterList1[1].ElectricityEndNumber, // 电止数
        ElectricityMoney: this.filterList1[1].ElectricityMoney, // 电金额
        ElectricityIsSettle: this.filterList1[1].ElectricityIsSettle, // 电是否结清
        GasEndNumber: this.filterList1[2].GasEndNumber, // 气止数
        GasMoney: this.filterList1[2].GasMoney, // 气金额
        GasIsSettle: this.filterList1[2].GasIsSettle, // 气是否结清
        NetWorkStartDate: this.filterList2[0].NetWorkDate[0], // 网开始日期
        NetWorkEndDate: this.filterList2[0].NetWorkDate[1], // 网截止日期
        NetWorkMoney: this.filterList2[0].NetWorkMoney, // 网金额
        NetWorkIsSettle: this.filterList2[0].NetWorkIsSettle, // 网是否结清
        ManageStartDate: this.filterList2[1].ManageDate[0], // 物管卫生开始日期
        ManageEndDate: this.filterList2[1].ManageDate[1], // 物管卫生截止日期
        ManageMoney: this.filterList2[1].ManageMoney, // 物管卫生金额
        ManageIsSettle: this.filterList2[1].ManageIsSettle, // 物管卫生是否结清
        CleanStartDate: this.filterList2[2].CleanDate[0], // 保洁费用开始日期
        CleanEndDate: this.filterList2[2].CleanDate[1], // 保洁费用截止日期
        CleanMoney: this.filterList2[2].CleanMoney, // 保洁费用金额
        CleanIsSettle: this.filterList2[2].CleanIsSettle, // 保洁费用是否结清
        DoorCardCount: this.filterList3[0].DoorCardCount, // 门卡张数
        WaterCardCount: this.filterList3[0].WaterCardCount, // 水卡张数
        ElecCardCount: this.filterList3[0].ElecCardCount, // 电卡张数
        KeyCount: this.filterList3[0].KeyCount, // 钥匙数量
        KeyPlacement: this.filterList3[1].KeyPlacement, // 钥匙放置处
        ExpireLiveDay: this.filterList4[0].ExpireLiveDay, // 到期多居住天数
        ExpireLiveDayMoney: this.filterList4[0].ExpireLiveDayMoney, // 到期多居住金额
        DefaultMoney: this.filterList4[0].DefaultMoney, // 违约退房金额
        Equipment: this.filterList5, // 添加设备列表
        RepairMoney: this.RepairMoney, // 维修共计金额
        HouseRent: this.HouseRent, // 房租
        HouseDeposit: this.HouseDeposit, // 房屋押金
        NeedPay: this.NeedPay, // 需支付费用
        ActualReceive: this.getActualReceive, // 收到实退
        PaymentDay: this.PaymentDay, // 款项打款日
        BankAccount: this.BankAccount, // 客户银行卡号
        TenSignInfo: this.TenSignInfo, // 租客签字
        TenantCard: this.TenantCard, // 租客身份证号
        TenantPhone: this.TenantPhone, // 租客电话号码
        ContractStartDate: this.ContractStartDate, // 合同起止日期
        CheckOutDate: this.CheckOutDate, // 退房当天日期
        SalesmanSignInfo: this.SalesmanSignInfo, // 退房人签字
        DefaultPrepayment: this.ruleForm.DefaultPrepayment, // 违约退房-水电气预付金
        DefaultAgreeRemoveDate: this.ruleForm.DefaultAgreeRemoveDate, // 违约退房-约定搬离日期
        DefaultReturnMonry: this.ruleForm.DefaultReturnMonry, // 违约退房-退还租金和押金
        TenBankName: this.TenBankName, // 户名
        OpenBankName: this.OpenBankName // 开户行
      }).then(res => {
        console.log('res:', res)
        this.SaveLoading = false
        this.updateStatus = true
        this.$refs['billsPreview'].open({
          contractID: this.query.KeyID
        })
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) { // 把列合并为行
      if (rowIndex % 2 !== 0) { //  首先筛选行数 1 ，3 ，5
        if (columnIndex === 1) { // 当列数为1，开始，
          return [1, 4] // 把 4 列合并为 1 行
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
