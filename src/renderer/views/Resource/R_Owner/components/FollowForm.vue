<template>
  <el-dialog
    :visible="ComandVisible"
    @close="close"
    title="跟进"
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
      >跟进详情</div>
    </div>
    <el-form
      v-if="ActiveIndex === 1"
      :model="form"
      label-position="right"
      label-width="100px"
      :inline="true"
      :rules="rules"
      style="overflow: auto;"
      ref="FinancialSubjectEditForm"
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item label="跟进类型">
            <el-select v-model="form.Type" placeholder="请选择">
              <el-option
                v-for="item in options_Self"
                :key="item.Value"
                :label="item.Label"
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
          <span
            class="FollowText FollowTextLeft"
          >{{ (item.Type === 2 || item.Type === 4 || item.Type === 5) ? `${$EnumData.getEnumDesByValue('FollowUpMode', item.Type)}` : `(${$EnumData.getEnumDesByValue('FollowUpMode', item.Type)})` }}</span>
          <span class="FollowText">{{ item.Content }}</span>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit" v-if="ActiveIndex === 1">确定</el-button>
      <el-button type="primary" @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { AddFollowUp, FindFollowUp } from '@/api/resource'

export default ({
  name: 'follow-form',
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
      btnLoading: false,
      ComandVisible: false,
      isShowSelect: true,
      options_Self: [
        {
          Label: '电话',
          Value: '1'
        },
        {
          Label: '拜访',
          Value: '3'
        }
      ],
      FollowList: [],
      rules: {
        FollowUpTime: [
          { required: true, message: '请选择跟进时间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open(KeyID) {
      FindFollowUp({ KeyID }).then(res => {
        console.log(res)
        this.FollowList = !res.Data ? [] : res.Data
      })
      this.form.ResourcesID = KeyID
      this.btnLoading = false
      this.ComandVisible = true
    },
    close() {
      this.form.Content = ''
      // this.form.ActiveIndex = 1
      this.ActiveIndex = 1
      this.form.Type = '1'
      this.form.FollowUpTime = ''
      this.form.ResourcesID = ''
      this.form.UserName = ''
      this.$refs['FinancialSubjectEditForm'].resetFields()
      this.btnLoading = false
      this.ComandVisible = false
    },
    changeTab(num) {
      this.ActiveIndex = num
    },
    submit() {
      this.$refs['FinancialSubjectEditForm'].validate(valid => {
        if (valid) {
          AddFollowUp(this.form).then(res => {
          this.$message({
            type: 'success',
            message: '跟进成功'
          })
          this.form.UserName = !res.Data ? '' : res.Data.UserName
          this.$emit('AddFollowForm', this.form)
          this.close()
        })
        }
      })
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
      text-align: center;
      font-size: 18;
    }
    .FollowBottom {
      @include displayFlex(row, center, felx-start);
      .FollowTextLeft {
        margin-right: 10px;
        font-weight: 600;
        color: #389ef2;
      }
    }
  }
}
</style>
