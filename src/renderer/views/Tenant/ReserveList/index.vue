<template>
    <div class="app-container data-list">
        <search-panel :model="form" ref="form" label-width="100px">
            <template slot="search">
                <el-form-item label="关键字" prop="keyword" class="form-item-md">
                    <el-input
                            placeholder="房源名称/看房人姓名/电话"
                            v-model="form.keyword"
                    >
                    </el-input>
                </el-form-item>
            </template>
            <template slot="more">
                <div class="clearfix">
                    <el-form-item prop="date" label-width="100px">
                        <el-form-item label="预约看房时间">
                            <el-date-picker
                                    v-model="form.date"
                                    type="daterange"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-form-item>
                </div>
                <div class="clearfix">
                    <el-form-item label="状态" prop="checkAll" label-width="100px">
                        <el-checkbox
                            :indeterminate="isIndeterminate"
                             v-model="form.checkAll"
                             @change="handleCheckAllChange"
                        > 全部
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item prop="status">
                        <el-checkbox-group v-model="form.status" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="(status, index) in orderstatus" :label="status.label" :key="status.label">
                            {{ status.name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
            </template>
            <template slot="button">
                <el-button size="medium" @click="handleSearch" type="primary">查询</el-button>
                <el-button size="medium" @click="handleReset" type="primary">重置</el-button>
            </template>
        </search-panel>
        <div class="panel data-list-table table-expend">
            <el-table
                    :data="ReserveDatalist"
                    ref="multipleTable"
                    v-loading.body="listLoading"
                    height="100%"
                    element-loading-text="Loading"
                    class="table-normal"
                    border fit highlight-current-row>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="table-expand-form">
                            <el-form-item label="看房人姓名">
                                <span>{{ props.row.CousterName }}</span>
                            </el-form-item>
                            <el-form-item label="看房人电话">
                                <span>{{ props.row.CousterPhone }}</span>
                            </el-form-item>
                            <el-form-item label="预约看房时间" label-width="100px">
                                <span>{{$dateFormat(props.row.AppointTime)}}</span>
                            </el-form-item>
                            <el-form-item label="房源名称">
                                <span>{{ props.row.HouseName}}</span>
                            </el-form-item>
                            <el-form-item label="备注">
                                <span>{{props.row.Remark}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column align="center" label='房源名称' min-width="320">
                    <template slot-scope="scope">
                        {{scope.row.HouseName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="看房人信息" min-width="220">
                    <template slot-scope="scope">
                        <p>{{scope.row.CousterName}}</p>
                        <p>{{scope.row.CousterPhone}}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="LastSignDate" label="预约看房时间" min-width="250">
                    <template slot-scope="scope">
                        <span>{{$dateFormat(scope.row.AppointTime)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="Remark" label="备注" min-width="250">
                    <template slot-scope="scope">
                        <table-remark
                                :options="tableRemarkOptions"
                                :allRemark="scope.row.Remark"
                        >
                        </table-remark>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="预约状态" prop="AppointmentStatus" min-width="200">
                    <template slot-scope="scope">
                        <span>{{$EnumData.getEnumDesByValue('AppointmentStatus',scope.row.AppointmentStatus)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" min-width="250">
                    <template slot-scope="scope">
                        <table-buttons
                                :options="operationReserveButton"
                                :condition="ConditionList(scope.row.AppointmentStatus)"
                                @handleVisitedClick="handleVisited(scope.$index, scope.row)"
                                @handleDeleteClick="handleDelete(scope.$index, scope.row)"
                        >
                        </table-buttons>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <bottom-tool-bar
                ref="bottomToolBar"
                :page-size="pageSize"
                :handlePageChange="GetTabeledata"
        >
        </bottom-tool-bar>
    </div>
</template>
<style lang="scss">
    @import './ReserveList';
</style>
<script>
  const OrderOptions = [
    {
      label: 2,
      name: '已看房'
    },
    {
      label: 1,
      name: '未看房'
    },
    {
      label: 3,
      name: '已过期'
    }
  ]
    import SearchPanel from '@/components/SearchPanel' // 引入整个样式布局组件
    import BottomToolBar from '@/components/BottomToolBar' // 引入底部布局样式
    import { GetReserveList, SeeHouse, deleteHouse } from '@/api/tenant'
    // 引入公用样式组件
    import TableButtons from '@/components/TableButtons'
    import TableRemark from '@/components/TableRemark'

    export default {
        name: 'ReserveList',
        data() {
            return {
                listLoading: false,
                ReserveDatalist: [],
                orderstatus: OrderOptions,
                // 全选是否勾选上 默认为true
                isIndeterminate: false,
                tableRemarkOptions: {},
                pageSize: 10,
                operationReserveButton: [
                    {
                        key: 'Visited',
                        value: '已看房',
                        type: 'success',
                        size: 'mini'
                    },
                    {
                        key: 'Delete',
                        value: '删除',
                        type: 'danger',
                        size: 'mini'
                    }
                ],
                // 预约单查询参数
                form: {
                    keyword: '',
                    date: [],
                    checkAll: false,
                    status: [],
                    appointStartTime: '',
                    appointEndTime: ''
                }
            }
        },
        components: {
            SearchPanel,
            TableButtons,
            TableRemark,
            BottomToolBar
        },
       activated() {
        this.$refs.bottomToolBar.search(1)
       },
        methods: {
            // 按钮判断
            ConditionList(tag) {
                switch (tag) {
                    case 1:
                        return ['Visited']
                    case 2:
                        return []
                    case 3:
                        return ['Visited', 'Delete']
                }
            },
            // 假设后端有数据传入
            GetTabeledata(pages) {
                // 分页参数的处理
                if (!pages) {
                    pages = {
                        size: this.pageSize,
                        page: 1
                    }
                }
                this.listLoading = true
                if (!this.form.date) {
                    this.form.date = []
                }
              this.form.appointStartTime = this.$dateFormat(this.form.date[0], 'yyyy-MM-dd hh:mm:ss')
              this.form.appointEndTime = this.$dateFormat(this.form.date[1], 'yyyy-MM-dd hh:mm:ss')
                return GetReserveList({
                    parm: pages,
                    screen: this.form
                }).then(({ Data, BusCode, Msg }) => {
                    if (Data) {
                        this.ReserveDatalist = Data.rows
                        this.listLoading = false
                    } else {
                       return false
                    }
                    return Data
                })
            },
            // 点击查询
            handleSearch() {
               this.$refs.bottomToolBar.search()
            },
            // 点击重置按钮
            handleReset() {
                this.$refs['form'].resetFields()
                this.$refs.bottomToolBar.search()
            },
            // 输入框的全选与取消
            handleCheckAllChange(val) {
                console.log(val)
                this.form.status = val ? OrderOptions : []
                this.isIndeterminate = false
                this.$refs.bottomToolBar.search()
            },
            handleCheckedCitiesChange(value) {
                console.log(value)
                const checkedCount = value.length
                this.form.checkAll = checkedCount === this.orderstatus.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.orderstatus.length
                this.$refs.bottomToolBar.search()
            },
            // 修改为已看房
            handleVisited(index, row) {
                this.$confirm('确定修改为已看房?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    SeeHouse({
                        keyID: row.keyID
                    }).then((reponse) => {
                        console.log(reponse)
                        if (reponse) {
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            })
                            row.AppointmentStatus = 2
                        } else {
                            this.$message({
                                type: 'info',
                                message: '修改失败!'
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    })
                })
            },
            // 点击删除按钮
            handleDelete(index, row) {
                this.$confirm('确定删除这条看房记录?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteHouse({
                        keyID: row.keyID
                    }).then((reponse) => {
                        if (reponse) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            this.ReserveDatalist.splice(index, 1)
                        } else {
                            this.$message({
                                type: 'info',
                                message: '删除失败!'
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }
        },
        computed: {
          // 看房状态的枚举值(3种)
          AppointmentStatus() {
            return this.$EnumData.getEnumListByKey('AppointmentStatus')
          }
        }
    }
</script>
