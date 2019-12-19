<template>
  <div>
    <div class="app-container data-list">
      <search-panel :model="ruleForm" ref="ruleForm" label-width="80px">
        <template slot="search">
          <el-form-item label="关键字" prop="Keyword">
            <el-input v-model="ruleForm.Keyword" autocomplete="off"
                      placeholder="关键词" style="width: 320px"></el-input>
          </el-form-item>
        </template>
        <template slot="more">
          <div class="clearfix">
            <el-form-item label="类型" prop="EquType">
              <el-select v-model="ruleForm.EquType" placeholder="请选择">
                <el-option label="全部" value="0"></el-option>
                <el-option
                  v-for="item in EquType"
                  :key="item.Value"
                  :label="item.Description"
                  :value="item.Value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </template>
        <template slot="button">
          <el-button type="primary" @click="searchHouse">查询</el-button>
          <el-button type="primary" v-setbtn:Add @click="furnitureAdd">新增</el-button>
        </template>
      </search-panel>
      <div class="panel data-list-table">
        <el-table :data="filterList"
                  ref="multipleTable"
                  @selection-change="tableSelect"
                  v-loading.body="listLoading"
                  element-loading-text="加载中"
                  border
                  fit
                  height="100%"
                  class="table-normal">
          <el-table-column
            align="center"
            type="selection"
            fixed="left"
            :selectable="selectable"
            width="55">
          </el-table-column>
          <el-table-column align="center" label='名称' fixed="left" width="180" prop="EquipmentName">
          </el-table-column>
          <el-table-column align="center" label='所属方' min-width="100" prop="Intermediary">
          </el-table-column>
          <el-table-column align="center" label='类型' min-width="100" prop="EquipmentTypeName">
          </el-table-column>
          <el-table-column align="center" label='数量' min-width="80" prop="ResidueNumber">
          </el-table-column>
          <el-table-column align="center" label='单价' min-width="120" prop="SingleDirectCost">
          </el-table-column>
          <el-table-column align="center" label='备注' min-width="140" prop="BZ">
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="330">
            <template slot-scope="scope">
              <table-buttons
                :options="operation2button"
                :condition="scope.row.Operation"
                @handleViewPicClick="handleViewPic(scope.row)"
                @handleEditClick="handleUpdate(scope.row)"
                @handleMoveOutClick="handleMoveOut(scope.row)"
                @handleDeleteClick="handleDelete(scope.row)"
              ></table-buttons>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <bottom-tool-bar class="pager-div" ref="bottomToolBar" :checkedLength="tableSelected.length"
                       :page-size="pageSize" :handlePageChange="fetchData">
        <el-button
          type="primary"
          icon="delete"
          size="mini"
          :disabled="tableSelected.length === 0"
          @click="handleMoveOutAll">
          <span>批量搬出</span>
        </el-button>
        <el-button
          type="danger"
          icon="delete"
          size="mini"
          :disabled="tableSelected.length === 0"
          @click="handleDeleteAll">
          <span>批量删除</span>
        </el-button>
      </bottom-tool-bar>
    </div>
    <div>
      <ViewPictureGallery ref="picturesBox"></ViewPictureGallery>
    </div>
    <div>
      <EditHouseConfig ref="editBox" @editConfigInfo="editConfigInfo"></EditHouseConfig>
    </div>
    <div>
      <MoveOutDetail ref="moveOutBox" @moveOutCallback="moveOutCallback"></MoveOutDetail>
    </div>
  </div>
</template>

