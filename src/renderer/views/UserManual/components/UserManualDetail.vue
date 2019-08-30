<template>
  <div class="manual-detail-container">
    <h2 class="manual-detail-title">{{checkedData.label}}</h2>
    <div class="video-tip" v-if="checkedData.videoUrl">
      观看视频教程:
      <a class="video-tip-href" @click="handleJumpToUrl">点击进入</a>
    </div>
    <div class="img-box" v-for="url in checkedData.urls" :key="url">
      <img class="manual-detail-img" :src="baseUrl+url">
    </div>
    <a class="download" :href="baseUrl+checkedData.pdfUrl" download title="下载">下载手册</a>
  </div>
</template>

<script>
  import { baseImgURL } from '@/config'
  export default {
    props: {
      checkedData: Object
    },
    data() {
      return {
        baseUrl: baseImgURL + '/userManual'
      }
    },
    methods: {
      handleJumpToUrl() {
        if (!process.env.IS_WEB) {
          const shell = require('electron').shell
          shell.openExternal(this.checkedData.videoUrl)
        } else {
          window.open(this.checkedData.videoUrl)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .manual-detail-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    .manual-detail-title {
      text-align: center;
      line-height: 80px;
      height: 60px;
      font-weight: 400;
    }
    .video-tip {
      width: 1280px;
    }
    .video-tip-href {
      color: #389ef2;
    }
    .img-box {
      margin: 50px 0;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
    }
    .download {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      margin-bottom: 30px;
      background: #389ef2;
      border: 1px solid #389ef2;
      border-color: #389ef2;
      color: #fff;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      transition: 0.1s;
      font-weight: 500;
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 4px;
      &:hover {
        background: #60b1f5;
        border-color: #60b1f5;
        color: #fff;
      }
      &:active {
        background: #328eda;
        border-color: #328eda;
        color: #fff;
        outline: none;
      }
    }
  }
</style>
