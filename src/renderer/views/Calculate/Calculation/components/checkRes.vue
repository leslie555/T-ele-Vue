<template>
  <el-dialog title="查看结果" :visible.sync="isShowDialog" @close="closeDialog" width="680px" center append-to-body>
    <div class="dialogContent" style="height: 400px; overflow: auto;">
      <el-row>
        <el-form :inline="true" label-width="120px">
          <!-- <el-row>
            <el-form-item label="房源名称:">
              <span>中德联邦第二期开区13栋3单元3402</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="管家:">
              李雄 &emsp; 13890908765
            </el-form-item>
          </el-row> -->
          <el-row>
            <el-form-item label="总业绩:">
              <span class="ContentMsg">{{ HouseRes.TotalPerformance }}</span>元
            </el-form-item>
            <el-form-item label="预留业绩:">
              <span class="ContentMsg">{{ HouseRes.ReservePerformance }}</span>元
            </el-form-item>
            <el-form-item label="业务员业绩:">
              <span class="ContentMsg">{{ HouseRes.TotalTheoreticalPerformance }}</span>元
            </el-form-item>
          </el-row>
        </el-form>
        <div class="tableList">
          <table>
            <tr class="tableListItem" v-for="(item, index) in Accessibles" :key="index">
              <td class="tableDataTitle">{{ index + 1 }}次已入</td>
              <td class="tableDataMsg">{{ item.AlreadyPerformance }}元</td>
              <td class="tableDataTitle">时间</td>
              <td class="tableDataMsg">{{ $dateFormat(item.Time) }}</td>
            </tr>
          </table>
        </div>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default({
    name: 'checkRes',
    data() {
      return {
        isShowDialog: false,
        list: [
          {
            can: 2220,
            nocan: 2459
          },
          {
            can: 2220,
            nocan: 2459
          },
          {
            can: 2220,
            nocan: 2459
          },
          {
            can: 2220,
            nocan: 2459
          },
          {
            can: 2220,
            nocan: 2459
          },
          {
            can: 2220,
            nocan: 2459
          },
          {
            can: 2220,
            nocan: 2459
          },
          {
            can: 2220,
            nocan: 2459
          },
          {
            can: 2220,
            nocan: 2459
          }
        ],
        HouseRes: {
          // 总业绩
          TotalPerformance: '',
          // 预留业绩
          ReservePerformance: '',
          // 理论总业绩
          TotalTheoreticalPerformance: ''
        },
        Accessibles: []
      }
    },
    methods: {
      closeDialog() {
        this.isShowDialog = false
      },
      open(data) {
        this.isShowDialog = true
        if (!data) {
          this.closeDialog()
          this.$message({
            type: 'warning',
            message: '暂无测算结果'
          })
        } else {
          this.HouseRes = data
          if (data.Accessibles.length > 0) {
            this.Accessibles = data.Accessibles
          }
        }
      }
    }
  })
</script>
<style lang="scss" scoped>
.el-form-item{
  margin-bottom: 10px;
}
.dialogContent{
  .ContentMsg{
    color: #389ef2 ;
  }
  .tableList{
    width: 400px;
    margin: 0 auto;
    box-sizing: border-box;
    text-align: center;
    table{
      border-collapse: collapse;
    }
    .tableListItem{
      width: 100%;
      td{
        width: 100px;
        height: 30px;
        vertical-align: middle;
        border: 1px solid #999999;
      }
      .tableDataTitle{
        background: #f3f9fe;
      }
    }
  }
}
</style>

