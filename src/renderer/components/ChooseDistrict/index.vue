<template>
  <el-autocomplete
    class="inline-input"
    v-model="CommunityName"
    :fetch-suggestions="querySearch"
    placeholder="请输入小区"
    :trigger-on-focus="false"
    @select="handleSelect"
  >
  </el-autocomplete>
</template>

<script>
  import { searchCommunityList } from '@/api/owner'
  export default {
    name: 'index',
    data() {
      return {
        CommunityName: '',
        districtList: [] // 小区列表数据
      }
    },
    methods: {
      querySearch(CommunityName, cb) {
        debugger
         searchCommunityList({
           IsPage: false,
          CommunityName: CommunityName
        }).then(response => {
           this.districtList = response.Data.rows
          if (this.districtList.length > 0) {
             this.districtList.forEach(ele => {
                this.districtList.push({
                  value: ele.CommunityName
                })
              })
            cb(this.districtList)
            // this.districtList = response.Data.rows
          } else if (this.districtList.length === 0) {
            this.districtList = [{ value: '暂无小区数据' }]
          }
        }).catch(() => {
           this.districtList = [{ value: '暂无小区数据' }]
        })
      },
      handleSelect(item) {
        this.$emit('select', item)
      }
    }
  }
</script>

<style scoped>

</style>
