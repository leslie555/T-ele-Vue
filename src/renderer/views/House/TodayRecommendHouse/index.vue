<template>
  <div class="app-container data-list">
    <search-panel ref="searchForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
        <el-form-item label="房源名称" prop="HouseName">
          <el-input v-model="HouseName" placeholder="请输入房源名称"></el-input>
        </el-form-item>
        <!-- <SelectOrganization v-model="searchForm.FullIDNew"></SelectOrganization> -->
        <el-form-item label="区域" prop="CityCodeMark">
          <el-cascader
            expand-trigger="hover"
            :options="CityData"
            separator=""
            filterable
            v-model="area">
          </el-cascader>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="handleSet" >设置</el-button> 
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table :data="filterList" border fit height="100%" class="table-normal" v-loading.body="listLoading" element-loading-text="加载中">
        <el-table-column align="center" prop="HouseName" label="房源名称" min-width="130"></el-table-column>
        <el-table-column align="center" prop="Location" label="详细地址" min-width="180"></el-table-column>
        <el-table-column align="center" prop="CommunityName" label="所属区域" min-width="130"></el-table-column>
        <el-table-column align="center" prop="RentMoeny" label="出租价格" min-width="120"> </el-table-column>
        <el-table-column align="center" prop="Bonus" label="奖金" min-width="100"> </el-table-column>
        <el-table-column align="center"  label="操作" min-width="130">
          <template slot-scope="scope">
            <table-buttons
              :options="operationButton"
              :condition="handleOpration(scope.row)"
              @handleHouseDetailClick="handleHouseDetail(scope.row, scope.$index)"
              @handleSignClick="handleSign(scope.row, scope.$index)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="PageSize"
      :handlePageChange="fetchData"
    ></bottom-tool-bar>
    <setRecommendHouse  ref="setHouse" @refetch="fetchData"></setRecommendHouse>
  </div>
</template>
<script>
  import {
    BottomToolBar,
    SearchPanel,
    TableButtons
    } from '../../../components'
  import SelectOrganization from '@/components/SelectOrganization'
  import { CityData } from '../../../utils/CityData'
  import setRecommendHouse from './components/setRecommendHouse'
  import { ShowTodayRecommendHouse } from '../../../api/house'
  export default {
    name: 'TodayRecommendHouse',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      SelectOrganization,
      setRecommendHouse
    },
    data() {
      return {
        listLoading: false, // 请求列表loading
        filterList: [],
        CityData,
        PageSize: 10,
        // 搜索条件
        HouseName: '',
        CityCode: '',
        area: [],
        operationButton: [
          {
            key: 'HouseDetail',
            value: '房源详情',
            type: 'primary',
            size: 'mini'
          },
          {
            key: 'Sign',
            value: '签约',
            type: 'primary',
            size: 'mini'
          }
        ]
      }
    },
    activated() {
      this.$refs.bottomToolBar.search(1) // 通过search调用fetchData
    },
    methods: {
      // 跳转房源详情界面
      handleHouseDetail(data, index) {
        this.$router.push({
          path: '/House/HouseInfo',
          query: {
            HouseKey: data.HouseKey
          }
        })
      },
      // 签约
      handleSign(data, index) {
        this.$router.push({
          path: '/Tenant/AddContract'
        })
      },
      // 默认加载页面查询数据方法
      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.PageSize,
            page: 1
          }
        }
        this.listLoading = true
        this.CityCode = this.area[2]
        return ShowTodayRecommendHouse({
          parm: pages,
          CityCode: this.CityCode,
          HouseName: this.HouseName
        }).then(({ Data }) => {
          this.listLoading = false
          if (Data.rows && Data.rows.length > 0) {
            this.filterList = Data.rows
          }
          return Data
        })
      },
      // 操作按钮
      handleOpration(item) {
        item.Operation = ['HouseDetail', 'Sign']
        return item.Operation
      },
      // 根据筛选条件查询列表
      submitForm() {
        this.$refs.bottomToolBar.search()
      },
      // 点击重置按钮
      resetForm() {
        this.HouseName = ''
        this.area = []
        this.$refs.bottomToolBar.search()
      },
      handleSet() {
        this.$refs.setHouse.open()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/mixin.scss";
</style>
