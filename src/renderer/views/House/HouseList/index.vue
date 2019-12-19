<template>
  <keep-alive>
    <div class="app-container houseListLoadingBox">
      <search-panel
        :model="HouseListForm"
        label-width="80px"
        ref="HouseListForm"
        label-position="left"
        :search="Search"
        box-flex
        right-width="200px"
      >
        <template slot="search">
          <el-form-item label="房源名称">
            <el-input
              v-model="HouseListForm.HouseName"
              style="width: 160px; margin-right: 30px;"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="合同编号">
            <el-input
              v-model="HouseListForm.ContractNumber"
              style="width: 160px; margin-right: 30px;"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="小区名称">
            <el-input
              v-model="HouseListForm.CommunityName"
              style="width: 160px; margin-right: 30px;"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="房间号">
            <el-input
              v-model="HouseListForm.RoomNumber"
              style="width: 160px; margin-right: 30px;"
              clearable
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="关键字">
            <el-input
              v-model="HouseListForm.keyWord"
              placeholder="房源名称/租客名称/电话/合同编号/房源编号"
              style="width: 320px;"
            ></el-input>
          </el-form-item>-->
        </template>
        <template slot="more">
          <div class="clearfix">
            <el-form-item label="出租方式">
              <el-radio-group v-model="HouseListForm.RentType">
                <el-radio label="0">全部</el-radio>
                <el-radio label="1">整租</el-radio>
                <el-radio label="2">合租</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="clearfix">
            <el-form-item label="所属区域">
              <el-cascader
                :options="CityData"
                v-model="HouseListForm.city"
                change-on-select
                expand-trigger="hover"
                separator
                filterable
                clearable
                style="width: 320px;"
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="clearfix">
            <SelectOrganization v-model="HouseListForm.FullIDNew"></SelectOrganization>
            <el-form-item label="管房人">
              <el-input
                v-model="HouseListForm.EmployeeName"
                style="width: 200px; margin-right: 10px;"
                :readonly="true"
              ></el-input>
              <select-employee v-show="isShowSelect" @dbClick="getPeople" @empChange="getPeople">
                <el-button type="primary" @click="popoverVisible = true" size="mini">选择</el-button>
              </select-employee>
              <el-checkbox
                v-model="HouseListForm.isMine"
                style="margin-left: 20px"
                @change="ChangeMyHouse"
              >我的房源</el-checkbox>
            </el-form-item>
          </div>
          <div class="clearfix">
            <el-form-item label="业务筛选">
              <el-checkbox-group v-model="HouseListForm.BusinessScreening">
                <el-checkbox
                  v-for="item in BusinessList"
                  :key="item.value"
                  :label="item.value"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </template>
        <template slot="button">
          <el-button type="primary" :loading="searchLoading" @click="Search">查询</el-button>
          <el-button type="primary" :loading="searchLoading" @click="Reset">重置</el-button>
        </template>
      </search-panel>
      <div class="panel">
        <div class="HouseListCountTop">
          <div class="HouseListCountItem">
            <span class="ListCountItemText">整租合计</span>
            <span class="ListCountItemValue">{{ HouseCountZ}}</span>
            <span class="ListCountItemText">套</span>
          </div>
          <div class="HouseListCountItem">
            <span class="ListCountItemText">待租</span>
            <span class="ListCountItemValue">{{ HouseEmptyCountZ }}</span>
            <span class="ListCountItemText">套</span>
          </div>
          <div class="HouseListCountItem">
            <span class="ListCountItemText">装修中</span>
            <span class="ListCountItemValue">{{ `${HouseRenovationCountZ}` }}</span>
            <span class="ListCountItemText">套</span>
          </div>
          <div class="HouseListCountItem">
            <span class="ListCountItemText">空置率</span>
            <span class="ListCountItemValue">{{ `${HouseEmptyRateZ}%` }}</span>
          </div>
        </div>
        <div class="HouseListCountBottom">
          <div class="HouseListCountItem ValueRed">
            <span class="ListCountItemText">合租共计</span>
            <span class="ListCountItemValue ValueRed">{{ HouseCountH }}</span>
            <span class="ListCountItemText">间</span>
          </div>
          <div class="HouseListCountItem ValueRed">
            <span class="ListCountItemText">待租</span>
            <span class="ListCountItemValue ValueRed">{{ HouseEmptyCountH }}</span>
            <span class="ListCountItemText">间</span>
          </div>
          <div class="HouseListCountItem ValueRed">
            <span class="ListCountItemText">装修中</span>
            <span class="ListCountItemValue ValueRed">{{ `${HouseRenovationCountH}` }}</span>
            <span class="ListCountItemText">间</span>
          </div>
          <div class="HouseListCountItem ValueRed">
            <span class="ListCountItemText">空置率</span>
            <span class="ListCountItemValue ValueRed">{{ `${HouseEmptyRateH}%` }}</span>
          </div>
        </div>
      </div>
      <!-- 已选房源 -->
      <!--<transition name="ShowAllBox">-->
        <!--<el-row class="panel" v-if="SelectedList.length > 0">-->
          <!--<el-row-->
            <!--style="border-bottom: 1px #dddddd solid; padding-bottom: 6px; margin-bottom: 20px;"-->
          <!--&gt;-->
            <!--<span class="SelectHouseTitle">已选房源&emsp;({{ SelectedList.length }})</span>-->
            <!--&lt;!&ndash; <el-button-->
              <!--type="danger"-->
              <!--@click="clearAllSelect"-->
              <!--plain-->
              <!--size="mini"-->
              <!--v-if="2 === 3"-->
            <!--&gt;清空</el-button>&ndash;&gt;-->
            <!--<div style="float: right">-->
              <!--<select-employee allCompany tips="管房人" @select="ChangePeople" multi>-->
                <!--&lt;!&ndash; v-if="!this.userinfo.IsBusLeader" &ndash;&gt;-->
                <!--<el-button type="primary" @click="popoverVisible = true" plain size="mini">批量换管房人</el-button>-->
              <!--</select-employee>-->
            <!--</div>-->
          <!--</el-row>-->
          <!--<el-row class="HouseListBox SelectBox">-->
            <!--<div-->
              <!--v-for="(item, index) in SelectedList"-->
              <!--:class="['houseListCard', item.Badge, ActiveSelectItem == index ? 'active' : '']"-->
              <!--:key="index"-->
              <!--@mouseenter="changeShadow(index, 'select')"-->
              <!--@mouseleave="changeShadowRemove"-->
            <!--&gt;-->
              <!--<p class="CardTitle">{{ item.CommunityName }}</p>-->
              <!--<p-->
                <!--class="CardRoomName"-->
              <!--&gt;{{ item.Building }}-{{ item.UnitNumber }}-{{ item.RoomNumber }}{{ !item.RoomName ? '' : '-' }}{{ !item.RoomName ? '' : item.RoomName }}</p>-->
              <!--&lt;!&ndash; <p class="CardDate">最早入住: {{ $dateFormat(item.EndDate_Y) }}</p> &ndash;&gt;-->
              <!--<p class="CardPrice">已选</p>-->
              <!--&lt;!&ndash; 右上角icon &ndash;&gt;-->
              <!--<i-->
                <!--:class="['iconfont', 'closeIcon', 'icon-shanjianmoren', ActiveIcon == index ? 'active' : '']"-->
                <!--@mouseenter.stop="ChangeIcon(index)"-->
                <!--@mouseleave.stop="ChangeIconRomove"-->
                <!--@click="deleteHouse(item)"-->
              <!--&gt;</i>-->
              <!--&lt;!&ndash; 右下角图标 &ndash;&gt;-->
              <!--<div class="isAuditing" v-if="item.Badge === 'ToAudit'">待审核</div>-->
              <!--<img :src="urls[item.Badge]" alt class="CardImg" />-->
            <!--</div>-->
          <!--</el-row>-->
        <!--</el-row>-->
      <!--</transition>-->
      <!-- 待完善房源 -->
      <el-row class="panel" v-loading="EditLoading">
        <el-row
          style="border-bottom: 1px #dddddd solid; padding-bottom: 16px; margin-bottom: 20px;"
        >
          <!--<el-checkbox v-model="isEditCheckAll" @change="editCheckAll">全选</el-checkbox>-->
          <span
            class="SelectHouseTitle"
            style="color: rgba(68, 68, 68, 0.8); margin-left: 20px;"
          >待完善房源</span>
          <span class="HouseListCount">共{{ editingList.length }}套房源</span>
          <el-button
            type="primary"
            size="mini"
            plain
            style="margin-left: 20px;"
            v-show="editingList.length > OneRowMax && !CompletingShowControl"
            @click="ShowControlCom"
          >显示全部</el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            style="margin-left: 20px;"
            v-show="editingList.length > OneRowMax && CompletingShowControl"
            @click="ShowControlCom"
          >收起</el-button>
        </el-row>
        <el-row ref="houseCardBox" class="HouseListBox">
          <div
            class="houseCardBox"
            v-for="(item, index) in editingList"
            :key="item.HouseKey"
            v-show="CompletingShowControl || (index + 1) < OneRowMax"
          >
            <!--<el-checkbox-->
              <!--style="vertical-align: middle; margin-right: 10px;"-->
              <!--v-model="item.isChecked"-->
              <!--@change="checked => choiceHouse(checked, item, 'edit')"-->
            <!--&gt;</el-checkbox>-->
            <div
              :class="['houseListCard', item.Badge, ActiveEditItem === index ? 'active' : '']"
              :key="index"
              @mouseenter="changeShadow(index, 'edit')"
              @mouseleave="changeShadowRemove"
              @click="ToCompleteHouse(item)"
            >
              <p class="CardTitle">{{ item.CommunityName }}</p>
              <p
                class="CardRoomName"
              >{{ item.Building }}-{{ item.UnitNumber }}-{{ item.RoomNumber }}</p>
              <!--<p class="CardDate">最早入住: {{ $dateFormat(item.EndDate_Y) }}</p>-->
              <p class="CardPrice">待完善</p>
              <!-- 右下角图标 -->
              <img :src="urls[item.Badge]" alt class="CardImg" />
            </div>
          </div>
        </el-row>
      </el-row>
      <!-- 待审核房源 -->
      <transition name="ShowAllBox">
        <el-row class="panel" v-loading="AduitLoading">
          <el-row
            style="border-bottom: 1px #dddddd solid; padding-bottom: 16px; margin-bottom: 20px;"
          >
            <!--<el-checkbox v-model="isAduitCheckAll" @change="aduitCheckAll">全选</el-checkbox>-->
            <span
              class="SelectHouseTitle"
              style="color: rgba(68, 68, 68, 0.8); margin-left: 20px;"
            >待审核房源</span>
            <span class="HouseListCount">共{{ aduitingList.length }}套房源</span>
            <el-button
              type="primary"
              size="mini"
              plain
              style="margin-left: 20px;"
              v-if="aduitingList.length > OneRowMax && !AuditShow"
              @click="ShowControlAudit"
            >显示全部</el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              style="margin-left: 20px;"
              v-if="aduitingList.length > OneRowMax && AuditShow"
              @click="ShowControlAudit"
            >收起</el-button>
          </el-row>
          <el-row ref="houseCardBox" class="HouseListBox">
            <div
              class="houseCardBox"
              v-for="(item, index) in aduitingList"
              :key="item.HouseKey"
              v-show="AuditShow || (index + 1) < OneRowMax"
            >
              <!--<el-checkbox-->
                <!--style="vertical-align: middle; margin-right: 10px;"-->
                <!--v-model="item.isChecked"-->
                <!--@change="checked => choiceHouse(checked, item, 'aduit')"-->
              <!--&gt;</el-checkbox>-->
              <div
                :class="['houseListCard', 'edit', ActiveAduitItem === index ? 'active' : '']"
                :key="index"
                @mouseenter="changeShadow(index, 'aduit')"
                @mouseleave="changeShadowRemove"
                @click="ToCompleteHouse(item, 'aduit')"
              >
                <p class="CardTitle">{{ item.CommunityName }}</p>
                <p
                  class="CardRoomName"
                >{{ item.Building }}-{{ item.UnitNumber }}-{{ item.RoomNumber }}</p>
                <p class="CardDate"></p>
                <p class="CardPrice">待审核</p>
                <!-- 右下角图标 -->
                <div class="isAuditing">待审核</div>
                <!-- <img :src="urls[item.Badge]" alt="" class="CardImg"> -->
              </div>
            </div>
          </el-row>
        </el-row>
      </transition>
      <!-- 房源列表 -->
      <div
        class="panel"
        v-for="(houseItem, houseIndex) in completeList"
        :key="houseItem.CommunityID"
      >
        <el-row
          style="border-bottom: 1px #dddddd solid; padding-bottom: 16px; margin-bottom: 20px;"
        >
          <!--<el-checkbox-->
            <!--v-model="isCompleteCheckAll[houseIndex]"-->
            <!--@change="checked => completeCheckAll(checked, houseIndex)"-->
          <!--&gt;全选</el-checkbox>-->
          <span
            class="SelectHouseTitle"
            style="color: rgba(68, 68, 68, 0.8); margin-left: 20px;"
          >{{ houseItem.CommunityName }}</span>
          <router-link
            to="/House/CommunityList"
            style="font-size: 14px; color: rgba(56, 158, 242, .8); margin-left: 20px;"
          >小区管理</router-link>
          <span class="HouseListCount">共{{ houseItem.HouseCount }}套房源</span>
        </el-row>
        <div class="HouseListBox">
          <template v-for="list in houseItem.RoomList.rows">
            <div
              :class="['houseCardBox', list.length > 1 ? 'group' : '', list.length && itemIndex === 0 ? 'first' : '', list.length && itemIndex === (list.length - 1) ? 'end' : '']"
              v-for="(item, itemIndex) in list"
              :key="item.KeyID"
            >
              <!--<el-checkbox-->
                <!--style="vertical-align: middle; margin-right: 10px;"-->
                <!--v-model="item.isChecked"-->
                <!--@change="checked => choiceHouse(checked, item, 'complete', houseIndex)"-->
                <!--v-if="item.isChecked !== 'none'"-->
              <!--&gt;</el-checkbox>-->
              <div
                :class="['houseListCard', item.Badge, ActiveCompleteItem === item.KeyID ? 'active' : '']"
                @mouseenter="changeShadow(item.KeyID, 'complete')"
                @mouseleave="changeShadowRemove"
                @click="ShowDialog(item.KeyID, item.Badge)"
                v-if="item.isChecked !== 'none'"
              >
                <p class="CardTitle">{{ item.Building }}栋{{ item.UnitNumber }}单元</p>
                <p
                  class="CardRoomName"
                >{{ item.Building }}-{{ item.UnitNumber }}-{{ item.RoomNumber }}{{ !item.RoomName ? '' : '-'}}{{ !item.RoomName ? '' : item.RoomName}}</p>
                <!-- 空 -->
                <p class="CardDate" v-if="item.Badge === 'empty'">
                  空置
                  <span style="color: #389ef2; font-size: 14px;">{{ item.ThisDate }}</span> 天
                </p>
                <!-- 已定 -->
                <p
                  class="CardDate"
                  v-if="item.Badge === 'order'"
                >最晚签约: {{ $dateFormat(item.ThisDate) }}</p>
                <!-- 装修 -->
                <p
                  class="CardDate"
                  v-if="item.Badge === 'draw'"
                >结束时间: {{ $dateFormat(item.ThisDate) }}</p>
                <!-- 已租 -->
                <p class="CardDate" v-if="item.Badge === 'tarnent'">
                  租期结束:
                  <span
                    :style="{'color': item.ThisDate&&item.ThisDate.length > 3 ? '#000000' : '#389EF2'}"
                  >{{ item.ThisDate&&item.ThisDate.length < 3 ? `${item.ThisDate}` : Number(item.ThisDate) < 0 ? item.ThisDate :$dateFormat(item.ThisDate) }}</span>
                  &nbsp;{{ item.ThisDate&&item.ThisDate.length > 3 ? '' : '天' }}
                </p>
                <p class="CardPrice" v-if="item.Badge === 'Invalid'">失效</p>
                <p class="CardPrice" v-else>¥{{ item.RentMoeny.toFixed(2) }}</p>
                <!-- 右下角图标 -->
                <img :src="urls[item.Badge]" alt class="CardImg" v-if="item.Badge !== 'Invalid'" />
              </div>
              <div
                :class="['moreHouseBox', item.Badge, ActiveCompleteItem === item.KeyID ? 'active' : '']"
                @click="getMoreHouse(houseItem)"
                @mouseleave="changeShadowRemove"
                @mouseenter="changeShadow(item.KeyID, 'complete')"
                v-else
              >
                <span class="moreHouseText">加载更多..</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- 加载中 -->
      <div
        style="width: 100%; min-height: 30px; margin-top: 20px; background: transparent;"
        id="loadingMe"
      ></div>
      <!-- 房源弹窗 -->
      <house-detail
        :isShow="isShowDialog"
        :dialogFormData="dialogFormData"
        @closeDialog="closeDialog"
      ></house-detail>
    </div>
  </keep-alive>
