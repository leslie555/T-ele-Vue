<template>
    <div class="app-container data-list changeHouseDistribution">
        <search-panel :model="ruleForm" ref="ruleForm" label-width="80px" box-flex right-width="320px">
            <template slot="search">
                <SelectOrganization v-model="ruleForm.DepID" @change="handleStoreChange"></SelectOrganization>
                <el-form-item label="管房人" prop="HousePersonName" v-if="!isEmpty">
                    <el-autocomplete
                        :disabled="judgeHouse"
                        class="inline-input"
                        v-model="ruleForm.HousePersonName"
                        placeholder="请先选择门店,再查询"
                        clearable
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        @select="handleSelect"
                    >
                        <template slot-scope="props">
                            <div :disabled="props.item.id === 1" class="name">{{ props.item.value }}</div>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item label="房源名称" prop="HouseName">
                    <el-input
                        placeholder="房源名称"
                        v-model="ruleForm.HouseName"
                        style="width: 200px"
                    >
                    </el-input>
                </el-form-item>
                <!-- <el-form-item label="小区名称" prop="VillageName">
                    <el-input
                        placeholder="小区名称"
                        v-model="ruleForm.VillageName"
                        style="width: 200px"
                    >
                    </el-input>
                </el-form-item> -->
            </template>
            <!-- <template slot="more">
                <div class="clearfix">
                    <el-form-item label="房间号" prop="HouseNumber">
                        <el-input
                            placeholder="房间号"
                            v-model="ruleForm.HouseNumber"
                            style="width: 200px"
                        >
                        </el-input>
                    </el-form-item>
                </div>
            </template> -->
            <template slot="button">
                <el-button type="primary" @click="batchBtn">批量换管房人</el-button>
                <el-button type="primary" @click="submitForm">查询</el-button>
                <el-button type="primary" @click="resetForm">重置</el-button>
            </template>
        </search-panel>
                <!-- :row-key="getRowKeys" -->
        <div class="panel data-list-table">
            <el-table
                :data="filterList"
                border
                ref="multipleTable"
                v-loading.body="listLoading"
                element-loading-text="加载中"
                fit
                height="100%"
                class="table-normal"
                @selection-change="handleSelectionChange">
                <!-- :reserve-selection="true" -->
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column align="center"  label='房源名称' min-width="130" prop="HouseName"></el-table-column>
                <el-table-column align="center"  label='组织' min-width="330" prop="Organization"></el-table-column>
                <el-table-column align="center"  label='小区' min-width="130" prop="CommunityName"></el-table-column>
                <el-table-column align="center"  label='房间号' min-width="60" prop="RoomNumber"></el-table-column>
                <el-table-column align="center"  label='管房人' min-width="130">
                    <template slot-scope="scope">
                        <span style="margin-right:10px;">{{scope.row.TubUserName}}</span><span>{{scope.row.TubTel}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                fixed="right"
                label="操作"
                min-width="100">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="changePerson(scope.$index, scope.row)">换管房人</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <bottom-tool-bar
            ref="bottomToolBar"
            :checkedLength="multipleSelection.length"
            :page-size="pageSize"
            :handlePageChange="fetchData"
            >
            <span></span>
            <!-- <el-button
                type="danger"
                icon="delete"
                size="mini"
                :disabled="this.multipleSelection.length === 0"
                @click="handleEmptyAll">
                <span>清空勾选</span>
            </el-button> -->
        </bottom-tool-bar>

        <el-dialog
        title="选择管房人"
        append-to-body
        :before-close="fasleBtn"
        :visible.sync="dialogVisible"
        width="700px">
            <div style="height: 160px;">
                <el-form :model="ContractInfo" :inline="true" :rules="rules.rule4" status-icon ref="ruleForm4"
                        class="step1"
                        label-width="140px">
                <div class="clearfix addoverflow">
                    <el-form-item label="管房人"  style="margin-left:70px;" prop="OutRoomInfo" class="form-item-md">
                        <el-select
                            v-model="ContractInfo.OutRoomInfo"
                            multiple
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入管房人姓名或电话"
                            :remote-method="outRoomInfoRemoteMethod"
                            @change="outRoomInfoChange"
                            :loading="OutRoomInfoLoading">
                            <el-option
                            v-for="item in OutRoomInfoResult"
                            :key="item.KeyID"
                            :label="item.UserName"
                            :value="item.KeyID">
                                <span style="float: left">{{ item.UserName }}</span>
                            <span
                                style="float: right; color: #8492a6; font-size: 13px;margin-right: 20px">{{ item.Tel }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                </el-form>
                <div class="selectbtn">
                    <el-button @click="sureBtn" :loading="btnLoading" type="primary">确定</el-button>
                    <el-button @click="fasleBtn">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<style lang="scss">
    .changeHouseDistribution .search-header-right{
        width: 320px !important;
    }
</style>
<script>
    import { editHouseInfoEmp } from '@/api/house'
      import { HouseEmployeeList, HouseEmployeeListByFullID, ShowChangeHouseInfoList } from '../../../api/system'
  import { BottomToolBar, SearchPanel, TableButtons, SelectStore, SelectOrganization } from '../../../components'
    import { mapState } from 'vuex'
    export default {
        components: {
            SearchPanel,
            TableButtons,
            BottomToolBar,
            SelectStore,
            SelectOrganization
        },
        data() {
            return {
                filterList: [],
                listLoading: true,
                tableSelected: [],
                pageSize: 10,
                ruleForm: {
                    DepID: '',
                    HouseName: '',
                    HousePerson: '',
                    HousePersonName: ''
                },
                // 只有选择了门店 才能选择管房人
                judgeHouse: true,
                ContractInfo: {
                    OutRoomInfo: ''
                },
                // 列表框√
                multipleSelection: [],
                getSelectValue: [],
                dialogVisible: false,
                // 列表数据
                OutRoomInfoResult: [],
                OutRoomInfoList: [],
                OutRoomInfoLoading: false,
                MyHouseKey: [],
                rules: {
                    rule4: {
                        OutRoomInfo: [
                        { required: false, message: '请输入并选择官房人', trigger: 'blur' }
                        ]
                    }
                },
                btnLoading: false
            }
        },
        computed: {
          ...mapState({
            isEmpty: state => state.organizationTree.isEmpty
          })
        },
        methods: {
            outRoomInfoRemoteMethod(query) {
                if (query !== '') {
                    this.OutRoomInfoLoading = true
                    const pageParam = {
                      size: 20,
                      page: 1
                    }
                    HouseEmployeeList({
                        Keyword: query,
                        pageParam
                        // SelectByID: this.ContractInfo.OutRoomCompanyID
                    }).then(({ Data }) => {
                        this.OutRoomInfoLoading = false
                        this.OutRoomInfoResult = Data
                    })
                } else {
                    this.OutRoomInfoResult = []
                }
            },
            outRoomInfoChange(data) {
                // 利用新增或者删除一个就会进入这个函数 不可能相等
                // 删除
                if (data.length < this.OutRoomInfoList.length) {
                    this.OutRoomInfoList.map((v, i) => {
                        if (!data.find(x => x === v.KeyID)) {
                        this.OutRoomInfoList.splice(i, 1)
                        }
                    })
                } else {
                // 新增
                    const id = data[data.length - 1]
                    const item = this.OutRoomInfoResult.find(x => x.KeyID === id)
                    this.OutRoomInfoList.push({
                        KeyID: item.KeyID,
                        UserName: item.UserName,
                        Tel: item.Tel,
                        FullID: item.FullID,
                        CompanyID: item.CompanyID
                    })
                }
      },
            fetchData(pages) {
                if (!pages) {
                    pages = {
                        size: this.pageSize,
                        page: 1
                    }
                } else {
                    this.recordPage = pages
                }
                this.listLoading = true
                return ShowChangeHouseInfoList({
                    pageParam: pages,
                    HouseName: this.ruleForm.HouseName,
                    QueryFullID: this.ruleForm.DepID,
                    EmpQueryFullID: this.ruleForm.HousePerson

                }).then(({ Data }) => {
                    const filterList = Data.rows
                    this.filterList = filterList
                    this.listLoading = false
                    // 分页的时候清空 选中数据
                    this.multipleSelection = []
                    // if (this.multipleSelection.length > 0) {
                    //     for (let i = 0; i < this.multipleSelection.length; i++) {
                    //         for (let j = 0; j < this.filterList.length; j++) {
                    //             if (this.multipleSelection[i].HouseKey === this.filterList[j].HouseKey) {
                    //                 this.$refs.multipleTable.toggleRowSelection(this.filterList[j], true)
                    //             }
                    //         }
                    //     }
                    // }
                    return Data
                })
                .catch(() => {
                    this.listLoading = false
                })
            },
            submitForm() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.$refs.bottomToolBar.search()
                    }
                })
            },
            resetForm() {
                this.ruleForm.HousePerson = ''
                this.ruleForm.HousePersonName = ''
                this.judgeHouse = true
                this.ruleForm.DepID = ''
                this.$refs.ruleForm.resetFields()
                this.$refs.bottomToolBar.search()
                // 门店选择框重置
                this.$refs.selectStore.reset()
            },
            batchBtn() {
                if (this.multipleSelection.length === 0) {
                    this.$message.error('请勾选房源')
                    return
                }
                this.MyHouseKey = []
                this.multipleSelection.forEach(item => {
                    this.MyHouseKey.push(item.HouseKey)
                })
                this.dialogVisible = true
            },
            handleStoreChange(val) {
                // 选择门店后的回调
                if (val.length !== 0) {
                    // this.ruleForm.DepID = val.fullID
                    this.judgeHouse = false
                } else {
                    this.ruleForm.DepID = ''
                    this.judgeHouse = true
                }
                this.ruleForm.HousePerson = ''
                this.ruleForm.HousePersonName = ''
            },
            changePerson(index, row) {
                this.MyHouseKey = []
                this.MyHouseKey.push(row.HouseKey)
                this.dialogVisible = true
            },
            // getRowKeys(row) {
            //     return row.HouseKey
            // },
            // handleEmptyAll() {
            //     this.$refs.multipleTable.clearSelection()
            // },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            getPeople(data) {
                this.dialogVisible = false
            },
                //  模糊查询下拉框选择
            handleSelect(val) {
                this.ruleForm.HousePerson = val.FullIDNew
            },
            //   模糊查询
            querySearch(queryString, cb) {
                const pages = {
                    size: 20,
                    page: 1
                }
                HouseEmployeeListByFullID({
                    Keyword: queryString,
                    pageParam: pages,
                    FullID: this.ruleForm.DepID
                }).then(({ Data, BusCode, Msg }) => {
                    Data.forEach(val => {
                        val.value = val.UserName
                    })
                    cb(Data)
                })
            },
            sureBtn() {
                if (this.OutRoomInfoList.length === 0) {
                    this.$message.error('请选择管房人')
                    return
                }
                var obj = {
                    MyHouseEmp: this.OutRoomInfoList,
                    MyHouseKey: this.MyHouseKey
                }
                this.btnLoading = true
                console.log(obj)
                editHouseInfoEmp(obj).then(({ Data, BusCode, Msg }) => {
                    this.btnLoading = false
                    this.$message.success('修改成功!')
                    this.$refs.bottomToolBar.search(2)
                    this.fasleBtn()
                }).catch(() => {
                  this.btnLoading = true
                })
            },
            fasleBtn() {
                this.dialogVisible = false
                this.MyHouseKey = []
                // 清空选择的人员
                this.OutRoomInfoList = []
                this.$refs.ruleForm4.resetFields()
            }
        }
    }
</script>

<style lang="scss" scoped>
  @import "style";
  .selectbtn{
    //   margin: 0 auto;
    display: flex;
    justify-content: center;
    justify-items: center;
      margin-top: 20px;

  }
  .selectbtn span{
      display: inline-block;
      height: 35px;
      width: 70px;
      background-color: #389ef2;
      border-radius: 10px;
      color: white;
      line-height: 35px;
      text-align: center;
      cursor: pointer;
  }
  .selectbtn span:nth-child(1){
      margin-right: 50px;
  }
  .addoverflow{
    height: 100px !important;
    overflow-y: scroll;
  }
  .addoverflow::-webkit-scrollbar{
	display: none
}
</style>
