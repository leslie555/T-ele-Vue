<template>
  <el-dialog
    :visible="show"
    @close="close"
    title="设置推荐房源"
    :center="true"
    width="900px"
    append-to-body
  >
    <el-form
      :model="FormData"
      label-position="left"
      label-width="80px"
      :inline="true"
      :rules="rules"
      style="height: 40px; overflow: hidden;"
      ref="selectHouse"
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item label="选择房源" prop="HouseName">
            <search-house :type="14" v-model="FormData.HouseName" @select="selectHouse"></search-house>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="tips">
      <span class="warn">!</span>
      <span class="text">温馨提示：最多只能设置10个今日推荐的房源</span>
    </div>
    <el-table
      :data="tableData"
      :header-row-class-name="setTableHeader"
      :row-style="{height: '24px'}"
      :cell-style="{padding:'5px'}"
      border
      style="width: 100%">
      <el-table-column
        align="center"
        prop="HouseName"
        label="房源名称"
        min-width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="RentMoeny"
        label="月租金"
        min-width="120">
      </el-table-column>
      <el-table-column
        align="center"
        label="设置奖金"
        min-width="180">
         <template slot-scope="scope">
            <span>额外奖金<input v-model="tableData[scope.$index].Bonus" class="reward-input">元</span>
          </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        min-width="80">
          <template slot-scope="scope">
            <el-button @click="handleDelete(scope.$index)" type="text" size="small" class="delete-row">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" :disabled="btnLoading">取 消</el-button>
      <el-button type="primary" :disabled="btnLoading" :loading="btnLoading" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import SearchHouse from '@/components/SearchHouse'
import diffArr from '../../../../utils/arrUtil/diffArr'
import deepClone from '../../../../utils/arrUtil/deepClone'
import { ShowSetRecommendHouse, SetRecommendHouse } from '@/api/house'

export default {
  name: 'setRecommendHouse',
  components: {
    SearchHouse
  },
  data() {
    return {
      show: false,
      // clearable: true,
      tableLoading: false,
      btnLoading: false,
      FormData: {
        HouseName: ''
      },
      tableData: [],
      oldData: [],
      rules: {
        HouseName: [{ required: true, message: '请选择房源', trigger: 'blur' }]
      }
    }
  },
  methods: {
    close() {
      this.show = false
    },
    open() {
      this.show = true
      this.tableLoading = true
      ShowSetRecommendHouse().then(({ Data }) => {
        this.tableData = Data.reverse()
        this.oldData = deepClone(this.tableData)
        this.tableLoading = false
      }).catch(({ err }) => {
        console.log(err)
        this.tableLoading = false
      })
    },
    selectHouse(data) {
      const obj = {}
      obj.HouseName = data.HouseName
      obj.HouseID = data.KeyID
      obj.HouseKey = data.HouseKey
      obj.RentMoeny = data.RentMoeny
      obj.Bonus = data.Bonus
      // 去重，不能同一个房源推荐两次
      const hadSelect = item => item.KeyID === data.KeyID
      if (this.tableData.some(hadSelect)) {
        this.$message('该房源已经被选中，请选择其他房源')
        return
      }
      if (this.tableData.length > 9) {
        this.$message('最多只能设置10个推荐房源')
        return
      }
      this.tableData.unshift(obj)
    },
    setTableHeader() {
      return 'table-header'
    },
    handleSubmit() {
      console.log('tableDta', this.tableData)
      this.btnLoading = true
      const submitObj = diffArr(this.oldData, this.tableData, ['Bonus'])
      SetRecommendHouse({ houseInfos: submitObj }).then(({ Data }) => {
        this.$message.success('操作成功')
        this.$emit('refetch')
        this.btnLoading = false
        this.show = false
      }).catch(() => {
        this.btnLoading = false
        this.show = false
      })
    },
    handleDelete(index) {
      this.tableData[index].ModifyStatus = 3
      this.tableData.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  position: relative;
  margin: 12px 0;
  height: 28px;
  line-height: 28px;
  color: #444444;
  background-color: rgba(0, 136, 255, 0.2);
  border: 1px solid #0088FF;
  border-radius: 4px;
  opacity: 0.5;
  .warn {
    position: absolute;
    opacity: 1;
    font-size: 10px;
    text-align: center;
    line-height: 12px;
    display: inline-block;
    width: 12px;
    height: 12px;
    margin: 7px 10px;
    color: #FFFFFF;
    border-radius: 50%;
    background:rgba(0,136,255,1);
  }
  .text {
    padding-left: 32px;
  }
}
.table-header {
  color: #444444
}
.delete-row {
  color: #FF0707 !important;
  &:hover {
    color: #444444 !important;
  }
}
.reward-input {
  width:47px;
  height:28px;
  margin: 0 5px;
  border:1px solid rgba(221,221,221,1);
  border-radius:4px;
}
:focus { 
  outline: 0;
}
</style>
