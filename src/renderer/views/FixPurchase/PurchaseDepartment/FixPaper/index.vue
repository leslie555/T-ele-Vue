<template>
    <div class="app-container data-list">
        <search-panel :model="ruleForm" ref="ruleForm" label-width="100px">
        <template slot="search">
          <el-form-item label="房源名称" prop="HouseName">
            <el-input v-model="ruleForm.HouseName" placeholder="请输入房源名称"></el-input>
          </el-form-item>
          <el-form-item label="业务员" prop="Salesman">
            <el-input
              placeholder="姓名/电话"
              v-model="ruleForm.Salesman"
              style="width: 240px"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="部门" prop="FullID">
            <select-store ref="selectStore" type="report" @change="handleStoreChange"></select-store>
          </el-form-item>
            <el-form-item label="状态" prop="Status">
            <el-select v-model="ruleForm.Status" placeholder="请选择">
                <el-option
                v-for="item in procureList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            </el-form-item>
        </template>
        <template slot="button">
          <el-button
            class="search-button"
            type="primary"
            @click="configSearch()">查询
          </el-button>
          <el-button
            class="reset-button"
            type="primary"
            @click="keywordReset()">重置
          </el-button>
        </template>
      </search-panel>
          <div class="panel data-list-table">
            <el-table :data="filterList"
                      ref="multipleTable"
                      v-loading.body="listLoading"
                      element-loading-text="加载中"
                      border
                      fit
                      min-height="700px"
                      class="table-normal">
              <el-table-column align="center" label="房源名称" min-width="180" prop="HouseName"></el-table-column>
              <el-table-column align="center" label='地址' min-width="180" prop="Location">
              </el-table-column>
              <el-table-column align="center" label='业务员' min-width="120" prop="Salesman"></el-table-column>
              <el-table-column align="center" label='部门' min-width="120" prop="CompanyName"></el-table-column>
              <el-table-column align="center" label='钥匙位置' min-width="120" prop="KeyLocation"></el-table-column>
              <el-table-column align="center" label='创建时间' min-width="120" prop="CreaterTime">
                <template slot-scope="scope">
                 <span>{{$dateFormat(scope.row.CreaterTime,'yyyy-MM-dd')}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label='状态' min-width="80" prop="SheetStatus">
                <template slot-scope="scope">
                  <span>{{filterStatus(scope.row.SheetStatus)}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label='备注' min-width="120" prop="BZ"></el-table-column>
              <el-table-column align="center" label="操作" fixed="right" min-width="120">
                <template slot-scope="scope">
                  <table-buttons
                    :showAll="true"
                    :options="operationButton"
                    :condition="scope.row.conditionBtn"
                    @handleDetailClick="handleDetail(scope.row)"
                    @handleEntranceClick="handleEntrance(scope.row)"
                    @handleDecorationEndClick="handleDecorationEnd(scope.row)"
                  ></table-buttons>
                </template>
              </el-table-column>
            </el-table>
          </div>
            <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData"></bottom-tool-bar>
            <FixPaperAndPurchaseDialog ref="addConfigBox" @editConfigInfo="editConfigInfo"></FixPaperAndPurchaseDialog>
    </div>
</template>
<script>
import { SearchPanel, TableButtons, BottomToolBar, SelectStore } from '@/components'
import FixPaperAndPurchaseDialog from './components/FixPaperAndPurchaseDialog'
import { ShowDecorationSheet, UpdateDecorationSheetStatus } from '@/api/purchase'
export default {
  name: 'FixPaperList',
  components: {
    TableButtons,
    SearchPanel,
    BottomToolBar,
    SelectStore,
    FixPaperAndPurchaseDialog
  },
  data() {
    return {
      listLoading: false,
      pageSize: 10,
      ruleForm: {
        Status: 0,
        FullID: '',
        Salesman: '',
        HouseName: ''
      },
      HouseName: '',
      procureList: [
        { value: 0, label: '全部' },
        { value: 1, label: '未入场' },
        { value: 2, label: '已入场' },
        { value: 3, label: '已结束' }
      ],
      list: [],
      filterList: [],
      operationButton: [
        {
          key: 'Detail',
          value: '详情',
          type: 'primary'
        },
        {
          key: 'Entrance',
          value: '已入场',
          type: 'primary'
        },
        {
          key: 'DecorationEnd',
          value: '装修结束',
          type: 'primary'
        }
      ]
    }
  },
  methods: {
    // 查询
    configSearch() {
      this.$refs.bottomToolBar.search()
    },
    // 重置
    keywordReset() {
      // 清空文本框内容
      this.$refs.ruleForm.resetFields()
      // 重新请求全部数据
      this.$refs.bottomToolBar.search()
      // 门店选择框重置
      this.$refs.selectStore.reset()
    },
    // 选择门店过后，返回来的数据
    handleStoreChange(val) {
      // 选择门店后的回调
      if (val) {
          this.ruleForm.FullID = val.fullID
      } else {
          this.ruleForm.FullID = ''
      }
    },
    // 调接口
    fetchData(pages) {
      if (!pages) {
        pages = {
          size: this.pageSize,
          page: 1
        }
      }
      this.listLoading = true
      return ShowDecorationSheet({
        parm: pages,
        HouseName: this.ruleForm.HouseName, // 房源名称
        Salesman: this.ruleForm.Salesman, // 业务员
        DepID: this.ruleForm.FullID, // 部门ID
        SheetStatus: this.ruleForm.Status // 装修单状态
      }).then(response => {
        console.log(response)
        this.list = response.Data.rows
        this.filterTableData()
        console.log(this.filterList)
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
      let itemChooseStatus = []
      switch (item.SheetStatus) {
        case 1: itemChooseStatus = ['Detail', 'Entrance']; break
        case 2: itemChooseStatus = ['Detail', 'DecorationEnd']; break
        case 3: itemChooseStatus = ['Detail']; break
        default: itemChooseStatus = []
      }
      return {
        KeyID: item.KeyID,
        HouseName: item.HouseName,
        Location: item.Location,
        Salesman: item.Salesman,
        CompanyName: item.CompanyName,
        KeyLocation: item.KeyLocation,
        CreaterTime: item.CreaterTime,
        SheetStatus: item.SheetStatus,
        BZ: item.BZ,
        conditionBtn: itemChooseStatus
      }
    },
    handleView(row) {
      console.log('row', row)
    },
    filterStatus(item) {
      const labelStatus = this.procureList.find(res => item === res.value)
      return labelStatus.label
    },
    // 详情
    handleDetail(row) {
      const typeTitle = { title: '装修单', titleID: 1 }
      this.$refs.addConfigBox.open(row, typeTitle)
      console.log('row', row)
    },
    // 已入场
    handleEntrance(row) {
      UpdateDecorationSheetStatus({
        KeyID: row.KeyID, // 查询时获取到的主键ID
        SheetStatus: 2 // 装修单状态
      }).then(res => {
        row.SheetStatus = 2
        row.conditionBtn = ['Detail', 'DecorationEnd']
        console.log('已入场', res)
      })
      console.log('row', row)
    },
    // 装修结束
    handleDecorationEnd(row) {
      UpdateDecorationSheetStatus({
        KeyID: row.KeyID, // 查询时获取到的主键ID
        SheetStatus: 3 // 装修单状态
      }).then(res => {
        row.SheetStatus = 3
        row.conditionBtn = ['Detail']
        console.log('装修结束', res)
      })
      console.log('row', row)
    },
    // 对话框事件监听
    editConfigInfo(data) {
      console.log('sssss')
    }
  }
}
</script>
<style lang="scss" scoped>
.bottom-bar-top{
    margin-top: 10px;
}
</style>