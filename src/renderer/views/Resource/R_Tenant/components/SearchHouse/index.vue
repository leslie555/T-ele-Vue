<template>
  <el-dialog
    :visible="FormVisible"
    @close="close"
    title="搜索房源"
    :center="true"
    width="400px"
    append-to-body
  >
    <el-form
      :model="form"
      label-position="right"
      label-width="100px"
      :inline="true"
      style="overflow: auto;"
      ref="FinancialSubjectEditForm">
      <el-form-item label="房源名称">
        <search-house v-model="form.HouseName"
                      :type="1"
                      @select="handleHouseSelect"></search-house>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ConfirmChoose">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import SearchHouse from '../../../../../components/SearchHouse/index'

  export default {
    name: 'ChooseHouse',
    components: {
      SearchHouse
    },
    data() {
      return {
        FormVisible: false,
        houseData: {},
        form: {
          HouseName: ''
        }
      }
    },
    methods: {
      open() {
        this.FormVisible = true
      },
      handleHouseSelect(val) {
        this.form.HouseName = val.HouseName
        this.houseData = val
      },
      ConfirmChoose() {
        if (this.form.HouseName === '') {
          this.$message({
            type: 'warning',
            message: '请选择带看房源'
          })
          return false
        }
        this.$emit('GetSearchData', this.houseData)
        this.form.HouseName = ''
        this.houseData = {}
        this.close()
      },
      close() {
        this.FormVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
