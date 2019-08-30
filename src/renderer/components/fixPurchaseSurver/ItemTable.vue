<template>
        <div>
            <div style="margin-top:15px;">
                <span class="fitmentItem">填写装修单</span>
                <el-button size="small" @click="addItem" plain>添加项目</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                style="width: 100%;margin-top:30px;">
                <el-table-column
                label="装修部门"
                prop="name"
                min-width="150">
                    <template slot-scope="scope">
                        <el-select size="small" :disabled="scope.row.ids"  v-model="scope.row.SupplyCommodityCategoryID" placeholder="请选择">
                            <el-option
                                v-for="item in ShowAllSupplierCategory"
                                :key="item.KeyID"
                                :label="item.CategoryName"
                                :value="item.KeyID"
                            ></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                label="项目名称"
                prop="name"
                min-width="150">
                    <template slot-scope="scope">
                            <el-select size="small"  :disabled="scope.row.ids"  v-model="scope.row.RenovationApplyConfigueID" @change="selectAreaChange(scope.row.RenovationApplyConfigueID,scope.$index)" placeholder="请选择">
                                <el-option
                                    v-for="item in ShowRenovationProject"
                                    :key="item.KeyID"
                                    :label="item.ProjectName"
                                    :value="item.KeyID"
                                ></el-option>
                            </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                prop="Model"
                label="型号"
                min-width="120">
                    <template slot-scope="scope">
                        <span >{{scope.row.Model}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="InsidePrice"
                label="内部单价"
                min-width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.InsidePrice}}{{scope.row.Unit}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="ExternalPrice"
                label="外部单价"
                min-width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.ExternalPrice}}{{scope.row.Unit}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="Number"
                label="数量"
                min-width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.ids">{{scope.row.Number}}</span>
                        <el-input v-else size="small" @input="getCurrentRow(scope.row.Number, scope.$index, scope.row)"  v-model="scope.row.Number"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                prop="InsidePriceTotalAmount"
                label="内部总金额"
                width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.InsidePriceTotalAmount}}元</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="ExternalPriceTotalAmount"
                label="外部总金额"
                width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.ExternalPriceTotalAmount}}元</span>
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
                    <el-button v-if="!scope.row.ids && (scope.row.KeyID || scope.row.KeyID === 0)" @click="CancelClick(scope.row,scope.$index)" type="text" size="small">取消</el-button>
                </template>
                </el-table-column>
            </el-table>
            <el-form ref="form" :model="form" label-width="100px" style="margin-top:20px;">
                <el-form-item label="装修单备注">
                    <el-input type="textarea" v-model="form.purchaseRemark"></el-input>
                </el-form-item>
            </el-form>
        </div>
</template>

