<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px">
      <template slot="search">
        <el-form-item label="关键字" prop="Keyword">
          <el-input
            v-model="ruleForm.Keyword"
            autocomplete="off"
            placeholder="公司名称/联系人姓名/联系人电话"
            style="width: 340px">
          </el-input>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button
          class="search-button"
          type="primary"
          @click="companySearch()">查询
        </el-button>
        <el-button
          class="reset-button"
          type="primary"
          @click="companyReset()">重置
        </el-button>
        <el-button
          class="add-button"
          type="primary"
          v-setbtn:Add
          @click="companyAdd()">新增
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
                height="100%"
                class="table-normal">
        <el-table-column align="center" label='公司名称' fixed="left" width="200" prop="BusinessName">
        </el-table-column>
        <el-table-column align="center" label="地址" min-width="180" prop="CompanyAdress">
        </el-table-column>
        <el-table-column align="center" label="联系信息" min-width="120">
          <template slot-scope="scope">
            <div>{{scope.row.LinkManName}}</div>
            <div>{{scope.row.LinkManPhone}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合同有效期" min-width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.StartTime">{{$dateFormat(scope.row.StartTime)}}至{{$dateFormat(scope.row.EndTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="公司状态" min-width="80" prop="IsDisable">
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="380" prop="Operation">
          <template slot-scope="scope">
            <table-buttons
              :options="operationbutton"
              :condition="scope.row.Operation"
              @handleDeleteClick="handleDelete(scope.row)"
              @handleDetailClick="handleDetails(scope.row)"
              @handleEditClick="handleUpdate(scope.row)"
              @handleDisAbleClick="handleDisAble(scope.row)"
              @handleAbleClick="handleAble(scope.row)">
            </table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar class="pager-div" ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData">
    </bottom-tool-bar>
  </div>
</template>

<script>
  import { SearchPanel, TableButtons, BottomToolBar } from '../../../components/'
  import { showBusinessInfoPaging, delBusinessInfo, upeBusinessInfo } from '../../../api/admin'

  export default {
    name: 'CompanyInfo',
    components: {
      TableButtons,
      SearchPanel,
      BottomToolBar
    },

    data() {
      return {
        ruleForm: {
          Keyword: ''
        },
        listLoading: false,
        pageSize: 10,
        list: [],
        filterList: [],
        operationbutton: [
          {
            key: 'Delete',
            value: '删除',
            type: 'danger',
            size: 'mini'
          },
          {
            key: 'Detail',
            value: '详情',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Edit',
            value: '修改',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'DisAble',
            value: '禁用',
            type: 'danger',
            size: 'mini'
          },
          {
            key: 'Able',
            value: '启用',
            type: 'danger',
            size: 'mini'
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
        return showBusinessInfoPaging({
          parm: pages,
          Keyword: this.ruleForm.Keyword
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
          BusinessName: item.BusinessName,
          CompanyAdress: item.CompanyAdress,
          LinkManName: item.LinkManName,
          LinkManPhone: item.LinkManPhone,
          StartTime: item.StartTime,
          EndTime: item.EndTime,
          IsDisable: item.IsDisable ? '关闭' : '开启',
          Operation: this.getOpertaionArray(item)
        }
      },

      getOpertaionArray(companyObj) {
        const arr = ['Delete', 'Detail', 'Edit']
        companyObj.IsDisable ? arr.push('Able') : arr.push('DisAble')
        return arr
      },

      companySearch() {
        this.$refs.bottomToolBar.search()
      },

      companyReset() {
        this.$refs.ruleForm.resetFields()
        this.$refs.bottomToolBar.search()
      },

      companyAdd() {
        this.$router.push({ path: '/Admin/AddCompany' })
      },

      handleDelete(row) {
        this.$confirm('确认删除该企业?', '提示').then(() => {
          const postData = { 'KeyID': row.KeyID }
          delBusinessInfo(postData).then(() => {
            const index = this.filterList.findIndex(item => {
              return item.KeyID === row.KeyID
            })
            this.filterList.splice(index, 1)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      },

      handleDetails(row) {
        const query = { ID: row.KeyID, type: '1' }
        this.$router.push({
          path: '/Admin/ViewCompany', query
        })
      },

      handleUpdate(row) {
        const query = { ID: row.KeyID, type: '2' }
        this.$router.push({
          path: '/Admin/EditCompany', query
        })
      },

      handleDisAble(row) {
        // 弹框是否禁用企业
        const postData = { 'KeyID': row.KeyID, 'BusinessInfoType': true }
        upeBusinessInfo(postData).then(() => {
          const index = this.filterList.findIndex(item => {
            return item.KeyID === row.KeyID
          })
          this.$message({
            message: '关闭成功',
            type: 'success'
          })
          this.filterList[index].IsDisable = '关闭'
          this.filterList[index].Operation.splice(3, 1, 'Able')
        }).catch(() => {
          //
        })
      },

      handleAble(row) {
        const postData = { 'KeyID': row.KeyID, 'BusinessInfoType': false }
        upeBusinessInfo(postData).then(() => {
          const index = this.filterList.findIndex(item => {
            return item.KeyID === row.KeyID
          })
          this.$message({
            message: '开启成功',
            type: 'success'
          })
          this.filterList[index].IsDisable = '开启'
          this.filterList[index].Operation.splice(3, 1, 'DisAble')
        }).catch(() => {
          //
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
