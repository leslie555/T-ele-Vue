<template>
    <div>
        <el-dialog
                title="抄表"
                :visible.sync="showDialogMeter"
                width="1000px"
                :append-to-body="true"
                 v-loading="loading"
                 center
        >
            <el-form :inline="true" label-width="100px" :model="formdata" ref="formdata">
                <div class="dialog-box form-item-sm">
                  <div class="clearfix form-item-sm">
                      <el-form-item
                              label="房源"
                      >
                          <el-select
                                  v-model='formdata.CommunityName'
                                  placeholder='小区'
                                  filterable
                          >
                              <el-option
                                      v-for='(item, index) in areaList'
                                      :key='item.KeyID'
                                      :label='item.CommunityName'
                                      :value='item.CommunityName'
                                      @click.native="GetAfterdata(index, item.KeyID)"
                              >
                              </el-option>
                          </el-select>
                          <el-select
                                  v-model='formdata.Building'
                                  placeholder='栋'

                          >
                              <el-option
                                      v-for='(item, index) in BuildingList'
                                      :key='item.BuildingName'
                                      :label='item.BuildingName'
                                      :value='item.BuildingName'
                                      @click.native="GetBulingList(index)"
                              >
                              </el-option>
                          </el-select>
                          <el-select
                                  v-model='formdata.UnitNumber'
                                  placeholder='单元号'

                          >
                              <el-option
                                      v-for='(item, index) in BuildingUnitList'
                                      :key='index'
                                      :label='item.UnitNumberName'
                                      :value='item.UnitNumberName'
                                      @click.native="GetUnitList(index)"
                              >
                              </el-option>
                          </el-select>
                          <el-select
                                  v-model='formdata.RoomNumber'
                                  placeholder='门牌号'
                          >
                              <el-option
                                      v-for='(item, index) in BuildingDoorNumberList'
                                      :key='index'
                                      :label='item.RoomNumberName'
                                      :value='item.RoomNumberName'
                                      @click.native="GetSearchTableList(index)"
                              >
                              </el-option>
                          </el-select>
                      </el-form-item>
                  </div >
                  <div class="clearfix">
                        <el-form-item label="水表读数" prop="WaterMeter">
                            <el-input
                                    v-model="tableData.WaterMeter"
                                    auto-complete="off"
                                    type="number"
                                    v-positive="tableData.WaterMeter"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="电表读数" prop="ElectricityMeter">
                            <el-input
                                    v-model="tableData.ElectricityMeter"
                                    auto-complete="off"
                                    type="number"
                                    v-positive="tableData.ElectricityMeter"
                            >
                            </el-input>
                        </el-form-item>
                    </div>
                  <div class="clearfix">
                      <el-form-item label="燃气表读数" prop="GasMeter">
                          <el-input
                                  v-model="tableData.GasMeter"
                                  auto-complete="off"
                                  type="number"
                                  v-positive="tableData.GasMeter"
                          >
                          </el-input>
                      </el-form-item>
                      <el-form-item label="冷水表读数" prop="ColdwaterMeter">
                          <el-input
                                  v-model="tableData.ColdwaterMeter"
                                  auto-complete="off"
                                  type="number"
                                  v-positive="tableData.ColdwaterMeter"
                          >
                          </el-input>
                      </el-form-item>
                  </div>
                  <div class="clearfix">
                      <el-form-item label="热水表读数" prop="HotwaterMeter">
                          <el-input
                                  v-model="tableData.HotwaterMeter"
                                  auto-complete="off"
                                  type="number"
                                  v-positive="tableData.HotwaterMeter"
                          >
                          </el-input>
                      </el-form-item>
                  </div>
                </div>
          </el-form>
            <div slot="footer">
                <el-button @click="SubmitCencel">取 消</el-button>
                <el-button :loading="Requireloading" type="primary" @click="SubmitRequire">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
     import { GetAllUnitDatas, GetNewTableDatas } from '@/api/service'

    export default {
        name: 'meter-reading-dialog',
        props: {
            // showDialogMeter: {
            //     type: Boolean,
            //     default: true
            // },
            formdata: {
                type: Object,
                default: {
                    CommunityId: '', // 小区
                    HouseKey: '', // 房源标识
                    CommunityName: '', // 小区名称
                    Building: '', // 栋
                    UnitNumber: '', // 单元号
                    RoomNumber: '' // ,门牌号
                }
            },
            // 小区的数组
            areaList: {
                type: Array
            }
        },
        mounted() {
            console.log(this.formdata)
           // this.GetAllBuildingdata()
        },
        data() {
            return {
                showDialogMeter: false,
                Requireloading: false,
                loading: false,
                formLabelWidth: '90px',
                BuildingList: [], // 栋数
                BuildingUnitList: [], // 单元
                BuildingDoorNumberList: [], // 门牌号
                tableData: {
                  KeyID: Number,
                  WaterMeter: '',
                  ElectricityMeter: '',
                  GasMeter: '',
                  ColdwaterMeter: '',
                  HotwaterMeter: ''
                },
              rules: {
                RoomNumber: [{ required: true, message: '门牌号不能为空', trigger: 'change' }]
              }
            }
        },
        methods: {
            //  当子组件窗口打开时候请求接口
            open() {
              this.Requireloading = false
              this.showDialogMeter = true
              this.loading = true
                return GetAllUnitDatas({
                    communityID: this.areaList[0].KeyID,
                    type: 0
                }).then(response => {
                    if (response) {
                      this.loading = false
                        this.BuildingList = response.Data // 栋数数据
                        this.tableData.KeyID = this.areaList[0].KeyID
                    }
                })
            },
            // 子组件改变小区,获取下面的数据
            GetAfterdata(index, indexKeyID) {
                this.formdata.Building = ''
                this.formdata.UnitNumber = ''
                this.formdata.RoomNumber = ''
                this.formdata.CommunityId = indexKeyID
                this.tableData.WaterMeter = ''
                this.tableData.ElectricityMeter = ''
                this.tableData.GasMeter = ''
                this.tableData.ColdwaterMeter = ''
                this.tableData.HotwaterMeter = ''
                return GetAllUnitDatas({
                    communityID: this.areaList[index].KeyID,
                    type: 0 // 查询抄表历史弹窗
                }).then(response => {
                    if (response) {
                        this.BuildingList = response.Data // 栋数数据
                    }
                })
            },
            // 改变栋数获取单元号
            GetBulingList(index) {
                var tempBuild = []
                this.formdata.UnitNumber = ''
                this.formdata.RoomNumber = ''
                tempBuild = this.BuildingList[index]
                this.BuildingUnitList = tempBuild.UnitNumber
            },
            // 改变单元号获取门牌号
            GetUnitList(index) {
                console.log(index)
                var tempUnit = []
                this.formdata.RoomNumber = '' // 门牌号
                tempUnit = this.BuildingUnitList[index]
                this.BuildingDoorNumberList = tempUnit.RoomNumber
                // this.formdata.HouseKey = tempUnit.RoomNumber[index].HouseKey // 房源标识
                this.formdata.KeyID = this.areaList[index].KeyID // KeyID唯一标识
            },
            // 根据门牌号获取HouseKey
          GetSearchTableList(index) {
            this.formdata.HouseKey = this.BuildingDoorNumberList[index].HouseKey
          },
            SubmitCencel() {
                this.CloseDialog()
            },
            SubmitRequire() {
              debugger
              this.Requireloading = true
               if (this.formdata.RoomNumber === '') {
                   this.$message.error('门牌号不能为空!')
                   return false
               } else {
                 return GetNewTableDatas({
                   utilityInfo: {
                     CommunityId: this.formdata.CommunityId, // 小区
                     HouseKey: this.formdata.HouseKey, // 房源标识
                     CommunityName: this.formdata.CommunityName, // 小区名称
                     Building: this.formdata.Building, // 栋
                     UnitNumber: this.formdata.UnitNumber, // 单元号
                     RoomNumber: this.formdata.RoomNumber, // ,门牌号
                     WaterMeter: this.tableData.WaterMeter,
                     ElectricityMeter: this.tableData.ElectricityMeter,
                     GasMeter: this.tableData.GasMeter,
                     ColdwaterMeter: this.tableData.ColdwaterMeter,
                     HotwaterMeter: this.tableData.HotwaterMeter
                   }
                 }).then(({ Data, Msg, Code }) => {
                      console.log(this.Requireloading)
                      this.$emit('UpdateMeterData', this.tableData)
                     // this.$refs['tableData'].resetFields()
                     this.CloseDialog()
                     this.$message({
                       type: 'success',
                       message: '抄表成功!'
                     })
                 }).catch(() => {
                   this.Requireloading = false
                 })
               }
            },
            CloseDialog() {
                 this.showDialogMeter = false
                this.$emit('CloseMeterDialog')
            }
        }
    }
</script>

<style scoped>

</style>
