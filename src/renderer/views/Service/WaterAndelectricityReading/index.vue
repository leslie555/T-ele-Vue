<template>
  <div class="app-container data-list">
    <search-panel :model="form" ref="form" label-width="80px">
      <template slot="search">
        <el-form-item label="请选择房源" label-width="90px">
          <el-select
            v-model="form.CommunityName"
            placeholder="小区"
            filterable
            remote
            :remote-method="GetDropList"
          >
            <el-option
              v-for="(item, index) in areaList"
              :key="item.KeyID"
              :label="item.CommunityName"
              :value="item.CommunityName"
              @click.native="GetAfterdata(index, item.KeyID)"
            ></el-option>
          </el-select>
          <el-select v-model="form.Building" placeholder="栋">
            <el-option
              v-for="(item, index) in BuildingList"
              :key="item.BuildingName"
              :label="item.BuildingName"
              :value="item.BuildingName"
              @click.native="GetBulingList(index)"
            ></el-option>
          </el-select>
          <el-select v-model="form.UnitNumber" placeholder="单元号">
            <el-option
              v-for="(item, index) in BuildingUnitList"
              :key="item.UnitNumberName"
              :label="item.UnitNumberName"
              :value="item.UnitNumberName"
              @click.native="GetUnitList(index)"
            ></el-option>
          </el-select>
          <el-select v-model="form.RoomNumber" placeholder="门牌号">
            <el-option
              v-for="(item, index) in BuildingDoorNumberList"
              :key="item.RoomNumberName"
              :label="item.RoomNumberName"
              :value="item.RoomNumberName"
              @click.native="GetSearchTableList(index)"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button size="medium" type="primary" v-setbtn:Add @click="handleMeters">抄表</el-button>
        <el-button size="medium" type="primary" @click="handleconfigurePrice">配置单价</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table
        :data="TableListWaterDatas"
        ref="multipleTable"
        v-loading.body="listLoading"
        element-loading-text="加载中"
        class="table-normal"
        height="100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" prop="HouseName" label="房源名称" min-width="250">
          <template slot-scope="scope">{{scope.row.HouseName}}</template>
        </el-table-column>
        <el-table-column prop="WaterMeter" align="center" label="水表" min-width="150">
          <el-table-column prop="WaterMeter" align="center" label="读数(吨)" min-width="120">
            <template slot-scope="scope">{{scope.row.WaterMeter}}</template>
          </el-table-column>
          <el-table-column prop="WaterMeter" align="center" label="用量(吨)" min-width="120">
            <template slot-scope="scope">{{scope.row.WaterNumber}}</template>
          </el-table-column>
          <el-table-column prop="WaterMeter" align="center" label="单价(元)" min-width="120">
            <template slot-scope="scope">{{scope.row.WaterPrice}}</template>
          </el-table-column>
        </el-table-column>

        <el-table-column prop="ElectricityMeter" align="center" label="电表" min-width="150">
          <el-table-column prop="WaterMeter" align="center" label="读数(度)" min-width="120">
            <template slot-scope="scope">{{scope.row.ElectricityMeter}}</template>
          </el-table-column>
          <el-table-column prop="WaterMeter" align="center" label="用量(度)" min-width="120">
            <template slot-scope="scope">{{scope.row.ElectricityNumber}}</template>
          </el-table-column>
          <el-table-column prop="WaterMeter" align="center" label="单价(元)" min-width="120">
            <template slot-scope="scope">{{scope.row.ElectricityPrice}}</template>
          </el-table-column>
        </el-table-column>

        <el-table-column prop="GasMeter" align="center" label="燃气表" min-width="150">
          <el-table-column prop="WaterMeter" align="center" label="读数(立方米)" min-width="120">
            <template slot-scope="scope">{{scope.row.GasMeter}}</template>
          </el-table-column>
          <el-table-column prop="WaterMeter" align="center" label="用量(立方米)" min-width="120">
            <template slot-scope="scope">{{scope.row.GasNumber}}</template>
          </el-table-column>
          <el-table-column prop="WaterMeter" align="center" label="单价(元)" min-width="120">
            <template slot-scope="scope">{{scope.row.GasPrice}}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="ColdwaterMeter" align="center" label="冷水表" min-width="150">
          <el-table-column prop="WaterMeter" align="center" label="读数(吨)" min-width="120">
            <template slot-scope="scope">{{scope.row.ColdwaterMeter}}</template>
          </el-table-column>
          <el-table-column prop="WaterMeter" align="center" label="用量(吨)" min-width="120">
            <template slot-scope="scope">{{scope.row.ColdWaterNumber}}</template>
          </el-table-column>
          <el-table-column prop="WaterMeter" align="center" label="单价(元)" min-width="120">
            <template slot-scope="scope">{{scope.row.ColdWaterPrice}}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="HotwaterMeter" align="center" label="热水表" min-width="150">
          <el-table-column prop="WaterMeter" align="center" label="读数(吨)" min-width="120">
            <template slot-scope="scope">{{scope.row.HotwaterMeter}}</template>
          </el-table-column>
          <el-table-column prop="WaterMeter" align="center" label="用量(吨)" min-width="120">
            <template slot-scope="scope">{{scope.row.HotWaterNumber}}</template>
          </el-table-column>
          <el-table-column prop="WaterMeter" align="center" label="单价(元)" min-width="120">
            <template slot-scope="scope">{{scope.row.HotWaterPrice}}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="date" align="center" label="抄表时间" min-width="150">
          <template slot-scope="scope">{{$dateFormat(scope.row.CreaterTime)}}</template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="GetTableListDatas"
      :beforeLoad="GetSearchData"
    ></bottom-tool-bar>
    <meter-reading-dialog
      :showDialogMeter="showDialogMeter"
      :areaList="areaList"
      :BuildingList="BuildingList"
      :BuildingUnitList="BuildingUnitList"
      :BuildingDoorNumberList="BuildingDoorNumberList"
      :formdata="form"
      @CloseMeterDialog="CloseMeterDialog"
      @UpdateMeterData="UpdateMeterData"
      ref="meterreadingdialog"
    ></meter-reading-dialog>
  </div>
