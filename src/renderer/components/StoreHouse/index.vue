<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="titleSize"
    :width="widthRange"
    append-to-body
    center
    @close="close"
  >
    <div class="settlement-box">
        <div v-if="num === 1">
            <el-form label-width="120px" :model="Storage" :inline="false" :rules="rulesStorage" ref="Storage" style="margin-top:20px;">
                <el-form-item label="名称:">
                    <p>{{ Storage.name }}</p>
                </el-form-item>
                <el-form-item label="入库数量:" prop="Number">
                    <el-input type="number" style="width:250px;"  v-model="Storage.Number"></el-input>
            </el-form-item>
            </el-form>
        </div>
        <div v-if="num === 2">
            <el-form label-width="120px" :model="delivery" :inline="false" :rules="rulesDelivery" ref="delivery" style="margin-top:20px;">
                <el-form-item label="名称:">
                    <p>{{ delivery.name }}</p>
                </el-form-item>
                <el-form-item label="出库数量:" prop="Number">
                    <el-input type="number" style="width:250px;"  v-model="delivery.Number"></el-input>
                </el-form-item>
                <el-form-item label="使用途径:">
                    <el-input type="textarea" style="width:355px;"  v-model="delivery.WaysUse"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="num === 3 || num === undefined">
            <el-form label-width="90px" :model="warehouse"  ref="warehouse" :rules="rules" :inline="true" style="margin-top:20px;">
                <el-form-item label="选择类别:" prop="CategoryID">
                    <el-select v-model="warehouse.CategoryID" style="width:250px;" placeholder="请选择">
                        <el-option
                        v-for="item in CategoryList"
                        :key="item.KeyID"
                        :label="item.CategoryName"
                        :value="item.KeyID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目名称:" style="margin-left:50px;" prop="ProjectName">
                    <el-input style="width:250px;"  v-model="warehouse.ProjectName"></el-input>
                </el-form-item>
                <el-form-item label="型号:">
                    <el-input style="width:250px;"  v-model="warehouse.Model"></el-input>
                </el-form-item>
                <el-form-item label="单位:" style="margin-left:50px;" prop="Unit">
                    <el-select v-model="warehouse.NumberUnit" style="width:250px;" placeholder="请选择">
                        <el-option
                        v-for="item in UnitData"
                        :key="item.Value"
                        :label="item.Definition"
                        :value="item.Value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量:">
                    <el-input type="number" style="width:250px;"  v-model="warehouse.Number"></el-input>
                </el-form-item>
                <el-form-item label="" style="margin-left:50px;">
                    <p style="width:250px;"></p>
                </el-form-item>
                <el-form-item label="内部单价:" prop="InsidePrice">
                    <el-input type="number" style="width:250px;"  v-model="warehouse.InsidePrice"></el-input>
                </el-form-item>
                <el-form-item label="外部单价:" style="margin-left:50px;"  prop="ExternalPrice">
                    <el-input type="number" style="width:250px;"  v-model="warehouse.ExternalPrice"></el-input>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input type="textarea" style="width:655px;" v-model="warehouse.BZ"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div  v-if="num === 4" class="settlement-box" style="max-height:700px;;overflow-y:scroll;">
            <div style="min-height:300px;">
                <div class="operationAll" v-for="(item,index) in operation" :key="index" :class="index === 0 ? '':'padT20'"> 
                    <div class="operation">
                        <span>{{ $dateFormat(item.CreaterTime) }}</span>
                        <span style="margin-left:30px;">操作人：</span>
                        <span>{{ item.UserName }}</span>
                    </div>
                    <div class="operationBottom">
                        <span>{{ item.OperationalRecords }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="num !== 4" style="display: flex;justify-content: center;">
            <el-button @click="submitData" type="primary">提交</el-button>
        </div>
    </div>
  </el-dialog>
</template>

<script>
    import { AddStorageRoom, InStock, OutStock, EditStorageRoom, ShowStorageOperationalRecords } from '../../api/purchase'
  export default {
    name: 'StoreHouseC',
    props: ['CategoryList'],
    data() {
        return {
            showDialog: false,
            widthRange: '',
            titleSize: '',
            num: null,
            // 单位
            UnitData: null,
            KeyID: null,
            recordPage: {},
            Storage: {
                name: '',
                Number: ''
            },
            delivery: {
                name: '',
                Number: '',
                WaysUse: ''
            },
            warehouse: {
                CategoryID: '',
                ProjectName: '',
                Model: '',
                Unit: '',
                Number: '',
                InsidePrice: '',
                ExternalPrice: '',
                BZ: ''
            },
            recordNumber: null,
            operation: [],
            rules: {
                CategoryID: [
                    { required: true, message: '请选择类别', trigger: 'change' }
                ],
                ProjectName: [
                    { required: true, message: '请选择项目名称', trigger: 'blur' }
                ],
                NumberUnit: [
                    { required: true, message: '请选择单位', trigger: 'change' }
                ],
                InsidePrice: [
                    { required: true, message: '请选择内部单价', trigger: 'blur' }
                ],
                ExternalPrice: [
                    { required: true, message: '请选择外部单价', trigger: 'blur' }
                ]
            },
            rulesDelivery: {
                Number: [
                    { required: true, message: '请输入数量', trigger: 'blur' }
                ]
            },
            rulesStorage: {
                Number: [
                    { required: true, message: '请输入数量', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
    },
    methods: {
        open(val) {
            this.storeUint()
            //  判断新增
            if (val.row !== undefined) {
                this.KeyID = val.row.KeyID
                this.Storage.name = val.row.ProjectName
                this.delivery.name = val.row.ProjectName
                this.UnitData.forEach(item => {
                    if (val.row.Unit === item.Description) {
                        val.row.NumberUnit = item.Value
                        console.log(item.Value)
                    }
                })
            }
            this.num = val.num
            // 强制刷新页面
            // this.num = 100
            // this.$nextTick(() => {
            //     this.num = val.num
            // })
            if (val.num === 1) {
                this.titleSize = '入库'
                this.widthRange = '600px'
            } else if (val.num === 2) {
                this.titleSize = '出库'
                this.widthRange = '600px'
                this.recordNumber = val.row.Number
            } else if (val.num === undefined) {
                this.titleSize = '新增'
                this.widthRange = '900px'
                this.warehouse = {
                    CategoryID: '',
                    ProjectName: '',
                    Model: '',
                    Unit: '',
                    NumberUnit: '',
                    Number: '',
                    InsidePrice: '',
                    ExternalPrice: '',
                    BZ: ''
                }
                // 单位Api
            } else if (val.num === 3) {
                this.titleSize = '修改'
                this.widthRange = '900px'
                this.warehouse = JSON.parse(JSON.stringify(val.row))
                this.warehouse.NumberUnit = Number(this.warehouse.NumberUnit)
                // this.warehouse.CategoryID = Number(this.warehouse.CategoryID)
            } else if (val.num === 4) {
                this.titleSize = '操作记录'
                this.widthRange = '750px'
                this.operationData(val.row.KeyID)
            }
            this.showDialog = true
        },
        close() {
            if (this.num === 1) {
                // 清除入库
                this.$refs['Storage'].clearValidate()
                this.$refs['Storage'].resetFields()
            } else if (this.num === 2) {
                // 清除出库
                this.$refs['delivery'].clearValidate()
                this.$refs['delivery'].resetFields()
                this.delivery.WaysUse = ''
            } else if (this.num === 3 || this.num === undefined) {
                // 清除新增和修改（包括验证）
                this.$refs['warehouse'].clearValidate()
                this.$refs['warehouse'].resetFields()
            }
            this.showDialog = false
        },
        // 提交
        submitData() {
            if (this.num === 1) {
                this.$refs['Storage'].validate((valid) => {
                    if (valid) {
                        const obj = {
                            KeyID: this.KeyID,
                            Number: Number(this.Storage.Number)
                        }
                        InStock(obj).then(data => {
                            if (data.Code === 0) {
                                this.showDialog = false
                                this.$emit('refresh', 'Stock')
                                this.$message({
                                    message: '入库提交成功',
                                    type: 'success'
                                })
                            }
                        })
                    }
                })
            } else if (this.num === 2) {
                this.$refs['delivery'].validate((valid) => {
                     if (valid) {
                         if (this.delivery.Number > this.recordNumber) {
                             this.$message({
                                message: '出库数量不能大于存储数量',
                                type: 'warning'
                            })
                            return
                         }
                        const obj = {
                            KeyID: this.KeyID,
                            Number: Number(this.delivery.Number),
                            WaysUse: this.delivery.WaysUse
                        }
                        OutStock(obj).then(data => {
                            if (data.Code === 0) {
                                this.showDialog = false
                                this.$emit('refresh', 'Stock')
                                this.$message({
                                    message: '出库提交成功',
                                    type: 'success'
                                })
                            }
                        })
                     }
                })
            } else if (this.num === undefined) {
                this.UnitData.forEach(item => {
                    if (this.warehouse.NumberUnit === item.Value) {
                        this.warehouse.Unit = item.Description
                    }
                })
                this.$refs['warehouse'].validate((valid) => {
                    if (valid) {
                        AddStorageRoom(this.warehouse).then(data => {
                            if (data.Code === 0) {
                                this.showDialog = false
                                // 返回给上级 刷新列表
                                this.$emit('refresh', 'Stock')
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                })
                            }
                        })
                    }
                })
            } else if (this.num === 3) {
                 this.UnitData.forEach(item => {
                    if (this.warehouse.NumberUnit === item.Value) {
                        this.warehouse.Unit = item.Description
                    }
                })
                this.$refs['warehouse'].validate((valid) => {
                    if (valid) {
                        var obj = this.warehouse
                        obj.KeyID = this.KeyID
                        EditStorageRoom(obj).then(data => {
                            if (data.Code === 0) {
                                this.showDialog = false
                                this.$emit('refresh', 'Stock')
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                })
                            }
                        })
                    }
                })
            } else if (this.num === 4) {
                this.showDialog = false
            }
        },
        // 单位
        storeUint() {
            this.UnitData = this.$store.getters.enumList.EnumRenovationUnit
        },
        // 操作接口
        operationData(id) {
             ShowStorageOperationalRecords({ KeyID: id }).then(data => {
                if (data.Code === 0) {
                    this.operation = data.Data
                }
            })
        }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
  .operationAll{
      height: 80px;
      border-bottom: 1px dashed black;
    .operation{
        font-size: 14px;
        //   span :nth-child(2),span :nth-child(3){
        //       font-size: 15px;
        //       font-weight: bold;
        //   }
    }
    .operationBottom{
        margin-top: 15px;
        span{
            font-size: 16px;
            font-weight: bold;
        }
    }
  }
  .padT20{
      margin-top: 20px;
  }
    .settlement-box::-webkit-scrollbar {
        display: none;
    }
    .el-form-CanelM .el-form-item__content{
        margin-left: 0;
    }

</style>
