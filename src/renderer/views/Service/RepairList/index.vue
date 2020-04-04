<template>
  <div class="repair-container">
    <div class="app-container data-list">
      <search-panel :model="searchForm" ref="ruleForm" label-width="80px">
        <template slot="search">
          <el-form-item label="关键字">
            <el-input class="search-input" v-model="searchForm.Crux" placeholder="请输入房源名称/租客姓名/电话"></el-input>
          </el-form-item>
        </template>
        <template slot="more">
          <div class="clearfix">
            <el-form-item label="所属分店">
              <el-select class="search-input" v-model="searchForm.CompanyID" clearable placeholder="请选择">
                <el-option
                  v-for="item in comList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提交时间">
              <div class="block">
                <el-date-picker
                  v-model="searchForm.dateValue"
                  type="daterange"
                  align="right"
                  :default-time="['00:00:00', '23:59:59']"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </div>
            </el-form-item>
          </div>
        </template>
        <template slot="button">
          <el-button class="search-button" type="primary" @click.prevent="submitSearch">查询</el-button>
          <el-button class="search-button" type="primary" @click.prevent="resetTable">重置</el-button>
          <el-button
            class="search-button"
            type="primary"
            v-setbtn:Add
            @click.prevent="showModal"
          >添加报修</el-button>
        </template>
      </search-panel>

      <div class="panel data-list-table table-expend">
        <el-table
          :data="filteredTableData"
          v-loading="listLoading"
          @row-dblclick="handleTableRowClick"
          ref="houseTable"
          element-loading-text="加载中"
          fit
          height="100%"
          class="table-normal"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand-form">
                <el-form-item label="房源名称">
                  <span>{{ props.row.houseName }}</span>
                </el-form-item>
                <el-form-item label="租客姓名">
                  <span>{{ props.row.tenantName||'无' }}</span>
                </el-form-item>
                <el-form-item label="租客电话">
                  <span>{{ props.row.tenantPhone||'无' }}</span>
                </el-form-item>
                <el-form-item label="维修金额">
                  <span>{{ props.row.RealPay||'无' }}</span>
                </el-form-item>
                <el-form-item label="维修方式">
                  <span>{{ props.row.repairType }}</span>
                </el-form-item>
                <el-form-item label="处理人">
                  <span>{{ props.row.CreaterName||'无' }}</span>
                </el-form-item>
                <el-form-item label="状态">
                  <span>{{ props.row.auditStatus }}</span>
                </el-form-item>
                <el-form-item label="提交时间">
                  <span>{{ props.row.CreaterTime }}</span>
                </el-form-item>
                <el-form-item label="收支时间">
                  <span>{{ props.row.receivablesDate }}</span>
                </el-form-item>
                <el-form-item label="收支类型">
                  <span>{{ getInOrOut(props.row.PayType) }}</span>
                </el-form-item>
                <el-form-item label="图片凭证">
                  <div class="table-expand-img-box" v-viewer="{url: 'data-src'}">
                    <template v-if="props.row.RepairMoenyPic.length">
                      <div
                        class="table-expand-img"
                        v-for="(item,index) in props.row.RepairMoenyPic"
                        :key="index"
                      >
                        <img
                          :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                          :data-src="$ImgUnit.getImgUrl(item.ImageLocation)"
                        >
                      </div>
                    </template>
                    <template v-else>无</template>
                  </div>
                </el-form-item>
                <el-form-item label="维修图片">
                  <div class="table-expand-img-box" v-viewer="{url: 'data-src'}">
                    <template v-if="props.row.RepairPic.length">
                      <div
                        class="table-expand-img"
                        v-for="(item,index) in props.row.RepairPic"
                        :key="index"
                      >
                        <img
                          :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                          :data-src="$ImgUnit.getImgUrl(item.ImageLocation)"
                        >
                      </div>
                    </template>
                    <template v-else>无</template>
                  </div>
                </el-form-item>
                <el-form-item label="报修内容">
                  <span>{{ props.row.repairContent }}</span>
                </el-form-item>
                <el-form-item label="备注">
                  <span>{{ props.row.repairRemark }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="houseName" label="房源名称" sortable align="center" min-width="160"></el-table-column>
          <el-table-column
            prop="repairContent"
            label="报修内容"
            sortable
            align="center"
            min-width="180"
          >
            <template slot-scope="scope">
              <table-remark :allRemark="scope.row.repairContent" title="维修内容"></table-remark>
            </template>
          </el-table-column>
          <el-table-column prop="tenantInfo" label="租客信息" sortable align="center" min-width="180"></el-table-column>
          <el-table-column prop="CreaterName" label="处理人" sortable align="center" min-width="180"></el-table-column>
          <el-table-column prop="CreaterTime" label="提交时间" sortable align="center" min-width="180"></el-table-column>
          <el-table-column prop="repairRemark" label="备注" sortable align="center" min-width="150">
            <template slot-scope="scope">
              <table-remark :allRemark="scope.row.repairRemark"></table-remark>
            </template>
          </el-table-column>
          <el-table-column prop="auditStatus" label="审核状态" sortable align="center" min-width="120"></el-table-column>
          <el-table-column label="操作" fixed="right" align="center" min-width="120">
            <template slot-scope="scope">
              <table-buttons
                :options="operation2button"
                :condition="scope.row.operation"
                @handleEditClick="handleEdit(scope.row.id)"
              ></table-buttons>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <bottom-tool-bar ref="bottomToolBar" :handlePageChange="updateTableInfo"></bottom-tool-bar>
    </div>
    <add-repair-item
      :editingData="editingData"
      :modalVisibility="modalVisibility"
      @close="modalVisibility=false"
      @addedHouseInfo="addHouseinfo"
      @editedRepairItem="handleEditedRepairItem"
    ></add-repair-item>
  </div>
</template>

<script>
import { baseImgURL } from '@/config/index.js'
import { getRepairTableList } from '@/api/service'
import { SelectBusinessDepList } from '@/api/system.js'
import TableButtons from '@/components/TableButtons'
import SearchPanel from '@/components/SearchPanel'
import BottomToolBar from '@/components/BottomToolBar'
import TableRemark from '@/components/TableRemark'
import AddRepairItem from './components/AddRepairItem.vue'
export default {
  name: 'RepairList',
  components: {
    AddRepairItem,
    TableButtons,
    SearchPanel,
    BottomToolBar,
    TableRemark
  },
  data() {
    return {
      baseImgURL,
      modalVisibility: false, // 是否显示添加报修弹窗
      listLoading: false,
      options: [],
      searchForm: {
        CompanyID: '',
        Crux: '',
        dateValue: ['', ''],
        KeyID: 0
      },
      comList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      tableData: null,
      tableDetailsInfo: null,
      operatingID: null,
      filteredTableData: null,
      operation2button: [
        {
          key: 'Complete',
          value: '维修完成',
          type: 'success',
          size: 'mini'
        },
        {
          key: 'Edit',
          value: '修改',
          type: 'default',
          size: 'mini'
        },
        {
          key: 'Revoke',
          value: '撤销',
          type: 'danger',
          size: 'mini'
        },
        {
          key: 'Delete',
          value: '删除',
          type: 'danger',
          size: 'mini'
        }
      ],
      editingData: {}
    }
  },
  computed: {
    operatingIndex() {
      return this.filteredTableData.findIndex(val => {
        return this.operatingID === val.id
      })
    },
    form() {
      const dateValue = this.searchForm.dateValue || []
      return {
        CompanyID: this.searchForm.CompanyID,
        Crux: this.searchForm.Crux,
        StartTime: dateValue[0]
          ? this.$dateFormat(
            dateValue[0],
            'yyyy-MM-dd hh:mm:ss'
          )
          : '',
        EndTime: dateValue[1]
          ? this.$dateFormat(
            dateValue[1],
            'yyyy-MM-dd hh:mm:ss'
          )
          : '',
        KeyID: this.searchForm.KeyID
      }
    }
  },
  activated() {
    if (this.$route.query.KeyID) { // 处理从审核跳转过来的查看维修详情
      this.searchForm.KeyID = this.$route.query.KeyID
      this.$refs.bottomToolBar.search(1)
    }
  },
  methods: {
    handleTableRowClick(row) {
      this.$refs.houseTable.toggleRowExpansion(row)
    },
    addHouseinfo(houseInfo) {
      this.tableData.unshift(houseInfo)
      this.filteredTableData.unshift(this.filterTableDataItem(houseInfo))
      // console.log(this.filteredTableData)
    },
    handleEditedRepairItem(houseinfo) {
      this.updateTableInfoItem(houseinfo)
    },
    updateTableInfoItem(updateInfo) {
      this.$set(this.tableData, this.operatingIndex, updateInfo)
      this.$set(
        this.filteredTableData,
        this.operatingIndex,
        this.filterTableDataItem(updateInfo)
      )
    },
    updateTableInfo(pages) {
      if (!pages) {
        pages = {
          page: 1,
          size: 10
        }
      }
      this.listLoading = true
      return getRepairTableList({
        parm: pages,
        ...this.form
      }).then(res => {
        // console.log(res)
        this.tableData = res.Data.rows
        this.filterTableData()
        this.listLoading = false
        if (this.form.KeyID) {
          this.$nextTick(() => {
            this.$refs.houseTable.toggleRowExpansion(this.filteredTableData[0])
          })
          this.searchForm.KeyID = 0
        }
        return res.Data
      })
    },
    filterTableData() {
      const tableDatas = this.tableData
      const table = []
      // debugger
      tableDatas.forEach(val => {
        table.push(this.filterTableDataItem(val))
      })
      this.filteredTableData = table
    },
    filterTableDataItem(val) {
      val.TenantName = val.TenantName || ''
      val.TenantPhone = val.TenantPhone || ''
      return {
        id: val.KeyID,
        houseName: val.HouseName, // 房源名称
        RealPay: val.RealPay,
        PayType: val.PayType,
        repairContent: val.RepairContent, // 报修内容
        tenantName: val.TenantName, // 租客姓名
        tenantPhone: val.TenantPhone, // 租客电话
        tenantInfo: val.TenantName ? val.TenantName + ' ' + val.TenantPhone : '无', // 租客信息
        CreaterName: val.CreaterName, // 处理人
        CreaterTime: this.$dateFormat(val.CreaterTime),
        repairRemark: val.RepairRemark || '无', // 备注
        auditStatus: this.$EnumData.getEnumDesByValue('AuditStatus', val.AuditStatus), // 审核状态
        operation: this.$EnumData.getEnumDesByValue('AuditStatus', val.AuditStatus) === '已通过' ? [] : ['Edit'],
        RepairMoenyPic: val.MoenyPicImgList,
        RepairPic: val.RepairPicImgList,
        repairType: this.$EnumData.getEnumDesByValue('RepairType', val.RepairType),
        receivablesDate: this.$dateFormat(val.ReceivablesDate)
      }
    },
    submitSearch() {
      // console.log(this.searchForm)
      this.$refs.bottomToolBar.search()
    },
    resetTable() {
      this.searchForm = {
        CompanyID: '',
        Crux: '',
        dateValue: ['', ''],
        KeyID: 0
      }
      this.$refs.bottomToolBar.search()
    },
    showModal() {
      this.editingData = {}
      this.modalVisibility = true
    },
    handleEdit(id) {
      this.modalVisibility = true
      this.operatingID = id
      this.editingData = this.tableData[this.operatingIndex]
    },
    getInOrOut(val) { // 获取收入或者支出的枚举name
      return this.$EnumData.getEnumDesByValue('InOrOut', val)
    }
    /*       handleComplete(id) {
                              this.completeVisible = true
                              this.operatingID = id
                            },
                            handleRevoke(id) {
                              this.$confirm('确定撤销当前维修单', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                              })
                                .then(() => {
                                  repairRevoke({
                                    id: 1234
                                  }).then(res => {
                                    this.operatingID = id
                                    this.$set(this.tableData, this.operatingIndex, res.Data)
                                    this.$set(
                                      this.filteredTableData,
                                      this.operatingIndex,
                                      this.filterTableDataItem(res.Data)
                                    )
                                  })
                                  this.$message({
                                    type: 'success',
                                    message: '撤销成功!'
                                  })
                                })
                                .catch(() => {
                                  this.$message({
                                    type: 'info',
                                    message: '已取消'
                                  })
                                })
                            },
                            handleDelete(id) {
                              this.$confirm('确定删除当前维修单', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                              })
                                .then(() => {
                                  this.operatingID = id
                                  this.tableData.splice(this.operatingIndex, 1)
                                  this.filteredTableData.splice(this.operatingIndex, 1)
                                  this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                  })
                                })
                                .catch(() => {
                                  this.$message({
                                    type: 'info',
                                    message: '已取消'
                                  })
                                })
                            } */
  },
  created() {
    SelectBusinessDepList({ BusinessID: this.$store.getters.userinfo.BusinessID, Type: 2 }).then(res => {
      this.comList = res.Data.ComList.map(v => {
        return {
          value: v.KeyID,
          label: v.CompanyName
        }
      })
    })
    if (this.$route.query.KeyID) { // 处理从审核跳转过来的查看维修详情
      this.searchForm.KeyID = this.$route.query.KeyID
    }
  }
}
</script>


<style lang="scss">
@import "../../../styles/reset.scss";
@import "style";
</style>
