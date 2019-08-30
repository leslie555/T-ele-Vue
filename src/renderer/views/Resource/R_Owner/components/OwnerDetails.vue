<template>
  <el-dialog
    :visible="EditVisible"
    @close="close"
    :title="type === 1 ? '详情' : '修改'"
    :center="true"
    width="800px"
    append-to-body
  >
    <div class="topTabs">
      <div
        :class="['tabItemLeft', ActiveIndex === 1 ? 'ActiveTab' : 'NormalTab']"
        @click="changeTab(1)"
      >基本信息</div><div
        :class="['tabItemRight', ActiveIndex === 2 ? 'ActiveTab' : 'NormalTab']"
        @click="changeTab(2)"
      >操作记录</div>
      </div>
    <el-form
      v-if="ActiveIndex === 1"
      :model="EditFormData"
      label-position="right"
      label-width="100px"
      :inline="true"
      style="height: 500px; overflow: auto;"
      ref="FinancialSubjectEditForm"
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix" style="marginBottom: 10px">
          <h3 style="color: #999999">业主信息</h3>
        </div>
        <div class="clearfix">
          <el-form-item label="业主姓名:" label-position="left">
            <!-- <el-input style="width: 250px;" v-model="EditFormData.OwnerName" :maxlength="16"></el-input> -->
            <span>{{ EditFormData.OwnerName }}</span>
          </el-form-item>
          <el-form-item label="业主电话:" label-position="left">
            <span>{{ EditFormData.OwnerTel }}</span>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="期望租金:">
            <span>{{ EditFormData.ExpectedRent }}</span>
          </el-form-item>
        </div>
        <div class="clearfix" style="margin: 0 0 10px">
          <h3 style="color: #999999">房源信息</h3>
        </div>
        <div class="clearfix form-item-sm">
          <el-form-item label="小区名称:">
            <span>{{ EditFormData.CommunityName }}</span>
          </el-form-item>
          <el-form-item label="所属区域:">
            <span>{{ EditFormData.Region }}</span>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="详细地址:">
            <span>{{ `${EditFormData.DetailedAddress}${EditFormData.Tung}栋${EditFormData.Unit}单元${EditFormData.NumberPlate}号` }}</span>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="房间面积:">
            <span>{{ `${EditFormData.Area}m&sup2;` }}</span>
          </el-form-item>
          <el-form-item label="房源户型:">
            <span>{{ `${EditFormData.RoomCount}室${EditFormData.HallCount}厅${EditFormData.ToiletCount}卫`}}</span>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="房源照片:">
            <!-- <upload-file :imgList="EditFormData.HousePictureList"></upload-file> -->
            <div class="ImgBox">
              <div class="upload-img-Box">
                <div
                  class="upload-img"
                  v-for="(item, index) in EditFormData.HousePictureList"
                  :key="index"
                >
                  <img
                    :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                    @click="$seeImage($ImgUnit.getImgUrl(item.ImageLocation))"
                  >
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="房源备注:
          ">
            <span>{{ !EditFormData.Remarks ? '无' : EditFormData.Remarks }}</span>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="FollowBox" v-else>
      <div class="FollowItem" v-for="(item, index) in FollowList" :key="index">
        <div class="FollowTop">
          <div class="FollowTopLeft">
            <!-- <span>{{ $dateFormat(item.FollowUpTime, 'yyyy-MM-dd') }}</span> -->
            <span>{{ $dateFormat(item.OperationTime, 'yyyy-MM-dd') }}</span>
          </div>
          <div class="FollowTopRight">
            <span class="FollowText">{{ item.UserName }}</span>
          </div>
        </div>
        <div class="FollowBottom">
          <!-- <span class="FollowText FollowTextLeft">{{ (item.Type === 1 || item.Type === 2 || item.Type === 4) ?  `${$EnumData.getEnumDesByValue('FollowUpMode', item.OperationType)}` : `(${$EnumData.getEnumDesByValue('FollowUpMode', item.OperationType)})` }}</span> -->
          <span class="FollowText FollowTextLeft">{{ (item.Type === 1 || item.Type === 2 || item.Type === 4) ?  `${$EnumData.getEnumDesByValue('ResourceOperation', item.Type)}` : `(${$EnumData.getEnumDesByValue('ResourceOperation', item.Type)})` }}</span>
          <template v-if="item.Type === 4">
            <!-- <div v-for="(data, index) in JSON.parse(item.EditData)"
              :key = "index"
              class="FollowText "
            >
              <span class="FollowText FollowBottmRightText">{{ operationContent(data) }}</span>
            </div> -->
            <el-collapse>
              <el-collapse-item>
                <template slot="title">
                 <span>{{`1.${operationContent(JSON.parse(item.EditData)[0])}` }}</span> 
                </template>
                <div v-for="(data, index) in JSON.parse(item.EditData).slice(1)"
                  :key = "index"
                  >
                {{ `${index + 2}.${operationContent(data)}` }}
                </div>
              </el-collapse-item>
            </el-collapse>            
          </template>
          <template v-else>
            <span class="FollowText">{{ item.Content }}</span>
          </template>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { UploadFile } from '@/components/UploadFile'
