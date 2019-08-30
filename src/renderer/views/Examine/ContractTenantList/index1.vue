<template>
  <div class="app-container data-list">
    <el-tabs v-model="tabKey" @tab-click="handleClick">
        <el-tab-pane 
        v-for="title in header"
        :label="title.title" 
        :name="title.key" 
        :key="title.key">
    </el-tab-pane>
    </el-tabs>
    
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
          <el-form-item label="门店" prop="FullID">
            <select-store ref="selectStore" type="report" @change="handleStoreChange"></select-store>
          </el-form-item>
        <!-- <el-form-item label="管房人" prop="HouseName">
          <el-input v-model="ruleForm.HouseName" placeholder="输入姓名/电话"></el-input>
        </el-form-item> -->
    
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
            <el-table-column
            prop="HouseName"
            align="center"
            label="房源名称"
            min-width="130">
            </el-table-column>
            <el-table-column
            prop="TubehouseName"
            align="center"
            label="管房人"
            min-width="130">
            </el-table-column>
            <el-table-column
            prop="CompanyName"
            align="center"
            min-width="130"
            label="所属门店">
            </el-table-column>
            <el-table-column
            prop="ContractNumber"
            align="center"
            min-width="130"
            label="合同编号">
            </el-table-column>
            <el-table-column
            prop="ClientName"
            align="center"
            min-width="130"
            label="租客">
            </el-table-column>
        </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :checkedLength="tableSelected.length"
      :page-size="pageSize"
      :handlePageChange="fetchData"
    >
    </bottom-tool-bar>
    <!-- <settlement ref="settlement" :bus-type="0" @success="checkOutSuccess"></settlement> -->
  </div>
</template>
<style scoped lang="scss">
  @import "style";
</style>
<script>
  import { QueryExpiredTenantWithoutCheckOut } from '@/api/owner'
  import { BottomToolBar, SearchPanel, Settlement, TableButtons, SelectStore } from '../../../components'
  // import { diffTime } from '../../../utils/dateFormat'

  export default {
    name: 'ContractTenantList',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      Settlement,
      SelectStore
    },
    data() {
      return {
        list: [],
        filterList: [],
        listLoading: true,
        tableSelected: [],
        pageSize: 10,
        ruleForm: {
          FullID: ''
        },
        activeName: 'first',
        //
        receiveOverdue: '收租逾期',
        tabKey: 'first',
        header: [
            { title: '到期未退房', key: 'first' }
            // { title: '未审核', key: 'second' },
            // { title: '付款逾期', key: 'third' },
            // { title: '未开付款单', key: 'four' },
            // { title: '付款单未核销', key: 'five' }
        ]
      }
    },
    computed: {

    },
    created() {
      //
    //   for (let i = 0; i < this.header.length; i++) {
    //       if (this.header[i].key === 'first') {
    //           this.header[i].title = ' 收租逾期 ' + '(' + this.xxxx + ')'
    //       } else if (this.header[i].key === 'second') {
    //           this.header[i].title = '未审核' + '(' + this.xxxx + ')'
    //       } else if (this.header[i].key === 'third') {
    //           this.header[i].title = '付款逾期' + '(' + this.xxxx + ')'
    //       } else if (this.header[i].key === 'four') {
    //           this.header[i].title = '未开付款单' + '(' + this.xxxx + ')'
    //       } else if (this.header[i].key === 'five') {
    //           this.header[i].title = '付款单未核销' + '(' + this.xxxx + ')'
    //       }
    //   }
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    methods: {
      // tab点击回调事件
       handleClick(tab, event) {
        console.log(tab, event)
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
        return QueryExpiredTenantWithoutCheckOut({
              parm: pages,
              FullID: this.ruleForm.FullID
          }).then(({ Data }) => {
              this.filterList = Data.rows
              this.header[0].title = this.header[0].title + '(' + Data.records + ')'
              this.listLoading = false
              return Data
          })
          .catch(() => {
            this.listLoading = false
          })
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
        this.$refs.selectStore.reset()
        // 页面刷新
        this.$refs.bottomToolBar.search()
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
        QueryExpiredTenantWithoutCheckOut({
          // parm: pages,
          FullID: this.ruleForm.FullID,
          isAll: true
        }).then(response => {
          this.listLoading = false
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['房源名称', '管房人', '所属门店', '合同编号', '租客']
            const filament = ['HouseName', 'TubehouseName', 'CompanyName', 'ContractNumber', 'ClientName']
            const data = this.formatJson(filament, !response.Data ? [] : response.Data.rows)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '租客合同到期为退房'
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
