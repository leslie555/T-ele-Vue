<template>
  <div class="app-container">
    <!-- 第一行 -->
    <el-row :gutter="20">
      <!-- 左侧 -->
      <el-col class="Home_oneLine">
        <el-row class="homePagePanel">
          <div class="echartTitle">
            <h4 class="homePageCommonTitle">房源概况</h4>
            <span type="text" class="homePageTitleRight homePageTitleRightGray">单位: 套/间</span>
          </div>
          <div class="echartListBox">
            <div class="houseInfoBox">
              <!-- <div class="houseInfoLeft" ref="houseInfoLeft"></div> -->
              <div class="houseInfoRight">
                <div class="houseInfoList" v-for="(item, index) in houseInfoList" :key="index">
                  <div class="houseInfoTopTop" :style="{color: item.color}">{{ item.total }}</div>
                  <div class="houseInfoTop" :style="{background: item.color}">
                    <p>{{item.name}}</p>
                    <p v-if="index === 2 || index === 3">{{item.name2}}</p>
                  </div>
                  <div
                    :class="['houseInfoBottom', item[`label3`] === '' ? 'houseInfoBottomBigPadding' : '']"
                  >
                    <div
                      class="houseInfoBottomItem"
                      v-for="labelIndex in 3"
                      :key="labelIndex"
                      v-if="item[`label${labelIndex}`] !== ''"
                    >
                      <div
                        class="houseInfoLabel"
                        :style="{color: item.color}"
                      >{{ item[`label${labelIndex}`] }}</div>
                      <div
                        class="houseInfoValue"
                        :style="{color: item.color}"
                      >{{ item[`value${labelIndex}`] }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-row>
      </el-col>
      <!-- 中间 -->
      <el-col class="Home_twoLine">
        <el-row class="homePagePanel">
          <div class="echartTitle">
            <h4 class="homePageCommonTitle">空置预警</h4>
            <!-- <el-button></span> -->
            <div class="homePageTitleRightBox">
              <span class="homePageTitleRight homePageTitleRightGray">单位: 套/间</span>
              <el-button
                v-if="showControlBox['VacantReport']"
                type="text"
                class="homePageRightBtn"
                @click="toReportDetail('Business/VacantReport')"
              >{{`更多>>`}}</el-button>
            </div>
          </div>
          <div class="echartListBox" ref="EmptyLineBox"></div>
        </el-row>
      </el-col>
      <!-- 右侧 -->
      <el-col class="Home_threeLine">
        <!-- 备忘录 -->
        <div class="homePagePanel">
          <div class="RamarkTitle">
            <h4 class="homePageCommonTitle">我的待办</h4>
            <el-date-picker
              type="date"
              v-model="remarkRange"
              size="small"
              style="width: 150px;"
              @change="GetRemark"
            ></el-date-picker>
            <el-button type="text" style="float: right; margin-right: 10px;" @click="OpenAddForm">新增</el-button>
          </div>
          <div class="RamarkListBox">
            <div class="RamarkList" v-for="(item, index) in RemarkList" :key="index">
              <div class="RamarkListTitle">
                <span class="title" :title="item.Content">{{ item.Content }}</span>
                <div>
                  <i class="iconfont icon-shanchu" @click="delRemark(item.KeyID, index)"></i>
                  <i class="iconfont icon-bianji" @click="editRemark(item.KeyID, item)"></i>
                </div>
              </div>
              <div class="RamarkListMsg">{{ $dateFormat(item.MemoTime, 'yyyy-MM-dd hh:mm') }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 第二行 -->
    <el-row :gutter="20">
      <el-col :span="13">
        <el-row class="homePagePanel">
          <div class="echartTitle">
            <h4 class="homePageCommonTitle">业绩概况</h4>
            <!-- <el-button></span> -->
            <div class="homePageTitleRightBox">
              <span class="homePageTitleRight homePageTitleRightGray">单位: 套/间</span>
            </div>
          </div>
          <div class="echartListBox">
            <div class="flexBetweenBox">
              <div class="flexItem" v-for="(item, index) in takeHouseList" :key="index">
                <div class="flexTop">{{ item.name }}</div>
                <div :class="['flexMiddle', `title${item.index}`]">
                  <img :src="require(`../../assets/HomePage/${ index }.png`)" alt>
                </div>
                <div class="flexBottom">
                  <div class="flexBottomItem">
                    <div class="flexBottomLabel">今日</div>
                    <div class="flexBottomValue">{{ item.Today }}</div>
                  </div>
                  <div class="flexBottomItem">
                    <div class="flexBottomLabel">本周</div>
                    <div class="flexBottomValue">{{ item.ThisWeek }}</div>
                  </div>
                  <div class="flexBottomItem">
                    <div class="flexBottomLabel">本月</div>
                    <div class="flexBottomValue">{{ item.ThisMonth }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-row>
      </el-col>
      <el-col :span="11">
        <el-row class="homePagePanel">
          <div class="echartTitle homePageTitleBorder">
            <h4 class="homePageCommonTitle">收租逾期</h4>
            <!-- <el-button></span> -->
            <div class="homePageTitleRightBox">
              <span class="homePageTitleRight homePageTitleRightGray">单位: 元</span>
              <el-button
                type="text"
                class="homePageRightBtn"
                v-if="showControlBox['RentCollectionOverdue']"
                @click="toReportDetail('Finance/RentCollectionOverdue')"
              >{{`更多>>`}}</el-button>
            </div>
          </div>
          <div class="echartListBox" ref="OverTimeBarBox"></div>
        </el-row>
      </el-col>
    </el-row>
    <!-- 第三行 -->
    <el-row :gutter="20">
      <el-col :span="13">
        <el-row class="homePagePanel">
          <div class="echartTitle">
            <h4 class="homePageCommonTitle">财务概况</h4>
            <!-- <el-button></span> -->
            <div class="homePageTitleRightBox">
              <div class="btnBox">
                <span
                  :class="['ehartsBtn', 'PayBtn', activeMoneyType === 0 ? 'active' : '']"
                  style="left: 0;"
                  @click="ChangeMoneyType(0)"
                >收入</span>
                <span
                  :class="['ehartsBtn', 'PayBtn', activeMoneyType === 1 ? 'active' : '']"
                  style="left: 60px;"
                  @click="ChangeMoneyType(1)"
                >支出</span>
              </div>
              <span class="homePageTitleRight homePageTitleRightGray">单位: 元</span>
            </div>
          </div>
          <div class="echartListBox" ref="MoneyInfoLineBox"></div>
        </el-row>
      </el-col>
      <el-col :span="11">
        <el-row class="homePagePanel">
          <div class="echartTitle homePageTitleBorder">
            <div class="homePageTitleFlexBox">
              <h4
                :class="['homePageTitleFlex', activeTakeHouse === 0 ? 'active' : '']"
                @click="ChangeTakeHouse(0)"
              >近六月出房业绩</h4>
              <h4
                :class="['homePageTitleFlex', activeTakeHouse === 1 ? 'active' : '']"
                @click="ChangeTakeHouse(1)"
              >近六月拿房业绩</h4>
            </div>
            <div class="homePageTitleMiddle">
              <div class="middleBox">
                <div class="middleBefore" style="background: #389ef2"></div>
                <div class="middleValue" style="color: #389ef2">新出</div>
              </div>
              <div class="middleBox">
                <div class="middleBefore" style="background: #fdb44b"></div>
                <div class="middleValue" style="color: #fdb44b">续租</div>
              </div>
            </div>
            <div class="homePageTitleRightBox">
              <span class="homePageTitleRight homePageTitleRightGray">单位: 间</span>
              <el-button
                v-if="showControlBox['EarningReports']"
                type="text"
                class="homePageRightBtn"
                @click="toReportDetail('Business/EarningReports')"
              >{{`更多>>`}}</el-button>
            </div>
          </div>
          <div class="echartListBox" ref="GetAcount"></div>
        </el-row>
      </el-col>
    </el-row>
    <!-- 第四行 -->
    <el-row :gutter="20">
      <el-col :span="13">
        <el-row class="homePagePanel">
          <div class="echartTitle">
            <h4 class="homePageCommonTitle">合同管理</h4>
            <!-- <el-button></span> -->
            <div class="homePageTitleRightBox">
              <div class="btnBox">
                <span
                  :class="['ehartsBtn', 'PayBtn', activeContract === 1 ? 'active' : '']"
                  style="left: 0;"
                  @click="ChangeContractData(1)"
                >租客</span>
                <span
                  :class="['ehartsBtn', 'PayBtn', activeContract === 2 ? 'active' : '']"
                  style="left: 60px;"
                  @click="ChangeContractData(2)"
                >业主</span>
              </div>
            </div>
          </div>
          <div class="echartListBox">
            <div class="flexBetweenBox">
              <div class="flexItem">
                <div :class="['flexContractMiddle', `title1`]">
                  <span>{{ ContractData[activeContract - 1].ExpireSoonNumber }}</span>
                </div>
                <div class="flexContractBottom">
                  <span>快到期(30)</span>
                </div>
              </div>
              <div class="flexItem">
                <div :class="['flexContractMiddle', `title2`]">
                  <span>{{ ContractData[activeContract - 1].ExpiredNumber }}</span>
                </div>
                <div class="flexContractBottom">
                  <span>已到期</span>
                </div>
              </div>
              <div class="flexItem">
                <div :class="['flexContractMiddle', `title3`]">
                  <span>{{ `${ContractData[activeContract - 1].RenewalRate}%` }}</span>
                </div>
                <div class="flexContractBottom">
                  <span>本月续租率</span>
                </div>
              </div>
              <div class="flexItem">
                <div :class="['flexContractMiddle', `title4`]">
                  <span>{{ `${ContractData[activeContract - 1].DefaultRate}%` }}</span>
                </div>
                <div class="flexContractBottom">
                  <span>本月违约率</span>
                </div>
              </div>
            </div>
          </div>
        </el-row>
      </el-col>
      <el-col :span="11">
        <el-row class="homePagePanel">
          <div class="echartTitle homePageTitleBorder">
            <div class="homePageTitleFlexBox">
              <h4
                :class="['homePageTitleFlex', activeYeji === 0 ? 'active' : '']"
                @click="ChangeYejiHouse(0)"
              >出房业绩月排名</h4>
              <h4
                :class="['homePageTitleFlex', activeYeji === 1 ? 'active' : '']"
                @click="ChangeYejiHouse(1)"
              >拿房业绩月排名</h4>
            </div>
            <!-- <el-button></span> -->
            <div class="homePageTitleRightBox">
              <div class="btnBox">
                <span
                  :class="['ehartsBtn', 'PayBtn', OrderIndex === 0 ? 'active' : '']"
                  style="left: 0;"
                  @click="ChangeOrderIndex(0)"
                >正序</span>
                <span
                  :class="['ehartsBtn', 'PayBtn', OrderIndex === 1 ? 'active' : '']"
                  style="left: 60px;"
                  @click="ChangeOrderIndex(1)"
                >倒序</span>
              </div>
              <span class="homePageTitleRight homePageTitleRightGray">单位: 间</span>
              <el-button
                v-if="showControlBox['EarningReports']"
                type="text"
                class="homePageRightBtn"
                @click="toReportDetail('Business/EarningReports')"
              >{{`更多>>`}}</el-button>
            </div>
          </div>
          <div class="echartListBox" ref="RecentTimeBox"></div>
        </el-row>
      </el-col>
    </el-row>
    <!-- 第五行 -->
    <el-row :gutter="20">
      <el-col :span="13">
        <el-row class="homePagePanel">
          <div class="echartTitle">
            <h4 class="homePageCommonTitle">拿房统计</h4>
            <div class="homePageTitleMiddle">
              <div class="middleBox">
                <div class="middleBefore" style="background: #34b8f0"></div>
                <div class="middleValue" style="color: #34b8f0">{{ takeHouseNameList[0] }}</div>
              </div>
              <div class="middleBox">
                <div class="middleBefore" style="background: #3cd8c0"></div>
                <div class="middleValue" style="color: #3cd8c0">{{ takeHouseNameList[1] }}</div>
              </div>
              <div class="middleBox">
                <div class="middleBefore" style="background: #fe9875"></div>
                <div class="middleValue" style="color: #fe9875">{{ takeHouseNameList[2] }}</div>
              </div>
            </div>
            <div class="homePageTitleRightBox">
              <span class="homePageTitleRight homePageTitleRightGray">单位: 套</span>
              <el-button
                v-if="showControlBox['TakeHouseReports']"
                type="text"
                class="homePageRightBtn"
                @click="toReportDetail('Business/TakeHouseReports')"
              >{{`更多>>`}}</el-button>
            </div>
          </div>
          <div class="echartListBox" ref="takeHouseCountBox"></div>
        </el-row>
      </el-col>
      <el-col :span="11">
        <el-row class="homePagePanel">
          <div class="echartTitle homePageTitleBorder">
            <h4 class="homePageCommonTitle">获客统计</h4>
            <!-- <el-button></span> -->
            <div class="homePageTitleRightBox">
              <div class="btnBox">
                <span
                  :class="['ehartsBtn', 'PayBtn', activeGetCount === 1 ? 'active' : '']"
                  style="left: 0;"
                  @click="ChangeGetCount(1)"
                >出房</span>
                <span
                  :class="['ehartsBtn', 'PayBtn', activeGetCount === 2 ? 'active' : '']"
                  style="left: 60px;"
                  @click="ChangeGetCount(2)"
                >拿房</span>
              </div>
              <span class="homePageTitleRight homePageTitleRightGray">单位: 个</span>
              <el-button
                type="text"
                v-if="showControlBox['GetGuestCollection']"
                class="homePageRightBtn"
                @click="toReportDetail('Other/GetGuestCollection')"
              >{{`更多>>`}}</el-button>
            </div>
          </div>
          <div class="echartListBox" ref="GetCountBox"></div>
        </el-row>
      </el-col>
    </el-row>
    <add-remark ref="homeAddRemark" @changeData="GetRemark"></add-remark>
  </div>
</template>
<script>
import addRemark from './components/addForm'
import { HomeReport, ShowHouseCustomerReport, FindMemo, DelMemoByID, SelectIncomeOrPayViewAll, SelectTakeOrOutRank, SelectTakeOroutPerformance } from '@/api/homePage'
import { mapActions, mapGetters } from 'vuex'
var echarts = require('echarts')

export default ({
  name: 'homePage',
  components: {
    addRemark
  },
  data() {
    return {
      // 按钮操作控制
      activeMoneyType: 0,
      // 拿房出房
      activeTakeHouse: 0,
      // 业绩排行
      activeYeji: 0,
      // 合同
      activeContract: 1,
      // 获客统计
      activeGetCount: 1,
      // 拿房统计图例名字
      takeHouseNameList: [],
      AllCount: 0,
      ContractData: [
        {
          ExpireSoonNumber: 0,
          ExpiredNumber: 0,
          RenewalRate: 0,
          DefaultRate: 0
        },
        {
          ExpireSoonNumber: 0,
          ExpiredNumber: 0,
          RenewalRate: 0,
          DefaultRate: 0
        }
      ],
      // 控制显示
      showControlBox: {
        VacantReport: false,
        RentCollectionOverdue: false,
        EarningReports: false,
        TakeHouseReports: false,
        GetGuestCollection: false
      },
      // 收入支出
      PaySaveIndex: 0,
      // 租客业主
      OwnerIndex: 0,
      // 正序倒序
      OrderIndex: 0,
      // 业绩
      GetAcountIndex: 0,
      // 业绩概况
      takeHouseList: [
        {
          index: 1,
          name: '出房',
          Today: 0,
          ThisWeek: 0,
          ThisMonth: 0
        },
        {
          index: 2,
          name: '拿房',
          Today: 0,
          ThisWeek: 0,
          ThisMonth: 0
        },
        {
          index: 3,
          name: '预定',
          Today: 0,
          ThisWeek: 0,
          ThisMonth: 0
        },
        {
          index: 4,
          name: '租客续约',
          Today: 0,
          ThisWeek: 0,
          ThisMonth: 0
        }
      ],
      // busMoneyIndex: 0,
      // 房源概况
      houseInfoList: [
        {
          total: 0,
          name: '整租',
          color: '#389ef2',
          label1: '已租',
          label2: '已定',
          label3: '',
          value1: '0',
          value2: '0',
          value3: '0'
        },
        {
          total: 0,
          name: '合租',
          color: '#fdb44b',
          label1: '已租',
          label2: '已定',
          label3: '',
          value1: '0',
          value2: '0',
          value3: '0'
        },
        {
          total: 0,
          name: '整租',
          name2: '空置',
          color: '#389ef2',
          label1: '空置率',
          label2: '装修中',
          label3: '装修率',
          value1: '0',
          value2: '0',
          value3: '0'
        },
        {
          total: 0,
          name: '合租',
          name2: '空置',
          color: '#fdb44b',
          label1: '空置率',
          label2: '装修中',
          label3: '装修率',
          value1: '0',
          value2: '0',
          value3: '0'
        }
      ],
      // 代办列表
      RemarkList: [],
      PayOrder: true,
      MoneyOrder: true,
      remarkRange: '',
      addRemarkVisible: false,
      // 时间控件参数
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 3600 * 1000 * 24 < Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
            console.log(date)
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      // 房源概况
      InfoOption: {
        grid: {
          top: 30,
          bottom: 30,
          left: 30,
          right: 30
        },
        title: {
          text: '0',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#6eb5fc',
            fontSize: 14
          }
        },
        color: ['#fdb44b', '#389ef2'],
        tooltip: {
          trigger: 'item',
          formatter: function(params, ticket, callback) {
            // debugger
            const data = params.data
            var showHtm = ''
            // showHtm += `${data.name}${data.value}<br>`
            showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${data.color}; margin-right: 2px"></span>${data.name}: ${data.value}%`
            return showHtm
          }
        },
        series: [
          {
            name: '总次数',
            type: 'pie',
            radius: ['45%', '62%'],
            label: {
              fontSize: 12,
              show: true,
              normal: {
                formatter(v) {
                  const text = v.name
                  return `${text.slice(0, 2)}\n${text.slice(2)}`
                }
              }
            },
            roseType: 'radius',
            labelLine: {
              length: 5,
              length2: 5
            },
            data: [
              {
                value: 0,
                name: '合租',
                color: '#fdb44b'
              },
              {
                value: 0,
                name: '整租',
                color: '#389ef2'
              }
            ]
          }
        ]
      },
      // 空置
      EmptyOption: {
        grid: {
          top: 20,
          bottom: 20,
          left: 18,
          right: 25,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params, ticket, callback) {
            // debugger
            const data = params[0].data
            var showHtm = ''
            showHtm += `空置<br>`
            // showHtm += `<span style="<displa></displa>y: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ff5959; margin-right: 2px"></span>占比: ${data.VancantRate}%<br>`
            showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ff5959; margin-right: 2px"></span>整租: ${data.VancantAllCount}<br>`
            showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ff5959; margin-right: 2px"></span>合租: ${data.VancantPartCount}`
            return showHtm
          }
        },
        // legend: {
        //   data: ['出房', '拿房', '闲置'],
        //   top: 10
        // },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#666666',
              interval: 0
            },
            data: ['0-7天', '8-15天', '16-20天', '21-30天', '31-50天', '50天以上']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#389ef2'
              }
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#eeeeee']
              }
            }
          }
        ],
        series: [
          {
            name: '出房',
            type: 'line',
            label: {
              show: true,
              position: 'top'
            },
            lineStyle: {
              color: '#ff5959'
            },
            itemStyle: {
              color: '#ff5959'
            },
            // smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#ff5959'
              }, {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }])
            },
            data: [
              {
                value: 1,
                VancantRate: '10%',
                VancantAllCount: 20,
                VancantPartCount: 20
              },
              {
                value: 9,
                VancantRate: '10%',
                VancantAllCount: 20,
                VancantPartCount: 20
              },
              {
                value: 5,
                VancantRate: '10%',
                VancantAllCount: 20,
                VancantPartCount: 20
              },
              {
                value: 6,
                VancantRate: '10%',
                VancantAllCount: 20,
                VancantPartCount: 20
              },
              {
                value: 7,
                VancantRate: '10%',
                VancantAllCount: 20,
                VancantPartCount: 20
              },
              {
                value: 8,
                VancantRate: '10%',
                VancantAllCount: 20,
                VancantPartCount: 20
              },
              {
                value: 6,
                VancantRate: '10%',
                VancantAllCount: 20,
                VancantPartCount: 20
              }
            ]
          }
        ]
      },
      // 收租逾期
      OverTimeOption: {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: 10,
          right: 20,
          bottom: 10,
          top: 20,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['今天', '1-3天', '4-7天', '8-10天', '11-15天', '15天以上'],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: '#666666',
              interval: 0
            },
            axisLine: {
              lineStyle: {
                color: '#389ef2'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#389ef2'
              }
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '共计',
            type: 'bar',
            label: {
              show: true,
              position: 'top'
            },
            barWidth: '25%',
            data: [0, 0, 0, 0, 0, 0]
          }
        ]
      },
      // 近六月出房拿房
      RecentTimeOption: {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: 10,
          right: 20,
          bottom: 10,
          top: 20,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: '#666666',
              interval: 0
            },
            axisLine: {
              lineStyle: {
                color: '#389ef2'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#389ef2'
              }
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '业绩',
            type: 'bar',
            label: {
              show: true,
              position: 'top'
            },
            barWidth: '25%',
            data: []
          }
        ]
      },
      // 财务概况
      MoneyInfoOption: {
        grid: {
          top: 20,
          bottom: 20,
          left: 15,
          right: 25,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params, ticket, callback) => {
            // debugger
            const data = params[0].data
            var showHtm = ''
            if (this.activeMoneyType === 0) {
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>租客租金: ${data.TenantRentRate}% (${data.TenantRent})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>租客押金: ${data.TenantDepositRate}% (${data.TenantDeposit})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>定金违约: ${data.DepositDefaultRate}% (${data.DepositDefault})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>租客违约: ${data.TenantDefaultRate}% (${data.TenantDefault})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>业主付装修费: ${data.OwnerPaysDecorationFeeRate}% (${data.OwnerPaysDecorationFee})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>租客到期(损坏等扣费): ${data.OwnerPaysDecorationFeeRate}% (${data.TenantExpireMoney})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>其他: ${data.OtherInComeRate}% (${data.OtherInCome})<br>`
            } else {
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>业主租金: ${data.OwnerRentRate}% (${data.OwnerRent})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>升级改造费: ${data.UpgradingFeeRate}% (${data.UpgradingFee})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>维修保护: ${data.RepairAndCleanFeeRate}% (${data.RepairAndCleanFee})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>员工奖励: ${data.EmployeeAwardFeeRate}% (${data.EmployeeAwardFee})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>押金退款: ${data.DepositRefundRate}% (${data.DepositRefund})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>税收支出: ${data.TaxFeeRate}% (${data.TaxFee})<br>`
              showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>其他: ${data.OtherFeeRate}% (${data.OtherFee})<br>`
            }
            return showHtm
          }
        },
        // legend: {
        //   data: ['出房', '拿房', '闲置'],
        //   top: 10
        // },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#666666',
              interval: 0
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#389ef2'
              }
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#eeeeee']
              }
            }
          }
        ],
        series: [
          {
            name: '出房',
            type: 'line',
            label: {
              show: true,
              position: 'top'
            },
            lineStyle: {
              color: '#22a6f8'
            },
            itemStyle: {
              color: '#22a6f8'
            },
            // smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(34, 166, 248, 0.6)'
              }, {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }])
            },
            data: []
          }
        ]
      },
      // 获客统计
      GetCountOption: {
        grid: {
          top: 20,
          bottom: 20,
          left: 15,
          right: 25,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params, ticket, callback) {
            // debugger
            const data = params[0].data
            var showHtm = ''
            showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>中介: ${data.Intermediary}<br>`
            showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>物业: ${data.Property}<br>`
            showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>转介绍: ${data.Introduction}<br>`
            showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>网络: ${data.Network}<br>`
            showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>上门: ${data.Door}<br>`
            showHtm += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22a6f8; margin-right: 2px"></span>其他: ${data.Other}<br>`
            return showHtm
          }
        },
        // legend: {
        //   data: ['出房', '拿房', '闲置'],
        //   top: 10
        // },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#666666',
              interval: 0
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#389ef2'
              }
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#eeeeee']
              }
            }
          }
        ],
        series: [
          {
            name: '出房',
            type: 'line',
            label: {
              show: true,
              position: 'top'
            },
            lineStyle: {
              color: '#22a6f8'
            },
            itemStyle: {
              color: '#22a6f8'
            },
            // smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(34, 166, 248, 0.6)'
              }, {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }])
            },
            data: []
          }
        ]
      },
      // 拿房统计
      takeHouseCountOption: {
        grid: {
          top: 10,
          bottom: 20,
          left: 20,
          right: 25,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#666666',
              interval: 0
            },
            data: ['有起租', '免租', '改造', '第一年不付', '10%10%', 'Y模式', '5+1模式', '2333', '23331']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#389ef2'
              }
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#eeeeee']
              }
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            lineStyle: {
              color: '#34b8f0'
            },
            itemStyle: {
              color: '#34b8f0'
            },
            // smooth: true,
            data: []
          },
          {
            name: '',
            type: 'line',
            lineStyle: {
              color: '#3cd8c0'
            },
            itemStyle: {
              color: '#3cd8c0'
            },
            data: []
          },
          {
            name: '',
            type: 'line',
            lineStyle: {
              color: '#fe9875'
            },
            itemStyle: {
              color: '#fe9875'
            },
            data: []
          }
        ]
      },
      // 业绩
      GetAcountOption: {
        color: ['#3398DB', '#fdb44b'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: 10,
          right: 20,
          bottom: 10,
          top: 20,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: '#666666',
              interval: 0
            },
            axisLine: {
              lineStyle: {
                color: '#389ef2'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#389ef2'
              }
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '新出',
            type: 'bar',
            label: {
              show: true,
              position: 'top'
            },
            barWidth: '25%',
            data: []
          },
          {
            name: '续租',
            type: 'bar',
            label: {
              show: true,
              position: 'top'
            },
            barWidth: '25%',
            data: []
          }
        ]
      },
      PayOption: {
        title: {
          text: '利润表(元)',
          top: 10,
          left: 10
        },
        color: ['#59c2e6', '#389ef2', '#fc4c7a'],
        grid: {
          top: 60,
          bottom: 30,
          left: 80,
          right: 50
        },
        legend: {
          data: ['总利润', '总收入', '总支出'],
          top: 10
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#9a9a9a',
              interval: 0
            },
            data: ['2018/01', '2018/02', '2018/03', '2018/04', '2018/05', '2018/06', '2018/07', '2018/08', '2018/09', '2018/10', '2018/11']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#9a9a9a'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#999999',
                opacity: 0.1
              }
            }
          }
        ],
        series: [
          {
            name: '总利润',
            type: 'line',
            // smooth: true,
            showSymbol: false,
            data: ['1000', '6500', '7250', '7800', '8900', '12000', '8600', '15600', '5670', '5890', '6660', '2020']
          },
          {
            name: '总收入',
            type: 'line',
            // smooth: true,
            showSymbol: false,
            data: ['2200', '1100', '3000', '8000', '9000', '11000', '2000', '1200', '1100', '500', '3000', '9800']
          },
          {
            name: '总支出',
            type: 'line',
            // smooth: true,
            showSymbol: false,
            data: ['500', '780', '1500', '3200', '4500', '6000', '4255', '3555', '6550', '5600', '3500', '2500']
          }
        ]
      },
      MoneyOption: {
        title: {
          text: '业绩表(元)',
          top: 10,
          left: 10
        },
        color: ['#59c2e6', '#389ef2', '#fc4c7a'],
        grid: {
          top: 60,
          bottom: 30,
          left: 80,
          right: 50
        },
        legend: {
          data: ['总业绩', '已入业绩', '未入业绩'],
          top: 10
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#9a9a9a',
              interval: 0
            },
            data: ['2018/01', '2018/02', '2018/03', '2018/04', '2018/05', '2018/06', '2018/07', '2018/08', '2018/09', '2018/10', '2018/11']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#9a9a9a'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#999999',
                opacity: 0.1
              }
            }
          }
        ],
        series: [
          {
            name: '总业绩',
            type: 'line',
            // smooth: true,
            showSymbol: false,
            data: ['1000', '6500', '7250', '7800', '8900', '12000', '8600', '15600', '5670', '5890', '6660', '2020']
          },
          {
            name: '已入业绩',
            type: 'line',
            // smooth: true,
            showSymbol: false,
            data: ['2200', '1100', '3000', '8000', '9000', '11000', '2000', '1200', '1100', '500', '3000', '9800']
          },
          {
            name: '未入业绩',
            type: 'line',
            // smooth: true,
            showSymbol: false,
            data: ['500', '780', '1500', '3200', '4500', '6000', '4255', '3555', '6550', '5600', '3500', '2500']
          }
        ]
      },
      // 应收饼图
      ReceiveSum: 0,
      GetPieOption: {
        title: {
          text: '总应收',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#ba9ef3'
          }
        },
        color: ['#e5d8ff', '#ba9ef3'],
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '总应收',
            type: 'pie',
            radius: ['60%', '78%'],
            label: {
              fontSize: 14
            },
            labelLine: {
              length: 10,
              length2: 10
            },
            data: [
              {
                value: 20,
                name: '已收'
              },
              {
                value: 80,
                name: '未收'
              }
            ]
          }
        ]
      },
      // 应付饼图
      PaySum: 0,
      PayPieOption: {
        title: {
          text: '总应付',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#7bbeca'
          }
        },
        color: ['#93dfef', '#7bbeca'],
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '总应付',
            type: 'pie',
            radius: ['60%', '78%'],
            label: {
              fontSize: 14
            },
            labelLine: {
              length: 10,
              length2: 10
            },
            data: [
              {
                value: 20,
                name: '已付'
              },
              {
                value: 80,
                name: '未付'
              }
            ]
          }
        ]
      },
      // 总次数饼图
      MeasureSum: 0,
      CountPieOption: {
        title: {
          text: '总次数',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#6eb5fc'
          }
        },
        color: ['#b1d8ff', '#6eb5fc'],
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '总次数',
            type: 'pie',
            radius: ['60%', '78%'],
            label: {
              fontSize: 14
            },
            labelLine: {
              length: 10,
              length2: 10
            },
            data: [
              {
                value: 20,
                name: '核算'
              },
              {
                value: 80,
                name: '预算'
              }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    // 房源表
    // HomeReport().then(response => {
    //   console.log(response)
    // })
    // console.log(this.userinfo)
    const moduleArr = this.userinfo.Module
    moduleArr.forEach((ele, index) => {
      for (var item in this.showControlBox) {
        if (item === ele.EModuleName) {
          this.showControlBox[item] = true
        }
      }
    })
    this.fetchData()
    this.getCustomerReport()
    this.getMoneyInfo()
    this.getOutRankData()
    // this.drawGetCountLine()
    this.getRentData()
    // 今日代办
    this.GetRemark()
  },
  methods: {
    ...mapActions([
      'setHomeRemark'
    ]),
    toReportDetail(routerName) {
      if (!routerName) {
        return
      } else if (routerName === 'GetGuestCollection') {
        if (this.activeGetCount === 2) {
          this.$router.push({ path: `/Report/Other/GetGuestCollection` })
        } else {
          this.$router.push({ path: `/Report/Other/OutGuestCollection` })
        }
      } else {
        this.$router.push({ path: `/Report/${routerName}` })
      }
    },
    fetchData() {
      HomeReport().then(response => {
        const data = response.Data
        var contractlist = []
        contractlist[1] = data.OwnerContractManag
        contractlist[0] = data.TenantContractManag
        this.OverTimeOption.series[0].data = data.OverdueRent
        this.initTakeHouseData(data.TakeHouseReportView)
        this.initVancantWarningView(data.VancantWarningView)
        this.initHouseInfoData(data.HouseInfoStatistics)
        this.drawEcharts('OverTimeBarBox', this.OverTimeOption)
        this.initPerformanReview(data.PerformanReview)
        this.initContractData(contractlist)
      })
    },
    initHouseInfoData(HouseInfoStatistics) {
      this.AllCount = HouseInfoStatistics.AllCount
      this.houseInfoList[0].total = HouseInfoStatistics.AllCount
      this.houseInfoList[1].total = HouseInfoStatistics.PartCount
      this.houseInfoList[2].total = HouseInfoStatistics.AllVacancyCount
      this.houseInfoList[3].total = HouseInfoStatistics.PartVacancyCount
      this.houseInfoList[0].value1 = HouseInfoStatistics.AllReadyRent
      this.houseInfoList[0].value2 = HouseInfoStatistics.AllReadyOrder
      this.houseInfoList[1].value1 = HouseInfoStatistics.PartReadyRent
      this.houseInfoList[1].value2 = HouseInfoStatistics.PartReadyOrder
      this.houseInfoList[2].value1 = HouseInfoStatistics.AllVacancyRate + '%'
      this.houseInfoList[2].value2 = HouseInfoStatistics.AllRenovationCount
      this.houseInfoList[2].value3 = HouseInfoStatistics.AllRenovationRate + '%'
      this.houseInfoList[3].value1 = HouseInfoStatistics.PartVacancyRate + '%'
      this.houseInfoList[3].value2 = HouseInfoStatistics.PartRenovationCount
      this.houseInfoList[3].value3 = HouseInfoStatistics.PartRenovationRate + '%'
    },
    getMoneyInfo() {
      SelectIncomeOrPayViewAll({
        type: this.activeMoneyType
      }).then(response => {
        const MoneyInfoOption = response.Data
        this.MoneyInfoOption.xAxis[0].data = MoneyInfoOption.Name
        if (this.activeMoneyType === 0) {
          this.MoneyInfoOption.series[0].data = MoneyInfoOption.IncomeView
        } else {
          this.MoneyInfoOption.series[0].data = MoneyInfoOption.PayView
        }
        this.drawEcharts('MoneyInfoLineBox', this.MoneyInfoOption)
      })
    },
    getRentData() {
      SelectTakeOroutPerformance({
        type: this.activeTakeHouse
      }).then(response => {
        const data = response.Data
        this.GetAcountOption.xAxis[0].data = data.name
        this.GetAcountOption.series[0].data = data.value
        this.GetAcountOption.series[1].data = data.value1
        this.drawEcharts('GetAcount', this.GetAcountOption)
      })
    },
    getOutRankData() {
      SelectTakeOrOutRank({
        type: this.activeYeji,
        sort: this.OrderIndex
      }).then(response => {
        const data = response.Data
        this.RecentTimeOption.xAxis[0].data = data.name
        this.RecentTimeOption.series[0].data = data.value
        this.drawEcharts('RecentTimeBox', this.RecentTimeOption)
      })
    },
    LinkToOther(type) {
      switch (type) {
        case 0:
          this.$router.push({ path: '/Finance/AccountsReceivesAble' })
          break
        case 1:
          this.$router.push({ path: '/Finance/AccountsPayable' })
          break
        case 2:
          this.$router.push({ path: '/Owner/ContractList' })
          break
        case 3:
          this.$router.push({ path: '/Tenant/ContractList' })
          break
      }
    },
    handleCommand(command) {
      this.DropLabel = command
    },
    initVancantWarningView(VancantWarningView) {
      this.EmptyOption.series[0].data = VancantWarningView
      this.drawEcharts('EmptyLineBox', this.EmptyOption)
    },
    initTakeHouseData(TakeHouseReportView) {
      this.takeHouseNameList = !TakeHouseReportView.Name ? ['5月', '4月', '3月'] : TakeHouseReportView.Name
      this.takeHouseCountOption.series[0].name = !TakeHouseReportView.Name ? '' : TakeHouseReportView.Name[0]
      this.takeHouseCountOption.series[1].name = !TakeHouseReportView.Name ? '' : TakeHouseReportView.Name[1]
      this.takeHouseCountOption.series[2].name = !TakeHouseReportView.Name ? '' : TakeHouseReportView.Name[2]
      this.takeHouseCountOption.series[0].data = TakeHouseReportView.Value
      this.takeHouseCountOption.series[1].data = TakeHouseReportView.Value1
      this.takeHouseCountOption.series[2].data = TakeHouseReportView.Value2
      this.drawEcharts('takeHouseCountBox', this.takeHouseCountOption)
    },
    initPerformanReview(PerformanReview) {
      this.takeHouseList[0].Today = PerformanReview.OutHouseToday
      this.takeHouseList[0].ThisWeek = PerformanReview.OutHouseThisWeek
      this.takeHouseList[0].ThisMonth = PerformanReview.OutHouseThisMonth
      this.takeHouseList[1].Today = PerformanReview.TakeHouseToday
      this.takeHouseList[1].ThisWeek = PerformanReview.TakeHouseThisWeek
      this.takeHouseList[1].ThisMonth = PerformanReview.TakeHouseThisMonth
      this.takeHouseList[2].Today = PerformanReview.OrderToday
      this.takeHouseList[2].ThisWeek = PerformanReview.OrderThisWeek
      this.takeHouseList[2].ThisMonth = PerformanReview.OrderThisMonth
      this.takeHouseList[3].Today = PerformanReview.TenantRenewalToday
      this.takeHouseList[3].ThisWeek = PerformanReview.TenantRenewalThisWeek
      this.takeHouseList[3].ThisMonth = PerformanReview.TenantRenewalThisMonth
    },
    initContractData(contractlist) {
      this.ContractData = contractlist
    },
    getCustomerReport() {
      ShowHouseCustomerReport({
        type: this.activeGetCount
      }).then(response => {
        const data = !response.Data ? [] : response.Data
        this.GetCountOption.xAxis[0].data
        this.GetCountOption.xAxis[0].data = []
        this.GetCountOption.series[0].data = []
        data.forEach(ele => {
          this.GetCountOption.xAxis[0].data.push(ele.name)
          this.GetCountOption.series[0].data.push(ele.value)
        })
        this.drawEcharts('GetCountBox', this.GetCountOption)
      })
    },
    drawEcharts(ref_name, option) {
      const myChart = echarts.init(this.$refs[ref_name])
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    ChangeOrderIndex(index) {
      if (this.OrderIndex !== index) {
        this.OrderIndex = index
        this.getOutRankData()
      }
    },
    ChangeGetCount(index) {
      if (this.activeGetCount !== index) {
        this.activeGetCount = index
        this.getCustomerReport()
      }
    },
    ChangeContractData(index) {
      if (this.activeContract !== index) {
        this.activeContract = index
      }
    },
    ChangeMoneyType(index) {
      if (this.activeMoneyType !== index) {
        this.activeMoneyType = index
        this.getMoneyInfo()
      }
    },
    ChangeTakeHouse(index) {
      if (this.activeTakeHouse !== index) {
        this.activeTakeHouse = index
        this.getRentData()
      }
    },
    ChangeYejiHouse(index) {
      if (this.activeYeji !== index) {
        this.activeYeji = index
        this.getOutRankData()
      }
    },
    OpenAddForm() {
      this.$refs.homeAddRemark.open(1, '')
    },
    delRemark(keyID, index) {
      DelMemoByID({
        keyID
      }).then(response => {
        this.RemarkList.splice(index, 1)
      })
    },
    editRemark(KeyID, form) {
      this.$refs.homeAddRemark.open(2, KeyID, form)
    },
    // 备忘录查询
    GetRemark() {
      var newData = {}
      if (this.remarkRange !== '') {
        newData = {
          MemoTime: this.$dateFormat(this.remarkRange)
        }
      }
      FindMemo(newData).then(response => {
        this.RemarkList = response.Data
      })
    }
  },
  filters: {
    NumFilter(val) {
      return val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  }
})
</script>
<style lang="scss" scoped>
@import "style";
</style>
