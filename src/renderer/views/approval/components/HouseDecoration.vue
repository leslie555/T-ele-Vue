<template>
  <el-dialog
    :visible="visible"
    @close="CloseDecoration"
    width="600px"
    title="装修设置"
    :center="true"
    custom-class="dialogRadius"
    append-to-body
  >
    <el-form label-width="120px" :model="DecorationForm" :inline="true" ref="DecorationForm">
      <div class="clearfix">
        <el-form-item label="实际装修时间:">
          <span class="valueColor">{{ $dateFormat(DecorationForm.ActDecorateStartTime) }}</span>
          <span>至</span>
          <span class="valueColor">{{ $dateFormat(DecorationForm.ActDecorateEndTime) }}</span>
        </el-form-item>
      </div>
      <div class="clearfix">
        <el-form-item label="共用金额:">
          <span class="valueColor">{{ DecorationForm.DecorateMoeny }}&nbsp;</span>元
        </el-form-item>
      </div>
      <div class="clearfix">
        <el-form-item label="应收款时间:">
          <span class="valueColor">{{ $dateFormat(DecorationForm.ReceivablesDate) }}</span>
        </el-form-item>
      </div>
      <div class="clearfix">
        <el-form-item label="是否使用装修贷:">
          <span class="valueColor">{{ DecorationForm.IsLoan ? '是' : '否' }}</span>
          <!-- <el-checkbox v-model="DecorationForm.IsLoan">是否使用装修贷</el-checkbox> -->
        </el-form-item>
        <el-form-item label="贷款金额:" v-if="DecorationForm.IsLoan">
          <span class="valueColor">{{ DecorationForm.LoanMoeny }}&nbsp;</span>元
          <!-- <el-input style="width: auto;" size="small" v-model="DecorationForm.LoanMoeny"></el-input> -->
        </el-form-item>
      </div>
      <div class="clearfix">
        <el-form-item label="装修图片:">
          <div class="upload-img-Box">
            <div
              class="upload-img"
              v-for="(item, index) in DecorationForm.DecoratePicIDList"
              :key="index"
            >
              <img
                :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                @click="$seeImage($ImgUnit.getImgUrl(item.ImageLocation))"
              >
            </div>
          </div>
        </el-form-item>
      </div>
      <div class="clearfix">
        <el-form-item label="装修备注:">
          <p>{{ DecorationForm.Remark }}</p>
        </el-form-item>
      </div>
      <div class="clearfix" style="text-align: center;">
        <el-form-item>
          <el-button type="danger" plain size="small" @click="CloseDecoration">关闭</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { UploadFile } from '@/components/UploadFile'
// import { EditFitment, AddFitment } from '@/api/house'
import { FindFitment } from '@/api/house'

export default ({
  name: 'HouseDecoration',
  data() {
    return {
      isRenovationStatus: true,
      btnLoading: false,
      DecorationForm: {
        ActDecorateStartTime: '',
        ActDecorateEndTime: '',
        ReceivablesDate: '',
        DecorateMoeny: '',
        IsLoan: false,
        LoanMoeny: '',
        Remark: '',
        DecoratePicIDList: []
      },
      visible: false,
      RenovationStatus: 0
    }
  },
  components: {
    UploadFile
  },
  methods: {
    CloseDecoration() {
      this.$emit('CloseDecoration')
      this.visible = false
    },
    open(HouseKey, KeyID) {
      FindFitment({
        houseKey: HouseKey,
        houseID: KeyID
      }).then(response => {
        this.visible = true
        if (response.Data !== null && response.Data.KeyID > 0) {
          this.isNew = false
          for (var index in this.DecorationForm) {
            if (index === 'IsLoan') {
              if (response.Data[index] === '0') {
                this.DecorationForm[index] = false
              } else {
                this.DecorationForm[index] = true
              }
            } else {
              this.DecorationForm[index] = response.Data[index]
            }
          }
          this.DecorationForm.KeyID = response.Data.KeyID
        } else {
          this.DecorationForm = {
            ActDecorateTime: [],
            Time: '',
            DecorateMoeny: '',
            IsLoan: false,
            LoanMoeny: '',
            Remark: '',
            DecoratePicIDList: []
          }
        }
      })
    }
  }
})
</script>
<style lang="scss" scoped>
$configOrange: #fd9258;
$configGray: #dddddd;
$configWhite: #fffcfa;
@import "../../../styles/variables";
@import "../../../styles/mixin";

.el-form-item {
    margin-bottom: 10px;
}
.dialogRadius {
  border-radius: 6px;
}
.upload-img-Box {
  // border: 1px solid #ddd;
  border-radius: 4px;
  padding-top: 10px;
  margin-top: 10px;
  overflow: hidden;
  width: 400px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}
.upload-img {
  @include displayFlex(row, center, center);
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  margin-right: 20px;
  float: left;
  img {
    max-width: 98px;
    max-height: 100px;
    cursor: zoom-in;
  }
  .upload-paper {
    position: absolute;
    top: -2px;
    left: -2px;
  }
  i {
    position: absolute;
    right: -8px;
    top: -8px;
    line-height: normal;
    background: #fff;
    border-radius: 50%;
    color: $--color-danger;
    font-size: 17px;
    cursor: pointer;
  }
}
.valueColor {
  color: #389EF2;
}
</style>
