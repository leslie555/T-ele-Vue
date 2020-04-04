<template>
  <div id="app">
    <keep-alive>
      <router-view  v-if="$route.meta.keepAlive" v-wechat-title="$route.meta.title" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" v-wechat-title="$route.meta.title" />
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
    }
  }
</script>
