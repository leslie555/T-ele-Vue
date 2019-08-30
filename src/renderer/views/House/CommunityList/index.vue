<template>
  <div class="app-container">
    <search-panel :model="CommunityForm" label-width="80px">
      <template slot="search">
        <el-form-item label="地区">
          <el-cascader v-model="CommunityForm.CityCode" expand-trigger="hover" clearable :options="CityData" separator=""
                       filterable style="width: 260px;"></el-cascader>
        </el-form-item>
        <el-form-item label="小区名称">
          <el-input v-model="CommunityForm.CommunityName" clearable></el-input>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="ClearData">重置</el-button>
      </template>
    </search-panel>
    <el-row class="panel">
      <el-table :data="tableData" border :header-cell-style="{background: '#F5FAFE'}">
        <el-table-column label="小区名称" width="220" prop="CommunityName" align="center" fixed="left"></el-table-column>
        <el-table-column label="详细地址" prop="Location" align="center"></el-table-column>
        <el-table-column label="所属区域" align="center" prop="CityName"></el-table-column>
        <el-table-column label="添加人" width="220" prop="CreaterName" align="center"></el-table-column>
        <el-table-column label="添加时间" width="220" align="center">
          <template slot-scope="scope">
            {{ $dateFormat(scope.row.CreaterTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" plain @click="EditFormOpen(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-row>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData"
                     style="text-align: right"></bottom-tool-bar>
    <edit-form ref="editForm" @SubmitEditForm="SubmitEditForm"></edit-form>
  </div>
</template>
<script>
  import BottomToolBar from '@/components/BottomToolBar'
  import { CityData, getCityNameByCode } from '../../../utils/CityData'
  import editForm from './components/editForm'
  import { ShowMCommunityInfo } from '@/api/house'
  import { SearchPanel } from '@/components'

  export default ({
    name: 'HouseCommunity',
    components: {
      BottomToolBar,
      editForm,
      SearchPanel
    },
    data() {
      return {
        pageSize: 10,
        listLoading: false,
        CityData,
        CommunityForm: {
          CityCode: ['', '', ''],
          CommunityName: ''
        },
        // 表格数据测试用
        tableData: []
      }
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
        return ShowMCommunityInfo({
          parm: pages,
          CityCode: this.CommunityForm.CityCode[2],
          CommunityName: this.CommunityForm.CommunityName
        }).then(response => {
          if (response.Code === 0) {
            this.listLoading = false
            this.tableData = response.Data.rows
            return response.Data
          }
        })
      },
      search() {
        this.$refs.bottomToolBar.search()
      },
      ClearData() {
        this.CommunityForm.CityCode = ['', '', '']
        this.CommunityForm.CommunityName = ''
        this.search()
      },
      GetCityName(data) {
        return getCityNameByCode(data)
      },
      EditFormOpen(data, index) {
        this.$refs.editForm.open(data)
      },
      SubmitEditForm(data) {
        const index = this.tableData.findIndex(v => v.KeyID === data.KeyID)
        const item = { ...this.tableData[index], ...data }
        this.tableData.splice(index, 1, item)
      }
    }
  })
</script>
<style lang='scss' scoped>
  .PaginationBox {
    text-align: center;
    margin-top: 40px;
  }
</style>
