<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="私客" name="0" >
        <SelfTable ref="SelfTable" ></SelfTable>
      </el-tab-pane>
      <el-tab-pane label="公客" name="1">
        <PubTable ref="PubTable" @changeData="changeData" :firstRequest="isPubFirstFetch"></PubTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SelfTable from './SelfTable'
import PubTable from './PubTable'

export default {
  name: 'R_Owner',
  components: {
    SelfTable,
    PubTable
  },
  data() {
    return {
      activeName: '0',
      isPubFirstFetch: false
    }
  },
  methods: {
    changeData(data) {
      const newData = this.$deepCopy(data)
      newData.ClientType = 0
      this.$refs.SelfTable.changeData(newData)
    },
    handleClick() {
      if (this.activeName === '1' && !this.isPubFirstFetch) {
        this.$refs.PubTable.search()
        this.isPubFirstFetch = true
      }
    }
  }
}
</script>

<style lang="scss">
.data-list-tab-inline {
  top: 184px;
}
</style>
