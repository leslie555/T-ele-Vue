<template>
  <span>
    <el-popover
      ref="popover"
      v-model="popoverVisible"
      placement="bottom"
      :visible-arrow="false"
      width="450"
      trigger="click"
      @show="handlePopoverShow"
    >
      <div class="select-emp-container">
        <el-row>
          <el-col :span="16">
            <div class="select-emp-tree">
              <el-scrollbar class="vertical-scroll">
                <el-tree
                  highlight-current
                  :data="treeData"
                  :props="defaultProps"
                  node-key="KeyID"
                  @node-click="handleNodeClick"
                  :default-expanded-keys="defaultExpanded"
                  :expand-on-click-node="false"
                ></el-tree>
              </el-scrollbar>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="select-emp-list">
              <el-scrollbar class="vertical-scroll">
                <el-tree
                  :data="employList"
                  empty-text="无"
                  :props="defaultUserProps"
                  @node-click="handleEmpChecked"
                ></el-tree>
              </el-scrollbar>
            </div>
          </el-col>
        </el-row>
        <div v-show="canSelectDep" class="select-emp-tip">单击箭头展开,双击节点选中</div>
      </div>
    </el-popover>
    <span v-popover:popover>
      <slot></slot>
    </span>
  </span>
</template>

<script>
  // import { findNodeByID } from '@/utils/getStructure/findNodeByID'
  import {
    ShowStaffRelationIntoByEmployeeID,
    HouseEmployeeListByFullID
  } from '@/api/system'
  // import { selectMyHouseEmp } from '@/api/house'
  import { clearTimeout } from 'timers'
  export default {
    props: {
      allCompany: {
        //  true可选当前企业下所有的数据,false选当前人所在公司的数据
        type: Boolean,
        default: false
      },
      canSelectDep: {
        // 单选时是否可以双击选择部门
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        treeData: [],
        defaultExpanded: [], // 默认展开数组
        popoverVisible: false,
        employList: [],
        form: {},
        defaultProps: {
          label: 'SysName'
        },
        defaultUserProps: {
          label: 'UserName'
        },
        clickCnt: 0 // 判断用户双击还是单击
      }
    },
    methods: {
      handleNodeCheck(val1, val2) {
        const emps = val2.checkedNodes.filter(v => v.type === 'EmployeeID')
        this.empTags = emps
      },
      handleNodeClick(node) {
        this.clickCnt++
        const timer = setTimeout(() => {
          if (this.canSelectDep && this.clickCnt === 2) {
            this.$emit('dbClick', node)
            this.popoverVisible = false
          } else if (this.clickCnt === 1) {
            HouseEmployeeListByFullID({
              Keyword: '',
              FullID: node.FullID,
              pageParam: {
                page: 1,
                size: 50
              }
            }).then(res => {
              this.employList = res.Data
            })
          }
          this.clickCnt = 0
          clearTimeout(timer)
        }, 300)
      },
      handleEmpChecked(node) {
        this.$emit('empChange', node)
        this.popoverVisible = false
      },
      handlePopoverShow() {
        //
      },
      createTree(tree, data) {
        if (!tree.length) return
        tree.forEach(val => {
          const children = data.filter(v => v.PID === val.KeyID)
          if (children.length) {
            val.children = children
          }
          this.createTree(children, data)
        })
        return tree
      }
    },
    created() {
      const Type = this.allCompany ? 3 : 1
      ShowStaffRelationIntoByEmployeeID({ Type }).then(({ Data }) => {
        const topVal = Data.filter(v => !v.PID)
        this.treeData = this.createTree(topVal, Data)
        this.defaultExpanded = this.treeData.map(v => v.KeyID)
      })
    }
  }
</script>

<style lang="scss" scoped>
  .select-emp-container {
    .bottom {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-end;
      position: absolute;
      bottom: 0;
      height: 30px;
      right: 0;
    }
    position: relative;
    .select-emp-tree,
    .select-emp-list {
      height: 200px;
      user-select: none;
    }
    .select-multi-tree {
      height: 200px;
    }
    .select-emp-tag {
      height: 200px;
      padding-bottom: 26px;
    }
    .select-emp-tip {
      height: 19px;
      font-size: 12px;
      color: #999;
      vertical-align: bottom;
      padding-left: 10px;
      letter-spacing: 2px;
    }
  }
</style>