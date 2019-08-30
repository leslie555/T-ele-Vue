<template>
  <div class="item-manage">
    <el-dialog width="700px" :center="true" :visible.sync="itemManageVisible" lock-scroll
               append-to-body>
      <div @click="hideRegionBox()">
        <el-tabs class="tabs-normal" v-model="activeName">
          <el-tab-pane label="物品列表（房东）" name="0">
            <div>
              <el-table :data="landlordFilterList"
                        ref="multipleTable"
                        @selection-change="landlordTableSelect"
                        border
                        height="330"
                        class="table-normal hasCheckbox">
                <el-table-column
                  align="center"
                  type="selection"
                  fixed="left"
                  width="55">
                </el-table-column>
                <el-table-column align="center" label='物品名称' width="300" prop="EquipmentName">
                </el-table-column>
                <el-table-column align="center" label='物品数量' width="293" prop="Number">
                </el-table-column>
              </el-table>
              <div slot="footer" class="dialog-footer inner-btn">
                <el-button type="primary" @click="viewHistoryLog(2)">历史记录</el-button>
                <el-button type="primary" :loading="moveAwayLoading" @click="moveAway">搬离</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="物品列表（中介）" name="1">
            <div>
              <el-table :data="agencyFilterList"
                        ref="multipleTable"
                        @selection-change="agencyTableSelect"
                        border
                        height="330"
                        class="table-normal hasCheckbox item-list">
                <el-table-column
                  align="center"
                  type="selection"
                  fixed="left"
                  width="55"
                  :isChecked="false">
                </el-table-column>
                <el-table-column align="center" label='物品名称' width="110" prop="EquipmentName">
                </el-table-column>
                <el-table-column align="center" label='物品数量' width="80" prop="Number">
                </el-table-column>
                <el-table-column align="center" label='单价/元' width="80" prop="SingleDirectCost">
                </el-table-column>
                <el-table-column class="region-column" align="center" label='所属区域' width="100"
                                 prop="RoomName">
                  <template slot-scope="scope">
                    <div>{{scope.row.RoomName}}</div>
                    <div class="more-region"
                         @click.stop="showRegionBox(scope.row,scope.$index)"></div>
                    <ul v-if="scope.row.IsChoseRegion">
                      <li v-for="(region,index) in regionData" :key="index"
                          @click="changeRegion(scope.row,scope.$index,region)">
                        {{region.Region}}
                      </li>
                    </ul>
                  </template>
                </el-table-column>
                <el-table-column align="center" label='备注' width="83" prop="BZ">
                </el-table-column>
                <el-table-column align="center" label="图片" width="140" prop="ShowImage">
                  <template slot-scope="scope">
                    <img v-if="scope.row.ShowImage"
                         class="equiment-img"
                         :src="$ImgUnit.getThumbImgUrl(scope.row.ShowImage)">
                  </template>
                </el-table-column>
              </el-table>
              <div slot="footer" class="dialog-footer inner-btn">
                <el-button type="primary" @click="viewHistoryLog(1)">历史记录</el-button>
                <el-button type="primary" :loading="moveAwayLoading" @click="moveAway">搬离</el-button>
                <el-button type="primary" @click="addFurniture">新增</el-button>
                <el-button v-if="!IsCompletePage" :loading="saveRegionLoading" type="primary" @click="saveRegionInfo">
                  保存
                </el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="水电气卡管理" name="2">
            <el-scrollbar class="vertical-scroll">
            <div class="card-form">
              <el-form :model="form">
                <div class="dialog-container form-item-sm mt-10 mb-40">
                  <el-form-item label="水卡号" :label-width="formLabelWidth" prop="WaterCardNumber">
                    <el-input v-model="form.WaterCardNumber"></el-input>
                  </el-form-item>
                  <el-form-item label="电卡号" :label-width="formLabelWidth"
                                prop="ElectricityCardNumber">
                    <el-input v-model="form.ElectricityCardNumber"></el-input>
                  </el-form-item>
                  <el-form-item label="气卡号" :label-width="formLabelWidth" prop="GasCardNumber">
                    <el-input v-model="form.GasCardNumber"></el-input>
                  </el-form-item>
                  <el-form-item label="门卡" :label-width="formLabelWidth" prop="DoorCardNumber">
                    <el-input v-model="form.DoorCardNumber"></el-input>
                  </el-form-item>
                  <div class="clearfix form-item-md">
                    <el-form-item label="备注" :label-width="formLabelWidth" prop="BZ">
                      <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"
                                placeholder="请输入备注" v-model="form.BZ">
                      </el-input>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
              <div v-if="!IsCompletePage" slot="footer" class="dialog-footer inner-btn mb-15">
                <el-button :loading="saveCardLoading" type="primary" @click="saveCardInfo">保存</el-button>
              </div>
              <div class="mt-40" v-else></div>
            </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="IsCompletePage" slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="warning" @click="dataToCompleteHouse">保存配置信息</el-button>
      </div>
    </el-dialog>
    <div>
      <history-log ref="historyLog"></history-log>
    </div>
    <div>
      <AddItem ref="addItem" @updateItemInfo="updateItemInfo"></AddItem>
    </div>
  </div>
