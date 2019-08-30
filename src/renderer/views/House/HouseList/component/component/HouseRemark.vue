<template>
  <el-dialog title="房源备注" :visible="visible" @close="CloseRemark" center width="500px" append-to-body>
    <el-form>
      <el-form-item label="备注">
        <el-input type="textarea" :rows="6" style="width: 400px;" v-model="remark"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button size="small" type="primary" @click="submitRemark">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import { editHouseInfoRemark } from '@/api/house'

  export default({
    name: 'HouseRemark',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      HouseRemark: {
        type: String,
        default: ''
      },
      HouseInfo: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        remark: this.HouseInfo.HouseRemark
      }
    },
    methods: {
      CloseRemark() {
        this.$emit('CloseRemark')
      },
      submitRemark() {
        editHouseInfoRemark({
          HouseRemark: this.remark,
          KeyID: this.HouseInfo.KeyID
        }).then(response => {
          if (response.Code === 0) {
            this.$emit('ChangeRemark', this.remark)
            this.$message({
              message: '备注成功',
              type: 'success'
            })
            this.CloseRemark()
          }
        })
      }
    }
  })
</script>
