<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="私客" name="0">
        <div class="data-list data-list-tab-inline">
          <search-panel :model="searchForm_Self" ref="ruleForm_Self" label-width="80px">
            <template slot="search">
              <el-form-item label="关键字">
                <el-input
                  v-model="searchForm_Self.KeyWord"
                  autocomplete="off"
                  placeholder="租客姓名/电话/房源名称"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
            </template>
            <template slot="more">
              <el-form-item label="跟进人">
                <select-employee :canSelectDep="false" @empChange="getSelfPeople" allCompany>
                  <el-input
                    v-model="searchForm_Self.FollowUpName"
                    readonly
                    placeholder="请选择跟进人"
                    :maxlength="10"
                  ></el-input>
                </select-employee>
              </el-form-item>
              <el-form-item label="客户类型">
                <el-select v-model="searchForm_Self.ClientType" placeholder="请选择">
                  <el-option label="全部" value></el-option>
                  <el-option
                    v-for="item in options_Self"
                    :key="item.ClientValue"
                    :label="item.ClientLabel"
                    :value="item.ClientValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="期望区域">
                <el-cascader
                  :options="CityData"
                  ref='cascaderPrivate'
                  @change="handleChange('cascaderPrivate')"
                  v-model="searchForm_Self.RegionStr"
                  :props="defaultOptions"
                  clearable
                  expand-trigger="hover"
                  separator
                  filterable
                  style="width: 280px;"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="跟进时间">
                <el-date-picker
                  v-model="searchForm_Self.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  :default-time="['00:00:00', '23:59:59']"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 300px"
                ></el-date-picker>
              </el-form-item>
            </template>
            <template slot="button">
              <el-button type="primary" @click="searchSelf">查询</el-button>
              <el-button type="primary" @click="resetSelf">重置</el-button>
              <el-button type="primary" @click="openAddFormSelf" v-setbtn:Add>新增</el-button>
            </template>
          </search-panel>
          <div class="panel data-list-table">
            <el-table
              :data="filterSelfTableData"
              v-loading.body="listLoading"
              element-loading-text="加载中"
              border
              fit
              height="100%"
              class="table-normal"
            >
              <el-table-column label="客户类型" fixed="left" align="center" width="100">
                <template slot-scope="scope">
                  <span
                    :style="{color: colorList[parseInt(scope.row.ClientType)]}"
                  >{{ typeList[parseInt(scope.row.ClientType)] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="租客信息" align="center" min-width="140">
                <template slot-scope="scope">
                  <div>{{scope.row.TenantName}}</div>
                  <div>{{scope.row.TenantTel}}</div>
                </template>
              </el-table-column>
              <el-table-column label="期望租金" align="center" min-width="120">
                <template slot-scope="scope">
                  <div>{{scope.row.MinExpectedRent}}-{{scope.row.MaxExpectedRent}}</div>
                </template>
              </el-table-column>
              <el-table-column label="期望区域" align="center" prop="RegionName" min-width="160"></el-table-column>
              <el-table-column label="跟进时间" align="center" prop="FollowUpTime" min-width="120"></el-table-column>
              <el-table-column label="跟进方式" prop="FollowUpType" align="center" min-width="80"></el-table-column>
              <el-table-column label="跟进人" prop="UserName" align="center" min-width="80"></el-table-column>
              <el-table-column label="操作" align="center" width="400" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="openViewForm(scope.row)"
                    v-setbtn:details
                  >详情</el-button>
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="openFollowForm(scope.row)"
                    v-setbtn:follow
                  >跟进</el-button>
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="openAssignForm(scope.row)"
                    v-setbtn:pointOne
                  >指派</el-button>
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="openEditForm(scope.row)"
                    v-setbtn:edit
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    plain
                    size="mini"
                    @click="deleteTenantResource(scope.row)"
                    v-setbtn:delete
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <bottom-tool-bar
            class="pager-div"
            ref="bottomToolBar_Self"
            :page-size="pageSize"
            :handlePageChange="selfFetchData"
          ></bottom-tool-bar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="公客" name="1">
        <div class="data-list data-list-tab-inline">
          <search-panel :model="searchForm_Pub" ref="ruleForm_Pub" label-width="80px">
            <template slot="search">
              <el-form-item label="关键字">
                <el-input
                  v-model="searchForm_Pub.KeyWord"
                  autocomplete="off"
                  placeholder="租客姓名/电话/房源名称"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
            </template>
            <template slot="more">
              <el-form-item label="跟进人">
                <select-employee :canSelectDep="false" @empChange="getPubPeople" allCompany>
                  <el-input
                    v-model="searchForm_Pub.FollowUpName"
                    readonly
                    placeholder="请选择跟进人"
                    :maxlength="10"
                  ></el-input>
                </select-employee>
              </el-form-item>
              <el-form-item label="期望区域">
                <el-cascader
                  :options="CityData"
                  v-model="searchForm_Pub.RegionStr"
                  ref='cascaderpublic'
                  @change="handleChange('cascaderpublic')"
                  :props="defaultOptions"
                  clearable
                  expand-trigger="hover"
                  separator
                  filterable
                  style="width: 280px;"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="跟进时间">
                <el-date-picker
                  v-model="searchForm_Pub.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  :default-time="['00:00:00', '23:59:59']"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 300px"
                ></el-date-picker>
              </el-form-item>
            </template>
            <template slot="button">
              <el-button type="primary" @click="searchPub">查询</el-button>
              <el-button type="primary" @click="resetPub">重置</el-button>
            </template>
          </search-panel>
          <div class="panel data-list-table">
            <el-table
              :data="filterPubTableData"
              v-loading.body="listLoading"
              element-loading-text="加载中"
              border
              fit
              height="100%"
              class="table-normal"
            >
              <el-table-column label="租客信息" fixed="left" align="center" width="140">
                <template slot-scope="scope">
                  <div>{{scope.row.TenantName}}</div>
                  <div>{{scope.row.TenantTel}}</div>
                </template>
              </el-table-column>
              <el-table-column label="期望租金" align="center" min-width="100">
                <template slot-scope="scope">
                  <div>{{scope.row.MinExpectedRent}}-{{scope.row.MaxExpectedRent}}</div>
                </template>
              </el-table-column>
              <el-table-column label="期望区域" align="center" prop="RegionName" min-width="160"></el-table-column>
              <el-table-column label="跟进时间" align="center" prop="FollowUpTime" min-width="120"></el-table-column>
              <el-table-column label="跟进方式" prop="FollowUpType" align="center" min-width="80"></el-table-column>
              <el-table-column label="跟进人" prop="UserName" align="center" min-width="80"></el-table-column>
              <el-table-column label="操作" align="center" width="480" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="openViewForm(scope.row)"
                    v-setbtn:details
                  >详情</el-button>
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="openFollowForm(scope.row)"
                    v-setbtn:follow
                  >跟进</el-button>
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="openAssignForm(scope.row)"
                    v-setbtn:pointOne
                  >指派</el-button>
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="openEditForm(scope.row)"
                    v-setbtn:edit
                  >编辑</el-button>
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="toggleTenantType(scope.row)"
                    v-setbtn:toSelf
                  >转为私客</el-button>
                  <el-button
                    type="danger"
                    plain
                    size="mini"
                    @click="deleteTenantResource(scope.row)"
                    v-setbtn:delete
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <bottom-tool-bar
            class="pager-div"
            ref="bottomToolBar_Pub"
            :page-size="pageSize"
            :handlePageChange="pubFetchData"
          ></bottom-tool-bar>
        </div>
      </el-tab-pane>
    </el-tabs>
    <edit-tenant-info ref="R_EditTenant" @AddNewData="AddNewData" @EditNewData="EditNewData"></edit-tenant-info>
    <view-tenant-info ref="R_ViewTenant"></view-tenant-info>
    <follow-tenant-info ref="R_FollowTenant" @AddFollowData="AddFollowData"></follow-tenant-info>
    <assign-form ref="R_AssignForm" @AddAssignData="AddAssignData"></assign-form>
  </div>
</template>

<script>
  import { SearchPanel, BottomToolBar } from '@/components'
  import SelectEmployee from '@/components/SelectEmployee'
  import { CityData, getCityNameByCode } from '@/utils/CityData'
  import { ShowTenantResourcesList, DelTenantResources, ChangeTenantPubOrPrivate } from '../../../api/resource'
  import { EditTenantInfo, ViewTenantInfo, FollowTenantInfo, AssignForm } from './components'

  export default {
    name: 'R_Tenant',
    components: {
      SearchPanel,
      BottomToolBar,
      SelectEmployee,
      EditTenantInfo,
      ViewTenantInfo,
      FollowTenantInfo,
      AssignForm
    },
    data() {
      return {
        defaultOptions: {
          checkStrictly: true
        },
        activeName: '0',
        CityData,
        pageSize: 10,
        listLoading: false,
        // 私客
        colorList: ['#ff5a5a', '#389ef2', '#f3da4e'],
        typeList: ['A类', 'B类', 'C类'],
        selfTableData: [],
        filterSelfTableData: [],
        searchForm_Self: {
          KeyWord: '',
          RegionStr: [],
          FollowUpStartTime: '',
          FollowUpEndTime: '',
          PubOrPrivate: '1',
          FollowUpID: '',
          ClientType: '',
          date: ['', ''],
          FollowUpName: ''
        },
        options_Self: [
          {
            ClientLabel: 'A类',
            ClientValue: '0'
          },
          {
            ClientLabel: 'B类',
            ClientValue: '1'
          },
          {
            ClientLabel: 'C类',
            ClientValue: '2'
          }
        ],
        // 公客
        pubTableData: [],
        filterPubTableData: [],
        searchForm_Pub: {
          KeyWord: '',
          FollowUpName: '',
          RegionStr: [],
          FollowUpStartTime: '',
          FollowUpEndTime: '',
          PubOrPrivate: '0',
          FollowUpID: '',
          date: ['', ''],
          ClientType: '3' // 0:A类  1:B类  2:C类  3:D类
        }
      }
    },
    methods: {
      // 新增（仅私客）
      openAddFormSelf() {
        const data = {
          // KeyWord: '',
          // Region: [],
          // FollowUpStartTime: '',
          // FollowUpEndTime: '',
          // PubOrPrivate: '1',
          // FollowUpID: '',
          // ClientType: '',
          // date: ['', ''],
          // FollowUpName: ''
        }
        const type = 1
        this.$refs.R_EditTenant.open(type, data)
      },
      // 编辑弹窗
      openEditForm(data) {
        let obj = {}
        if (this.activeName === '1') {
          obj = this.filterPubTableData.find(item => {
            return item.KeyID === data.KeyID
          })
        } else {
          obj = this.filterSelfTableData.find(item => {
            return item.KeyID === data.KeyID
          })
        }
        const type = 0
        this.$refs.R_EditTenant.open(type, obj)
      },
      // 详情弹窗
      openViewForm(data) {
        let obj = {}
        if (this.activeName === '1') {
          obj = this.filterPubTableData.find(item => {
            return item.KeyID === data.KeyID
          })
        } else {
          obj = this.filterSelfTableData.find(item => {
            return item.KeyID === data.KeyID
          })
        }
        this.$refs.R_ViewTenant.open(obj)
      },
      // 跟进弹窗
      openFollowForm(data) {
        this.$refs.R_FollowTenant.open(data.KeyID)
      },
      // 指派弹窗
      openAssignForm(data) {
        this.$refs.R_AssignForm.open(data.KeyID)
      },
      // 新增租客回调
      AddNewData(data) {
        if (data) {
          data = {
            ...data,
            ClientType: '0',
            FollowUpTime: data.FollowUp.FollowUpTime,
            Type: data.FollowUp.Type,
            UserName: data.FollowUp.UserName
          }
          this.filterSelfTableData.unshift(this.selfFilterTableDataItem(data))
        }
      },
      // 编辑租客回调
      EditNewData(data) {
        let newData = {
          KeyID: data.KeyID,
          TenantName: data.TenantName,
          TenantTel: data.TenantTel,
          RegionStr: data.RegionStr,
          RegionName: this.getCityName(data.RegionStr),
          MinExpectedRent: data.MinExpectedRent,
          MaxExpectedRent: data.MaxExpectedRent,
          FollowUpTime: data.FollowUpTime ? this.$dateFormat(data.FollowUpTime, 'yyyy-MM-dd') : '',
          FollowUpType: data.FollowUpType,
          UserName: data.UserName,
          TenantSex: data.TenantSex,
          AgeGroup: data.AgeGroup,
          LiveType: data.LiveType,
          LiveTime: data.LiveTime,
          LeaseTerm: data.LeaseTerm,
          Remarks: data.Remarks
        }
        // 区分公客和私客
        if (this.activeName === '1') {
          const CurIndex = this.filterPubTableData.findIndex(item => {
            return item.KeyID === data.KeyID
          })
          this.$set(this.filterPubTableData, CurIndex, newData)
        } else {
          const CurIndex = this.filterSelfTableData.findIndex(item => {
            return item.KeyID === data.KeyID
          })
          newData = {
            ...newData
            // ClientType: this.getClientType(data.PrivateGuestTime)// 根据成为私客时间计算客户类型
          }
          this.$set(this.filterSelfTableData, CurIndex, newData)
        }
      },
      // 添加跟进回调
      AddFollowData(data) {
        // 区分公客和私客
        if (this.activeName === '1') {
          this.filterPubTableData.forEach(item => {
            if (data.ResourcesID === item.KeyID) {
              item.FollowUpTime = data.FollowUpTime
              item.FollowUpType = this.$EnumData.getEnumDesByValue('FollowUpMode', data.Type)
              item.UserName = data.UserName
            }
          })
        } else {
          this.filterSelfTableData.forEach(item => {
            if (data.ResourcesID === item.KeyID) {
              item.FollowUpTime = data.FollowUpTime
              item.FollowUpType = this.$EnumData.getEnumDesByValue('FollowUpMode', data.Type)
              item.UserName = data.UserName
            }
          })
        }
      },
      // 指派回调
      AddAssignData(data) {
        // const date = new Date()
        // 区分公客和私客
        if (this.activeName === '1') {
          const curIndex = this.filterPubTableData.findIndex(item => {
            return data.ProfessionID === item.KeyID
          })
          const item = this.filterPubTableData[curIndex]
          // item.PrivateGuestTime = this.$dateFormat(date, 'yyyy-MM-dd hh:mm:ss')
          // item.ClientType = this.getClientType(item.PrivateGuestTime)
          item.ClientType = '0'
          this.filterSelfTableData.push(item)
          this.filterPubTableData.splice(curIndex, 1)
        } else {
          this.filterSelfTableData.forEach(item => {
            if (data.ProfessionID === item.KeyID) {
              // item.PrivateGuestTime = this.$dateFormat(date, 'yyyy-MM-dd hh:mm:ss')
              // item.ClientType = this.getClientType(item.PrivateGuestTime)
              item.ClientType = '0'
            }
          })
        }
      },
      // 公客转私客
      toggleTenantType(data) {
        this.$confirm('确认将该客户转为私客?', '提示').then(() => {
          const postData = {
            //  0 转为私客
            State: 0,
            KeyID: data.KeyID
          }
          ChangeTenantPubOrPrivate(postData).then(() => {
            this.$message({
              type: 'success',
              message: '转为私客成功!'
            })
            const curIndex = this.filterPubTableData.findIndex(item => {
              return data.KeyID === item.KeyID
            })
            this.filterPubTableData.splice(curIndex, 1)
            // data.PrivateGuestTime = new Date()
            data.ClientType = '0'
            this.filterSelfTableData.unshift(data)
          })
        }).catch(() => {
        })
      },
      // 删除租客资源
      deleteTenantResource(data) {
        this.$confirm('确认删除该条信息?', '提示').then(() => {
          DelTenantResources({ keyID: data.KeyID }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            let curIndex = ''
            if (this.activeName === '1') {
              curIndex = this.filterPubTableData.findIndex(item => {
                return data.KeyID === item.KeyID
              })
              this.filterPubTableData.splice(curIndex, 1)
            } else {
              curIndex = this.filterSelfTableData.findIndex(item => {
                return data.KeyID === item.KeyID
              })
              this.filterSelfTableData.splice(curIndex, 1)
            }
          }).catch(() => {
          })
        })
      },
      // 根据regionStr获取城市名
      getCityName(regionStr) {
        if (!regionStr && regionStr.length <= 0) {
          return ''
        }
        return getCityNameByCode(regionStr)
      },
      // 私客
      selfFetchData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        if (!this.searchForm_Self.date) {
          this.searchForm_Self.date = []
        }
        return ShowTenantResourcesList({
          GridParam: pages,
          KeyWord: this.searchForm_Self.KeyWord,
          RegionStr: this.searchForm_Self.RegionStr,
          FollowUpStartTime: this.$dateFormat(this.searchForm_Self.date[0], 'yyyy-MM-dd hh:mm:ss'),
          FollowUpEndTime: this.$dateFormat(this.searchForm_Self.date[1], 'yyyy-MM-dd hh:mm:ss'),
          PubOrPrivate: this.searchForm_Self.PubOrPrivate, // 0公1私
          FollowUpID: this.searchForm_Self.FollowUpID,
          ClientType: this.searchForm_Self.ClientType
        }).then(res => {
          if (res) {
            this.selfTableData = res.Data.rows
            this.selfFilterTableData()
            return res.Data
          }
        }).catch(() => {

        })
      },
      selfFilterTableData() {
        this.filterSelfTableData = []
        this.selfTableData.map(item => {
          this.filterSelfTableData.push(this.selfFilterTableDataItem(item))
        })
      },
      selfFilterTableDataItem(item) {
        return {
          KeyID: item.KeyID,
          // PrivateGuestTime: item.PrivateGuestTime,
          // ClientType: this.getClientType(item.PrivateGuestTime), // 根据成为私客时间计算客户类型
          ClientType: item.ClientType, // 根据成为私客时间计算客户类型
          TenantName: item.TenantName,
          TenantTel: item.TenantTel,
          RegionStr: item.RegionStr,
          RegionName: this.getCityName(item.RegionStr),
          FollowUpTime: item.FollowUpTime ? this.$dateFormat(item.FollowUpTime, 'yyyy-MM-dd') : '',
          FollowUpType: this.$EnumData.getEnumDesByValue('FollowUpMode', item.Type),
          MinExpectedRent: item.MinExpectedRent,
          MaxExpectedRent: item.MaxExpectedRent,
          UserName: item.UserName,
          TenantSex: item.TenantSex,
          AgeGroup: item.AgeGroup,
          LiveType: item.LiveType,
          LiveTime: item.LiveTime,
          LeaseTerm: item.LeaseTerm,
          Remarks: item.Remarks
        }
      },
      getSelfPeople(val) {
        this.searchForm_Self.FollowUpName = val.UserName
        this.searchForm_Self.FollowUpID = val.KeyID
      },
      searchSelf() {
        this.$refs.bottomToolBar_Self.search()
      },
      resetSelf() {
        // 重置没效果
        this.searchForm_Self = {
          KeyWord: '',
          RegionStr: [],
          FollowUpStartTime: '',
          FollowUpEndTime: '',
          PubOrPrivate: '1',
          FollowUpID: '',
          ClientType: '',
          date: ['', ''],
          FollowUpName: ''
        }
        this.$refs.ruleForm_Self.resetFields()
        this.$refs.bottomToolBar_Self.search()
      },
      // 根据跟进时间获取客户类型
      // 客户类型：A类（3天以内）、B类（4-7天）、C类（8-15天），超过15天的私客会流入公客
      // calculateDiffDays(time) {
      //   let diffDays = 0
      //   const Date1 = this.$dateFormat(new Date(), 'yyyy-MM-dd hh:ss:mm')
      //   const Date2 = this.$dateFormat(time, 'yyyy-MM-dd hh:ss:mm')
      //   const dateSpan = new Date(Date1).getTime() - new Date(Date2).getTime()
      //   diffDays = Math.round(dateSpan / (24 * 3600 * 1000)) // 四舍五入取值
      //   return diffDays
      // },
      // getClientType(time) {
      //   const diffDays = this.calculateDiffDays(time)
      //   let clientTypeNum = 0
      //   if (diffDays <= 3) {
      //     clientTypeNum = 0
      //   }
      //   if (diffDays > 3 && diffDays <= 7) {
      //     clientTypeNum = 1
      //   }
      //   if (diffDays > 7 && diffDays <= 15) {
      //     clientTypeNum = 2
      //   }
      //   return clientTypeNum
      // },
      // 公客
      pubFetchData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        if (!this.searchForm_Pub.date) {
          this.searchForm_Pub.date = []
        }
        return ShowTenantResourcesList({
          GridParam: pages,
          KeyWord: this.searchForm_Pub.KeyWord,
          RegionStr: this.searchForm_Pub.RegionStr,
        FollowUpStartTime: this.searchForm_Pub.date[0] ? this.$dateFormat(this.searchForm_Pub.date[0], 'yyyy-MM-dd hh:mm:ss') : '',
        FollowUpEndTime: this.searchForm_Pub.date[1] ? this.$dateFormat(this.searchForm_Pub.date[1], 'yyyy-MM-dd hh:mm:ss') : '',
          PubOrPrivate: this.searchForm_Pub.PubOrPrivate, // 0公1私
          FollowUpID: this.searchForm_Pub.FollowUpID,
          ClientType: this.searchForm_Pub.ClientType
        }).then(res => {
          if (res) {
            this.pubTableData = res.Data.rows
            this.pubFilterTableData()
            return res.Data
          }
        }).catch(() => {

        })
      },
      pubFilterTableData() {
        this.filterPubTableData = []
        this.pubTableData.map(item => {
          this.filterPubTableData.push(this.pubFilterTableDataItem(item))
        })
      },
      pubFilterTableDataItem(item) {
        return {
          KeyID: item.KeyID,
          ClientType: '3',
          TenantName: item.TenantName,
          TenantTel: item.TenantTel,
          RegionStr: item.RegionStr,
          RegionName: this.getCityName(item.RegionStr),
        FollowUpTime: item.FollowUpTime ? this.$dateFormat(item.FollowUpTime, 'yyyy-MM-dd') : '',
          FollowUpType: item.Type ? this.$EnumData.getEnumDesByValue('FollowUpMode', item.Type) : '',
          MinExpectedRent: item.MinExpectedRent,
          MaxExpectedRent: item.MaxExpectedRent,
          UserName: item.UserName,
          TenantSex: item.TenantSex,
          AgeGroup: item.AgeGroup,
          LiveType: item.LiveType,
          LiveTime: item.LiveTime,
          LeaseTerm: item.LeaseTerm,
          Remarks: item.Remarks
        }
      },
      getPubPeople(val) {
        this.searchForm_Pub.FollowUpName = val.UserName
        this.searchForm_Pub.FollowUpID = val.KeyID
      },
      searchPub() {
        this.$refs.bottomToolBar_Pub.search()
      },
      resetPub() {
        // 重置没效果
        this.searchForm_Pub = {
          KeyWord: '',
          FollowUpName: '',
          RegionStr: [],
          FollowUpStartTime: '',
          FollowUpEndTime: '',
          PubOrPrivate: '0',
          FollowUpID: '',
          date: ['', ''],
          ClientType: '3' // 0:A类  1:B类  2:C类  3:D类
        }
        this.$refs.ruleForm_Pub.resetFields()
        this.$refs.bottomToolBar_Pub.search()
      },
      handleChange(name) {
        this.$refs[name].dropDownVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .data-list-tab-inline {
    top: 184px;
  }
</style>
