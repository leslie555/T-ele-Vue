<template>
  <el-dialog
    :visible="showMoreVisible"
    append-to-body
    @close="dialogClose"
    title="合同信息"
    @open="handleOpen"
    :center="true"
    width="800px"
  >
    <div class="container">
      <el-scrollbar class="vertical-scroll">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="房东信息" name="first">
            <owner-tab ref="ownerTab" :houseKey="houseKey" :houseInfo="houseInfo"></owner-tab>
          </el-tab-pane>
          <el-tab-pane label="租客信息" name="second">
            <tenant-tab ref="tenantTab" :houseID="houseID"></tenant-tab>
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="dialogClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import OwnerTab from './OwnerTab'
  import TenantTab from './TenantTab'
  export default {
    name: 'ShowMore',
    components: {
      OwnerTab,
      TenantTab
    },
    props: {
      showMoreVisible: {
        type: Boolean,
        default: true
      },
      houseInfo: Object,
      houseKey: {
        type: String,
        default: ''
      },
      houseID: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
      handleOpen() {
        this.activeName = 'first'
        this.$nextTick(() => {
          this.$refs.ownerTab.fetchData()
          this.$refs.tenantTab.fetchData()
        })
      },
      dialogClose() {
        this.$emit('close')
      },
      handleClick(tab, event) {
        console.log(tab, event)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    height: 520px;
  }
</style>
