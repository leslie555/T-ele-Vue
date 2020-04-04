<template>
  <el-cascader
    ref="cascader"
    separator=">"
    expand-trigger="hover"
    :options="tree"
    @expand-change="handleParentChange"
    :props="defaultOptions"
    v-model="structure"
    @change="handleChange"
  ></el-cascader>
</template>

<script>
  import { findNodeByArr } from '@/utils/getStructure/findNodeByArr'
  import getStructure from '@/utils/getStructure'
  import {
    SelectBusinessDepList
  } from '@/api/system'
  export default {
    name: 'SelectDepartment',
    data() {
      return {
        defaultOptions: {
          value: 'id'
        },
        tree: [],
        structure: []
      }
    },
    created() {
      SelectBusinessDepList({ BusinessID: this.$store.getters.userinfo.BusinessID, Type: 3 }).then(res => {
        this.tree = getStructure(res.Data.ComList, res.Data.DepList)
        this.filter(this.tree)
      })
    },
    methods: {
      handleChange(val) {
        // this.form.FullID = ''
        // this.getFullID(val)
        this.$emit('change', findNodeByArr(this.tree, val))
      },
      handleParentChange(val) {
        this.$refs.cascader.menu.$el.onclick = (e) => {
          if (e.srcElement.nodeName === 'LI') {
            if (val[val.length - 1] > 100000 && findNodeByArr(this.tree, val).children) { // val最后一项大于100000代表是部门,且如果为叶子节点则不添加onclick
              this.$refs.cascader.handlePick(val)
            }
          }
        }
      },
      filter(tree) {
        for (let i = 0; i < tree.length; i++) {
          const val = tree[i]
          if (!val.children && val.type === 'CompanyID') {
            val.disabled = true
          } else if (val.children) {
            this.filter(val.children)
          }
        }
      }
    }
  }
</script>

<style>
</style>
