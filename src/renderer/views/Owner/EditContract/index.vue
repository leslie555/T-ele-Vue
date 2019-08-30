<template>
  <div class="app-container">
    <div class="panel edit-contract" v-loading="detailLoading">
      <steps-box :list="stepList" ref="steps" @change="stepChange">
        <template slot="1">
          <div class="panel-title">合同类型</div>
          <div class="panel-body form-item-md">
            <contract-tabs :index="currentContractIndex" :type="0"
                           @tab-change="tabChange" :disabled="IsInverseAudit||IsSafeEdit"></contract-tabs>
            <el-form :model="ContractInfo" :inline="true" :rules="rules.rule0" ref="ruleForm0" status-icon
                     class="step1"
                     :disabled="IsInverseAudit||IsSafeEdit"
                     label-width="140px">
              <div class="clearfix">
                <el-form-item label="选择合同模板" prop="ContractTemplateName"
                              v-if="ContractInfo.PaperType==0">
                  <el-select v-model="ContractInfo.ContractTemplateName" placeholder="请选择合同模板">
                    <el-option :label="item.ContractTemplateName" :value="item.ContractTemplateName"
                               v-for="(item,index) in ContractTemplate" :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="合同编号" prop="ContractNumber" v-else>
                  <el-input v-model="ContractInfo.ContractNumber" placeholder="请输入合同编号" maxlength="50"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="panel-title">房屋信息</div>
          <div class="panel-body form-item-sm">
            <el-form :model="CommunityInfo" :inline="true" :rules="rules.rule1" status-icon ref="ruleForm1"
                     class="step1"
                     :disabled="IsInverseAudit||!!query.SafeEdit"
                     label-width="140px">
              <div class="clearfix">
                <el-form-item label="小区" prop="CommunityName">
                  <el-autocomplete
                    popper-class="my-autocomplete"
                    v-model="CommunityInfo.CommunityName"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入小区名称搜索"
                    :maxlength="40"
                    @blur="handleBlurSelect"
                    @select="handleCommunitySelect">
                    <i class="el-icon-search el-input__icon" slot="suffix"></i>
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.CommunityName }}</div>
                      <span class="addr">{{ item.Location }}</span>
                    </template>
                  </el-autocomplete>
                </el-form-item>
                <el-form-item label="省市县" prop="CityCodeMark">
                  <el-cascader
                    expand-trigger="hover"
                    :options="CityData"
                    separator=""
                    :disabled="CommunityInfo.CommunityName==CommunityInfo.CommunityNameMark"
                    filterable
                    v-model="CommunityInfo.CityCodeMark">
                  </el-cascader>
                </el-form-item>
              </div>
              <div class="clearfix">
                <div id="owner-map" class="community-amap"></div>
              </div>
              <div class="clearfix form-item-lg">
                <el-form-item label="详细地址" prop="Location">
                  <el-input v-model="CommunityInfo.Location"
                            placeholder="请输入详细地址"
                            maxlength="50"
                            :disabled="CommunityInfo.CommunityName==CommunityInfo.CommunityNameMark"></el-input>
                </el-form-item>
              </div>
            </el-form>
            <el-form :model="HouseInfo" :inline="true" :rules="rules.rule2" status-icon ref="ruleForm2"
                     class="step1"
                     :disabled="IsInverseAudit||!!query.SafeEdit"
                     label-width="140px">
              <div class="clearfix">
                <el-form-item label="栋" prop="Building">
                  <el-input v-model="HouseInfo.Building"
                            maxlength="10"
                            placeholder="请输入几栋"></el-input>
                </el-form-item>
                <el-form-item label="单元" prop="UnitNumber">
                  <el-input v-model="HouseInfo.UnitNumber" placeholder="请输入几单元"
                            type="number"
                            min="1"
                            max="1000"
                            v-positive.int="HouseInfo.UnitNumber"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="房间号" prop="RoomNumber">
                  <el-input maxlength="10" v-model="HouseInfo.RoomNumber" placeholder="请输入房间号"></el-input>
                </el-form-item>
                <el-form-item label="建筑面积" prop="HouseArea">
                  <el-input v-model="HouseInfo.HouseArea" placeholder="请输入建筑面积"
                            type="number"
                            min="0"
                            max="10000"
                            v-positive="HouseInfo.HouseArea"></el-input>
                  <span class="contract-area">平方米</span>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="panel-title">业主信息</div>
          <div class="panel-body form-item-sm">
            <el-form :model="ContractInfo" :inline="true" :rules="rules.rule3" status-icon ref="ruleForm3"
                     class="step1"
                     label-width="140px">
              <div class="clearfix" v-for="(v,i) in OwnerInfos" :key="i">
                <el-form-item :label="`业主${i+1}: 姓名`" required class="form-item-xs">
                  <el-input v-model="v.OwnerName" placeholder="请输入业主姓名"
                            maxlength="10" :disabled="IsSafeEdit"></el-input>
                </el-form-item>
                <el-form-item label="电话" required label-width="100px">
                  <el-input v-model="v.OwnerPhone" placeholder="请输入业主电话" maxlength="20"
                            :disabled="IsSafeEdit"></el-input>
                </el-form-item>
                <el-form-item label="身份证" required label-width="120px">
                  <el-input v-model="v.OwnerIDCard" placeholder="请输入身份证号码"
                            maxlength="18" :disabled="IsSafeEdit"></el-input>
                </el-form-item>
                <el-button size="mini" class="owner-btn" type="primary" v-if="i==0" @click="handleOwnerAdd()">新增
                </el-button>
                <el-button size="mini" class="owner-btn" type="danger" v-if="OwnerInfos.length>1"
                           @click="handleOwnerDelete(i)">删除
                </el-button>
              </div>
              <div class="clearfix form-item-lg">
                <el-form-item label="通讯地址" prop="ContractAddress">
                  <el-input v-model="ContractInfo.ContractAddress" placeholder="请输入通讯地址"
                            maxlength="50" :disabled="IsSafeEdit"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="紧急联系人姓名" prop="EmergencyContactName">
                  <el-input v-model="ContractInfo.EmergencyContactName"
                            placeholder="请输入紧急联系人姓名" maxlength="10" :disabled="IsSafeEdit"></el-input>
                </el-form-item>
                <el-form-item label="紧急联系人电话" prop="EmergencyContactPhone">
                  <el-input v-model="ContractInfo.EmergencyContactPhone"
                            maxlength="11"
                            placeholder="请输入紧急联系人电话" :disabled="IsSafeEdit"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="获客渠道" prop="PassengerChannel">
                  <el-select v-model="ContractInfo.PassengerChannel" placeholder="请选择获客渠道">
                    <el-option
                      :label="item.Description"
                      :value="item.Value"
                      v-for="item in PassengerChannel"
                      :key="item.Value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="clearfix contract-agent">
                <el-checkbox v-model="ContractInfo.IsAgent" :disabled="IsSafeEdit">是否代办</el-checkbox>
              </div>
              <div class="clearfix" v-if="ContractInfo.IsAgent">
                <el-form-item label="代办人姓名" prop="AgentName">
                  <el-input v-model="ContractInfo.AgentName" placeholder="请输入代办人姓名"
                            maxlength="10" :disabled="IsSafeEdit"></el-input>
                </el-form-item>
                <el-form-item label="代办人电话" prop="AgentPhone">
                  <el-input v-model="ContractInfo.AgentPhone" placeholder="请输入代办人电话"
                            maxlength="11" :disabled="IsSafeEdit"></el-input>
                </el-form-item>
                <el-form-item label="代办人身份证" prop="AgentIDCard">
                  <el-input v-model="ContractInfo.AgentIDCard" placeholder="请输入代办人身份证"
                            maxlength="18" :disabled="IsSafeEdit"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="收款方式" prop="CollectionType">
                  <el-select v-model="ContractInfo.CollectionType" placeholder="请选择收款方式">
                    <el-option
                      :label="item.Description"
                      :value="item.Value"
                      v-for="item in PaymentMethod"
                      :key="item.Value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="clearfix"
                   v-if="ContractInfo.CollectionType==2||ContractInfo.CollectionType==3">
                <el-form-item label="收款人姓名" prop="ReceivePeopleName">
                  <el-input v-model="ContractInfo.ReceivePeopleName"
                            placeholder="请输入收款人姓名" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="收款账号" prop="ReceiveAccount">
                  <el-input v-model="ContractInfo.ReceiveAccount" placeholder="请输入收款账号"
                            maxlength="30"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix" v-if="ContractInfo.CollectionType==4">
                <div class="clearfix">
                  <el-form-item label="转款账户名称" prop="ReceiveAccount">
                    <el-input v-model="ContractInfo.ReceiveAccount"
                              placeholder="请输入转款账户名称" maxlength="30"></el-input>
                  </el-form-item>
                  <el-form-item label="银行账号" prop="BankAccount" class="form-item-md">
                    <el-input v-model="ContractInfo.BankAccount" placeholder="请输入银行账号"
                              @input="changeBankAccount"
                              maxlength="23"></el-input>
                  </el-form-item>
                </div>
                <div class="clearfix">
                  <el-form-item label="银行名称" prop="BankName">
                    <el-autocomplete
                      popper-class="my-autocomplete"
                      v-model="ContractInfo.BankName"
                      :fetch-suggestions="queryBankSearchAsync"
                      placeholder="请输入银行名称"
                      :maxlength="20"
                      @select="handleBankSelect">
                      <i class="el-icon-search el-input__icon" slot="suffix"></i>
                      <template slot-scope="{ item }">
                        <div class="name">{{ item }}</div>
                      </template>
                    </el-autocomplete>
                  </el-form-item>
                  <el-form-item label="开户行" prop="OpenBankName">
                    <el-input v-model="ContractInfo.OpenBankName" placeholder="请输入开户行"
                              maxlength="20"></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
            <div class="clearfix block-center contract-btn-box">
              <el-button type="primary" @click="next(0)">下一步</el-button>
            </div>
          </div>
        </template>
        <template slot="2">

          <div class="panel-title">托管信息</div>
          <div class="panel-body form-item-sm">
            <el-form :model="ContractInfo" :inline="true" :rules="rules.rule4" status-icon ref="ruleForm4"
                     class="step2"
                     label-width="140px" :disabled="IsSafeEdit">
              <div class="clearfix">
                <el-form-item label="托管时间" prop="HostTimeMark">
                  <date-picker-range
                    v-model="ContractInfo.HostTimeMark"
                    :day="1"
                    range-separator="至"
                    start-placeholder="托管开始日期"
                    end-placeholder="托管结束日期">
                  </date-picker-range>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="付款周期" prop="PayCycle">
                  <el-select v-model="ContractInfo.PayCycle" placeholder="请选择">
                    <el-option
                      :label="item.Description"
                      :value="item.Value"
                      v-for="item in PayCycle"
                      :key="item.Value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="ml-10">
                  <el-checkbox-group v-model="ContractInfo.StagingModelMark">
                    <el-checkbox :label="1" @change="StagingModelChange(1)">年付分期</el-checkbox>
                    <!--<el-checkbox :label="2" @change="StagingModelChange(2)">公司年付</el-checkbox>-->
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="拿房价格" prop="InitialPrice">
                  <el-input v-model="ContractInfo.InitialPrice" placeholder="请输入拿房价格"
                            min="0"
                            max="100000"
                            @blur="calcPrice"
                            v-positive="ContractInfo.InitialPrice"
                            type="number"></el-input>
                  <span class="ml-5">元</span>
                  <div class="el-form-item__error" v-show="showCalcPrice">
                    提示：该价格超过系统测算拿房价格
                  </div>
                </el-form-item>
                <el-form-item label="房屋押金">
                  <el-input v-model="ContractInfo.HouseDeposit" placeholder="请输入房屋押金"
                            min="0"
                            max="100000"
                            v-positive="ContractInfo.HouseDeposit"
                            type="number"></el-input>
                  <span class="ml-5">元</span>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="免租模式" prop="FreePay">
                  <el-select v-model="ContractInfo.FreePay" placeholder="请选择">
                    <el-option
                      :label="item.Description"
                      :value="item.Value"
                      v-for="item in FreePay"
                      :key="item.Value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="免租期限（根据免租模式）" prop="FreeDays" label-width="277px"
                              v-if="showFreeDays"
                              class="form-item-xs">
                  <el-input v-model="ContractInfo.FreeDays"
                            min="1"
                            max="100"
                            v-positive.int="ContractInfo.FreeDays"
                            type="number"></el-input>
                  <span>月</span>
                </el-form-item>
                <el-form-item class="form-item-md ml-40"
                              v-if="showBillPattern">
                  <el-radio-group v-model="ContractInfo.BillPattern">
                    <el-radio :label="1">{{BillPatternText[0]}}</el-radio>
                    <el-radio :label="2">{{BillPatternText[1]}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="clearfix" v-if="ContractInfo.FreePay==1">
                <el-form-item label="前置模式" prop="ForwardType">
                  <el-radio-group v-model="ContractInfo.ForwardType" @change="changeForwardType">
                    <el-radio :label="1" class="contract-pay-time form-item-xs">
                      <span class="contract-pay-time-span">免租前置先付</span>
                      <el-input v-model="ContractInfo.ForwardPrePayTheMonth"
                                min="0"
                                max="100"
                                v-positive.int="ContractInfo.ForwardPrePayTheMonth"
                                type="number"
                                :disabled="ContractInfo.ForwardType!=1"></el-input>
                      <span>个月</span>
                    </el-radio>
                    <el-radio :label="2" class="contract-pay-time form-item-xs">
                      <span class="contract-pay-time-span">免租前置第一年免</span>
                      <el-input v-model="ContractInfo.ForwardFirstYearTheMonth"
                                min="1"
                                max="100"
                                v-positive.int="ContractInfo.ForwardFirstYearTheMonth"
                                type="number"
                                :disabled="ContractInfo.ForwardType!=2"></el-input>
                      <span>个月</span>
                      <span class="ml-20">免租前置第二年免</span>
                      <el-input v-model="ContractInfo.ForwardSecondYearTheMonth"
                                min="1"
                                max="100"
                                v-positive.int="ContractInfo.ForwardSecondYearTheMonth"
                                type="number"
                                :disabled="ContractInfo.ForwardType!=2"></el-input>
                      <span>个月</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="clearfix form-item-xs contract-model">
                <el-form-item label="付款模式">
                  <el-checkbox-group v-model="ContractInfo.PayModelMark">
                    <el-checkbox :label="1" v-if="showPayModelFirst"
                                 @change="PayModelChange(1)">首付10%
                    </el-checkbox>
                    <el-checkbox :label="2" @change="PayModelChange(2)">第一年不付</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item class="ml-5" prop="NoPayMonth" v-if="showNoPayMonth">
                  <el-input v-model="ContractInfo.NoPayMonth"
                            min="1"
                            max="12"
                            v-positive.int="ContractInfo.NoPayMonth"
                            type="number"></el-input>
                  <span class="ml-5">月</span>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="少付金额">
                  <el-input v-model="ContractInfo.PayLessMoney"
                            min="0"
                            max="100000"
                            v-positive="ContractInfo.PayLessMoney"
                            type="number"></el-input>
                  <span class="ml-5">元</span>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="递增方式" prop="IncreaseType">
                  <el-select v-model="ContractInfo.IncreaseType" placeholder="请选择">
                    <el-option
                      :label="item.Description"
                      :value="item.Value"
                      v-for="item in IncreaseType"
                      :key="item.Value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <template v-if="ContractInfo.IncreaseType==2||ContractInfo.IncreaseType==3">
                  <el-form-item label="递增次数" prop="IncreaseFrequency" class="form-item-xs"
                                label-width="163px">
                    <el-select v-model="ContractInfo.IncreaseFrequency">
                      <el-option label="一次" :value="1"></el-option>
                      <el-option label="每年" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="form-item-xs ml-40" prop="IncreaseNum">
                    <span>第</span>
                    <el-input v-model="ContractInfo.IncreaseNum"
                              min="1"
                              max="100"
                              v-positive.int="ContractInfo.IncreaseNum"
                              type="number"></el-input>
                    <span>年</span>
                  </el-form-item>
                  <el-form-item class="form-item-xs ml-40" prop="IncreaseMoney">
                    <span>递增</span>
                    <el-input v-model="ContractInfo.IncreaseMoney"
                              min="0"
                              max="100000"
                              v-positive="ContractInfo.IncreaseMoney"
                              type="number"></el-input>
                    <span>{{ContractInfo.IncreaseType==3?'%':'元'}}/年</span>
                  </el-form-item>
                </template>
              </div>
              <div class="clearfix">
                <el-form-item label="最晚付款日" prop="PayTimeType">
                  <el-radio-group v-model="ContractInfo.PayTimeType" @change="changePayTime">
                    <el-radio :label="0" class="contract-pay-time">
                      <span>提前</span>
                      <el-input v-model="ContractInfo.PayDaysMark[0]"
                                min="0"
                                max="100"
                                v-positive.int="ContractInfo.PayDaysMark[0]"
                                type="number"
                                :disabled="ContractInfo.PayTimeType!=0"></el-input>
                      <span>天支付租金</span>
                    </el-radio>
                    <el-radio :label="1" class="contract-pay-time">
                      <span>固定</span>
                      <el-input v-model="ContractInfo.PayDaysMark[1]"
                                min="1"
                                max="31"
                                v-positive.int="ContractInfo.PayDaysMark[1]"
                                type="number"
                                :disabled="ContractInfo.PayTimeType!=1"></el-input>
                      <span>号支付租金（每期第一个月）</span>
                    </el-radio>
                    <el-radio :label="2" class="contract-pay-time">
                      <span>固定</span>
                      <el-input v-model="ContractInfo.PayDaysMark[2]"
                                min="1"
                                max="31"
                                v-positive.int="ContractInfo.PayDaysMark[2]"
                                type="number"
                                :disabled="ContractInfo.PayTimeType!=2"></el-input>
                      <span>号支付租金（每期提前一个月）</span>
                    </el-radio>
                    <el-radio :label="3" class="contract-pay-time">
                      <span>固定</span>
                      <el-input v-model="ContractInfo.PayDaysMark[3]"
                                min="1"
                                max="31"
                                v-positive.int="ContractInfo.PayDaysMark[3]"
                                type="number"
                                :disabled="ContractInfo.PayTimeType!=3"></el-input>
                      <span>号支付租金（每期延后一个月）</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-form>
            <div class="clearfix block-center contract-btn-box">
              <el-button type="primary" @click="prev(1)" class="mr-20">上一步</el-button>
              <el-button type="primary" class="mr-20" @click="createOrder('TemporaryStorage',2)" v-if="!IsSafeEdit"
                         :loading="orderLoading">暂存
              </el-button>
              <el-button type="primary" @click="next(1)" :loading="billLoading">下一步</el-button>
            </div>
          </div>
        </template>
        <template slot="3">
          <div class="panel-title">账单计划</div>
          <div class="panel-body">
            <bill-panel ref="billPanel" :data="BillList" :contract="ContractInfo" :type="0"
                        :disabled="IsSafeEdit"></bill-panel>
          </div>
          <div class="panel-title">
            <span>其他记账</span>
            <el-button class="ml-30" plain type="primary" @click="handleSettlementAdd" v-if="!IsSafeEdit">记一笔账
            </el-button>
          </div>
          <div class="panel-body">
            <book-keeping :list="BookKeep" :disabled="IsSafeEdit"></book-keeping>
          </div>
          <div class="clearfix block-center contract-btn-box">
            <el-button type="primary" @click="prev(2)" class="mr-20">上一步</el-button>
            <el-button type="primary" class="mr-20" @click="createOrder('TemporaryStorage',3)" v-if="!IsSafeEdit"
                       :loading="orderLoading">暂存
            </el-button>
            <el-button type="primary" @click="next(2)">下一步</el-button>
          </div>
        </template>
        <template slot="4">
          <el-form :model="ContractInfo" :inline="true" :rules="rules.rule5" status-icon ref="ruleForm5"
                   class="step2"
                   label-width="140px">
            <div class="panel-title">交割信息</div>
            <div class="panel-body">
              <div class="clearfix form-item-xs">
                <el-form-item label="水表读数">
                  <el-input v-model="ContractInfo.WaterNumber"
                            min="0"
                            v-positive="ContractInfo.WaterNumber"
                            type="number"
                            :disabled="IsSafeEdit"
                            max="1000000"
                  ></el-input>
                  <span class="ml-5">吨</span>
                </el-form-item>
                <el-form-item label="电表读数">
                  <el-input v-model="ContractInfo.ElectricityNumber"
                            min="0"
                            v-positive="ContractInfo.ElectricityNumber"
                            type="number"
                            :disabled="IsSafeEdit"
                            max="1000000"
                  ></el-input>
                  <span class="ml-5">度</span>
                </el-form-item>
                <el-form-item label="天然气">
                  <el-input v-model="ContractInfo.GasNumber"
                            min="0"
                            v-positive="ContractInfo.GasNumber"
                            type="number"
                            :disabled="IsSafeEdit"
                            max="1000000"
                  ></el-input>
                  <span class="ml-5">立方米</span>
                </el-form-item>
              </div>
              <input-number :list="ContractEquipments" ref="inputNumber" :disabled="IsSafeEdit"></input-number>
            </div>
            <div class="panel-title">其他信息</div>
            <div class="panel-body form-item-sm">
              <div class="clearfix">
                <el-form-item label="水卡号">
                  <el-input v-model="ContractInfo.WaterCardNumber" :disabled="IsSafeEdit" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="气卡号">
                  <el-input v-model="ContractInfo.GasCardNumber" :disabled="IsSafeEdit" maxlength="20"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="电卡号">
                  <el-input v-model="ContractInfo.ElectricityCardNumber" :disabled="IsSafeEdit"
                            maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="门卡">
                  <el-input v-model="ContractInfo.DoorCardNumber" :disabled="IsSafeEdit" maxlength="20"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix form-item-lg">
                <el-form-item label="附加条款">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8}"
                    placeholder="请输入附加条款"
                    maxlength="400"
                    :disabled="IsSafeEdit"
                    v-model="ContractInfo.ContractRemark">
                  </el-input>
                </el-form-item>
              </div>
              <upload-file
                ref="uploadFile"
                title="上传附件"
                :img-list="ImageUpload"
                notice="请上传业主证件正反面，房屋所有权证和证明，如有代办人需代办人证件照，请使用png,jpg,jpeg,gif等格式图片上传"
              ></upload-file>
              <div class="clearfix">
                <el-form-item label=" ">
                  <el-button plain type="primary" @click="createOrder('Preview')" :loading="orderLoading">预览合同
                  </el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div class="clearfix block-center contract-btn-box">
            <el-button type="primary" @click="prev()" class="mr-20">上一步</el-button>
            <template v-if="!IsSafeEdit">
              <el-button type="primary" class="mr-20" @click="createOrder('TemporaryStorage',4)"
                         :loading="orderLoading">暂存
              </el-button>
              <el-button type="primary" @click="createOrder('SignUp')" v-show="ContractInfo.PaperType==0"
                         :loading="orderLoading">
                现场签字
              </el-button>
              <el-button type="primary" @click="createOrder('Save')" v-show="ContractInfo.PaperType==1"
                         :loading="orderLoading">
                保存
              </el-button>

              <el-button type="primary" class="ml-20" @click="createOrder('SubmitAudit')"
                         v-show="ContractInfo.FirstInputTerminal===1&&OwnerContractOperate.IsSigned==1"
                         :loading="orderLoading">提交审核
              </el-button>
            </template>
            <el-button type="primary" @click="createOrder('Save')" v-else
                       :loading="orderLoading">
              保存修改
            </el-button>
          </div>
        </template>
      </steps-box>
    </div>
    <settlement ref="settlement" :bus-type="2" :api-type="0" @success="checkOutSuccess"></settlement>
  </div>
