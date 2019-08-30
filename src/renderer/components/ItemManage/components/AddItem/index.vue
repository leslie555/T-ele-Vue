<template>
  <div class="add-item">
    <el-dialog
      width="1200px"
      title="新增物品"
      :visible.sync="innerVisible"
      append-to-body>
      <div class="data-list-table add-item-content" @click="hideRegionBox()">
        <div class="left-div">
          <p class="left-div-title">请选择物品</p>
          <el-table :data=filterDepotItemList
                    ref="multipleTable"
                    @selection-change="depotTableSelect"
                    v-loading.body="listLoading"
                    element-loading-text="加载中"
                    border
                    fit
                    height="300"
                    class="table-normal hasCheckbox left-table">
            <el-table-column
              align="center"
              type="selection"
              fixed="left"
              width="35">
            </el-table-column>
            <el-table-column align="center" label='名称' width="90" prop="EquipmentName">
            </el-table-column>
            <el-table-column align="center" label='所属方' width="50" prop="Intermediary">
            </el-table-column>
            <el-table-column align="center" label='类型' width="50" prop="EquipmentTypeName">
            </el-table-column>
            <el-table-column align="center" label='数量' width="50" prop="ResidueNumber">
            </el-table-column>
            <el-table-column align="center" label='单价(元)' width="60" prop="SingleDirectCost">
            </el-table-column>
            <el-table-column align="center" label='备注' width="50" prop="BZ">
            </el-table-column>
            <el-table-column align="center" label="操作" width="140">
              <template slot-scope="scope">
                <table-buttons
                  :options="operation2button"
                  :condition="scope.row.Operation"
                  :showAll="true"
                  @handleViewPicClick="handleViewPic(scope.row)"
                ></table-buttons>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="transfer-btn">
          <div class="add-btn-div">
            <el-button class="add-btn" size="small" @click="addItemToRoom">添加<i
              class="el-icon-arrow-right el-icon--right"></i></el-button>
          </div>
          <div class="remove-btn-div">
            <el-button class="remove-btn" size="small" icon="el-icon-arrow-left"
                       @click="removeItemFromRoom">移除
            </el-button>
          </div>
        </div>
        <div class="right-div">
          <p class="right-div-title">已选择</p>
          <el-table :data="chosenList"
                    ref="multipleChosenTable"
                    @selection-change="chosenTableSelect"
                    border
                    height="300"
                    class="table-normal hasCheckbox right-table item-list">
            <el-table-column
              align="center"
              type="selection"
              fixed="left"
              width="35">
            </el-table-column>
            <el-table-column align="center" label='名称' width="90" prop="EquipmentName">
            </el-table-column>
            <el-table-column align="center" label='数量' width="80" prop="Number">
              <template slot-scope="scope">
                <el-input type="number" v-model="chosenList[scope.$index].Number"
                          @blur="$positive(chosenList[scope.$index],'Number',1,true,scope.row.ResidueNumber)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label='单价(元)' width="60" prop="SingleDirectCost">
            </el-table-column>
            <el-table-column class="region-column" align="center" label='所属区域' width="80" prop="RoomName">
              <template slot-scope="scope">
                <div>{{scope.row.RoomName}}</div>
                <div class="more-region" @click.stop="showRegionBox(scope.row,scope.$index)"></div>
                <ul v-show="scope.row.IsChoseRegion">
                  <li v-for="region in regionData"
                      @click="changeRegion(scope.row,scope.$index,region)">
                    {{region.Region}}
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column align="center" label='备注' width="120" prop="Remark">
              <template slot-scope="scope">
                <el-input v-model="scope.row.Remark"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="图片" width="120">
              <template slot-scope="scope">
                <table-buttons
                  :options="operation2button"
                  :condition="scope.row.Operation"
                  :showAll="true"
                  @handleViewPicClick="handleViewPic(scope.row)"
                ></table-buttons>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="onSubmit">确认</el-button>
        <el-button type="primary" @click="cancleSubmit">取消</el-button>
      </div>
    </el-dialog>
    <div>
      <ViewPictureGallery ref="picturesBox"></ViewPictureGallery>
    </div>
  </div>
