<template>
   <div class="app-container data-list modifyTop">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="270px">
      <template slot="search">
          <el-form-item label="关键字" prop="ProjectName">
          <el-input
            placeholder="请输入项目名称关键字"
            v-model="ruleForm.ProjectName"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="类别" prop="Status">
        <el-select v-model="ruleForm.CategoryID" placeholder="请选择">
            <el-option
            v-for="item in CategoryList"
            :key="item.KeyID"
            :label="item.CategoryName"
            :value="item.KeyID">
            </el-option>
        </el-select>
        </el-form-item>
      </template>

      <template slot="button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="handleStorage">新增</el-button>
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
                <!-- <el-table-column
                    v-for="(item, index) in tableLabel"
                    :key="index" 
                    :prop="item.prop" 
                    :min-width="item.width" 
                    :label="item.label">
                </el-table-column> -->
                   <!-- <template slot-scope="scope">
                    {{$dateFormat(scope.row.ReceivablesDate)}}
                </template> -->
            <el-table-column align="center"  label='类别' min-width="130" prop="CategoryName"></el-table-column>
            <el-table-column align="center"  label='名称' min-width="130" prop="ProjectName"></el-table-column>
            <el-table-column align="center"  label='型号' min-width="130" prop="Model"></el-table-column>
            <el-table-column align="center"  label='数量' min-width="130" prop="Number"></el-table-column>
            <el-table-column align="center"  label='单位' min-width="130" prop="Unit"></el-table-column>
            <el-table-column align="center"  label='内部单价（元）' min-width="130" prop="InsidePrice"></el-table-column>
            <el-table-column align="center"  label='外部单价（元）' min-width="130" prop="ExternalPrice"></el-table-column>
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
                    @click="handleStorage(scope.$index, scope.row, 1)">入库</el-button>
                    <el-button
                    v-if="scope.row.Number !== 0"
                    size="mini"
                    type="primary"
                    plain
                    @click="handleStorage(scope.$index, scope.row, 2)">出库</el-button>
                    <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="handleStorage(scope.$index, scope.row, 3)">修改</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    plain
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="handleStorage(scope.$index, scope.row, 4)">操作记录</el-button>
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
      <StoreHouse :CategoryList = 'CategoryList' @refresh='refresh' ref="StoreHouse"></StoreHouse>
    <!-- <settlement ref="settlement" :bus-type="0" @success="checkOutSuccess"></settlement> -->
  </div>
</template>
<style scoped lang="scss">
  @import "style";
</style>
<script>
  // import { SelectOwnExpNoCheck } from '@/api/owner'
  import { ShowStorageRoom, ShowAllRenovationApply, DelStorageRoom } from '@/api/purchase'
  import { BottomToolBar, SearchPanel, Settlement, TableButtons, SelectStore, StoreHouse } from '../../../../components'
  export default {
    name: 'StoreHouseList',
    components: {
      SearchPanel,
      TableButtons,
      BottomToolBar,
      Settlement,
      SelectStore,
      StoreHouse
    },
    data() {
      return {
        // 类别数组
        CategoryList: [],
        filterList: [],
        listLoading: true,
        tableSelected: [],
        pageSize: 10,
        ruleForm: {
          CategoryID: '',
          ProjectName: ''
        }
      }
    },
    computed: {

    },
    created() {
      // 类别
      ShowAllRenovationApply().then(data => {
        this.CategoryList = data.Data
        console.log(this.CategoryList)
      })
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
        return ShowStorageRoom({
              parm: pages,
              CategoryID: this.ruleForm.CategoryID,
              ProjectName: this.ruleForm.ProjectName
          }).then(({ Data }) => {
              this.filterList = Data.rows
              // this.filterList.forEach(val => {
              //   val.EndTime = this.$dateFormat(val.EndTime, 'yyyy-MM-dd')
              // })
              this.listLoading = false
              // 传给父组件的标识
              return Data
          })
          .catch(() => {
            this.listLoading = false
          })
      },
      // 选择门店过后，返回来的数据
      handleStoreChange(val) {
        // 选择门店后的回调
        if (val) {
          this.ruleForm.FullID = val.fullID
        } else {
          this.ruleForm.FullID = ''
        }
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
        this.ruleForm.CategoryID = ''
        // 页面刷新
        this.$refs.bottomToolBar.search()
      },
          // 格式化
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'ReceivableDate') {
            return this.$dateFormat(v[j])
          } else {
            return v[j]
          }
        }))
      },
      handleStorage(index, row, num) {
        this.$refs.StoreHouse.open({
          num: num,
          row: row
        })
      },
      handleDelete(index, row) {
        this.$confirm('确定删除这条数据？, 是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // 返回一个id 放上去
            DelStorageRoom({
                KeyID: row.KeyID
            }).then(({ Data, BusCode, Msg }) => {
                this.$message.success('删除成功!')
                const index = this.filterList.findIndex(v => v.KeyID === row.KeyID)
                this.filterList.splice(index, 1)
            }).catch(() => {
                this.$message.error('删除失败!')
            })
        })
      },
      refresh(val) {
        if (val === 'ok') {
            this.fetchData(false)
        } else if (val === 'Stock') {
            this.fetchData(this.recordPage)
        }
      }
    }
  }
</script>
