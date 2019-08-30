<template>
  <div>
    <div class="app-container data-list">
      <search-panel :model="ruleForm" ref="ruleForm" label-width="100px">
        <template slot="search">
          <el-form-item label="关键字" prop="Keyword">
            <el-input
              v-model="ruleForm.Keyword"
              autocomplete="off"
              placeholder="请输入关键词"
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
            v-setbtn:Add
            @click="configAdd()">新增项目
          </el-button>
        </template>
      </search-panel>
      <div class="panel data-list-table data-div">
        <div class="menu-div">
          <div class="add-menu">
            <span>类别</span>
            <el-button :disabled="isAddColumn"
                       class="el-button el-button--primary el-button--mini is-plain addColumn-btn"
                       v-setbtn:Add
                       @click="addOneColumn">
              <i class="icon-font el-icon-plus icon-add"></i>
            </el-button>
          </div>
          <el-scrollbar class="vertical-scroll-config">
            <ul class="config-menu">
              <li v-for="(item,index) in filterConfigMenu" :class="{ active: item.isActive }"
                  :key="item.KeyID" @click="changeMenu(item)">
                <div class="menu-info">
                  <span v-show="!item.isEditing" :ref="'menu'+index">{{ item.Name }}</span>
                  <div v-show="item.isEditing" class="menu-item">
                    <el-input :ref="'menuText'+index" type="text" v-model="item.Name"
                              @blur="saveMenu(item,index)"></el-input>
                  </div>
                  <div v-if="item.BusID!==0" class="icon-div">
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
                      @selection-change="tableSelect"
                      v-loading.body="listLoading"
                      element-loading-text="加载中"
                      border
                      fit
                      height="100%"
                      class="table-normal">
              <el-table-column
                align="center"
                type="selection"
                fixed="left"
                :selectable="selectable"
                width="55">
              </el-table-column>
              <el-table-column align="center" label='项目名称' fixed="left" width="240">
                <template slot-scope="scope">
                  <span>{{scope.row.Name}}</span><span v-if="scope.row.IsReplace">（代）</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label='金额' min-width="120" prop="Price">
              </el-table-column>
              <el-table-column align="center" label='备注' min-width="220" prop="Remark">
              </el-table-column>
              <el-table-column align="center" label="操作" fixed="right" width="220">
                <template slot-scope="scope">
                  <table-buttons
                    :options="operation2button"
                    :condition="scope.row.Operation"
                    @handleEditClick="handleUpdate(scope.row)"
                    @handleDeleteClick="handleDelete(scope.row)"
                  ></table-buttons>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <bottom-tool-bar class="pager-div" ref="bottomToolBar" :beforeLoad="fetchColumnData"
                       :checkedLength="tableSelected.length" :page-size="pageSize" :handlePageChange="fetchData">
        <el-button
          class="checkAll-button"
          type="danger"
          icon="delete"
          size="mini"
          :disabled="tableSelected.length === 0"
          @click="handleDeleteAll">
          <span>批量删除</span>
        </el-button>
      </bottom-tool-bar>
    </div>
    <div>
      <EditFinancialConfig ref="editConfigBox" @editConfigInfo="editConfigInfo"></EditFinancialConfig>
    </div>
  </div>
</template>

