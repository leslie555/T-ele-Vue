<template>
  <div class="changeItem">
    <div class="changeItemMargin">
      <p class="chanText" v-for="(tab, index) in tableList"
        :style="{color: index === ItemIndex ? '#389ef2':'#666' }"
        @click="changeTab(index)"
         :class="[index === ItemIndex ? 'tabs-actives':'tabs-notactives']"
      >
       <span>{{tab.name}}</span>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MyTabs',
    props: {
      tableList: Array
    },
    data() {
      return {
         ItemIndex: 0
      }
    },
    methods: {
      changeTab: function(index) {
        this.ItemIndex = index
        this.$emit('changeTab', index)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tabs-actives {
    color: #666;
    background-color: #ddeefd;
  }
  .tabs-notactives {
    color: #eee;
  }
  .changeItem {
    .changeItemMargin {
      display: flex;
      flex-direction: row;
      .chanText {
        width: 100px;
        height: 30px;
        border-top-left-radius:10px;
        border-top-right-radius:10px;
        cursor:pointer;
        span{
          display:inline-block;
          vertical-align:middle;
          line-height:30px;
          margin-left: 35px;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
          color: #888888;
        }
      }
      .InRoom {
        padding-left: 50px;
        font-size: 16px;
      }
    }
  }
</style>
