<template>
      <div class="app-container">
          <div class="panel edit-contract" v-loading="detailLoading">
              <div class="leftWidth">
                    <div style="margin-top:15px;">
                        <!-- <el-button
                            type="danger"
                            icon="delete"
                            size="mini">
                            <span>添加样式</span>
                        </el-button> -->
                        <span class="fitmentItem">装修项目</span>
                        <el-button size="small" @click="addItem" plain>添加项目</el-button>
                    </div>
                    <el-table
                        :data="tableData"
                        border
                        style="width: 100%;margin-top:30px;">
                        <el-table-column
                        label="项目名称"
                        prop="name"
                        min-width="150">
                            <template slot-scope="scope">
                                <div v-if="scope.row.ids">{{ scope.row.name }}</div>
                                 <el-select size="small" v-else  v-model="scope.row.name" @change="selectAreaChange(scope.row,scope.$index)" placeholder="请选择">
                                <el-option
                                    v-for="item in optionAreas"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="date"
                        label="内部单价"
                        min-width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.ids">{{scope.row.date}}</span>
                                <el-input v-else size="small" v-model="scope.row.date"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="province"
                        label="外部单价"
                        min-width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.ids">{{scope.row.province}}</span>
                                <el-input v-else size="small" v-model="scope.row.province"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="city"
                        label="数量"
                        min-width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.ids">{{scope.row.city}}</span>
                                <el-input v-else size="small" v-model="scope.row.city"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="内部总金额"
                        min-width="300">
                            <template slot-scope="scope">
                                <span v-if="scope.row.ids">{{scope.row.address}}</span>
                                <el-input v-else size="small" v-model="scope.row.address"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="zip"
                        label="外部总金额"
                        width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.ids">{{scope.row.zip}}</span>
                                <el-input v-else size="small" v-model="scope.row.zip"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                        fixed="right"
                        label="操作"
                        min-width="120">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.ids" @click="handleClick(scope.row,scope.$index)" type="text" size="small">修改</el-button>
                            <el-button v-if="!scope.row.ids" @click="SaveClick(scope.row,scope.$index)" type="text" size="small">保存</el-button>
                            <el-button  type="text" @click="DeleteClick(scope.row,scope.$index)" size="small">删除</el-button>
                            <el-button v-if="!scope.row.ids" @click="CancelClick(scope.row,scope.$index)" type="text" size="small">取消</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
              </div>
          </div>
      </div>
</template>

<script>
  export default {
    name: 'detail-paymentsingle',
    data() {
      return {
          detailLoading: false,
          tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          ids: true
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333,
          ids: true
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333,
          ids: true
        }, {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333,
          ids: true
        }],
        optionAreas: [
            {
                value: 1,
                label: '王小虎'
            },
            {
                value: 2,
                label: '23'
            },
            {
                value: 3,
                label: '123'
            },
            {
                value: 4,
                label: 'de'
            }
        ]
      }
    },
    methods: {
        handleClick(row, index) {
            if (row.ids) {
                this.tableData[index].ids = !row.ids
            } else {
                this.tableData[index].ids = !row.ids
            }
        },
        SaveClick(row, index) {
            this.$confirm('确定保存这条数据？, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableData[index].ids = !row.ids

                // 返回一个id 放上去
                // deleteBookKeepByIDs({
                //     ids: [row.KeyID]
                // }).then(({ Data, BusCode, Msg }) => {
                //     this.$message.success('删除成功!')
                //     const index = this.list.findIndex(v => v.KeyID === row.KeyID)
                //     this.list.splice(index, 1)
                // }).catch(() => {
                //     this.$message.error('删除失败!')
                // })
            })
        },
        CancelClick(row, index) {
            this.tableData[index].ids = !row.ids
        },
        DeleteClick(row, index) {

        },
        addItem() {
            const additem = {
                date: '',
                name: '',
                province: '',
                city: '',
                address: '',
                zip: '',
                ids: false
            }
            this.tableData.push(additem)
        },
        selectAreaChange(row, index) {
            console.log(row, index)
        }
    },
    computed: {

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
  .detail-content {
    min-height: 480px;
    width: 90%;
    margin: 0 auto;
    background-color: white;
  }
  p{
     margin-bottom: 10px;
   }

  .TopTittle{
      font-size: 16px;
      overflow: hidden;
      span {
          float: left;
      }
      span:nth-child(1){
          height: 18px;
          width: 5px;
          background-color: #389ef2;
      }
      span:nth-child(2){
          margin-left: 10px;
      }
  }
  .leftWidth{
      width: 70%;
  }
  .TopConList{
      margin-top: 20px;
    .conList{
        overflow: hidden;
            padding: 12px 0;
            font-size: 14px;
        .detail-conList{
            overflow: hidden;
            float: left;
            width: 33.3%;
            p{
                float: left;
            }
            p:nth-child(1){
                width: 70px;
                text-align: right;
            }
            p:nth-child(2){
                margin-left: 20px;
            }
        }
    }
  }
  .fitmentItem{
      font-size: 14px;
      margin-right: 20px;
  }
  .marginT20{
      margin: 30px 0;
  }
</style>
