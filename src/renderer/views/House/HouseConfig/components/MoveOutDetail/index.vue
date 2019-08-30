<template>
  <div class="move-out-detail">
    <el-dialog title="搬出" :center="true" width="671px" :visible.sync="dialogFormVisible" lock-scroll append-to-body>
      <div @click="hideRegionBox()">
        <el-form :rules="rules" ref="form" :model="form">
          <el-form-item label="房源名称" prop="HouseName">
            <search-house v-model="form.HouseName" @select="fillRegion"></search-house>
          </el-form-item>
          <el-table :data="form.filterList"
                    ref="multipleTable"
                    element-loading-text="加载中"
                    border
                    height="400"
                    class="table-normal content-table item-list">
            <el-table-column align="center" label='物品名称' width="110" prop="EquipmentName">
            </el-table-column>
            <el-table-column align="center" label='物品数量' width="80" prop="ResidueNumber">
              <template slot-scope="scope">
                <el-form-item :prop="'filterList.' + scope.$index + '.Number'">
                  <el-input type="number" v-model="form.filterList[scope.$index].Number"
                            @blur="$positive(form.filterList[scope.$index],'Number',1,true,scope.row.ResidueNumber)"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label='单价' width="70" prop="SingleDirectCost">
            </el-table-column>
            <el-table-column class="region-column" align="center" label='所属区域' width="100"
                             prop="RoomName">
              <template slot-scope="scope">
                <div>{{scope.row.RoomName}}</div>
                <div v-if="form.HouseName!==''" class="more-region"
                     @click.stop="showRegionBox(scope.row)"></div>
                <ul v-show="scope.row.IsChoseRegion">
                  <li v-for="item in Regions" @click="changeRegion(scope.row,item)">{{item.Region}}</li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column align="center" label='备注' width="140" prop="BZ">
              <template slot-scope="scope">
                <el-form-item :prop="'filterList.' + scope.$index + '.BZ'" :rules='rules.BZ'>
                  <el-input v-model="form.filterList[scope.$index].BZ"></el-input>
                </el-form-item>
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
        </el-form>
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
  import { SearchHouse, TableButtons, ViewPictureGallery } from '../../../../../components/'
  import { MoveOut } from '../../../../../api/house'

  export default {
    name: 'MoveOutDetail',

    components: {
      SearchHouse,
      TableButtons,
      ViewPictureGallery
    },

    data() {
      return {
        form: {
          HouseName: '',
          filterList: [{
            Number: '',
            BZ: ''
          }]
        },
        rules: {
          BZ: [
            { min: 0, max: 20, message: '备注在0到20个字符', trigger: 'change' }
          ]
        },
        list: [],
        Regions: [],
        HouseKey: '',
        loading: false,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        operation2button: [
          {
            key: 'ViewPic',
            value: '查看大图',
            type: 'primary'
          }
        ]
      }
    },

    methods: {
      fillRegion(houseInfo) {
        this.HouseKey = houseInfo.HouseKey
        this.Regions = houseInfo.HouseRegion
      },

      open(moveOutList) {
        this.loading = false
        this.list = this.$deepCopy(moveOutList)
        this.form.HouseName = ''
        this.fetchData()
        this.dialogFormVisible = true
      },

      fetchData() {
        this.form.filterList = []
        this.list.map(item => {
          this.form.filterList.push(this.fetchDataItem(item))
        })
      },

      fetchDataItem(item) {
        return {
          KeyID: item.KeyID,
          EquipmentName: item.EquipmentName,
          ResidueNumber: item.ResidueNumber,
          SingleDirectCost: item.SingleDirectCost,
          EquipmentImg: item.EquipmentImg,
          EquImgList: item.EquImgList,
          BZ: item.BZ,
          Number: 1, // 当前选择的数量
          RoomName: '公共', // 页面加载时展示默认区域
          Operation: ['ViewPic'], // 查看大图
          IsChoseRegion: false // 是否展示区域
        }
      },

      close() {
        this.$refs.form.resetFields()
        this.dialogFormVisible = false
      },

      showRegionBox(row) {
        if (this.form.HouseName !== '') {
          this.form.filterList.map((item) => {
            if (item.KeyID !== row.KeyID) {
              item.IsChoseRegion = false
            }
          })
          const index = this.form.filterList.findIndex(item => {
            return item.KeyID === row.KeyID
          })
          this.form.filterList[index].IsChoseRegion = !this.form.filterList[index].IsChoseRegion
        }
      },

      changeRegion(row, region) {
        const index = this.form.filterList.findIndex(item => {
          return item.KeyID === row.KeyID
        })
        this.form.filterList[index].RoomName = region.Region
        this.form.filterList[index].HouseID = region.KeyID
      },

      hideRegionBox() {
        this.form.filterList.map((item) => {
          item.IsChoseRegion = false
        })
      },

      onSubmit() {
        if (this.form.HouseName !== '') {
          this.loading = true
          const postData = this.form.filterList.map(item => {
            return {
              HouseKey: this.HouseKey,
              HouseID: item.HouseID || 0,
              Equipment: item.KeyID, // 设备ID
              EquipmentName: item.EquipmentName,
              EquipmentImg: item.EquipmentImg,
              Number: item.Number,
              SingleDirectCost: item.SingleDirectCost,
              Landlordmediation: 1, // 1表示中介
              Region: item.RoomName,
              BZ: item.BZ,
              Status: 1 // 1表示新增
            }
          })

          MoveOut(postData).then(() => {
            this.$emit('moveOutCallback', postData)
            this.loading = false
            this.$message({
              message: '搬出成功！',
              type: 'success'
            })
            this.$refs.form.resetFields()
            this.close()
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.$message.error('请先选择房源！')
        }
      },

      cancleSubmit() {
        this.close()
      },

      handleViewPic(row) {
        this.$refs.picturesBox.open(row.EquImgList)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
<style lang="scss">
  .el-table__body-wrapper {
    overflow: auto;
  }
</style>
