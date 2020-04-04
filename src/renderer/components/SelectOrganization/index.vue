<template>
  <el-form-item v-if="!isEmpty" label="组织架构" :prop="prop">
    <el-cascader
      ref='cascader'
      separator=">"
      :clearable="!IsRequired"
      :options="treeData"
      @change="handleChange"
      @expand-change="handleParentChange"
      :props="defaultOptions"
      v-model="organID"
    ></el-cascader>
  </el-form-item>
</template>

<script>
  import { findNodeByArr, getTreeNodeByValue } from '@/utils/arrUtil/treeArr'
  import { mapState } from 'vuex'

  export default {
    name: 'SelectOrganization',
    props: {
      value: String,
      type: {
        type: Number,
        default: 1
      },
      prop: {
        type: String,
        default: 'FullIDNew'
      }
    },
    data() {
      return {
        defaultOptions: {
          label: 'SysName',
          value: 'KeyID',
          expandTrigger: 'hover',
          checkStrictly: true
        },
        markDisbale: false
      }
    },
    computed: {
      ...mapState({
        // treeData: state => state.organizationTree.treeData[this.type],
        isEmpty: state => state.organizationTree.isEmpty,
        IsRequired: state => state.user.userinfo.IsRequired // 新组织是否必须默认
      }),
      treeData() {
        return this.$store.state.organizationTree.treeData[this.type] || []
      },
      organID: {
        get() {
          const str =
            this.value[this.value.length - 1] === '-'
              ? this.value.slice(0, this.value.length - 1)
              : this.value
          const value = parseInt(str.split('-').pop())
          if (value) {
            return getTreeNodeByValue(this.treeData, value, this.defaultOptions)
              .pathArr
          } else {
            return []
          }
        },
        set(val) {
          const node = findNodeByArr(
            this.treeData,
            val,
            undefined,
            this.defaultOptions
          )
          this.$emit('input', node ? node.FullID : '')
        }
      }
    },
    methods: {
      handleChange(val) {
        // if (
        //   val.length === 1 &&
        //   !findNodeByArr(this.treeData, val, null, this.defaultOptions).children
        // ) {
        //   this.markDisbale = true
        // }
        // 关闭弹框
        this.$emit('change', val)
        this.$refs.cascader.dropDownVisible = false
      },
      handleParentChange(val) {
        // console.log(this.$refs.cascader)
        // this.$refs.cascader.panel.$el.onclick = e => {
        //   // if (e.srcElement.nodeName === 'LI') {
        //     debugger
        //     if (
        //       !this.markDisbale &&
        //       findNodeByArr(this.treeData, val, null, this.defaultOptions)
        //         .children
        //     ) {
        //       debugger
        //       // this.$emit('change', val)
        //       this.organID = val
        //       this.handleChange(val)
        //       // 如果为叶子节点则不添加onclick
        //       // this.$refs.cascader.handleClick(val)
        //       this.$refs.cascader.dropDownVisible = false
        //     } else {
        //       this.markDisbale = false
        //     }
        //   // }
        // }
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
    watch: {
      value: {
        handler(val) {
          if (val === '' && this.type === 1 && this.IsRequired && !this.isEmpty) {
            const KeyID = this.treeData.reduce((pre, cur) => {
              return pre > cur.KeyID ? cur.KeyID : pre
            }, Infinity)
            this.organID = getTreeNodeByValue(
              this.treeData,
              KeyID,
              this.defaultOptions
            ).pathArr
          }
        },
        immediate: true
      }
    },
    mounted() {
      this.$store.dispatch('initOrganization', this.type)
    }
  }
</script>

<style lang="scss">
  // .el-cascader-panel .el-scrollbar  {
  //   .el-radio__inner{
  //     border: 0px !important;
  //     background-color:inherit
  //   }
  //   .el-radio__input.is-checked .el-radio__inner{
  //     background:none
  //   }
  //   .el-radio{
  //     height: 100%;
  //     width: 150px;
  //     position: absolute;
  //   }
    // .el-cascader-node.is-selectable.in-active-path {
    //   color: #409EFF !important;
    // }
  // }
</style>
