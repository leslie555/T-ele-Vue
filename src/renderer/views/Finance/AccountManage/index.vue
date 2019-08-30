<template>
  <div>
    <div class="app-container data-list">
      <search-panel :model="ruleForm" ref="ruleForm" label-width="80px">
        <template slot="search">
          <el-form-item label="关键字" prop="Keyword">
            <el-input
              v-model="ruleForm.Keyword"
              autocomplete="off"
              placeholder="输入账户名称/开户行"
              style="width: 320px"
            ></el-input>
          </el-form-item>
        </template>
        <template slot="button">
          <el-button type="primary" @click="searchAccount">查询</el-button>
          <el-button class="reset-button" type="primary" @click="keywordReset()">重置</el-button>
          <el-button type="primary" v-setbtn:Add @click="accountAdd">新增</el-button>
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
          <el-table-column
            align="center"
            label="账户类型"
            fixed="left"
            width="90"
            prop="AccountTypeName"
          ></el-table-column>
          <el-table-column align="center" label="账户名称" min-width="100" prop="AccountName"></el-table-column>
          <el-table-column align="center" label="账号" min-width="180" prop="Account"></el-table-column>
          <el-table-column align="center" label="银行名称" min-width="180" prop="BankName">
            <template slot-scope="scope">
              <div>{{scope.row.BankName}}</div>
              <div>{{scope.row.OpenBank}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="期初余额" min-width="100" prop="BeginningBalance"></el-table-column>
          <el-table-column align="center" label="余额" min-width="100" prop="Balance"></el-table-column>
          <el-table-column align="center" label="建账日期" min-width="140" prop="CreateAccountTime"></el-table-column>
          <el-table-column align="center" label="所属门店" min-width="140" prop="CompanyInfo">
            <template slot-scope="scope">
              <div v-for="item in scope.row.CompanyInfo" :key="item.KeyID">{{item.CompanyName}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="汇付商户号" min-width="180" prop="HuifuMemberId"></el-table-column>
          <el-table-column align="center" label="备注" min-width="120" prop="Remark"></el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <table-buttons
                :options="operation2button"
                :condition="scope.row.Operation"
                @handleEditClick="handleUpdate(scope.row)"
                @handleDetailClick="handleDetail(scope.row)"
              ></table-buttons>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <bottom-tool-bar
        class="pager-div"
        ref="bottomToolBar"
        :page-size="pageSize"
        :handlePageChange="fetchData"
      ></bottom-tool-bar>
    </div>
    <div>
      <EditAccountInfo ref="editBox" @editAccountInfo="editAccountInfo"></EditAccountInfo>
    </div>
  </div>
</template>

<script>
  import { SearchPanel, TableButtons, BottomToolBar } from '../../../components/'
  import EditAccountInfo from './components/EditAccountInfo.vue'
  import { QueryAccountInfoPage } from '../../../api/finance'
  import { dateFormat } from '../../../utils/dateFormat'

  export default {
    name: 'AccountManage',
    components: {
      TableButtons,
      SearchPanel,
      BottomToolBar,
      EditAccountInfo
    },

    data() {
      return {
        ruleForm: {
          Keyword: ''
        },
        list: [],
        filterList: [],
        listLoading: false,
        pageSize: 10,
        operation2button: [
          {
            key: 'Edit',
            value: '修改',
            type: 'primary'
          },
          {
            key: 'Detail',
            value: '明细',
            type: 'primary'
          }
        ]
      }
    },

    activated() {
      this.$refs.bottomToolBar.search(1)
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
        return QueryAccountInfoPage({
          pageParam: pages,
          KeyWord: this.ruleForm.Keyword
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
          AccountType: item.AccountType,
          AccountName: item.AccountName,
          BankName: item.BankName,
          OpenBank: item.OpenBank,
          BeginningBalance: item.BeginningBalance,
          Balance: item.Balance,
          Account: item.Account,
          CreateAccountTime: dateFormat(item.CreateAccountTime, 'yyyy-MM-dd'),
          Remark: item.Remark,
          CompanyInfo: item.CompanyInfo,
          Store: item.Store || [],
          HuifuMemberId: item.HuifuMemberId || '',
          ImageUpload: item.ImageUpload || [],
          AccountTypeName: this.$EnumData.getEnumDesByValue('AccountType', item.AccountType),
          Operation: ['Edit', 'Detail']
        }
      },

      searchAccount() {
        this.$refs.bottomToolBar.search()
      },

      keywordReset() {
        this.$refs.ruleForm.resetFields()
        this.$refs.bottomToolBar.search()
      },

      accountAdd() {
        const editData = {
          AccountType: 1,
          AccountName: '',
          BankName: '',
          OpenBank: '',
          BeginningBalance: '',
          Account: '',
          CreateAccountTime: '',
          CompanyInfo: [],
          Store: [],
          HuifuMemberId: '',
          ImageUpload: [],
          Remark: ''
        }
        this.$refs.editBox.open(editData)
      },

      handleUpdate(row) {
        const editData = {
          KeyID: row.KeyID,
          AccountType: row.AccountType,
          AccountName: row.AccountName,
          BankName: row.BankName,
          OpenBank: row.OpenBank,
          BeginningBalance: row.BeginningBalance,
          Account: row.Account,
          CreateAccountTime: row.CreateAccountTime,
          CompanyInfo: [],
          Store: row.Store,
          HuifuMemberId: row.HuifuMemberId,
          ImageUpload: row.ImageUpload,
          Remark: row.Remark
        }
        this.$refs.editBox.open(editData)
      },

      editAccountInfo(data) {
        data.AccountTypeName = this.$EnumData.getEnumDesByValue('AccountType', data.AccountType)
        // 查找该数据是否在当前列表下，有则修改，没有则新增
        const index = this.filterList.findIndex(item => {
          return item.KeyID === data.KeyID
        })
        data.Operation = ['Edit', 'Detail']
        data.Store = data.CompanyInfo.map(item => {
          return item.KeyID
        })
        if (index > -1) {
          this.$set(this.filterList, index, { ...this.filterList[index], ...data })
        } else {
          data.CreateAccountTime = dateFormat(data.CreateAccountTime, 'yyyy-MM-dd')
          this.filterList.unshift(data)
        }
      },
      handleDetail(row) {
        this.$router.push({
          path: '/Finance/AccountDetail',
          query: {
            accountID: row.KeyID,
            CompanyInfo: JSON.stringify(row.CompanyInfo)
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
