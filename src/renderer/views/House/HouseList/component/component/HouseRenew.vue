<template>
  <el-dialog title="修改是否续约状态" :visible.sync="visible" center width="500px" append-to-body>
    <el-form>
      <el-form-item label="是否续约">
        <el-select v-model="form.status">
          <el-option
            :label="item.Description"
            :value="item.Value"
            v-for="item in HouseRenewList"
            :key="item.Value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { EditHouseWhetherRentOut } from '@/api/house'

  export default ({
    name: 'HouseRenew',
    data() {
      return {
        visible: false,
        loading: false,
        remark: '',
        form: {
          status: 0
        },
        HouseRenewList: []
      }
    },
    methods: {
      open({
             status = 0,
             type = 2, // 1 装修申请 2 房态图
             HouseID = 0,
             HouseKey = 0
           }) {
        this.form.status = status
        this.form.Type = type
        if (type === 1) {
          this.form.HouseKey = HouseKey
          this.HouseRenewList = [
            {
              Value: 0,
              Description: '不可租'
            },
            {
              Value: 1,
              Description: '可租'
            }
          ]
        } else {
          this.form.HouseID = HouseID
          this.HouseRenewList = [
            {
              Value: 0,
              Description: '待确定'
            },
            {
              Value: 1,
              Description: '不续约'
            }
          ]
        }
        this.visible = true
      },
      submitForm() {
        this.loading = true
        this.form[this.form.Type === 1 ? 'WhetherRentOut' : 'IsContractExtension'] = this.form.status
        EditHouseWhetherRentOut(this.form).then(({ Data }) => {
          this.loading = false
          this.$emit('handleSuccess', {
            status: this.form.status,
            HouseID: this.form.HouseID,
            HouseKey: this.form.HouseKey
          })
          this.$message({
            message: '设置成功',
            type: 'success'
          })
          this.visible = false
          this.$emit('refresh', 'Ok')
        }).catch(() => {
          this.loading = false
        })
      }
    }
  })
</script>