</template>
<script>
  import AddItem from './components/AddItem'
  import HistoryLog from './components/HistoryLog'
  import { MoveIn, goodsManagementList, HouseUtilitiesUpd, updEquipment } from '../../api/house'

  export default {
    name: 'ItemManage',
    components: {
      AddItem,
      HistoryLog
    },

    data() {
      return {
        completeHouseData: { // 完善房源传入
          HouseKey: '',
          HouseConfigInfo: [],
          HouseUtiliti: {}
        },
        HouseKey: '', // 完善房源传入
        HouseInfo: {}, // 房间管理页面传入
        ConfigData: {}, // 传回到完善房源的数据
        IsCompletePage: true,
        contractInfo: '',
        tableData: [],
        itemManageVisible: false,
        loading: false,
        saveCardLoading: false,
        saveRegionLoading: false,
        moveAwayLoading: false,
        landlordList: [],
        agencyList: [],
        landlordFilterList: [],
        agencyFilterList: [],
        agencyTableSelected: [],
        landlordTableSelected: [],
        activeName: '0',
        regionData: [],
        form: {
          WaterCardNumber: '',
          ElectricityCardNumber: '',
          GasCardNumber: '',
          DoorCardNumber: '',
          BZ: ''
        },
        formLabelWidth: '100px'
      }
    },

    methods: {
      open(sourceData) {
        // 判断是否为完善房源页面
        this.IsCompletePage = sourceData.ContractID === undefined
        this.itemManageVisible = true
        if (this.IsCompletePage) {
          this.completeHouseData = sourceData
          this.HouseKey = this.completeHouseData.HouseKey
          this.handleData()
        } else {
          this.HouseInfo = sourceData
          this.HouseKey = this.HouseInfo.HouseKey
          this.fetchData()
        }
      },

      close() {
        this.itemManageVisible = false
      },

      // 处理完善房源页面过来的数据
      handleData() {
        const configList = this.completeHouseData.HouseConfigInfo
        if (configList !== undefined && configList.length > 0) {
          try {
            const landlordList = []
            // 第一条数据为公共区域数据
            // 根据Landlordmediation取出公共区域的房东数据
            const commonConfig = this.$deepCopy(configList[0].Equ)
            landlordList.push(...(commonConfig.filter(item => {
              return item.Landlordmediation === 2
            })))
            this.filterCompleteLandlordList(landlordList)
            // 取出中介的公共区域数据
            const agencyList = []
            agencyList.push(...(commonConfig.filter(item => {
              return item.Landlordmediation !== 2
            })))
            agencyList.map(item => {
              item.RoomName = '公共'
            })
            // 获取房间数据
            this.regionData = configList.map(item => {
              return {
                Region: item.RoomName
              }
            })
            // 获取其他中介物品数据
            configList.splice(0, 1)
            configList.forEach(item => {
              item.Equ.forEach(item2 => {
                const ImageLocation = item2.ImageLocation || []
                const ShowImage = ImageLocation && ImageLocation.length > 0 ? ImageLocation[0].ImageLocation : null
                agencyList.push({
                  HouseKey: item2.HouseKey,
                  HouseName: '',
                  Equipment: item2.Equipment,
                  Number: item2.Number,
                  ResidueNumber: 0,
                  Landlordmediation: 1,
                  EquipmentName: item2.EquipmentName,
                  BZ: item2.BZ,
                  SingleDirectCost: item2.SingleDirectCost,
                  EquipmentImg: item2.EquipmentImg,
                  ImageLocation,
                  RoomName: item.RoomName, // 获取房间名
                  ShowImage, // 暂时只取第一张图片展示出来
                  IsChoseRegion: false
                })
              })
            })
            this.filterCompleteAgencyList(agencyList)
          } catch (err) {
            this.$message.error(err)
          }
        }
      },

      // 完善房源传进数据处理
      filterCompleteLandlordList(list) {
        this.landlordFilterList = []
        list.map(item => {
          this.landlordFilterList.push(this.filterCompleteLandlordListItem(item))
        })
      },

      filterCompleteLandlordListItem(item) {
        return {
          HouseKey: item.HouseKey,
          HouseName: '',
          Equipment: item.Equipment,
          Number: item.Number,
          ResidueNumber: 0,
          Landlordmediation: 2,
          EquipmentName: item.EquipmentName,
          BZ: '',
          SingleDirectCost: 0,
          EquipmentImg: '',
          ImageLocation: []
        }
      },

      filterCompleteAgencyListItem(item) {
        const ImageLocation = item.ImageLocation || []
        const ShowImage = ImageLocation.length > 0 ? ImageLocation[0].ImageLocation : null
        return {
          HouseKey: item.HouseKey,
          HouseName: '',
          Equipment: item.Equipment,
          Number: item.Number,
          ResidueNumber: 0,
          Landlordmediation: 1,
          EquipmentName: item.EquipmentName,
          BZ: item.BZ,
          SingleDirectCost: item.SingleDirectCost,
          EquipmentImg: item.EquipmentImg,
          ImageLocation,
          RoomName: item.RoomName,
          ShowImage, // 暂时只取第一张图片展示出来
          IsChoseRegion: false
        }
      },

      filterCompleteAgencyList(list) {
        this.agencyFilterList = []
        list.map(item => {
          this.agencyFilterList.push(this.filterCompleteAgencyListItem(item))
        })
      },

      // 房态图页面调接口
      // 房态图页面传HouseInfo进来
      fetchData() {
        const postData = { 'HouseKey': this.HouseKey }
        goodsManagementList(postData).then(response => {
          // 水电气卡数据
          const item = response.Data.HouseUtiliti
          this.form = {
            KeyID: item.KeyID,
            HouseID: item.HouseID,
            ContractID: item.ContractID,
            WaterCardNumber: item.WaterCardNumber,
            GasCardNumber: item.GasCardNumber,
            ElectricityCardNumber: item.ElectricityCardNumber,
            DoorCardNumber: item.DoorCardNumber,
            BZ: item.BZ
          }
          // 房间信息
          this.regionData = response.Data.HouseRegion.map(item => {
            return {
              Region: item.Region,
              KeyID: item.KeyID
            }
          })
          this.landlordList = response.Data.HouseOwnerEquipments
          this.agencyList = response.Data.HouseEquipments
          this.filterAgencyTableData()
          this.filterLandlordTableData()
        })
      },

      filterAgencyTableData() {
        this.agencyFilterList = []
        this.agencyList.map(item => {
          this.agencyFilterList.push(this.filterAgencyTableDataItem(item))
        })
      },

      filterLandlordTableData() {
        this.landlordFilterList = []
        this.landlordList.map(item => {
          this.landlordFilterList.push(this.filterLandlordTableDataItem(item))
        })
      },

      filterLandlordTableDataItem(item) {
        return {
          KeyID: item.KeyID,
          HouseKey: item.HouseKey,
          HouseID: item.HouseID,
          Equipment: item.Equipment,
          EquipmentName: item.EquipmentName,
          Number: item.Number
        }
      },

      filterAgencyTableDataItem(item) {
        const ImageLocation = item.ImageLocation || []
        const ShowImage = ImageLocation.length > 0 ? ImageLocation[0].ImageLocation : null
        return {
          KeyID: item.KeyID,
          HouseKey: item.HouseKey,
          HouseID: item.HouseID,
          Equipment: item.Equipment,
          EquipmentName: item.EquipmentName,
          Number: item.Number,
          SingleDirectCost: item.SingleDirectCost,
          RoomName: item.RoomName,
          ImageLocation: item.ImageLocation,
          ShowImage, // 暂时只取第一张图片展示出来
          BZ: item.BZ,
          IsChoseRegion: false
        }
      },

      showRegionBox(row, index) {
        this.agencyFilterList.map((item, i) => {
          if (i !== index) {
            item.IsChoseRegion = false
          }
        })
        this.agencyFilterList[index].IsChoseRegion = !this.agencyFilterList[index].IsChoseRegion
      },

      changeRegion(row, index, region) {
        this.agencyFilterList[index].RoomName = region.Region
        if (!this.IsCompletePage) {
          this.agencyFilterList[index].HouseID = region.KeyID
        }
      },

      hideRegionBox() {
        this.agencyFilterList.map((item) => {
          item.IsChoseRegion = false
        })
      },

      agencyTableSelect(val) {
        this.agencyTableSelected = val
      },

      landlordTableSelect(val) {
        this.landlordTableSelected = val
      },

      // 查看历史记录
      viewHistoryLog(landlordmediation) {
        const logData = {}
        logData.HouseKey = this.HouseKey
        logData.Landlordmediation = landlordmediation
        this.$refs.historyLog.open(logData)
      },

      getMoveAwayIds() {
        const checkedIds = []
        if (this.activeName === '0') {
          this.landlordTableSelected.map(item => {
            checkedIds.push(item.KeyID)
          })
        } else {
          this.agencyTableSelected.map(item => {
            checkedIds.push(item.KeyID)
          })
        }
        return checkedIds
      },

      filterRemoveData(checkedIds) {
        if (this.activeName === '0') {
          this.landlordFilterList = this.landlordFilterList.filter(item => {
            return !checkedIds.includes(item.KeyID)
          })
        } else {
          this.agencyFilterList = this.agencyFilterList.filter(item => {
            return !checkedIds.includes(item.KeyID)
          })
        }
      },

      // 过滤选中的搬离设备
      getFilterCompleteRemoveList(filterList, selectedList) {
        for (const row of selectedList) {
          const index = filterList.findIndex(r => JSON.stringify(r) === JSON.stringify(row))
          if (index !== -1) {
            filterList.splice(index, 1, null)
          }
        }
        return filterList.filter(r => r !== null)
      },

      filterCompleteRemoveData() {
        if (this.activeName === '0') {
          this.landlordFilterList = this.getFilterCompleteRemoveList(this.landlordFilterList, this.landlordTableSelected)
        } else {
          this.agencyFilterList = this.getFilterCompleteRemoveList(this.agencyFilterList, this.agencyTableSelected)
        }
      },

      // 搬离
      moveAway() {
        if ((this.activeName === '0' && this.landlordTableSelected.length <= 0) || (this.activeName === '1' && this.agencyTableSelected.length <= 0)) {
          this.$message.error('请勾选欲搬离设备！')
        } else {
          this.$confirm('确认搬离该设备?', '提示').then(() => {
            if (!this.IsCompletePage) {
              // 调用搬离接口
              this.moveAwayLoading = true
              const checkedIds = this.getMoveAwayIds()
              MoveIn(checkedIds).then(() => {
                this.$message.success('搬离成功')
                this.filterRemoveData(checkedIds)
                this.moveAwayLoading = false
              }).catch(() => {
                this.moveAwayLoading = false
              })
            } else {
              this.filterCompleteRemoveData()
            }
          })
        }
      },

      // 保存区域信息（中介）
      saveRegionInfo() {
        // 调取接口
        this.saveRegionLoading = true
        const postData = []
        this.agencyFilterList.map(item => {
          const obj = {
            KeyID: item.KeyID,
            HouseID: item.HouseID
          }
          postData.push(obj)
        })
        updEquipment(postData).then(() => {
          this.$message.success('保存成功')
          this.saveRegionLoading = false
        }).catch(() => {
          this.saveRegionLoading = false
        })
      },

      // 新增物品（仅中介）
      addFurniture() {
        this.$refs.addItem.open(this.IsCompletePage, this.regionData, this.HouseKey, this.agencyFilterList)
      },

      // 新增物品后回调此函数，将数据绑定到物品管理页面（仅中介）
      updateItemInfo(data) {
        if (this.IsCompletePage) {
          const addList = data.map(item => {
            const ImageLocation = item.ImageLocation || []
            const ShowImage = ImageLocation && ImageLocation.length > 0 ? ImageLocation[0].ImageLocation : null
            return {
              HouseKey: item.HouseKey,
              HouseName: '',
              Equipment: item.KeyID,
              Number: item.Number,
              ResidueNumber: 0,
              Landlordmediation: 1,
              EquipmentName: item.EquipmentName,
              BZ: item.BZ,
              SingleDirectCost: item.SingleDirectCost,
              EquipmentImg: item.EquipmentImg,
              ImageLocation,
              RoomName: item.RoomName,
              ShowImage, // 暂时只取第一张图片展示出来
              IsChoseRegion: false
            }
          })
          // debugger
          this.agencyFilterList.push(...addList)
        } else {
          data.map(item => {
            this.agencyFilterList.push(this.filterAgencyTableDataItem(item))
          })
        }
      },

      // 保存水电卡信息,改变水电卡数据即可，数据传回完善房源页面处理
      saveCardInfo() {
        if (!this.IsCompletePage) {
          // 调用保存水电卡数据接口
          this.saveCardLoading = true
          const postData = { ...this.form, ...this.HouseInfo }
          debugger
          HouseUtilitiesUpd(postData).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.saveCardLoading = false
          }).catch(() => {
            this.saveCardLoading = false
          })
        }
      },

      // 完善房源传回数据处理
      compositeList(list) {
        list = list.map(item => {
          return {
            HouseKey: item.HouseKey,
            HouseName: item.HouseName,
            Equipment: item.Equipment,
            Number: item.Number,
            ResidueNumber: item.ResidueNumber,
            Landlordmediation: item.Landlordmediation,
            EquipmentName: item.EquipmentName,
            BZ: item.BZ,
            SingleDirectCost: item.SingleDirectCost,
            EquipmentImg: item.EquipmentImg,
            ImageLocation: item.ImageLocation
          }
        })
        return list
      },

      // 向完善房源页面传递数据
      dataToCompleteHouse() {
        this.loading = true
        try {
          const configData = []
          const region = this.regionData.map(item => {
            return item.Region
          })
          const ownerItemList = []
          let otherRegion = []

          const agencyList = this.$deepCopy(this.agencyFilterList)
          const landlordList = this.$deepCopy(this.landlordFilterList)

          // 首先处理公共区域的数据，将业主的物品信息纳入公共区域里，与中介物品信息合并
          const commonRegion = {}
          commonRegion.RoomName = '公共'
          commonRegion.HouseKey = this.completeHouseData.HouseKey
          const agencyArray = agencyList.filter(item => {
            return item.RoomName === '公共'
          })
          ownerItemList.push(...this.compositeList(landlordList), ...(this.compositeList(agencyArray)))
          commonRegion.Equ = ownerItemList

          configData.push(commonRegion)
          const agencyFilterArray = agencyList.filter(item => {
            return item.RoomName !== '公共'
          })

          // 处理非公共区域数据（中介其他房间数据）
          region.shift()
          otherRegion = region.map(item => {
            return {
              RoomName: item,
              HouseKey: this.completeHouseData.HouseKey,
              Equ: agencyFilterArray.filter(i => {
                return item === i.RoomName
              })
            }
          })
          otherRegion.map(item => {
            item.Equ = this.compositeList(item.Equ)
          })
          configData.push(...otherRegion)

          this.ConfigData.HouseConfigInfo = configData
          this.ConfigData.HouseUtiliti = this.form
          this.ConfigData.HouseKey = this.completeHouseData.HouseKey
          this.completeHouseData = null
          this.$emit('getGoodsList', this.ConfigData)
          this.loading = false
        } catch (e) {
          this.loading = false
        }
      }
    }
  }
</script>

<style lang="scss">
  .item-manage .el-button--warning {
    background-color: #fd9258;
    border-color: #fd9258;
  }
  .el-table__body-wrapper {
    overflow: auto;
  }
</style>
<style lang='scss' scoped>
  @import "style";
</style>

