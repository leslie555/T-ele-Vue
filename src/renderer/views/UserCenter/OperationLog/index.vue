<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px">
      <template slot="search">
        <el-form-item label="关键字" prop="Crux">
          <el-input
            v-model="ruleForm.Crux"
            autocomplete="off"
            placeholder="请输入操作人姓名/联系方式" style="width: 320px"></el-input>
        </el-form-item>
      </template>
      <template slot="more">
        <div class="clearfix">
          <el-form-item label="操作时间" prop="OperationDate">
            <el-date-picker
              v-model="ruleForm.OperationDate"
              type="daterange"
              align="right"
              unlink-panels
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="所属分店" prop="CompanyID">
            <el-select v-model="ruleForm.CompanyID" placeholder="请选择">
              <el-option label="全部" value="0"></el-option>
              <el-option
                v-for="item in branchOffice"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作类型" prop="BusType">
            <el-select v-model="ruleForm.BusType" placeholder="请选择">
              <el-option label="全部" value="0"></el-option>
              <el-option
                v-for="item in BusType"
                :key="item.Value"
                :label="item.Description"
                :value="item.Value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </template>
      <template slot="button">
        <el-button
          class="search-button"
          type="primary"
          @click="operationLogSearch()">查询
        </el-button>
        <el-button
          class="reset-button"
          type="primary"
          @click="keywordReset()">重置
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
                class="table-normal"
                highlight-current-row>
        <el-table-column align="center" label="所属分店" fixed="left" width="230" prop="CompanyName">
        </el-table-column>
        <el-table-column align="center" label="操作者类别" min-width="100" prop="ModifyUserType">
        </el-table-column>
        <el-table-column align="center" label="操作人" min-width="100" prop="UserName">
        </el-table-column>
        <el-table-column align="center" label="联系方式" min-width="120" prop="UserPhone">
        </el-table-column>
        <el-table-column align="center" label="操作类型" min-width="100" prop="BusType">
        </el-table-column>
        <el-table-column align="center" label="操作内容" min-width="80" prop="OperationContent">
        </el-table-column>
        <el-table-column align="center" label="操作时间" fixed="right" min-width="100" prop="OperationTime">
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData">
    </bottom-tool-bar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { SelectBusinessDepList, ShowOperationMsg } from '../../../api/usercenter'
  import { SearchPanel, BottomToolBar } from '../../../components/'
  import { dateFormat } from '../../../utils/dateFormat'

  export default {
    name: 'OperationLog',
    components: {
      SearchPanel,
      BottomToolBar
    },

    data() {
      return {
        operationDate: '',
        branchOffice: [],
        listLoading: false,
        detailData: [],
        pageSize: 10,
        ruleForm: {
          Crux: '',
          OperationDate: ['', ''],
          CompanyID: '0',
          BusType: '0'
        },
        list: [],
        filterList: []
      }
    },

    created() {
      this.getStores()
    },

    computed: {
      ...mapGetters([
        'userinfo'
      ]),
      BusType() {
        return this.$EnumData.getEnumListByKey('BusType')
      }
    },

    activated() {
      this.$refs.bottomToolBar.search(1)
    },

    methods: {
      // 根据登录用户企业ID获取分店
      getStores() {
        const postData = { 'BusinessID': this.userinfo.BusinessID, 'Type': 2 }
        SelectBusinessDepList(postData).then(response => {
          this.branchOffice = response.Data.ComList.map(item => {
            return {
              label: item.CompanyName,
              value: item.KeyID
            }
          })
        })
      },

      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.listLoading = true
        if (!this.ruleForm.OperationDate) {
          this.ruleForm.OperationDate = []
        }
        return ShowOperationMsg({
          parm: pages,
          Crux: this.ruleForm.Crux,
          StartTime: this.$dateFormat(this.ruleForm.OperationDate[0], 'yyyy-MM-dd hh:mm:ss'),
          EndTime: this.$dateFormat(this.ruleForm.OperationDate[1], 'yyyy-MM-dd hh:mm:ss'),
          CompanyID: this.ruleForm.CompanyID,
          BusType: this.ruleForm.BusType
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
          CompanyName: item.CompanyName,
          BusType: this.$EnumData.getEnumDesByValue('BusType', item.BusType),
          UserName: item.UserName,
          UserPhone: item.UserPhone,
          ModifyUserType: this.$EnumData.getEnumDesByValue('ModifyUserType', item.ModifyUserType),
          OperationContent: item.OperationContent,
          OperationTime: dateFormat(item.OperationTime, 'yyyy-MM-dd hh:mm:ss')
        }
      },

      operationLogSearch() {
        this.$refs.bottomToolBar.search()
      },

      keywordReset() {
        this.$refs.ruleForm.resetFields()
        this.$refs.bottomToolBar.search()
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
