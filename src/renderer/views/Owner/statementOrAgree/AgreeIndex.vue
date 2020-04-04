<template>
  <div class="app-container data-list">
    <search-panel :model="ruleForm" ref="ruleForm" label-width="100px">
      <template slot="search">
        <el-form-item label="关键字" prop="OwnerKeyWord">
          <el-input v-model="ruleForm.Keyword" placeholder="业主姓名/电话"></el-input>
        </el-form-item>
      </template>
      <template slot="button">
        <el-button class="search-button" type="primary" @click="SearchAll()">查询</el-button>
        <el-button class="reset-button" type="primary" @click="keywordReset()">重置</el-button>
      </template>
    </search-panel>
    <div class="panel data-list-table">
      <el-table
        :data="filterList"
        ref="multipleTable"
        v-loading.body="listLoading"
        element-loading-text="加载中"
        border
        fit
        height="100%"
        class="table-normal"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand-form">
              <el-form-item label="附件:">
                <div class="table-expand-img-box"  v-viewer="{url: 'data-src'}">
                  <template v-if="props.row.imgList&&props.row.imgList.length>0">
                    <div class="table-expand-img" v-for="(item,index) in props.row.imgList" :key="index">
                      <img :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                           :data-src="$ImgUnit.getImgUrl(item.ImageLocation)">
                    </div>
                  </template>
                  <template v-else>无</template>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" label="业主姓名" min-width="90" prop="OwnerName"></el-table-column>
        <el-table-column align="center" label="业主电话" min-width="90" prop="OwnerPhone"></el-table-column>
        <el-table-column align="center" label="业主身份证" min-width="120" prop="OwnerIDCard"></el-table-column>
        <el-table-column align="center" label="房屋地址" min-width="150" prop="HouseLocation"></el-table-column>
        <el-table-column align="center" label="归还房屋日期" min-width="80">
          <template slot-scope="scope">
           <span>{{$dateFormat(scope.row.ReturnDate,'yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="签署日期" min-width="80">
          <template slot-scope="scope">
            <span>{{$dateFormat(scope.row.SignDate,'yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" min-width="150" prop="Remark"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" min-width="100">
          <template slot-scope="scope">
            <table-buttons
              :showAll="true"
              :options="operationButton"
              :condition="scope.row.conditionBtn"
              @handlefollowUpClick="handleFollowUp(scope.row)"
            ></table-buttons>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <bottom-tool-bar ref="bottomToolBar" :page-size="pageSize" :handlePageChange="fetchData"></bottom-tool-bar>
    <div>
      <PoPUP ref="PoPUP"></PoPUP>
    </div>
  </div>
</template>
<script>
import {
  SearchPanel,
  TableButtons,
  BottomToolBar,
  SelectOrganization
} from '@/components'
import { ShowConsentTerminateContractList } from '@/api/statementOrAgree'
import PoPUP from './popUp'
export default {
  name: 'AgreeIndex',
  components: {
    SelectOrganization,
    TableButtons,
    SearchPanel,
    BottomToolBar,
    PoPUP
  },
  data() {
    return {
      listLoading: false,
      pageSize: 10,
      ruleForm: {
        Keyword: ''
      },
      filterList: [],
      list: [],
      operationButton: [
        {
          key: 'followUp',
          value: '查看',
          type: 'primary'
        }
      ]
    }
  },
  methods: {
    // 查询
    SearchAll() {
      this.$refs.bottomToolBar.search()
    },
    // 重置
    keywordReset() {
      this.ruleForm.Keyword = ''
      this.$refs.ruleForm.resetFields()
      this.$refs.bottomToolBar.search()
    },
    // 调接口
    fetchData(pages) {
      if (!pages) {
        pages = {
          size: this.pageSize,
          page: 1
        }
      }
      this.listLoading = true
      return ShowConsentTerminateContractList({
        parm: pages, // 分页参数
        ...this.ruleForm
      })
        .then(response => {
          const List = response.Data.rows
          this.filterList = []
          List.map(item => {
            this.filterList.push(this.filterTableDataItem(item))
          })
          // this.filterTableData()
          this.listLoading = false
          return response.Data
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    filterTableDataItem(item) {
      const itemChooseStatus = ['followUp']
      return {
        ...item,
        conditionBtn: itemChooseStatus // 操作按钮
      }
    },
    handleFollowUp(row) {
      this.$refs['PoPUP'].open(row, '合同解除同意书', 'TerminationConsent')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "style";
</style>
