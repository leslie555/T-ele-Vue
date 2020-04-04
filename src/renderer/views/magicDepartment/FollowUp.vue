<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="titleSize"
    :width="widthRange"
    append-to-body
    center
    @close="close"
  >
    <div v-loading="followLoading" class="addoverflow">
      <el-button class="reset-button" type="primary" size="small" @click="handleNewFollowUp()">新增跟进</el-button>
      <div class="tableList">
        <table>
          <tr class="tableListItem">
            <th class="tableDataTitle">跟进时间</th>
            <th class="tableDataTitle">跟进人</th>
            <th class="tableDataTitle" style="width: 330px;">跟进结果</th>
          </tr>
          <tr class="tableListItem" v-for="(item, index) in followList" :key="index">
            <td class="tableDataTitle">{{$dateFormat(item.CreaterTime,'yyyy-MM-dd')}}</td>
            <td class="tableDataTitle">{{item.CreaterName}}</td>
            <td class="tableDataTitle" style="width: 330px;" :title="item.FollowDesc">{{item.FollowDesc.length > 20 ? item.FollowDesc.substring(0, 20) + '...' : item.FollowDesc}}</td>
          </tr>
        </table>
      </div>
      <div class="closeBtn">
        <el-button size="small" @click="close()">关闭</el-button>
      </div>

      <el-dialog
        :visible.sync="followDialog"
        title="新增跟进"
        width="500px"
        append-to-body
        center
        @close="CancelFollow"
    >
        <div v-loading="NewfollowLoading">
            <el-input
                type="textarea"
                :autosize="{ minRows: 6, maxRows: 6}"
                placeholder="请输入内容"
                v-model="followRemark">
                </el-input>
                <div class="closeBtn">
                    <el-button size="small" @click="CancelFollow()">取消</el-button>
                    <el-button style="margin-left: 20px" type="primary" size="small" @click="TrueFollow()">确定</el-button>
                </div>
        </div>
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script>
import { ShowMagicFollowLogByHouseKey, AddMagicFollowLog } from '@/api/magic'
export default {
  name: 'FollowUp',
  components: {},
  data() {
    return {
      showDialog: false,
      followDialog: false,
      titleSize: '跟进记录',
      widthRange: '800px',
      KeyID: '',
      followRemark: '',
      followList: [],
      followLoading: false,
      NewfollowLoading: false,
      HouseKey: '',
      RentType: ''
    }
  },
  methods: {
    open(val) {
      this.showDialog = true
      // this.KeyID = val.KeyID
      // 页面接口loading
      this.HouseKey = val.UUID
      this.RentType = val.RentType
      this.followLoading = true
        const pages = {
          size: 99999,
          page: 1
        }
        const obj = {
            HouseKey: val.UUID,
            RentType: val.RentType,
            parm: pages
        }
      ShowMagicFollowLogByHouseKey(obj).then(res => {
          if (res.Code === 0) {
              this.followList = res.Data.rows
              this.followLoading = false
          }
      })
    },
    close() {
        this.followRemark = ''
      this.showDialog = false
    },
    handleNewFollowUp() {
        this.followDialog = true
    },
    CancelFollow() {
        this.followDialog = false
    },
    TrueFollow() {
        this.NewfollowLoading = true
        const obj = {
            HouseKey: this.HouseKey,
            RentType: this.RentType,
            FollowDesc: this.followRemark
        }
        AddMagicFollowLog(obj).then(res => {
            if (res.Code === 0) {
                this.followDialog = false
                this.followList.push(res.Data)
                this.NewfollowLoading = false
                this.followRemark = ''
                this.$message({
                message: '提交成功！',
                type: 'success'
                })
            }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.reset-button {
  margin-left: 60px;
  margin-bottom: 20px;
}
.closeBtn {
  text-align: center;
  margin-top: 20px;
}
.tableList {
  width: 630px;
  margin: 0 auto;
  box-sizing: border-box;
  text-align: center;
  table {
    border-collapse: collapse;
  }
  .tableListItem {
    width: 100%;
    td,
    th {
      height: 30px;
      vertical-align: middle;
      border: 1px solid #999999;
    }
    .tableDataTitle {
      // background: #f3f9fe;
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
  }
}
  .addoverflow{
    max-height: 400px !important;
    overflow-y: scroll;
  }
  .addoverflow::-webkit-scrollbar{
	display: none
}
</style>
