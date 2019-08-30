<template>
    <el-dialog
            v-loading="loading"
            width="600px" :center="true" :before-close="close"
            :visible.sync="dialogFormVisible"
            append-to-body>
        <div class="equipment-imgs">
            <el-carousel v-if="Imgs.length>0" trigger="click" height="450px">
                <el-carousel-item v-for="item in Imgs" :key="item.KeyID">
                    <img :src="$ImgUnit.getImgUrl(item.ImageLocation)" @click="$seeImage($ImgUnit.getImgUrl(item.ImageLocation))"/>
                </el-carousel-item>
            </el-carousel>
            <div v-else>
                暂无图片
            </div>
        </div>
    </el-dialog>
</template>

<script>
  export default {
    name: 'ViewPictureGallery',
    data() {
      return {
        loading: false,
        dialogFormVisible: false,
        Imgs: []
      }
    },

    methods: {
      open(imgData) {
        this.Imgs = imgData
        this.dialogFormVisible = true
      },

      close() {
        this.dialogFormVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixin.scss";

    .el-carousel__item {
        @include displayFlex(row, center, center);
        img {
            max-width: 550px;
            max-height: 450px;
            cursor: zoom-in;
        }
    }
</style>
