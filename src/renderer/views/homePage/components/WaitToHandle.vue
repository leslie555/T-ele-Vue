<template>
  <Panel title="待处理">
    <template slot="rightHeader">
      <el-popover placement="bottom" v-model="popoverShow" trigger="click">
        <div v-loading="loading" class="check-popover">
          <div class="check-controlHei">
            <el-checkbox-group :max="10" v-model="checkedCities" @change="handleCheckChange">
              <el-checkbox v-for="(item, index) in items" :label="item.name" :key="index">
                <span>{{item.title}}</span>
                <!-- <span class="check-rightPO">{{item.num}}</span> -->
                <!-- {{item.name}} -->
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="check-seleceBtn">
            <span>只能选择10条</span>
            <el-button type="primary" @click="selectTenNum" size="mini">确定</el-button>
          </div>
        </div>
        <el-button slot="reference" type="text" size="large" icon="el-icon-setting"></el-button>
      </el-popover>
    </template>
    <div v-loading="contLoading">
      <div class="content">
        <div
          v-for="(item, index) in CheckedData"
          @click="routerLink(item.routerName)"
          :key="index"
          class="item"
        >
          <p>{{item.num}}</p>
          <p>{{item.title}}</p>
        </div>
      </div>
    </div>
  </Panel>
</template>

<script>
import {
  homePagePendingDisposal,
  SaveHomePagePendingCon,
  ShowHomePagePendingCon
} from '@/api/homePage'
import Panel from './Panel'
import meunShow from './data'
export default {
  components: {
    Panel
  },
  data() {
    return {
      // 选中的name
      checkedCities: [],
      // checkedCitiesArr 的升级版 加了一个num
      CheckedData: [],
      popoverShow: false,
      loading: false,
      contLoading: false,
      // 全部数组
      items: [],
      // 选中的数组
      checkedCitiesArr: [],
      isFirstEnter: true
    }
  },
  created() {
    this.initList()
  },
  // 暂时缓存
  // activated() {
  //   if (this.isFirstEnter) {
  //     this.initList()
  //   }
  //   this.isFirstEnter = false
  // },
  methods: {
    // 没有修改 默认第一次10个
    initList() {
      this.contLoading = true
      ShowHomePagePendingCon()
        .then(({ Data }) => {
          this.items = meunShow
          // 判断返回来 如果为null   则默认展示前10个
          !Data.ConNews ? this.arrTen() : this.arrReturn(Data)
        })
        .then(() => {
          const conNews = this.segmentation(this.checkedCities)
          homePagePendingDisposal({ conNews }).then(({ Data }) => {
            this.contLoading = false
            const arr = [...this.checkedCitiesArr]
            const getArr = this.findKey(arr, Data)
            this.CheckedData = [...getArr]
          })
        })
    },
    // 默认展示前10个
    arrTen() {
      // 获取被选中的数据的name 转换成string 返回给后台
      const arr = []
      // 获取被选中的数据的data
      const checkedCitiesArr = []
      this.items.forEach((item, index) => {
        if (index < 10) {
          arr.push(item.name)
          checkedCitiesArr.push(item)
        }
      })
      this.checkedCitiesArr = [...checkedCitiesArr]
      this.checkedCities = [...arr]
    },
    // 不是默认的
    arrReturn(Data) {
      var arr = Data.ConNews.split(',')
      this.checkedCities = [...arr]
      this.items.forEach((item, index) => {
        if (Data.ConNews.indexOf(item.name) !== -1) {
          this.checkedCitiesArr.push(item)
        }
      })
    },
    // 通过返回来的数据  对比key 添加num
    findKey(val, Data) {
      const arr = [...val]
      arr.map(v => {
        if (Data[v.name]) {
          v.num = Data[v.name].Num
        } else {
          v.num = 0
        }
      })
      return arr
    },
    // 数组变成字符串的方法
    segmentation(arr) {
      let conNews = ''
      for (let i = 0; i < arr.length; i++) {
        if (i === arr.length - 1) {
          conNews += arr[i]
        } else {
          conNews += arr[i] + ','
        }
      }
      return conNews
    },
    routerLink(name) {
      if (name === 'MyApproval') {
        this.$router.push({
          name,
          query: {
            BusType: 15
          }
        })
      } else {
        this.$router.push({
          name
        })
      }
    },
    selectTenNum() {
      if (this.checkedCities.length !== 10) {
        this.$message.error('需选择10条')
        return
      }
      this.loading = true
      const arr = []
      const conNews = this.segmentation(this.checkedCities)
      this.items.forEach((item, index) => {
        this.checkedCities.map(v => {
          if (item.name === v) {
            arr.push(item)
          }
        })
      })
      SaveHomePagePendingCon({ conNews }).then(({ Data }) => {
        const getArr = this.findKey(arr, Data.Data)
        this.loading = false
        this.popoverShow = false
        this.CheckedData = [...getArr]
      })
    },
    handleCheckChange(val) {
      this.checkedCities = val
    }
  }
}
</script>
<style lang="scss">
.check-controlHei .el-checkbox {
  padding: 3px 0;
  position: relative;
  width: 150px;
}
</style>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  margin-top: 2px;
  .item {
    margin-top: 20px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
    p:nth-child(1) {
      height: 50px;
      line-height: 70px;
      font-size: 20px;
    }
    p:nth-child(2) {
      height: 50px;
      line-height: 50px;
      font-size: 18px;
    }
  }
}
.check-popoverShow {
  display: none;
}
.check-popover {
  width: 155px;
  padding: 10px 0;
  .check-controlHei {
    max-height: 250px;
    overflow-x: hidden;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  .check-controlHei::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .check-rightPO {
    position: absolute;
    right: 5px;
    color: black;
  }
}
.check-seleceBtn {
  margin-top: 20px;
  height: 28px;
  line-height: 28px;
  button {
    float: right;
  }
}
@media screen and (min-width: 1300px) {
  .content {
    height: 600px;
  }
  .item {
    width: 150px;
    height: 100px;
    margin-right: 35px;
    cursor: pointer;
    background: url('../images/waitToHandleItem.png');
  }
  .item:nth-child(2n + 0) {
    margin-right: 0;
  }
}
@media screen and (max-width: 1300px) {
  .content {
    height: 224px;
  }
  .item {
    width: 110px;
    height: 92px;
    cursor: pointer;
    margin-right: 23px;
    background: url('../images/waitToHandleItem1.png');
  }
  .item:nth-child(5n + 0) {
    margin-right: 0;
  }
}
</style>