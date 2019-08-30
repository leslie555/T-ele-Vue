<template>
  <el-dialog title="房源发布" :visible="visible" @close="close" center width="400px" append-to-body>
    <el-form>
      <el-form-item label="入住日期">
        <el-date-picker type="date" v-model="PushDate" size="small" style="width: 200px;"></el-date-picker>
      </el-form-item>
      <el-form-item label="发布平台">
        <el-checkbox-group v-model="planteArr">
          <el-checkbox
            disabled="true"
            v-for="item in PlanteList"
            :key="item.value"
            :label="item.label"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button size="small" type="primary" @click="submit" :loading="pushLoading">发布</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { ReleaseHouse } from '@/api/house'
export default ({
  name: 'HosuePush',
  data() {
    return {
      remark: '',
      houseID: 0,
      pushLoading: false,
      visible: false,
      planteArr: ['乐租'],
      PushDate: '',
      PlanteList: [{
        label: '乐租',
        value: '乐租'
      }]
    }
  },
  methods: {
    open(houseID) {
      this.visible = true
      this.houseID = houseID
    },
    close() {
      this.pushLoading = false
      this.visible = false
    },
    submit() {
      this.pushLoading = true
      ReleaseHouse({
        houseID: this.houseID
      }).then(res => {
        this.$emit('submit', this.planteArr)
        this.$message({
          message: '修改管房人成功!',
          type: 'success'
        })
        this.close()
      }).catch(() => {
        this.pushLoading = false
      })
    }
  }
})
</script>
