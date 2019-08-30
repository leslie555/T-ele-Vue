<template>
  <div class="app-container data-list usermanual-container">
    <search-panel :model="searchForm" label-width="80px">
      <template slot="search">
        <el-form-item label="关键字">
          <el-input class="search-input" v-model="searchForm.keyword" placeholder="请输入需要查询文章的关键词"></el-input>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button type="primary" @click.prevent="submitSearch">查询</el-button>
        <el-button type="primary" @click.prevent="resetTable">重置</el-button>
      </template>
    </search-panel>
    <div class="center-container">
      <div class="nav-container">
        <el-scrollbar class="vertical-scroll">
          <ul class="nav-list">
            <li
              class="nav-item"
              :class="index === activeIndex?'active':''"
              v-for="(mod, index) in modData"
              :key="mod.id"
              @click="handleLiclick(index)"
            >{{mod.label}}</li>
          </ul>
        </el-scrollbar>
      </div>
      <div class="content-container">
        <div class="list-container">
          <el-scrollbar class="vertical-scroll">
            <ul class="content-list" v-show="isMenu">
              <li class="content-item" v-for="(item, index) in listArr" :key="item.id">
                <span class="content-title" @click="handleCheckItem(index)">{{item.label}}</span>
                <p class="content-text" @click="handleCheckItem(index)">{{item.description}}</p>
              </li>
            </ul>
            <user-manual-detail v-show="!isMenu" :checkedData="checkedData"></user-manual-detail>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { SearchPanel } from '@/components'
  import modData from '@/config/usermanual.json'
  import UserManualDetail from './components/UserManualDetail.vue'
  import { filterRouter } from '@/router/filterRouter'
  export default {
    components: {
      SearchPanel,
      UserManualDetail
    },
    data() {
      return {
        modData,
        searchForm: {
          keyword: ''
        },
        activeIndex: 0,
        isMenu: true,
        activeItemIndex: 0,
        searchList: [],
        isSearch: false
      }
    },
    computed: {
      checkedData() {
        return this.modData[this.activeIndex].children[this.activeItemIndex]
      },
      listArr() {
        return this.isSearch ? this.searchList : this.modData[this.activeIndex].children
      }
    },
    methods: {
      submitSearch() {
        this.searchList = []
        this.modData.forEach(val => {
          val.children.forEach(v => {
            if (v.label.indexOf(this.searchForm.keyword) !== -1) {
              this.searchList.push(v)
              this.isSearch = true
            }
          })
        })
      },
      resetTable() {
        this.activeIndex = 0
        this.searchForm.keyword = ''
        this.isSearch = false
      },
      handleLiclick(index) {
        this.isSearch = false
        this.isMenu = true
        this.activeIndex = index
      },
      handleCheckItem(index) {
        this.isMenu = false
        this.activeItemIndex = index
      }
    },
    created() {
      const modNames = this.$store.getters.userinfo.Module.map(val => val.EModuleName)
      this.modData = filterRouter(this.modData, modNames)
      this.modData = this.modData.filter(val => val.children.length)
    }
  }
</script>

<style lang="scss">
  .usermanual-container {
    .el-form-item__content {
      width: 340px;
    }
    .el-button {
      width: 100px;
    }
  }
</style>

<style lang="scss" scoped>
  .center-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  .nav-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 220px;
    height: 100%;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    .nav-list {
      width: 100%;
      list-style: none;
      padding: 0;
      margin: 0;
      .nav-item {
        width: 100%;
        height: 70px;
        line-height: 70px;
        font-size: 14px;
        color: #999;
        padding-left: 40px;
        cursor: pointer;
        &:hover {
          background: #f3f9fe;
        }
      }
    }
  }
  .content-container {
    margin-left: 220px;
    height: 100%;
    flex: 1;
    padding-left: 10px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    .list-container {
      height: 100%;
      flex-shrink: 1;
    }
    .content-list {
      width: 100%;
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .content-item {
      width: 100%;
      padding: 30px;
      border-bottom: 1px solid #eee;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .content-title {
      color: #444;
      font-size: 18px;
      cursor: pointer;
    }
    .content-text {
      margin-top: 20px;
      font-size: 14px;
      color: #999;
      width: 70%;
      line-height: 20px;
      letter-spacing: 1px;
      cursor: pointer;
    }
  }
  .active {
    color: #389ef2 !important;
    background: #f3f9fe;
  }
</style>
