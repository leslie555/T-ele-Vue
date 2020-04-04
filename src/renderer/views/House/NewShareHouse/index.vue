<template>
  <div class="app-container share-house">
    <select-panel>
      <template slot="search">
        <SelectOrganization v-model="ruleForm.FullIDNew" :type="3"></SelectOrganization>
        <el-form-item label="房源名称" prop="HouseName">
          <el-input v-model="ruleForm.HouseName" clearable placeholder="请输入房源名称"></el-input>
        </el-form-item>
        <el-form-item label="小区名称" prop="CommunityName">
          <el-input v-model="ruleForm.CommunityName" clearable placeholder="请输入小区名称"></el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="RoomNumber">
          <el-input v-model="ruleForm.RoomNumber" clearable placeholder="请输入房间号"></el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="house-list clearfix">
          <div class="house-area-title">区域：</div>
          <div class="house-item">
            <ul>
              <li
                class="house-item-li"
                v-for="(item, index) in CityList"
                :key="index"
                @click="handleItemClick(item, index)"
                :class="[item.isActive ? 'activeColor' : 'defaultColor']"
              >{{item.title}}</li>
            </ul>
          </div>
        </div>
        <div class="house-list clearfix">
          <div class="house-item" v-show="showCityPanel">
            <el-card
              class="box-card house-item-card"
              v-loading="AreaLoading"
              element-loading-spinner="el-icon-loading"
            >
              <span class="house-item-list">
                <span class="house-item-span" v-show="showCityPanel">
                  <label
                    class="house-label2"
                    :class="[noLimitActive ? 'activeColor' : 'defaultColor']"
                    @click="handleNoLimit"
                  >不限</label>
                </span>
                <span class="house-item-span" v-for="(option, index) in AreaList" :key="index">
                  <label class="house-label1 activeColor">{{ option.StreetAbbreviation }}</label>
                  <label
                    class="house-label2"
                    :class="[item.isItemActive ? 'activeColor' : 'defaultColor']"
                    v-for="(item, index) in option.List"
                    :key="item.KeyID"
                    @click="handleDetail(item, index)"
                  >{{ item.Street }}</label>
                </span>
              </span>
            </el-card>
          </div>
        </div>
        <div class="house-list clearfix">
          <div class="house-area-title">租金：</div>
          <div class="house-item">
            <el-radio-group v-model="ruleForm.PriceRadio">
              <el-radio
                v-for="radioItem in PriceList"
                :key="radioItem.id"
                :label="radioItem.id"
                @change="handlePriceChange(radioItem.id, radioItem.value)"
              >{{radioItem.value}}</el-radio>
            </el-radio-group>
            <div class="house-area-price1">
              <el-input v-model="ruleForm.RentMoenyMin" type="number"></el-input>
            </div>
            <span>-</span>
            <div class="house-area-price2">
              <el-input v-model="ruleForm.RentMoenyMax" type="number"></el-input>
            </div>
            <div class="dis_inline">
              <span class="fz12">元</span>
              <span class="fz12 ok_btn">确定</span>
            </div>
          </div>
        </div>
        <div class="house-list clearfix">
          <div class="house-area-title">户型：</div>
          <div class="house-item">
            <el-checkbox-group v-model="ruleForm.RoomType">
              <el-checkbox
                v-for="roomItem in RoomTypeList"
                :key="roomItem.id"
                :label="roomItem.id"
                @change="handleCheckbox"
              >{{roomItem.value}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="house-list clearfix">
          <div class="house-area-title">方式：</div>
          <div class="house-item">
            <el-radio-group v-model="ruleForm.RentType">
              <el-radio
                v-for="rentTypeItem in rentTypeList"
                :key="rentTypeItem.id"
                :label="rentTypeItem.id"
              >{{rentTypeItem.value}}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="house-list clearfix">
          <div class="house-area-title">是否有图：</div>
          <div class="house-item">
            <el-radio-group v-model="ruleForm.IsHaveImage">
              <el-radio
                v-for="isImageItem in isImage"
                :key="isImageItem.id"
                :label="isImageItem.id"
              >{{isImageItem.value}}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </template>
      <template slot="button">
        <el-button type="primary" size="mini" @click="searchHouse">查询</el-button>
        <el-button type="primary" size="mini" @click="resetForm">重置</el-button>
      </template>
    </select-panel>
    <div>
      <house-list :house-data="HouseData" :list-loading="listLoading"></house-list>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="fetchData"
      style="text-align: right"
    ></bottom-tool-bar>
  </div>
</template>

<script>
import SelectPanel from '../../../../renderer/components/SelectPanel'
import { ShowCompanyinfoCityCode, selectShareHouseInfoListPaging, ShowStreetByCityCode } from '../../../api/house'
import cityData from '../../../utils/CityData/data'
// import circleData from '../../../utils/CityData/circleData'
import { HouseList } from './components'
import { BottomToolBar, SelectOrganization } from '../../../components'
export default {
  name: 'ShareHouse',
  components: {
    SelectPanel,
    HouseList,
    BottomToolBar,
    SelectOrganization
  },
  data() {
    return {
      HouseData: [],
      pageSize: 8,
      listLoading: false,
      AreaLoading: false,
      PriceList: [
        {
          id: 0,
          value: '≤1000元'
        },
        {
          id: 1,
          value: '1000-1500元'
        },
        {
          id: 2,
          value: '1500-2000元'
        },
        {
          id: 3,
          value: '2000-2500元'
        },
        {
          id: 4,
          value: '2500-3000元'
        },
        {
          id: 5,
          value: '3000-5000元'
        },
        {
          id: 6,
          value: '≥5000元'
        }
      ],
      RoomTypeList: [
        {
          id: '1',
          value: '一居'
        },
        {
          id: '2',
          value: '两居'
        },
        {
          id: '3',
          value: '三居'
        },
        {
          id: '4',
          value: '四居'
        },
        {
          id: 'X',
          value: '五居+'
        }
      ],
      rentTypeList: [
        {
          id: 0,
          value: '不限'
        },
        {
          id: 1,
          value: '整租'
        },
        {
          id: 2,
          value: '合租'
        }
      ],
      isImage: [
        {
          id: 0,
          value: '不限'
        },
        {
          id: 1,
          value: '有图片'
        },
        {
          id: 2,
          value: '无图片'
        }
      ],
      ruleForm: {
        FullIDNew: '',
        PriceRadio: '',
        IsHaveImage: 0,
        RoomType: [],
        RentMoenyMin: '',
        RentMoenyMax: '',
        CityCode: '',
        Street: '',
        CommunityName: '',
        HouseName: '',
        KeyWord: null,
        // RentMoeny: [],
        RentType: 0,
        RoomNumber: ''
      },
      noLimitActive: false,
      AreaList: [],
      showCityPanel: false,
      CityList: [], // 城市区
      CacheAreaList: {} // 区-街道缓存列表
    }
  },
  mounted() {
    this.getAreaData()
  },
  activated() {
    this.$refs.bottomToolBar.search(1)
  },
  computed: {
  },
  methods: {
    searchHouse() {
      this.$refs.bottomToolBar.search()
    },
    resetForm() {
      this.ruleForm.CommunityName = ''
      this.ruleForm.HouseName = ''
      this.ruleForm.RoomNumber = ''
      this.ruleForm.FullIDNew = ''
      this.getAreaData()
      this.deleteAllRes()
      this.showCityPanel = false
      this.$refs.bottomToolBar.search()
    },
    deleteAllRes() {
      this.ruleForm.CityCode = ''
      this.ruleForm.RentMoenyMax = ''
      this.ruleForm.RentMoenyMin = ''
      this.ruleForm.Street = ''
      this.ruleForm.PriceRadio = ''
      this.ruleForm.RoomType = []
      this.ruleForm.RentType = 0
      this.ruleForm.IsHaveImage = 0
    },
    handlePriceChange(index, value) {
      value = value.slice(0, -1)
      if (value.slice(0, 1) === '≤' || value.slice(0, 1) === '≥') {
        value = value.slice(1)
      }
      value = value.split('-')
      if (index === 6) {
        this.ruleForm.RentMoenyMin = ''
        this.ruleForm.RentMoenyMax = value[0]
      } else {
        this.ruleForm.RentMoenyMin = value[0]
        this.ruleForm.RentMoenyMax = value[1]
      }
    },
    handleCheckbox() {
      console.log('this.ruleForm.RoomType:', this.ruleForm.RoomType)
    },
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
        where: { ...this.ruleForm }
      }).then(response => {
        if (response.Code === 0) {
          if (response.Data.rows) {
            this.HouseData = response.Data.rows
          }
          this.listLoading = false
          return response.Data
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.listLoading = false
      })
    },
    getAreaData() {
      ShowCompanyinfoCityCode().then(({ Data }) => {
        const oldCityCode = !Data ? '510102' : Data
        var newProvince = oldCityCode.slice(0, 2) + '0000'
        var newCityCode = oldCityCode.slice(0, 4) + '00'
        const provinceList = cityData.find(ele => {
          return ele.value === newProvince
        })
        const cityList = provinceList.children.find(ele => {
          return ele.value === newCityCode
        })
        // console.log('cityList:', cityList)
        if (cityList && cityList.children.length > 0) {
          const result = cityList.children.map((item, index) => {
            return {
              title: item.label,
              value: item.value,
              isActive: false
            }
          })
          result.unshift({
            title: '不限',
            value: '',
            isActive: true
          })
          this.CityList = result
        }
      })
    },
    handleDetail(item, index) {
      this.ruleForm.Street = item.Street
      this.noLimitActive = false
      this.AreaList.map(res => {
        return res.List.map(val => {
          val.isItemActive = false
          if (val.KeyID === item.KeyID) {
            val.isItemActive = true
          }
          return val
        })
      })
    },
    handleItemClick(item, index) {
      if (item.value) {
        this.showCityPanel = true
      } else {
        this.showCityPanel = false
      }
      this.CityList.map(res => {
        res.isActive = false
        if (res.value === item.value) {
          res.isActive = true
        }
        return res
      })
      this.toggleCityPanel(item.value, index)
    },
    toggleCityPanel(searchCode, i) {
      // 根据区域的CityCode
      // 调接口
      this.ruleForm.CityCode = searchCode
      console.log('searchCode:', searchCode)
      if (Object.keys(this.CacheAreaList).includes(i.toString()) || i === 0) {
        this.AreaList = this.CacheAreaList[i]
        return
      } else {
        this.AreaLoading = true
        ShowStreetByCityCode({
          CityCode: searchCode
        }).then(({ Data }) => {
          if (searchCode && Data) {
            this.filterList(Data, i)
            this.AreaLoading = false
          } else {
            this.showCityPanel = false
            return
          }
        }).finally(() => {
          this.AreaLoading = false
        })
      }
    },
    filterList(data, i) {
      if (data && data.length > 0) {
        const result = data.map((item, index) => {
          if (item.List && item.List.length > 0) {
            const listObj = {
              StreetAbbreviation: item.StreetAbbreviation,
              List: this.handleList(item.List)
            }
            return listObj
          }
        })
        this.AreaList = result
        // 设置数据缓存
        this.CacheAreaList[i] = result
      }
    },
    handleList(list) {
      const res = list.map(val => {
        return {
          Street: val.Street,
          StreetAbbreviation: val.StreetAbbreviation,
          KeyID: val.KeyID,
          isItemActive: false
        }
      })
      return res
    },
    handleNoLimit() {
      if (this.AreaList && this.AreaList.length > 0) {
        this.AreaList.map(res => {
          if (res.List && res.List.length > 0) {
            res.List.map(val => {
              val.isItemActive = false
            })
          }
        })
      }
      this.noLimitActive = true
      // this.showCityPanel = false
      this.ruleForm.Street = ''
    }
  }
}
</script>

<style lang="scss">
@import './style';
</style>