</template>

<script>
  import houseDetail from './component/houseDetail'
  import { CityData } from '@/utils/CityData'
  import { SearchPanel, SelectOrganization } from '@/components'
  import SelectEmployee from '@/components/SelectEmployee'
  import { selectRoomStatusList, selectRoomaAwaitList, selectRoomStatusListWhere, selectRoomaAuditList, editHouseInfoEmp, selectRoomStatusTofuList, SelectHouseHead } from '@/api/house'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'HouseList',
    components: {
      houseDetail,
      SearchPanel,
      SelectEmployee,
      SelectOrganization
    },
    mounted() {
      this.$nextTick(() => {
        this.getHouseList(true)
        this.getCompHouseList()
        this.getRoomaAuditList()
        this.getHeadData()
        this.completeList.forEach(i => {
          this.isCompleteCheckAll.push(false)
        })
      })
      // 滚动加载事件
      window.addEventListener('scroll', this.windowHandler)
    },
    watch: {
      completeList() {
        this.completeList.forEach(i => {
          this.isCompleteCheckAll.push(false)
        })
      }
    },
    // 清空操作
    beforeRouteLeave(to, from, next) {
      // 防止异常
      window.removeEventListener('scroll', this.windowHandler)
      next()
    },
    data() {
      return {
        // 加载
        // 总计
        HouseCountZ: 0,
        HouseEmptyCountZ: 0,
        HouseRenovationCountZ: 0,
        HouseRenovationCountH: 0,
        HouseEmptyRateZ: 0,
        HouseCountH: 0,
        HouseEmptyCountH: 0,
        HouseEmptyRateH: 0,
        EditLoading: false,
        AduitLoading: false,
        // 城市数据
        CityData,
        // 是否请求完毕
        isGetAll: false,
        // 控制待完善显示
        CompletingShowControl: false,
        AuditShow: false,
        // 分页
        Communityparm: {
          page: 1,
          size: 5
        },
        swControl: true,
        // housekey
        HouseKey: 1,
        Houseparm: {
          page: 1,
          size: 5
        },
        CommunityID: 1,
        // 数据加载样式
        // scrollLoading: false,
        // 弹窗显示
        isShowDialog: false,
        isEditCheckAll: false,
        isAduitCheckAll: false,
        isCompleteCheckAll: [],
        // 弹窗数据
        dialogFormData: {
          ID: '222',
          RoomCount: '3',
          HallCount: '2',
          ToiletCount: '3',
          RoomArea: '500',
          RentMoeny: '20000',
          PledgeNumber: '3',
          PayNumber: '1',
          OwnerContractEndTime: new Date(),
          StoreName: '总店',
          IsDecorating: true,
          ShelvesStatus: '上架',
          ContractNumber: '',
          RentLeaseStatus: '已组',
          TenantName: '刘德华',
          TenantPhone: '12306',
          StartTime: new Date(),
          EndTime: new Date(),
          DepositModel: 3,
          PayModel: 1,
          ALLDebt: '是',
          NextPayTime: new Date(),
          Remark: '',
          tenantInfoDetail: {
            KeyID: 0
          }
        },
        // 方块角标
        urls: {
          order: require('../../../assets/HouseList/order.png'),
          edit: require('../../../assets/HouseList/edit.png'),
          empty: require('../../../assets/HouseList/empty.png'),
          tarnent: require('../../../assets/HouseList/tarnent.png'),
          draw: require('../../../assets/HouseList/draw.png')
        },
        // 模拟生成方块
        // 已选
        SelectedList: [],
        // 待完善
        editingList: [],
        aduitingList: [],
        // 小区列表
        completeList: [],
        ActiveSelectItem: -1,
        ActiveEditItem: -1,
        ActiveAduitItem: -1,
        ActiveCompleteItem: -1,
        ActiveIcon: -1,
        isShowAll: false,
        searchLoading: false,
        // 业务筛选列表
        BusinessList: [
          // 待完善 1 待租 2 已预订 3 预定中 4 已租 5 租客欠款 6 租客即将到期 7 租客已经到期 8  业主即将到期 9 已失效10
          { name: '待完善', value: 1 },
          { name: '待租', value: 2 },
          { name: '已预定', value: 3 },
          { name: '预定中', value: 4 },
          { name: '已租', value: 5 },
          { name: '装修中', value: 11 },
          { name: '租客欠款提醒', value: 6 },
          { name: '租客合同即将到期', value: 7 },
          { name: '租客合同已到期', value: 8 },
          { name: '业主合同即将到期', value: 9 },
          { name: '已失效', value: 10 }
        ],
        HouseListForm: {
          keyWord: '',
          HouseName: '',
          CommunityName: '',
          ContractNumber: '',
          RoomNumber: '',
          RentType: '0',
          city: ['', '', ''],
          EmployeeFullID: '',
          EmployeeName: '',
          isMine: false,
          BusinessScreening: [],
          FullIDNew: ''
        },
        isShowSelect: true
      }
    },
    methods: {
      ...mapActions([
        'setHouseInfoForm'
      ]),
      // 批量换管房人
      ChangePeople(data) {
        var HouseIDList = []
        this.SelectedList.forEach(ele => {
          HouseIDList.push(ele.HouseKey)
        })
        editHouseInfoEmp({
          MyHouseKey: HouseIDList,
          MyHouseEmp: data
        }).then(response => {
          this.$message({
            message: '修改管房人成功!',
            type: 'success'
          })
        })
      },
      // 我的房源
      ChangeMyHouse(val) {
        this.isShowSelect = !val
        if (val) {
          this.HouseListForm.EmployeeFullID = ''
          this.HouseListForm.EmployeeName = ''
        }
      },
      getPeople(data) {
        this.HouseListForm.EmployeeFullID = !data.fullID ? data.FullID : data.fullID
        this.HouseListForm.EmployeeName = !data.label ? data.UserName : data.label
      },
      // 待完善房源控制
      ShowControlCom() {
        this.CompletingShowControl = !this.CompletingShowControl
      },
      // 待审核房源控制
      ShowControlAudit() {
        this.AuditShow = !this.AuditShow
      },
      clearAllSelect() {
        this.SelectedList.forEach(ele => {
          this.deleteHouse(ele)
        })
      },
      // 查询
      Search() {
        this.completeList = []
        this.editingList = []
        this.aduitingList = []
        this.SelectedList = []
        this.Communityparm.page = 1
        this.Houseparm.page = 1
        this.isGetAll = false
        this.swControl = true
        this.searchLoading = true
        Promise.all([this.getHouseList(true), this.getCompHouseList(), this.getRoomaAuditList(), this.getHeadData()]).finally(() => {
          this.searchLoading = false
        })
        // this.getHouseList(true)
        // this.getCompHouseList()
        // this.getRoomaAuditList()
        // this.getHeadData()
      },
      // 重置
      Reset() {
        this.HouseListForm.keyWord = ''
        this.HouseListForm.HouseName = ''
        this.HouseListForm.ContractNumber = ''
        this.HouseListForm.CommunityName = ''
        this.HouseListForm.RoomNumber = ''
        this.HouseListForm.RentType = '0'
        this.HouseListForm.city = ['', '', '']
        this.HouseListForm.EmployeeFullID = ''
        this.HouseListForm.EmployeeName = ''
        this.HouseListForm.isMine = false
        this.HouseListForm.BusinessScreening = []
        this.HouseListForm.FullIDNew = ''
        this.completeList = []
        this.editingList = []
        this.aduitingList = []
        this.Communityparm.page = 1
        this.Houseparm.page = 1
        this.SelectedList = []
        this.isGetAll = false
        this.swControl = true
        this.isShowSelect = true
        this.searchLoading = true
        Promise.all([this.getHouseList(true), this.getCompHouseList(), this.getRoomaAuditList(), this.getHeadData()]).finally(() => {
          this.searchLoading = false
        })
        // this.getHouseList(true)
        // this.getCompHouseList()
        // this.getRoomaAuditList()
        // this.getHeadData()
      },
      // 删除按钮悬浮
      ChangeIcon(index) {
        this.ActiveIcon = index
      },
      ChangeIconRomove() {
        this.ActiveIcon = -1
      },
      // 更多筛选条件
      showAll() {
        this.isShowAll = !this.isShowAll
      },
      // 悬浮阴影
      changeShadow(index, type) {
        switch (type) {
          case 'select':
            this.ActiveSelectItem = index
            break
          case 'edit':
            this.ActiveEditItem = index
            break
          case 'aduit':
            this.ActiveAduitItem = index
            break
          case 'complete':
            this.ActiveCompleteItem = index
            break
        }
      },
      changeShadowRemove() {
        this.ActiveSelectItem = -1
        this.ActiveEditItem = -1
        this.ActiveCompleteItem = -1
        this.ActiveAduitItem = -1
      },
      // 请求房源数据(小区)
      getHouseList(isInit) {
        // this.scrollLoading = true
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0)',
          target: document.querySelector('#loadingMe')
        })
        if (this.OneRowMax > 0) {
          this.Houseparm.size = parseInt(this.OneRowMax) - 1
        }
        return selectRoomStatusList({
          Communityparm: this.Communityparm,
          Houseparm: this.Houseparm,
          LeaserState: this.HouseListForm.RentType,
          HouseName: this.HouseListForm.HouseName,
          CommunityName: this.HouseListForm.CommunityName,
          ContractNumber: this.HouseListForm.ContractNumber,
          RoomNumber: this.HouseListForm.RoomNumber,
          FullIDNew: this.HouseListForm.FullIDNew,
          CityCode: this.HouseListForm.city.length > 0 ? this.HouseListForm.city[this.HouseListForm.city.length - 1] : '',
          FullID: this.HouseListForm.isMine ? this.$store.state.user.userinfo.FullID : '',
          EmployeeFullID: this.HouseListForm.EmployeeFullID,
          CommunityID: this.CommunityID,
          Where: this.HouseListForm.BusinessScreening
        }).then(response => {
          response.Data.rows.forEach(ele => {
            ele.RoomList.rows.forEach(ele => {
              ele.isChecked = false
            })
          })
          if (isInit) {
            response.Data.rows.forEach(ele => {
              var newRow = []
              var n = 0
              var OnlyKey = -2
              ele.RoomList.rows.forEach((item, index) => {
                if (OnlyKey === item.HouseKey) {
                  newRow[n].push(item)
                } else {
                  if (index === 0) {
                    OnlyKey = item.HouseKey
                    newRow[n] = []
                    newRow[n].push(item)
                  } else {
                    OnlyKey = item.HouseKey
                    n += 1
                    newRow[n] = []
                    newRow[n].push(item)
                  }
                }
              })
              if (ele.RoomList.rows.length < ele.RoomList.Param.records) {
                newRow[n + 1] = []
                newRow[n + 1].push({
                  KeyID: Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36),
                  Badge: 'tarnent',
                  isChecked: 'none'
                })
              }
              ele.RoomList.rows = newRow
            })
            if (this.completeList.length <= response.Data.records) {
              this.completeList.push.apply(this.completeList, response.Data.rows)
              this.Communityparm.page += 1
            }
          }
          // this.scrollLoading = false
          loading.close()
          this.swControl = true
          if (this.completeList.length === response.Data.records) {
            this.isGetAll = true
            this.$message({
              message: '已加载所有房源',
              type: 'success'
            })
          }
        })
      },
      // 请求带完赛房源
      getCompHouseList() {
        this.AduitLoading = true
        return selectRoomaAwaitList({
          HouseName: this.HouseListForm.HouseName,
          CommunityName: this.HouseListForm.CommunityName,
          ContractNumber: this.HouseListForm.ContractNumber,
          RoomNumber: this.HouseListForm.RoomNumber,
          LeaserState: this.HouseListForm.RentType,
          FullIDNew: this.HouseListForm.FullIDNew,
          CityCode: this.HouseListForm.city.length > 0 ? this.HouseListForm.city[this.HouseListForm.city.length - 1] : '',
          FullID: this.HouseListForm.isMine ? this.$store.state.user.userinfo.FullID : '',
          EmployeeFullID: this.HouseListForm.EmployeeFullID,
          CommunityID: '',
          Where: this.HouseListForm.BusinessScreening
        }).then(response => {
          this.editingList = []
          this.AduitLoading = false
          var arr = (() => {
            response.Data.forEach((ele, index) => {
              ele.isChecked = false
            })
            return response.Data
          })()
          this.editingList.push.apply(this.editingList, arr)
        })
      },
      // 绑定滚动加载
      windowHandler() {
        if (document.scrollingElement.scrollTop + window.innerHeight + 5 >= document.documentElement.offsetHeight) {
          if (!this.isGetAll) {
            if (this.swControl) {
              this.swControl = false
              // this.scrollLoading = true
              // loading
              this.searchLoading = true
              this.getHouseList(true).then(() => {
                this.searchLoading = false
              })
            }
          }
        }
      },
      getHeadData() {
        return SelectHouseHead({
          HouseName: this.HouseListForm.HouseName,
          CommunityName: this.HouseListForm.CommunityName,
          ContractNumber: this.HouseListForm.ContractNumber,
          RoomNumber: this.HouseListForm.RoomNumber,
          LeaserState: this.HouseListForm.RentType,
          FullIDNew: this.HouseListForm.FullIDNew,
          CityCode: this.HouseListForm.city.length > 0 ? this.HouseListForm.city[this.HouseListForm.city.length - 1] : '',
          FullID: this.HouseListForm.isMine ? this.$store.state.user.userinfo.FullID : '',
          EmployeeFullID: this.HouseListForm.EmployeeFullID,
          CommunityID: '',
          Where: this.HouseListForm.BusinessScreening
        }).then(res => {
          if (res.Data) {
            this.HouseCountZ = res.Data.HouseCountZ
            this.HouseEmptyCountZ = res.Data.HouseEmptyCountZ
            this.HouseRenovationCountZ = res.Data.HouseRenovationCountZ
            this.HouseRenovationCountH = res.Data.HouseRenovationCountH
            this.HouseEmptyRateZ = res.Data.HouseEmptyRateZ
            this.HouseCountH = res.Data.HouseCountH
            this.HouseEmptyCountH = res.Data.HouseEmptyCountH
            this.HouseEmptyRateH = res.Data.HouseEmptyRateH
          }
        })
      },
      // 请求待审核房源
      getRoomaAuditList() {
        this.EditLoading = true
        return selectRoomaAuditList({
          HouseName: this.HouseListForm.HouseName,
          CommunityName: this.HouseListForm.CommunityName,
          ContractNumber: this.HouseListForm.ContractNumber,
          RoomNumber: this.HouseListForm.RoomNumber,
          LeaserState: this.HouseListForm.RentType,
          FullIDNew: this.HouseListForm.FullIDNew,
          CityCode: this.HouseListForm.city.length > 0 ? this.HouseListForm.city[this.HouseListForm.city.length - 1] : '',
          FullID: this.HouseListForm.isMine ? this.$store.state.user.userinfo.FullID : '',
          EmployeeFullID: this.HouseListForm.EmployeeFullID,
          CommunityID: '',
          Where: this.HouseListForm.BusinessScreening
        }).then(response => {
          this.aduitingList = []
          this.EditLoading = false
          var arr = (() => {
            response.Data.forEach((ele, index) => {
              ele.isChecked = false
            })
            return response.Data
          })()
          this.aduitingList.push.apply(this.aduitingList, arr)
        })
      },
      // 选择房源
      addSelectList(index) {
        this.SelectedList = []
        this.editingList.forEach(i => {
          if (i.isChecked) {
            this.SelectedList.push(i)
          }
        })
        this.aduitingList.forEach(i => {
          if (i.isChecked) {
            this.SelectedList.push(i)
          }
        })
        this.completeList.forEach(i => {
          i.RoomList.rows.forEach(p => {
            p.forEach(k => {
              if (k.isChecked === true) {
                if (!k.index) {
                  k.index = 0
                }
                this.SelectedList.push(k)
              }
            })
          })
        })
      },
      // 点击复选框事件
      choiceHouse(value, obj, type, index) {
        if (value) {
          obj.isChecked = true
          this.addSelectList(index)
        } else {
          obj.isChecked = false
          this.addSelectList(index)
        }
        if (type === 'edit') {
          this.isEditCheckAll = true
          this.editingList.forEach(i => {
            if (!i.isChecked) {
              this.isEditCheckAll = false
            }
          })
        } else if (type === 'aduit') {
          this.isAduitCheckAll = true
          this.aduitingList.forEach(i => {
            if (!i.isChecked) {
              this.isAduitCheckAll = false
            }
          })
        } else {
          this.isCompleteCheckAll[index] = true
          this.completeList[index].RoomList.rows.forEach(i => {
            i.forEach(p => {
              if (p.isChecked !== 'none') {
                if (!p.isChecked) {
                  this.isCompleteCheckAll[index] = false
                }
              }
            })
          })
        }
      },
      editCheckAll(val) {
        if (val) {
          this.editingList.forEach((i, p) => {
            i.isChecked = true
          })
        } else {
          this.editingList.forEach((i, p) => {
            i.isChecked = false
          })
        }
        this.addSelectList()
      },
      aduitCheckAll(val) {
        if (val) {
          this.aduitingList.forEach((i, p) => {
            i.isChecked = true
          })
        } else {
          this.aduitingList.forEach((i, p) => {
            i.isChecked = false
          })
        }
        this.addSelectList()
      },
      completeCheckAll(val, index) {
        if (val) {
          this.completeList[index].RoomList.rows.forEach((i, p) => {
            i.forEach(k => {
              if (k.isChecked !== 'none') {
                k.isChecked = true
                k.index = index
                console.log(index)
              }
            })
          })
        } else {
          this.completeList[index].RoomList.rows.forEach((i, p) => {
            i.forEach(k => {
              if (k.isChecked !== 'none') {
                k.isChecked = false
                k.index = index
              }
            })
          })
        }
        this.addSelectList(index)
      },
      // 删除已选房源
      deleteHouse(obj) {
        console.log(obj)
        obj.isChecked = false
        if (obj.index || obj.index === 0) {
          this.isCompleteCheckAll[obj.index] = true
          this.completeList[obj.index].RoomList.rows.forEach(i => {
            i.forEach(p => {
              if (p.isChecked !== 'none') {
                if (!p.isChecked) {
                  console.log(obj.index)
                  this.isCompleteCheckAll[obj.index] = false
                }
              }
            })
          })
        }
        this.isEditCheckAll = true
        if (this.editingList.length === 0) {
          this.isEditCheckAll = false
        }
        this.editingList.forEach(i => {
          if (!i.isChecked) {
            this.isEditCheckAll = false
          }
        })
        this.isAduitCheckAll = true
        if (this.aduitingList.length === 0) {
          this.isAduitCheckAll = false
        }
        this.aduitingList.forEach(i => {
          if (!i.isChecked) {
            this.isAduitCheckAll = false
          }
        })
        this.addSelectList()
      },
      // 控制弹窗系列
      ShowDialog(KeyID, Badge) {
        selectRoomStatusTofuList({
          HouseID: KeyID
        }).then(response => {
          // console.log(response.Data)
          response.Data.Badge = Badge
          if (Badge !== 'Invalid') {
            this.dialogFormData = response.Data
            this.isShowDialog = true
            window.removeEventListener('scroll', this.windowHandler)
          }
        })
      },
      // 完善房源
      ToCompleteHouse(item, type) {
        const newData = this.$deepCopy(item)
        this.setHouseInfoForm(newData).then(response => {
          this.$router.push({
            path: '/House/CompleteHouse',
            query: {
              HouseKey: item.HouseKey,
              type: !type ? '' : type
            }
          })
        })
        // this.$store.commit('SET_HOUSE_INFO', )
      },
      closeDialog() {
        this.isShowDialog = false
        window.addEventListener('scroll', this.windowHandler)
      },
      // 控制小区更多加载
      getMoreHouse(obj) {
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0)',
          target: document.querySelector('#loadingMe')
        })
        selectRoomStatusListWhere({
          Communityparm: this.Communityparm,
          Houseparm: (() => {
            obj.RoomList.Param.page += 1
            return obj.RoomList.Param
          })(),
          CommunityName: this.HouseListForm.CommunityName,
          ContractNumber: this.HouseListForm.ContractNumber,
          HouseName: this.HouseListForm.HouseName,
          RoomNumber: this.HouseListForm.RoomNumber,
          CityCode: this.HouseListForm.city.length > 0 ? this.HouseListForm.city[this.HouseListForm.city.length - 1] : '',
          FullID: this.HouseListForm.isMine ? this.$store.state.user.userinfo.FullID : '',
          EmployeeFullID: this.HouseListForm.EmployeeFullID,
          CommunityID: obj.CommunityID,
          Where: this.HouseListForm.BusinessScreening
        }).then(response => {
          obj.RoomList.rows.pop()
          obj.RoomList.Param.page = response.Data.Param.page
          var CurIndex = 0
          var IndexChange = false
          response.Data.rows.forEach((ele, index) => {
            if (obj.RoomList.rows[obj.RoomList.rows.length - 1][0].HouseKey === ele.HouseKey) {
              obj.RoomList.rows[obj.RoomList.rows.length - 1].push(ele)
              CurIndex = index
              IndexChange = true
            }
          })
          var newHouseArr
          if (IndexChange) {
            newHouseArr = response.Data.rows.slice(CurIndex + 1)
          } else {
            newHouseArr = response.Data.rows
          }
          var newRow = []
          var n = 0
          var OnlyKey = -2
          newHouseArr.forEach((item, index) => {
            if (OnlyKey === item.HouseKey) {
              newRow[n].push(item)
            } else {
              if (index === 0) {
                OnlyKey = item.HouseKey
                newRow[n] = []
                newRow[n].push(item)
              } else {
                OnlyKey = item.HouseKey
                n += 1
                newRow[n] = []
                newRow[n].push(item)
              }
            }
          })
          obj.RoomList.rows.push.apply(obj.RoomList.rows, newRow)
          console.log(newRow)
          var isAllData = 0
          obj.RoomList.rows.forEach(ele => {
            ele.forEach(ele => {
              isAllData += 1
            })
          })
          console.log(isAllData)
          var addIndex = obj.RoomList.rows.length
          if (isAllData < obj.RoomList.Param.records) {
            obj.RoomList.rows[addIndex] = []
            obj.RoomList.rows[addIndex].push({
              KeyID: Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36),
              Badge: 'tarnent',
              isChecked: 'none'
            })
          }
          // this.scrollLoading = false
          loading.close()
        })
      }
    },
    computed: {
      ...mapGetters([
        'userinfo'
      ]),
      OneRowMax() {
        var max = 0
        max = (document.body.clientWidth - 100 - 40 - 36) / 180
        return max
      }
      /*       HouseIDList() {
              return []
            } */
    },
    filters: {
      FalCount(val) {
        if (val) {
          if (val[val.length - 1][0].isChecked === 'none') {
            return val.length - 1
          } else {
            return val.length
          }
        }
      }
    },
    activated() {
      this.editingList = []
      this.aduitingList = []
      this.getCompHouseList()
      this.getRoomaAuditList()
      this.getHeadData()
      window.addEventListener('scroll', this.windowHandler)
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
<style lang="scss">
  .houseListLoadingBox {
    .el-loading-mask {
      // position: fixed !important;
    }
  }
</style>
