<template>
  <div>
    <el-dialog title="指派" :center="true" width="500px" append-to-body :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="指派保洁人员" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { EditCleaning } from '@/api/purchase'
export default {
  name: 'AssginDialog',
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        region: ''
      },
      list: {}
    }
  },
  methods: {
    open(dataList) {
      this.list = this.$deepCopy(dataList)
      console.log(this.list)
      this.dialogFormVisible = true
    },
    subBtn() {
      EditCleaning(this.list).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>