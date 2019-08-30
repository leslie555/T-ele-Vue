<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="100px">
        <template slot="search">
          <el-form-item label="关键字" prop="Keyword">
            <el-input
              v-model="ruleForm.Keyword"
              autocomplete="off"
              placeholder="请输入品牌名称关键词查询"
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
              <li v-for="(item,index) in filterConfigMenu" :class="{ active: item.isActive }"
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
            <el-table 
              :data="filterList"
              ref="multipleTable"
              v-loading.body="listLoading"
              element-loading-text="加载中"
              border
              fit
              height="100%"
              class="table-normal">
              <el-table-column align="center" label="序号" width="55" type="index"></el-table-column>
              <el-table-column align="center" label='品牌' width="240" prop="BrandName">
              </el-table-column>
              <el-table-column align="center" label='经销商' min-width="120" prop="Distributor"></el-table-column>
              <el-table-column align="center" label='负责人' min-width="120">
                 <template slot-scope="scope">
                  <span>{{scope.row.PersonChargeName}} {{scope.row.PersonChargeTel}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label='备注' min-width="120" prop="BZ"></el-table-column>
              <el-table-column align="center" label="操作" fixed="right" width="180">
                <template slot-scope="scope">
                  <table-buttons
                     :showAll="true"
                    :options="operationButton"
                    :condition="['Edit', 'Delete']"
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
  ShowAllSupplierCategory,
  AddSupplierCategory,
  ShowSupplyCommodity,
  DelSupplierCategory,
  EditSupplierCategory,
  DelSupplyCommodity
 } from '@/api/purchase'
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
      ruleForm: {
        Keyword: ''
      },
      configMenu: [],
      filterConfigMenu: [],
      list: [],
      filterList: [],
      listLoading: false,
      tableSelected: [],
      pageSize: 10,
      isAddColumn: false,
      addColumnName: '',
      // editData: {},
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
  created() {},
  methods: {
    // 显示所有类别接口
    fetchColumnData() {
      this.listLoading = true
      return ShowAllSupplierCategory().then(response => {
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
    // 查询
    configSearch() {
      this.$refs.bottomToolBar.search()
    },
    // 重置
    keywordReset() {
      this.$refs.ruleForm.resetFields()
      this.$refs.bottomToolBar.search()
    },
    // 新增
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
      // console.log('新增')
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
    // 编辑类别
    saveMenu(row, index) {
      // 验证类目字数
      if (row.CategoryName.length > 15) {
        this.$message.warning('类目字数请控制在15个字符以内!')
      }
      EditSupplierCategory({
        KeyID: row.KeyID,
        CategoryID: row.CategoryID,
        CategoryName: row.CategoryName
      }).then(res => {
        console.log('编辑类别', res)
      })
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
      this.$confirm('此操作将删除选中的配置, 是否继续?', '提示').then(() => {
        DelSupplierCategory({
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
      this.isAddColumn = false
      if (this.addColumnName) {
        AddSupplierCategory({
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
    handleUpdate(row) {
      this.columnList = this.filterConfigMenu.map(item => {
        return {
          CategoryName: item.CategoryName,
          KeyID: item.KeyID
        }
      })
      this.$refs.addConfigBox.open(row, { type: 'update', typeName: '修改' }, this.columnList, this.unitData)
      console.log('修改', row)
    },
    // 表格——删除
    handleDelete(row, index) {
      this.$confirm('确认删除该装修申请项目配置?', '提示').then(() => {
        DelSupplyCommodity({
           KeyID: row.KeyID
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
      this.$refs.bottomToolBar.search()
      console.log('index', index)
      console.log('子组件data', data)
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
      return ShowSupplyCommodity({
        parm: pages,
        CategoryID: pID,
        ProjectName: this.ruleForm.Keyword
      }).then(response => {
        //  response.Data.rows.map(res => {
        //    console.log(res)
        //    res.Unit = this.$EnumData.getEnumDesByValue('RenovationUnit', res.Unit)
        //    return res
        //  })
        this.filterList = response.Data.rows
        console.log(response)
      //   this.filterTableData()
        this.listLoading = false
        return response.Data
      }).catch(() => {
        this.listLoading = false
      })
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