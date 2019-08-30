<template>
  <div class="data-list data-list-tab-inline">
    <search-panel :model="searchForm_Pub" ref="ruleForm" label-width="80px">
      <template slot="search">
        <el-form-item label="关键字">
          <el-input
            v-model="searchForm_Pub.KeyWord"
            autocomplete="off"
            placeholder="房源名称/房东电话"
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm_Pub.status" placeholder="请选择" style="width: 150px;">
            <el-option
              v-for="item in options_Pub"
              :key="item.StatusValue"
              :label="item.StatusLabel"
              :value="item.StatusValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域">
          <el-cascader
            :options="CityData"
            v-model="searchForm_Pub.city"
            expand-trigger="hover"
            separator
            filterable
            style="width: 200px;"
          ></el-cascader>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table
        :data="tableData"
        v-loading.body="listLoading"
        element-loading-text="加载中"
        border
        fit
        height="100%"
        class="table-normal"
      >
        <el-table-column label="房源名称" align="center" width="250">
          <template slot-scope="{ row }">
            {{ row.HouseName }}
          </template>
        </el-table-column>
        <el-table-column label="期望租金" align="center" prop="ExpectedRent" width="300"></el-table-column>
        <el-table-column label="地址" align="center" prop="DetailedAddress" width="400"></el-table-column>
        <el-table-column label="户型" align="center" width="180">
          <template slot-scope="scope">{{ `${scope.row.RoomCount}室${scope.row.HallCount}厅${scope.row.ToiletCount}卫` }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="220">
          <template slot-scope="{ row }">
            {{ row.IsSigned ? "已签约" : (row.IsProtection ? row.ProtectionDayTips : "可跟进") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center"  width="440">
          <template slot-scope="scope" v-if="!scope.row.IsSigned && !scope.row.IsProtection">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="changeSelf(scope.row, scope.$index)"
              v-setbtn:toSelf
            >转为私客</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      :renderFirst="firstRequest" 
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="fetchData"
      style="text-align: right"
    ></bottom-tool-bar>
  </div>
</template>

<script>
import { SearchPanel, BottomToolBar } from '@/components'
import { CityData } from '@/utils/CityData'
import { QueryOwnerHouseInfoList, OwnerChangePubOrPrivate } from '@/api/resource'

export default {
  name: 'PubTable',
  components: {
    SearchPanel,
    BottomToolBar
  },
  props: ['firstRequest'],
  data() {
    return {
      pageSize: 10,
      CityData,
      listLoading: false,
      isShowSelect: true,
      tableData: [],
      options_Pub: [
        {
          StatusLabel: '全部',
          StatusValue: 0
        },
        {
          StatusLabel: '保护期',
          StatusValue: 1
        },
        {
          StatusLabel: '可跟进',
          StatusValue: 2
        },
        {
          StatusLabel: '已签约',
          StatusValue: 3
        }
      ],
      searchForm_Pub: {
        KeyWord: '',
        status: '',
        city: [],
        EntranceType: 1
      }
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
      return QueryOwnerHouseInfoList({
        parm: pages,
        PubOrPrivate: 1,
        KeyWord: this.searchForm_Pub.KeyWord,
        EntranceType: this.searchForm_Pub.EntranceType,
        Region: this.searchForm_Pub.city.length > 0 ? this.searchForm_Pub.city[2] : '',
        Status: this.searchForm_Pub.status
      }).then(response => {
        if (response.Code === 0) {
          if (response.Data.rows) {
            this.tableData = response.Data.rows
          }
          this.listLoading = false
          return response.Data
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
          this.listLoading = false
      })
    },
    search() {
      this.$refs.bottomToolBar.search()
    },
    reset() {
      this.searchForm_Pub.KeyWord = ''
      this.searchForm_Pub.city = []
      this.searchForm_Pub.status = 0
      this.$refs.bottomToolBar.search()
    },
    changeSelf(data, index) {
      const self = this
      this.$confirm('是否转为私客?', '提示').then(() => {
        OwnerChangePubOrPrivate({ KeyID: data.KeyID }).then(res => {
          self.$message({
            type: 'success',
            message: '转为私客成功'
          })
          if (res.Data) {
           self.$emit('changeData', res.Data)
          }
        })
        self.tableData.splice(index, 1)
      })
    }
  }
}
</script>

<style lang="scss">
.data-list-tab-inline {
  top: 184px;
}
</style>
