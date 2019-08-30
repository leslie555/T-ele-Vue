<template>
    <div class="ApMagement-Box">
        <el-form :model="searrchFrom" id="searchTerms">

            <el-form-item>
                <span>所属业务:</span>
                <el-select v-model="searrchFrom.businessType" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <span>业务测试数据: {{searrchFrom.businessType}}</span>
            </el-form-item>

            <el-form-item>
                <span>申请时间:</span>
                <el-date-picker
                        v-model="searrchFrom.applicationTime"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <span>时间测试数据: {{searrchFrom.applicationTime}}</span>
            </el-form-item>

            <el-form-item>
                <span>状态:</span>
                <el-checkbox-group v-model="searrchFrom.type">
                    <el-checkbox label="待审核">待审核</el-checkbox>
                    <el-checkbox label="已审核">已审核</el-checkbox>
                    <el-checkbox label="已驳回">已驳回</el-checkbox>
                </el-checkbox-group>
                <span>多选测试数据: {{searrchFrom.type}}</span>
            </el-form-item>

            <div>
                <el-button type="primary" round @click="testSeek">查询</el-button>
                <el-button type="primary" round @click="resetBtn">重置</el-button>
            </div>

        </el-form>

        <DateTableShow :tableData="atdata"></DateTableShow>
    </div>
</template>

<script>
  import DateTableShow from './components/DateTableShow'
  import { getAcationData } from '@/api/Approval'

  export default {
    data() {
      return {
        options: [
          { value: '业主合同', label: '业主合同' },
          { value: '房源', label: '房源' },
          { value: '租客合同', label: '租客合同' },
          { value: '维修', label: '维修' },
          { value: '账单', label: '账单' }
        ],
        searrchFrom: {
          businessType: '',
          applicationTime: [],
          type: []
        },
        tableData: [],
        atdata: []
      }
    },
    components: {
      DateTableShow
    },
    created() {
      this.getInitData() // 组件创建的时候获得数据
    },
    methods: {
      resetBtn() {
        for (const item in this.searrchFrom) {
          this.searrchFrom[item] = (this.searrchFrom[item] instanceof Array) ? [] : ''
        }
        this.atdata = this.tableData
      }, // 重置按钮
      getInitData() {
        getAcationData().then(sendData => {
          console.log(sendData.data.Datas)
          this.tableData = sendData.data.Datas
          this.atdata = this.tableData
        })
      }, // 获得初始数据
      datezy(date) {
        date = new Date(date)
        return date.toLocaleDateString()
      }, // 时间数据转换
      testSeek() {
        console.log('查询测试开始')
        const data = this.searrchFrom
        if (data.applicationTime === null) data.applicationTime = []
        const ndata = []
        if (data.businessType === '' && data.applicationTime.length === 0 && data.type.length === 0) {
          this.atdata = this.tableData
          return
        }
        this.tableData.forEach((item, index) => {
          if (data.businessType !== '' && item.businessType !== data.businessType) return false
          const maxDate = this.datezy(data.applicationTime[1])
          const minDate = this.datezy(data.applicationTime[0])
          if (data.applicationTime.length !== 0 && (item.applicationTime < minDate || item.applicationTime > maxDate)) {
            return false
          }
          if (data.type.length !== 0) {
            if (data.type.indexOf(item.type) === -1) return false
          }
          ndata.push(this.tableData[index])
        })
        this.atdata = ndata
      } // 查询方法
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .ApMagement-Box {
        padding: 20px;
    }
</style>
