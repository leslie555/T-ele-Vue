<template>
  <el-dialog
    title="选择对象"
    :close-on-click-modal="false"
    :center="true"
    append-to-body
    :show-close="false"
    v-loading="listLoading"
    :visible.sync="dialogFormVisible"
  >
    <el-form ref="form" inline>
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item label="关键字" :label-width="70+'px'">
            <el-input placeholder="请输入姓名/电话" v-model="SearchNameOrPhone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="SearchCustomer">查询</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-table
            ref="multipleTable"
            :data="CustomerData"
            tooltip-effect="dark"
            style="width: 100%"
            max-height="400"
            v-loading="TablelistLoading"
            element-loading-text="加载中"
            class="table-normal"
            border
            @selection-change="ChoiceUserList">
            <el-table-column
              align="center"
              type="selection"
              width="60">
            </el-table-column>
            <el-table-column
              align="center"
              label="姓名"
              prop="CustomerName">
            </el-table-column>
            <el-table-column
              align="center"
              label="电话"
              prop="CustomerPhone">
            </el-table-column>
            <el-table-column
              v-if="CustomerType==1||CustomerType==2"
              align="center"
              label="房源名称"
              prop="HouseName">
            </el-table-column>
          </el-table>
        </div>

      </div>
    </el-form>
    <bottom-tool-bar
      ref="bottomToolBar"
      :page-size="pageSize"
      :handlePageChange="fetchData"
      :render-first="false"
    >
    </bottom-tool-bar>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="CloseUserList">取消</el-button>
      <el-button type="primary" @click="InsertSearchUser">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { GetCustomerList } from '@/api/finance'
  import { BottomToolBar } from '../../../../../components'

  export default {
    name: 'choice-payment-target',
    data() {
      return {
        listLoading: false,
        dialogFormVisible: false,
        TablelistLoading: '',
        SearchNameOrPhone: '',
        pageSize: 10,
        CustomerData: [], // 表格数据
        CustomerType: null, // 客户类型
        newselection: [] // 选择表格传出去的数组对象
      }
    },
    components: {
      BottomToolBar
    },
    methods: {
      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        this.TablelistLoading = true
        return GetCustomerList({
          pageParam: pages,
          CustomerType: this.CustomerType,
          KeyWord: this.SearchNameOrPhone,
          Type: 2 // 付款单
        }).then(({ Data, BusCode, Msg }) => {
          Data.rows.forEach(item => {
            item.onetarget = this.CustomerType
          })
          this.CustomerData = Data.rows
          this.TablelistLoading = false
          return Data
        })
      },
      open(val) {
        this.CustomerType = val
        this.dialogFormVisible = true
        this.TablelistLoading = false
        this.SearchNameOrPhone = ''
        this.CustomerData = []
        this.$nextTick(() => {
          this.SearchCustomer()
        })
      },
      // 查询按钮
      SearchCustomer() {
        this.$refs.bottomToolBar.search()
      },
      // 关闭窗口
      Close() {
        this.$emit('AddTargetMsg', this.newselection)
        this.dialogFormVisible = false
      },
      // 点击确认按钮
      InsertSearchUser() {
        this.$emit('AddTargetMsg', this.newselection)
        this.Close()
      },
      // 点击取消按钮
      CloseUserList() {
        this.Close()
      },
      // 选择表格数据
      ChoiceUserList(selection) {
        console.log(selection)
        if (selection.length > 1) {
          this.$refs.multipleTable.selection.splice(0, 1)
          this.newselection = this.$refs.multipleTable.selection
          console.log(this.newselection)
        } else {
          this.newselection = this.$refs.multipleTable.selection
        }
      }
    }
  }
</script>

<style scoped>

</style>
