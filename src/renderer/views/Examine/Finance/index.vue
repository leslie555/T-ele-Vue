<template>
<div class="app-container data-list marginTopLeft ">
  <el-tabs v-model="tabName" @tab-click="handleClick">
    <el-tab-pane
        v-for="title in header"
        :label="title.title"
        :name="title.name"
        :key="title.key"
        >
    </el-tab-pane>
  </el-tabs>
  <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="270px">
    <template slot="search">
      <!-- <el-form-item label="门店" prop="FullID">
        <select-store ref="selectStore" type="report" @change="handleStoreChange"></select-store>
      </el-form-item> -->
      <SelectOrganization v-model="ruleForm.FullID" :type="3"></SelectOrganization>
    </template>
    <template slot="button">
      <el-button type="primary" @click="submitForm">查询</el-button>
      <el-button type="primary" @click="resetForm">重置</el-button>
      <el-button type="primary" @click="download">导出</el-button>
      <a id='download'></a>
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
      class="table-normal">
      <el-table-column label = "房源名称" align="center" min-width = "130" prop = "HouseName"></el-table-column>
      <el-table-column label = "管房人" align="center" min-width = "130" prop = "UserName"></el-table-column>
      <el-table-column label = "所属组织" align="center" min-width = "130" prop = "CompanyName"></el-table-column>
      <el-table-column v-if="tabTitle === 1 || tabTitle === 2" label = "合同编号" align="center" min-width = "130" prop = "ContractNumber"></el-table-column>
      <el-table-column :label = "tabTitle === 2 ? '应付款日' : tabTitle === 3 ? '收款日期' : tabTitle === 4 ? '付款日期' : '应收款日'" align="center" min-width = "130" prop = "IDate">
        <template slot-scope="scope">
          {{$dateFormat(scope.row.IDate, 'yyyy-MM-dd')}}
        </template>
      </el-table-column>
      <el-table-column label = "金额" align="center" min-width = "130" prop = "Money">
        <template slot-scope="scope">
          {{$priceFormat(scope.row.Money)}}
        </template>
      </el-table-column>
      <el-table-column v-if="tabTitle === 1 || tabTitle === 2" label = "逾期天数" align="center" min-width = "130" prop = "OverdueDays"></el-table-column>
      <el-table-column v-else label = "项目明细" align="center" min-width = "130" prop = "ProjectName"></el-table-column>
    </el-table>
  </div>
  <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData"></bottom-tool-bar>
</div>
</template>
<style scoped lang="scss">
  @import "./style";
</style>
<script>
  import { OverdueRentCollection } from '@/api/owner'
  import { OverdueRentCollectionCount } from '@/api/owner'
  import { BottomToolBar, SearchPanel, Settlement, TableButtons, SelectStore, SelectOrganization } from '@/components'
  export default {
    name: 'FinanceList',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      Settlement,
      SelectStore,
      SelectOrganization
    },
    data() {
      return {
        list: [],
        filterList: [],
        listLoading: true,
        tableSelected: [],
        pageSize: 20,
        searchCount: null,
        ruleForm: {
          FullID: ''
        },
        params: {
          page: 1,
          size: 20
        },
        tabTitle: 1,
        tabName: 'ReceivableEnd',
        header: [
          { title: '收款逾期', key: 1, name: 'ReceivableEnd' },
          { title: '付款逾期', key: 2, name: 'PaymentEnd' },
          { title: '收款单未核销', key: 3, name: 'ReceivableNotCancel' },
          { title: '付款单未核销', key: 4, name: 'PaymentNotCancel' }
        ]
      }
    },
    created() {
      this.getTabNum()
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    methods: {
      async getTabNum() {
        await this.handleTabRequest(0, this.header.length)
        await OverdueRentCollection({
          pageParam: this.params,
          UserName: '',
          Type: 1,
          FullID: '',
          FullIDNew: this.ruleForm.FullID
        }).then(({ Data }) => {
          this.filterList = Data.rows
          this.listLoading = false
        })
      },
      // 页面加载 请求 tabTitle 数据条数
      handleTabRequest(index, length) {
        OverdueRentCollectionCount({
          UserName: '',
          Type: index + 1,
          FullID: '',
          FullIDNew: this.ruleForm.FullID
        }).then(({ Data }) => {
          this.listLoading = false
          this.header[index].title += `(${Data})`
          // console.log('async', this.header[index].title)
          // console.log('async', index)
          if (++index < length) {
            this.handleTabRequest(index, length)
          }
        })
      },
      // 重置、查询 更改tabTitle 数据
      updateTabRequest() {
        const titleText = this.header[this.tabTitle - 1].title
        OverdueRentCollectionCount({
          UserName: '',
          Type: this.tabTitle,
          FullID: '',
          FullIDNew: this.ruleForm.FullID
        }).then(({ Data }) => {
          this.listLoading = false
          this.header[this.tabTitle - 1].title = titleText.replace(/(\([^\)]*\))/, `(${Data})`)
        })
      },
      handleClick(tab, event) {
        const tabIndex = Number(tab.index) + 1
        this.tabTitle = tabIndex
        this.$refs.bottomToolBar.search()
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
        if (!this.ruleForm.EntrustTime) {
          this.ruleForm.EntrustTime = []
        }
        if (!this.ruleForm.CreateTime) {
          this.ruleForm.CreateTime = []
        }
        return OverdueRentCollection({
          pageParam: pages,
          UserName: '',
          Type: this.tabTitle,
          FullID: '',
          FullIDNew: this.ruleForm.FullID
        }).then(({ Data }) => {
          console.log('财务数据', Data)
          // this.header[this.tabTitle].title += `(${Data.records})`
          this.filterList = Data.rows
          this.searchCount = Data.records
          this.listLoading = false
          return Data
        }).catch(() => {
          this.listLoading = false
        })
      },
      // 选择门店过后，返回来的数据
      // handleStoreChange(val) {
      //   // 选择门店后的回调
      //   if (val) {
      //     this.ruleForm.FullID = val.fullID
      //   } else {
      //     this.ruleForm.FullID = ''
      //   }
      // },
      // 查询
      submitForm() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$refs.bottomToolBar.search()
            this.updateTabRequest()
          }
        })
      },
      // 重置
      resetForm() {
        // 清空数据
        this.$refs.ruleForm.resetFields()
        // 门店选择框重置
        // this.$refs.selectStore.reset()
        this.ruleForm.FullID = ''
        // 页面刷新
        this.$refs.bottomToolBar.search()
        // 更新 tabTitle 数据
        this.updateTabRequest()
      },
      // 格式化
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'ReceivableDate') {
            return this.$dateFormat(v[j])
          } else {
            return v[j]
          }
        }))
      },
      // 导出表格
      download() {
        this.downloadLoading = true
        this.params.size = this.searchCount
        OverdueRentCollection({
          pageParam: this.params,
          UserName: '',
          Type: this.tabTitle,
          FullID: '',
          FullIDNew: this.ruleForm.FullID
        }).then(response => {
          console.log('response', response.Data)
          this.listLoading = false
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['房源名称', '管房人', '所属组织', '合同编号', '应收款日', '金额', '逾期天数', '项目明细']
            const filament = ['HouseName', 'UserName', 'CompanyName', 'ContractNumber', 'IDate', 'Money', 'OverdueDays', 'ProjectName']
            const data = this.formatJson(filament, !response.Data ? [] : response.Data.rows)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '财务'
            })
            this.downloadLoading = false
          })
        }).catch(() => {
          this.downloadLoading = false
        })
      }
    }
  }
</script>