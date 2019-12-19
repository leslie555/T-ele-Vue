  <template>
  <div class="app-container" v-loading="listLoading" element-loading-text="拼命加载房源中...">
    <!-- 筛选部分 -->
    <search-panel :model="ShareHouseForm" label-width>
      <template slot="search">
        <el-form-item label="房源名称">
          <el-input
            v-model="ShareHouseForm.HouseName"
            style="width: 160px; margin-right: 30px;"
            @clear="ClearKeyWord"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="小区名称">
          <el-input
            v-model="ShareHouseForm.CommunityName"
            style="width: 160px; margin-right: 30px;"
            @clear="ClearKeyWord"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="房间号">
          <el-input
            v-model="ShareHouseForm.RoomNumber"
            style="width: 160px; margin-right: 30px;"
            @clear="ClearKeyWord"
            clearable
          ></el-input>
        </el-form-item>
        <SelectOrganization v-model="ShareHouseForm.FullIDNew" :type="2"></SelectOrganization>
        <el-form-item label="门店选择">
          <select-store ref="selectStore" type="house" @change="handleChange"></select-store>
            <!-- <el-cascader
              ref="cascader"
              separator=">"
              expand-trigger="hover"
              :options="treeData"
              @active-item-change="handleParentChange"
              :props="defaultOptions"
              v-model="structure"
              @change="handleChange"
            ></el-cascader> -->
          </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="区域">
            <el-button
              v-for="(item, index) in filterLists.WhereList"
              :key="item.id"
              type="text"
              @click="addFilter(item, 0)"
              :class="[item.isActive ? 'active' : '']"
              :style="{'display': index < 10 ? 'inline-block' : MoreCity ? 'inline-block' : 'none'}"
            >{{ item.text }}</el-button>
            <el-button class="active" v-show="!MoreCity" type="text" @click="ShowMoreCity">更多区县&gt;</el-button>
            <el-button class="active" v-show="MoreCity" type="text" @click="ShowMoreCity">&lt;收起</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="状态">
            <el-button
              v-for="item in filterLists.statusList"
              :key="item.id"
              type="text"
              @click="addFilter(item, 8)"
              :class="[item.isActive ? 'active' : '']"
            >{{ item.text }}</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="到期">
            <el-button
              v-for="item in filterLists.Expire"
              :key="item.id"
              type="text"
              @click="addFilter(item, 10)"
              :class="[item.isActive ? 'active' : '']"
            >{{ item.text }}</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="价格">
            <el-button
              v-for="item in filterLists.PriceList"
              :key="item.id"
              type="text"
              @click="addFilter(item, 1)"
              :class="[item.isActive ? 'active' : '']"
            >{{ item.text }}</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="房型">
            <el-button
              v-for="item in filterLists.RoomType"
              :key="item.id"
              type="text"
              @click="addFilter(item, 2)"
              :class="[item.isActive ? 'active' : '']"
            >{{ item.text }}</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="类型">
            <el-button
              v-for="item in filterLists.HouseType"
              :key="item.id"
              type="text"
              @click="addFilter(item, 3)"
              :class="[item.isActive ? 'active' : '']"
            >{{ item.text }}</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="方式">
            <el-button
              v-for="item in filterLists.rentTypeList"
              :key="item.id"
              type="text"
              @click="addFilter(item, 4)"
              :class="[item.isActive ? 'active' : '']"
            >{{ item.text }}</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="面积">
            <el-button
              v-for="item in filterLists.RoomAreaList"
              :key="item.id"
              type="text"
              @click="addFilter(item, 5)"
              :class="[item.isActive ? 'active' : '']"
            >{{ item.text }}</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="朝向">
            <el-button
              v-for="item in filterLists.towardList"
              :key="item.id"
              type="text"
              @click="addFilter(item, 6)"
              :class="[item.isActive ? 'active' : '']"
            >{{ item.text }}</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="是否有图">
            <el-button
              v-for="item in filterLists.HaveImgList"
              :key="item.id"
              type="text"
              @click="addFilter(item, 9)"
              :class="[item.isActive ? 'active' : '']"
            >{{ item.text }}</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <!--  <el-form-item label="公司">
            <el-select v-model="ShareHouseForm.CompanyID" placeholder="请选择">
              <el-option
                v-for="(item, index) in filterLists.CompanyList"
                :key="index.text"
                :label="item.CompanyName"
                :value="item.KeyID"
                @click.native="addFilter(item, 7)"
              ></el-option>
            </el-select>
          </el-form-item>-->
        </div>
      </template>
      <template slot="button">
        <el-button type="primary" @click="FoundShareHouse">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </template>
    </search-panel>
    <!-- 筛选标签 -->
    <transition name="ShowAllBox">
      <el-row class="panel" v-show="filterRes.length > 0">
        <el-tag
          v-for="(item,index) in filterRes"
          :key="!item.obj.text2 ? item.obj.text : item.obj.text2"
          size="medium"
          closable
          @close="deleteFileter(item, index)"
        >{{ item.obj.text }}</el-tag>
        <el-button type="text" style="margin-left: 40px; color: #389ef2" @click="deleteAllRes">清空全部</el-button>
      </el-row>
    </transition>
    <!-- 展示部分 -->
    <el-row class="panel data-list-table">
      <div class="ShareHouseContent">
        <div class="HouseCount">
          <h4>
            共享房源
            <span>{{ HouseCount }}</span>&nbsp;套
          </h4>
        </div>
      </div>
      <div class="ContentBox">
        <el-table
          style="width: 100%;"
          :data="tableData"
          :show-header="false"
          :row-style="rowStyle"
          @row-click="goDetails"
        >
          <el-table-column width="160">
            <template slot-scope="scope">
              <div style="position: relative">
                <img
                :src="$ImgUnit.getImgUrl(scope.row.ImageLocation)"
                alt="暂无房源图片"
                class="tableHouseImg"
                >
                <img :src="urls[scope.row.Badge]" alt="" style="position: absolute; top: 0; right: 0">
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <p class="tableHouseName">
                {{ scope.row.HouseName }}
              </p>
              <div class="tableHouseInfo">
                <span class="start">{{ $EnumData.getEnumDesByValue('RentType', scope.row.RentType) }}</span>
                <span>押{{ scope.row.PledgeNumber }}付{{ scope.row.PayNumber }}</span>
                <span>{{ scope.row.RoomCount }}室{{ scope.row.HallCount }}厅</span>
                <span class="end">{{ scope.row.HouseArea }} m&sup2;</span>
                <!--<span class="end">业主到期: {{ $dateFormat(scope.row.OwnerEndTime, 'yyyy-MM-dd') }}</span>-->
              </div>
              <div class="tableHouseDate">
                <span>地址: {{ scope.row.Location }}</span>
              </div>
              <p class="tableHousePrice">{{ scope.row.RentMoeny }}元/月</p>
            </template>
          </el-table-column>
          <el-table-column style="text-align: center;" fixed="right" width="400">
            <template slot-scope="scope">
              <el-button type="primary" @click.stop="OpenBookingHouse(scope.row)" v-if="scope.row.ReserveStatus !== 3">预定</el-button>
              <!-- v-if="$store.state.user.userinfo.FullID === scope.row.FullID" -->
              <el-button type="primary" @click.stop="OpenReservationHouse(scope.row)">预约</el-button>
              <el-button type="primary" @click.stop="AddTenant(scope.row)">租客登记</el-button>
              <!--<el-button type="primary" @click.stop="SeeInfo(scope.row)">合同信息</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="fetchData"
      style="text-align: right"
    ></bottom-tool-bar>
    <booking-house ref="BookingHouseDialog"></booking-house>
    <reservation-house ref="ReservationHouseDialog"></reservation-house>
    <show-more
      :showMoreVisible="showMoreVisible"
      :houseInfo="houseInfo"
      :houseID="houseID"
      :houseKey="houseKey"
      @close="closeShowMore"
    ></show-more>
  </div>
