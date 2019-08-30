<template>
  <div class="app-container data-list">
    <div class="panel data-list-table msg-center">
      <div class="msglist-div">
        <div class="msg-all">
          <span>所有消息</span>
          <el-button class="el-button onekey-btn"
                     plain
                     type="mini"
                     v-if="this.filterList.length > 0"
                     @click="oneKeyRead">一键已读
          </el-button>
        </div>
        <div class="msg-list-div">
          <ul class="msg-list">
            <li v-for="item in filterList"
                :class="item.IsChoose?'IsChoose': ''"
                :key="item.KeyID"
                @click="getMsgInfo(item)">
              <div v-if="!item.IsRead" class="msg-point-unread">
              </div>
              <div class="msg-desc">
                <p class="msg-desc-title">{{ item.MessageTitle }}</p>
                <p class="msg-desc-date">{{ item.PushTime }}</p>
              </div>
            </li>
            <li v-if="filterList.length<=0">
              <div class="no-msg">暂无消息</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="content-div">
        <div class="content-box" v-if="MsgContent.Title">
          <div class="content-div-title">
            <p class="title-text">{{MsgContent.Title}}</p>
            <p class="title-time">{{MsgContent.Time}}</p>
          </div>
          <div class="content-div-content" @click="toAuditPage">
            <p>{{ MsgContent.Content}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { SetReadState, ShowMessagePush } from '../../../api/usercenter'
  import { dateFormat } from '../../../utils/dateFormat'
  import { mapGetters } from 'vuex'
  import { localStorage } from '@/utils/storage'

  export default {
    data() {
      return {
        filterList: [],
        list: [],
        pageSize: 12,
        page: 1,
        IsLoading: true,
        MsgContent: {
          Title: '',
          Time: '',
          Content: ''
        }
      }
    },

    created() {
      this.IsLoading = true
      this.fetchData()
    },
    mounted() {
      this.initScroll()
    },
    computed: {
      ...mapGetters([
        'messageNumber'
      ])
    },
    beforeRouteLeave(to, from, next) {
      // 防止异常
      const scrollEl = this.$el.querySelector('.msg-list')
      scrollEl.removeEventListener('scroll', this.handleScroll)
      next()
    },
    methods: {
      initScroll() {
        const scrollEl = this.$el.querySelector('.msg-list')
        scrollEl.addEventListener('scroll', this.handleScroll)
      },

      handleScroll(e) {
        const top = e.srcElement.scrollTop
        const height = e.srcElement.scrollHeight - this.$el.querySelector('.msg-list').offsetHeight
        if (top === height && top !== 0 && !this.IsLoading) {
          this.IsLoading = true
          this.page++
          this.fetchData()
        }
      },

      getMsgInfo(row) {
        this.filterList.map(item => {
          item.IsChoose = false
        })
        const item = this.filterList.find(item => item.KeyID === row.KeyID)
        item.IsChoose = true
        this.MsgContent = item.MessageContent
        // 同步修改未读消息数量
        if (!row.IsRead) {
          SetReadState({ State: 0, KeyID: row.KeyID }).then(() => {
            row.IsRead = true
          })
          this.$store.dispatch('UpdateMsgNumber')
        }
      },

      oneKeyRead() {
        SetReadState({ State: 1 }).then(response => {
          if (response) {
            this.filterList.map(item => {
              item.IsRead = true
            })
            // 清空消息数量
            this.$store.dispatch('ClearMsgNumber')
          }
        })
      },

      fetchData() {
        const pages = {
          size: this.pageSize,
          page: this.page
        }
        ShowMessagePush({ parm: pages }).then(response => {
          this.list = response.Data.rows
          this.filterTableData()
          if (this.page === 1) {
            const type = this.$route.query.type
            // 如果是从头部导航跳过来的
            if (type === '1') {
              // 第一项设置为已读
              if (this.filterList.length > 0 && !this.filterList[0].IsRead) {
                const postData = { State: 0, KeyID: this.filterList[0].KeyID }
                SetReadState(postData).then(response => {
                  this.filterList[0].IsRead = true
                  this.$store.dispatch('UpdateMsgNumber')
                })
              }
              // 第一项内容展示出来
              if (this.filterList.length > 0) {
                this.MsgContent = this.filterList[0].MessageContent
                this.filterList[0].IsChoose = true
              }
            } else {
              const remark = localStorage.get('HomePageRemark')
              const KeyID = remark.KeyID
              if (KeyID > 0) {
                const index = this.filterList.findIndex(item => {
                  return item.KeyID === KeyID
                })
                // 首页的今日公告和消息列表第一页数据保持一致，以方便定位
                if (index > -1) {
                  if (!remark.IsRead) {
                    SetReadState({ State: 0, KeyID: remark.KeyID }).then(() => {
                      this.$store.dispatch('UpdateMsgNumber')
                    })
                  }
                  this.filterList[index].IsRead = true
                  this.filterList[index].IsChoose = true
                  this.MsgContent = this.filterList[index].MessageContent
                }
              }
            }
          }
        })
        this.IsLoading = false
      },

      filterTableData() {
        this.list.map(item => {
          this.filterList.push(this.filterTableDataItem(item))
        })
      },

      filterTableDataItem(item) {
        const msgContent = {
          Title: item.MessageTitle,
          Time: dateFormat(item.PushTime, 'yyyy-MM-dd hh:mm:ss'),
          Content: item.MessageContent
        }
        return {
          KeyID: item.KeyID,
          MessageTitle: item.MessageTitle,
          PushTime: dateFormat(item.PushTime, 'yyyy-MM-dd hh:mm:ss'),
          MessageContent: msgContent,
          IsRead: item.IsRead === 1,
          IsChoose: false
        }
      },

      toAuditPage() {
        this.$router.push('/Approval/MyApproval')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