</template>
<style scoped lang="scss">
  @import "style";
</style>
<style lang="scss">
  @import "global-style";
</style>
<script>
  import {
    editOwnerContract,
    getContractDetail,
    getOwnerBill,
    insertOwnerContract,
    safeEditOwnerContract,
    searchCommunityList
  } from '../../../api/owner'
  import { ShowCompanyinfoCityCode, StateOwnerContract } from '../../../api/system'
  import StepsBox from '../../../components/StepsBox'
  import { BillPanel, BookKeeping, ContractTabs, InputNumber } from './components'
  import { Settlement, UploadFile } from '../../../components'
  import { validatePhone } from '../../../utils/validate/rulevalidator'
  import { CityData, getCityNameByCode, getCodeArrByCode } from '../../../utils/CityData'
  import uuid from '../../../utils/uuid'
  import { scrollToError } from '../../../utils/scrollToError'
  import { mapActions } from 'vuex'

  export default {
    components: {
      StepsBox,
      ContractTabs,
      InputNumber,
      UploadFile,
      BillPanel,
      BookKeeping,
      Settlement
    },
    computed: {
      PassengerChannel() {
        const PassengerChannel = this.$EnumData.getEnumListByKey('PassengerChannel').slice()
        PassengerChannel[0].Description = '无'
        return PassengerChannel
      },
      PaymentMethod() {
        const PaymentMethod = this.$EnumData.getEnumListByKey('PaymentMethod').slice()
        PaymentMethod.shift()
        return PaymentMethod
      },
      PayCycle() {
        return this.$EnumData.getEnumListByKey('PayCycle')
      },
      FreePay() {
        const FreePay = this.$EnumData.getEnumListByKey('FreePay').slice()
        FreePay.splice(2, 1) // 删除掉免租后置
        return FreePay
      },
      BillPattern() {
        return this.$EnumData.getEnumListByKey('BillPattern')
      },
      IncreaseType() {
        const IncreaseType = this.$EnumData.getEnumListByKey('IncreaseType').slice()
        IncreaseType.splice(1, 1) // 删除掉不规则递增
        return IncreaseType
      },
      showPayModelFirst() {
        // 季付和 免租模式为无或者平摊到每年才能选择10%
        const flag = this.ContractInfo.PayCycle === 1 && (this.ContractInfo.FreePay === 0 || this.ContractInfo.FreePay === 3)
        if (!flag) return false
        // 3年及以上租期才能选择 10%
        let start = this.$dateFormat(this.ContractInfo.HostTimeMark[0], 'yyyy/MM/dd') || '1970/01/01'
        let end = this.$dateFormat(this.ContractInfo.HostTimeMark[1], 'yyyy/MM/dd') || '1970/01/01'
        start = new Date(start)
        end = new Date(end)
        start.setFullYear(start.getFullYear() + 3)
        start.setDate(start.getDate() - 1)
        if (start.getTime() > end.getTime()) {
          return false
        }
        return true
      },
      showBillPattern() {
        return this.ContractInfo.FreePay === 3 && this.ContractInfo.PayCycle !== 0
      },
      showNoPayMonth() {
        // 选择第一年不付才显示少付月份
        const index = this.ContractInfo.PayModelMark.findIndex(v => v === 2)
        return index !== -1
      },
      showFreeDays() {
        return this.ContractInfo.FreePay !== 0 && this.ContractInfo.FreePay !== 1 || (this.ContractInfo.FreePay === 1 && this.ContractInfo.ForwardType !== 2)
      },
      BillPatternText() {
        switch (this.ContractInfo.PayCycle) {
          case 1:
            return ['3个月付2个月', '4个月付3个月']
          case 2:
            return ['6个月付5个月', '7个月付6个月']
          case 3:
            return ['12个月付11个月', '13个月付12个月']
        }
      },
      IsSafeEdit() {
        return !!this.query.SafeEdit && false
      }
    },
    data() {
      const validatePayTime = (rule, value, callback) => {
        if (value === 0 && this.ContractInfo.PayDaysMark[0] === '') {
          callback(new Error('请填写天数'))
        } else if (value === 1 && !this.ContractInfo.PayDaysMark[1]) {
          callback(new Error('请填写日期'))
        } else if (value === 2 && !this.ContractInfo.PayDaysMark[2]) {
          callback(new Error('请填写日期'))
        } else if (value === 3 && !this.ContractInfo.PayDaysMark[3]) {
          callback(new Error('请填写日期'))
        } else {
          callback()
        }
      }
      const validateForward = (rule, value, callback) => {
        if (value === 1 && this.ContractInfo.ForwardPrePayTheMonth === '') {
          callback(new Error('请填写前置规则'))
        } else if (value === 2 && (!this.ContractInfo.ForwardFirstYearTheMonth || !this.ContractInfo.ForwardSecondYearTheMonth)) {
          callback(new Error('请填写前置规则'))
        } else {
          callback()
        }
      }
      return {
        mainCityCode: -1,
        mainCityName: '成都',
        mapObj: {},
        mapSearchResult: {},
        mapMark: null,
        showCalcPrice: false,
        detailLoading: false,
        billLoading: false,
        orderLoading: false,
        IsInverseAudit: false,
        currentContractIndex: 0,
        query: this.$route.query, // KeyID,Renew,SafeEdit,EntranceID
        isEdit: this.$route.name === 'OwnerEditContract',
        CityData,
        stepList: [
          {
            title: '完善房源信息'
          }, {
            title: '完善托管信息'
          }, {
            title: '生成账单计划'
          }, {
            title: '完善附加计划'
          }
        ],
        ContractInfo: {
          HostTimeMark: [],
          PayDaysMark: ['0', '15', '15', '15'],
          PayTimeType: 0,
          PayModelMark: [],
          StagingModelMark: [],
          PayCycle: 0,
          FreePay: 0,
          IncreaseType: 0,
          IncreaseFrequency: 1,
          BillPattern: 1,
          ForwardType: 1,
          PaperType: 0,
          CollectionType: 1,
          PassengerChannel: 0
        }, // 合同信息
        HouseInfo: {}, // 房源信息
        CommunityInfo: {
          Location: '',
          CityCodeMark: [],
          CommunityName: ''
        }, // 小区信息
        ContractEquipments: [], // 房屋设备信息
        ImageUpload: [],
        ContractTemplate: [], // 合同模板
        BillList: [], // 账单信息
        BookKeep: [], // 其他记账
        OwnerInfos: [], // 业主列表
        OwnerContractOperate: {}, // 合同操作表
        oldCommunityList: [], // 上次搜索
        oldCommunitySearchKey: '', // 上次搜索
        cloneData: {
          ImageUpload: [],
          BookKeep: [],
          ContractEquipments: [],
          OwnerInfos: []
        }, // clone的旧数据
        billForm: {}, // 账单表单 用于对比是否修改了账单
        bankList: ['中国工商银行', '中国农业银行', '中国银行', '中国建设银行', '交通银行', '中国邮政储蓄银行', '招商银行', '浦发银行', '中信银行', '中国光大银行', '华夏银行', '中国民生银行', '广发银行', '兴业银行', '平安银行', '浙商银行', '恒丰银行', '渤海银行'],
        rules: {
          rule0: {
            ContractTemplateName: [
              { required: true, message: '请选择合同模板', trigger: 'change' }
            ],
            ContractNumber: [
              { required: true, message: '请输入合同编号', trigger: 'blur' }
            ]
          },
          rule1: {
            CommunityName: [
              { required: true, message: '请输入或选择小区名称', trigger: 'change' }
            ],
            CityCodeMark: [
              { required: true, message: '请选择地区', trigger: 'change' }
            ],
            Location: [
              { required: true, message: '请输入详细地址', trigger: 'blur' }
            ]
          },
          rule2: {
            Building: [
              { required: true, message: '请输入栋', trigger: 'blur' }
            ],
            UnitNumber: [
              { required: false }
            ],
            RoomNumber: [
              { required: true, message: '请输入房间号', trigger: 'blur' }
            ],
            HouseArea: [
              { required: false }
            ]
          },
          rule3: {
            OwnerName: [
              { required: true, message: '请输入业主姓名', trigger: 'blur' }
            ],
            OwnerPhone: [
              { required: true, message: '请输入业主电话', trigger: 'blur' }
            ],
            OwnerIDCard: [
              { required: true, message: '请输入业主身份证号', trigger: 'blur' }
            ],
            ContractAddress: [
              { required: false }
            ],
            EmergencyContactName: [
              { required: false }
            ],
            EmergencyContactPhone: [
              { validator: validatePhone, trigger: 'blur' }
            ],
            PassengerChannel: [
              { required: true, message: '请选择获客渠道', trigger: 'change' }
            ],
            AgentName: [
              { required: true, message: '请输入代办人姓名', trigger: 'blur' }
            ],
            AgentPhone: [
              { required: true, message: '请输入代办人电话', trigger: 'blur' },
              { validator: validatePhone, trigger: 'blur' }
            ],
            AgentIDCard: [
              { required: true, message: '请输入代办人身份证', trigger: 'blur' }
            ],
            CollectionType: [
              { required: true, message: '请选择收款方式', trigger: 'change' }
            ],
            ReceivePeopleName: [
              { required: true, message: '请输入收款人姓名', trigger: 'blur' }
            ],
            ReceiveAccount: [
              { required: true, message: '请输入收款人', trigger: 'blur' }
            ],
            BankAccount: [
              { required: true, message: '请输入银行账号', trigger: 'blur' }
            ],
            BankName: [
              { required: true, message: '请输入银行名称', trigger: 'change' }
            ],
            OpenBankName: [
              { required: true, message: '请输入开户行', trigger: 'blur' }
            ]
          },
          rule4: {
            HostTimeMark: [
              { required: true, message: '请完善托管时间', trigger: 'change' }
            ],
            PayCycle: [
              { required: true, message: '请选择付款周期', trigger: 'change' }
            ],
            InitialPrice: [
              { required: true, message: '请输入拿房价格', trigger: 'blur' }
            ],
            NoPayMonth: [
              { required: true, message: '请输入少付月份', trigger: 'blur' }
            ],
            FreePay: [
              { required: true, message: '请选择免租模式', trigger: 'change' }
            ],
            FreeDays: [
              { required: true, message: '请输入免租期限', trigger: 'blur' }
            ],
            IncreaseType: [
              { required: true, message: '请选择递增方式', trigger: 'change' }
            ],
            IncreaseFrequency: [
              { required: true, message: '请输入递增次数', trigger: 'blur' }
            ],
            IncreaseNum: [
              { required: true, message: '请输入递增第几年开始', trigger: 'blur' }
            ],
            IncreaseMoney: [
              { required: true, message: '请输入递增金额', trigger: 'blur' }
            ],
            PayTimeType: [
              { validator: validatePayTime, trigger: 'change' }
            ],
            ForwardType: [
              { validator: validateForward, trigger: 'blur' }
            ]
          },
          rule5: {}
        }
      }
    },
    created() {
      this.fetchData()
      // if (this.query.SafeEdit) {
      //   this.$notify.warning({
      //     title: '提示',
      //     message: '只能修改收款信息以及图片'
      //   })
      // }
    },
    methods: {
      initMap(type = 0) {
        if (this.mainCityCode === -1) {
          ShowCompanyinfoCityCode({}).then(({ Data }) => {
            this.mainCityCode = Data || '510102' // 如果没有就默认成都
            const cityArr = getCityNameByCode(this.mainCityCode, 1)
            if (cityArr[1] === '市辖区') {
              this.mainCityName = cityArr[0]
            } else {
              this.mainCityName = cityArr[1]
            }
            this.initMap(type)
          })
          return
        }
        window.initMap = () => {
          this.mapObj = new AMap.Map('owner-map')
          this.mapObj.on('click', this.mapClick)
          if (type === 1) {
            this.setCenterAndMark()
          } else if (type === 2) {
            this.searchMapKey(1)
          }
        }
        const url = 'https://webapi.amap.com/maps?v=1.4.14&key=283ff43b64b87f3c7835eb3b73f96e04&callback=initMap'
        const jsapi = document.createElement('script')
        jsapi.charset = 'utf-8'
        jsapi.src = url
        document.head.appendChild(jsapi)
      },
      mapClick(e) {
        this.CommunityInfo.Longitude = e.lnglat.lng
        this.CommunityInfo.Latitude = e.lnglat.lat
        this.setCenterAndMark()
      },
      searchMapKey(type = 0) {
        if (!this.CommunityInfo.CommunityName) return
        AMap.plugin('AMap.Autocomplete', () => {
          const autoOptions = {
            city: this.mainCityName,
            citylimit: true,
            datatype: 'poi'
          }
          var autoComplete = new AMap.Autocomplete(autoOptions)
          autoComplete.search(this.CommunityInfo.CommunityName, (status, result) => {
            // 搜索成功时，result即是对应的匹配数据
            if (status === 'complete' && result.info === 'OK') {
              const item = result.tips[0]
              this.mapSearchResult = item
              this.$nextTick(() => {
                this.CommunityInfo.CityCode = item.adcode
                this.CommunityInfo.CityCodeMark = getCodeArrByCode(item.adcode)
                this.CommunityInfo.CityName = item.district
                this.CommunityInfo.Longitude = item.location && item.location.lng
                this.CommunityInfo.Latitude = item.location && item.location.lat
                // 之前没有经纬度的搜索的重置，点击的不重置
                if (type === 1) {
                  if (typeof item.address === 'string') {
                    this.CommunityInfo.Location = item.address
                  }
                }
                this.setCenterAndMark()
              })
            }
          })
        })
      },
      setCenterAndMark() {
        if (this.mapMark) {
          this.mapObj.remove(this.mapMark)
        }
        // 设置地图中心点 添加标注
        if (this.CommunityInfo.Longitude) {
          this.mapMark = new AMap.Marker({
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            position: [this.CommunityInfo.Longitude, this.CommunityInfo.Latitude]
          })
          this.mapObj.setZoomAndCenter(16, [this.CommunityInfo.Longitude, this.CommunityInfo.Latitude])
          this.mapObj.add(this.mapMark)
        }
      },
      calcPrice() {
        this.$nextTick(() => {
          console.log(this.ContractInfo.InitialPrice)
          if (!this.CommunityInfo.KeyID || !this.ContractInfo.InitialPrice) {
            this.showCalcPrice = false
            return
          }
          StateOwnerContract({
            CommunityID: this.CommunityInfo.KeyID,
            TakeRoom: this.ContractInfo.InitialPrice
          }).then(({ BusCode }) => {
            if (BusCode === 1) {
              this.showCalcPrice = true
            } else {
              this.showCalcPrice = false
            }
          })
        })
      },
      ...mapActions([
        'delView',
        'delCachedView',
        'setOwnerPreview'
      ]),
      fetchData() {
        console.log(this.query)
        // this.detailLoading = true
        getContractDetail({
          ownerID: this.query.KeyID || 0,
          entranceID: this.query.EntranceID || 0,
          type: 1
        }).then(({ Data }) => {
          this.detailLoading = false
          this.initPageData(Data)
        })
      },
      handleOwnerDelete(i) {
        this.OwnerInfos.splice(i, 1)
      },
      handleOwnerAdd(i) {
        this.OwnerInfos.push({
          OwnerName: '',
          OwnerPhone: '',
          OwnerIDCard: ''
        })
      },
      initPageData({ ContractTemplate, OwnerContract, HouseInfo, CommunityInfo, ImageUpload, OwnerEquipments, OwnerBill, BookKeep, OwnerContractOperate, OwnerInfos }) {
        this.ContractTemplate = ContractTemplate || []
        // this.ContractInfo.ContractTemplateName = ContractTemplate[0].ContractTemplateName // 默认合同模板
        this.ContractInfo = { ...this.ContractInfo, ContractTemplateName: ContractTemplate[0].ContractTemplateName }
        /* 续签删除账期和记账 */
        if (this.query.Renew) {
          OwnerBill = []
          BookKeep = []
        }
        if (HouseInfo) {
          this.HouseInfo = HouseInfo
        }
        if (OwnerEquipments) {
          this.ContractEquipments = OwnerEquipments
          this.cloneData.ContractEquipments = this.$deepCopy(OwnerEquipments)
        }
        if (ImageUpload) {
          this.ImageUpload = ImageUpload
          this.cloneData.ImageUpload = this.$deepCopy(ImageUpload)
        }
        if (BookKeep && BookKeep.length > 0) {
          this.BookKeep = BookKeep
          this.cloneData.BookKeep = this.$deepCopy(BookKeep)
        }
        if (OwnerBill && OwnerBill.length > 0) {
          this.$refs.billPanel.initData(OwnerBill)
        }
        if (CommunityInfo) {
          this.handleCommunitySelect(CommunityInfo)
          if (this.CommunityInfo.Longitude) {
            this.initMap(1)
          } else {
            this.initMap(2)
          }
        } else {
          this.initMap()
        }
        if (OwnerContractOperate) {
          this.OwnerContractOperate = OwnerContractOperate
        }
        if (OwnerContract) {
          this.ContractInfo = { ...this.ContractInfo, ...OwnerContract }
          // 合同模板可能是空
          if (!this.ContractInfo.ContractTemplateName) {
            this.ContractInfo.ContractTemplateName = ContractTemplate[0].ContractTemplateName
          }
          // 收款方式
          if (!this.ContractInfo.CollectionType) {
            this.ContractInfo.CollectionType = 1
          }
          // 是否反审核合同
          if (OwnerContractOperate && OwnerContractOperate.IsInverseAudit === 1 && !this.query.Renew) {
            this.IsInverseAudit = true
          }
          // 合同编号重置
          if (this.query.Renew) {
            this.ContractInfo.ContractNumber = ''
          }
          // 合同类型
          this.currentContractIndex = this.ContractInfo.PaperType
          // 代理人信息
          this.ContractInfo.IsAgent = this.ContractInfo.IsAgent === 1
          // 托管时间
          this.ContractInfo.HostStartTime = this.$dateFormat(this.ContractInfo.HostStartTime, 'yyyy-MM-dd 00:00:00')
          this.ContractInfo.HostEndTime = this.$dateFormat(this.ContractInfo.HostEndTime, 'yyyy-MM-dd 00:00:00')
          if (this.query.Renew) {
            this.ContractInfo.HostTimeMark = [this.ContractInfo.HostEndTime, '']
          } else {
            // 暂存可能没有时间
            if (!this.ContractInfo.HostStartTime && !this.ContractInfo.HostEndTime) {
              this.ContractInfo.HostTimeMark = []
            } else {
              this.ContractInfo.HostTimeMark = [this.ContractInfo.HostStartTime, this.ContractInfo.HostEndTime]
            }
          }
          // 最晚付款日
          this.ContractInfo.PayDaysMark[this.ContractInfo.PayTimeType] = this.ContractInfo.PayDays
          // 分期模式
          this.ContractInfo.StagingModelMark = [this.ContractInfo.StagingModel]
          // 付款模式
          this.ContractInfo.PayModelMark = [this.ContractInfo.PayModel]
          this.saveBillForm()
        }
        if (!OwnerInfos || OwnerInfos && OwnerInfos.length === 0) {
          this.OwnerInfos.push({
            OwnerName: this.ContractInfo.OwnerName,
            OwnerPhone: this.ContractInfo.OwnerPhone,
            OwnerIDCard: this.ContractInfo.OwnerIDCard
          })
          if (this.isEdit) {
            // 兼容之前的数据，、、、不用 没得keyid 不会有bug
            // this.cloneData.OwnerInfos = this.$deepCopy(this.OwnerInfos)
          }
        } else {
          this.OwnerInfos = OwnerInfos
          this.cloneData.OwnerInfos = this.$deepCopy(OwnerInfos)
        }
      },
      saveBillForm() {
        const keys = [
          'HostStartTime',
          'HostEndTime',
          'InitialPrice',
          'HouseDeposit',
          'PayCycle',
          'PayModel',
          'PayModelName',
          'PayLessMoney',
          'NoPayMonth',
          'FreePay',
          'FreeDays',
          'BillPattern',
          'IncreaseType',
          'IncreaseFrequency',
          'IncreaseNum',
          'IncreaseMoney',
          'PayTimeType',
          'PayDays',
          'StagingModel',
          'ForwardType',
          'ForwardPrePayTheMonth',
          'ForwardFirstYearTheMonth',
          'ForwardSecondYearTheMonth'
        ]
        keys.map(v => {
          this.billForm[v] = this.ContractInfo[v]
        })
      },
      resetBillForm() {
        if (this.ContractInfo.BillPattern === 0) {
          this.ContractInfo.BillPattern = 1
        }
        if (this.ContractInfo.ForwardType === 0) {
          this.ContractInfo.ForwardType = 1
        }
        if (this.ContractInfo.IncreaseFrequency === 0) {
          this.ContractInfo.IncreaseFrequency = 1
        }
      },
      stepChange(step) {
        if (step === 2) {
          this.resetBillForm()
        }
      },
      next(index) {
        let flag = -1
        switch (index) {
          case 0:
            this.$refs['ruleForm0'].validate((a, b) => {
              if (!a) {
                scrollToError(b, this.$refs['ruleForm0'], -10)
                flag = 0
              }
            })
            this.$refs['ruleForm1'].validate((a, b) => {
              if (!a) {
                flag === -1 && scrollToError(b, this.$refs['ruleForm1'], -10)
                flag = 1
              }
            })
            this.$refs['ruleForm2'].validate((a, b) => {
              if (!a) {
                flag === -1 && scrollToError(b, this.$refs['ruleForm2'], -10)
                flag = 2
              }
            })
            this.$refs['ruleForm3'].validate((a, b) => {
              if (!a) {
                flag === -1 && scrollToError(b, this.$refs['ruleForm3'], -10)
                flag = 3
              }
            })
            if (this.OwnerInfos.some(v => {
              return !v.OwnerName || !v.OwnerPhone || !v.OwnerIDCard
            })) {
              this.$message.error('请填写完成业主相关信息！')
              return
            }
            if (flag === -1) {
              this.$refs.steps.nextStep()
            }
            break
          case 1:
            this.createBill()
            break
          case 2:
            this.$refs.billPanel.validate().then(() => {
              this.$refs.steps.nextStep()
            }).catch(() => {
              this.$message.error('请检查账单信息是否填写完整！')
            })
            break
          default:
            this.$refs.steps.nextStep()
        }
      },
      prev() {
        this.$refs.steps.prevStep()
      },
      tabChange(index, val) {
        this.currentContractIndex = index
        this.ContractInfo.PaperType = val
        this.$refs.ruleForm0.clearValidate()
      },
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
      queryBankSearchAsync(queryString, cb) {
        const arr = []
        if (!queryString) {
          cb(this.bankList)
        } else {
          this.bankList.map((v) => {
            if (v.indexOf(queryString) !== -1) {
              arr.push(v)
            }
          })
          cb(arr)
        }
      },
      handleCommunitySelect(item) {
        this.CommunityInfo = {
          CityCode: item.CityCode,
          CityName: item.CityName,
          CommunityName: item.CommunityName,
          Longitude: item.Longitude,
          Latitude: item.Latitude,
          Location: item.Location,
          KeyID: item.KeyID
        }
        this.CommunityInfo.CommunityNameMark = item.CommunityName
        this.CommunityInfo.CityCodeMark = getCodeArrByCode(this.CommunityInfo.CityCode)
        this.$refs.ruleForm1.clearValidate()
      },
      handleBankSelect(item) {
        this.ContractInfo.BankName = item
      },
      handleBlurSelect() {
        if (this.CommunityInfo.CommunityNameMark !== this.CommunityInfo.CommunityName) {
          this.CommunityInfo.KeyID = ''
          this.searchMapKey()
        }
      },
      changePayTime(val) {
        this.ContractInfo.PayDaysMark.map((v, i) => {
          if (i !== val) {
            this.$set(this.ContractInfo.PayDaysMark, i, '')
          }
        })
      },
      changeForwardType(val) {
        if (val === 1) {
          this.ContractInfo.ForwardFirstYearTheMonth = ''
          this.ContractInfo.ForwardSecondYearTheMonth = ''
        } else if (val === 2) {
          this.ContractInfo.ForwardPrePayTheMonth = ''
        }
      },
      StagingModelChange(val) {
        if (this.ContractInfo.StagingModelMark.length === 2) {
          const index = this.ContractInfo.StagingModelMark.findIndex(v => v !== val)
          this.ContractInfo.StagingModelMark.splice(index, 1)
        }
      },
      PayModelChange(val) {
        if (this.ContractInfo.PayModelMark.length === 2) {
          const index = this.ContractInfo.PayModelMark.findIndex(v => v !== val)
          this.ContractInfo.PayModelMark.splice(index, 1)
        }
      },
      changeBankAccount(e) {
        if (e.length === 4 || e.length === 9 || e.length === 14 || e.length === 19) {
          this.ContractInfo.BankAccount += ' '
        }
      },
      buildBillData() {
        // 组装数据
        const model = this.ContractInfo
        model.HostStartTime = this.$dateFormat(model.HostTimeMark[0], 'yyyy-MM-dd 00:00:00')
        model.HostEndTime = this.$dateFormat(model.HostTimeMark[1], 'yyyy-MM-dd 00:00:00')
        model.StagingModel = model.StagingModelMark[0] || 0
        model.PayModel = model.PayModelMark[0] || 0
        model.PayDays = model.PayDaysMark[model.PayTimeType]
        // 有 10% 时才能赋值 不然重置
        if (!this.showPayModelFirst && model.PayModel === 1) {
          model.PayModel = 0
        }
        // 付款模式选择10% 不能有少付月数
        if (model.PayModel !== 2) {
          model.NoPayMonth = 0
        }
        // 免租模式无时 不能有免租期限和账单模式 为前置后置时没有账单模式
        if (!this.showBillPattern) {
          model.BillPattern = 0
        }
        if (model.FreePay === 0) {
          model.FreeDays = 0
        }
        // 免租模式为前置时 才有前置模式
        if (this.ContractInfo.FreePay !== 1) {
          this.ContractInfo.ForwardType = 0
        }
        if (this.ContractInfo.ForwardType === 1) {
          this.ContractInfo.ForwardFirstYearTheMonth = 0
          this.ContractInfo.ForwardSecondYearTheMonth = 0
        } else if (this.ContractInfo.ForwardType === 2) {
          this.ContractInfo.ForwardPrePayTheMonth = 0
          // 这种方式下 免租期限为这两个加起来
          this.ContractInfo.FreeDays = +this.ContractInfo.ForwardFirstYearTheMonth + +this.ContractInfo.ForwardSecondYearTheMonth
        }
        // 递增方式为不递增 不规则递增时 不能有 递增次数 递增年 递增值
        if (model.IncreaseType < 2) {
          model.IncreaseFrequency = 0
          model.IncreaseNum = 0
          model.IncreaseMoney = 0
        }
      },
      createBill() {
        this.$refs['ruleForm4'].validate((valid, fileds) => {
          if (valid) {
            this.buildBillData()
            if (Object.keys(this.billForm).length === 0 || this.BillList.length === 0) {
              // 新增、续签、没有账单的时候
              this.getBillList()
            } else if (this.$isDiffObj(this.billForm, this.ContractInfo)) {
              // 修改的时候有变动
              this.$confirm('系统检测到表单发生变动,确认后将重新生成账单', '提示').then(() => {
                this.getBillList()
              }).catch(() => {
                this.resetBillForm()
              })
            } else {
              this.$refs.steps.nextStep()
            }
          } else {
            scrollToError(fileds, this.$refs['ruleForm4'], -10)
          }
        })
      },
      getBillList() {
        this.billLoading = true
        getOwnerBill(this.ContractInfo).then(({ Data, BusCode, Msg }) => {
          this.billLoading = false
          if (BusCode === 0) {
            this.$refs.billPanel.initData(Data)
            this.$refs.steps.nextStep()
            this.saveBillForm()
          } else {
            throw new Error(Msg)
          }
        }).catch(({ message }) => {
          this.billLoading = false
          this.$message.error(message)
          // this.$refs.steps.nextStep()
        })
      },
      async createOrder(type, step) {
        // 点击前几步暂存时不需要走完流程，也不需要验证当页
        let flag = false
        switch (step) {
          case 2:
            this.buildBillData()
            if (this.$isDiffObj(this.billForm, this.ContractInfo)) {
              // 修改的时候有变动
              await this.$confirm('系统检测到表单发生变动,暂存后将丢失第三步账单计划的数据', '提示').then(() => {
                this.BillList.length = 0
              }).catch(() => {
                flag = true
                this.resetBillForm()
              })
            }
            break
          case 3:
            if (type === 'TemporaryStorage') {
              await this.$refs.billPanel.validate().then(() => {
                //
              }).catch(() => {
                flag = true
                this.$message.error('账单信息填写完整才能暂存哦！')
              })
            }
            break
        }
        if (flag) return
        if ((type === 'Save' || type === 'SignUp' || type === 'SubmitAudit')) {
          if (!this.$refs.inputNumber.validate()) {
            this.$message.error('请检查设备信息是否填写完整')
            return
          }
        }
        // 合同模板
        if (this.ContractInfo.PaperType === 0) {
          this.ContractInfo.ContractTemplateUrl = this.ContractTemplate.find(v => v.ContractTemplateName === this.ContractInfo.ContractTemplateName).ContractTemplateUrl
        }
        // 小区信息
        if (this.CommunityInfo.CityCodeMark) {
          this.CommunityInfo.CityCode = this.CommunityInfo.CityCodeMark[2]
          this.CommunityInfo.CityName = getCityNameByCode(this.CommunityInfo.CityCode)
        }
        // 代办人信息
        this.ContractInfo.IsAgent = this.ContractInfo.IsAgent ? 1 : 0
        // 对比数据比较出ModifyStatus
        const OwnerEquipments = this.$DiffArrFn(this.cloneData.ContractEquipments, this.ContractEquipments, [
          'EquipmentName',
          'EquipmentNumber'
        ])
        const ImageUpload = this.$DiffArrFn(this.cloneData.ImageUpload, this.ImageUpload, [
          'ImageLocation'
        ])
        const BookKeep = this.$DiffArrFn(this.cloneData.BookKeep, this.BookKeep)
        const OwnerInfos = this.$DiffArrFn(this.cloneData.OwnerInfos, this.OwnerInfos)
        // 重置合同中默认业主信息
        this.ContractInfo.OwnerName = OwnerInfos[0].OwnerName
        this.ContractInfo.OwnerPhone = OwnerInfos[0].OwnerPhone
        this.ContractInfo.OwnerIDCard = OwnerInfos[0].OwnerIDCard.toUpperCase()
        const OwnerBill = this.$refs.billPanel.getValue()
        // 强制修改 InputTerminal
        this.ContractInfo.InputTerminal = 0
        // 续约加字段
        if (this.query.Renew) {
          this.ContractInfo.RenewalID = this.query.KeyID
        }
        // 房东房源备案过来
        if (this.query.EntranceID) {
          this.ContractInfo.EntranceID = this.query.EntranceID
        }
        const param = {
          ownerContractModel: {
            OwnerContract: this.ContractInfo,
            HouseInfo: this.HouseInfo,
            CommunityInfo: this.CommunityInfo,
            OwnerBill,
            OwnerEquipments,
            ImageUpload,
            BookKeep,
            OwnerInfos
          },
          buttonType: type === 'Preview' ? 'TemporaryStorage' : type
        }
        let fn = insertOwnerContract
        if (this.isEdit) {
          fn = editOwnerContract
        }
        if (this.query.SafeEdit) {
          fn = safeEditOwnerContract
        }
        this.orderLoading = true
        if (type === 'Preview') {
          // 预览了就存起来了
          this.setOwnerPreview(param).then(() => {
            this.orderLoading = false
            this.$router.push({
              path: '/Owner/ContractPreview'
            })
          }).catch(() => {
            this.orderLoading = false
          })
        } else {
          fn(param).then(({ Data }) => {
            if (type === 'Save') {
              this.$message.success('保存合同成功')
              this.delView(this.$route)
              this.$router.push({
                path: '/Owner/ContractList'
              })
            } else if (type === 'TemporaryStorage') {
              this.$message.success('暂存合同成功')
              this.delView(this.$route)
              this.$router.push({
                path: '/Owner/ContractList'
              })
            } else if (type === 'SignUp') {
              this.$message.success('保存合同成功,正在进行现场签字')
              this.delView(this.$route)
              // this.$router.push({
              //   path: '/Owner/ContractSign',
              //   query: {
              //     KeyID: Data,
              //     url: this.ContractInfo.FirstInputTerminal === 1 && this.OwnerContractOperate.IsSigned === 1 ? this.OwnerContractOperate.SignInfo : ''
              //   }
              // })
              this.$router.push({
                path: '/Owner/ContractSign',
                query: {
                  Mobile: this.ContractInfo.OwnerPhone,
                  IDCard: this.ContractInfo.OwnerIDCard,
                  Name: this.ContractInfo.OwnerName,
                  ContractID: Data,
                  type: 0
                }
              })
            } else if (type === 'SubmitAudit') {
              this.$message.success('保存合同成功,合同已提交审核')
              this.delView(this.$route)
              this.$router.push({
                path: '/Owner/ContractList'
              })
            }
          }).catch(() => {
            this.orderLoading = false
          })
        }
      },
      handleSettlementAdd() {
        this.$refs['settlement'].open({
          BookKeepPara: {
            HouseName: this.getHouseName(),
            uuid: uuid()
          },
          type: 0
        })
      },
      getHouseName() {
        let HouseName = this.CommunityInfo.CommunityName + this.HouseInfo.Building + '栋'
        if (this.HouseInfo.UnitNumber) {
          HouseName += this.HouseInfo.UnitNumber + '单元'
        }
        HouseName += this.HouseInfo.RoomNumber
        return HouseName
      },
      checkOutSuccess({ BookKeepList, type }) {
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
