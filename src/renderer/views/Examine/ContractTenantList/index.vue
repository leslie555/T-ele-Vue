<template>
  <div class="app-container data-list addContainer">
    <el-tabs v-model="tabKey" @tab-click="handleClick">
      <el-tab-pane 
          v-for="title in header"
          :label="title.title" 
          :name="title.key" 
          :key="title.key">
      </el-tab-pane>
    </el-tabs>

    <div v-if="judge.firstModule">
      <firstModule @changeRecords='getChangeRecords' :identify='header[0]'></firstModule>
    </div>
    
  </div>
</template>
<style scoped lang="scss">
  @import "style";
</style>
<script>
  import firstModule from '../ContractTenantList/firstModule'

  export default {
    name: 'ContractTenantList',
    components: {
      firstModule
    },
    data() {
      return {
        tabKey: 'firstModule',
        header: [
            { title: '到期未退房', key: 'firstModule', id: '0' }
        ],
        judge: {
            firstModule: true
        }
      }
    },
    computed: {

    },
    created() {
    },
    methods: {
      // tab点击回调事件
       handleClick(tab, event) {
        for (let i = 0; i < this.header.length; i++) {
          if (this.header[i].key === tab.name) {
            this.judge[this.header[i].key] = true
          } else {
            this.judge[this.header[i].key] = false
          }
        }
      },
      getChangeRecords(data, obj) {
        this.header[obj.id].title = '到期未退房' + '(' + data.records + ')'
      }
    }
  }
</script>
