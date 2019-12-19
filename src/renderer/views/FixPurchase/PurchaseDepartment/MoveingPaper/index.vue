<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="100px">
      <template slot="search">
        <el-form-item label="房源名称" prop="HouseName">
          <el-input v-model="ruleForm.HouseName" placeholder="请输入房源名称"></el-input>
        </el-form-item>
        <el-form-item label="业务员" prop="Salesman">
          <el-input placeholder="姓名/电话" v-model="ruleForm.Salesman" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="DepID">
          <select-store ref="selectStore" type="report" @change="handleStoreChange"></select-store>
        </el-form-item>
        <el-form-item label="状态" prop="Status">
          <el-select v-model="ruleForm.Status" placeholder="请选择">
            <el-option
              v-for="item in procureList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button class="search-button" type="primary" @click="configSearch()">查询</el-button>
        <el-button class="reset-button" type="primary" @click="keywordReset()">重置</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table
        :data="filterList"
        ref="multipleTable"
        v-loading.body="listLoading"
        element-loading-text="加载中"
        border
        fit
        height="100%"
        class="table-normal"
      >
        <el-table-column align="center" label="房源名称" min-width="180" prop="HouseName"></el-table-column>
        <el-table-column align="center" label="地址" min-width="180" prop="Location"></el-table-column>
        <el-table-column align="center" label="搬家内容" min-width="120" prop="MovingContent"></el-table-column>
        <el-table-column align="center" label="租客信息" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.TenantName}} {{scope.row.TenantTel}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="业务员" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.Salesman}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="部门" min-width="120" prop="CompanyName"></el-table-column>
        <el-table-column align="center" label="提交时间" min-width="120" prop="CreaterTime">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.ReviewedCommitTime,'yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" min-width="120" prop="BZ">
          <template slot-scope="scope">
            <!-- <span :class="scope.row.BZ.length > 20 ? 'showEllipsis' : '' ">{{scope.row.BZ}}</span> -->
            <span>{{scope.row.BZ}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" min-width="80" prop="Status">
          <template slot-scope="scope">
            <!-- <span>{{filterStatus(scope.row.Status)}}</span> -->
            <span>{{ judgeStatus(scope.row.Status) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" min-width="200">
          <template slot-scope="scope">
            <table-buttons
              :showAll="true"
              :options="operationButton"
              :condition="scope.row.conditionBtn"
              @handleDetailClick="handleDetail(scope.row)"
              @handleAssginedClick="handleAssgined(scope.row)"
              @handleCompleteClick="handleComplete(scope.row)"
              @handleQrcodeClick="handleQrcode(scope.row)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData"></bottom-tool-bar>
    <div>
      <!-- <AssginDialog ref="openConfigBoxAssgin"></AssginDialog>
      <CompleteDialog ref="openConfigBoxComplete"></CompleteDialog>-->
      <designate @refresh="refresh" @upFinish="upFinish" ref="designate"></designate>
      <qrcode ref="qrcode"></qrcode>
    </div>
  </div>
</template>
<script>
import {
  SearchPanel,
  TableButtons,
  BottomToolBar,
  SelectStore
} from '@/components'
import designate from './components/designate'
import {
  ShowHouseMoving,
  AssignMovingPerson,
  CompleteHouseMoving
} from '@/api/service'
import qrcode from '../../components/qrcode'
export default {
  name: 'CleaningPaperList',
  components: {
    TableButtons,
    SearchPanel,
    BottomToolBar,
    SelectStore,
    designate,
    qrcode
  },
  data() {
    return {
      listLoading: false,
      pageSize: 10,
      ruleForm: {
        DepID: '',
        HouseName: '',
        Salesman: '',
        Status: 0
      },
      currentRow: {},
      HouseName: '',
      procureList: [
        { value: 0, label: '全部' },
        { value: 4, label: '待指派' },
        { value: 5, label: '待处理' },
        { value: 6, label: '已完成' }
      ],
      filterList: [],
      list: [],
      operationButton: [
        {
          key: 'Detail',
          value: '详情',
          type: 'primary'
        },
        {
          key: 'Assgined',
          value: '指派',
          type: 'primary'
        },
        {
          key: 'Complete',
          value: '处理完成',
          type: 'primary'
        },
        {
          key: 'Qrcode',
          value: '分享',
          type: 'primary'
        }
      ]
    }
  },
  // activated() {
  //   this.$refs.bottomToolBar.search(1)
  // },
  methods: {
    // 查询
    configSearch() {
      console.log(this.ruleForm.Status)
      this.$refs.bottomToolBar.search()
    },
    // 重置
    keywordReset() {
      this.$refs.ruleForm.resetFields()
      this.$refs.bottomToolBar.search()
      // 部门选择框重置
      this.$refs.selectStore.reset()
    },
    // 选择部门过后，返回来的数据
    handleStoreChange(val) {
      // 选择部门后的回调
      if (val) {
        this.ruleForm.FullID = val.fullID
      } else {
        this.ruleForm.FullID = ''
      }
    },
    judgeStatus(val) {
      let type = ''
      switch (val) {
        case 0:
          type = '全部'
          break
        case 1:
          type = '暂存'
          break
        case 2:
          type = '待审批（经理）'
          break
        case 3:
          type = '待审批（采购部）'
          break
        case 4:
          type = '待指派'
          break
        case 5:
          type = '待处理'
          break
        case 6:
          type = '已完成'
          break
      }
      return type
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
      return ShowHouseMoving({
        parm: pages, // 分页参数
        HouseName: this.ruleForm.HouseName, // 房源名称
        Salesman: this.ruleForm.Salesman, // 关键词
        DepID: this.ruleForm.DepID, // 部门id
        Status: this.ruleForm.Status, // 状态
        ViewState: 2
        // isHaveButton: hasPermission('CleaningPaperList', 'Assgined')
      })
        .then(response => {
          console.log(response)
          this.list = response.Data.rows
          console.log('this.list', this.list)
          this.filterTableData()
          console.log('this.filterList', this.filterList)
          this.listLoading = false
          return response.Data
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    filterTableData() {
      this.filterList = []
      this.list.map(item => {
        this.filterList.push(this.filterTableDataItem(item))
      })
    },
    // 初始化Status
    filterStatus(item) {
      const labelStatus = this.procureList.find(res => item === res.value)
      return labelStatus.label
    },
    // 根据Status状态，过滤操作按钮
    filterTableDataItem(item) {
      let itemChooseStatus = []
      switch (item.Status) {
        case 4:
          itemChooseStatus = ['Detail', 'Assgined', 'Qrcode']
          break
        case 5:
          itemChooseStatus = ['Detail', 'Complete']
          break
        // case 4: itemChooseStatus = ['Detail']; break
        default:
          itemChooseStatus = ['Detail']
      }
      return {
        ...item,
        conditionBtn: itemChooseStatus // 操作按钮
      }
    },
    // 详情
    handleDetail(row) {
      this.$router.push({
        name: 'MoveApplydetail',
        query: {
          KeyID: row.KeyID
        }
      })
    },
    handleQrcode(row) {
      this.$refs.qrcode.open(row, 'MovingSingle')
    },
    // 指派
    handleAssgined(row) {
      this.currentRow = this.$deepCopy(row)
      row.num = 1
      row.bill = 2
      this.$refs.designate.open(row)
      console.log('指派', row)
    },
    // 处理完成
    handleComplete(row) {
      this.currentRow = this.$deepCopy(row)
      row.num = 2
      row.bill = 2
      this.$refs.designate.open(row)
      console.log('处理完成', row)
    },
    // 子组件事件监听(指派)
    refresh(val) {
      AssignMovingPerson({
        KeyID: this.currentRow.KeyID,
        MovingName: val
      }).then(res => {
        if (res.Code === 0) {
          this.filterList.map(res => {
            if (res.KeyID === this.currentRow.KeyID) {
              res.Status = 3
              return res
            }
          })
          // this.$refs.bottomToolBar.search()
          this.fetchData()
          this.$message.success('提交成功')
          console.log(val)
          console.log('指派成功', res)
        }
      })
    },
    // 子组件事件监听(处理完成)
    upFinish(val) {
      const Img = val.MaintainImg
      let arr = ''
      if (Img.length !== 0) {
        Img.forEach(item => {
          arr = arr + item.KeyID + ','
        })
        arr = arr.substring(0, arr.length - 1)
      } else {
        arr = ''
      }
      CompleteHouseMoving({
        KeyID: this.currentRow.KeyID,
        MovingImageID: arr,
        // MovingImageID: val.MaintainImg,
        MovingBZ: val.MaintainRemark
      }).then(res => {
        if (res.Code === 0) {
          this.filterList.map(res => {
            if (res.KeyID === this.currentRow.KeyID) {
              res.Status = 4
              return res
            }
          })
          this.fetchData()
          this.$message.success('提交成功')
          console.log(val)
          console.log('处理完成', res)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// .bottom-bar-top{
//     margin-top: 10px;
// }
.showEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 120px;
}
</style>