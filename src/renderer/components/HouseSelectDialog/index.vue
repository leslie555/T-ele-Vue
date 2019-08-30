<template>
    <el-dialog width="30%" title="房源列表" :close-on-click-modal="false" :center="true" :show-close="false" :visible.sync="visible" append-to-body>
        <el-form :model="houseListform">
            <el-form-item label="关键字" label-width="100px">
                <el-input placeholder="请输入房源名称" v-model="houseListform.keyword">
                    <el-button slot="append" icon="el-icon-search" @click="submitHouseListSearch"></el-button>
                </el-input>
            </el-form-item>
        </el-form>
        <el-table highlight-current-row @current-change="handleCurrentChange" :data="tableData" :default-sort="{prop: 'houseName', order: 'descending'}" style="width: 100%">
            <el-table-column prop="houseName" label="房源名称" width="180">
            </el-table-column>
            <el-table-column prop="houseType" label="户型" width="180">
            </el-table-column>
            <el-table-column prop="orderBill" label="定金">
            </el-table-column>
            <el-table-column prop="rentBill" label="租金">
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="10">
        </el-pagination>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="selectedHouse">确 定</el-button>
            <el-button type="primary" @click="closeDialog">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { getSelectHouseInfoForSearch } from '@/api/house'
    export default {
      name: 'houseSelectDialog',
      props: {
        visible: {
          type: Boolean,
          default: false
        },
        keyword: {
          type: String,
          default: ''
        }
      },
      data() {
        return {
          tableData: [
            {
              houseName: 123,
              houseType: 123,
              orderBill: 123,
              rentBill: 123
            }
          ],
          curretRow: null
        }
      },
      computed: {
        houseListform() {
          return {
            keyword: this.keyword
          }
        }
      },
      methods: {
        updateTable(data) {
          getSelectHouseInfoForSearch(data).then(res => {
            // debugger
            this.handleTableData(res.Data)
            console.log(res)
          })
        },
        handleTableData(data) {
          const tableDatas = data.Datas
          const table = []
          // debugger
          tableDatas.forEach((val, idx) => {
            table.push({
              houseName: val.HouseName,
              houseType: `${val.RoomCount}室${val.HallCount}厅`,
              orderBill: val.AgentMoney,
              rentBill: val.RentMoeny
            })
          })
          this.tableData = table
        },
        submitHouseListSearch() {
          this.updateTable(this.houseListform)
        },
        selectedHouse() {
          const houseName = this.curretRow
            ? this.curretRow.houseName
            : ''
          this.$emit('selectComplete', houseName)
          this.$emit('closeDialog')
        },
        closeDialog() {
          this.$emit('closeDialog')
        },
        handleCurrentChange(curretRow) {
          this.curretRow = curretRow
        }
      },
      created() {
        this.updateTable(this.houseListform)
      }
    }
</script>
