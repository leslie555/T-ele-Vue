<template>
  <div class="image-container">
    <div class="image-wrap" v-for="img in imgs" :key="img.KeyID">
      <img
        class="image-item"
        :src="$ImgUnit.getThumbImgUrl(img.ImageLocation)"
        @click="$seeImage($ImgUnit.getImgUrl(img.ImageLocation))"
      >
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      imgs: {
        type: Array,
        default: () => []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    .image-wrap {
      width: 140px;
      height: 140px;
      margin: 0 10px;
      border: 1px solid #ddd;
      border-radius: 10px;
      cursor: zoom-in;
      .image-item {
        width: 140px;
        height: 140px;
        border-radius: 10px;
      }
    }
  }
</style>

