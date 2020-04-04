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
        <!-- <el-form-item label="部门" prop="department">
            <select-store ref="selectStore" type="report" @change="handleStoreChange"></select-store>
        </el-form-item> -->
        <SelectOrganization type = 3 v-model="ruleForm.FullIDNew"></SelectOrganization>
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
            <el-table-column align="center"  label='产权面积' min-width="130" prop="RoomArea">
              <template slot-scope="scope">
                {{scope.row.RoomArea === 0 ? '' : scope.row.RoomArea}}
              </template>
            </el-table-column>
            <el-table-column align="center"  label='业务员' min-width="130" prop="Salesman"></el-table-column>
            <el-table-column align="center"  label='组织' min-width="130" prop="CompanyName"></el-table-column>
            <el-table-column align="center"  label='钥匙位置' min-width="130" prop="KeyLocation"></el-table-column>
            <el-table-column align="center"  label='提交时间' min-width="130" prop="CreaterTime"></el-table-column>
            <el-table-column align="center"  label='状态' min-width="130" prop="StatusName"></el-table-column>
            <el-table-column align="center"  label='备注' min-width="130" prop="BZ">
              <template slot-scope="scope">
                <span :title="scope.row.BZ" class="sangedian">{{ scope.row.BZ }}</span>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                fixed="right"
                label="操作"
                min-width="300">
                <!-- <template slot-scope="scope">
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
                </template> -->
                <template slot-scope="scope">
                  <table-buttons
                    :options="operation2button"
                    :condition="scope.row.Operation"
                    @handleDetailClick="handleDetail(scope.$index, scope.row)"
                    @handlereconnaissancClick="handleSurvey(scope.$index, scope.row, 1)"
                    @handleDecorateClick="handleSurvey(scope.$index, scope.row, 2)"
                    @handlepurchaseClick="handleSurvey(scope.$index, scope.row, 3)"
                    @handleDecoratecompleteClick="handleComplete(scope.$index, scope.row)"
                  ></table-buttons>
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
    .sangedian{
      overflow:hidden;
      word-break:keep-all;
      white-space:nowrap;
      text-overflow:ellipsis;
    }
</style>
<script>
  // import { SelectOwnExpNoCheck } from '@/api/owner'
  import { ShowRenovationApplyRecord, UpdateRenovationApplyStatus } from '@/api/purchase'
  import { BottomToolBar, SearchPanel, TableButtons, fixPurchaseSurver, SelectOrganization } from '../../../../components'
  export default {
    props: ['identify'],
    name: 'FixPurChase',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      fixPurchaseSurver,
      SelectOrganization
    },
    data() {
      return {
        list: [],
        filterList: [],
        listLoading: true,
        tableSelected: [],
        pageSize: 10,
        recordPage: null,
        ruleForm: {
          HouseName: '',
          Salesman: '',
          DepID: '',
          Status: '',
          department: '',
          FullIDNew: ''
        },
        procureList: [
            { value: '', label: '全部' },
            { value: 3, label: '待勘察' },
            { value: 4, label: '已勘察' },
            { value: 5, label: '装修中' },
            { value: 6, label: '装修结束' }
        ],
        operation2button: [
          {
            key: 'Detail',
            value: '详情',
            type: 'primary'
          },
          {
            key: 'reconnaissanc',
            value: '已勘察',
            type: 'primary'
          },
          {
            key: 'Decorate',
            value: '装修单',
            type: 'success'
          },
          {
            key: 'purchase',
            value: '采购单',
            type: 'success'
          },
          {
            key: 'Decoratecomplete',
            value: '装修完成',
            type: 'primary'
          }
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
        } else {
          this.recordPage = pages
        }
        this.listLoading = true
        return ShowRenovationApplyRecord({
              parm: pages,
              HouseName: this.ruleForm.HouseName,
              Salesman: this.ruleForm.Salesman,
              DepID: this.ruleForm.DepID,
              Status: this.ruleForm.Status,
              FullIDNew: this.ruleForm.FullIDNew,
              UsePage: 2
          }).then(({ Data }) => {
              const filterList = Data.rows
              filterList.forEach(val => {
                val.CreaterTime = this.$dateFormat(val.CreaterTime, 'yyyy-MM-dd')
                val.StatusName = val.Status === 0 ? '全部' : val.Status === 1 ? '暂存' : val.Status === 2 ? '待审批' : val.Status === 3 ? '待勘察' : val.Status === 4 ? '已勘察' : val.Status === 5 ? '装修中' : '装修结束'
              })
              this.filterTableData(filterList)
              this.filterList = filterList
              this.listLoading = false
              // 传给父组件的标识
              return Data
          })
          .catch(() => {
            this.listLoading = false
          })
      },
      filterTableData(filterList) {
        filterList.map(v => {
          let Operation = []
          if (v.Status === 1) {
            Operation = ['Detail']
          } else if (v.Status === 2) {
            Operation = ['Detail']
          } else if (v.Status === 3) {
            Operation = ['Detail', 'reconnaissanc']
          } else if (v.Status === 4) {
            Operation = ['Detail', 'Decorate', 'purchase']
          } else if (v.Status === 5) {
            Operation = ['Detail', 'Decorate', 'purchase', 'Decoratecomplete']
          } else if (v.Status === 6) {
            Operation = ['Detail', 'Decorate', 'purchase']
          }
          v.Operation = Operation
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
        this.ruleForm.DepID = ''
        // 清空数据
        this.$refs.ruleForm.resetFields()
        // 门店选择框重置
        this.ruleForm.FullIDNew = ''
        // 页面刷新
        this.$refs.bottomToolBar.search()
      },
      handleSurvey(index, row, num) {
          this.$refs.fixPurchaseSurver.open({
              survey: true,
              num: num,
              KeyID: row.KeyID,
              row: row
          })
      },
       handleDetail(index, row) {
          this.$router.push({
            path: '/FixPurchase/FixPurchaseDepartmentDetail',
            query: {
              purchaseOrfitment: 0,
              KeyID: row.KeyID
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
                    Status: 6,
                    HouseKey: row.HouseKey
                }).then(({ Data, BusCode, Msg }) => {
                    if (Data < 0) {
                      this.$message.error('采购单或者装修单未完成')
                    } else {
                      this.$message.success('提交成功!')
                      this.fetchData()
                    }
                }).catch(() => {
                    // this.$message.error('提交失败!')
                })
            })
      },
      // 模糊查询下拉框选择
      // handleSelect(val) {
      //   this.ruleForm.DepID = val.FullID
      // },
      // 模糊查询
      // querySearch(queryString, cb) {
      //   ShowOrganizationSmallList({
      //     Keyword: queryString
      //   }).then(({ Data, BusCode, Msg }) => {
      //     Data.forEach(val => {
      //       val.value = val.CompanyName
      //     })
      //     cb(Data)
      //   })
      // },
      watchSubmit(val) {
        console.log(val)
        this.fetchData(this.recordPage)
      }
      // 选择门店过后，返回来的数据
      // handleStoreChange(val) {
      //   // 选择门店后的回调
      //   if (val) {
      //     this.ruleForm.DepID = val.fullID
      //   } else {
      //     this.ruleForm.DepID = ''
      //   }
      // }
    }
  }
</script>
