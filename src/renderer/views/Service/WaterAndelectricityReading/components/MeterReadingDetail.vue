<template>
  <el-dialog
    title="水电气详情"
    :visible.sync="MeterReadingDialog"
    width="800px"
    v-loading="loading"
    :append-to-body="true"
    center
  >
    <!--<el-form :inline="true" label-width="100px" :model="PayMentEditFormData" ref="PayMentEditFormData">-->
    <div class="sign-div">
      <div class="sign-content">
        <p>房源名称: {{newData.HouseName || '无'}}</p>
        <p>水表用量:{{newData.WaterNumber || '无'}}</p>
        <p>电表用量:{{newData.ElectricityNumber || '无'}}</p>
        <p>燃气表用量:{{newData.GasNumber|| '无'}}</p>
        <p>热水表用量:{{newData.HotWaterNumber || '无'}}</p>
        <p>冷水表用量:{{newData.ColdWaterNumber || '无'}}</p>
      </div>
      <div class="sign-content">
        <p>&nbsp</p>
        <p>水表单价:{{newData.WaterPrice +'元' || '无'}}</p>
        <p>电表单价:{{newData.ElectricityPrice +'元' || '无'}}</p>
        <p>燃气表单价:{{newData.GasPrice +'元' || '无'}}</p>
        <p>热水表单价:{{newData.HotWaterPrice +'元' || '无'}}</p>
        <p>冷水表读数:{{newData.ColdWaterPrice +'元' || '无'}}</p>
      </div>
    </div>

    <!--</el-form>-->
    <div slot="footer">
      <el-button @click="SubmitCancel" type="info">取 消</el-button>
      <el-button type="primary" @click="SubmitRequire">确 认</el-button>
    </div>
  </el-dialog>
</template>

<script>
   import { LookMeterDetail } from '@/api/service' // 详情的接口
  export default {
    name: 'meter-reading-detail',
    data() {
      return {
        loading: false,
        MeterReadingDialog: false,
        newData: {}
      }
    },
    methods: {
      open(row) {
        debugger
        this.loading = true
        this.MeterReadingDialog = true
        return LookMeterDetail(
             row
        ).then(({ Data, MSg, BusCode }) => {
          this.newData = Data
          this.loading = false
        })
      },
      Close() {
        this.MeterReadingDialog = false
      },
      SubmitCancel() {
        this.Close()
      },
      SubmitRequire() {
        this.Close()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
  .sign-div {
  @include displayFlex(row, stretch, space-around);
  .sign-content {
    flex: 1;
  }
 }
  p{
    margin-bottom: 10px;
  }
</style>
