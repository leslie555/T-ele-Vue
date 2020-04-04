<template>
  <el-cascader
    ref="cascader"
    separator=">"
    filterable
    :options="tree"
    :props="defaultOptions"
    v-model="structure"
    @change="handleChange"
    clearable
  ></el-cascader>
</template>

<script>
  import { ShowOrganizationList } from '../../api/report.js'
  import { ShowOrganizationMeWireList, ShowShareOrganizationMeWireList } from '../../api/system'
  import { findNodeByArr } from '@/utils/getStructure/findNodeByArr'
  import getCompanyStructure from '@/utils/getCompanyStructure'

  export default {
    name: 'SelectStore',
    props: {
      type: {
        type: String,
        default: 'report'
      }
    },
    data() {
      return {
        defaultOptions: {
          value: 'id',
          checkStrictly: true,
          expandTrigger: 'hover'
        },
        tree: [],
        structure: []
      }
    },
    created() {
      if (this.type === 'report') {
        ShowOrganizationList().then(res => {
          this.tree = getCompanyStructure(res.Data.Filiale, res.Data.BigShop, res.Data.Subbranch)
        })
      } else if (this.type === 'search') {
        ShowOrganizationMeWireList().then(res => {
          this.tree = getCompanyStructure(res.Data.Filiale, res.Data.BigShop, res.Data.Subbranch)
        })
      } else if (this.type === 'house') {
        ShowShareOrganizationMeWireList().then(res => {
          this.tree = getCompanyStructure(res.Data.Filiale, res.Data.BigShop, res.Data.Subbranch)
        })
      }
    },
    methods: {
      handleChange(val) {
        console.log(val)
        if (!val || val.length === 0) {
          this.$emit('change', '')
        } else {
          this.$emit('change', findNodeByArr(this.tree, val))
        }
        this.$refs.cascader.dropDownVisible = false
      },
      reset() {
        this.structure = []
      }
    }
  }
</script>

<style scoped>
</style>
