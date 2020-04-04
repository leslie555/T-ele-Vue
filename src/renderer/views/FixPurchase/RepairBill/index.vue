<template>
  <div class="app-container data-list modifyTop">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
        <el-form-item label="房源名称" prop="HouseName">
          <el-input placeholder="房源名称" v-model="ruleForm.HouseName" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="业务员" prop="Keyword">
          <el-input placeholder="姓名/电话" v-model="ruleForm.Keyword" style="width: 240px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="部门" prop="FullID">
            <select-store ref="selectStore" type="report" @change="handleStoreChange"></select-store>
        </el-form-item>-->
        <SelectOrganization v-model="ruleForm.FullID" :type="3"></SelectOrganization>
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
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <a id="download"></a>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table
        :data="filterList"
        border
        ref="multipleTable"
        v-loading.body="listLoading"
        element-loading-text="加载中"
        fit
        height="100%"
        class="table-normal"
      >
        <el-table-column align="center" label="房源名称" min-width="130" prop="HouseName"></el-table-column>
        <el-table-column align="center" label="地址" min-width="130" prop="Location"></el-table-column>
        <el-table-column align="center" label="维修内容" min-width="130" prop="MaintainContent">
          <template slot-scope="scope">
            <span
              :title="scope.row.MaintainContent"
              class="sangedian"
            >{{ scope.row.MaintainContent }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="租客信息" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.TenName}}</span>
            <span style="margin-left:10px;">{{scope.row.TenPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="业务员" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.UserName}}</span>
            <span style="margin-left:10px;">{{scope.row.Phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="组织" min-width="130" prop="CompanyName"></el-table-column>
        <el-table-column align="center" label="提交时间" min-width="130">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.CreaterTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" min-width="100" prop="State">
          <template slot-scope="scope">
            <span>{{ getFullStatus(scope.row.State) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" min-width="130" prop="Remark">
          <template slot-scope="scope">
            <span :title="scope.row.Remark" class="sangedian">{{ scope.row.Remark }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" min-width="200">
          <template slot-scope="scope">
            <table-buttons
              showAll
              :options="operation2button"
              :condition="scope.row.Operation"
              @handleDetailClick="handleDetail(scope.$index, scope.row)"
              @handledesignateClick="designate(scope.$index, scope.row, 1)"
              @handleCompleteMaintainClick="CompleteMaintain(scope.$index, scope.row, 2)"
              @handlehandleSurveyClick="handleSurvey(scope.$index, scope.row, 1)"
              @handleQrcodeClick="handleQrcode(scope.row)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData"></bottom-tool-bar>
    <fixPurchaseSurver @watchSubmit="watchSubmit" ref="fixPurchaseSurver"></fixPurchaseSurver>
    <designate @refresh="refresh" ref="designate"></designate>
    <qrcode ref="qrcode"></qrcode>
  </div>
</template>
<style scoped lang="scss">
//   @import "style";
</style>
<script>
import { Maintainbypage } from '@/api/purchase'
import {
  BottomToolBar,
  SearchPanel,
  TableButtons,
  SelectStore,
  SelectOrganization
} from '@/components'
import fixPurchaseSurver from './components/index'
import designate from '../PurchaseDepartment/MoveingPaper/components/designate'
import { hasPermission } from '../../../utils/permission'
import qrcode from '../components/qrcode'

export default {
  // name: 'RepairBill',
  components: {
    SearchPanel,
    TableButtons,
    BottomToolBar,
    fixPurchaseSurver,
    SelectStore,
    designate,
    qrcode,
    SelectOrganization
  },
  data() {
    return {
      list: [],
      filterList: [],
      listLoading: true,
      tableSelected: [],
      pageSize: 10,
      recordPage: null,
      getjudge: null,
      ruleForm: {
        HouseName: '',
        Keyword: '',
        FullID: '',
        State: ''
      },
      procureList: [
        { value: '', label: '全部' },
        { value: '2', label: '待指派' },
        { value: '3', label: '待维修' },
        { value: '4', label: '处理完成' },
        { value: '5', label: '转装修' }
        // { value: '6', label: '待审批（经理）' },
        // { value: '7', label: '待审批（采购部）' }
      ],
      operation2button: [
        {
          key: 'Detail',
          value: '查看',
          type: 'primary'
        },
        {
          key: 'designate',
          value: '指派',
          type: 'success'
        },
        {
          key: 'CompleteMaintain',
          value: '维修完成',
          type: 'success'
        },
        {
          key: 'handleSurvey',
          value: '转装修',
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
  created() {
    // 权限判断 是否展示操作栏
    this.getjudge = hasPermission('RepairBill', 'CompleteMaintain')
  },
  methods: {
    // 调接口
    fetchData(pages) {
      if (!pages) {
        pages = {
          size: this.pageSize,
          page: 1
        }
      } else {
        this.recordPage = pages
      }
      this.listLoading = true
      return Maintainbypage({
        parm: pages,
        HouseName: this.ruleForm.HouseName,
        Keyword: this.ruleForm.Keyword,
        FullIDNew: this.ruleForm.FullID,
        State: this.ruleForm.State,
        isHaveButton: this.getjudge,
        UsePage: 2
      })
        .then(({ Data }) => {
          // this.filterList = Data.rows
          const filterList = Data.rows
          this.filterTableData(filterList)
          this.filterList = filterList
          console.log(this.filterList, 'test')
          this.listLoading = false
          // 传给父组件的标识
          return Data
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    filterTableData(filterList) {
      filterList.map(v => {
        let Operation = []
        if (v.State === 2) {
          Operation = ['designate', 'Detail', 'Qrcode']
        } else if (v.State === 3) {
          Operation = ['CompleteMaintain', 'handleSurvey', 'Detail']
        } else if (v.State === 1) {
          Operation = ['Detail']
        } else if (v.State === 4) {
          Operation = ['Detail']
        } else if (v.State === 5) {
          Operation = ['Detail']
        } else if (v.State === 6) {
          Operation = ['Detail']
        } else {
          Operation = ['Detail']
        }
        v.Operation = Operation
      })
    },
    // 提交
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$refs.bottomToolBar.search()
        }
      })
    },
    // 重置
    resetForm() {
      // 清空数据
      this.$refs.ruleForm.resetFields()
      // 门店选择框重置
      // this.$refs.selectStore.reset()
      // 页面刷新
      this.$refs.bottomToolBar.search()
    },
    handleSurvey(index, row, num) {
      this.$refs.fixPurchaseSurver.open({
        survey: true,
        num: num,
        KeyID: row.KeyID,
        row: row
      })
    },
    designate(index, row, num) {
      this.$refs.designate.open({
        KeyID: row.KeyID,
        num: num,
        bill: 1
      })
    },
    CompleteMaintain(index, row, num) {
      this.$refs.designate.open({
        KeyID: row.KeyID,
        num: num,
        bill: 1
      })
    },
    handleDetail(index, row) {
      this.$router.push({
        path: '/FixPurchase/RepairBillDetail',
        query: {
          MaintenanceCleaning: 0,
          KeyID: row.KeyID
        }
      })
      // this.$router.push({
      //   path: '/FixPurchase/cleningDetail',
      //   query: {
      //     MaintenanceCleaning: 0,
      //     KeyID: row.KeyID
      //   }
      // })
    },
    handleQrcode(row) {
      this.currentRow = this.$deepCopy(row)
      row.num = 1
      row.bill = 10
      this.$refs.designate.open(row, '维修')
      // this.$refs.qrcode.open(row, 'RepairingSingle')
    },
    watchSubmit(val) {
      this.fetchData(this.recordPage)
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
    getFullStatus(status) {
      return status === 1
        ? '暂存'
        : status === 2
        ? '待指派'
        : status === 3
        ? '待维修'
        : status === 4
        ? '处理完成'
        : status === 5
        ? '转装修'
        : status === 6
        ? '待审批（经理）'
        : '待审批（采购部）'
    },
    refresh(val, row, type) {
      if (type === 10) {
        row.ShareID = val.userID
        this.$refs.qrcode.open(row, 'RepairingSingle')
      } else {
        this.fetchData()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sangedian {
  overflow: hidden;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
