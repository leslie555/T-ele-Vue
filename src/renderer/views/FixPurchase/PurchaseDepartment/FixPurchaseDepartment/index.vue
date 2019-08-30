<template>
   <div class="app-container data-list modifyTop">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
          <el-form-item label="房源名称" prop="HouseName">
          <el-input
            placeholder="房源名称"
            v-model="ruleForm.HouseName"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>
         <el-form-item label="业务员" prop="Salesman">
          <el-input
            placeholder="姓名/电话"
            v-model="ruleForm.Salesman"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-autocomplete       
              class="inline-input"          
              v-model="ruleForm.department"         
              placeholder="请输入内容"     
              :fetch-suggestions="querySearch"       
              :trigger-on-focus="false"               
              @select="handleSelect"               
          >   
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="状态" prop="Status">
        <el-select v-model="ruleForm.Status" placeholder="请选择">
            <el-option
              v-for="item in procureList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
        </el-select>
        </el-form-item>
      </template>

      <template slot="button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
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
            <el-table-column align="center"  label='房源名称' min-width="130" prop="HouseName"></el-table-column>
            <el-table-column align="center"  label='地址' min-width="130" prop="Location"></el-table-column>
            <el-table-column align="center"  label='产权面积' min-width="130" prop="RoomArea"></el-table-column>
            <el-table-column align="center"  label='业务员' min-width="130" prop="Salesman"></el-table-column>
            <el-table-column align="center"  label='部门' min-width="130" prop="CompanyName"></el-table-column>
            <el-table-column align="center"  label='钥匙位置' min-width="130" prop="KeyLocation"></el-table-column>
            <el-table-column align="center"  label='提交时间' min-width="130" prop="CreaterTime"></el-table-column>
            <el-table-column align="center"  label='状态' min-width="130" prop="StatusName"></el-table-column>
            <el-table-column align="center"  label='备注' min-width="130" prop="BZ"></el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                min-width="300">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                    <el-button
                    size="mini"
                    type="primary"
                    v-if="scope.row.Status === 3"
                    plain
                    @click="handleSurvey(scope.$index, scope.row, 1)">已勘察</el-button>
                    <el-button
                    size="mini"
                    type="success"
                    v-if="scope.row.Status === 5 || scope.row.Status === 4 || scope.row.Status === 6"
                    plain
                    @click="handleSurvey(scope.$index, scope.row, 2)">装修单</el-button>
                    <el-button
                    size="mini"
                    type="success"
                    v-if="scope.row.Status === 5 || scope.row.Status === 4 || scope.row.Status === 6"
                    plain
                    @click="handleSurvey(scope.$index, scope.row, 3)">采购单</el-button>
                    <el-button
                    size="mini"
                    type="success"
                    v-if="scope.row.Status === 5"
                    plain
                    @click="handleComplete(scope.$index, scope.row)">装修完成</el-button>
                </template>
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
      <fixPurchaseSurver @watchSubmit='watchSubmit' ref="fixPurchaseSurver"></fixPurchaseSurver>
  </div>
</template>
<style scoped lang="scss">
  @import "style";
</style>
<script>
  // import { SelectOwnExpNoCheck } from '@/api/owner'
  import { ShowRenovationApplyRecord, UpdateRenovationApplyStatus, ShowOrganizationSmallList } from '@/api/purchase'
  import { BottomToolBar, SearchPanel, TableButtons, fixPurchaseSurver } from '../../../../components'
  export default {
    props: ['identify'],
    name: 'FixPurChase',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      fixPurchaseSurver
    },
    data() {
      return {
        list: [],
        filterList: [],
        listLoading: true,
        tableSelected: [],
        pageSize: 10,
        ruleForm: {
          HouseName: '',
          Salesman: '',
          DepID: '',
          Status: '',
          department: ''
        },
        procureList: [
            { value: '0', label: '全部' },
            { value: '3', label: '待勘察' },
            { value: '4', label: '已勘察' },
            { value: '5', label: '装修中' },
            { value: '6', label: '装修结束' }
        ]
      }
    },
    computed: {

    },
    created() {
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
        return ShowRenovationApplyRecord({
              parm: pages,
              HouseName: this.ruleForm.HouseName,
              Salesman: this.ruleForm.Salesman,
              DepID: this.ruleForm.DepID,
              Status: this.ruleForm.Status,
              UsePage: 2
          }).then(({ Data }) => {
              this.filterList = Data.rows
              this.filterList.forEach(val => {
                val.CreaterTime = this.$dateFormat(val.CreaterTime, 'yyyy-MM-dd')
                val.StatusName = val.Status === 0 ? '全部' : val.Status === 1 ? '暂存' : val.Status === 2 ? '待审批' : val.Status === 3 ? '待勘察' : val.Status === 4 ? '已勘察' : val.Status === 5 ? '装修中' : '装修结束'
              })
              this.listLoading = false
              // 传给父组件的标识
              return Data
          })
          .catch(() => {
            this.listLoading = false
          })
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
        // this.$refs.selectStore.reset()
        // 页面刷新
        this.$refs.bottomToolBar.search()
      },
      handleSurvey(index, row, num) {
          this.$refs.fixPurchaseSurver.open({
              survey: true,
              num: num,
              KeyID: row.KeyID
          })
      },
       handleDetail(index, row) {
          this.$router.push({
            path: '/FixPurchase/FixPurchaseDepartmentDetail',
            query: {
              purchaseOrfitment: 0,
              row: row
            }
          })
      },
       handleComplete(index, row) {
            this.$confirm('确定装修完成？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                UpdateRenovationApplyStatus({
                    KeyID: row.KeyID,
                    Status: 6
                }).then(({ Data, BusCode, Msg }) => {
                    this.$message.success('提交成功!')
                    this.fetchData()
                }).catch(() => {
                    this.$message.error('提交失败!')
                })
            })
      },
      // 模糊查询下拉框选择
      handleSelect(val) {
        this.ruleForm.DepID = val.FullID
      },
      // 模糊查询
      querySearch(queryString, cb) {
        ShowOrganizationSmallList({
          Keyword: queryString
        }).then(({ Data, BusCode, Msg }) => {
          Data.forEach(val => {
            val.value = val.CompanyName
          })
          cb(Data)
        })
      },
      watchSubmit(val) {
        console.log(val)
        this.fetchData()
      }
    }
  }
</script>