</template>

<script>
  import { TableButtons, ViewPictureGallery } from '../../../../components/'
  import { equipmentListAgent, MoveOut } from '../../../../api/house'

  export default {
    name: 'index',
    components: {
      TableButtons,
      ViewPictureGallery
    },

    data() {
      return {
        innerVisible: false,
        listLoading: false,
        loading: false,
        IsCompletePage: false,
        regionData: [],
        itemData: [],
        agencyData: [],
        depotTableSelected: [],
        chosenTableSelected: [],
        depotItemList: [],
        filterDepotItemList: [],
        chosenList: [],
        HouseKey: '',
        // imgData: '',
        operation2button: [
          {
            key: 'ViewPic',
            value: '查看大图',
            type: 'primary'
          }]
      }
    },

    methods: {
      open(IsCompletePage, regionData, HouseKey, agencyData) {
        this.loading = false
        this.IsCompletePage = IsCompletePage
        this.regionData = this.$deepCopy(regionData)
        this.agencyData = this.$deepCopy(agencyData)
        this.getDepotFurniture()
        this.HouseKey = HouseKey
        this.innerVisible = true
      },

      close() {
        this.innerVisible = false
      },

      // 获取中介配置信息
      getDepotFurniture() {
        this.listLoading = true
        equipmentListAgent().then(response => {
          this.depotItemList = response.Data
          // debugger
          this.filterTableData()
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },

      filterTableData() {
        this.filterDepotItemList = []
        this.depotItemList.map(item => {
          this.filterDepotItemList.push(this.filterTableDataItem(item))
        })
        // 完善房源页中介设备需要过滤上页已选择数据
        if (this.IsCompletePage) {
          this.contactArr(this.agencyData)
          this.filterConfigData()
        }
      },

      filterTableDataItem(item) {
        return {
          KeyID: item.KeyID,
          EquipmentName: item.EquipmentName,
          ResidueNumber: item.ResidueNumber,
          EquipmentType: item.EquipmentType,
          EquipmentTypeName: this.$EnumData.getEnumDesByValue('EquipmentType', item.EquipmentType),
          Intermediary: '中介', // 暂定为只有中介
          SingleDirectCost: item.SingleDirectCost,
          BZ: item.BZ,
          EquipmentImg: item.EquipmentImg,
          EquImgList: item.EquImgList,
          Operation: ['ViewPic']
        }
      },

      // 统计已配置中介设备列表数量，用以更改当前中介设备表的数量
      contactArr(Data) {
        const list = [...Data]
        const result = []
        list.map(v => {
          const item = result.find(v1 => v1.Equipment === v.Equipment)
          if (item) {
            item.Number += v.Number
          } else {
            result.push(v)
          }
        })
        // debugger
        this.agencyData = result
      },

      // 过滤掉已配置的中介数据
      filterConfigData() {
        const result = []
        this.filterDepotItemList.map(v => {
          const item = this.agencyData.find(v1 => v1.Equipment === v.KeyID)
          if (item) {
            // debugger
            v.ResidueNumber -= item.Number
            if (v.ResidueNumber > 0) {
              result.push(v)
              // debugger
            }
          } else {
            result.push(v)
          }
        })
        debugger
        this.filterDepotItemList = result
      },

      handleViewPic(row) {
        debugger
        this.$refs.picturesBox.open(row.EquImgList)
      },

      showRegionBox(row, index) {
        this.chosenList.map((item, i) => {
          if (i !== index) {
            item.IsChoseRegion = false
          }
        })
        this.chosenList[index].IsChoseRegion = !this.chosenList[index].IsChoseRegion
      },

      changeRegion(row, index, region) {
        this.chosenList[index].RoomName = region.Region
        if (!this.IsCompletePage) {
          this.chosenList[index].HouseID = region.KeyID
        }
      },

      hideRegionBox() {
        this.chosenList.map((item) => {
          item.IsChoseRegion = false
        })
      },

      depotTableSelect(val) {
        this.depotTableSelected = val
      },

      chosenTableSelect(val) {
        this.chosenTableSelected = val
      },

      // 点击添加按钮后，将仓库数据复制到右边
      addItemToRoom() {
        if (!this.IsCompletePage) {
          this.chosenList = this.depotTableSelected.map(item => {
            return {
              KeyID: item.KeyID,
              EquipmentName: item.EquipmentName,
              ResidueNumber: item.ResidueNumber,
              EquipmentType: item.EquipmentType,
              Intermediary: item.Intermediary,
              SingleDirectCost: item.SingleDirectCost,
              EquipmentImg: item.EquipmentImg,
              EquImgList: item.EquImgList,
              Remark: '', // 备注
              Number: 1, // 选择的数量
              RoomName: '公共', // 区域默认为公共
              HouseID: this.regionData[0].KeyID, // 需保证regionData第一条数据为公共区域
              Operation: ['ViewPic'],
              IsChoseRegion: false
            }
          })
        } else {
          debugger
          this.chosenList = this.depotTableSelected.map(item => {
            return {
              KeyID: item.KeyID,
              HouseKey: this.HouseKey,
              EquipmentName: item.EquipmentName,
              ResidueNumber: item.ResidueNumber,
              EquipmentType: item.EquipmentType,
              Intermediary: item.Intermediary,
              SingleDirectCost: item.SingleDirectCost,
              EquipmentImg: item.EquipmentImg,
              EquImgList: item.EquImgList,
              Remark: '', // 备注
              Number: 1, // 选择的数量
              RoomName: '公共', // 区域默认为公共
              Operation: ['ViewPic'],
              IsChoseRegion: false
            }
          })
        }
        this.$refs['multipleChosenTable'].toggleAllSelection()
      },

      removeItemFromRoom() {
        this.chosenList = this.chosenList.filter(item =>
          !this.chosenTableSelected.includes(item))
      },

      onSubmit() {
        // 验证家具数量和备注
        if (this.chosenTableSelected.length > 0) {
          this.loading = true
          if (!this.IsCompletePage) {
            const postData = this.chosenTableSelected.map(item => {
              return {
                HouseKey: this.HouseKey, // 房源Key
                HouseID: item.HouseID,
                Equipment: item.KeyID, // 设备ID
                EquipmentName: item.EquipmentName,
                Number: item.Number,
                SingleDirectCost: item.SingleDirectCost,
                Landlordmediation: 1, // 1表示中介
                Region: item.RoomName,
                BZ: item.Remark,
                Status: 1 // 1表示新增
              }
            })
            MoveOut(postData).then(response => {
              // 新增成功后更新上一页数据
              this.$emit('updateItemInfo', response.Data)
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.chosenList = []
              this.close()
            }).catch(() => {
              this.loading = false
            })
          } else {
            const addData = this.chosenTableSelected.map(item => {
              return {
                KeyID: item.KeyID,
                HouseKey: this.HouseKey,
                EquipmentName: item.EquipmentName,
                Number: item.Number,
                SingleDirectCost: item.SingleDirectCost,
                RoomName: item.RoomName,
                EquipmentImg: item.EquipmentImg,
                // EquImgList: item.EquImgList,
                ImageLocation: item.EquImgList,
                BZ: item.Remark
              }
            })
            this.chosenList = []
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.$emit('updateItemInfo', addData)
            this.close()
          }
        } else {
          this.$message.error('请选择物品!')
        }
      },

      cancleSubmit() {
        this.close()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
<style lang="scss">
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow: auto;
  }
</style>