// import { FindFollowUp } from '@/api/resource'
import { ShowOwnerOperationInfo } from '@/api/resource'
import { CityData, getCityNameByCode } from '@/utils/CityData'

export default ({
  name: 'OwnerDetails',
  components: {
    UploadFile
  },
  data() {
    return {
      ActiveIndex: 1,
      type: 1,
      CityData,
      EditVisible: false,
      FollowList: [],
      title: '1',
      CloneResonseData: [],
      EditFormData: {
        OwnerName: '',
        OwnerTel: '',
        ExpectedRent: '',
        CommunityName: '',
        RegionList: [],
        Region: '',
        DetailedAddress: '',
        Tung: '',
        Unit: '',
        NumberPlate: '',
        Area: '',
        RoomCount: '',
        ToiletCount: '',
        HallCount: '',
        Remarks: '',
        HousePictureList: []
      },
      btnLoading: false
    }
  },
  methods: {
    open(form) {
      // console.log(form)
      // debugger
      ShowOwnerOperationInfo({ KeyID: form.KeyID, type: 0 }).then(res => {
        this.CloneResonseData = !res.Data ? [] : res.Data.reverse()
        this.FollowList = this.CloneResonseData.filter(v => v.EditData !== '[]')
        console.log(' FollowList:', this.FollowList)
      })
      this.btnLoading = false
      this.EditVisible = true
      if (form) {
        this.EditFormData = this.$deepCopy(form)
        this.EditFormData.Region = getCityNameByCode(this.EditFormData.Region)
      }
    },
    close() {
      // this.$refs['FinancialSubjectEditForm'].resetFields()
      this.EditVisible = false
      this.EditFormData.OwnerTel = ''
      this.EditFormData.ExpectedRent = ''
      this.EditFormData.CommunityName = ''
      this.EditFormData.RegionList = []
      this.EditFormData.Region = ''
      this.EditFormData.DetailedAddress = ''
      this.EditFormData.Tung = ''
      this.EditFormData.Unit = ''
      this.EditFormData.NumberPlate = ''
      this.EditFormData.OwnerName = ''
      this.EditFormData.Area = ''
      this.EditFormData.RoomCount = ''
      this.EditFormData.ToiletCount = ''
      this.EditFormData.HallCount = ''
      this.EditFormData.Remarks = ''
      this.EditFormData.HousePictureList = []
      this.ActiveIndex = 1
    },
    changeTab(num) {
      this.ActiveIndex = num
    },
    operationContent(data) {
      if (data.Key !== 'HousePicture' && data.Key !== 'Region') {
        return `将 "${data.Comment}" ${data.LastData} 修改为 ${(data.NewData)}`
      } else if (data.Key === 'HousePicture') {
        return `修改了房源图片`
      } else {
        return `将 "${data.Comment}" ${getCityNameByCode(data.LastData)} 修改为 ${getCityNameByCode(data.NewData)}`
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "../../../../styles/variables";
@import "../../../../styles/mixin";
.ImgBox {
  border-radius: 4px;
  width: 100%;
  overflow: hidden;
  .upload-img-Box {
    // border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    padding: 0 20px;
    width: 100%;
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
}
.topTabs {
  width: 100%;
  margin-bottom: 20px;
  .tabItemLeft {
    display: inline-block;
    line-height: 30px;
    width: 80px;
    text-align: center;
    height: 30px;
    background: #eeeeee;
    color: black;
    border-radius: 6px 0 0 6px;
    cursor: pointer;
  }
  .tabItemRight {
    display: inline-block;
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background: #eeeeee;
    color: black;
    border-radius: 0 6px 6px 0;
    cursor: pointer;
  }
  .ActiveTab {
    background: #389ef2;
    color: #ffffff;
  }
}
.FollowBox {
  width: 100%;
  padding: 6px;
  max-height: 400px;
  overflow: auto;
  .FollowItem {
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 1px dashed #999999;
    margin-bottom: 20px;
    .FollowTop {
      @include displayFlex(row, center, space-between);
      margin-bottom: 15px;
    }
    .FollowText {
      text-align: start;
      font-size: 18;
    }
    .FollowBottom {
      @include displayFlex(row, center, flex-start);
      .FollowTextLeft {
        display: block;
        margin-right: 10px;
        font-weight: 10px;
        color: #389ef2;
      }
    }
  }
  .el-collapse-item {
    width: 620px
  }
}
</style>
