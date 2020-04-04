<template>
  <div class="customer-survey-container">
    <el-form :model="form" ref="form" :rules="rules" label-position="right">
      <div class="item-container">
        <p class="customer-survey-tip">1. 您在经纪人带看过程中是否满意：</p>
        <el-form-item prop="SurveySatisfy">
          <el-radio v-model="form.SurveySatisfy" :label="1">是</el-radio>
          <el-radio v-model="form.SurveySatisfy" :label="2">否</el-radio>
        </el-form-item>
      </div>
      <div class="item-container">
        <p class="customer-survey-tip">2. 经纪人对于合同，服务条款是否解释清楚，您已经完全知晓并同意：</p>
        <el-form-item prop="SurveyContractExplain">
          <el-radio v-model="form.SurveyContractExplain" :label="1">是</el-radio>
          <el-radio v-model="form.SurveyContractExplain" :label="2">否</el-radio>
        </el-form-item>
      </div>
      <div class="item-container">
        <p class="customer-survey-tip">3. 您在入住搬家时，我们同事是否帮您搬家，并且干活达到2小时以上：</p>
        <el-form-item prop="SurveyMoveHouse">
          <el-radio v-model="form.SurveyMoveHouse" :label="1">是</el-radio>
          <el-radio v-model="form.SurveyMoveHouse" :label="2">否</el-radio>
        </el-form-item>
      </div>
      <div class="item-container">
        <p class="customer-survey-tip">4. 请您对我们的同事服务给出您中肯的评价：</p>
        <el-form-item prop="SurveyEvaluation">
          <el-radio v-model="form.SurveyEvaluation" :label="1">特别满意</el-radio>
          <el-radio v-model="form.SurveyEvaluation" :label="2">满意</el-radio>
          <el-radio v-model="form.SurveyEvaluation" :label="3">不满意</el-radio>
        </el-form-item>
      </div>
      <div class="item-container">
        <p class="customer-survey-tip">5. 请问您通过什么渠道联系到我们的？</p>
        <el-form-item prop="SurveySource">
          <el-radio v-model="form.SurveySource" :label="1">朋友介绍</el-radio>
          <el-radio v-model="form.SurveySource" :label="2">广告</el-radio>
          <el-radio v-model="form.SurveySource" :label="3">上门</el-radio>
          <el-radio v-model="form.SurveySource" :label="4">其他</el-radio>
        </el-form-item>
      </div>
      <div class="item-container" style="padding-bottom:15px;">
        <p class="customer-survey-tip">请您给出宝贵建议：</p>
        <el-form-item style="width:100%;" prop="SurveySuggestion">
          <el-input
            :rows="3"
            v-model="form.SurveySuggestion"
            type="textarea"
            placeholder="请填写建议"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="customer-survey-btn">
      <el-button
        type="primary"
        style="width:100%;"
        :loading="btnLoading"
        @click="submitAddedForm"
      >提 交</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .customer-survey-container {
    background: #f6f6f6;
    .item-container {
      padding: 15px 15px 0;
      background: #fff;
      margin-bottom: 20px;
    }
    .customer-survey-tip {
      margin: 15 0;
      //   padding: 0 10px;
      font-size: 14px;
      color: #333;
    }
    .customer-survey-btn {
      padding: 0 15px 15px;
    }
  }
</style>
<style lang="scss">
  .customer-survey-container .el-radio {
    margin-left: 0;
    display: flex;
    border-top: 1px #eee solid;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 45px;
  }
</style>
<script>
  import axios from 'axios'
  import { baseURL } from '../../config'
  export default {
    name: 'CustomerSurvey',
    data() {
      return {
        btnLoading: false,
        visible: false,
        form: {
          SurveySatisfy: '',
          SurveyContractExplain: '',
          SurveyMoveHouse: '',
          SurveyEvaluation: '',
          SurveySource: '',
          SurveySuggestion: ''
        },
        rules: {
          SurveySatisfy: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          SurveyContractExplain: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          SurveyMoveHouse: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          SurveyEvaluation: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          SurveySource: [{ required: true, message: '请选择', trigger: 'change' }]
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      if (+to.query.contractType === 0) {
        // 业主
        window.location.replace(
          `https://www.51tanwo.com/html/signResult.html?status=${to.query.status}&contractType=${to.query.contractType}`
        )
      } else {
        // 租客
        next()
      }
    },
    methods: {
      submitAddedForm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.btnLoading = true
            axios({
              url: baseURL + '/TenantAfterSale/InsertCustomerQuestion',
              method: 'post',
              data: {
                ...this.form,
                TenID: this.$route.query.TenID
              },
              config: {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            }).then(res => {
              this.btnLoading = false
              this.$alert('提交成功').then(() => {
                window.location.replace(
                  `https://www.51tanwo.com/html/signResult.html?status=${this.$route.query.status}&contractType=${this.$route.query.contractType}`
                )
              })
            })
          }
        })
      }
    }
  }
</script>
