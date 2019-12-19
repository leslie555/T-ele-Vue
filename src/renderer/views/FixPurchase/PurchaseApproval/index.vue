<template>
  <div class="app-container data-list" style="left: 120px;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="装修" name="1">
        <ApprovalList :type="type"></ApprovalList>
      </el-tab-pane>
      <el-tab-pane lazy label="维修" name="2">
        <ApprovalList :type="type"></ApprovalList>
      </el-tab-pane>
      <el-tab-pane lazy label="保洁" name="3">
        <ApprovalList :type="type"></ApprovalList>
      </el-tab-pane>
      <el-tab-pane lazy label="搬家" name="4">
        <ApprovalList :type="type"></ApprovalList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import ApprovalList from './components/ApprovalList.vue'
  export default {
    name: 'PurchaseApproval',
    components: {
      ApprovalList
    },
    data() {
      return {
        type: 1,
        activeName: '1'
      }
    },
    methods: {
      handleClick(tab, event) {
        this.type = +tab.name
      }
    }
  }
</script>