<template>
  <div>
    <div class="app-container">
      <ul class="nav-list panel-style">
        <li 
          :class="index === activeIndex? 'active-li': ''"
          v-for="(nav, index) in NavList"
          :key="nav.key"
          @click="handleLiClick(index)"
        >{{nav.label}}</li>
      </ul>
      <div class="main">

        <!-- <router-view /> -->
        <div class="list1" v-if="this.subIndex === 0">
          <div class="label-num">
            <ol class="label-list">
              <li class="select-label">到期未退房（<span>25</span>）</li>
              <li>未审核（<span>15</span>）</li>
              <li>付款逾期（<span>2</span>）</li>
              <li>未开付款单（<span>8</span>）</li>
              <li>付款单未核销（<span>65</span>）</li>
            </ol>
          </div>
          <div class="search-list panel-style clearfix">
            <search-panel :model="searchForm" label-width="80px" >

              <template slot="search">
                <el-form-item label="门店" prop="FullID">
                  <select-store ref="selectStore" type="report" @change="changeStore"></select-store>
                </el-form-item>
                 <el-form-item label="管房人">
                    <el-input v-model="CalculateInfoForm.EmployeeName" style="width: 180px"></el-input>
                    <select-employee allCompany @empChange="getPeople" @dbClick="getPeople">
                      <el-button type="primary" @click="popoverVisible = true" size="mini">选择</el-button>
                    </select-employee>
                  </el-form-item>
              </template>
              <template slot="button">
                <el-button type="primary">查询</el-button>
                <el-button type="primary">重置</el-button>
                <!-- <el-button type="primary" @click="handleExport" v-setbtn:Export  :loading="downloadLoading" >导出</el-button> -->
              </template>
            </search-panel>
            <!-- 表格 start -->
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
            <!-- 表格 end -->
            </div>
          </div>
          <div class="list1" v-if="this.subIndex === 1">
            <div class="label-num">
              <ol class="label-list">
                <li class="select-label">到期未退房（<span>25</span>）</li>
                <li>未审核（<span>15</span>）</li>
                <li>收租逾期（<span>22</span>）</li>
                <li>未开收款单（<span>0</span>）</li>
                <li>收款单未核销（<span>15</span>）</li>
              </ol>
            </div>
          </div>
          <div class="list1" v-if="this.subIndex === 2">
            <div class="label-num">
              <ol class="label-list">
                <li class="select-label">待完善（<span>25</span>）</li>
                <li>带审核（<span>65</span>）</li>
                <li>无照片（<span>28</span>）</li>
              </ol>
            </div>
          </div>
          <div class="list1" v-if="this.subIndex === 3">
            <div class="label-num">
              <ol class="label-list">
                <li class="select-label">收款逾期（<span>25</span>）</li>
                <li class="select-label">付款逾期（<span>65</span>）</li>
                <li>收款单未核销（<span>15</span>）</li>
                <li>付款单未核销（<span>15</span>）</li>
              </ol>
            </div>
          </div>
      </div>

    </div>
    
    
  </div>
</template>

<script>
  import { SearchPanel, SelectStore, SelectEmployee, BottomToolBar } from '@/components'
  import { CityData } from '@/utils/CityData'
  // import { selectComAuthority } from '@/api/system'
  import { SelectOwnExpNoCheck } from '@/api/owner'
export default {
  name: 'MinistrySupervisionList',
  components: {
    SearchPanel,
    SelectStore,
    SelectEmployee,
    BottomToolBar
  },
  data() {
    return {
      searchForm: {
        keyword: ''
      },
      downloadLoading: false,
      listLoading: false,
      pageSize: 10,
      activeIndex: 0,
      subIndex: 0,
      filterList: [],
      // 公司数据
      companyList: [],
      // 城市数据
      CityData,
      // showList: false,
      isSearch: false,
      form: {
        Type: '0',
        FullID: '',
        CompanyID: ''
      },
      NavList: [
        {
          key: 0,
          label: '业主合同'
        },
        {
          key: 1,
          label: '租客合同'
        },
        {
          key: 2,
          label: '房源'
        },
        {
          key: 3,
          label: '财务'
        }
      ],
      ListItem: [],
      HouseListForm: {
        city: ['', '', '']
      },
      CalculateInfoForm: {
        KeyWord: '',
        FullIDNew: '',
        EmployeeName: ''
      },
      tableLabel: [
          { label: '房源名称', width: '130', prop: 'HouseName' },
          { label: '管房人', width: '130', prop: 'TubehouseName' },
          { label: '所属门店', width: '130', prop: 'CompanyName' },
          { label: '合同编号', width: '130', prop: 'ContractNumber' },
          { label: '业主', width: '130', prop: 'ClientName' }
      ]
    }
  },
  created() {
      // console.log(this.$router)
      this.fetchData()
  },
  mounted() {
  },
  methods: {
    handleLiClick(index) {
      this.subIndex = index
      console.log('subIndex', this.$route.name)
      // const arr = ['MinistryOwnerContract', 'MinistryTenantContract', 'MinistryHouseResources', 'MinistryFinance']
      // this.$router.push({
      //     path: `/Owner/MinistrySupervision/${arr[this.subIndex]}`
      // })
      this.activeIndex = index
    },
    changeStore(val) {
        this.form.FullID = val.fullID
    },
    fetchData(pages) {
      if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
      }
       this.listLoading = true
      SelectOwnExpNoCheck({
        parm: pages,
        FullID: this.form.FullID
      }).then(res => {
        this.companyList = res.rows
      })
    },
    getPeople(data) {
      this.CalculateInfoForm.FullIDNew = !data.FullIDNew ? data.FullID : data.FullIDNew
      this.CalculateInfoForm.EmployeeName = !data.UserName ? data.UserName : data.UserName
    },
    // 导出表格
    handleExport() {
      SelectOwnExpNoCheck({
        // parm: {
        //   size: this.records,
        //   page: 1
        // },
        // Type: this.OtherFrom.Type,
        // State: this.OtherFrom.State,
        isAll: true
      }).then(response => {
        if (response.Code === 0) {
          this.listLoading = false
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['房源名称', '管房人', '所属门店', '合同编号', '业主']
          const filament = ['HouseName', 'TubehouseName', 'CompanyName', 'ContractNumber', 'ClientName']
          const data = this.formatJson(filament, !response.Data ? [] : response.Data.rows)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '业绩报表'
            })
            this.downloadLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .app-container{
    padding:10px;
  }
  .main{
    height: 100vh;
    float: left;
    margin-left: 10px;
  }
  .nav-list{
    width: 220px;
    float: left;
    list-style: none;
    padding: 0;
    margin: 0;
    &>li{
      height: 70px;
      line-height: 70px;
      font-size: 14px;
      padding-left: 40px;
      color: #999;
      box-sizing: border-box;
      cursor: pointer;
    }
    &>li:hover{
      background-color: #f3f9fe;
    }
    &>.active-li{
      border-left: 5px solid #389ef2;
      color: #389ef2;
      background-color: #f3f9fe;
    }
  }
  .label-num{
    &>.label-list{
      list-style: none;
      cursor: pointer;
      &>li{
        float: left;
        padding: 0px 35px;
        font-size: 16px
      }
      .select-label{
        color: #389ef2;
        font-weight: bold;
      }
    }
  }
  .search-list{
    margin-top: 50px;
  }


  // 清浮动
  .clearfix::after{
    content: "";
    display: block;
    clear: both;
    height: 0;
    visibility: hidden;
  }
  // 浮动
  .float{
    float: left;
  }
  .panel-style{
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    transition: 0.3s;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
</style>
