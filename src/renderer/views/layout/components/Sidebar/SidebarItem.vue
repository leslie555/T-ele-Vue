<template>
  <div class="menu-wrapper">
    <template v-for="item in routes"
              v-if="!(item.meta&&item.meta.hidden)&&item.children&&(item.children.length>0||item.meta.menu===2)">
      <!-- classObject对象样式监察部动画效果    aria-expanded动画必须效果     mouseenter，mouseleave 鼠标滑动和滑出触发  item.meta.menu===2 为监察部 -->
      <el-menu-item :class="classObject" :aria-expanded = judge  @mouseenter.native="enter" @mouseleave.native="leave"  v-if="item.meta.menu===2" :index="item.name||item.path" :key="item.name">
        <router-link :to="item.path" :key="item.name">
          <i v-if="item.meta&&item.meta.icon" class="iconfont" :class="item.meta.icon"></i>
          <span :class="{ showOrDis: isCollapse }" v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
        </router-link>
      </el-menu-item>
      <el-submenu v-else :index="item.name||item.path" :key="item.name" :show-timeout="150" :hide-timeout="150">
        <!-- <template slot="title">
          <router-link v-if="item.meta.menu===2" :to="item.path" :key="item.name">
            <i v-if="item.meta&&item.meta.icon" class="iconfont" :class="item.meta.icon"></i>
            <span v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
          </router-link>
          <template v-else>
            <i v-if="item.meta&&item.meta.icon" class="iconfont" :class="item.meta.icon"></i>
            <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
          </template>
        </template> -->
          <template  slot="title">
            <i v-if="item.meta&&item.meta.icon" class="iconfont" :class="item.meta.icon"></i>
            <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
          </template>

        <template v-for="child in item.children"
                  v-if="!(child.meta&&child.meta.hidden)&&(item.meta&&item.meta.menu!==1)">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0"
                        :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <i v-if="child.meta&&child.meta.icon" class="iconfont" :class="child.meta.icon"></i>
              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
        <div class="menu-box" v-if="item.meta&&item.meta.menu===1">
          <div class="menu-item-box" v-for="child in item.children" v-if="child.children&&child.children.length>0"
               :key="child.name">
            <div class="menu-item-title">{{child.meta.title}}</div>
            <div class="menu-link-box" :class="child.children.length>0?`num-${Math.ceil(child.children.length/7)}`:''">
              <router-link v-for="cItem in child.children" :to="item.path+'/'+child.path+'/'+cItem.path"
                           :key="cItem.name">
                <div class="menu-link-item">{{cItem.meta.title}}</div>
              </router-link>
            </div>
          </div>
        </div>
      </el-submenu>
    </template>
  </div>
</template>
<style lang="scss" scoped>
  @import "style";
  .addItem{
    padding:0 10px !important;
  }
  .showOrDis{
    display: none;
  }
  .judge{
    color: #389ef2 !important;
  }
  .judge i{
    color: #389ef2 !important;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 鼠标hover 动画
        judge: false
      }
    },
    methods: {
      hasOneShowingChildren(children) {
        /* const showingChildren = children.filter(item => {
          return !item.hidden
        })
        if (showingChildren.length === 1) {
          return true
        }*/
        return false
      },
      enter() {
        this.judge = true
      },
      leave() {
        this.judge = false
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      },
      classObject() {
        return {
          addItem: !this.sidebar.opened,
          'is-opened': this.judge,
          'judge': this.judge,
          'el-submenu': this.judge
        }
      }
    }
  }
</script>