<script>
  import { SearchPanel, TableButtons, BottomToolBar, ViewPictureGallery } from '../../../components/'
  import { equipmentList, delEquipment } from '../../../api/house'
  import { EditHouseConfig, MoveOutDetail } from './components'

  export default {
    name: 'HouseConfig',
    components: {
      TableButtons,
      SearchPanel,
      BottomToolBar,
      EditHouseConfig,
      MoveOutDetail,
      ViewPictureGallery
    },

    data() {
      return {
        ruleForm: {
          Keyword: '',
          EquType: '0'
        },
        list: [],
        filterList: [],
        listLoading: false,
        tableSelected: [],
        pageSize: 10,
        operation2button: [
          {
            key: 'ViewPic',
            value: '查看大图',
            type: 'primary'
          },
          {
            key: 'Edit',
            value: '修改',
            type: 'primary'
          },
          {
            key: 'MoveOut',
            value: '搬出',
            type: 'primary'
          },
          {
            key: 'Delete',
            value: '删除',
            type: 'danger'
          }
        ]
      }
    },

    activated() {
      this.$refs.bottomToolBar.search(1)
    },

    computed: {
      EquType() {
        return this.$EnumData.getEnumListByKey('EquipmentType')
      }
    },

    methods: {
      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        return equipmentList({
          parm: pages,
          Keyword: this.ruleForm.Keyword,
          EquType: this.ruleForm.EquType
        }).then(response => {
          this.list = response.Data.rows
          this.filterTableData()
          this.listLoading = false
          return response.Data
        }).catch(() => {
          this.listLoading = false
        })
      },

      filterTableData() {
        this.filterList = []
        this.list.map(item => {
          this.filterList.push(this.filterTableDataItem(item))
        })
      },

      filterTableDataItem(item) {
        return {
          KeyID: item.KeyID,
          EquipmentName: item.EquipmentName,
          Intermediary: item.Intermediary,
          EquipmentType: item.EquipmentType,
          EquipmentNumber: item.EquipmentNumber,
          ResidueNumber: item.ResidueNumber,
          EquipmentImg: item.EquipmentImg,
          EquImgList: item.EquImgList,
          SingleDirectCost: item.SingleDirectCost,
          BZ: item.BZ,
          EquipmentTypeName: this.$EnumData.getEnumDesByValue('EquipmentType', item.EquipmentType),
          Operation: item.ResidueNumber > 0 ? ['ViewPic', 'Edit', 'MoveOut', 'Delete'] : ['ViewPic', 'Edit', 'Delete'],
          LeaseStatusNum: item.ResidueNumber > 0
        }
      },

      selectable(row) {
        if (row.LeaseStatusNum) {
          return true
        } else {
          return false
        }
      },

      searchHouse() {
        this.$refs.bottomToolBar.search()
      },

      furnitureAdd() {
        const editData = {
          EquipmentName: '',
          Intermediary: '中介',
          EquipmentType: 1,
          EquipmentNumber: '',
          EquipmentImg: '',
          EquImgList: [],
          SingleDirectCost: '',
          BZ: ''
        }
        this.$refs.editBox.open(editData)
      },

      tableSelect(val) {
        this.tableSelected = val
      },

      handleDeleteAll() {
        this.$confirm('此操作将批量删除房源配置, 是否继续?', '提示').then(() => {
          const checkedIds = []
          this.tableSelected.map(item => {
            checkedIds.push(item.KeyID)
          })
          const postData = { 'KeyID': checkedIds }
          delEquipment(postData).then(() => {
            this.filterList = this.filterList.filter(item =>
              !this.tableSelected.includes(item))
            this.$message.success('删除成功')
          }).catch(() => {
            // this.$message.error('删除失败')
          })
        })
      },

      handleMoveOutAll() {
        const moveOutList = this.tableSelected
        this.$refs.moveOutBox.open(moveOutList)
      },

      handleViewPic(row) {
        this.$refs.picturesBox.open(row.EquImgList)
      },

      handleUpdate(row) {
        const editData = {
          KeyID: row.KeyID,
          EquipmentName: row.EquipmentName,
          Intermediary: row.Intermediary,
          EquipmentType: row.EquipmentType,
          EquipmentNumber: row.EquipmentNumber,
          ResidueNumber: row.ResidueNumber,
          EquipmentImg: row.EquipmentImg,
          EquImgList: row.EquImgList,
          SingleDirectCost: row.SingleDirectCost,
          BZ: row.BZ
        }
        this.$refs.editBox.open(editData)
      },

      editConfigInfo(data) {
        data.EquipmentTypeName = this.$EnumData.getEnumDesByValue('EquipmentType', data.EquipmentType)
        // 查找该数据是否在当前列表下，有则修改，没有则新增
        const index = this.filterList.findIndex(item => {
          return item.KeyID === data.KeyID
        })
        if (index > -1) {
          // 修改剩余数量
          const disNum = data.EquipmentNumber - this.filterList[index].EquipmentNumber
          data.ResidueNumber = this.filterList[index].ResidueNumber + disNum
          data.Operation = data.ResidueNumber > 0 ? ['ViewPic', 'Edit', 'MoveOut', 'Delete'] : ['ViewPic', 'Edit', 'Delete']
          data.LeaseStatusNum = data.ResidueNumber > 0
          this.$set(this.filterList, index, { ...this.filterList[index], ...data })
        } else {
          data.Operation = ['ViewPic', 'Edit', 'MoveOut', 'Delete']
          data.LeaseStatusNum = true
          this.filterList.push(data)
        }
      },

      handleMoveOut(row) {
        const list = []
        list.push(row)
        this.$refs.moveOutBox.open(list)
      },

      handleDelete(row) {
        this.$confirm('确认删除该房源配置?', '提示').then(() => {
          const postData = { 'KeyID': [row.KeyID] }
          delEquipment(postData).then(() => {
            const index = this.filterList.findIndex(item => {
              return item.KeyID === row.KeyID
            })
            this.filterList.splice(index, 1)
            this.$message.success('删除成功')
          })
        })
      },

      moveOutCallback(moveAwayData) {
        // 更新中介设备数量
        const result = []
        this.filterList.map(v => {
          const item = moveAwayData.find(v1 => v1.Equipment === v.KeyID)
          if (item) {
            v.ResidueNumber -= item.Number
            if (v.ResidueNumber >= 0) {
              result.push(v)
            }
            if (v.ResidueNumber === 0) {
              v.Operation = ['ViewPic', 'Edit', 'Delete']
              v.LeaseStatusNum = false
            }
          } else {
            result.push(v)
          }
        })
        this.filterList = result
      }
    }
  }
</script>

<style scoped>

</style>
