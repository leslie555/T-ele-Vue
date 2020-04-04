<template>
  <div class="app-container data-list modifyTop">
    <el-tabs v-model="tabName" @tab-click="handleClick">
      <el-tab-pane
        v-for="title in header"
        :label="title.title"
        :name="title.name"
        :key="title.key">
      </el-tab-pane>
    </el-tabs>
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
        <!-- <el-form-item label="门店" prop="FullID">
          <select-store ref="selectStore" type="report" @change="handleStoreChange"></select-store>
        </el-form-item> -->
        <SelectOrganization :type="3" v-model="ruleForm.FullID"></SelectOrganization>
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
        <el-table-column v-if = "tabTitle === 3" label = "房源编号" align="center" min-width = "130" prop = "HouseCode">
          <template slot-scope="scope">
            {{ scope.row.HouseCode }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData"></bottom-tool-bar>
  </div>
</template>
<style scoped lang="scss">
  @import "./style";
</style>
<script>
  import { SearchHousePerfect } from '@/api/owner'
  import { SearchHousePerfectCount } from '@/api/owner'
  import { BottomToolBar, SearchPanel, Settlement, TableButtons, SelectStore, SelectOrganization } from '@/components'
  export default {
    name: 'HouseResourcesList',
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
        tabTitle: 1,
        searchCount: null,
        ruleForm: {
          FullID: ''
        },
        params: {
          page: 1,
          size: 20
        },
        tabName: 'ToBePerfected',
        header: [
          { title: '待完善', key: 0, name: 'ToBePerfected' },
          { title: '待审核', key: 1, name: 'ToBeAudited' },
          { title: '无照片', key: 2, name: 'NoPhotos' }
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
      tabIndexValue(value) {
        this.tabTitle = value
      },
      async getTabNum() {
        await this.handleTabRequest(0, this.header.length)
        await SearchHousePerfect({
          pageParam: this.params,
          UserName: '',
          Type: 1,
          FullID: '',
          FullIDNew: this.ruleForm.FullID
        }).then(({ Data }) => {
          this.filterList = Data.rows
          console.log('datarows', Data.rows)
          this.listLoading = false
        })
      },
      // 页面加载请求 tabTitle 数据条数
      handleTabRequest(index, length) {
        SearchHousePerfectCount({
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
        SearchHousePerfectCount({
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
        return SearchHousePerfect({
          pageParam: pages,
          UserName: '',
          FullID: '',
          FullIDNew: this.ruleForm.FullID,
          Type: this.tabTitle
        }).then(({ Data }) => {
          console.log('房源数据', Data)
          this.searchCount = Data.records
          this.filterList = Data.rows
          this.listLoading = false
          return Data
        })
        .catch(() => {
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
        SearchHousePerfect({
          pageParam: this.params,
          UserName: '',
          FullID: '',
          FullIDNew: this.ruleForm.FullID,
          Type: this.tabTitle
        }).then(response => {
          console.log('response', response.Data)
          this.listLoading = false
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['房源名称', '管房人', '所属组织', '房源编号']
            const filament = ['HouseName', 'UserName', 'CompanyName', 'HouseCode']
            const data = this.formatJson(filament, !response.Data ? [] : response.Data.rows)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '房源'
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
