<template>
  <el-dialog
    :visible="ViewVisible"
    @close="close"
    title="详情"
    :center="true"
    width="600px"
    append-to-body
  >
    <div class="topTabs">
      <div
        :class="['tabItemLeft', ActiveIndex === 1 ? 'ActiveTab' : 'NormalTab']"
        @click="changeTab(1)"
      >基本信息</div><div
        :class="['tabItemRight', ActiveIndex === 2 ? 'ActiveTab' : 'NormalTab']"
        @click="changeTab(2)"
      >跟进详情
      </div>
    </div>
    <el-form
      v-if="ActiveIndex === 1"
      :model="FormData"
      label-position="right"
      label-width="100px"
      :inline="true"
      style="height: 400px; overflow: auto;"
      ref="ViewForm"
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix" style="marginBottom: 10px">
          <h3 style="color: #999999">租客信息</h3>
        </div>
        <div class="clearfix">
          <el-form-item label="租客姓名">
            <span>{{FormData.TenantName}}</span>
          </el-form-item>
          <el-form-item label="租客电话">
            <span>{{FormData.TenantTel}}</span>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="性别">
            <span>{{FormData.TenantSex}}</span>
          </el-form-item>
          <el-form-item label="年龄段">
            <span>{{FormData.AgeGroup}}</span>
          </el-form-item>
        </div>
        <div class="clearfix" style="margin: 0 0 10px">
          <h3 style="color: #999999">需求信息</h3>
        </div>
        <div class="clearfix form-item-sm">
          <el-form-item label="期望租金">
            <span>{{FormData.MinExpectedRent}}-{{FormData.MaxExpectedRent}}</span>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="期望区域">
            <span>{{FormData.RegionStr}}</span>
          </el-form-item>
          <el-form-item label="入住类型">
            <span>{{FormData.LiveType}}</span>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="入住时间">
            <span>{{$dateFormat(FormData.LiveTime,'yyyy-MM-dd')}}</span>
          </el-form-item>
          <el-form-item label="租期" prop="LeaseTerm">
            <span>{{FormData.LeaseTerm}}</span>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item
            label="备注">
            <span>{{FormData.Remarks}}</span>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="FollowBox" v-else>
      <div class="FollowItem" v-for="(item, index) in FollowList" :key="index">
        <div class="FollowTop">
          <div class="FollowTopLeft">
            <span class="FollowText">{{ $dateFormat(item.FollowUpTime, 'yyyy-MM-dd') }}</span>
          </div>
          <div class="FollowTopRight">
            <span class="FollowText">{{ item.UserName }}</span>
          </div>
        </div>
        <div class="FollowBottom">
          <div>
            <span v-if="item.Type == '1'||item.Type == '3'" class="FollowText FollowTextLeft"> [{{$EnumData.getEnumDesByValue('FollowUpMode', item.Type)}}]</span>
            <span v-else class="FollowText FollowTextLeft"> {{$EnumData.getEnumDesByValue('FollowUpMode', item.Type)}}</span>
            <span class="FollowText">{{ item.Content }}</span>
          </div>
          <div v-if="item.SeeHouse.length>0" class="FollowHouseList">
            <div class="FollowHouseTitle">带看房源:</div>
            <div class="FollowHouseContainer">
              <div class="FollowHouseText" v-for="item2 in item.SeeHouse ">{{item2.HouseName}} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getCityNameByCode } from '@/utils/CityData'
  import { ShowFollowUpList } from '../../../../../api/resource'

  export default {
    name: 'ViewTenantInfo',
    data() {
      return {
        ViewVisible: false,
        ActiveIndex: 1,
        FollowList: [],
        FormData: {
          TenantName: '',
          TenantTel: '',
          TenantSex: '',
          AgeGroup: '',
          MinExpectedRent: '',
          MaxExpectedRent: '',
          RegionStr: '',
          LiveType: '',
          LiveTime: '',
          LeaseTerm: '',
          Remarks: ''
        }
      }
    },
    methods: {
      open(data) {
        if (data) {
          this.FormData = {
            TenantName: data.TenantName,
            TenantTel: data.TenantTel,
            TenantSex: this.$EnumData.getEnumDesByValue('Sex', data.TenantSex),
            AgeGroup: this.$EnumData.getEnumDesByValue('AgeGroup', data.AgeGroup),
            MinExpectedRent: data.MinExpectedRent,
            MaxExpectedRent: data.MaxExpectedRent,
            RegionStr: data.RegionStr && data.RegionStr.length > 0 ? getCityNameByCode(data.RegionStr) : '',
            LiveType: this.$EnumData.getEnumDesByValue('LiveType', data.LiveType),
            LiveTime: data.LiveTime,
            LeaseTerm: this.$EnumData.getEnumDesByValue('LeaseTerm', data.LeaseTerm),
            Remarks: data.Remarks
          }
          this.ViewVisible = true
          ShowFollowUpList({ keyID: data.KeyID }).then(res => {
            this.FollowList = !res.Data ? [] : res.Data
          }).catch(() => {

          })
        }
      },
      changeTab(index) {
        this.ActiveIndex = index
      },
      close() {
        this.FormData = {}
        this.ActiveIndex = 1
        this.ViewVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../styles/variables";
  @import "../../../../../styles/mixin";

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
    .FollowText {
      font-size: 14px;
    }
    .FollowItem {
      width: 100%;
      padding-bottom: 10px;
      border-bottom: 1px dashed #999999;
      margin-bottom: 20px;
      .FollowTop {
        @include displayFlex(row, center, space-between);
        margin-bottom: 15px;
      }

      .FollowBottom {
        .FollowTextLeft {
          margin-right: 10px;
          font-weight: 600;
          color: #389ef2;
        }
        .FollowHouseList {
          margin-top: 10px;
           @include displayFlex(row,flex-start,flex-start);
        }
        .FollowHouseContainer {
          margin-left: 5px;
          @include displayFlex(column,flex-start,flex-start);
        }
        .FollowHouseTitle {
          font-size: 14px;
        }
        .FollowHouseText {
          margin-bottom: 10px;
          font-size: 14px;
        }
      }
    }
  }
</style>
