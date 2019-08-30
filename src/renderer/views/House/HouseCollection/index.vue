<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="80px">
      <template slot="search">
        <el-form-item label="关键字" prop="Keyword">
          <el-input v-model="ruleForm.Keyword" autocomplete="off"
                    placeholder="房源名称/租客姓名/电话/合同编号/房源编号" style="width: 320px"></el-input>
        </el-form-item>
        <el-button class="search-button" type="primary" @click="submitForm()">查询</el-button>
      </template>
    </search-panel>
    <div class="panel housecollect-container">
      <div class="house-count">共收藏 <span>{{ HouseCollectionCount}}</span> 套</div>
      <ul class="housecollect-list">
        <li
          v-for="item in filterList"
          class="housecollect-item"
          :key="item.KeyID"
          @click="viewHouseInfo(item)">
          <div class="housecollect-item-img">
            <img :src="$ImgUnit.getImgUrl(item.ConverPic)" @click.stop="$seeImage($ImgUnit.getImgUrl(item.ConverPic))"
                 :alt="item.HouseName">
          </div>
          <div class="housecollect-item-content">
            <p class="housecollect-item-title">{{ item.HouseName }}
              <span>{{ item.HouseRoomInfo }}</span>
            </p>
            <!--<div class="housecollect-item-info">-->
              <!--<span>代理费: {{ item.AgentMoney }}</span>-->
            <!--</div>-->
            <p class="housecollect-item-address">地址: {{ item.Location }}</p>
          </div>
          <div class="housecollect-item-operation">
            <span class="housecollect-item-rent">{{ item.RentMoeny }}元/月</span>
            <el-button class="housecollect-item-btn"
                       key="cancelCollect"
                       type="primary"
                       :loading="loading"
                       @click.stop="cancelHouseCollection(item.KeyID)">取消收藏
            </el-button>
          </div>
        </li>
      </ul>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData">
    </bottom-tool-bar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { selectEnshrine } from '@/api/house'
  import { delEnshrine } from '@/api/house'
  import SearchPanel from '../../../components/SearchPanel'
  import BottomToolBar from '@/components/BottomToolBar'

  export default {
    name: 'HouseCollection',
    components: {
      SearchPanel,
      BottomToolBar
    },
    data() {
      return {
        ruleForm: {
          Keyword: ''
        },
        list: [],
        loading: false,
        filterList: [],
        HouseCollectionCount: 0,
        pageSize: 10
        // listLoading: false
      }
    },
    activated() {
      this.$refs.bottomToolBar.search(1)
    },
    computed: {
      ...mapGetters([
        'userinfo'
      ])
    },
    methods: {
      fetchData(pages) {
        if (!pages) {
          pages = {
            size: this.pageSize,
            page: 1
          }
        }
        // this.listLoading = true
        return selectEnshrine({
          parm: pages,
          Keyword: this.ruleForm.Keyword,
          HouseID: '', // 本页面此变量默认为空
          EmployeeID: this.userinfo.EmpID // 当前登录用户
        }).then(response => {
          this.HouseCollectionCount = response.Data.records
          this.list = response.Data.rows
          this.filterTableData()
          // this.listLoading = false
          return response.Data
        }).catch(() => {
          // this.listLoading = false
        })
      },

      filterTableData() {
        this.filterList = []
        this.list.map(item => {
          this.filterList.push(this.filterTableDataItem(item))
        })
      },

      filterTableDataItem(item) {
        return {
          HouseKey: item.HouseKey,
          KeyID: item.KeyID,
          ConverPic: item.ConverPic,
          HouseName: item.HouseName,
          HouseRoomInfo: [item.RoomCount, '室', item.HallCount, '厅', item.RoomArea + '平', '朝', this.$EnumData.getEnumDesByValue('Toward', item.Toward)].join(''),
          Location: item.Location,
          RentMoeny: item.RentMoeny,
          AgentMoney: item.AgentMoney
        }
      },

      viewHouseInfo(row) {
        this.$router.push({
          path: '/House/ShareHouseDetail',
          query: {
            id: row.HouseKey
          }
        })
      },

      submitForm() {
        this.fetchData()
      },

      cancelHouseCollection(KeyID) {
        this.$confirm('确认取消收藏该房源?', '提示').then(() => {
          this.loading = true
          const postData = { 'KeyID': KeyID }
          delEnshrine(postData).then(() => {
            this.filterList = this.filterList.filter(item => item.KeyID !== KeyID)
            this.loading = false
            this.$message.success('取消成功')
          }).catch(() => {
            this.loading = false
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