</template>
<style lang='scss'>
  @import "../../../styles/mixin";
</style>
<script>
  import { Getareadatas, GetAllUnitDatas, GetAllTableDatas } from '@/api/service'
  import SearchPanel from '../../../components/SearchPanel'
  import BottomToolBar from '@/components/BottomToolBar' // 引入底部布局样式
  import MeterReadingDialog from './components/MeterReadingDialog' // 引入抄表的样式
  import TableButtons from '@/components/TableButtons'

  export default {
    name: 'WaterAndelectricityReading',
    components: {
      SearchPanel,
      BottomToolBar,
      MeterReadingDialog,
      TableButtons
    },
    data() {
      return {
        TableListWaterDatas: [], // 表格数据
        areaList: [],
        BuildingList: [], // 栋
        BuildingUnitList: [], // 单元
        BuildingDoorNumberList: [], // 门牌号
        pageSize: 10,
        loading: false,
        listLoading: false,
        showDialogMeter: false,
        showsettledialog: false,
        showRemarkBooKingDialog: false,
        form: {
          CommunityId: Number,
          HouseKey: Number, // 房源标识
          CommunityName: '', // 小区名称
          Building: '',
          UnitNumber: '',
          RoomNumber: ''
        }
      }
    },
    created() {
      // this.GetBulingListDatas() // 小区发生改变，获取栋数
      // this.GetUnitListDatas() // 栋数发生改变，获取单元号
      // this.GetDoorNumberListDatas() // 当单元号发生改变时，获取门牌号
      // this.GetAllBuildings()
      // this.GetAllBuildings() // 获取小区后面的数据
    },
    methods: {
      GetSearchData() {
        return this.GetareaListDatas().then(() => {
          return this.GetAllBuildings()
        })
      },
      // 模糊查询掉接口
      GetDropList(val) {
        console.log(val)
         // this.form.CommunityName = val
        if (val !== '') {
             Getareadatas({
            parm: { size: 15, page: 1 },
            keyword: val
          }).then(({ Data }) => {
            console.log(Data)
               this.areaList = Data.rows || []
               // if (!this.areaList[0].KeyID) {
               //   return false
               // }
               // this.form.CommunityId = this.areaList[0].KeyID
             })
        } else {
          return this.areaList
        }
      },
      // 切换小区的时候请求接口,获取下面的数据
      GetAfterdata(index, indexKeyID) {
        this.form.Building = ''
        this.form.UnitNumber = ''
        this.form.RoomNumber = ''
        this.form.CommunityId = indexKeyID
        return GetAllUnitDatas({
          communityID: this.areaList[index].KeyID,
          type: 1 // 查询抄表历史列表
        }).then(response => {
          if (response) {
            this.BuildingList = response.Data // 栋数数据
          }
        })
      },
      GetareaListDatas() {
        // 后端返回的数据请求接口 第一次请求查询列表数据，并默认传第一条数据查询
        return Getareadatas({
          parm: { size: 15, page: 1 },
          keyword: this.form.CommunityName
        }).then(reponse => {
          if (reponse) {
            this.areaList = reponse.Data.rows
            // console.log(this.areaList[0].KeyID)
            if (this.areaList.length > 0) {
               this.form.CommunityId = this.areaList[0].KeyID // 默认后台绑定数据第一个小区
               this.form.CommunityName = this.areaList[0].CommunityName
            } else {
              this.BuildingList = [] // 栋
              this.BuildingUnitList = [] // 单元
              this.BuildingDoorNumberList = [] // 门牌号
              this.form.Building = ''
              this.form.UnitNumber = ''
              this.form.RoomNumber = ''
            }
            // this.form.HouseKey =
          }
        })
      },
      // 获取后面 栋 单元 门牌号的数据
      GetAllBuildings() {
        return GetAllUnitDatas({
          communityID: this.areaList[0].KeyID,
          type: 1
        }).then(response => {
          if (response) {
            this.BuildingList = response.Data // 栋数数据
            this.form.Building = response.Data[0].BuildingName
            this.form.UnitNumber = response.Data[0].UnitNumber[0].UnitNumberName
            this.form.RoomNumber = response.Data[0].UnitNumber[0].RoomNumber[0].RoomNumberName
            this.form.HouseKey = response.Data[0].UnitNumber[0].RoomNumber[0].HouseKey
          }
        })
      },
      // 获取列表数据
      GetTableListDatas(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        return GetAllTableDatas({
          query: {
            parm: pages,
            CommunityId: this.form.CommunityId,
            Building: this.form.Building,
            UnitNumber: this.form.UnitNumber,
            RoomNumber: this.form.RoomNumber
          }
        }).then((response) => {
          if (response) {
            this.TableListWaterDatas = response.Data.rows
          } else {
            this.TableListWaterDatas = []
          }
          this.listLoading = false
          return response.Data
        })
      },
      // 改变栋数获取单元号
      GetBulingList(index) {
        var tempBuild = []
        this.form.UnitNumber = '' // 单元号
        this.form.RoomNumber = '' // 门牌号
        tempBuild = this.BuildingList[index] //  获取栋数的第一条数据
        this.BuildingUnitList = tempBuild.UnitNumber
      },
      // 改变单元号获取门牌号
      GetUnitList(index) {
        var tempDoorNumber = []
        this.form.RoomNumber = '' // 门牌号
        tempDoorNumber = this.BuildingUnitList[index] // 获取单元号的第一条数据
        this.BuildingDoorNumberList = tempDoorNumber.RoomNumber
        // debugger
      //  this.form.HouseKey = tempDoorNumber.RoomNumber[index].HouseKey
      },
      // 门牌号的值一旦发生变化,或者有值的情况下请求查询接口
      GetSearchTableList(index) {
        this.form.HouseKey = this.BuildingDoorNumberList[index].HouseKey
        this.$refs.bottomToolBar.search()
      },
      // 子组件传值给父组件
      UpdateMeterData(data) {
        console.log(data)
        const index = this.TableListWaterDatas.findIndex(item => {
          return item.KeyID === data.KeyID
        })
        // debugger
        if (index === -1) {
          this.TableListWaterDatas.unshift(data)
          this.$refs.bottomToolBar.search()
        }
      },
      // 子组件的打开时候的回调函数
      // 点击抄表按钮
      handleMeters() {
        this.$refs['meterreadingdialog'].open({
          communityID: this.areaList[0].keyID
        })
      },
      // 水电气配置单价按钮
      handleconfigurePrice() {
        this.$router.push({
          path: '/Service/MeterReadingConfiguration'
        })
      },
      CloseMeterDialog() {
        this.showDialogMeter = false
      }
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    }
  }
</script>

<style scoped>
</style>