<script>
  import { SearchPanel, TableButtons, BottomToolBar } from '../../../components/'
  import EditFinancialConfig from './components/EditFinancialConfig.vue'
  import { AddBillItem, QueryBillItemPage, DeleteBillItem } from '../../../api/ownerBill'

  export default {
    name: 'FinancialConfig',
    components: {
      TableButtons,
      SearchPanel,
      BottomToolBar,
      EditFinancialConfig
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
        operation2button: [
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

    activated() {
      this.$refs.bottomToolBar.search(1)
    },

    methods: {
      fetchColumnData() {
        const pages = {
          size: 100,
          page: 1
        }
        this.listLoading = true
        return QueryBillItemPage({
          param: pages,
          PID: 0, // 一级栏目父id为0
          KeyWord: ''
        }).then(response => {
          this.configMenu = response.Data.rows
          this.filterColumnTableData()
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },

      filterColumnTableData() {
        this.filterConfigMenu = []
        this.configMenu.map(item => {
          this.filterConfigMenu.push(this.filterColumnTableDataItem(item))
        })
        this.filterConfigMenu[0].isActive = true
        console.log('filterConfigMenu', this.filterConfigMenu)
      },

      filterColumnTableDataItem(item) {
        return {
          Name: item.Name,
          KeyID: item.KeyID,
          BusID: item.BusID,
          isEditing: false,
          isActive: false
        }
      },

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
        return QueryBillItemPage({
          param: pages,
          PID: pID,
          KeyWord: this.ruleForm.Keyword
        }).then(response => {
          console.log(response.Data)
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
          PID: item.PID,
          KeyID: item.KeyID,
          BusID: item.BusID,
          Name: item.Name,
          Price: item.Price,
          IsReplace: item.IsReplace,
          Remark: item.Remark,
          Operation: item.BusID === 0 ? [] : ['Edit', 'Delete']
        }
      },

      selectable(row) {
        if (row.BusID !== 0) {
          return true
        } else {
          return false
        }
      },

      configSearch() {
        this.$refs.bottomToolBar.search()
      },

      configAdd() {
        let editData = {}
        if (this.filterConfigMenu.length > 0) {
          editData = {
            PID: this.filterConfigMenu[0].KeyID, // 默认选中第一项
            Name: '',
            Price: '',
            Remark: '',
            IsReplace: false
          }
          this.columnList = this.filterConfigMenu.map(item => {
            return {
              Name: item.Name,
              KeyID: item.KeyID
            }
          })
          this.$refs.editConfigBox.open(editData, this.columnList)
        } else {
          this.$message.error('请先添加类别!')
        }
      },

      keywordReset() {
        this.$refs.ruleForm.resetFields()
        this.$refs.bottomToolBar.search()
      },

      addMenu() {
        // 判断输入是否为空,空则不调取接口
        const reg = '^[ ]+$'
        if (this.addColumnName !== '' && !new RegExp(reg).test(this.addColumnName)) {
          // 验证字数
          if (this.addColumnName.length > 15) {
            this.$message.error('类目字数请控制在15个字符内!')
          }
          const postData = { 'Name': this.addColumnName, 'PID': 0 } // 一级栏目父id为0
          AddBillItem(postData).then(response => {
            const columnObject = response.Data
            const filterObject = {
              Name: columnObject.Name,
              KeyID: columnObject.KeyID,
              isEditing: false,
              isActive: false
            }
            this.filterConfigMenu.push(filterObject)
            // 切换选中状态到新增栏目上
            this.changeMenu(filterObject)
            // 重置输入框
            this.isAddColumn = false
            this.addColumnName = ''
          })
        } else {
          this.isAddColumn = false
          this.addColumnName = ''
        }
      },

      addOneColumn() {
        // 将添加按钮设为禁用，直到添加结束
        this.isAddColumn = true
        setTimeout(() => {
          this.$refs.addInput.focus()
        }, 10)
      },

      editMenu(index) {
        this.filterConfigMenu[index].isEditing = true
        setTimeout(() => {
          this.$refs['menuText' + index][0].focus()
        }, 10)
      },

      // 修改栏目
      saveMenu(row, index) {
        // 验证类目字数
        if (row.Name.length > 15) {
          this.$message.error('类目字数请控制在15个字符内!')
        }
        const postObject = {
          Name: row.Name,
          KeyID: row.KeyID,
          PID: 0
        }
        // 提交并保存输入值
        AddBillItem(postObject).then(() => {
          this.loading = false
          // 隐藏输入框并显示span
          this.$refs['menu' + index].innerHTML = row.value
          this.filterConfigMenu[index].isEditing = false
        }).catch(() => {
          this.loading = false
        })
      },

      deleteMenu(item) {
        this.$confirm('此操作将删除选中的配置, 是否继续?', '提示').then(() => {
          const postData = { 'ids': [item.KeyID] }
          DeleteBillItem(postData).then(() => {
            const index = this.filterConfigMenu.findIndex(i => {
              return i.KeyID === item.KeyID
            })
            this.filterConfigMenu.splice(index, 1)
            // 如果删除的是当前选中的栏目，将选中状态置为第一条，读取第一条的数据，以免删除后右边内容不变以及无栏目被选中
            if (this.filterConfigMenu.length > 0) {
              this.filterConfigMenu[0].isActive = true
              this.fetchData()
            } else {
              this.filterList = [] // 如果删除的是最后一条
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
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
      },

      // 批量选择
      tableSelect(val) {
        this.tableSelected = val
      },

      handleDeleteAll() {
        this.$confirm('此操作将批量删除选中的配置, 是否继续?', '提示').then(() => {
          const checked = []
          this.tableSelected.map(item => {
            checked.push(item.KeyID)
          })
          const postData = { 'ids': checked }
          DeleteBillItem(postData).then(() => {
            this.fetchData()
          })
          this.$message.success('删除成功')
        })
      },

      handleUpdate(row) {
        this.columnList = this.filterConfigMenu.map(item => {
          return {
            Name: item.Name,
            KeyID: item.KeyID
          }
        })
        this.$refs.editConfigBox.open(row, this.columnList)
      },

      editConfigInfo(data) {
        // 查找该数据是否在当前列表下，有则修改，没有则新增
        const index = this.filterList.findIndex(item => {
          return item.KeyID === data.KeyID
        })
        if (index > -1) {
          this.$set(this.filterList, index, { ...this.filterList[index], ...data })
        } else {
          data.Operation = ['Edit', 'Delete']
          this.filterList.push(data)
        }
      },

      handleDelete(item) {
        this.$confirm('确认删除该财务配置?', '提示').then(() => {
          const postData = { 'ids': [item.KeyID] }
          DeleteBillItem(postData).then(() => {
            const index = this.filterList.findIndex(i => {
              return i.KeyID === item.KeyID
            })
            this.filterList.splice(index, 1)
            this.$message.success('删除成功')
          })
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
  @import "./style";
</style>

