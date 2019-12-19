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
        <el-row v-if="multi">
          <el-col :span="16">
            <div class="select-multi-tree">
              <el-scrollbar class="vertical-scroll">
                <el-tree
                  ref="tree"
                  :data="treeData"
                  node-key="id"
                  @check="handleNodeCheck"
                  show-checkbox
                  :expand-on-click-node="false"
                ></el-tree>
              </el-scrollbar>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="select-emp-tag">
              <el-scrollbar class="vertical-scroll">
                <el-tag
                  v-for="tag in empTags"
                  :key="tag.id"
                  :closable="true"
                  size="small"
                  @close="handleTagClose(tag)"
                >{{tag.label}}</el-tag>
              </el-scrollbar>
            </div>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="16">
            <div class="select-emp-tree">
              <el-scrollbar class="vertical-scroll">
                <el-tree
                  highlight-current
                  :data="treeData"
                  node-key="id"
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
                  :props="defaultProps"
                  @node-click="handleEmpChecked"
                ></el-tree>
              </el-scrollbar>
            </div>
          </el-col>
        </el-row>
        <div v-if="multi" class="bottom">
          <el-button type="text" @click="handleConfirm">确定</el-button>
          <el-button type="text" @click="handleCancle">取消</el-button>
        </div>
        <div v-else-if="canSelectDep" class="select-emp-tip">单击箭头展开,双击节点选中</div>
      </div>
    </el-popover>
    <span v-popover:popover>
      <slot></slot>
    </span>
  </span>
</template>

