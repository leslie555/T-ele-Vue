<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="100px">
        <template slot="search">
          <el-form-item label="关键字" prop="Keyword">
            <el-input
              v-model="ruleForm.Keyword"
              autocomplete="off"
              placeholder="请输入项目名称关键词查询"
              style="width: 340px">
            </el-input>
          </el-form-item>
        </template>
        <template slot="button">
          <el-button
            class="search-button"
            type="primary"
            @click="configSearch()">查询
          </el-button>
          <el-button
            class="reset-button"
            type="primary"
            @click="keywordReset()">重置
          </el-button>
          <el-button
            class="add-button"
            type="primary"
            @click="configAdd()">新增
          </el-button>
        </template>
      </search-panel>
      <div class="panel data-list-table data-div">
        <div class="menu-div">
          <div class="add-menu">
            <span>类别</span>
            <el-button :disabled="isAddColumn"
                       class="el-button el-button--primary el-button--mini is-plain addColumn-btn"
                       @click="addOneColumn">
              <i class="icon-font el-icon-plus icon-add"></i>
            </el-button>
          </div>
          <el-scrollbar class="vertical-scroll-config">
            <ul class="config-menu">
              <li v-for="(item,index) in filterConfigMenu" :class="{active: item.isActive}"
                  :key="item.KeyID" @click="changeMenu(item)">
                <div class="menu-info">
                  <span v-show="!item.isEditing" :ref="'menu'+index" :class="{'over-ellipsis': item.CategoryName.length > 8 ? true : false}">{{ item.CategoryName }}</span>
                  <div v-show="item.isEditing" class="menu-item">
                    <el-input :ref="'menuText'+index" type="text" v-model="item.CategoryName"
                              @blur="saveMenu(item,index)"></el-input>
                  </div>
                  <div v-if="filterConfigMenu[index].isActive" class="icon-div">
                    <i class="iconfont icon-bianji icon-edit" @click="editMenu(index)"></i>
                    <i class="iconfont icon-shanchu icon-delete" @click="deleteMenu(item)"></i>
                  </div>
                </div>
              </li>
            </ul>
            <div v-if="isAddColumn" class="add-column-div">
              <el-input ref="addInput" autofocus="true" type="text" v-model="addColumnName"
                        @blur="addMenu()"></el-input>
            </div>
          </el-scrollbar>
        </div>
        <div class="table-div">
          <div class="inner-table">
            <el-table :data="filterList"
                      ref="multipleTable"
                      v-loading.body="listLoading"
                      element-loading-text="加载中"
                      border
                      fit
                      height="100%"
                      class="table-normal">
              <el-table-column align="center" label="序号" width="55" type="index">
              </el-table-column>
              <el-table-column align="center" label='项目名称' width="240" prop="ProjectName">
                <template slot-scope="scope">
                  <span>{{scope.row.ProjectName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label='型号' min-width="120" prop="Model"></el-table-column>
              <el-table-column align="center" label='单位' min-width="120" prop="Unit">
                <!-- <template slot-scope="scope">
                  <span>{{$EnumData.getEnumDesByValue('RenovationUnit', scope.row.Unit)}}</span>
                </template> -->
              </el-table-column>
              <el-table-column align="center" label='内部单价 (元)' min-width="120" prop="InsidePrice"></el-table-column>
              <el-table-column align="center" label='外部单价 (元)' min-width="120" prop="ExternalPrice"></el-table-column>
              <el-table-column align="center" label='备注' min-width="120" prop="BZ"></el-table-column>
              <el-table-column align="center" label="操作" fixed="right" width="180">
                <template slot-scope="scope">
                  <table-buttons
                    :showAll="true"
                    :options="operationButton"
                    :condition="scope.row.Operation"
                    @handleEditClick="handleUpdate(scope.row)"
                    @handleDeleteClick="handleDelete(scope.row, scope.$index)"
                  ></table-buttons>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    <div>
      <bottom-tool-bar ref="bottomToolBar" :beforeLoad="fetchColumnData" :page-size="pageSize" :handlePageChange="fetchData"></bottom-tool-bar>
      <FixApplyAddDialog ref="addConfigBox" @editConfigInfo="editConfigInfo"></FixApplyAddDialog>
    </div>
  </div>
</template>
<script>
import { SearchPanel, TableButtons, BottomToolBar } from '@/components'
import FixApplyAddDialog from './components/FixApplyAddDialog'
import {
  ShowAllRenovationApply,
  AddRenovationApplyCategory,
  DelRenovationApply,
  EditRenovationApply,
  ShowRenovationApply,
  DelRenovationApplyCon
} from '../../../../api/purchase'
export default {
  name: 'FixApplyConfigList',
  components: {
    TableButtons,
    SearchPanel,
    BottomToolBar,
    FixApplyAddDialog
  },
  data() {
    return {
      num: 0,
      ruleForm: {
        Keyword: ''
      },
      configMenu: [],
      isActive: 1,
      filterConfigMenu: [],
      list: [],
      filterList: [],
      listLoading: false,
      tableSelected: [],
      pageSize: 10,
      isAddColumn: false,
      addColumnName: '',
      unitData: [],
      columnList: [],
      operationButton: [
        {
          key: 'Edit',
          value: '修改',
          type: 'primary'
        },
        {
          key: 'Delete',
          value: '删除',
          type: 'danger'
        }
      ]
    }
  },
  created() {
    // initUnit()
    this.unitData = this.$EnumData.getEnumListByKey('RenovationUnit').map(item => {
      return {
        Key: item.Value,
        Name: item.Description
      }
    })
    // console.log(this.unitData)
    // console.log(this.$store.getters.enumList)
  },
  methods: {
    // 初始化单位
    initUnit(Unit) {
     return this.$EnumData.getEnumDesByValue('RenovationUnit', Unit)
    },
     // 显示所有类别接口
    fetchColumnData() {
      this.listLoading = true
      return ShowAllRenovationApply().then(response => {
        this.configMenu = response.Data
        this.configMenu.map(res => {
          this.filterConfigMenu.push({
            KeyID: res.KeyID,
            DelKeyID: res.DelKeyID,
            UpdateKeyID: res.UpdateKeyID,
            CategoryName: res.CategoryName,
            isActive: false,
            isEditing: false
          })
        })
        this.filterConfigMenu[0].isActive = true
        console.log('显示所有类别接口', response)
        console.log('filterConfigMenu', this.filterConfigMenu)
      }).catch(() => {
        this.listLoading = false
      })
    },
    // search-查询
    configSearch() {
      this.$refs.bottomToolBar.search()
    },
    // search-重置
    keywordReset() {
      this.$refs.ruleForm.resetFields()
      this.$refs.bottomToolBar.search()
    },
    // search-新增
    configAdd() {
      let editData = {}
      if (this.filterConfigMenu.length > 0) {
        editData = {
         CategoryID: this.filterConfigMenu[0].KeyID,
         ProjectName: '',
         Model: '',
         Unit: '',
         InsidePrice: null,
         ExternalPrice: null,
         BZ: ''
        }
        this.columnList = this.filterConfigMenu.map(item => {
          return {
            CategoryName: item.CategoryName,
            KeyID: item.KeyID
          }
        })
      this.$refs.addConfigBox.open(editData, { type: 'add', typeName: '新增' }, this.columnList, this.unitData)
      // console.log('新增')
      } else {
        this.$message.error('请先添加类别!')
      }
    },
    // 添加一级分类
    addOneColumn() {
      // 将添加按钮设为禁用，直到添加结束
      this.isAddColumn = true
      setTimeout(() => {
        this.$refs.addInput.focus()
      }, 10)
    },
    // 切换栏目
    changeMenu(row) {
      this.filterConfigMenu.map(item => {
        item.isActive = false
      })
      const index = this.filterConfigMenu.findIndex(item => {
        return item.KeyID === row.KeyID
      })
      this.filterConfigMenu[index].isActive = true
      this.fetchData()
      this.$refs.bottomToolBar.search()
      console.log('切换栏目', row)
    },
    // 保存栏目
    saveMenu(row, index) {
      // 验证类目字数
      if (row.CategoryName.length > 15) {
        this.$message.warning('类目字数请控制在15个字符以内!')
      }
      EditRenovationApply({
        KeyID: row.KeyID,
        CategoryID: row.CategoryID,
        CategoryName: row.CategoryName
      }).then(res => {
        console.log('编辑类别', res)
      })
      // const postObject = {
      //   CategoryName: row.CategoryName,
      //   KeyID: row.KeyID,
      //   PID: 0
      // }
      this.$refs['menu' + index].innerHTML = row.value
      this.filterConfigMenu[index].isEditing = false
      console.log(row, index)
    },
    // 表格——编辑
    editMenu(index) {
      console.log(index)
      this.filterConfigMenu[index].isEditing = true
      setTimeout(() => {
        this.$refs['menuText' + index][0].focus()
      }, 10)
    },
    // 类别——删除
    deleteMenu(item) {
      console.log('类别——删除item', item)
      this.$confirm('此操作将删除选中的配置, 是否继续?', '提示').then(() => {
        DelRenovationApply({
          KeyID: item.KeyID,
          CategoryID: item.CategoryID
        }).then(res => {
          this.filterConfigMenu = this.filterConfigMenu.filter(val => {
            return val.KeyID !== item.KeyID
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.filterConfigMenu[this.filterConfigMenu.length - 1 ].isActive = true
          console.log('类别——删除res', res)
        })
      })
    },
    // 添加
    addMenu() {
      // debugger
      this.isAddColumn = false
      if (this.addColumnName) {
        AddRenovationApplyCategory({
          CategoryName: this.addColumnName
        }).then(res => {
          console.log('添加类别', res)
          const filterObject = {
          KeyID: res.Data,
          CategoryName: this.addColumnName,
          isActive: false,
          isEditing: false
        }
        this.filterConfigMenu.push(filterObject)
        // 切换选中状态到新增栏目上
        this.changeMenu(filterObject)
        this.addColumnName = ''
        })
      }
      console.log('addColumnName', this.addColumnName)
    },
    // 表格——修改
    handleUpdate(item) {
      const typeTitle = { type: 'update', typeName: '修改' }
      this.columnList = this.filterConfigMenu.map(item => {
        return {
          CategoryName: item.CategoryName,
          KeyID: item.KeyID
        }
      })
      this.$refs.addConfigBox.open(item, typeTitle, this.columnList, this.unitData)
      console.log('修改', item)
    },
    // 表格——删除
    handleDelete(item, index) {
      this.$confirm('确认删除该装修申请项目配置?', '提示').then(() => {
         DelRenovationApplyCon({
           KeyID: item.KeyID
         }).then((res) => {
           if (res.Code === 0 && res.Data === 1) {
            console.log('删除成功', res)
            this.filterList.splice(index, 1)
            this.$message.success('删除成功')
           } else {
            this.$message.success('删除失败')
           }
         })
      })
    },
    editConfigInfo(data) {
      // 查找该数据是否在当前列表下，有则修改，没有则新增
      const index = this.filterList.findIndex(item => {
        return item.KeyID === data.KeyID
      })
      if (index > -1) {
         this.$set(this.filterList, index, { ...this.filterList[index], ...data })
      } else {
         this.filterList.push(data)
      }
      console.log('index', index)
      console.log('子组件data', data)
      this.$refs.bottomToolBar.search()
      // console.log('this.filterList[index]', this.filterList[0])
    },
    // 调接口
    fetchData(pages) {
      if (!pages) {
          pages = {
          size: this.pageSize,
          page: 1
          }
      }
      this.listLoading = true
      // 获取选中栏目的KeyID
      const index = this.filterConfigMenu.findIndex(item => {
        return item.isActive
      })
      const pID = this.filterConfigMenu[index].KeyID
      // console.log(this.filterConfigMenu)
      return ShowRenovationApply({
        parm: pages,
        CategoryID: pID,
        ProjectName: this.ruleForm.Keyword
      }).then(response => {
        this.list = response.Data.rows
        // this.filterList = response.Data.rows
        this.filterTableData()
        console.log(this.filterList)
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
        CategoryID: item.CategoryID,
        KeyID: item.KeyID,
        ProjectName: item.ProjectName,
        Model: item.Model,
        Unit: item.Unit,
        InsidePrice: item.InsidePrice,
        ExternalPrice: item.ExternalPrice,
        BZ: item.BZ,
        Operation: ['Edit', 'Delete']
      }
    }
  }
}
</script>
<style lang="scss">
.vertical-scroll-config .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
<style lang="scss" scoped>
 @import "./style"
</style>