</template>
  <script>
import BookingHouse from '@/components/BookingHouse'
import ReservationHouse from '@/components/ReservationHouse'
import BottomToolBar from '@/components/BottomToolBar'
import { SearchPanel, SelectStore, SelectOrganization } from '@/components'
import ShowMore from '../ShareHouseDetail/components/ShowMore'
import { CityData } from '@/utils/CityData'
import { selectShareHouseInfoListPaging } from '@/api/house'
import { ShowCompanyinfoCityCode } from '@/api/system'

export default ({
  name: 'HouseShareHouse',
  components: {
    BookingHouse,
    ReservationHouse,
    BottomToolBar,
    SearchPanel,
    ShowMore,
    SelectStore,
    SelectOrganization
  },
  data() {
    return {
      showMoreVisible: false,
      houseInfo: {},
      houseID: '0',
      houseKey: '0',
      defaultOptions: {
        value: 'id'
      },
      urls: {
        // 已租
        tarnent: require('../../../assets/ShareHouse/Havetorent.png'),
        // 已定
        order: require('../../../assets/ShareHouse/Isset.png'),
        // 待租
        empty: require('../../../assets/ShareHouse/rent.png'),
        // 装修
        draw: require('../../../assets/ShareHouse/decorate.png')
      },
      // 所选组织架构的label数组
      organization: [],
      // 绑定组织架构的id数组
      structure: [],
      // 更多区县
      MoreCity: false,
      listLoading: true,
      HouseCount: 0,
      // 预约预订
      HouseInfo: {},
      isShowAll: false,
      // 控制翻页
      pageSize: 10,
      // 预订窗口
      BookingVisible: false,
      ReservationVisible: false,
      // 筛选条件集合
      filterRes: [],
      tarentList: (() => {
        var arr = []
        for (let i = 1; i <= 12; i++) {
          arr.push({
            value: `${i}月到期`,
            label: `${i}月到期`
          })
        }
        return arr
      })(),
      ownerList: (() => {
        var arr = []
        for (let i = 1; i <= 12; i++) {
          arr.push({
            value: `${i}月到期`,
            label: `${i}月到期`
          })
        }
        return arr
      })(),
      ShareHouseForm: {
        KeyWord: null,
        CommunityName: '',
        HouseName: '',
        RoomNumber: '',
        value1: '',
        value2: '',
        HouseStatus: [],
        IsHaveImage: 0,
        IsChecked: false,
        CityCode: [],
        RentMoeny: [],
        RoomType: [],
        HouseType: [],
        RentType: [],
        RoomArea: [],
        Toward: [],
        CompanyID: null,
        FullID: '',
        FullIDNew: ''
      },
      // 筛选列表数据
      filterLists: {
        WhereList: [],
        PriceList: [
          {
            id: 0,
            text: '500以下',
            value: '500以下',
            isActive: false
          },
          {
            id: 1,
            text: '500-700',
            value: '500-700',
            isActive: false
          },
          {
            id: 2,
            text: '700-1000',
            value: '700-1000',
            isActive: false
          },
          {
            id: 3,
            text: '1000-1500',
            value: '1000-1500',
            isActive: false
          },
          {
            id: 4,
            text: '1500-2000',
            value: '1500-2000',
            isActive: false
          },
          {
            id: 5,
            text: '2000-3000',
            value: '2000-3000',
            isActive: false
          },
          {
            id: 6,
            text: '3000以上',
            value: '3000以上',
            isActive: false
          }
        ],
        statusList: [
          {
            id: 0,
            text: '已定',
            value: '已定',
            isActive: false
          },
          {
            id: 1,
            text: '已租',
            value: '已租',
            isActive: false
          },
          {
            id: 2,
            text: '待租',
            value: '待租',
            isActive: false
          },
          {
            id: 3,
            text: '装修',
            value: '装修',
            isActive: false
          }
        ],
        RoomType: [
          {
            id: 1,
            text: '一室',
            value: '1',
            isActive: false
          },
          {
            id: 2,
            text: '二室',
            value: '2',
            isActive: false
          },
          {
            id: 3,
            text: '三室',
            value: '3',
            isActive: false
          },
          {
            id: 4,
            text: '四室',
            value: '4',
            isActive: false
          },
          {
            id: 5,
            text: '四室以上',
            value: 'X',
            isActive: false
          }
        ],
        HouseType: [
          {
            id: 1,
            text: '住宅',
            value: '1',
            isActive: false
          },
          {
            id: 2,
            text: '公寓',
            value: '2',
            isActive: false
          },
          {
            id: 3,
            text: '别墅',
            value: '3',
            isActive: false
          },
          {
            id: 4,
            text: '老公房',
            value: '4',
            isActive: false
          },
          {
            id: 5,
            text: '洋房',
            value: '5',
            isActive: false
          },
          {
            id: 6,
            text: '四合院',
            value: '6',
            isActive: false
          }
        ],
        rentTypeList: [
          {
            id: 1,
            text: '整租',
            value: '1',
            isActive: false
          },
          {
            id: 2,
            text: '合租',
            value: '2',
            isActive: false
          }
        ],
        RoomAreaList: [
          {
            id: 1,
            text: '50平以下',
            value: '50平以下',
            isActive: false
          },
          {
            id: 2,
            text: '50-70平',
            value: '50-70平',
            isActive: false
          },
          {
            id: 3,
            text: '70-90平',
            value: '70-90平',
            isActive: false
          },
          {
            id: 4,
            text: '90-110平',
            value: '90-110平',
            isActive: false
          },
          {
            id: 5,
            text: '110平以上',
            value: '110平以上',
            isActive: false
          }
        ],
        towardList: [
          {
            id: 1,
            text: '正东',
            value: '1',
            isActive: false
          },
          {
            id: 2,
            text: '正南',
            value: '2',
            isActive: false
          },
          {
            id: 3,
            text: '正西',
            value: '3',
            isActive: false
          },
          {
            id: 4,
            text: '正北',
            value: '4',
            isActive: false
          },
          {
            id: 5,
            text: '东南',
            value: '5',
            isActive: false
          },
          {
            id: 6,
            text: '东北',
            value: '6',
            isActive: false
          },
          {
            id: 7,
            text: '西南',
            value: '7',
            isActive: false
          },
          {
            id: 8,
            text: '西北',
            value: '8',
            isActive: false
          }
        ],
        HaveImgList: [
          {
            id: 1,
            text: '有图片',
            value: 1,
            only: true,
            isActive: false
          },
          {
            id: 2,
            text: '无图片',
            value: 2,
            only: true,
            isActive: false
          }
        ],
        Expire: [
          {
            id: 1,
            text: '2个月内（租客）',
            value: true,
            only: true,
            isActive: false
          }
        ]
      },
      // 表格数据
      rowStyle: { height: '150px', cursor: 'pointer' },
      tableData: []
    }
  },
  created() {
    this.GetCityList()
  },
  methods: {
    // search
    search() {
      this.$refs.bottomToolBar.search()
    },
    resetForm() {
      this.ShareHouseForm.CommunityName = ''
      this.ShareHouseForm.HouseName = ''
      this.ShareHouseForm.RoomNumber = ''
      this.ShareHouseForm.FullIDNew = ''
      this.$refs.selectStore.reset()
      this.deleteAllRes()
    },
    // 查询按钮
    FoundShareHouse() {
      this.search()
    },
    AddTenant(row) {
      this.$router.push({
        path: '/Tenant/AddContract',
        query: {
          HouseID: row.HouseID,
          HouseName: row.HouseName
        }
      })
    },
    // 查看更多
    SeeInfo(data) {
      this.houseInfo = {
        houseName: data.HouseName,
        houseArea: data.HouseArea,
        location: data.Location,
        // 室
        RoomCount: data.RoomCount,
        // 厅
        HallCount: data.HallCount,
        // 卫
        ToiletCount: data.ToiletCount
      }
      this.houseID = data.HouseID + ''
      this.houseKey = data.HouseKey + ''
      this.showMoreVisible = true
    },
    closeShowMore() {
      this.showMoreVisible = false
    },
    // 添加标签
    addFilter(obj, tag) {
      obj.isActive = true
      var isExist = false
      let comIdx = -1 // filterRes数组里组织架构的index
      if (obj.only) {
        const item = this.filterRes.find(x => x.obj.value === obj.value)
        if (item) {
          return
        } else {
          const index = this.filterRes.findIndex(x => x.tag === 9)
          if (index !== -1) {
            const mark = this.filterRes[index]
            this.filterRes.splice(index, 1)
            this.filterLists.HaveImgList[mark.obj.value - 1].isActive = false
          }
        }
      }
      this.filterRes.forEach((element, index) => {
        if (element.obj.isCompany === '1') {
          comIdx = index
        } else {
          if (element.obj.text === obj.text) {
            isExist = true
          }
        }
      })
      if (obj.isCompany && comIdx !== -1) {
        this.filterRes.splice(comIdx, 1, {
          obj: {
            text: obj.organization,
            text2: obj.fullID,
            isCompany: '1'
          },
          tag: 7
        })
        this.search()
      } else {
        if (!isExist) {
          switch (tag) {
            case 0:
              this.ShareHouseForm.CityCode.push(obj.value)
              break
            case 1:
              this.ShareHouseForm.RentMoeny.push(obj.value)
              break
            case 2:
              this.ShareHouseForm.RoomType.push(obj.value)
              break
            case 3:
              this.ShareHouseForm.HouseType.push(obj.value)
              break
            case 4:
              this.ShareHouseForm.RentType.push(obj.value)
              break
            case 5:
              this.ShareHouseForm.RoomArea.push(obj.value)
              break
            case 6:
              this.ShareHouseForm.Toward.push(obj.value)
              break
            case 8:
              this.ShareHouseForm.HouseStatus.push(obj.value)
              break
            case 9:
              this.ShareHouseForm.IsHaveImage = obj.value
              break
            case 10:
              this.ShareHouseForm.IsChecked = obj.value
              break
          }
          if (tag === 7) {
            this.filterRes.push({
              obj: {
                text: obj.organization,
                text2: obj.fullID,
                isCompany: '1'
              },
              tag: 7
            })
          } else {
            this.filterRes.push({ obj, tag })
          }
          this.search()
        }
      }
    },
    // 删除标签事件
    deleteFileter(item, index) {
      item.obj.isActive = false
      // 删除筛选对象对应项
      switch (item.tag) {
        case 0:
          this.deleteShareList(this.ShareHouseForm.CityCode, item.obj.value)
          break
        case 1:
          this.deleteShareList(this.ShareHouseForm.RentMoeny, item.obj.value)
          break
        case 2:
          this.deleteShareList(this.ShareHouseForm.RoomType, item.obj.value)
          break
        case 3:
          this.deleteShareList(this.ShareHouseForm.HouseType, item.obj.value)
          break
        case 4:
          this.deleteShareList(this.ShareHouseForm.RentType, item.obj.value)
          break
        case 5:
          this.deleteShareList(this.ShareHouseForm.RoomArea, item.obj.value)
          break
        case 6:
          this.deleteShareList(this.ShareHouseForm.Toward, item.obj.value)
          break
        case 8:
          this.deleteShareList(this.ShareHouseForm.HouseStatus, item.obj.value)
          break
        case 9:
          this.ShareHouseForm.IsHaveImage = 0
          break
        case 10:
          this.ShareHouseForm.IsChecked = false
          break
        case 7:
          this.structure = []
          this.ShareHouseForm.FullID = ''
      }
      // 删除标签
      this.filterRes.splice(index, 1)
      // 发送请求
      this.search()
    },
    // 删除发送对象
    deleteShareList(arr, item) {
      var index = arr.indexOf(item)
      arr.splice(index, 1)
    },
    // 清空全部
    deleteAllRes() {
      this.filterRes = []
      this.ShareHouseForm.CityCode = []
      this.ShareHouseForm.RentMoeny = []
      this.ShareHouseForm.RoomType = []
      this.ShareHouseForm.HouseType = []
      this.ShareHouseForm.RentType = []
      this.ShareHouseForm.RoomArea = []
      this.ShareHouseForm.Toward = []
      this.ShareHouseForm.HouseStatus = []
      this.ShareHouseForm.IsHaveImage = 0
      this.ShareHouseForm.IsChecked = false
      this.structure = []
      this.ShareHouseForm.FullID = ''
      for (var i in this.filterLists) {
        this.filterLists[i].forEach(i => {
          i.isActive = false
        })
      }
      this.search()
    },
    // 清空关键字
    ClearKeyWord() {
      this.search()
    },
    // 预定按钮
    OpenBookingHouse(data) {
      this.$refs.BookingHouseDialog.open(data, this.ShareHouseForm.IsChecked)
    },
    // 预约按钮
    OpenReservationHouse(data) {
      this.$refs.ReservationHouseDialog.open(data)
    },
    // 点击跳转详情
    goDetails(row, event, col) {
      this.$router.push({
        path: '/House/ShareHouseDetail',
        query: {
          id: row.HouseKey,
          HouseID: row.HouseID,
          ShareRentHouseID: row.HouseStatus === 5 ? row.HouseID : '',
          IsChecked: this.ShareHouseForm.IsChecked
        }
      })
    },
    // 更多筛选条件
    showAll() {
      this.isShowAll = !this.isShowAll
    },
    // 关闭预订窗口
    CloseBooking() {
      this.BookingVisible = false
    },
    // 关闭预约窗口
    CloseReservation() {
      this.ReservationVisible = false
    },
    GetCityList() {
      ShowCompanyinfoCityCode().then(response => {
        const oldCityCode = !response.Data ? '510102' : response.Data
        var newProvince = oldCityCode.slice(0, 2)
        var newCityCode = oldCityCode.slice(0, 4)
        newProvince += '0000'
        newCityCode += '00'
        const provinceList = CityData.find(ele => {
          return ele.value === newProvince
        })
        const CityList = provinceList.children.find(ele => {
          return ele.value === newCityCode
        })
        const res = CityList.children
        res.forEach((ele, index) => {
          ele.text = ele.label
          ele.id = index
          ele.isActive = false
        })
        this.filterLists.WhereList = res
      })
    },
    // 请求
    fetchData(pages) {
      if (!pages) {
        pages = {
          size: this.pageSize,
          page: 1
        }
      }
      this.listLoading = true
      return selectShareHouseInfoListPaging({
        parm: pages,
        where: this.ShareHouseForm
      }).then(response => {
        this.tableData = response.Data.rows
        this.HouseCount = response.Data.Param.records
        this.listLoading = false
        return response.Data
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 显示更多区县
    ShowMoreCity() {
      this.MoreCity = !this.MoreCity
    },
    handleChange(val) {
      this.ShareHouseForm.FullID = val.fullID
      console.log(val)
    }
  }
})
  </script>
  <style lang="scss" scoped>
@import "style";
</style>