<script>
    import { ShowDecorationSheetDetails, ShowAllSupplierCategory, ShowRenovationProject, AddDecorationSheetDetails, UpdateDecorationSheetDetails, DelDecorationSheetDetails } from '@/api/purchase'
  export default {
    name: 'ItemTabel',
    props: ['KeyID'],
    data() {
        return {
            // 备注
            form: {
                purchaseRemark: ''
            },
            // 装修部门
            ShowAllSupplierCategory: [],
            // 项目名称
            ShowRenovationProject: [],
            // 保存返回来的数据，取消时候调用
            savaTableList: [],
            tableData: []
        }
    },
    methods: {
        // 修改
        handleClick(row, index) {
            const tableData = [...this.tableData]
            tableData[index].ids = !this.tableData[index].ids
            this.tableData = tableData
        },
        SaveClick(row, index) {
            // 有row.KeyID为修改，无为新增
            if (row.KeyID || row.KeyID === 0) {
                UpdateDecorationSheetDetails(row).then(({ Data, BusCode, Msg }) => {
                    this.tableData[index].ids = !this.tableData[index].ids
                    const tableData = this.$deepCopy(this.tableData[index])
                    this.tableData.splice(index, 1, tableData)
                    // 初始拷贝数据与列表数据同步
                    this.savaTableList[index] = this.$deepCopy(this.tableData[index])
                }).catch(() => {
                })
            } else {
                this.$confirm('确定保存这条数据？, 是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    AddDecorationSheetDetails(row).then(({ Data, BusCode, Msg }) => {
                        this.tableData[index].ids = !this.tableData[index].ids
                        this.tableData[index].KeyID = Data.KeyID
                        const tableData = this.$deepCopy(this.tableData[index])
                        this.tableData.splice(index, 1, tableData)
                        this.savaTableList[index] = this.$deepCopy(this.tableData[index])
                        // 监听长度判断提交
                        this.$emit('changeLength', { length: this.savaTableList.length, index: 0 })
                    }).catch(() => {
                    })
                })
            }
        },
        CancelClick(row, index) {
            // 方法一
            // this.tableData.splice(index, 1, this.$deepCopy(this.savaTableList[index]))
            // 方法二
            this.$set(this.tableData, index, this.$deepCopy(this.savaTableList[index]))
        },
        DeleteClick(row, index) {
            if (row.KeyID || row.KeyID === 0) {
              this.$confirm('确定删除这条数据？, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                DelDecorationSheetDetails({
                    KeyID: row.KeyID
                }).then(({ Data, BusCode, Msg }) => {
                    this.$message.success('删除成功!')
                    // 删除成功 列表删除 和初始化深度拷贝的数据也要同步
                    this.tableData.splice(index, 1)
                    this.savaTableList.splice(index, 1)
                    // 监听长度判断提交
                    this.$emit('changeLength', { length: this.savaTableList.length, index: 0 })
                }).catch(() => {
                    this.$message.error('删除失败!')
                })
            })
          } else {
            this.tableData.splice(index, 1)
          }
        },
        addItem() {
            const additem = {
                SupplyCommodityCategoryID: '',
                RenovationApplyConfigueID: '',
                Model: '',
                InsidePrice: '',
                ExternalPrice: '',
                Number: '',
                InsidePriceTotalAmount: '',
                ExternalPriceTotalAmount: '',
                ids: false
            }
            this.tableData.push(additem)
        },
        // 下拉框选中 赋值给内部金额和外部金额和型号
        selectAreaChange(val, index) {
            const result = this.ShowRenovationProject.find(item => { return item.KeyID === val })
            console.log(result)
            const tableData = [...this.tableData]
            tableData[index].Model = result.Model
            tableData[index].InsidePrice = result.InsidePrice
            tableData[index].ExternalPrice = result.ExternalPrice
            tableData[index].ProjectName = result.ProjectName
            tableData[index].Unit = result.Unit
            // 赋值详情列表ID给这边数据
            tableData[index].RenovationApplyRecordID = this.KeyID
            this.tableData = tableData
        },
        // 监听数量变化 然后计算出内部总金额和外部总金额
        getCurrentRow(val, index, row) {
               this.tableData[index].InsidePriceTotalAmount = val * Number(row.InsidePrice)
              this.tableData[index].ExternalPriceTotalAmount = val * Number(row.ExternalPrice)
        },
        // 列表数据接口
        getDetailData(KeyID) {
          ShowDecorationSheetDetails({
              KeyID: KeyID
          }).then(({ Data, BusCode, Msg }) => {
              this.tableData = Data
              // ids true 为不能修改 false 可修改
              this.tableData.forEach(val => {
                val.ids = true
              })
              if (this.tableData.length !== 0) {
                this.form.purchaseRemark = this.tableData[0].ZXBZ
              }
              // 深度拷贝列表数据 this.tableData改变savaTableList也要改变
              this.savaTableList = this.$deepCopy(this.tableData)
              // 监听长度判断提交
              this.$emit('changeLength', { length: this.savaTableList.length, index: 0 })
          })
        },
        // 下拉框的接口
        async selectApi() {
            const [type, project] = await Promise.all([ShowAllSupplierCategory(), ShowRenovationProject()])
            this.ShowAllSupplierCategory = type.Data
            this.ShowRenovationProject = project.Data
        }
    },
    created() {
        this.getDetailData(this.KeyID)
        this.selectApi()
        // this.savaTableList = this.$deepCopy(this.tableData)
    },
    watch: {
        'form.purchaseRemark': function(val, oldVal) {
            const returnData = {
                val: val,
                index: 0
            }
            this.$emit('changeTextArea', returnData)
        }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
    .fitmentItem{
      font-size: 14px;
      margin-right: 20px;
  }
</style>
