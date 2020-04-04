<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="100px">
      <template slot="search">
        <el-form-item label="房源名称" prop="HouseName">
          <el-input v-model="ruleForm.HouseName" placeholder="请输入房源名称"></el-input>
        </el-form-item>
        <el-form-item label="业务员" prop="Keyword">
          <el-input placeholder="姓名/电话" v-model="ruleForm.Keyword" style="width: 240px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="部门" prop="FullID">
            <select-store ref="selectStore" type="report" @change="handleStoreChange"></select-store>
        </el-form-item>-->
        <SelectOrganization :type="3" v-model="ruleForm.FullIDNew"></SelectOrganization>
        <el-form-item label="状态" prop="State">
          <el-select v-model="ruleForm.State" placeholder="请选择">
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
        <el-table-column align="center" label="保洁内容" min-width="120" prop="CleaningContent"></el-table-column>
        <el-table-column align="center" label="租客信息" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.TenName}} {{scope.row.TenPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="业务员" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.UserName}} {{scope.row.Phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="组织" min-width="120" prop="CompanyName"></el-table-column>
        <el-table-column align="center" label="提交时间" min-width="120" prop="CreaterTime">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.CreaterTime,'yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" min-width="120" prop="Remark">
          <template slot-scope="scope">
            <span :class="scope.row.Remark.length > 20 ? 'showEllipsis' : '' ">{{scope.row.Remark}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" min-width="80" prop="State">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.State)}}</span>
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
      <AssginDialog ref="openConfigBoxAssgin"></AssginDialog>
      <CompleteDialog ref="openConfigBoxComplete"></CompleteDialog>
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
  SelectOrganization
} from '@/components'
import { AssginDialog, CompleteDialog } from './components'
import designate from '../MoveingPaper/components/designate'
import { Cleaningbypage, EditCleaning } from '@/api/purchase'
import { hasPermission } from '@/utils/permission'
import qrcode from '../../components/qrcode'
export default {
  name: 'CleaningPaperList',
  components: {
    TableButtons,
    SearchPanel,
    BottomToolBar,
    SelectOrganization,
    AssginDialog,
    CompleteDialog,
    designate,
    qrcode
  },
  data() {
    return {
      listLoading: false,
      pageSize: 10,
      ruleForm: {
        FullID: '',
        HouseName: '',
        Keyword: '',
        State: '',
        FullIDNew: ''
      },
      currentRow: {},
      HouseName: '',
      procureList: [
        { value: '', label: '全部' },
        { value: 2, label: '待指派' },
        { value: 3, label: '待处理' },
        { value: 4, label: '已完成' }
        // { value: 5, label: '待审批（经理）' },
        // { value: 6, label: '待审批（采购部）' }
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
      console.log(this.ruleForm.State)
      this.$refs.bottomToolBar.search()
    },
    // 重置
    keywordReset() {
      this.$refs.ruleForm.resetFields()
      this.$refs.bottomToolBar.search()
      // 部门选择框重置
      // this.$refs.selectStore.reset()
      this.ruleForm.FullIDNew = ''
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
    // 调接口
    fetchData(pages) {
      if (!pages) {
        pages = {
          size: this.pageSize,
          page: 1
        }
      }
      this.listLoading = true
      return Cleaningbypage({
        parm: pages, // 分页参数
        HouseName: this.ruleForm.HouseName, // 房源名称
        Keyword: this.ruleForm.Keyword, // 关键词
        FullID: this.ruleForm.FullID, // 部门id
        State: this.ruleForm.State, // 状态
        FullIDNew: this.ruleForm.FullIDNew,
        UsePage: 2,
        isHaveButton: hasPermission('CleaningPaperList', 'Assgined')
      })
        .then(response => {
          this.list = response.Data.rows
          this.filterTableData()
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
    // 初始化State
    filterStatus(item) {
      const labelStatus = this.procureList.find(res => item === res.value)
      return labelStatus.label
    },
    // 根据State状态，过滤操作按钮
    filterTableDataItem(item) {
      let itemChooseStatus = []
      switch (item.State) {
        case 2:
          itemChooseStatus = ['Detail', 'Assgined', 'Qrcode']
          break
        case 3:
          itemChooseStatus = ['Detail', 'Complete']
          break
        case 5:
          itemChooseStatus = ['Detail']
          break
        case 6:
          itemChooseStatus = ['Detail']
          break
        case 4:
          itemChooseStatus = ['Detail']
          break
        default:
          itemChooseStatus = []
      }
      return {
        KeyID: item.KeyID, // KeyID
        HouseName: item.HouseName, // 房源名称
        Location: item.Location, // 地址
        CleaningContent: item.CleaningContent, // 保洁内容
        TenName: item.TenName, // 租客姓名
        TenPhone: item.TenPhone, // 租客电话
        UserName: item.UserName, // 业务员姓名
        Phone: item.Phone, // 业务员电话
        CompanyName: item.CompanyName, // 部门
        CreaterTime: item.CreaterTime, // 提交时间
        State: item.State, // 状态
        Remark: item.Remark, // 备注
        conditionBtn: itemChooseStatus // 操作按钮
      }
    },
    // 详情
    handleDetail(row) {
      this.$router.push({
        path: '/FixPurchase/CleaningPaperDetail',
        query: {
          KeyID: row.KeyID
        }
      })
      console.log('详情', row)
    },
    handleQrcode(row) {
      this.currentRow = this.$deepCopy(row)
      row.num = 1
      row.bill = 10
      this.$refs.designate.open(row, '保洁')
    },
    // 指派
    handleAssgined(row) {
      // this.$refs.openConfigBoxAssgin.open(row)
      this.currentRow = this.$deepCopy(row)
      row.num = 1
      row.bill = 2
      this.$refs.designate.open(row)
      console.log('指派', row)
    },
    // 处理完成
    handleComplete(row) {
      // this.$refs.qrcode.open(row)
      this.$refs.openConfigBoxComplete.open(row)
      this.currentRow = this.$deepCopy(row)
      row.num = 2
      row.bill = 2
      this.$refs.designate.open(row)
      console.log('处理完成', row)
    },
    // 子组件事件监听(指派)
    refresh(val, row, type) {
      if (type === 10) {
        debugger
        row.ShareID = val.userID
        this.$refs.qrcode.open(row, 'CleaningSingle')
      } else {
        EditCleaning({
          KeyID: this.currentRow.KeyID,
          State: 3,
          CleaningEmpID: val
        }).then(res => {
          if (res.Code === 0) {
            this.filterList.map(res => {
              if (res.KeyID === this.currentRow.KeyID) {
                res.State = 3
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
      }
    },
    // 子组件事件监听(处理完成)
    upFinish(val) {
      EditCleaning({
        KeyID: this.currentRow.KeyID,
        State: 4,
        CleaningIDSum: val.MaintainIDSum,
        CleaningImg: val.MaintainImg,
        CleaningRemark: val.MaintainRemark
      }).then(res => {
        if (res.Code === 0) {
          this.filterList.map(res => {
            if (res.KeyID === this.currentRow.KeyID) {
              res.State = 4
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