<script>
  import getStructure from '@/utils/getStructure'
  // import { findNodeByID } from '@/utils/getStructure/findNodeByID'
  import { selectAuthority, getStaff, getStaffAndPrincipal, selectfunctionaryComAuthority, ShowOrganization } from '@/api/system'
  // import { selectMyHouseEmp } from '@/api/house'
  import { clearTimeout } from 'timers'
  export default {
    props: {
      multi: { // 是否为多选
        type: Boolean,
        default: false
      },
      existedEmp: { // 多选时需传入一个已有的人员的数组
        type: Array,
        default: () => []
      },
      allCompany: { //  true可选当前企业下所有的数据,false选当前人所在公司的数据
        type: Boolean,
        default: false
      },
      canSelectDep: { // 单选时是否可以双击选择部门
        type: Boolean,
        default: true
      },
      hasPrincipal: { // 单选时点击节点后是否能选取公司负责人
        type: Boolean,
        default: true
      },
      companyID: { // 指定某个公司下的所有数据的公司ID
        type: [String, Number],
        default: 0
      },
      tips: { // 多选是否需要为空的提示
        type: String,
        default: ''
      }
      /* companyPrincipal: { // 换公司负责人时公司的原有负责人信息
        type: Array,
        default: () => []
      }, */

    },
    data() {
      return {
        treeData: [],
        defaultExpanded: [], // 默认展开数组
        employList: [],
        popoverVisible: false,
        form: {},
        defaultProps: {
          label: 'UserName'
        },
        clickCnt: 0, // 判断用户双击还是单击
        node: null,
        oldEmps: [],
        empTags: [],
        catchedEmps: [] // 已有的管房人
      }
    },
    methods: {
      handleNodeCheck(val1, val2) {
        const emps = val2.checkedNodes.filter(v => v.type === 'EmployeeID')
        this.empTags = emps
      },
      handleTagClose(tag) {
        const index = this.empTags.indexOf(tag)
        if (index !== -1) {
          this.$refs.tree.setChecked(this.empTags[index].id, false)
          this.empTags.splice(index, 1)
        }
      },
      handleNodeClick(node) {
        this.clickCnt++
        const timer = setTimeout(() => {
          if (this.canSelectDep && this.clickCnt === 2) {
            this.$emit('dbClick', node)
            this.popoverVisible = false
          } else if (this.clickCnt === 1) {
            if (node.type === 'CompanyID') {
              this.form = { CompanyID: node.id }
            }
            if (node.type === 'DepartmentID') {
              this.form = { DepartmentID: node.id }
            }
            if (this.hasPrincipal) {
              getStaffAndPrincipal(this.form).then(res => {
                this.employList = res.Data
              })
            } else {
              getStaff(this.form).then(res => {
                this.employList = res.Data
              })
            }
          }
          this.clickCnt = 0
          clearTimeout(timer)
        }, 300)
      },
      handleEmpChecked(node) {
        this.$emit('empChange', node)
        this.popoverVisible = false
      },
      handleConfirm() {
        this.catchedEmps = this.empTags
        if (!this.empTags.length && this.tips) {
          this.$message.error(`请至少选择一个${this.tips}`)
        } else {
          const newEmps = this.empTags.map(v => {
            return {
              KeyID: v.id,
              UserName: v.label,
              FullID: v.fullID
            }
          })
          const diffedEmps = this.$DiffArrFn(this.oldEmps, newEmps, ['KeyID'])
          this.$emit('select', diffedEmps)
          this.popoverVisible = false
        }
      },
      handleCancle() {
        this.popoverVisible = false
      },
      handlePopoverShow() {
        if (this.companyID) {
          selectfunctionaryComAuthority({ CompanyID: this.companyID }).then(res => {
            this.treeData = getStructure(
              res.Data.ComList,
              res.Data.DepList,
              res.Data.EmpList,
              'children'
            )
            this.initMutiData()
            const empIDs = this.catchedEmps.map(v => v.id)
            this.empTags = [...this.catchedEmps]
            this.$refs.tree.setCheckedKeys(empIDs)
          })
        } else {
          if (this.multi) {
            this.initMutiData()
            const empIDs = this.catchedEmps.map(v => v.id)
            this.empTags = [...this.catchedEmps]
            this.$refs.tree.setCheckedKeys(empIDs)
          }
        }
      },
      /*       getCompanyOrganism() {
              selectfunctionaryComAuthority({ CompanyID: this.companyID }).then(res => {
                this.treeData = getStructure(
                  res.Data.ComList,
                  res.Data.DepList,
                  res.Data.EmpList,
                  'children'
                )
                this.catchedEmps = this.companyPrincipal
                this.oldEmps = this.companyPrincipal.map(v => {
                  return {
                    KeyID: v.id,
                    UserName: v.label,
                    FullID: v.fullID
                  }
                })
              })
            }, */
      initMutiData() {
        if (this.multi) {
          this.catchedEmps = this.existedEmp.map(val => {
            return {
              id: val.KeyID,
              label: val.UserName,
              fullID: val.FullID
            }
          })
          this.oldEmps = this.existedEmp.map(v => {
            return {
              KeyID: v.KeyID,
              UserName: v.UserName,
              FullID: v.FullID
            }
          })
        }
        this.defaultExpanded = this.treeData.reduce((pre, cur) => {
          return cur.children ? [...pre, ...cur.children.map(v => v.id)] : [...pre]
        }, [])
      }
    },
    created() {
      if (this.allCompany) {
        /*  Level:锁定到哪一级数据 1.只返回企业数据  2.返回企业和公司数据 3.返回企业公司和部门数据 4.返回企业公司部门和人员数据</>
   Type: 数据类型 1:展示企业下所有数据 2.展示主公司下面的所有数据包括自己那一条线的上面的数据  3.展示自己下面的数据 包括自己那一条线的上面的数据 4.只展示自己下面的数据 */
        const Level = this.multi ? 4 : 3
        ShowOrganization({ Type: 2, Level }).then(res => {
          this.treeData = getStructure(res.Data.ComList, res.Data.DepList, res.Data.EmpList, 'children'
          )
          this.initMutiData()
        })
      } else if (!this.CompanyID) {
        const HasEmp = this.multi ? 1 : 0
        selectAuthority({
          HasEmp
        }).then(res => {
          this.treeData = getStructure(res.Data.ComList, res.Data.DepList, res.Data.EmpList, 'children')
          this.initMutiData()
        })
      }
      /* if (this.multi) {
        SelectTubeRoomEmp({
          HasEmp: 1
        }).then(res => {
          this.treeData = getStructure(
            res.Data.ComList,
            res.Data.DepList,
            res.Data.EmpList,
            'children'
          )
          if (this.houseKey.length) { // 如果传入houseKey才调接口
            selectMyHouseEmp({
              MyHouseKey: this.houseKey
            }).then(res => {
              this.catchedEmps = res.Data.map(val => {
                return {
                  id: val.KeyID,
                  label: val.UserName,
                  fullID: val.FullID
                }
              })
              this.oldEmps = res.Data.map(v => {
                return {
                  KeyID: v.KeyID,
                  UserName: v.UserName,
                  FullID: v.FullID
                }
              })
            })
          }
        })
      } */
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