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
    <div v-if="judge.secondModule">
      <secondModule @changeRecords='getChangeRecords' :identify='header[1]'></secondModule>
    </div>
    
  </div>
</template>
<style scoped lang="scss">
  @import "style";
</style>
<script>
  import firstModule from '../ContractLandlordList/firstSelect.vue'
  import secondModule from '../ContractLandlordList/secondSelect.vue'

  export default {
    name: 'ContractLandlordList',
    components: {
      firstModule,
      secondModule
    },
    data() {
      return {
        tabKey: 'firstModule',
        header: [
            { title: '到期未退房', key: 'firstModule', id: '0' }
            // { title: '未审核', key: 'secondModule' }
        ],
        judge: {
            firstModule: true,
            secondModule: false
        }
      }
    },
    computed: {

    },
    created() {
    },
    // activated() {
    //   this.$refs.bottomToolBar.search(1)
    // },
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
