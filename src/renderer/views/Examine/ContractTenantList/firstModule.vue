<template>
   <div class="app-container data-list modifyTop">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
        <SelectOrganization :type="3" v-model="ruleForm.FullIDNew"></SelectOrganization>
          <!-- <el-form-item label="门店" prop="FullIDNew">
            <select-store ref="selectStore" type="report" @change="handleStoreChange"></select-store>
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
                v-for="(item, index) in tableLabel"
                :key="index" 
                :prop="item.prop" 
                :min-width="item.width" 
                :label="item.label">
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
  import { BottomToolBar, SearchPanel, Settlement, TableButtons, SelectOrganization } from '../../../components'
  export default {
    props: ['identify'],
    name: 'firstModuleTenant',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      Settlement,
      SelectOrganization
    },
    data() {
      return {
        list: [],
        filterList: [],
        listLoading: true,
        tableSelected: [],
        pageSize: 10,
        ruleForm: {
          FullIDNew: ''
        },
        tableLabel: [
            { label: '房源名称', width: '130', prop: 'HouseName' },
            { label: '管房人', width: '130', prop: 'phoneName' },
            { label: '组织', width: '130', prop: 'CompanyName' },
            { label: '合同编号', width: '130', prop: 'ContractNumber' },
            { label: '租客', width: '130', prop: 'ClientName' },
            { label: '到期时间', width: '130', prop: 'EndTime' }
        ]
      }
    },
    computed: {

    },
    created() {
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    methods: {
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
              FullIDNew: this.ruleForm.FullIDNew
          }).then(({ Data }) => {
              this.filterList = Data.rows
              this.filterList.forEach(val => {
                val.EndTime = this.$dateFormat(val.EndTime, 'yyyy-MM-dd')
                val.phoneName = val.TubehouseName + ' ' + val.TubehousePhone
              })
              this.listLoading = false
              // 传给父组件的标识
              this.$emit('changeRecords', Data, this.identify)
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
      //     this.ruleForm.FullIDNew = val.FullIDNew
      //   } else {
      //     this.ruleForm.FullIDNew = ''
      //   }
      // },
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
        this.ruleForm.FullIDNew = ''
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
          FullIDNew: this.ruleForm.FullIDNew,
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
