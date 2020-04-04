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
                <el-form-item label="合同编号" prop="ContractNumber" v-if="ContractInfo.PaperType==1||isEdit">
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
                    @change="changeCity"
                    v-model="CommunityInfo.CityCodeMark">
                  </el-cascader>
                </el-form-item>
                <el-form-item label="街道" prop="Street">
                  <search-street 
                  v-model="CommunityInfo.Street"
                  :city-code="CommunityInfo.CityCodeMark[2]"
                  :disabled="CommunityInfo.CityCodeMark.length === 0"
                  ></search-street>
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
                     label-width="140px">
              <div class="clearfix">
                <el-form-item label="栋" prop="Building">
                  <el-input v-model="HouseInfo.Building"
                            maxlength="10"
                            :disabled="IsInverseAudit||!!query.SafeEdit"
                            placeholder="请输入几栋"></el-input>
                </el-form-item>
                <el-form-item label="单元" prop="UnitNumber">
                  <el-input v-model="HouseInfo.UnitNumber" placeholder="请输入几单元"
                            :disabled="IsInverseAudit||!!query.SafeEdit"
                            type="number"
                            min="1"
                            max="1000"
                            v-positive.int="HouseInfo.UnitNumber"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="房间号" prop="RoomNumber">
                  <el-input maxlength="10" v-model="HouseInfo.RoomNumber" :disabled="IsInverseAudit||!!query.SafeEdit" placeholder="请输入房间号"></el-input>
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
            <el-form :model="ContractInfo" :inline="true" :rules="rules.rule6" status-icon ref="ruleForm6"
                     class="step1"
                     label-width="140px">
              <div class="clearfix form-item-xs">
                <el-form-item label="房屋户型">
                  <el-input-number
                    v-model="ContractInfo.RoomCount"
                    :min="0"
                    :max="26"
                    controls-position="right"
                  ></el-input-number> 室&emsp;
                </el-form-item>
                <el-form-item label-width="0">
                  <el-input-number
                    v-model="ContractInfo.HallCount"
                    :min="0"
                    :max="26"
                    controls-position="right"
                  ></el-input-number> 厅&emsp;
                </el-form-item>
                <el-form-item label-width="0">
                  <el-input-number
                    v-model="ContractInfo.ToiletCount"
                    :min="0"
                    :max="26"
                    controls-position="right"
                  ></el-input-number> 卫&emsp;
                </el-form-item>
              </div>
              <div class="clearfix form-item-lg">
                <el-form-item label="产权地址" prop="ProductionLicenseAddress">
                  <el-input v-model="ContractInfo.ProductionLicenseAddress"
                            placeholder="请输入产权地址"
                            maxlength="50"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="权属状况" prop="OwnershipStatus">
                  <el-select v-model="ContractInfo.OwnershipStatus" placeholder="请选择权属状况">
                    <el-option
                      :label="item.Description"
                      :value="item.Value"
                      v-for="item in OwnershipStatusList"
                      :key="item.Value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所有权证书编号" prop="ProductionLicenseNumber">
                  <el-input v-model="ContractInfo.ProductionLicenseNumber"
                            placeholder="请输入所有权证书编号" maxlength="50"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="抵押状况" prop="MortgageStatus">
                  <el-select v-model="ContractInfo.MortgageStatus" placeholder="请选择抵押状况">
                    <el-option
                      :label="item.Description"
                      :value="item.Value"
                      v-for="item in MortgageStatusList"
                      :key="item.Value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <upload-file
                ref="uploadFileProperty"
                title="上传产权证明"
                :img-list="ContractInfo.NoMoveOwn"
                notice="请上传不动产证或产权证，请使用png,jpg,jpeg等格式图片上传"
              ></upload-file>
            </el-form>
          </div>
          <div class="panel-title">业主信息</div>
          <div class="panel-body form-item-sm">
            <el-form :model="ContractInfo" :inline="true" :rules="rules.rule3" status-icon ref="ruleForm3"
                     class="step1"
                     label-width="140px">
              <div class="clearfix" v-for="(v,i) in OwnerInfos" :key="i">
                <upload-file
                  ref="uploadFileCardIDImg"
                  :title="`业主${i+1}: 身份证`"
                  upload-text="正面(头像面)"
                  single
                  :required="ContractInfo.PaperType==0"
                  @watchImgList="CardIDImgChange(arguments[0],v,'CardIDFront')"
                  :img-list="v.CardIDFront"
                >
                  <upload-file-single 
                  upload-text="背面(国徽面)"
                  class="ml-20"
                  :img-list="v.CardIDBack"
                  @watchImgList="CardIDImgChange(arguments[0],v,'CardIDBack')"
                  ></upload-file-single>
                </upload-file>
                <div class="clearfix">
                  <el-form-item label="姓名" required class="form-item-xs">
                    <el-input v-model="v.OwnerName" placeholder="请输入业主姓名"
                              maxlength="14" :disabled="IsSafeEdit"></el-input>
                  </el-form-item>
                  <el-form-item label="电话" required label-width="100px">
                    <el-input v-model="v.OwnerPhone" placeholder="请输入业主电话" maxlength="11"
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
                <div class="clearfix">
                  <el-form-item label="性别" required class="form-item-xs">
                    <el-select v-model="v.OwnerSex" placeholder="请选择性别" :disabled="IsSafeEdit">
                      <el-option
                        :label="item.Description"
                        :value="item.Value"
                        v-for="item in Sex"
                        :key="item.Value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="通讯地址" label-width="100px" class="form-item-lg">
                    <el-input v-model="v.ContractAddress" placeholder="请输入通讯地址"
                              maxlength="50" :disabled="IsSafeEdit"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="clearfix">
                <el-form-item label="邮编" prop="Postcode">
                  <el-input v-model="ContractInfo.Postcode"
                            placeholder="请输入邮编" maxlength="14" :disabled="IsSafeEdit"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱" prop="Email">
                  <el-input v-model="ContractInfo.Email"
                            maxlength="30"
                            placeholder="请输入电子邮箱" :disabled="IsSafeEdit"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="紧急联系人姓名" prop="EmergencyContactName">
                  <el-input v-model="ContractInfo.EmergencyContactName"
                            placeholder="请输入紧急联系人姓名" maxlength="14" :disabled="IsSafeEdit"></el-input>
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
              <upload-file
                  v-if="ContractInfo.IsAgent"
                  ref="uploadFileAgentCardID"
                  :title="`代办人身份证`"
                  upload-text="正面(头像面)"
                  single
                  :required="ContractInfo.PaperType==0"
                  @watchImgList="AgentCardIDImgChange(arguments[0],'AgentCardIDFront')"
                  :img-list="ContractInfo.AgentCardIDFront"
                >
                  <upload-file-single 
                  upload-text="背面(国徽面)"
                  class="ml-20"
                  :img-list="ContractInfo.AgentCardIDBack"
                  @watchImgList="AgentCardIDImgChange(arguments[0],'AgentCardIDBack')"
                  ></upload-file-single>
                </upload-file>
              <div class="clearfix" v-if="ContractInfo.IsAgent">
                <el-form-item label="代办人姓名" prop="AgentName">
                  <el-input v-model="ContractInfo.AgentName" placeholder="请输入代办人姓名"
                            maxlength="14" :disabled="IsSafeEdit"></el-input>
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
              <div class="clearfix form-item-lg" v-if="ContractInfo.IsAgent">
                <el-form-item label="代办人通讯地址">
                  <el-input v-model="ContractInfo.AgentAddress" placeholder="请输入代办人通讯地址"
                            maxlength="50" :disabled="IsSafeEdit"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="收款方式" prop="CollectionType">
                  <el-select v-model="ContractInfo.CollectionType" @change="changeCollectionType" placeholder="请选择收款方式">
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
                            placeholder="请输入收款人姓名" maxlength="14"></el-input>
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
                              @blur="searchBankName"
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
                              maxlength="50"></el-input>
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
                    @change="HostTimeMarkChange"
                    start-placeholder="托管开始日期"
                    end-placeholder="托管结束日期">
                  </date-picker-range>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="付款周期" prop="PayCycle">
                  <el-select v-model="ContractInfo.PayCycle" @change="PayCycleChange" placeholder="请选择">
                    <el-option
                      :label="item.Description"
                      :value="item.Value"
                      v-for="item in PayCycle"
                      :key="item.Value"
                    ></el-option>
                  </el-select>
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
              </div>
              <div class="clearfix">
                <el-form-item label="拿房模式" prop="PayModel">
                  <el-select v-model="ContractInfo.PayModel" @change="PayModelChange" placeholder="请选择">
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in PayModelList"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div class="item-notice" v-show="PayModelMsg">
                  提示：{{PayModelMsg}}
                </div>
              </div>
              <div class="clearfix">
                <el-form-item label="改造期" prop="Transformation"
                              v-if="ContractInfo.PayModel===4 || ContractInfo.PayModel===5">
                  <el-input v-model="ContractInfo.Transformation" placeholder="请输入改造期"
                            min="1"
                            max="100"
                            v-positive.int="ContractInfo.Transformation"
                            type="number"></el-input>
                  <span class="ml-5">月</span>
                </el-form-item>
                <div class="item-notice" v-show="ContractInfo.PayModel===4">
                  提示：每年免租一个月
                </div>
                <el-form-item label="免租期" prop="FreeDays" v-if="ContractInfo.PayModel===5">
                  <el-input v-model="ContractInfo.FreeDays" placeholder="请输入免租期"
                            :min="ContractInfo.FreeDaysMin"
                            max="100"
                            v-positive.int="ContractInfo.FreeDays"
                            type="number"></el-input>
                  <span class="ml-5">月</span>
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
                      <el-option label="每2年" :value="3"></el-option>
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
                    <span>{{ContractInfo.IncreaseType==3?'%':'元'}}/次</span>
                  </el-form-item>
                </template>
              </div>
              <div class="clearfix">
                <el-form-item label="首年空置期" prop="FirstYearVacant">
                  <el-input v-model="ContractInfo.FirstYearVacant" placeholder="请输入天数"
                            min="0"
                            max="366"
                            v-positive="ContractInfo.FirstYearVacant"
                            type="number"></el-input>
                  <span class="ml-5">天</span>
                </el-form-item>
                <el-form-item label="次年起每年空置期" prop="SecondYearVacant" label-width="180px">
                  <el-input v-model="ContractInfo.SecondYearVacant" placeholder="请输入天数"
                            min="0"
                            max="366"
                            v-positive="ContractInfo.SecondYearVacant"
                            type="number"></el-input>
                  <span class="ml-5">天</span>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="维护服务费" prop="ServiceFee">
                  <el-input v-model="ContractInfo.ServiceFee" placeholder="请输入金额"
                            min="0"
                            max="366"
                            v-positive="ContractInfo.ServiceFee"
                            type="number"></el-input>
                  <span class="ml-5">元/月</span>
                  <div class="item-notice">
                    提示：房东需每月支付该笔费用，从账单中扣除
                  </div>
                </el-form-item>
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
              <el-button type="primary" class="mr-20" @click="createOrder('TemporaryStorage',2)" v-if="!query.SafeEdit"
                         :loading="orderLoading">暂存
              </el-button>
              <el-button type="primary" @click="next(1)" :loading="billLoading">下一步</el-button>
            </div>
          </div>
        </template>
        <template slot="3">
          <div class="panel-title">账单计划</div>
          <div class="panel-body">
            <bill-panel ref="billPanel" :childrenKey="childrenKey" :data="BillList" :contract="ContractInfo" :type="0"
                        :disabled="!!this.query.SafeEdit"></bill-panel>
          </div>
          <div class="clearfix block-center contract-btn-box">
            <el-button type="primary" @click="prev(2)" class="mr-20">上一步</el-button>
            <el-button type="primary" class="mr-20" @click="createOrder('TemporaryStorage',3)" v-if="!query.SafeEdit"
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
                <el-form-item label="水表读数" prop="WaterNumber">
                  <el-input v-model="ContractInfo.WaterNumber"
                            min="0"
                            v-positive="ContractInfo.WaterNumber"
                            type="number"
                            :disabled="IsSafeEdit"
                            max="1000000"
                  ></el-input>
                  <span class="ml-5">吨</span>
                </el-form-item>
                <el-form-item label="电表读数" prop="ElectricityNumber">
                  <el-input v-model="ContractInfo.ElectricityNumber"
                            min="0"
                            v-positive="ContractInfo.ElectricityNumber"
                            type="number"
                            :disabled="IsSafeEdit"
                            max="1000000"
                  ></el-input>
                  <span class="ml-5">度</span>
                </el-form-item>
                <el-form-item label="天然气" prop="GasNumber">
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
              <div class="clearfix">
                <el-form-item label="是否有宽带" prop="IsBroadband">
                  <el-radio-group v-model="ContractInfo.IsBroadband" :disabled="IsSafeEdit">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
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
              <div class="clearfix">
                <el-form-item label="电表峰">
                  <el-input v-model="ContractInfo.ElectricMeterPeak" :disabled="IsSafeEdit"
                            maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="电表谷">
                  <el-input v-model="ContractInfo.ElectricMeterValley" :disabled="IsSafeEdit" maxlength="20"></el-input>
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
                notice="请上传业主房屋所有权证和证明，如有代办人需代办人证件照，请使用png,jpg,jpeg等格式图片上传"
              ></upload-file>
              <div class="clearfix">
                <el-form-item label=" ">
                  <el-button plain type="primary" @click="createOrder('Preview',4)" :loading="orderLoading">预览合同
                  </el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div class="clearfix block-center contract-btn-box">
            <el-button type="primary" @click="prev()" class="mr-20">上一步</el-button>
            <template v-if="!query.SafeEdit">
              <el-button type="primary" class="mr-20" @click="createOrder('TemporaryStorage',4)"
                         :loading="orderLoading">暂存
              </el-button>
              <el-button type="primary" @click="createOrder('SignUp',4)" v-show="ContractInfo.PaperType==0"
                         :loading="orderLoading">
                {{!!query.SafeEdit?'保存':'现场签字'}}
              </el-button>
              <el-button type="primary" @click="createOrder('Save',4)" v-show="ContractInfo.PaperType==1"
                         :loading="orderLoading">
                保存
              </el-button>

              <el-button type="primary" class="ml-20" @click="createOrder('SubmitAudit',4)"
                         v-show="ContractInfo.FirstInputTerminal===1&&OwnerContractOperate.IsSigned==1"
                         :loading="orderLoading">提交审核
              </el-button>
            </template>
            <el-button type="primary" @click="createOrder('Save',4)" v-else
                       :loading="orderLoading">
              保存修改
            </el-button>
          </div>
        </template>
      </steps-box>
    </div>
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
    NewPreviewOwnerContract,
    safeEditOwnerContract,
    searchCommunityList
  } from '../../../api/owner'
  import { ShowCompanyinfoCityCode, StateOwnerContract } from '../../../api/system'
  import StepsBox from '../../../components/StepsBox'
  import { BillPanel, ContractTabs, InputNumber, SearchStreet } from './components'
  import { Settlement, UploadFile, UploadFileSingle } from '../../../components'
  import { validatePhone, validateCard, validateEmail } from '../../../utils/validate/rulevalidator'
  import { CityData, getCityNameByCode, getCodeArrByCode } from '../../../utils/CityData'
  import { scrollToError } from '../../../utils/scrollToError'
  import { mapActions } from 'vuex'
  import BIN from 'bankcardinfo'

  export default {
    components: {
      StepsBox,
      ContractTabs,
      InputNumber,
      UploadFile,
      BillPanel,
      Settlement,
      SearchStreet,
      UploadFileSingle
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
      OwnershipStatusList() {
        const OwnershipStatusList = this.$EnumData.getEnumListByKey('OwnershipStatus').slice()
        OwnershipStatusList[0].Description = '请选择'
        return OwnershipStatusList
      },
      MortgageStatusList() {
        const MortgageStatusList = this.$EnumData.getEnumListByKey('MortgageStatus').slice()
        MortgageStatusList[0].Description = '请选择'
        return MortgageStatusList
      },
      /**
       * @return {string}
       */
      PayModelMsg() {
        const item = this.PayModelList.find(x => x.value === this.ContractInfo.PayModel)
        if (item) {
          return item.Description
        } else {
          return ''
        }
      },
      PayCycle() {
        return this.$EnumData.getEnumListByKey('PayCycle')
      },
      IncreaseType() {
        const IncreaseType = this.$EnumData.getEnumListByKey('IncreaseType').slice()
        IncreaseType.splice(1, 1) // 删除掉不规则递增
        return IncreaseType
      },
      IsSafeEdit() {
        return !!this.query.SafeEdit && false
      },
      Sex() {
        return this.$EnumData.getEnumListByKey('Sex')
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
          PayCycle: 0,
          InitialPrice: '',
          OldPayModel: 6,
          PayModel: 6,
          IncreaseType: 0,
          IncreaseFrequency: 1,
          PaperType: 0,
          CollectionType: 1,
          PassengerChannel: 0,
          WaterNumber: '',
          ElectricityNumber: '',
          GasNumber: '',
          Transformation: 1,
          FreeDays: 1,
          FreeDaysMin: 1,
          AgentAddress: '',
          FirstYearVacant: '',
          SecondYearVacant: '',
          ServiceFee: '',
          IsBroadband: '',
          NoMoveOwn: [],
          AgentCardIDFront: [],
          AgentCardIDBack: [],
          ReceivePeopleName: '',
          ReceiveAccount: '',
          BankAccount: '',
          BankName: '',
          OpenBankName: '',
          RoomCount: 0,
          HallCount: 0,
          ToiletCount: 0,
          ProductionLicenseAddress: '',
          OwnershipStatus: 0,
          ProductionLicenseNumber: '',
          MortgageStatus: 0
        }, // 合同信息
        HouseInfo: {}, // 房源信息
        CommunityInfo: {
          Location: '',
          CityCodeMark: [],
          CommunityName: '',
          Street: ''
        }, // 小区信息
        ContractEquipments: [], // 房屋设备信息
        ImageUpload: [],
        ContractTemplate: [], // 合同模板
        BillList: [], // 账单信息
        OwnerInfos: [], // 业主列表
        OwnerContractOperate: {}, // 合同操作表
        oldCommunityList: [], // 上次搜索
        oldCommunitySearchKey: '', // 上次搜索
        cloneData: {
          ImageUpload: [],
          ContractEquipments: [],
          OwnerInfos: [],
          OwnerBill: [],
          NoMoveOwn: [],
          AgentCardIDFront: [],
          AgentCardIDBack: []
        }, // clone的旧数据
        childrenKey: 'OwnerBillDetail',
        billForm: {}, // 账单表单 用于对比是否修改了账单
        bankList: ['中国工商银行', '中国农业银行', '中国银行', '中国建设银行', '交通银行', '中国邮政储蓄银行', '招商银行', '浦发银行', '中信银行', '中国光大银行', '华夏银行', '中国民生银行', '广发银行', '兴业银行', '平安银行', '浙商银行', '恒丰银行', '渤海银行'],
        PayModelList: [
          {
            Description: '',
            value: 4,
            label: '10%10%'
          },
          {
            Description: '',
            value: 5,
            label: '5+1'
          },
          {
            Description: '需要自己手动添加账单,并且需要审核',
            value: 6,
            label: '非正常拿房'
          }
        ],
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
            Street: [
              { required: true, message: '请输入或选择街道', trigger: 'change' }
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
              { required: true, message: '请输入建筑面积', trigger: 'blur' }
            ]
          },
          rule3: {
            Email: [
              { validator: validateEmail, trigger: 'blur' }
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
              { required: true, message: '请输入代办人身份证', trigger: 'blur' },
              { validator: validateCard, trigger: 'blur' }
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
            Transformation: [
              { required: true, message: '请输入改造期', trigger: 'blur' }
            ],
            FreeDays: [
              { required: true, message: '请输入免租期限', trigger: 'blur' }
            ],
            PayModel: [
              { required: true, message: '请选择拿房模式', trigger: 'change' }
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
            ]
          },
          rule5: {
            WaterNumber: [
              { required: true, message: '水表读数不能为空', trigger: 'blur' }
            ],
            ElectricityNumber: [
              { required: true, message: '电表读数不能为空', trigger: 'blur' }
            ],
            GasNumber: [
              { required: true, message: '天然气读数不能为空', trigger: 'blur' }
            ],
            IsBroadband: [
              { required: true, message: '宽带信息不能为空', trigger: 'change' }
            ]
          }
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
          console.log('owner-map ready')
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
                console.log(result)
                this.CommunityInfo.CityCode = item.adcode
                this.CommunityInfo.CityCodeMark = getCodeArrByCode(item.adcode)
                this.CommunityInfo.CityName = item.district
                this.CommunityInfo.Longitude = item.location && item.location.lng
                this.CommunityInfo.Latitude = item.location && item.location.lat
                // 之前没有经纬度的搜索的重置，点击的不重置
                if (typeof item.address === 'string') {
                  if (!this.CommunityInfo.Location || type === 1) {
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
          OwnerIDCard: '',
          ContractAddress: '',
          CardIDFront: [],
          CardIDBack: [],
          OwnerSex: 0
        })
      },
      initPageData({ ContractTemplate, OwnerContract, HouseInfo, CommunityInfo, ImageUpload, OwnerEquipments, OwnerBill, OwnerContractOperate, OwnerInfos }) {
        this.ContractTemplate = ContractTemplate || []
        // this.ContractInfo.ContractTemplateName = ContractTemplate[0].ContractTemplateName // 默认合同模板
        this.ContractInfo = { ...this.ContractInfo, ContractTemplateName: ContractTemplate[0].ContractTemplateName }
        /* 续签删除账期和记账 */
        if (this.query.Renew) {
          OwnerBill = []
          if (OwnerContract) {
            OwnerContract.PaperType = 0
          }
        }
        if (HouseInfo) {
          this.HouseInfo = HouseInfo
        }
        if (OwnerEquipments) {
          this.ContractEquipments = OwnerEquipments
          if (!this.query.Renew) {
            this.cloneData.ContractEquipments = this.$deepCopy(OwnerEquipments)
          }
        }
        if (ImageUpload) {
          this.ImageUpload = ImageUpload
          if (!this.query.Renew) {
            this.cloneData.ImageUpload = this.$deepCopy(ImageUpload)
          }
        }
        if (OwnerBill && OwnerBill.length > 0) {
          this.$refs.billPanel.initData(OwnerBill)
          this.cloneData.OwnerBill = OwnerBill
        }
        if (CommunityInfo) {
          this.handleCommunitySelect(CommunityInfo, 1)
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
          if (OwnerContract.NoMoveOwn && OwnerContract.NoMoveOwn.length > 0) {
            this.cloneData.NoMoveOwn = this.$deepCopy(OwnerContract.NoMoveOwn)
          }
          if (OwnerContract.AgentCardIDFront && OwnerContract.AgentCardIDFront.length > 0) {
            this.cloneData.AgentCardIDFront = this.$deepCopy(OwnerContract.AgentCardIDFront)
          }
          if (OwnerContract.AgentCardIDBack && OwnerContract.AgentCardIDBack.length > 0) {
            this.cloneData.AgentCardIDBack = this.$deepCopy(OwnerContract.AgentCardIDBack)
          }
          this.ContractInfo = { ...this.ContractInfo, ...OwnerContract }
          debugger
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
          // 付款模式 兼容老数据 0 1 2 -》6
          if (this.ContractInfo.PayModel < 3) {
            this.ContractInfo.PayModel = 6
          }
          if (this.ContractInfo.HostTimeMark[0] && this.ContractInfo.HostTimeMark[1] && this.ContractInfo.PayModel === 5) {
            const years = this.diffYear(this.ContractInfo.HostTimeMark)
            this.ContractInfo.FreeDaysMin = years
          }
          this.ContractInfo.OldPayModel = this.ContractInfo.PayModel
          // 最晚付款日
          this.ContractInfo.PayDaysMark[this.ContractInfo.PayTimeType] = this.ContractInfo.PayDays
          this.saveBillForm()
        }
        if (!OwnerInfos || OwnerInfos && OwnerInfos.length === 0) {
          this.OwnerInfos.push({
            OwnerName: this.ContractInfo.OwnerName,
            OwnerPhone: this.ContractInfo.OwnerPhone,
            OwnerIDCard: this.ContractInfo.OwnerIDCard,
            ContractAddress: this.ContractInfo.ContractAddress,
            OwnerSex: this.ContractInfo.OwnerSex || 0
          })
          if (this.isEdit) {
            // 兼容之前的数据，、、、不用 没得keyid 不会有bug
            // this.cloneData.OwnerInfos = this.$deepCopy(this.OwnerInfos)
          }
        } else {
          this.OwnerInfos = OwnerInfos
          if (!this.query.Renew) {
            this.cloneData.OwnerInfos = this.$deepCopy(OwnerInfos)
          }
        }
      },
      saveBillForm() {
        const keys = [
          'HostStartTime',
          'HostEndTime',
          'InitialPrice',
          'Transformation',
          'FreeDays',
          'PayModel',
          'PayCycle',
          'IncreaseType',
          'IncreaseFrequency',
          'IncreaseNum',
          'IncreaseMoney',
          'PayTimeType',
          'PayDays',
          'FirstYearVacant',
          'SecondYearVacant',
          'ServiceFee'
        ]
        keys.map(v => {
          this.billForm[v] = this.ContractInfo[v]
        })
      },
      resetBillForm() {
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
        // if (index > -6) {
        //   this.$refs.steps.nextStep()
        //   return
        // }
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
            try {
              this.OwnerInfos.forEach((v, i) => {
                if (!v.OwnerName) {
                  throw new Error(`请填写业主${i + 1}姓名！`)
                }
                if (!v.OwnerPhone) {
                  throw new Error(`请填写业主${i + 1}电话！`)
                }
                const msg1 = validatePhone(null, v.OwnerPhone)
                if (msg1) throw new Error(`业主${i + 1}${msg1}`)
                if (!v.OwnerIDCard) {
                  throw new Error(`请填写业主${i + 1}身份证！`)
                }
                const msg2 = validateCard(null, v.OwnerIDCard)
                if (msg2) throw new Error(`业主${i + 1}${msg2}`)
                if (!(v.CardIDFront && v.CardIDFront.length > 0) && this.ContractInfo.PaperType === 0) {
                  throw new Error(`请上传业主${i + 1}身份证正面照！`)
                }
                if (!(v.CardIDBack && v.CardIDBack.length > 0) && this.ContractInfo.PaperType === 0) {
                  throw new Error(`请上传业主${i + 1}身份证背面照！`)
                }
              })
            } catch (err) {
              this.$message.error(err.message)
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
      changeCity() {
        this.CommunityInfo.Street = ''
      },
      CardIDImgChange(val, data, type) {
        data[type] = val
      },
      AgentCardIDImgChange(val, type) {
        this.ContractInfo[type] = val
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
      handleCommunitySelect(item, type = 0) {
        this.CommunityInfo = {
          CityCode: item.CityCode,
          CityName: item.CityName,
          CommunityName: item.CommunityName,
          Longitude: item.Longitude,
          Latitude: item.Latitude,
          Location: item.Location,
          KeyID: item.KeyID,
          Street: item.Street
        }
        this.CommunityInfo.CommunityNameMark = item.CommunityName
        this.CommunityInfo.CityCodeMark = getCodeArrByCode(this.CommunityInfo.CityCode)
        this.$refs.ruleForm1.clearValidate()
        if (type === 0) {
          this.setCenterAndMark()
        }
      },
      handleStreetSelect(item) {
        this.CommunityInfo.Street = item.CommunityName
      },
      changeCollectionType() {
        this.ContractInfo.ReceivePeopleName = ''
        this.ContractInfo.ReceiveAccount = ''
        this.ContractInfo.BankAccount = ''
        this.ContractInfo.BankName = ''
        this.ContractInfo.OpenBankName = ''
      },
      handleBankSelect(item) {
        this.ContractInfo.BankName = item
      },
      handleBlurSelect() {
        setTimeout(() => {
          if (this.CommunityInfo.CommunityNameMark !== this.CommunityInfo.CommunityName) {
            this.CommunityInfo.KeyID = ''
            this.searchMapKey()
          }
        }, 400)
      },
      HostTimeMarkChange(val) {
        if (val[0] && val[1]) {
          const flag = this.isFullYear(val)
          if (!flag && this.ContractInfo.PayModel !== 6) {
            this.ContractInfo.PayModel = ''
            this.ContractInfo.OldPayModel = ''
          }
          if (flag) {
            if (this.ContractInfo.PayModel === 5) {
              const years = this.diffYear(val)
              if (this.ContractInfo.FreeDays < years) {
                this.ContractInfo.FreeDays = years
              }
              this.ContractInfo.FreeDaysMin = years
            }
          } else {
            this.ContractInfo.FreeDays = 1
            this.ContractInfo.FreeDaysMin = 1
          }
        }
      },
      PayCycleChange(val) {
        if (val !== 0 && this.ContractInfo.PayModel === 3 || val >= 2 && this.ContractInfo.PayModel !== 6) {
          this.ContractInfo.PayModel = ''
          this.ContractInfo.OldPayModel = ''
        }
      },
      PayModelChange(val) {
        // 修改免租期和改造期的值
        let flag = false
        switch (val) {
          case 3:
            this.ContractInfo.FreeDays = 0
            this.ContractInfo.Transformation = 0
            break
          case 4:
            this.ContractInfo.FreeDays = 1
            this.ContractInfo.Transformation = 1
            break
          case 5:
            flag = true
            this.ContractInfo.FreeDays = 1
            // this.ContractInfo.Transformation = 1
            break
          case 6:
            this.ContractInfo.FreeDays = 0
            this.ContractInfo.Transformation = 0
            break
        }
        if (val !== 6) {
          if (val === 3 && this.ContractInfo.PayCycle !== 0) {
            this.$alert('付款周期为<b>月付</b>才能选择该模式', '温馨提示', {
              confirmButtonText: '我知道了',
              dangerouslyUseHTMLString: true
            })
            this.ContractInfo.PayModel = this.ContractInfo.OldPayModel
          } else if (this.ContractInfo.HostTimeMark[0] && this.ContractInfo.HostTimeMark[1]) {
            if (this.isFullYear(this.ContractInfo.HostTimeMark) && this.ContractInfo.PayCycle < 2) {
              this.ContractInfo.OldPayModel = val
              if (flag) {
                this.ContractInfo.FreeDays = this.diffYear(this.ContractInfo.HostTimeMark)
              }
            } else {
              this.$alert('托管时间必须为<b>整年</b><br/>并且付款周期为<b>月付</b>或者<b>季付</b></br>才能选择该模式', '温馨提示', {
                confirmButtonText: '我知道了',
                dangerouslyUseHTMLString: true
              })
              this.ContractInfo.PayModel = this.ContractInfo.OldPayModel
            }
          }
        }
      },
      diffYear(timeArr) {
        const time1 = new Date(timeArr[0])
        const time2 = new Date(timeArr[1])
        time2.setDate(time2.getDate() + 1)
        return Math.abs(time1.getFullYear() - time2.getFullYear())
      },
      isFullYear(timeArr) {
        const time1 = new Date(timeArr[0])
        const time2 = new Date(timeArr[1])
        time2.setDate(time2.getDate() + 1)
        if (this.$dateFormat(time1, 'MM-dd') === this.$dateFormat(time2, 'MM-dd')) {
          return true
        } else {
          return false
        }
      },
      changePayTime(val) {
        this.ContractInfo.PayDaysMark.map((v, i) => {
          if (i !== val) {
            this.$set(this.ContractInfo.PayDaysMark, i, '')
          }
        })
      },
      changeBankAccount(e) {
        if (e.length === 4 || e.length === 9 || e.length === 14 || e.length === 19) {
          this.ContractInfo.BankAccount += ' '
        }
      },
      searchBankName(e) {
        let num = this.ContractInfo.BankAccount.replace(/\s/g, '')
        if (num.length < 19) {
          const arr = new Array(19 - num.length).fill(8)
          num = num + arr.join('')
        }
        console.log(num)
        BIN.getBankBin(num).then((data) => {
            console.log(data)
            this.ContractInfo.BankName = data.bankName
          })
          .catch((err) => {
            console.log(err)
          })
      },
      buildBillData() {
        // 组装数据
        const model = this.ContractInfo
        model.HostStartTime = this.$dateFormat(model.HostTimeMark[0], 'yyyy-MM-dd 00:00:00')
        model.HostEndTime = this.$dateFormat(model.HostTimeMark[1], 'yyyy-MM-dd 00:00:00')
        model.PayDays = model.PayDaysMark[model.PayTimeType]
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
            } else if (this.$isDiffObj(this.billForm, this.ContractInfo) && !this.query.SafeEdit) {
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
          case 4:
            if (type === 'SignUp' || type === 'Save' || type === 'SubmitAudit') {
              this.$refs['ruleForm5'].validate((a, b) => {
                if (!a) {
                  scrollToError(b, this.$refs['ruleForm5'], -10)
                  flag = true
                }
              })
            }
            break
        }
        debugger
        console.log(this.BillList)
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
        const OwnerInfos = this.$DiffArrFn(this.cloneData.OwnerInfos, this.OwnerInfos)
        // 重置合同中默认业主信息
        this.ContractInfo.OwnerName = OwnerInfos[0].OwnerName
        this.ContractInfo.OwnerPhone = OwnerInfos[0].OwnerPhone
        this.ContractInfo.OwnerIDCard = OwnerInfos[0].OwnerIDCard.toUpperCase()
        this.ContractInfo.ContractAddress = OwnerInfos[0].ContractAddress
        this.ContractInfo.OwnerSex = OwnerInfos[0].OwnerSex
        const NoMoveOwn = this.$DiffArrFn(this.cloneData.NoMoveOwn, this.ContractInfo.NoMoveOwn, [
          'ImageLocation'
        ])
        const AgentCardIDFront = this.$DiffArrFn(this.cloneData.AgentCardIDFront, this.ContractInfo.AgentCardIDFront, [
          'ImageLocation'
        ])
        const AgentCardIDBack = this.$DiffArrFn(this.cloneData.AgentCardIDBack, this.ContractInfo.AgentCardIDBack, [
          'ImageLocation'
        ])
        this.ContractInfo.NoMoveOwn = NoMoveOwn
        this.ContractInfo.AgentCardIDFront = AgentCardIDFront
        this.ContractInfo.AgentCardIDBack = AgentCardIDBack
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
            BookKeep: [],
            OwnerInfos
          },
          buttonType: type === 'Preview' ? 'TemporaryStorage' : type,
          OwnerPreviewID: JSON.parse(sessionStorage.getItem('ownerPreviewID')) || 0
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
          NewPreviewOwnerContract(param).then(res => {
            if (res.Code === 0 && res.Data) {
              this.orderLoading = false
              this.PreviewID = res.Data.KeyID
              sessionStorage.setItem('ownerPreviewID', this.PreviewID)
              this.$router.push({
                path: '/Owner/ContractPreview',
                query: {
                  KeyID: res.Data.KeyID
                }
              })
            } else {
              this.orderLoading = false
              console.log('预览合同失败:')
            }
            console.log('res:', res)
          })
          // 预览了就存起来了
          // this.setOwnerPreview(param).then(() => {
          //   this.orderLoading = false
          //   this.$router.push({
          //     path: '/Owner/ContractPreview',
          //     query: {
          //       KeyID: this.query.KeyID
          //     }
          //   })
          // }).catch(() => {
          //   this.orderLoading = false
          // })
        } else {
          fn(param).then(({ Data, BusCode, Msg }) => {
            if (BusCode === 2) {
              this.$alert(Msg, '温馨提示', {
                confirmButtonText: '我知道了'
              })
              this.orderLoading = false
              return
            }
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
              this.delView(this.$route)
              if (this.query.SafeEdit) {
                this.$message.success('保存合同成功')
                this.$router.push({
                  path: '/Owner/ContractList'
                })
              } else {
                this.$message.success('保存合同成功,正在进行现场签字')
                this.$router.push({
                  path: '/Owner/ContractSign',
                  query: {
                    Mobile: this.ContractInfo.OwnerPhone,
                    IDCard: this.ContractInfo.OwnerIDCard,
                    Name: this.ContractInfo.OwnerName,
                    Img: this.OwnerInfos[0].CardIDFront[0].ImageLocation,
                    ContractID: Data,
                    type: 0
                  }
                })
              }
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
      }
    }
  }
</script>
