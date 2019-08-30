<template>
  <div class="app-container">
    <div class="panel" v-loading="CompleteLoading">
      <steps-box :list="stepList" ref="steps">
        <template slot="1">
          <el-form
            label-width="120px"
            :model="HouseInfoForm"
            ref="HouseInfoForm"
            :rules="HouseInfoRule"
            status-icon
          >
            <el-form-item label="出租方式">
              <el-radio-group
                v-model="HouseInfoForm.EnterType"
                @change="changeEnterType(HouseInfoForm.EnterType)"
              >
                <el-radio label="1" :disabled="HavaTenContract && $route.query.type === 'edit'">整租</el-radio>
                <el-radio label="2" :disabled="HavaTenContract && $route.query.type === 'edit'">合租</el-radio>
                <el-radio
                  v-show="HouseInfoForm.EnterType === '3'"
                  label="3"
                  :disabled="HavaTenContract && $route.query.type === 'edit'"
                >整租+合租</el-radio>
              </el-radio-group>
              <p
                style="color: #389ef2; font-size: 12px;"
                v-show="HavaTenContract && $route.query.type === 'edit'"
              >温馨提示: 已有租客合同的房源不可修改出租方式</p>
            </el-form-item>
            <p class="panel-title">门牌户型信息</p>
            <el-form-item label="房源名称" style="display: inline-block; width: 400px;">
              <el-input style="width: 250px;" v-model="HouseInfoForm.HouseName" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" style="display: inline-block; width: 400px;">
              <el-input style="width: 250px;" v-model="HouseInfoForm.Location"></el-input>
            </el-form-item>
            <el-form-item label="房源类型">
              <el-select v-model="HouseInfoForm.HouseType" style="width: 250px;">
                <el-option
                  v-for="item in houseTypeList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-form-item label="装修" style="display: inline-block; width: 420px;">
                <el-select v-model="HouseInfoForm.renovation" style="width: 250px;">
                  <el-option
                    v-for="item in renovationList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否有车位" style="display: inline-block;">
                <el-select v-model="HouseInfoForm.parking" style="width: 80px;">
                  <el-option
                    v-for="item in parkingList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="实际出租户型" style="display: inline-block; width: 240px;">
                <el-input-number
                  v-model="HouseInfoForm.RoomCount"
                  :min="minRoomCount"
                  :max="26"
                  style="width: 80px;"
                  size="mini"
                  controls-position="right"
                  @change="roomCountChange"
                ></el-input-number>&emsp;室
              </el-form-item>
              <el-form-item style="display: inline-block; width: 120px;" label-width="0">
                <el-input-number
                  v-model="HouseInfoForm.HallCount"
                  :min="0"
                  :max="26"
                  style="width: 80px;"
                  size="mini"
                  controls-position="right"
                ></el-input-number>&emsp;厅
              </el-form-item>
              <el-form-item style="display: inline-block; width: 240px;" label-width="0">
                <el-input-number
                  v-model="HouseInfoForm.ToiletCount"
                  :min="0"
                  :max="26"
                  style="width: 80px;"
                  size="mini"
                  controls-position="right"
                ></el-input-number>&emsp;卫
              </el-form-item>
            </el-row>
            <el-form-item label="总楼层数" style="display: inline-block; width: 240px;">
              <el-input-number
                v-model="HouseInfoForm.TotalFloor"
                :min="1"
                :max="100"
                style="width: 80px;"
                size="mini"
                controls-position="right"
              ></el-input-number>&emsp;层
            </el-form-item>
            <el-form-item
              label="所在楼层"
              style="display: inline-block; width: 200px;"
              label-width="80px"
            >
              <el-input-number
                v-model="HouseInfoForm.InFloor"
                :min="-6"
                :max="100"
                style="width: 80px;"
                size="mini"
                controls-position="right"
              ></el-input-number>&emsp;层
            </el-form-item>
            <el-form-item
              label="是否电梯房"
              style="display: inline-block; width: 240px;"
              label-width="100px"
            >
              <el-select v-model="HouseInfoForm.IsElevator" style="width: 80px;">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="建筑面积" prop="HouseArea">
              <el-input
                v-model="HouseInfoForm.HouseArea"
                size="mini"
                style="width: 80px;"
                type="number"
                v-positive="HouseInfoForm.HouseArea"
                min="0"
              ></el-input>&emsp;平方米
            </el-form-item>
            <el-form-item v-if="isUser">
              <el-button @click="HouseInfoNext" type="primary" plain>下一步</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template slot="2">
          <!-- 整租价格配置 -->
          <el-row
            v-show="HouseInfoForm.EnterType === '1' || HouseInfoForm.EnterType === '3'"
            style="margin: 20px 0;"
          >
            <!-- <el-row> -->
            <p class="panel-title">价格配置信息(整租)</p>
            <el-table
              :data="priceAllTable"
              border
              :header-cell-style="{background: '#f3f8fc'}"
              ref="priceAllTable"
              style="width: 1100px;"
            >
              <el-table-column label="朝向" width="120px" fixed="left" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.Toward">
                    <el-option
                      v-for="(item, index) in towardList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="160px"
                label="定金(元)"
                :render-header="renderDeposit"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.Deposit"
                    style="width: 100px;"
                    @blur="$positive(scope.row, 'Deposit', 0, false)"
                    type="number"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="160px"
                label="租金(元)"
                :render-header="renderDeposit"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.RentMoeny"
                    style="width: 100px;"
                    @blur="$positive(scope.row, 'RentMoeny', 0, false)"
                    type="number"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="付款方式" align="center" min-width="400px">
                <template slot-scope="scope">
                  <div style="display: inline-block">
                    押&emsp;
                    <el-select v-model="scope.row.PledgeNumber" style="width: 80px;">
                      <el-option
                        v-for="(item, index) in PledgeNumberList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div style="display: inline-block">
                    付&emsp;
                    <el-select v-model="scope.row.PayNumber" style="width: 80px;">
                      <el-option
                        v-for="(item, index) in PledgeList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="押金(元)" align="center" width="200px" fixed="right">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.Pledge"
                    style="width: 100px;"
                    @blur="$positive(scope.row, 'Pledge', 0, false)"
                    type="number"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!-- 合租价格配置 -->
          <el-row
            v-if="HouseInfoForm.EnterType === '2' || HouseInfoForm.EnterType === '3'"
            style="margin: 20px 0;"
          >
            <p class="panel-title" style="margin-top: 20px;">价格配置信息(合租)</p>
            <el-table
              :data="pricePartTable"
              border
              :header-cell-style="{background: '#f3f8fc'}"
              style="width: 100%;"
              ref="pricePartTable"
            >
              <el-table-column label="房间名称" width="120px" fixed="left" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.RoomName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="房间类型" width="160px" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.RoomType">
                    <el-option
                      v-for="item in RoomTypeList"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="房间面积(平方米)"
                width="160px"
                align="center"
                :render-header="renderDeposit"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.RoomArea"
                    style="width: 100px;"
                    @blur="$positive(scope.row, 'RoomArea', 0, false)"
                    type="number"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="朝向" width="120px" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.Toward">
                    <el-option
                      v-for="(item, index) in towardList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="160px"
                label="定金(元)"
                :render-header="renderDeposit"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.Deposit"
                    style="width: 100px;"
                    @blur="$positive(scope.row, 'Deposit', 0, false)"
                    type="number"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="160px"
                label="租金(元)"
                :render-header="renderDeposit"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.RentMoeny"
                    style="width: 100px;"
                    @blur="$positive(scope.row, 'RentMoeny', 0, false)"
                    type="number"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="付款方式" align="center" min-width="300px">
                <template slot-scope="scope">
                  <div style="display: inline-block">
                    押&emsp;
                    <el-select v-model="scope.row.PledgeNumber" style="width: 80px;">
                      <el-option
                        v-for="(item, index) in PledgeNumberList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div style="display: inline-block">
                    付&emsp;
                    <el-select v-model="scope.row.PayNumber" style="width: 80px;">
                      <el-option
                        v-for="(item, index) in PledgeList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="押金(元)" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.Pledge"
                    style="width: 100px;"
                    @blur="$positive(scope.row, 'Pledge', 0, false)"
                    type="number"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row style="margin-top: 40px;">
            <p class="panel-title">其他项目费用</p>
            <el-row>
              <el-checkbox-group v-model="HouseInfoForm.OtherBtnList">
                <el-checkbox
                  v-for="item in OtherBtnList"
                  :key="item.value"
                  :label="item.value"
                >{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-row>
          </el-row>
          <el-row style="margin-top: 40px;">
            <el-button @click="prev()" type="primary" plain>上一步</el-button>
            <el-button @click="PriceConfigNext" type="primary" plain>下一步</el-button>
          </el-row>
        </template>
        <template slot="3">
          <p class="panel-title">房源图片</p>
          <upload-file ref="uploadFile" :img-list="HouseInfoImg" :houseCostFalData="pricePartTable"></upload-file>
          <el-row style="margin-top: 40px;">
            <el-button @click="prev()" type="primary" plain>上一步</el-button>
            <el-button @click="HouseImgNext" type="primary" plain>下一步</el-button>
          </el-row>
        </template>
        <template slot="4">
          <p class="panel-title">房源配置</p>
          <el-row>
            <el-button type="primary" size="small" @click="openItemManage">物品管理</el-button>
          </el-row>
          <el-row>
            <div class="roomConfig" v-for="(item, index) in GoodsSum" :key="index">
              <div class="roomConfigLeft">
                <span class="ConfigLeftTitle">{{ item.RoomName }}</span>
              </div>
              <div class="roomConfigRight">
                <span
                  v-for="(goods, goodsIndex) in item.Equ"
                  :key="goodsIndex"
                >{{ goods.EquipmentName }}</span>
              </div>
            </div>
          </el-row>
          <p class="panel-title" style="margin-top: 20px;">房源描述</p>
          <el-input
            v-model="HouseDesc"
            type="textarea"
            style="width: 620px;"
            placeholder="对租客的要求,以及周边交通,生活配套等的描述"
            :rows="4"
          ></el-input>
          <el-row style="margin-top: 40px;">
            <p class="panel-title">个性标签</p>
            <el-row>
              <el-checkbox-group v-model="HouseInfoForm.BadgeList">
                <el-checkbox
                  v-for="item in BadgeList"
                  :key="item.value"
                  :label="item.value"
                >{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-row>
          </el-row>
          <el-row style="margin-top: 40px;">
            <el-button @click="prev()" type="primary" plain>上一步</el-button>
            <el-button
              @click="HouseInfoSave"
              type="success"
              :loading="SaveLoading"
              plain
              v-if="isSave"
              v-cloak
            >保存</el-button>
            <el-button
              @click="HouseInfoSubmit"
              type="primary"
              v-if="isSubmit"
              v-cloak
              :loading="SubMitLoading"
            >提交</el-button>
          </el-row>
        </template>
      </steps-box>
      <item-manage ref="itemManage" @getGoodsList="getGoodsList"></item-manage>
    </div>
  </div>
</template>

<script>
import StepsBox from '../../../components/StepsBox'
import { validNumber } from '@/utils/validate/index'
import { UploadFile } from './components/UploadFile/index'
import ItemManage from '@/components/ItemManage/index'
import { HousingSumbit, houseInfoListByID, perfectingHousingSumbitEdit } from '@/api/house'
import { mapActions } from 'vuex'

export default {
  name: 'CompleteHouse',
  components: {
    StepsBox,
    validNumber,
    UploadFile,
    ItemManage
  },
  data() {
    return {
      isSubmit: true,
      ABCList: (() => {
        var arr = []
        for (var i = 0; i < 26; i++) {
          arr.push(String.fromCharCode(97 + i))
        }
        return arr
      })(),
      isSave: true,
      HavaTenContract: true,
      SubMitLoading: false,
      // 时间控件限制
      pickerOptions: {
        disabledDate: time => {
          // return time.getTime() < this.StartTime || time.getTime() > this.EndTime
        }
      },
      // 测试触发深层渲染
      deepChangeCtr: true,
      // 判断是否首次进入
      isCompleting: true,
      // 判断权限
      isUser: true,
      CompleteLoading: false,
      listLoading: false,
      SaveLoading: false,
      itistrue: true,
      StartTime: '',
      EndTime: '',
      stepList: [
        {
          title: '门牌户型信息'
        },
        {
          title: '价格信息配置'
        },
        {
          title: '房源描述信息'
        },
        {
          title: '房源配置'
        }
      ],
      houseTypeList: [
        {
          value: 1,
          label: '住宅'
        },
        {
          value: 2,
          label: '公寓'
        },
        {
          value: 3,
          label: '别墅'
        },
        {
          value: 4,
          label: '老公房'
        },
        {
          value: 5,
          label: '洋房'
        },
        {
          value: 6,
          label: '四合院'
        }
      ],
      renovationList: [
        {
          label: '毛坯',
          value: 1
        },
        {
          label: '简单',
          value: 2
        },
        {
          label: '普通',
          value: 3
        },
        {
          label: '精装修',
          value: 4
        },
        {
          label: '豪华',
          value: 5
        }
      ],
      parkingList: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ],
      BadgeList: [
        {
          label: '不限性别',
          value: '不限性别',
          isSelect: false
        },
        {
          label: '限男',
          value: '限男',
          isSelect: false
        },
        {
          label: '限女',
          value: '限女',
          isSelect: false
        },
        {
          label: '限情侣',
          value: '限情侣',
          isSelect: false
        },
        {
          label: '可宠物',
          value: '可宠物',
          isSelect: false
        },
        {
          label: '可抽烟',
          value: '可抽烟',
          isSelect: false
        },
        {
          label: '可小孩',
          value: '可小孩',
          isSelect: false
        },
        {
          label: '租户稳定',
          value: '租户稳定',
          isSelect: false
        },
        {
          label: '一年起租',
          value: '一年起租',
          isSelect: false
        },
        {
          label: '半年起租',
          value: '半年起租',
          isSelect: false
        }
      ],
      OtherBtnList: [
        {
          label: '物业费',
          value: '物业费',
          isSelect: false
        },
        {
          label: '垃圾费',
          value: '垃圾费',
          isSelect: false
        },
        {
          label: '水电费',
          value: '水电费',
          isSelect: false
        },
        {
          label: '清洁费',
          value: '清洁费',
          isSelect: false
        },
        {
          label: '宽带费',
          value: '宽带费',
          isSelect: false
        },
        {
          label: '燃气费',
          value: '燃气费',
          isSelect: false
        },
        {
          label: '有线电视费',
          value: '有线电视费',
          isSelect: false
        },
        {
          label: '暖气费',
          value: '暖气费',
          isSelect: false
        },
        {
          label: '其他费',
          value: '其他费',
          isSelect: false
        }
      ],
      // 房间数
      minRoomCount: 1,
      // 暂用HouseKey
      CurIndex: 1,
      // 门牌户型信息表单
      HouseInfoForm: {
        EnterType: '1',
        // 房源名称
        HouseName: '',
        renovation: 3,
        parking: 0,
        OtherBtnList: [],
        BadgeList: [],
        // 详细地址
        Location: '',
        // 房源类型
        HouseType: 2,
        // 室
        RoomCount: 1,
        // 厅
        HallCount: 1,
        // 卫
        ToiletCount: 1,
        // 总楼层数
        TotalFloor: 1,
        // 所在楼层
        InFloor: 1,
        // 是否电梯房
        IsElevator: 1,
        // 建筑面积
        HouseArea: ''
      },
      HouseInfoRule: {
        HouseArea: [
          { required: true, message: '请输入建筑面积', trigger: 'blur' }
        ]
      },
      // 成本表格发送数据
      houseCostFalData: [
        {
          name: '整套',
          HouseID: 0,
          costList: [
            {
              cost: 0
            }
          ]
        }
      ],
      // 拿房成本表格
      costList: [],
      // 价格信息(整租)配置
      priceAllTable: [
        {
          Toward: 1,
          HouseID: 0,
          KeyID: 0,
          Deposit: '',
          RentMoeny: '',
          // 押几
          PledgeNumber: 1,
          // 付几
          PayNumber: 3,
          // 押金
          Pledge: 0
        }
      ],
      // 价格信息(合租)配置
      pricePartTable: [],
      // 朝向列表
      towardList: [
        {
          value: 1,
          label: '东'
        },
        {
          value: 2,
          label: '南'
        },
        {
          value: 3,
          label: '西'
        },
        {
          value: 3,
          label: '北'
        },
        {
          value: 5,
          label: '东南'
        },
        {
          value: 6,
          label: '东北'
        },
        {
          value: 7,
          label: '西南'
        },
        {
          value: 8,
          label: '西北'
        }
      ],
      // 押金列表
      PledgeNumberList: [
        {
          label: '1',
          value: 1
        },
        {
          label: '2',
          value: 2
        },
        {
          label: '3',
          value: 3
        }
      ],
      PledgeList: [
        {
          label: '1',
          value: 1
        },
        {
          label: '3',
          value: 3
        },
        {
          label: '6',
          value: 6
        },
        {
          label: '9',
          value: 9
        },
        {
          label: '12',
          value: 12
        }
      ],
      // 房间类型
      RoomTypeList: [
        {
          label: '主卧',
          value: 1
        },
        {
          label: '次卧',
          value: 2
        },
        {
          label: '主卧带独卫',
          value: 3
        },
        {
          label: '客厅隔断',
          value: 4
        },
        {
          label: '明隔',
          value: 5
        },
        {
          label: '小卧',
          value: 6
        }
      ],
      // 配置列表
      houseConfigList: [
        '电视',
        '吹风',
        '空调',
        '冰箱',
        '电视',
        '吹风',
        '空调',
        '冰箱',
        '电视',
        '吹风',
        '空调',
        '冰箱',
        '冰箱',
        '冰箱',
        '冰箱',
        '冰箱'
      ],
      // 房源描述
      HouseDesc: '',
      testTime: '123',
      // 图片列表
      HouseInfoImg: [],
      // 水电气管理
      EuSum: {},
      // 物品管理
      GoodsSum: [],
      // 拿房成本时间
      contractDateList: []
    }
  },
  created() {
    this.getHouseInfoList()
  },
  methods: {
    ...mapActions([
      'delView'
    ]),
    testTimeFun(data, index) {
      this.$set(this.costList, index, data)
    },
    // changeEnterType
    changeEnterType(type) {
      this.roomCountChange()
    },
    // 获取初始数据
    getHouseInfoList() {
      this.CompleteLoading = true
      houseInfoListByID({
        HouseKey: this.$route.query.HouseKey
      }).then(response => {
        if (response.Code === 0) {
          this.initHouseInfo(response.Data)
        } else {
          this.isUser = false
        }
      })
    },
    // 初始化页面
    initHouseInfo(data) {
      // HouseKey = 1
      // 出租方式
      if (data.EnterType === '0') {
        this.isCompleting = false
      }
      this.HouseInfoForm.EnterType = data.EnterType === '0' ? '1' : data.EnterType
      this.HouseInfoForm.HouseName = `${data.HouseName}`
      this.HouseInfoForm.Location = data.Location
      this.HavaTenContract = data.HavaTenContract
      if (this.$route.query.type === 'aduit' || this.$route.query.type === 'edit') {
        this.isSubmit = false
      } else {
        this.isSubmit = true
      }
      data.contractDateList.forEach(ele => {
        this.contractDateList.push(ele.BillEndDate)
      })
      if (this.isCompleting) {
        this.minRoomCount = data.RoomCount
        // 房源类型
        this.HouseInfoForm.HouseType = data.HouseType
        this.HouseInfoForm.OtherBtnList = data.costList ? data.costList : []
        this.HouseInfoForm.BadgeList = data.label ? data.label : []
        this.HouseInfoForm.parking = !data.parking && data.parking !== 0 ? 0 : data.parking
        this.HouseInfoForm.renovation = !data.renovation && data.renovation !== 0 ? 3 : data.renovation
        // 几室
        this.HouseInfoForm.RoomCount = data.RoomCount
        // 几厅
        this.HouseInfoForm.HallCount = data.HallCount
        // 几卫
        this.HouseInfoForm.ToiletCount = data.ToiletCount
        // 总楼层数
        this.HouseInfoForm.TotalFloor = data.TotalFloor
        // 所在楼层
        this.HouseInfoForm.InFloor = data.InFloor
        // 是否电梯房
        this.HouseInfoForm.IsElevator = data.IsElevator
        // 面积
        this.HouseInfoForm.HouseArea = data.HouseArea
        // 整租对象
        this.$set(this.priceAllTable, 0, data.Rh)
        // 合租对象
        this.pricePartTable = data.flatmate
        // 图片
        data.PicSum.forEach((ele, index) => {
          this.$set(this.HouseInfoImg, index, ele.ImgList)
        })
      } else {
        // 面积
        this.HouseInfoForm.HouseArea = data.HouseArea
        this.costList.push({
          StartDate: data.contractDateList[0].BillStartDate,
          EndDate: ''
        })
        this.HouseInfoImg.push([])
      }
      // 物品管理
      data.GoodsSum.forEach((ele, index) => {
        this.$set(this.GoodsSum, index, ele.Equ)
      })
      // 水电气卡号管理
      this.EuSum = !data.EuSum ? {} : data.EuSum
      this.CompleteLoading = false
      // 房源备注
      this.HouseDesc = data.HouseDesc
    },
    next() {
      this.$refs.steps.nextStep()
    },
    prev() {
      this.$refs.steps.prevStep()
    },
    // 自定义成本记录表头
    renderHeader(h, { column, $index }, index) {
      return h('span', [
        h('span', column.label),
        h('span', {
          class: 'iconfont icon-shanjianmoren',
          style: 'margin-left: 12px; color: #FF5A5A; cursor: pointer; font-size: 17px;',
          on: {
            click: () => {
              var CurIndex = $index - 1
              var newDate = this.costList[CurIndex].EndDate
              this.costList.splice(CurIndex, 1)
              this.costList[CurIndex - 1].EndDate = newDate
              const aaa = this.$deepCopy(this.costList[CurIndex - 1])
              this.costList.splice(CurIndex - 1, 1, aaa)
              this.houseCostFalData.forEach(i => {
                i.costList.splice(CurIndex, 1)
              })
              var middleMan = this.costList
              this.costList = []
              middleMan.forEach((ele, index) => {
                this.$set(this.costList, index, ele)
              })
            }
          }
        })
      ])
    },
    renderHeader2(h, { column, $index }, index) {
      return h('span', [
        h('span', column.label)
      ])
    },
    // 定金表头
    renderDeposit(h, { column, $index }) {
      return h('span', [
        h(
          'span',
          {
            style: 'margin-left: 12px; color: red'
          },
          '*'
        ),
        h('span', column.label)
      ])
    },
    // 切换几室几厅触发后面列表改变
    roomCountChange() {
      if (this.HouseInfoForm.EnterType === '3') {
        this.pricePartTable.splice(this.HouseInfoForm.RoomCount, this.pricePartTable.length)
      } else if (this.HouseInfoForm.EnterType === '2') {
        for (var k = 0; k < this.HouseInfoForm.RoomCount; k++) {
          if (!this.pricePartTable[k]) {
            var pobj2 = {
              RoomName: this.ABCList[k],
              HouseStatus: 0,
              RenovationStatus: 0,
              ReserveStatus: 0,
              RoomType: 1,
              RoomArea: '',
              Toward: 1,
              IsRent: false,
              Deposit: '',
              RentMoeny: '',
              PledgeNumber: 1,
              PayNumber: 3,
              Pledge: 0,
              ShareProportion: 0
            }
            this.$set(this.pricePartTable, k, pobj2)
          }
          // this.houseCostFalData.splice(this.HouseInfoForm.RoomCount, this.houseCostFalData.length)
          this.pricePartTable.splice(this.HouseInfoForm.RoomCount, this.pricePartTable.length)
        }
      } else {
        this.pricePartTable = []
      }
      if (this.HouseInfoForm.EnterType === '1') {
        // 图片数组处理
        if (!this.HouseInfoImg[0]) {
          this.HouseInfoImg.splice(0, this.HouseInfoImg.length)
          this.$set(this.HouseInfoImg, 0, [])
        } else {
          this.HouseInfoImg.splice(1, this.HouseInfoImg.length)
        }
        // 物品数组处理
        if (!this.GoodsSum[0]) {
          this.GoodsSum.splice(0, this.GoodsSum.length)
          this.$set(this.GoodsSum, 0, [])
        } else {
          this.GoodsSum.splice(1, this.GoodsSum.length)
        }
      } else if (this.HouseInfoForm.EnterType === '3' || this.HouseInfoForm.EnterType === '2') {
        // 图片数组处理
        if (!this.HouseInfoImg[0]) {
          this.HouseInfoImg.splice(0, this.HouseInfoImg.length)
          this.$set(this.HouseInfoImg, 0, [])
        }
        this.pricePartTable.forEach((ele, index) => {
          if (!this.HouseInfoImg[index + 1]) {
            this.$set(this.HouseInfoImg, index + 1, [])
          }
        })
        this.HouseInfoImg.splice(this.pricePartTable.length + 1, this.HouseInfoImg.length)
        // 物品数组处理
        if (!this.GoodsSum[0]) {
          this.GoodsSum.splice(0, this.GoodsSum.length)
          this.$set(this.GoodsSum, 0, [])
        }
        this.pricePartTable.forEach((ele, index) => {
          if (!this.GoodsSum[index + 1]) {
            this.$set(this.GoodsSum, index + 1, [])
          }
        })
        this.GoodsSum.splice(this.pricePartTable.length + 1, this.GoodsSum.length)
      }
      // }
    },
    // 打开物品管理
    openItemManage() {
      console.log(this.GoodsSum)
      this.$refs['itemManage'].open({
        HouseKey: this.$route.query.HouseKey,
        HouseConfigInfo: this.$deepCopy(this.GoodsSum),
        HouseUtiliti: this.$deepCopy(this.EuSum)
      })
    },
    // 处理物品管理数据
    getGoodsList(data) {
      this.GoodsSum = data.HouseConfigInfo
      data.HouseConfigInfo.forEach((ele, index) => {
        this.$set(this.GoodsSum, index, ele)
      })
      debugger
      this.EuSum = data.HouseUtiliti
      this.$refs['itemManage'].close()
    },
    // 第一页下一步
    HouseInfoNext() {
      this.$refs['HouseInfoForm'].validate(valid => {
        if (valid) {
          this.next()
        } else {
          return false
        }
      })
    },
    // 第三页下一步
    PriceConfigNext() {
      if (this.PriceConfigValid()) {
        this.changeName()
        this.next()
      }
    },
    // 第四页下一步
    HouseImgNext() {
      var PicNotNull = true
      if (PicNotNull) {
        var GoodsNewSum = []
        if (this.GoodsSum.length === 0) {
          this.GoodsSum.push([])
        }
        this.GoodsSum.forEach((ele, index) => {
          GoodsNewSum[index] = {}
          if (Array.isArray(ele)) {
            GoodsNewSum[index].Equ = ele
          } else {
            GoodsNewSum[index] = ele
          }
          if (index === 0) {
            GoodsNewSum[index].RoomName = '公共'
            GoodsNewSum[index].HouseID = 0
          } else {
            GoodsNewSum[index].RoomName = this.pricePartTable[index - 1].RoomName
            GoodsNewSum[index].HouseID = this.pricePartTable[index - 1].KeyID
          }
          GoodsNewSum[index].HouseKey = this.$route.query.HouseKey
        })
        this.GoodsSum = GoodsNewSum
        this.next()
      }
    },
    // 价格配置验证
    PriceConfigValid() {
      var isComplete = true
      if (this.HouseInfoForm.EnterType === '1') {
        this.priceAllTable.forEach(i => {
          if (!i.Deposit && i.Deposit !== 0) {
            this.$message({
              message: '温馨提示: 定金不能为空',
              type: 'warning'
            })
            isComplete = false
          } else if (!i.RentMoeny && i.RentMoeny !== 0) {
            this.$message({
              message: '温馨提示: 租金不能为空',
              type: 'warning'
            })
            isComplete = false
          }
        })
      } else if (this.HouseInfoForm.EnterType === '2') {
        this.pricePartTable.forEach(i => {
          if (i.RoomArea === 0) {
            this.$message({
              message: '温馨提示: 房间面积不能为0',
              type: 'warning'
            })
            isComplete = false
          } else if (!i.RoomArea && i.RoomArea !== 0) {
            this.$message({
              message: '温馨提示: 房间面积不能为空',
              type: 'warning'
            })
            isComplete = false
          } else if (!i.Deposit && i.Deposit !== 0) {
            this.$message({
              message: '温馨提示: 定金不能为空',
              type: 'warning'
            })
            isComplete = false
          } else if (!i.RentMoeny && i.RentMoeny !== 0) {
            this.$message({
              message: '温馨提示: 租金不能为空',
              type: 'warning'
            })
            isComplete = false
          }
        })
      } else {
        this.priceAllTable.forEach(i => {
          if (!i.Deposit && i.Deposit !== 0) {
            this.$message({
              message: '温馨提示: 定金不能为空',
              type: 'warning'
            })
            isComplete = false
          } else if (!i.RentMoeny && i.RentMoeny !== 0) {
            this.$message({
              message: '温馨提示: 租金不能为空',
              type: 'warning'
            })
            isComplete = false
          }
        })
        this.pricePartTable.forEach(i => {
          if (!i.Deposit && i.Deposit !== 0) {
            this.$message({
              message: '温馨提示: 定金不能为空',
              type: 'warning'
            })
            isComplete = false
          } else if (!i.RentMoeny && i.RentMoeny !== 0) {
            this.$message({
              message: '温馨提示: 租金不能为空',
              type: 'warning'
            })
            isComplete = false
          }
        })
      }
      return isComplete
    },
    // 图片修改
    changeName() {
      // this.deepChangeCtr = false
      // const newData = this.houseCostFalData[0]
      // this.$set(this.houseCostFalData, 0, newData)
      // this.deepChangeCtr = true
    },
    // 保存
    HouseInfoSave() {
      this.SaveLoading = true
      const self = this
      if (this.$route.query.type === 'edit') {
        perfectingHousingSumbitEdit({
          HouseKey: this.$route.query.HouseKey,
          // 出租方式
          EnterType: this.HouseInfoForm.EnterType,
          HouseName: this.HouseInfoForm.HouseName,
          Location: this.HouseInfoForm.Location,
          // 房源类型
          HouseType: this.HouseInfoForm.HouseType,
          renovation: this.HouseInfoForm.renovation,
          parking: this.HouseInfoForm.parking,
          costList: this.HouseInfoForm.OtherBtnList,
          label: this.HouseInfoForm.BadgeList,
          // 几室
          RoomCount: this.HouseInfoForm.RoomCount,
          // 几厅
          HallCount: this.HouseInfoForm.HallCount,
          // 几卫
          ToiletCount: this.HouseInfoForm.ToiletCount,
          // 总楼层数
          TotalFloor: this.HouseInfoForm.TotalFloor,
          // 所在楼层
          InFloor: this.HouseInfoForm.InFloor,
          // 是否电梯房
          IsElevator: this.HouseInfoForm.IsElevator,
          // 面积
          HouseArea: this.HouseInfoForm.HouseArea,
          // 拿房成本
          // houseCostInfoList: this.HouseCostResList,
          // 整租对象
          Rh: this.HouseInfoForm.EnterType !== '2' ? this.priceAllTable[0] : {},
          // 合租对象
          flatmate: this.pricePartTable,
          // 图片
          PicSum: (() => {
            var HouseImgList = []
            self.HouseInfoImg.forEach((ele, index) => {
              HouseImgList[index] = {}
              if (index === 0) {
                HouseImgList[index].RoomName = '公共'
                HouseImgList[index].HouseID = 0
              } else {
                if (self.HouseInfoForm.EnterType !== 1) {
                  HouseImgList[index].RoomName = self.pricePartTable[index - 1].RoomName
                  HouseImgList[index].HouseID = self.pricePartTable[index - 1].KeyID
                }
              }
              HouseImgList[index].HouseKey = this.$route.query.HouseKey
              HouseImgList[index].ImgList = ele
            })
            return HouseImgList
          })(),
          // 物品集合
          GoodsSum: this.GoodsSum,
          Table: this.HouseInfoForm.Table,
          // 水电气卡号管理
          EuSum: this.EuSum,
          // 房源描述
          HouseDesc: this.HouseDesc,
          // 提交状态
          SubmitState: '保存'
        }).then(response => {
          self.SaveLoading = false
          self.$message({
            message: '保存成功!',
            type: 'success'
          })
          self.delView(self.$route)
          self.$router.push({
            path: '/House/HouseList'
          })
        })
      } else {
        HousingSumbit({
          HouseKey: this.$route.query.HouseKey,
          // 出租方式
          EnterType: this.HouseInfoForm.EnterType,
          HouseName: this.HouseInfoForm.HouseName,
          Location: this.HouseInfoForm.Location,
          // 房源类型
          HouseType: this.HouseInfoForm.HouseType,
          renovation: this.HouseInfoForm.renovation,
          parking: this.HouseInfoForm.parking,
          costList: this.HouseInfoForm.OtherBtnList,
          label: this.HouseInfoForm.BadgeList,
          // 几室
          RoomCount: this.HouseInfoForm.RoomCount,
          // 几厅
          HallCount: this.HouseInfoForm.HallCount,
          // 几卫
          ToiletCount: this.HouseInfoForm.ToiletCount,
          // 总楼层数
          TotalFloor: this.HouseInfoForm.TotalFloor,
          // 所在楼层
          InFloor: this.HouseInfoForm.InFloor,
          // 是否电梯房
          IsElevator: this.HouseInfoForm.IsElevator,
          // 面积
          HouseArea: this.HouseInfoForm.HouseArea,
          // 拿房成本
          // houseCostInfoList: this.HouseCostResList,
          // 整租对象
          Rh: this.HouseInfoForm.EnterType !== '2' ? this.priceAllTable[0] : {},
          // 合租对象
          flatmate: this.pricePartTable,
          // 图片
          PicSum: (() => {
            var HouseImgList = []
            self.HouseInfoImg.forEach((ele, index) => {
              HouseImgList[index] = {}
              if (index === 0) {
                HouseImgList[index].RoomName = '公共'
                HouseImgList[index].HouseID = 0
              } else {
                if (self.HouseInfoForm.EnterType !== 1) {
                  HouseImgList[index].RoomName = self.pricePartTable[index - 1].RoomName
                  HouseImgList[index].HouseID = self.pricePartTable[index - 1].KeyID
                }
              }
              HouseImgList[index].HouseKey = this.$route.query.HouseKey
              HouseImgList[index].ImgList = ele
            })
            return HouseImgList
          })(),
          // 物品集合
          GoodsSum: this.GoodsSum,
          Table: this.HouseInfoForm.Table,
          // 水电气卡号管理
          EuSum: this.EuSum,
          // 房源描述
          HouseDesc: this.HouseDesc,
          // 提交状态
          SubmitState: '保存'
        }).then(response => {
          self.SaveLoading = false
          self.$message({
            message: '保存成功!',
            type: 'success'
          })
          self.delView(self.$route)
          self.$router.push({
            path: '/House/HouseList'
          })
        }).catch(() => {
          self.SaveLoading = false
        })
      }
    },
    // 提交
    HouseInfoSubmit() {
      const self = this
      this.SubMitLoading = true
      this.$confirm('是否提交房源信息?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        HousingSumbit({
          HouseKey: this.$route.query.HouseKey,
          // 出租方式
          EnterType: this.HouseInfoForm.EnterType,
          HouseName: this.HouseInfoForm.HouseName,
          Location: this.HouseInfoForm.Location,
          // 房源类型
          HouseType: this.HouseInfoForm.HouseType,
          renovation: this.HouseInfoForm.renovation,
          parking: this.HouseInfoForm.parking,
          costList: this.HouseInfoForm.OtherBtnList,
          label: this.HouseInfoForm.BadgeList,
          // 几室
          RoomCount: this.HouseInfoForm.RoomCount,
          // 几厅
          HallCount: this.HouseInfoForm.HallCount,
          // 几卫
          ToiletCount: this.HouseInfoForm.ToiletCount,
          // 总楼层数
          TotalFloor: this.HouseInfoForm.TotalFloor,
          // 所在楼层
          InFloor: this.HouseInfoForm.InFloor,
          // 是否电梯房
          IsElevator: this.HouseInfoForm.IsElevator,
          // 面积
          HouseArea: this.HouseInfoForm.HouseArea,
          // 拿房成本
          // houseCostInfoList: this.HouseCostResList,
          // 整租对象
          Rh: this.HouseInfoForm.EnterType !== '2' ? this.priceAllTable[0] : {},
          // 合租对象
          flatmate: this.pricePartTable,
          // 图片
          PicSum: (() => {
            var HouseImgList = []
            self.HouseInfoImg.forEach((ele, index) => {
              HouseImgList[index] = {}
              if (index === 0) {
                HouseImgList[index].RoomName = '公共'
                HouseImgList[index].HouseID = 0
              } else {
                if (self.HouseInfoForm.EnterType !== 1) {
                  HouseImgList[index].RoomName = self.pricePartTable[index - 1].RoomName
                  HouseImgList[index].HouseID = self.pricePartTable[index - 1].KeyID
                }
              }
              HouseImgList[index].HouseKey = self.$route.query.HouseKey
              HouseImgList[index].ImgList = ele
            })
            return HouseImgList
          })(),
          // 物品集合
          GoodsSum: this.GoodsSum,
          // 水电气卡号管理
          EuSum: this.EuSum,
          Table: this.$route.query.type === 'edit' ? 'new' : this.HouseInfoForm.Table,
          // 房源描述
          HouseDesc: this.HouseDesc,
          // 提交状态
          SubmitState: '提交'
        }).then(response => {
          self.$message({
            message: '提交成功!',
            type: 'success'
          })
          self.SubMitLoading = false
          self.delView(self.$route)
          self.$router.push({
            path: '/House/HouseList'
          })
          this.tableData = response.Data.rows
          this.HouseCount = response.Data.Param.records
        }).catch(() => {
          self.SubMitLoading = false
        })
      }).catch(() => {
        self.SubMitLoading = false
      })
    }
  },
  updated() {
    this.$nextTick(() => {
      var child = document.querySelector('.delDomTable .el-table__fixed[style] .el-table__fixed-header-wrapper table:first-child thead tr:last-child')
      var child2 = document.querySelector('.delDomTable .el-table__fixed[style] .el-table__fixed-header-wrapper table:first-child thead tr:first-child')
      var delDom = document.querySelectorAll('.delDomTable .el-table__fixed[style] .el-table__fixed-header-wrapper table:first-child thead tr')
      if (delDom.length > 1) {
        child.innerHTML = ''
        child2.style.height = '120px'
      }
    })
  }
}
</script>

<style scoped lang="scss">
@import "style";
</style>

<style lang="scss">
.app-container {
  .superTableSelect {
    .el-input__suffix {
      right: 10px !important;
    }
  }
}
[v-cloak] {
  display: none;
}
</style>
