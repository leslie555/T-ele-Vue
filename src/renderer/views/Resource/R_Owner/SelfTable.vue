<template>
  <div class="data-list data-list-tab-inline">
    <search-panel :model="searchForm_Self" ref="ruleForm" label-width="80px">
      <template slot="search">
        <el-form-item label="关键字">
          <el-input
            v-model="searchForm_Self.KeyWord"
            autocomplete="off"
            placeholder="房源名称/房东姓名/房东电话"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm_Self.status" placeholder="请选择" style="width: 150px;">
            <el-option
              v-for="item in options_Self"
              :key="item.StatusValue"
              :label="item.StatusLabel"
              :value="item.StatusValue"
            ></el-option>
          </el-select>
        </el-form-item>        
        <el-form-item label="所属区域">
          <el-cascader
            :options="CityData"
            v-model="searchForm_Self.city"
            expand-trigger="hover"
            separator
            filterable
            style="width: 150px;"
          ></el-cascader>
        </el-form-item>        
      </template>
      <template slot="button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="primary" @click="openAddForm(1)" v-setbtn:Add>新增</el-button>
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
        <el-table-column label="房东信息" align="center"  width="200">
          <template slot-scope="{ row }">
           <p>{{ `${row.OwnerName} ${row.OwnerTel}` }} </p> 
            <!-- {{ `${row.OwnerTel}` }} -->
          </template>
        </el-table-column>
        <el-table-column label="期望租金" align="center" prop="ExpectedRent" width="200"></el-table-column>
        <el-table-column label="地址" align="center" prop="DetailedAddress" width="360"></el-table-column>
        <el-table-column label="户型" align="center" width="180">
          <template slot-scope="scope">{{ `${scope.row.RoomCount}室${scope.row.HallCount}厅${scope.row.ToiletCount}卫` }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.IsSigned ? "已签约" : (scope.row.IsProtection ? scope.row.ProtectionDayTips : null) }}
          </template>
        </el-table-column>                
        <el-table-column label="操作" align="center" width="420" fixed="right">
          <template slot-scope="scope">
            <template v-if="scope.row.IsSigned">
              <el-button type="primary" plain size="mini" @click="openDetail(scope.row)" v-setbtn:details>详情</el-button>
            </template>
            <template v-else>
              <el-button type="primary" plain size="mini" @click="toSignContract(scope.row.KeyID)">签约</el-button>
              <el-button type="primary" plain size="mini" @click="openAddForm(2, scope.row)" v-setbtn:edit>编辑</el-button>
              <el-button type="primary" plain size="mini" @click="openDetail(scope.row)" v-setbtn:details>详情</el-button>
              <el-button type="danger" plain size="mini" @click="DelListItem(scope.row.KeyID)" v-setbtn:delete>删除</el-button>
            </template>              
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="fetchData"
      style="text-align: right"
    ></bottom-tool-bar>
    <add-form ref="R_AddForm" @AddNewData="AddNewData" @EditNewData="EditNewData"></add-form>
    <owner-details ref="OwnerDetails"></owner-details>
  </div>
</template>

<script>
import { SearchPanel, BottomToolBar } from '@/components'
import { CityData, getCityNameByCode } from '@/utils/CityData'
import { QueryOwnerHouseInfoList, DelOwnerHouseInfo } from '@/api/resource'
import addForm from './components/addForm'
import OwnerDetails from './components/OwnerDetails'

export default {
  name: 'SelfTable',
  components: {
    SearchPanel,
    BottomToolBar,
    addForm,
    OwnerDetails
  },
  data() {
    return {
      pageSize: 10,
      CityData,
      listLoading: false,
      isShowSelect: true,
      tableData: [],
      options_Self: [
        {
          StatusLabel: '全部',
          StatusValue: 0
        },
        {
          StatusLabel: '保护期',
          StatusValue: 1
        },
        {
          StatusLabel: '已签约',
          StatusValue: 3
        }
      ],
      searchForm_Self: {
        KeyWord: '',
        date: '',
        status: '',
        city: [],
        EntranceType: 1
      }
    }
  },
  // created() {
  //   console.log(this.activeName, 'test  ')
  // },
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
        PubOrPrivate: 0,
        EntranceType: this.searchForm_Self.EntranceType,
        KeyWord: this.searchForm_Self.KeyWord,
        Region: this.searchForm_Self.city.length > 0 ? this.searchForm_Self.city[2] : '',
        status: this.searchForm_Self.status
      }).then(response => {
        if (response.Code === 0) {
          if (response.Data.rows) {
            this.tableData = response.Data.rows
          }
          this.listLoading = false
          return response.Data
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.listLoading = false
      })
    },
    getName(data) {
      return getCityNameByCode(data)
    },
    search() {
      //       console.log(11111)
      // this.$router.push({
      //   name: 'homePageContract'
      // })
      this.$refs.bottomToolBar.search()
    },
    reset() {
      this.searchForm_Self.KeyWord = ''
      this.searchForm_Self.city = []
      this.searchForm_Self.status = 0
      this.$refs.bottomToolBar.search()
    },
    openAddForm(type, data) {
      if (type === 1) {
        this.$refs.R_AddForm.open(type)
      } else {
        this.$refs.R_AddForm.open(type, data)
      }
    },
    openDetail(data) {
      this.$refs.OwnerDetails.open(data)
    },
    AddNewData(data) {
      this.tableData.unshift(data)
    },
    EditNewData(data) {
      const newData = this.$deepCopy(data)
      var CurIndex = 0
      this.tableData.forEach((ele, index) => {
        if (ele.KeyID === data.KeyID) {
          CurIndex = index
        }
      })
      this.$set(this.tableData, CurIndex, newData)
    },
    DelListItem(KeyID) {
      const self = this
      this.$confirm('确认去签约该条信息?', '提示').then(() => {
        DelOwnerHouseInfo({ KeyID }).then(res => {
          self.$message({
            type: 'success',
            message: '删除成功!'
          })
          var delIndex = 0
          self.tableData.forEach((ele, index) => {
            if (ele.KeyID === KeyID) {
              delIndex = index
            }
          })
          self.tableData.splice(delIndex, 1)
        }).catch(() => {
        })
      })
    },
    toSignContract(KeyID) {
      this.$router.push({
        path: '/Owner/AddContract',
        query: {
          EntranceID: KeyID
        }
      })
    },
    changeData(data) {
      if (data) {
        // console.log('data :', data)
        this.tableData.unshift(data)
      }
    }
  }
}
</script>

<style lang="scss">
.data-list-tab-inline {
  top: 184px;
}
</style>
