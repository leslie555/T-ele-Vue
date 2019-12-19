<template>
  <div class="app-container">
    <div class="panel edit-contract" v-loading="detailLoading">
      <steps-box :list="stepList" ref="steps" @change="stepChange">
        <template slot="1">
          <div class="panel-title">合同类型</div>
          <div class="panel-body form-item-md">
            <contract-tabs :index="currentContractIndex" :type="1"
                           @tab-change="tabChange" :disabled="IsSafeEdit"></contract-tabs>
            <el-form :model="ContractInfo" :inline="true" :rules="rules.rule0" ref="ruleForm0" status-icon
                     class="step1"
                     :disabled="IsSafeEdit"
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
          <div class="panel-title">房源信息</div>
          <div class="panel-body form-item-sm">
            <el-form :model="HouseInfo" :inline="true" :rules="rules.rule1" status-icon ref="ruleForm1"
                     class="step1"
                     :disabled="IsSafeEdit||!!query.SafeEdit"
                     label-width="140px">
              <div class="clearfix">
                <el-form-item label="房源名称" prop="HouseName">
                  <search-house v-model="HouseInfo.HouseName" :type="2"
                                @select="handleHouseSelect"></search-house>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="panel-title">承租人信息</div>
          <div class="panel-body form-item-sm">
            <el-form :model="ContractInfo" :inline="true" :rules="rules.rule2" status-icon ref="ruleForm2"
                     class="step1"
                     label-width="140px">
              <div class="clearfix">
                <el-form-item label="承租人姓名" prop="TenantName">
                  <el-input v-model="ContractInfo.TenantName" placeholder="请输入承租人姓名"
                            maxlength="14"
                            :disabled="IsSafeEdit"
                            @blur="changeLivePeople"></el-input>
                </el-form-item>
                <el-form-item label="承租人电话" prop="TenantPhone">
                  <el-input v-model="ContractInfo.TenantPhone" placeholder="请输入承租人电话"
                            maxlength="11"
                            :disabled="IsSafeEdit"
                            @blur="changeLivePeople"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="承租人身份证" prop="TenantCard">
                  <el-input v-model="ContractInfo.TenantCard" placeholder="请输入承租人身份证"
                            maxlength="18"
                            :disabled="IsSafeEdit"
                            @blur="changeLivePeople"></el-input>
                </el-form-item>
                <el-form-item label="承租人性别" prop="TenantSex">
                  <el-select v-model="ContractInfo.TenantSex" placeholder="请选择性别" :disabled="IsSafeEdit"
                             @change="changeLivePeople">
                    <el-option
                      :label="item.Description"
                      :value="item.Value"
                      v-for="item in Sex"
                      :key="item.Value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="紧急联系人姓名" prop="EmergencyContactName">
                  <el-input v-model="ContractInfo.EmergencyContactName"
                            maxlength="14"
                            :disabled="IsSafeEdit"
                            placeholder="请输入紧急联系人姓名" @blur="changeLivePeople"></el-input>
                </el-form-item>
                <el-form-item label="紧急联系人电话" prop="EmergencyContactPhone">
                  <el-input v-model="ContractInfo.EmergencyContactPhone"
                            maxlength="11"
                            :disabled="IsSafeEdit"
                            placeholder="请输入紧急联系人电话" @blur="changeLivePeople"></el-input>
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
                  <el-input v-model="ContractInfo.AgentName" maxlength="14"
                            :disabled="IsSafeEdit"
                            placeholder="请输入代办人姓名"></el-input>
                </el-form-item>
                <el-form-item label="代办人电话" prop="AgentPhone">
                  <el-input v-model="ContractInfo.AgentPhone" maxlength="11"
                            :disabled="IsSafeEdit"
                            placeholder="请输入代办人电话"></el-input>
                </el-form-item>
                <el-form-item label="代办人身份证" prop="AgentCard">
                  <el-input v-model="ContractInfo.AgentCard" maxlength="18"
                            :disabled="IsSafeEdit"
                            placeholder="请输入代办人身份证"></el-input>
                </el-form-item>
              </div>
              <upload-file
                ref="uploadFile"
                title="上传附件"
                :img-list="ImageUpload"
                notice="请上传身份证正面、背面以及手持身份证等照片"
              ></upload-file>
            </el-form>
          </div>
          <div class="panel-title">
            <span>入住人信息</span>
            <el-button :disabled="IsSafeEdit" class="ml-30" plain type="primary" @click="handleLiverAdd">添加入住人
            </el-button>
          </div>
          <div class="panel-body form-item-sm">
            <el-form :model="ContractInfo" :inline="true" status-icon
                     class="step1"
                     label-width="140px">
              <el-form-item label="最多入住人" prop="MaxLiverCount" required>
                <el-select v-model="ContractInfo.MaxLiverCount">
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="item in MaxLiverCount"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-table :data="LivePeopleInfoList"
                      border
                      fit
                      class="table-normal">
              <el-table-column align="center" label='入住人' min-width="140"
                               prop="LiverName"></el-table-column>
              <el-table-column align="center" label='性别' min-width="140">
                <template slot-scope="scope">
                  {{$EnumData.getEnumDesByValue('Sex',scope.row.LiverSex)}}
                </template>
              </el-table-column>
              <el-table-column align="center" label='手机' min-width="140"
                               prop="LiverPhone"></el-table-column>
              <el-table-column align="center" label='证件类型' min-width="140">
                <template slot-scope="scope">
                  {{$EnumData.getEnumDesByValue('CardType',scope.row.CardType)}}
                </template>
              </el-table-column>
              <el-table-column align="center" label='证件号' min-width="140" prop="CardID"></el-table-column>
              <el-table-column align="center" label='操作' min-width="140">
                <template slot-scope="scope" v-if="!IsSafeEdit">
                  <table-buttons
                    :options="liverButton"
                    :condition="scope.row.Operation"
                    :showAll="true"
                    @handleUpdateClick="handleLiverUpdate(scope.row)"
                    @handleDeleteClick="handleLiverDelete(scope.row)"
                  ></table-buttons>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="panel-title">出房人信息</div>
          <div class="panel-body form-item-sm">
            <el-form :model="ContractInfo" :inline="true" :rules="rules.rule4" status-icon ref="ruleForm4"
                     class="step1"
                     :disabled="IsSafeEdit"
                     label-width="140px">
              <div class="clearfix">
                <!--<el-form-item label="出房人主公司" prop="OutRoomCompanyID">-->
                <!--<el-select v-model="ContractInfo.OutRoomCompanyID" placeholder="请选择公司" @change="changeOutRoomCompany">-->
                <!--<el-option-->
                <!--:label="item.CompanyName"-->
                <!--:value="item.KeyID"-->
                <!--v-for="item in CompanyList"-->
                <!--:key="item.KeyID"-->
                <!--&gt;</el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="出房人" prop="OutRoomInfo" class="form-item-md">
                  <el-select
                    v-model="ContractInfo.OutRoomInfo"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入出房人姓名或电话"
                    :remote-method="outRoomInfoRemoteMethod"
                    :disabled="!ContractInfo.OutRoomCompanyID&&false"
                    @change="outRoomInfoChange"
                    :loading="OutRoomInfoLoading">
                    <el-option
                      v-for="item in OutRoomInfoResult"
                      :key="item.KeyID"
                      :label="item.UserName"
                      :value="item.KeyID">
                      <span style="float: left">{{ item.UserName }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px;margin-right: 20px">{{ item.Tel }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="clearfix block-center contract-btn-box">
            <el-button type="primary" @click="next(0)" v-if="!IsSafeEdit">下一步</el-button>
            <el-button type="primary" @click="createOrder('Save')" v-else
                       :loading="orderLoading">
              保存修改
            </el-button>
          </div>
        </template>
        <template slot="2">
          <el-form :model="ContractInfo" :inline="true" :rules="rules.rule3" status-icon ref="ruleForm3"
                   class="step2"
                   :disabled="IsSafeEdit"
                   label-width="140px">
            <div class="panel-title">租约信息</div>
            <div class="panel-body form-item-sm">
              <div class="clearfix">
                <el-form-item label="租期起止" prop="HostTimeMark">
                  <!-- <el-date-picker
                           v-model="ContractInfo.HostTimeMark"
                           type="daterange"
                           align="right"
                           unlink-panels
                           range-separator="至"
                           start-placeholder="托管开始日期"
                           end-placeholder="托管结束日期">
                   </el-date-picker>-->
                  <date-picker-range
                    v-model="ContractInfo.HostTimeMark"
                    range-separator="至"
                    start-placeholder="租约开始日期"
                    end-placeholder="租约结束日期"
                    :day="1"
                  ></date-picker-range>
                </el-form-item>
              </div>
              <div class="clearfix form-item-xs">
                <el-form-item label="付款方式" prop="DepositModel">
                  <span>押</span>
                  <el-select v-model="ContractInfo.DepositModel" placeholder="">
                    <el-option :label="1" :value="1"></el-option>
                    <el-option :label="2" :value="2"></el-option>
                    <el-option :label="3" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="PayModel">
                  <span class="ml-5">付</span>
                  <el-select v-model="ContractInfo.PayModel" placeholder="">
                    <el-option :label="1" :value="1"></el-option>
                    <el-option :label="2" :value="2"></el-option>
                    <el-option :label="3" :value="3"></el-option>
                    <el-option :label="4" :value="4"></el-option>
                    <el-option :label="5" :value="5"></el-option>
                    <el-option :label="6" :value="6"></el-option>
                    <el-option :label="7" :value="7"></el-option>
                    <el-option :label="8" :value="8"></el-option>
                    <el-option :label="9" :value="9"></el-option>
                    <el-option :label="10" :value="10"></el-option>
                    <el-option :label="11" :value="11"></el-option>
                    <el-option :label="12" :value="12"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="clearfix">
                <el-form-item label="房屋租金" prop="HouseRent">
                  <el-input v-model="ContractInfo.HouseRent"
                            type="number"
                            min="0"
                            max="100000"
                            @blur="calcPrice"
                            v-positive="ContractInfo.HouseRent"
                            placeholder="请输入金额（元/月）"></el-input>
                  <div class="el-form-item__error" v-show="showCalcPrice">
                    提示：该价格低于系统测算出房价格
                  </div>
                </el-form-item>
                <el-form-item label="房屋押金" prop="HouseDeposit">
                  <el-input v-model="ContractInfo.HouseDeposit"
                            type="number"
                            min="0"
                            max="100000"
                            v-positive="ContractInfo.HouseDeposit"
                            placeholder="请输入金额（元）"></el-input>
                </el-form-item>
              </div>
              <div class="clearfix form-item-xs">
                <el-form-item label="租金包含费用" prop="RentIncludeCost">
                  <el-checkbox-group v-model="RentIncludeCost" @change="rentIncludeCostChange">
                    <template v-for="item in RentIncludeCostList">
                      <el-checkbox
                        class="mr-15"
                        :label="item.Value"
                      >{{item.Description}}
                      </el-checkbox>
                      <el-input class="mr-25" type="number" v-model="RentIncludeInputCost[item.Value].val"
                                @blur="$positive(RentIncludeInputCost[item.Value],'val',0,false,1000000,null,true,true)"
                                v-show="RentIncludeInputCost[item.Value].show"></el-input>
                    </template>
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <div class="clearfix contract-agent">
                <el-checkbox v-model="ContractInfo.IsPayStageMark">是否分期</el-checkbox>
              </div>
              <template v-if="ContractInfo.IsPayStageMark">
                <div class="clearfix">
                  <el-form-item label="分期类型" prop="TenantStageType">
                    <el-select v-model="ContractInfo.TenantStageType" placeholder="请选择分期类型">
                      <el-option
                        :label="item.Description"
                        :value="item.Value"
                        v-for="item in TenantStageType"
                        :key="item.Value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="clearfix">
                  <el-form-item label="分期起止" prop="PayStageTimeMark">
                    <date-picker-range
                      v-model="ContractInfo.PayStageTimeMark"
                      range-separator="至"
                      start-placeholder="分期开始日期"
                      end-placeholder="分期结束日期"
                      :min="ContractInfo.HostTimeMark[0]"
                      :max="ContractInfo.HostTimeMark[1]"
                      :day="0"
                    ></date-picker-range>
                  </el-form-item>
                </div>
              </template>
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
                                type="number"
                                min="0"
                                max="100"
                                v-positive="ContractInfo.PayDaysMark[0]"
                                :disabled="ContractInfo.PayTimeType!=0"></el-input>
                      <span>天支付租金</span>
                    </el-radio>
                    <el-radio :label="1" class="contract-pay-time">
                      <span>固定</span>
                      <el-input v-model="ContractInfo.PayDaysMark[1]"
                                type="number"
                                min="1"
                                max="31"
                                v-positive="ContractInfo.PayDaysMark[1]"
                                :disabled="ContractInfo.PayTimeType!=1"></el-input>
                      <span>号支付租金（每期第一个月）</span>
                    </el-radio>
                    <el-radio :label="2" class="contract-pay-time">
                      <span>固定</span>
                      <el-input v-model="ContractInfo.PayDaysMark[2]"
                                type="number"
                                min="1"
                                max="31"
                                v-positive="ContractInfo.PayDaysMark[2]"
                                :disabled="ContractInfo.PayTimeType!=2"></el-input>
                      <span>号支付租金（每期提前一个月）</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div class="clearfix block-center contract-btn-box">
            <el-button type="info" @click="prev(1)" class="mr-20">上一步</el-button>
            <el-button type="primary" class="mr-20" @click="createOrder('TemporaryStorage',2)" v-if="!IsSafeEdit"
                       :loading="orderLoading">暂存
            </el-button>
            <el-button type="primary" @click="next(1)" :loading="billLoading">下一步</el-button>
          </div>
        </template>
        <template slot="3">
          <div class="panel-title">账单计划</div>
          <div class="panel-body">
            <bill-panel ref="billPanel" :disabled="IsSafeEdit" :data="BillList" :contract="ContractInfo"
                        :type="1"></bill-panel>
          </div>
          <div class="panel-title">
            <span>其他记账</span>
            <el-button class="ml-30" plain type="primary" @click="handleSettlementAdd" v-if="!IsSafeEdit">添加记账
            </el-button>
          </div>
          <div class="panel-body">
            <book-keeping :list="BookKeep" :disabled="IsSafeEdit"></book-keeping>
          </div>
          <div class="clearfix block-center contract-btn-box">
            <el-button type="info" @click="prev(2)" class="mr-20">上一步</el-button>
            <el-button type="primary" class="mr-20" @click="createOrder('TemporaryStorage',3)"
                       :loading="orderLoading" v-if="!IsSafeEdit">暂存
            </el-button>
            <el-button type="primary" @click="next(2)">下一步</el-button>
          </div>
        </template>
        <template slot="4">
          <el-form :model="ContractInfo" :inline="true"
                   class="step2"
                   :rules="rules.rule5"
                   ref="ruleForm5"
                   :disabled="IsSafeEdit"
                   label-width="140px">
            <!--<template v-if="houseConfigList.length>0">-->
            <!--<div class="panel-title">家具清单</div>-->
            <!--<div class="panel-body ">-->
            <!--<div class="roomConfig" v-for="(item,index) in houseConfigList" :key="index">-->
            <!--<div class="roomConfigLeft">-->
            <!--<span class="ConfigLeftTitle">-->
            <!--{{item.RoomName}}-->
            <!--</span>-->
            <!--</div>-->
            <!--<div class="roomConfigRight">-->
            <!--<span v-for="(cItem, cIndex) in item.Equipment" :key="cIndex">{{ cItem.EquipmentName }}</span>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
            <!--</template>-->
            <div class="panel-title">交割信息</div>
            <div class="panel-body">
              <div class="clearfix form-item-xs">
                <el-form-item label="水底数" label-width="80px" prop="WaterBaseNumber">
                  <el-input v-model="ContractInfo.WaterBaseNumber"
                            min="0"
                            v-positive="ContractInfo.WaterBaseNumber"
                            type="number"
                            :disabled="IsSafeEdit"
                            max="1000000"
                  ></el-input>
                  <span class="ml-5">吨</span>
                </el-form-item>
                <el-form-item label="电底数" prop="ElectricityBaseNumber">
                  <el-input v-model="ContractInfo.ElectricityBaseNumber"
                            min="0"
                            v-positive="ContractInfo.ElectricityBaseNumber"
                            type="number"
                            :disabled="IsSafeEdit"
                            max="1000000"
                  ></el-input>
                  <span class="ml-5">度</span>
                </el-form-item>
                <el-form-item label="气底数" prop="GasBaseNumber">
                  <el-input v-model="ContractInfo.GasBaseNumber"
                            min="0"
                            v-positive="ContractInfo.GasBaseNumber"
                            type="number"
                            :disabled="IsSafeEdit"
                            max="1000000"
                  ></el-input>
                  <span class="ml-5">立方米</span>
                </el-form-item>
              </div>
            </div>
            <div class="panel-title">装修情况</div>
            <div class="panel-body form-item-xs">
              <div class="clearfix" v-for="item in Decoration" :key="item.KeyID">
                <el-form-item label-width="80px" :label="item.Name" style="margin-bottom: 0;margin-top: -10px">
                  <el-checkbox-group v-model="TenDecoration" v-if="item.PDecoration">
                    <el-checkbox
                      v-for="cItem in item.PDecoration"
                      class="ml-15"
                      :label="cItem.KeyID"
                      :key="cItem.KeyID"
                    >{{cItem.Name}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </div>
            <div class="panel-title">房屋设备清单</div>
            <div class="panel-body">
              <input-number :list="TenantConTractQuipment" ref="inputNumber"></input-number>
            </div>
            <div class="panel-title">附加条款</div>
            <div class="panel-body form-item-lg">
              <div class="clearfix ml-20">
                <el-form-item>
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8}"
                    placeholder="请输入附加条款"
                    maxlength="400"
                    v-model="ContractInfo.TenantContractRemark">
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="clearfix">
              <el-form-item label="">
                <el-button class="ml-20" plain type="primary" @click="createOrder('Preview',4)" :loading="orderLoading">
                  预览合同
                </el-button>
              </el-form-item>
            </div>
          </el-form>
          <div class="clearfix block-center contract-btn-box">
            <el-button type="info" @click="prev()" class="mr-20">上一步</el-button>
            <template v-if="!IsSafeEdit">
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
                         v-show="ContractInfo.FirstInputTerminal===1&&TenantContractOperate.IsSigned==1"
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
    <live-people ref="LivePeople" @success="livePeopleSuccess"></live-people>
    <settlement ref="settlement" :bus-type="3" :api-type="0" @success="checkOutSuccess"></settlement>
  </div>
</template>
<style scoped lang="scss">
  @import "../../Owner/EditContract/style";
  @import "style";
</style>
<style lang="scss">
  @import "../../Owner/EditContract/global-style";
</style>
<script>
  import {
    editTenantContract,
    getContractDetail,
    getTenantBillNew,
    insertTenantContract,
    NewPreviewTenantContract,
    QueryHouseContractStatus,
    safeEditTenantContract
  } from '../../../api/tenant'
  import { searchHouseConfig } from '../../../api/house'
  import { getEmployeeInfoList, StateTenContract } from '../../../api/system'
  import { SearchHouse, Settlement, StepsBox, TableButtons } from '../../../components'
  import { BillPanel, BookKeeping, ContractTabs, InputNumber } from '../../Owner/EditContract/components'
  import { LivePeople } from './components'
  import { UploadFile } from '../../../components/UploadFile'
  import { validatePhone, validateCard } from '../../../utils/validate/rulevalidator'
  import uuid from '../../../utils/uuid'
  import { scrollToError } from '../../../utils/scrollToError'
  import { mapActions } from 'vuex'

  export default {
    components: {
      StepsBox,
      TableButtons,
      ContractTabs,
      UploadFile,
      BillPanel,
      BookKeeping,
      LivePeople,
      Settlement,
      SearchHouse,
      InputNumber
    },
    computed: {
      MaxLiverCount() {
        return new Array(30).fill('').map((x, i) => {
          return {
            label: i + 1 + '',
            value: i + 1
          }
        })
      },
      PassengerChannel() {
        const PassengerChannel = this.$EnumData.getEnumListByKey('PassengerChannel').slice()
        PassengerChannel[0].Description = '无'
        return PassengerChannel
      },
      Sex() {
        return this.$EnumData.getEnumListByKey('Sex')
      },
      RentIncludeCostList() {
        return this.$EnumData.getEnumListByKey('RentIncludeCost')
      },
      TenantStageType() {
        const TenantStageType = this.$EnumData.getEnumListByKey('TenantStageType').slice()
        TenantStageType.shift()
        return TenantStageType
      },
      IncreaseType() {
        const IncreaseType = this.$EnumData.getEnumListByKey('IncreaseType').slice()
        IncreaseType.splice(1, 1) // 删除掉不规则递增
        return IncreaseType
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
        } else {
          callback()
        }
      }
      return {
        showCalcPrice: false,
        detailLoading: false,
        billLoading: false,
        orderLoading: false,
        currentContractIndex: 0,
        query: this.$route.query, // KeyID,Renew,SafeEdit
        isEdit: this.$route.name === 'TenantEditContract',
        liverButton: [
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
        stepList: [
          {
            title: '完善承租人信息'
          }, {
            title: '完善租约信息'
          }, {
            title: '生成账单计划'
          }, {
            title: '完善附加计划'
          }],
        ContractInfo: {
          TenantPhone: '',
          TenantName: '',
          TenantCard: '',
          HostTimeMark: [],
          PayStageTimeMark: [],
          IsPayStageMark: false,
          PayDaysMark: ['15', '15', '15'],
          PayTimeType: 0,
          PaperType: 0,
          PayModel: 1,
          DepositModel: 1,
          HouseRent: 0,
          HouseDeposit: 0,
          IncreaseType: 0,
          IncreaseFrequency: 1,
          TenantSex: 0,
          PassengerChannel: 0,
          MaxLiverCount: 1,
          WaterBaseNumber: '',
          ElectricityBaseNumber: '',
          GasBaseNumber: ''
        }, // 合同信息
        HouseInfo: {}, // 房源信息
        LivePeopleInfoList: [
          {
            uuid: uuid(),
            LiverName: '',
            LiverPhone: '',
            LiverSex: 0,
            CardType: 1, // 默认身份证1
            CardID: '',
            IsTenant: 1,
            Operation: ['Delete']
          }
        ], // 入住人列表
        RentIncludeCost: [], //  租金项目
        RentIncludeInputCost: [], //  租金项目
        ImageUpload: [],
        ContractTemplate: [], // 合同模板
        BillList: [], // 账单信息
        BookKeep: [], // 其他记账
        OutRoomInfoList: [], // 出房人信息
        OutRoomInfoLoading: false, // 出房人搜索加载flag
        OutRoomInfoResult: [], // 出房人搜索结果
        TenantContractOperate: {}, // 合同操作表
        cloneData: {
          LivePeopleInfoList: [],
          ImageUpload: [],
          BookKeep: [],
          OutRoomInfoList: [],
          TenantBill: []
        }, // clone的旧数据
        billForm: {}, // 账单表单 用于对比是否修改了账单
        Decoration: [], // 所有装修情况数据
        TenDecoration: [], // 当前装修情况
        TenantConTractQuipment: [], // 房屋设备清单
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
            HouseName: [
              { required: true, message: '请输入房源名称', trigger: 'change' }
            ]
          },
          rule2: {
            TenantName: [
              { required: true, message: '请输入承租人姓名', trigger: 'blur' }
            ],
            TenantPhone: [
              { required: true, message: '请输入承租人电话', trigger: 'blur' },
              { validator: validatePhone, trigger: 'blur' }
            ],
            TenantCard: [
              { required: true, message: '请输入承租人身份证号', trigger: 'blur' },
              { validator: validateCard, trigger: 'blur' }
            ],
            TenantSex: [
              { required: true, message: '请选择承租人性别', trigger: 'change' }
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
            AgentCard: [
              { required: true, message: '请输入代办人身份证', trigger: 'blur' },
              { validator: validateCard, trigger: 'blur' }
            ]
          },
          rule3: {
            HostTimeMark: [
              { required: true, message: '请完善租期时间', trigger: 'change' }
            ],
            DepositModel: [
              { required: true, message: '请选择付款方式', trigger: 'change' }
            ],
            PayModel: [
              { required: true, message: '请选择付款方式', trigger: 'change' }
            ],
            HouseRent: [
              { required: true, message: '请输入房屋租金', trigger: 'blur' }
            ],
            HouseDeposit: [
              { required: true, message: '请输入房屋押金', trigger: 'blur' }
            ],
            PayStageTimeMark: [
              { required: true, message: '请完善分期时间', trigger: 'change' }
            ],
            TenantStageType: [
              { required: true, message: '请选择分期类型', trigger: 'change' }
            ],
            PayTimeType: [
              { validator: validatePayTime, trigger: 'change' }
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
            ]
          },
          rule4: {
            OutRoomCompanyID: [
              { required: true, message: '请选择出房人主公司', trigger: 'change' }
            ],
            OutRoomInfo: [
              { required: false, message: '请输入并选择出房人', trigger: 'blur' }
            ]
          },
          rule5: {
            WaterBaseNumber: [
              { required: true, message: '水底数不能为空', trigger: 'blur' }
            ],
            ElectricityBaseNumber: [
              { required: true, message: '电底数不能为空', trigger: 'blur' }
            ],
            GasBaseNumber: [
              { required: true, message: '气底数不能为空', trigger: 'blur' }
            ]
          }
        }
      }
    },
    created() {
      this.RentIncludeCostList.map(v => {
        this.RentIncludeInputCost[v.Value] = {
          show: false,
          val: 0
        }
      })
      this.fetchData()
      // if (this.query.SafeEdit) {
      //   this.$notify.warning({
      //     title: '提示',
      //     message: '只能修改图片'
      //   })
      // }
    },
    methods: {
      ...mapActions([
        'delView',
        'delCachedView',
        'setTenantPreview'
      ]),
      calcPrice() {
        this.$nextTick(() => {
          if (!this.ContractInfo.HouseRent) {
            this.showCalcPrice = false
            return
          }
          StateTenContract({
            HouseID: this.HouseInfo.KeyID,
            OuteRoom: this.ContractInfo.HouseRent
          }).then(({ BusCode }) => {
            if (BusCode === 1) {
              this.showCalcPrice = true
            } else {
              this.showCalcPrice = false
            }
          })
        })
      },
      fetchData() {
        console.log(this.query)
        // this.detailLoading = true
        getContractDetail({
          tenantID: this.query.KeyID || 0,
          houseID: this.query.HouseID || 0,
          orderID: this.query.OrderID || 0,
          type: 1
        }).then(({ Data }) => {
          this.detailLoading = false
          this.initPageData(Data)
        })
      },
      initPageData({ ContractTemplate, TenantContractInfo, HouseInfo, ImageUpload, LivePeopleInfoList, TenantBill, BookKeep, TenantContractOperate, OutRoominfoList, Decoration, TenDecoration, TenantConTractQuipment }) {
        this.ContractTemplate = ContractTemplate || []
        this.Decoration = Decoration || [] // 所有装修清单
        // this.ContractInfo.ContractTemplateName = ContractTemplate[0].ContractTemplateName // 默认合同模板
        this.ContractInfo = { ...this.ContractInfo, ContractTemplateName: ContractTemplate[0].ContractTemplateName }
        /* 续签删除账期和记账 */
        if (this.query.Renew) {
          TenantBill = []
          BookKeep = []
          if (TenantContractInfo) {
            TenantContractInfo.PaperType = 0
          }
        }
        if (HouseInfo) {
          this.handleHouseSelect(HouseInfo)
        }
        if (TenantBill && TenantBill.length > 0) {
          this.$refs.billPanel.initData(TenantBill)
          this.cloneData.TenantBill = TenantBill
        }
        if (ImageUpload) {
          this.ImageUpload = ImageUpload
          if (!this.query.Renew) {
            this.cloneData.ImageUpload = this.$deepCopy(ImageUpload)
          }
        }
        if (BookKeep && BookKeep.length > 0) {
          this.BookKeep = BookKeep
          if (!this.query.Renew) {
            this.cloneData.BookKeep = this.$deepCopy(BookKeep)
          }
        }
        if (TenantContractOperate) {
          this.TenantContractOperate = TenantContractOperate
        }
        if (TenantContractInfo) {
          if (!TenantContractInfo.IncreaseFrequency) {
            this.ContractInfo.IncreaseFrequency = 0
          }
          if (!TenantContractInfo.KeyID) {
            // 预定签合同 和房源签合同
            this.ContractInfo.TenantName = TenantContractInfo.TenantName
            this.ContractInfo.TenantPhone = TenantContractInfo.TenantPhone
            this.ContractInfo.TenantCard = TenantContractInfo.TenantCard
            this.ContractInfo.HouseRent = TenantContractInfo.HouseRent
            this.ContractInfo.HouseDeposit = TenantContractInfo.HouseDeposit
            this.ContractInfo.EntranceType = TenantContractInfo.EntranceType
            this.ContractInfo.EntranceID = TenantContractInfo.EntranceID || 0
            this.ContractInfo.PayModel = TenantContractInfo.PayModel || 3
            this.ContractInfo.StartTime = this.$dateFormat(TenantContractInfo.StartTime, 'yyyy-MM-dd 00:00:00')
            this.ContractInfo.EndTime = this.$dateFormat(TenantContractInfo.EndTime, 'yyyy-MM-dd 00:00:00')
            this.ContractInfo.HostTimeMark = [this.ContractInfo.StartTime, this.ContractInfo.EndTime]
            this.changeLivePeople()
            return
          }
          this.ContractInfo = { ...this.ContractInfo, ...TenantContractInfo }
          // 合同编号重置
          if (this.query.Renew) {
            this.ContractInfo.ContractNumber = ''
          }
          this.currentContractIndex = this.ContractInfo.PaperType
          // 代理人信息
          this.ContractInfo.IsAgent = this.ContractInfo.IsAgent === 1
          // 托管时间和分期时间
          this.ContractInfo.StartTime = this.$dateFormat(this.ContractInfo.StartTime, 'yyyy-MM-dd 00:00:00')
          this.ContractInfo.EndTime = this.$dateFormat(this.ContractInfo.EndTime, 'yyyy-MM-dd 00:00:00')
          this.ContractInfo.PayStageStartTime = this.$dateFormat(this.ContractInfo.PayStageStartTime, 'yyyy-MM-dd 00:00:00')
          this.ContractInfo.PayStageEndTime = this.$dateFormat(this.ContractInfo.PayStageEndTime, 'yyyy-MM-dd 00:00:00')
          // 是否分期
          this.ContractInfo.IsPayStageMark = this.ContractInfo.IsPayStage === 1
          if (this.query.Renew) {
            this.ContractInfo.HostTimeMark = [this.ContractInfo.EndTime, '']
            if (this.ContractInfo.IsPayStageMark) {
              this.ContractInfo.PayStageTimeMark = [this.ContractInfo.PayStageEndTime, '']
            }
          } else {
            // 暂存可能没有时间
            if (!this.ContractInfo.StartTime && !this.ContractInfo.EndTime) {
              this.ContractInfo.HostTimeMark = []
            } else {
              this.ContractInfo.HostTimeMark = [this.ContractInfo.StartTime, this.ContractInfo.EndTime]
            }
            if (this.ContractInfo.IsPayStageMark) {
              if (!this.ContractInfo.PayStageStartTime && !this.ContractInfo.PayStageEndTime) {
                this.ContractInfo.PayStageTimeMark = []
              } else {
                this.ContractInfo.PayStageTimeMark = [this.ContractInfo.PayStageStartTime, this.ContractInfo.PayStageEndTime]
              }
            }
          }
          // 租金包含费用
          let RentIncludeCost = []
          if (this.ContractInfo.RentIncludeCost) {
            try {
              RentIncludeCost = JSON.parse(this.ContractInfo.RentIncludeCost)
            } catch (e) {
              // 兼容之前的字符串
            }
          }
          this.RentIncludeCostList.map(v => {
            const item = RentIncludeCost.find(x => x.KeyID === v.Value)
            this.RentIncludeInputCost[v.Value] = {
              show: false,
              val: 0
            }
            if (item) {
              this.RentIncludeCost.push(item.KeyID - 0)
              this.RentIncludeInputCost[v.Value] = {
                show: true,
                val: item.Price
              }
            }
          })
          // 最晚付款日
          this.ContractInfo.PayDaysMark[this.ContractInfo.PayTimeType] = this.ContractInfo.PayDays
          this.saveBillForm()
        }
        if (LivePeopleInfoList && LivePeopleInfoList.length > 0) {
          if (!this.query.Renew) {
            this.cloneData.LivePeopleInfoList = this.$deepCopy(LivePeopleInfoList)
          }
          // 排序将承租人放在第一个
          LivePeopleInfoList.sort((a, b) => b.IsTenant - a.IsTenant)
          // 设置入住人的按钮信息
          LivePeopleInfoList.map(v => {
            if (v.IsTenant === 1) {
              v.Operation = ['Delete']
            } else {
              v.Operation = ['Update', 'Delete']
            }
            v.uuid = uuid()
          })
          this.LivePeopleInfoList = LivePeopleInfoList
        } else {
          this.LivePeopleInfoList[0].LiverName = this.ContractInfo.TenantName || ''
          this.LivePeopleInfoList[0].LiverPhone = this.ContractInfo.TenantPhone || ''
          this.LivePeopleInfoList[0].LiverSex = this.ContractInfo.TenantSex || ''
          this.LivePeopleInfoList[0].CardID = this.ContractInfo.TenantCard || ''
        }
        if (OutRoominfoList && OutRoominfoList.length > 0) {
          this.OutRoomInfoList = OutRoominfoList
          this.OutRoomInfoResult = OutRoominfoList
          this.ContractInfo.OutRoomCompanyID = 0 // OutRoominfoList[0].CompanyID
          this.ContractInfo.OutRoomInfo = OutRoominfoList.map(v => v.KeyID)
          if (!this.query.Renew) {
            this.cloneData.OutRoomInfoList = this.$deepCopy(OutRoominfoList)
          }
        }
        if (TenDecoration && TenDecoration.length > 0) {
          this.TenDecoration = TenDecoration.map(x => {
            return x.DecorationID
          })
        }
        if (TenantConTractQuipment && TenantConTractQuipment.length > 0) {
          this.TenantConTractQuipment = TenantConTractQuipment.map(x => {
            return {
              EquipmentName: x.QuipmentName,
              EquipmentNumber: x.Number
            }
          })
        }
      },
      saveBillForm() {
        const keys = [
          'StartTime',
          'EndTime',
          'HouseRent',
          'HouseDeposit',
          'DepositModel',
          'PayModel',
          'PayTimeType',
          'PayDays',
          'IsPayStageMark',
          'TenantStageType',
          'PayStageStartTime',
          'PayStageEndTime',
          'IncreaseType',
          'IncreaseFrequency',
          'IncreaseNum',
          'IncreaseMoney'
        ]
        keys.map(v => {
          this.billForm[v] = this.ContractInfo[v]
        })
      },
      resetBillForm() {
        if (this.ContractInfo.TenantStageType === 0) {
          this.ContractInfo.TenantStageType = 1
        }
        if (this.ContractInfo.IncreaseFrequency === 0) {
          this.ContractInfo.IncreaseFrequency = 1
        }
      },
      stepChange(step) {
        if (step === 2) {
          this.resetBillForm()
        } else if (step === 3) {
          if (this.query.OrderID || this.query.Renew) {
            let str = ''
            str += `<div style="text-align: center">该合同为<b>【${this.query.Renew ? '续约' : '预定'}】</b>合同<br/>`
            str += `您可能需要在第一期中添加一个明细<br/>`
            str += `<b>【支出-租客-${this.query.Renew ? '续约转押金' : '定金转租金'}】</b></div>`
            this.$alert(str, '温馨提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '我知道了'
            })
          }
        }
      },
      next(index) {
        console.log(this.OutRoomInfoList)
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
            if (flag === -1) {
              if (this.LivePeopleInfoList.length === 0) {
                this.$message.error('入住人信息不能为空！')
                return false
              }
              // if (this.ImageUpload.length === 0) {
              //   this.$message.error('附件不能为空！')
              //   return false
              // }
              // if (this.OutRoomInfoList.length === 0) {
              //   this.$message.error('出房人信息不能为空！')
              //   return false
              // }
              this.$refs.steps.nextStep()
            }
            break
          case 1:
            this.createBill()
            break
          case 2:
            this.$refs.billPanel.validate().then(() => {
              const text = this.$refs.billPanel.validateHoliday()
              if (text) {
                this.$confirm(text, '温馨提示', {
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: '下一步',
                  cancelButtonText: '返回修改'
                }).then(() => {
                  this.$refs.steps.nextStep()
                })
              } else {
                this.$refs.steps.nextStep()
              }
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
      rentIncludeCostChange() {
        for (const i in this.RentIncludeInputCost) {
          const v = this.RentIncludeInputCost[i]
          const index = this.RentIncludeCost.findIndex(x => x === +i)
          if (index >= 0) {
            v.show = true
          } else {
            v.show = false
            v.val = 0
          }
          this.$set(this.RentIncludeInputCost, i, v)
        }
      },
      changeLivePeople() {
        if (this.LivePeopleInfoList.find(v => v.IsTenant === 1)) {
          // 如果承租人没有被删除 排序后第一个为承租人
          const obj = {
            ...this.LivePeopleInfoList[0],
            ...{
              LiverName: this.ContractInfo.TenantName,
              LiverPhone: this.ContractInfo.TenantPhone,
              LiverSex: this.ContractInfo.TenantSex,
              CardID: this.ContractInfo.TenantCard,
              EmergencyContactName: this.ContractInfo.EmergencyContactName,
              EmergencyContactPhone: this.ContractInfo.EmergencyContactPhone
            }
          }
          this.$set(this.LivePeopleInfoList, 0, obj)
        }
      },
      handleHouseSelect(item) {
        this.HouseInfo = item
        if (!this.ContractInfo.KeyID) {
          // 新增的时候反绑房屋信息
          this.ContractInfo.DepositModel = this.HouseInfo.PledgeNumber
          this.ContractInfo.PayModel = this.HouseInfo.PayNumber
          this.ContractInfo.HouseRent = this.HouseInfo.RentMoeny
          this.ContractInfo.HouseDeposit = this.HouseInfo.Pledge
        }
        // 查询房源的合同状态
        this.searchHouseStatus()
        // 新增的时候获取房屋默认的设备清单
        this.searchHouseConfig()
      },
      searchHouseStatus() {
        if (this.query.SafeEdit) return
        debugger
        return QueryHouseContractStatus({
          HouseID: this.HouseInfo.KeyID,
          TenantID: (this.query.Renew ? '' : this.query.KeyID) || ''
        }).then(({ Data }) => {
          let str = ''
          if (Data.StandBy > 0) {
            str += `该房源有${Data.StandBy}条暂存的合同<br/>`
          }
          if (Data.WaitTenant > 0) {
            str += `该房源有${Data.WaitTenant}条待租客确认的合同<br/>`
          }
          if (Data.Success > 0) {
            str += `该房源有${Data.Success}条正在生效的合同<br/>`
          }
          if (Data.ToAudit > 0) {
            str += `该房源有${Data.ToAudit}条待审核的合同<br/>`
          }
          if (Data.Reject > 0) {
            str += `该房源有${Data.Reject}条审核未通过的合同<br/>`
          }
          if (str) {
            str += `<b>继续操作可能会导致重复录入</b>`
            this.$alert(str, '温馨提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '我知道了'
            })
          }
        })
      },
      searchHouseConfig() {
        if (this.query.KeyID) return
        // 获取房屋设备信息
        return searchHouseConfig({
          HouseID: this.HouseInfo.KeyID
        }).then(({ Data }) => {
          const list = []
          Data.forEach(x => {
            if (x.RoomName === this.HouseInfo.RoomName || x.RoomName === '公共') {
              x.Equipment.forEach(y => {
                list.push({
                  EquipmentName: y.EquipmentName,
                  EquipmentNumber: y.Number
                })
              })
            }
          })
          this.TenantConTractQuipment = list
        })
      },
      changeOutRoomCompany(val) {
        this.OutRoomInfoResult = []
        this.OutRoomInfoList = []
        this.ContractInfo.OutRoomInfo = []
      },
      outRoomInfoRemoteMethod(query) {
        if (query !== '') {
          this.OutRoomInfoLoading = true
          getEmployeeInfoList({
            parm: {
              page: 1,
              size: 10
            },
            Keyword: query,
            SelectByID: this.ContractInfo.OutRoomCompanyID
          }).then(({ Data }) => {
            this.OutRoomInfoLoading = false
            this.OutRoomInfoResult = Data
          })
        } else {
          this.OutRoomInfoResult = []
        }
      },
      outRoomInfoChange(data) {
        // 利用新增或者删除一个就会进入这个函数 不可能相等
        // 删除
        if (data.length < this.OutRoomInfoList.length) {
          this.OutRoomInfoList.map((v, i) => {
            if (!data.find(x => x === v.KeyID)) {
              this.OutRoomInfoList.splice(i, 1)
            }
          })
        } else {
          // 新增
          const id = data[data.length - 1]
          const item = this.OutRoomInfoResult.find(x => x.KeyID === id)
          this.OutRoomInfoList.push({
            KeyID: item.KeyID,
            UserName: item.UserName,
            Tel: item.Tel,
            FullID: item.FullID,
            FullIDNew: item.FullIDNew,
            CompanyID: item.CompanyID
          })
        }
      },
      changePayTime(val) {
        this.ContractInfo.PayDaysMark.map((v, i) => {
          if (i !== val) {
            this.$set(this.ContractInfo.PayDaysMark, i, '')
          }
        })
      },
      buildBillData() {
        // 组装数据
        const model = this.ContractInfo
        model.StartTime = this.$dateFormat(model.HostTimeMark[0], 'yyyy-MM-dd 00:00:00')
        model.EndTime = this.$dateFormat(model.HostTimeMark[1], 'yyyy-MM-dd 00:00:00')
        model.PayDays = model.PayDaysMark[model.PayTimeType]
        if (model.IsPayStageMark) {
          model.PayStageStartTime = this.$dateFormat(model.PayStageTimeMark[0], 'yyyy-MM-dd 00:00:00')
          model.PayStageEndTime = this.$dateFormat(model.PayStageTimeMark[1], 'yyyy-MM-dd 00:00:00')
        } else {
          model.PayStageStartTime = '2001-01-01 00:00:00'
          model.PayStageEndTime = '2001-01-01 00:00:00'
          model.TenantStageType = 0
        }
        // 是否分期
        model.IsPayStage = model.IsPayStageMark ? 1 : 0
        // 递增方式为不递增 不规则递增时 不能有 递增次数 递增年 递增值
        if (model.IncreaseType < 2) {
          model.IncreaseFrequency = 0
          model.IncreaseNum = 0
          model.IncreaseMoney = 0
        }
      },
      createBill() {
        this.$refs['ruleForm3'].validate((valid, fileds) => {
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
            scrollToError(fileds, this.$refs['ruleForm3'], -10)
          }
        })
      },
      getBillList() {
        this.billLoading = true
        getTenantBillNew(this.ContractInfo).then(({ Data, BusCode, Msg }) => {
          this.billLoading = false
          if (BusCode === 0) {
            this.$refs.billPanel.initData(Data, this.cloneData.TenantBill)
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
        if (flag) return
        if ((type === 'Save' || type === 'SignUp' || type === 'SubmitAudit')) {
          if (!this.$refs.inputNumber.validate()) {
            this.$message.error('请检查设备信息是否填写完整')
            return
          }
        }
        // 合同模板
        this.ContractInfo.ContractTemplateUrl = this.ContractTemplate.find(v => v.ContractTemplateName === this.ContractInfo.ContractTemplateName).ContractTemplateUrl
        // 租金包含费用
        const RentIncludeCost = this.RentIncludeCost.map(v => {
          return {
            KeyID: +v,
            Price: this.RentIncludeInputCost[v].val
          }
        })
        this.ContractInfo.RentIncludeCost = JSON.stringify(RentIncludeCost)
        // 代办人信息
        this.ContractInfo.IsAgent = this.ContractInfo.IsAgent ? 1 : 0
        // 对比数据比较出ModifyStatus
        const LivePeopleInfoList = this.$DiffArrFn(this.cloneData.LivePeopleInfoList, this.LivePeopleInfoList, [
          'LiverName',
          'LiverPhone',
          'LiverSex',
          'CardID',
          'EmergencyContactName',
          'EmergencyContactPhone'
        ])
        const ImageUpload = this.$DiffArrFn(this.cloneData.ImageUpload, this.ImageUpload, [
          'ImageLocation'
        ])
        const BookKeep = this.$DiffArrFn(this.cloneData.BookKeep, this.BookKeep)
        const OutRoominfoList = this.$DiffArrFn(this.cloneData.OutRoomInfoList, this.OutRoomInfoList)
        const TenantBill = this.$refs.billPanel.getValue()
        // 装修清单兼容
        const TenDecoration = this.TenDecoration.map(x => {
          return {
            DecorationID: x
          }
        })
        // 房屋设备清单兼容
        const TenantConTractQuipment = this.TenantConTractQuipment.map(x => {
          return {
            QuipmentName: x.EquipmentName,
            Number: x.EquipmentNumber
          }
        })
        // 强制修改 InputTerminal
        this.ContractInfo.InputTerminal = 0
        this.ContractInfo.TenantCard = this.ContractInfo.TenantCard.toUpperCase()
        // 续约加字段
        if (this.query.Renew) {
          this.ContractInfo.RenewalID = this.query.KeyID
        }
        const param = {
          tenantContractModel: {
            TenantContractInfo: this.ContractInfo,
            HouseInfo: this.HouseInfo,
            HouseEquipment: this.HouseEquipment,
            TenantBill,
            LivePeopleInfoList,
            ImageUpload,
            BookKeep,
            OutRoominfoList,
            TenDecoration,
            TenantConTractQuipment
          },
          buttonType: type === 'Preview' ? 'TemporaryStorage' : type,
          TenantPreviewID: JSON.parse(sessionStorage.getItem('tenantPreviewID')) || 0
        }
        let fn = insertTenantContract
        if (this.isEdit) {
          fn = editTenantContract
        }
        if (this.query.SafeEdit) {
          fn = safeEditTenantContract
        }
        this.orderLoading = true
        if (type === 'Preview') {
          NewPreviewTenantContract(param).then(res => {
            if (res.Code === 0 && res.Data) {
              this.orderLoading = false
              this.PreviewID = res.Data.KeyID
              sessionStorage.setItem('tenantPreviewID', this.PreviewID)
              this.$router.push({
                path: '/Tenant/ContractPreview',
                query: {
                  KeyID: res.Data.KeyID
                }
              })
            } else {
              this.orderLoading = false
              console.log('预览合同失败:')
            }
            console.log('租客res:', res)
          })
          // // 预览了就存起来了
          // this.setTenantPreview(param).then(() => {
          //   this.orderLoading = false
          //   this.$router.push({
          //     path: '/Tenant/ContractPreview',
          //     query: {
          //       KeyID: this.query.KeyID
          //     }
          //   })
          // }).catch((error) => {
          //   console.log('error:', error)
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
                path: '/Tenant/ContractList'
              })
            } else if (type === 'TemporaryStorage') {
              this.$message.success('暂存合同成功')
              this.delView(this.$route)
              this.$router.push({
                path: '/Tenant/ContractList'
              })
            } else if (type === 'SignUp') {
              this.delView(this.$route)
              if (this.query.SafeEdit) {
                this.$message.success('保存合同成功')
                this.$router.push({
                  path: '/Tenant/ContractList'
                })
              } else {
                this.$message.success('保存合同成功,正在进行现场签字')
                this.$router.push({
                  path: '/Tenant/ContractSign',
                  query: {
                    Mobile: this.ContractInfo.TenantPhone,
                    IDCard: this.ContractInfo.TenantCard,
                    Name: this.ContractInfo.TenantName,
                    ContractID: Data,
                    type: 1
                  }
                })
              }
            } else if (type === 'SubmitAudit') {
              this.$message.success('保存合同成功,合同已提交审核')
              this.delView(this.$route)
              this.$router.push({
                path: '/Tenant/ContractList'
              })
            }
          }).catch(() => {
            this.orderLoading = false
          })
        }
      },
      handleLiverAdd() {
        this.$refs['LivePeople'].open()
      },
      handleLiverUpdate(row) {
        this.$refs['LivePeople'].open(row)
      },
      handleLiverDelete(row) {
        const index = this.LivePeopleInfoList.findIndex(v => v.uuid === row.uuid)
        this.LivePeopleInfoList.splice(index, 1)
      },
      livePeopleSuccess(data) {
        const index = this.LivePeopleInfoList.findIndex(v => v.uuid === data.uuid)
        if (index === -1) {
          data.uuid = uuid()
          data.Operation = ['Update', 'Delete']
          this.LivePeopleInfoList.push(data)
        } else {
          this.$set(this.LivePeopleInfoList, index, data)
        }
      },
      handleSettlementAdd() {
        this.$refs['settlement'].open({
          BookKeepPara: {
            HouseName: this.HouseInfo.HouseName,
            HouseID: this.HouseInfo.KeyID,
            HouseKey: this.HouseInfo.HouseKey,
            uuid: uuid()
          },
          type: 0
        })
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
