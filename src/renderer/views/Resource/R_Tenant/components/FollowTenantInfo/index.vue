<template>
  <el-dialog
    :visible="CommandVisible"
    @close="close"
    title="跟进"
    :center="true"
    width="600px"
    lock-scroll
    append-to-body
  >
    <div class="topTabs">
      <div
        :class="['tabItemLeft', ActiveIndex === 1 ? 'ActiveTab' : 'NormalTab']"
        @click="changeTab(1)"
      >基本信息
      </div><div
        :class="['tabItemRight', ActiveIndex === 2 ? 'ActiveTab' : 'NormalTab']"
        @click="changeTab(2)"
      >历史跟进
      </div>
    </div>
    <el-form
      v-if="ActiveIndex === 1"
      :model="form"
      label-position="right"
      label-width="100px"
      :inline="true"
      :rules="rules"
      style="height:400px;overflow: auto;"
      ref="form"
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item label="跟进类型">
            <el-select v-model="form.Type" placeholder="请选择">
              <el-option
                v-for="item in optionsSelf"
                :key="item.Value"
                :label="item.Description"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="跟进时间:" prop="FollowUpTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.FollowUpTime"></el-date-picker>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="带看房源">
            <el-button type="primary" @click="openSearchHouseForm">+添加</el-button>
            <template>
              <div v-for="item in HouseList">
                <div class="house-item">{{item.HouseName}}</div>
                <i class="iconfont icon-shanjianmoren ml-10 icon-delete" @click="deleteHouse(item)"></i>
              </div>
            </template>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="跟进内容:">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入备注"
              maxlength="400"
              v-model="form.Content"
              style="width: 400px;"
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="FollowBox" v-else>
      <div class="FollowItem" v-for="(item, index) in FollowList" :key="index">
        <div class="FollowTop">
          <div class="FollowTopLeft">
            <span>{{ $dateFormat(item.FollowUpTime, 'yyyy-MM-dd') }}</span>
          </div>
          <div class="FollowTopRight">
            <span class="FollowText">{{ item.UserName }}</span>
          </div>
        </div>
        <div class="FollowBottom">
          <div>
            <span v-if="item.Type == '1'||item.Type == '3'" class="FollowText FollowTextLeft"> [{{$EnumData.getEnumDesByValue('FollowUpMode', item.Type)}}]</span>
            <span v-else class="FollowText FollowTextLeft"> {{$EnumData.getEnumDesByValue('FollowUpMode', item.Type)}}</span>
            <span class="FollowText FollowText">{{ item.Content }}</span>
          </div>
          <div v-if="item.SeeHouse.length>0" class="FollowHouseList">
            <div class="FollowHouseTitle FollowText">带看房源:</div>
            <div class="FollowHouseContainer FollowText">
              <div class="FollowHouseText" v-for="item2 in item.SeeHouse">{{item2.HouseName}} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit" v-if="ActiveIndex === 1">确定</el-button>
      <el-button type="primary" @click="close">取 消</el-button>
    </div>
    <choose-house ref="searchHouse" @GetSearchData="GetSearchData"></choose-house>
  </el-dialog>
</template>
<script>
  import { AddTenantFollowUp, ShowFollowUpList } from '@/api/resource'
  import ChooseHouse from '../SearchHouse/index'

  export default ({
    name: 'FollowTenantInfo',
    components: {
      ChooseHouse
    },
    data() {
      return {
        ActiveIndex: 1,
        form: {
          Content: '',
          Type: '1',
          FollowUpTime: '',
          ResourcesID: '',
          UserName: ''
        },
        HouseList: [],
        btnLoading: false,
        CommandVisible: false,
        isShowSelect: true,
        FollowList: [],
        optionsSelf: [
          {
            Description: '电话',
            Value: '1'
          },
          {
            Description: '拜访',
            Value: '3'
          }
        ],
        rules: {
          FollowUpTime: [
            { required: true, message: '请选择跟进时间', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      open(KeyID) {
        ShowFollowUpList({ keyID: KeyID }).then(res => {
          console.log(res)
          this.FollowList = !res.Data ? [] : res.Data
        })
        this.form.ResourcesID = KeyID
        this.btnLoading = false
        this.CommandVisible = true
      },
      openSearchHouseForm() {
        this.$refs.searchHouse.open()
      },
      GetSearchData(val) {
        const index = this.HouseList.findIndex(item => {
          return item.KeyID === val.KeyID
        })
        if (index > -1) {
          this.$message({
            type: 'warning',
            message: '带看房源已重复'
          })
        } else {
          this.HouseList.push(val)
        }
      },
      deleteHouse(data) {
        const curIndex = this.HouseList.findIndex(item => {
          return item.KeyID === data.KeyID
        })
        if (curIndex > -1) {
          this.HouseList.splice(curIndex, 1)
        }
      },
      close() {
        this.Content = ''
        this.ActiveIndex = 1
        this.HouseList = []
        this.form = {
          Content: '',
          Type: '1',
          FollowUpTime: '',
          ResourcesID: '',
          UserName: ''
        }
        // this.$refs.form.resetFields()
        this.btnLoading = false
        this.CommandVisible = false
      },
      changeTab(num) {
        this.ActiveIndex = num
      },
      submit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.form.FollowUpTime = this.$dateFormat(this.form.FollowUpTime, 'yyyy-MM-dd')
            this.form = {
              ...this.form,
              SeeHouse: this.HouseList.map(item => {
                return {
                  HouseName: item.HouseName,
                  HouseID: item.KeyID,
                  HouseKey: item.HouseKey
                }
              })
            }
            AddTenantFollowUp(this.form).then(res => {
              this.$message({
                type: 'success',
                message: '跟进成功'
              })
              this.form.UserName = !res.Data ? '' : res.Data.UserName
              this.$emit('AddFollowData', this.form)
              this.close()
            })
          }
        })
      }
    }
  })
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
        .FollowText {
          font-size: 14px;
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

  .house-item {
    padding: 7px 15px;
    font-size: 14px;
    background: #fff;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    text-align: center;
    color: #606266;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
  }

  .FollowText {
    text-align: center;
    font-size: 14px;
  }

  .icon-delete {
    color: #ff5a5a;
    cursor: pointer;
  }
</style>
