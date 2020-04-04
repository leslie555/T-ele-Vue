<template>
  <div class="app-container">
    <div class="panel">
      <!-- 房源信息标题 -->
      <div class="HouseInfoTitle">
        <el-row style="margin-bottom: 30px;">
          <span
            class="TitleName"
          >{{'(' + $EnumData.getEnumDesByValue('EnterType', HouseInfoForm.EnterType) + ')'}}&emsp;{{ HouseInfoForm.HouseName }}</span>
          <span
            class="TitleStatus"
          >{{ $EnumData.getEnumDesByValue('HouseStatus', HouseInfoForm.HouseStatus) }}</span>
        </el-row>
        <el-row>
          <div class="titleBox titleLeft">
            <span>房源编号: &emsp;NO.{{ HouseInfoForm.HouseCode }}</span>
          </div>
          <div class="titleBox">
            <span>管房人: &emsp;{{ HouseInfoForm.EmployeeName }}</span>
          </div>
        </el-row>
      </div>
      <!-- 审核详情 -->
      <div class="HouseInfoContent">
        <div class="panel-title">审核详情</div>
        <div class="ContentItem">
          <el-row>
            <div class="ContentBox ContentBoxLeft">
              <span class="ContentName">审核状态:</span>
              <span
                class="ContentValue"
              >{{ $EnumData.getEnumDesByValue('AuditStatus', AuditStatus) }}</span>
            </div>
            <div class="ContentBox">
              <span class="ContentName">审核人:</span>
              <span class="ContentValue">{{ AuditorName }}</span>
            </div>
          </el-row>
          <el-row>
            <div class="ContentBox ContentBoxLeft">
              <span class="ContentName">审核备注:</span>
              <span class="ContentValue">{{ AuditRemark }}</span>
            </div>
            <div class="ContentBox">
              <span class="ContentName">审核时间:</span>
              <span class="ContentValue">{{ $dateFormat(AuditTime) }}</span>
            </div>
          </el-row>
        </div>
      </div>
      <!-- 门牌户型信息 -->
      <div class="HouseInfoContent">
        <div class="panel-title">门牌户型信息</div>
        <div class="ContentItem">
          <el-row>
            <div class="ContentBox ContentBoxLeft">
              <span class="ContentName">房源类型:</span>
              <span
                class="ContentValue"
              >{{ $EnumData.getEnumDesByValue('HouseType', HouseInfoForm.HouseType) }}</span>
            </div>
            <div class="ContentBox">
              <span class="ContentName">详细地址:</span>
              <span class="ContentValue">{{ HouseInfoForm.Location }}</span>
            </div>
          </el-row>
          <el-row>
            <div class="ContentBox ContentBoxLeft">
              <span class="ContentName">实际出租户型:</span>
              <span
                class="ContentValue"
              >{{ HouseInfoForm.RoomCount }}室{{ HouseInfoForm.HallCount }}厅{{ HouseInfoForm.ToiletCount }}卫</span>
            </div>
            <div class="ContentBox">
              <span class="ContentName">业主到期时间:</span>
              <span class="ContentValue">{{ $dateFormat(HouseInfoForm.EndDate) }}</span>
            </div>
          </el-row>
          <el-row>
            <div class="ContentBox ContentBoxLeft">
              <span class="ContentName">总楼层数:</span>
              <span class="ContentValue">{{ HouseInfoForm.TotalFloor }}层</span>
            </div>
            <div class="ContentBox">
              <span class="ContentName">所在楼层:</span>
              <span class="ContentValue">{{ HouseInfoForm.InFloor }}层</span>
            </div>
          </el-row>
          <el-row>
            <div class="ContentBox ContentBoxLeft">
              <span class="ContentName">是否电梯房:</span>
              <span class="ContentValue">{{ HouseInfoForm.IsElevator === 0 ? '否' : '是'}}</span>
            </div>
            <div class="ContentBox">
              <span class="ContentName">建筑面积:</span>
              <span class="ContentValue">{{ HouseInfoForm.HouseArea }}平方米</span>
            </div>
          </el-row>
        </div>
      </div>
      <!-- 价格配置信息(整租) -->
      <div
        class="HouseInfoTable"
        :key="HouseInfoForm.EnterType"
        v-if="HouseInfoForm.EnterType !== 2"
      >
        <div class="panel-title">价格配置信息(整租)</div>
        <el-table
          :data="priceAllTable"
          border
          :header-cell-style="{background: '#f3f8fc'}"
          ref="priceAllTable"
          style="width: 90%"
        >
          <el-table-column label="朝向" width="120px" fixed="left" align="center">
            <template slot-scope="scope">
              <span>{{ $EnumData.getEnumDesByValue('Toward', scope.row.Toward) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="160px" label="定金(元)" prop="Deposit"></el-table-column>
          <el-table-column align="center" width="160px" label="租金(元)" prop="RentMoeny"></el-table-column>
          <el-table-column label="付款方式" align="center" width="600px">
            <template slot-scope="scope">
              <div
                style="display: inline-block"
              >押{{ scope.row.PledgeNumber }}付{{ scope.row.PayNumber }}</div>
            </template>
          </el-table-column>
          <el-table-column label="押金(元)" align="center" prop="Pledge"></el-table-column>
        </el-table>
      </div>
      <!-- 价格配置信息(合租) -->
      <div
        class="HouseInfoTable"
        :key="HouseInfoForm.EnterType"
        v-if="HouseInfoForm.EnterType !== 1"
      >
        <div class="panel-title">价格配置信息(合租)</div>
        <el-table
          :data="pricePartTable"
          border
          :header-cell-style="{background: '#f3f8fc'}"
          style="width: 100%;"
          ref="pricePartTable"
        >
          <el-table-column label="房间名称" width="120px" fixed="left" align="center" prop="RoomName"></el-table-column>
          <el-table-column label="房间类型" width="160px" align="center" prop="RoomType">
            <template
              slot-scope="scope"
            >{{ $EnumData.getEnumDesByValue('RoomType', scope.row.RoomType) }}</template>
          </el-table-column>
          <el-table-column label="房间面积(平方米)" width="160px" align="center" prop="RoomArea"></el-table-column>
          <el-table-column label="朝向" width="120px" align="center">
            <template slot-scope="scope">
              <span>{{ $EnumData.getEnumDesByValue('Toward', scope.row.Toward) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="160px" label="定金" prop="Deposit"></el-table-column>
          <el-table-column align="center" width="160px" label="租金" prop="RentMoeny"></el-table-column>
          <el-table-column label="付款方式" align="center" width="300px">
            <template slot-scope="scope">
              <div style="display: inline-block">
                押
                <span>{{ scope.row.PledgeNumber }}</span>
              </div>
              <div style="display: inline-block">
                付
                <span>{{ scope.row.PayNumber }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="押金(元)" align="center" prop="Pledge"></el-table-column>
          <el-table-column
            label="水电气分摊比例(%)"
            align="center"
            fixed="right"
            width="160px"
            prop="ShareProportion"
          ></el-table-column>
        </el-table>
      </div>
      <!-- 图片展示 -->
      <div class="HouseInfoImgBox">
        <div class="panel-title">房源照片</div>
        <div
          class="upload-imgs"
          v-for="(img, imgIndex) in HouseInfoImg"
          :key="imgIndex"
          v-show="img.length > 0"
        >
          <div
            class="upload-img-name"
          >{{ imgIndex === 0 ? '公共区域图片' : pricePartTable[imgIndex - 1].RoomName + '图片' }}</div>
          <div class="upload-img-Box" v-viewer="{url: 'data-src'}">
            <div class="upload-img" v-for="(item, index) in img" :key="index">
              <img
                :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                :data-src="$ImgUnit.getImgUrl(item.ImageLocation)"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="HouseInfoConfig">
        <div class="panel-title">房源配置</div>
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
      </div>
      <div class="HouseInfoDesc">
        <div class="panel-title">房源描述</div>
        <p class="HouseInfoDescBox">{{ !HouseDesc ? '暂无描述' : HouseDesc}}</p>
      </div>
      <div class="HouseInfoDesc" v-cloak v-if="AuditStatus === 1">
        <div style="width: 100%; text-align: center">
          <el-button @click="HouseAduit">审核</el-button>
        </div>
      </div>
    </div>
    <ExcuteAudit ref="HouseExcuteAudit" @updateAudit="changeState"></ExcuteAudit>
  </div>
</template>
<script>
  import { houseInfoListByID } from '@/api/house'
  import ExcuteAudit from '@/components/ExcuteAudit'

  export default {
    name: 'HouseInfo',
    components: {
      ExcuteAudit
    },
    data() {
      return {
        // 审核人
        AuditorName: '',
        AuditTime: '',
        AuditStatus: '',
        AuditRemark: '',
        HouseDesc: '',
        isAduit: false,
        // 成本表格发送数据
        houseCostFalData: [
          {
            name: '整套',
            costList: [
              {
                cost: 0
              }
            ]
          }
        ],
        // 房间信息表
        HouseInfoForm: {
          EnterType: 1,
          // 房源名称
          HouseName: '',
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
          IsElevator: 0,
          // 建筑面积
          HouseArea: '',
          // 官方人姓名
          EmployeeName: '',
          // 房源编号
          HouseCode: '',
          // 房源状态
          HouseStatus: 0
        },
        // 拿房成本表格
        costList: [],
        // 价格信息(整租)配置
        priceAllTable: [
          {
            Toward: 'East',
            IsRent: false,
            Deposit: '',
            RentMoeny: '',
            PledgeNumber: 1,
            PayNumber: 3,
            Pledge: ''
          }
        ],
        // 价格信息(合租)配置
        pricePartTable: [],
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
        // 图片列表
        HouseInfoImg: [],
        // 水电气管理
        EuSum: {},
        // 物品管理
        GoodsSum: []
      }
    },
    created() {
      console.log(this.$store.getters.enumList)
      this.getHouseInfoList()
      console.log(this.costList)
    },
    methods: {
      getHouseInfoList() {
        houseInfoListByID({
          HouseKey: this.$route.query.HouseKey
        }).then(response => {
          this.initHouseInfo(response.Data)
        })
      },
      initHouseInfo(data) {
        if (this.$route.query.AuditID > 0) {
          this.isAduit = true
        }
        this.HouseInfoForm.HouseName = data.HouseName
        this.HouseInfoForm.EnterType = parseInt(data.EnterType)
        this.HouseInfoForm.Location = data.Location
        this.AuditorName = data.AuditorName
        this.AuditTime = data.AuditTime
        this.AuditStatus = data.AuditStatus
        this.AuditRemark = data.AuditRemark
        this.HouseDesc = data.HouseDesc
        // 房源类型
        this.HouseInfoForm.EmployeeName = data.EmployeeName
        this.HouseInfoForm.HouseCode = data.HouseCode
        this.HouseInfoForm.HouseStatus = data.HouseStatus
        this.HouseInfoForm.HouseType = data.HouseType
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
        this.HouseInfoForm.EndDate = data.EndDate
        // 是否电梯房
        this.HouseInfoForm.IsElevator = data.IsElevator
        // 面积
        this.HouseInfoForm.HouseArea = data.HouseArea
        // 拿房成本
        data.houseCostInfoList[0].CostInfo.forEach((itemEle, itemIndex) => {
          this.$set(this.houseCostFalData, itemIndex, {})
          this.houseCostFalData[itemIndex].name = itemEle.RoomName
          this.houseCostFalData[itemIndex].costList = []
        })
        this.costList.splice(0, 1)
        data.houseCostInfoList.forEach((ele, index) => {
          this.costList.push({
            StartDate: ele.StartTime,
            EndDate: ele.EndTime
          })
          ele.CostInfo.forEach((itemEle, itemIndex) => {
            this.houseCostFalData[itemIndex].costList[index] = {
              cost: itemEle.RoomCost
            }
          })
        })
        // 整租对象
        this.$set(this.priceAllTable, 0, data.Rh)
        // 合租对象
        this.pricePartTable = data.flatmate
        // 图片
        data.PicSum.forEach((ele, index) => {
          this.HouseInfoImg[index]
          this.HouseInfoImg[index] = ele.ImgList
        })
        // 物品管理
        data.GoodsSum.forEach((ele, index) => {
          this.$set(this.GoodsSum, index, ele)
        })
        // 水电气卡号管理
        this.EuSum = !data.EuSum ? {} : data.EuSum
        this.CompleteLoading = false
      },
      HouseAduit() {
        this.$refs['HouseExcuteAudit'].open([this.$route.query.AuditID])
      },
      changeState(data) {
        debugger
        this.AuditStatus = data[0].AuditStatus
        this.AuditRemark = data[0].Remark
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "style";
</style>
