<template>
      <div class="app-container">
          <div class="panel" v-loading="detailLoading">
              <div class="leftWidth">
                <div class="TopTittle">
                    <span></span>
                    <span>申请详情</span>
                </div>
                <div class="TopConList">
                        <div class="conList">
                            <div class="detail-conList">
                                <p>房源名称：</p>
                                <p>{{ detailsList.HouseName }}</p>
                            </div>
                            <div class="detail-conList">
                                <p>钥匙位置：</p>
                                <p>{{ detailsList.KeyLocation }}</p>
                            </div>
                            <div class="detail-conList">
                                <p>地址：</p>
                                <p>{{ detailsList.Location }}</p>
                            </div>
                        </div>
                        <div class="conList">
                            <div class="detail-conList">
                                <p>产权面积：</p>
                                <p>{{ detailsList.RoomArea === 0 ? '' : detailsList.RoomArea + 'm²' }}</p>
                            </div>
                            <div class="detail-conList">
                                <p>业务员：</p>
                                <p>{{ detailsList.Salesman }}</p>
                            </div>
                            <div class="detail-conList">
                                <p>部门：</p>
                                <p>{{ detailsList.CompanyName }}</p>
                            </div>
                        </div>
                            <div class="conList">
                            <div class="detail-conList">
                                <p>提交时间：</p>
                                <p>{{ $dateFormat(detailsList.CreaterTime) }}</p>
                            </div>
                            <div class="detail-conList">
                                <p>状态：</p>
                                <p>{{ getFullStatus(detailsList.Status) }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="purchaseOrfitment === 0 && detailsList.Status !== 6" style="margin-top:15px;">
                        <span class="fitmentItem">装修项目</span>
                        <el-button size="small" plain type="primary" @click="addItem">添加项目</el-button>
                    </div>
                    <el-table
                        :data="tableData"
                        border
                        fit
                        class="table-normal"
                        style="width: 100%;margin-top:30px;">
                        <el-table-column
                        v-if="purchaseOrfitment === 1"
                        prop="CategoryName"
                        label="类别"
                        min-width="300">
                            <template slot-scope="scope">
                                <span>{{scope.row.CategoryName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        label="项目名称"
                        prop="ProjectName"
                        min-width="150">
                            <template slot-scope="scope">
                                <div v-if="scope.row.ids">{{ scope.row.ProjectName }}</div>
                                <el-cascader
                                    v-else 
                                    v-model="scope.row.arrId"
                                    :options="projectData"
                                    :props="{ expandTrigger: 'hover' }"
                                    @change="projectChange(...arguments, scope.$index, scope.row)">
                                </el-cascader>
                            </template>
                        </el-table-column>
                        <el-table-column
                        v-if="purchaseOrfitment === 0"
                        prop="InsidePrice"
                        label="内部单价"
                        min-width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.InsidePrice}}元/{{scope.row.Unit}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        v-if="purchaseOrfitment === 0"
                        prop="ExternalPrice"
                        label="外部单价"
                        min-width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.ExternalPrice}}元/{{scope.row.Unit}}</span>
                            </template>
                        </el-table-column>
                         <el-table-column
                         v-if="purchaseOrfitment === 1"
                        prop="ExternalPrice"
                        label="单价"
                        min-width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.ExternalPrice}}元/{{scope.row.Unit}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="Number"
                        label="数量"
                        min-width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.ids">{{scope.row.Number}}</span>
                                <el-input type="number" @input="getCurrentRow(scope.row.Number, scope.$index, scope.row)"  v-else size="small" v-model="scope.row.Number"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                        v-if="purchaseOrfitment === 0"
                        prop="InsidePriceTotalAmount"
                        label="内部总金额"
                        min-width="300">
                            <template slot-scope="scope">
                                <span>{{scope.row.InsidePriceTotalAmount}}元</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        v-if="purchaseOrfitment === 0"
                        prop="ExternalPriceTotalAmount"
                        label="外部总金额"
                        width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.ExternalPriceTotalAmount}}元</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        v-if="purchaseOrfitment === 1"
                        prop="ExternalPriceTotalAmount"
                        label="总金额"
                        width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.ExternalPriceTotalAmount}}元</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        v-if="purchaseOrfitment === 0 && detailsList.Status !== 6"
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
                    <el-form label-width="80px"  :inline="false" ref="FormImg" style="margin-top:20px;overflow:hidden;">
                            <el-form-item label="装修图片:">
                            <div class="upload-img-Box">
                                <div
                                class="upload-img"
                                v-for="(item, index) in imageList"
                                :key="index"
                                >
                                <img
                                    :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)"
                                    @click="$seeImage($ImgUnit.getImgUrl(item.ImageLocation))"
                                >
                                </div>
                            </div>
                            </el-form-item>
                            <el-form-item label="装修备注:">
                            <el-input type="textarea" :disabled='textboolean' v-model="detailsList.BZ"></el-input>
                            </el-form-item>
                    </el-form>
                    <div class="TopTittle">
                        <span></span>
                        <span>进度跟踪</span>
                    </div>
                    <div class="verticalStep">
                        <!-- <el-steps direction="vertical" space='20' :active='detailsStepList.length' >
                            <el-step v-for="item in detailsStepList" :title="item.Content" :description="item.CreaterTime"></el-step>
                        </el-steps> -->
                        <div  class="stepList" v-for="(item, key) in detailsStepList" :key = key>
                            <div class="fl"></div>
                            <div class="fl">
                                <p style="font-size: 15px;">{{ item.Category }}</p>
                                <p style="font-size: 14px;color:gray;">
                                    <el-input
                                    disabled="true"
                                    type="textarea"
                                    class="textareaBoder"
                                    :autosize="{ minRows: 0, maxRows: 10}"
                                    v-model="item.Content">
                                    </el-input>
                                </p>
                                <p style="font-size: 12px;color:gray;">{{ $dateFormat(item.CreaterTime,'yyyy-MM-dd hh:mm:ss') }}</p>
                            </div>
                        </div>
                    </div>
              </div>
          </div>
      </div>
</template>

<script>
  import { ShowRenovationProject, ShowAllRenovationApply, ShowRenovationRecordDetails, AddProjectYWY, DeleteProjectYWY, UpdateProjectYWY } from '@/api/purchase'
  import { findNodeByArr } from '@/utils/arrUtil/treeArr'
  export default {
    name: 'detail-FixPurchaseDepartment',
    data() {
      return {
          detailLoading: false,
          // 文本框判断
          textboolean: true,
          // 保存返回来的数据，取消时候调用
          savaTableList: [],
          // 判断路由是从采购还是装修进来
          purchaseOrfitment: null,
          // 二级联动数据展示
          projectData: [],
          // 申请详情字段显示
          detailsList: {},
          // 步骤条数据显示
          detailsStepList: [],
          // tabel列表数据显示
          tableData: [],
          // 图片显示
          imageList: [],
          KeyID: null
      }
    },
    methods: {
        // 修改按钮
        handleClick(row, index) {
             // 2中方法 改变对象数据 vue响应式
             // 方法一
            const tableData = [...this.tableData]
            tableData[index].ids = !this.tableData[index].ids
            this.tableData = tableData
            // 方法二
            // this.tableData[index].ids = !this.tableData[index].ids
            //  const tableData = this.$deepCopy(this.tableData[index])
            //  this.tableData.splice(index, 1, tableData)
        },
        // 保存按钮
        SaveClick(row, index) {
            console.log(row)
            if (row.ProjectName === '') {
                this.$message.error('请填写项目名称')
                return
            }
            if (row.Number === '' || row.Number === '0' || row.Number === 0) {
                this.$message.error('请填写数量')
                return
            }
            // 有row.KeyID为修改，无为新增
            if (row.KeyID || row.KeyID === 0) {
               this.$confirm('确定修改这条数据？, 是否继续？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
               }).then(() => {
                  UpdateProjectYWY(row).then(({ Data, BusCode, Msg }) => {
                      this.tableData[index].ids = !this.tableData[index].ids
                      const tableData = this.$deepCopy(this.tableData[index])
                      this.tableData.splice(index, 1, tableData)
                      // 初始拷贝数据与列表数据同步
                      this.savaTableList[index] = this.$deepCopy(this.tableData[index])
                    }).catch(() => {
                    })
                })
            } else {
              this.$confirm('确定保存这条数据？, 是否继续？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  console.log(row)
                  AddProjectYWY(row).then(({ Data, BusCode, Msg }) => {
                      // 新增成功 ids变为true 后台返回KeyID赋予这行数据
                      this.tableData[index].ids = !this.tableData[index].ids
                      this.tableData[index].KeyID = Data.KeyID
                      const tableData = this.$deepCopy(this.tableData[index])
                      this.tableData.splice(index, 1, tableData)
                      this.savaTableList[index] = this.$deepCopy(this.tableData[index])
                    }).catch(() => {
                    })
                })
              }
        },
        // 取消按钮  进入接口保存一份数据 取消的时候深度拷贝（保存的数据）给列表还原数据
        CancelClick(row, index) {
            // 2种方法vue 响应式数据
            // 方法一
            // this.tableData.splice(index, 1, this.$deepCopy(this.savaTableList[index]))
            // 方法二
            this.$set(this.tableData, index, this.$deepCopy(this.savaTableList[index]))
        },
        // 删除列表按钮
        DeleteClick(row, index) {
            // 通过row.KeyID来判断是新增的删除  还是列表存在的删除
          if (row.KeyID || row.KeyID === 0) {
              this.$confirm('确定删除这条数据？, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                DeleteProjectYWY({
                    KeyID: row.KeyID
                }).then(({ Data, BusCode, Msg }) => {
                    this.$message.success('删除成功!')
                    // 删除成功 列表删除 和初始化深度拷贝的数据也要同步
                    this.tableData.splice(index, 1)
                    this.savaTableList.splice(index, 1)
                }).catch(() => {
                    this.$message.error('删除失败!')
                })
            })
          } else {
            this.tableData.splice(index, 1)
          }
        },
        // 新增按钮
        addItem() {
            const additem = {
                ProjectName: '',
                InsidePrice: '',
                ExternalPrice: '',
                Number: '',
                InsidePriceTotalAmount: '',
                ExternalPriceTotalAmount: '',
                Unit: '',
                ids: false
            }
            this.tableData.push(additem)
        },
        // 监听数量变化 然后计算出内部总金额和外部总金额
        getCurrentRow(val, index, row, num) {
            // num为1 表示下拉框选择过后再次计算  否则表示输入数量后改变计算
            if (num === 1) {
                this.tableData[index].InsidePriceTotalAmount = row.Number * Number(row.InsidePrice)
                this.tableData[index].ExternalPriceTotalAmount = row.Number * Number(row.ExternalPrice)
            } else {
                this.tableData[index].InsidePriceTotalAmount = val * Number(row.InsidePrice)
                this.tableData[index].ExternalPriceTotalAmount = val * Number(row.ExternalPrice)
            }
        },
        SelectApi() {
          this.initData()
        },
        // 调用详情的接口
        getDetailData(KeyID) {
          ShowRenovationRecordDetails({
              KeyID: KeyID
          }).then(({ Data, BusCode, Msg }) => {
              this.detailsStepList = Data.RenovationTrack
              this.detailsList = Data.ApplyRecord[0]
              this.imageList = Data.imageList
              this.tableData = Data.DecorationDetails
              // ids true 为不能修改 false 可修改 arrId二级联动选中
              this.tableData.forEach(val => {
                val.ids = true
                val.arrId = [val.RenovationApplyCategoryID, val.RenovationApplyConfigueID]
              })
              // 深度拷贝列表数据 this.tableData改变savaTableList也要改变
              this.savaTableList = this.$deepCopy(this.tableData)
          })
        },
        // 下拉框接口  调用了2次接口 合并成一个2级联动
        async initData() {
          const [type, project] = await Promise.all([ShowAllRenovationApply(), ShowRenovationProject()])
          const filterProject = project.Data.map(v => ({
            label: v.ProjectName,
            value: v.KeyID,
            CategoryID: v.CategoryID,
            Unit: v.Unit || '',
            Model: v.Model || '',
            InsidePrice: v.InsidePrice,
            ExternalPrice: v.ExternalPrice
          }))
          this.projectData = type.Data.map(v => ({
            label: v.CategoryName,
            value: v.KeyID,
            children: filterProject.filter(val => val.CategoryID === v.KeyID)
          }))
        },
        // tabel 判断状态
        getFullStatus(Status) {
          return Status === 0 ? '全部' : Status === 1 ? '暂存' : Status === 2 ? '待审批' : Status === 3 ? '待勘察' : Status === 4 ? '已勘察' : Status === 5 ? '装修中' : '装修结束'
        },
        // 二级联动选中 赋值给内部单价和外部单价
        projectChange(data, index, row) {
          const item = findNodeByArr(this.projectData, data)
          this.tableData[index].ExternalPrice = item.ExternalPrice
          this.tableData[index].InsidePrice = item.InsidePrice
          this.tableData[index].RenovationApplyCategoryID = data[0]
          this.tableData[index].ProjectName = item.label
          // 单位
          this.tableData[index].Unit = item.Unit
          this.tableData[index].RenovationApplyRecordID = this.KeyID
          this.tableData[index].RenovationApplyConfigueID = data[1]
          // 修改再次计算总金额
          this.getCurrentRow(item, index, row, 1)
        }
    },
    created() {
      // 为1 装修经理进来 为0 采购部进来
      this.purchaseOrfitment = Number(this.$route.query.purchaseOrfitment)
      // 下拉框的Api
      this.SelectApi()
      // 获取详情接口
      this.getDetailData(this.$route.query.KeyID)
      // 获取详情KeyID
      this.KeyID = this.$route.query.KeyID
    },
    mounted() {
        // var getDom = document.getElementById('textarea')
        // console.log(getDom)
    },
      // 判断那个页面进入的详情
    beforeRouteEnter(to, from, next) {
      if (to.query.purchaseOrfitment === 0) {
        to.meta.title = '采购部详情'
      } else if (to.query.purchaseOrfitment === 1) {
        to.meta.title = '装修详情'
      } else {
        to.meta.title = '装修详情 '
      }
      next()
    }
  }
</script>
<style lang="scss">
    .textareaBoder .el-textarea__inner{
        border: none;
        resize: none;
        background-color: white !important;
        color: gray !important;
    }
    .textareaBoder .el-textarea__inner:hover{
        cursor: default;
    }
</style>
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
  .verticalStep{
      color: #389ef2;
      overflow: hidden;
      .stepList{
          overflow: hidden;
          margin-top: 20px;
        .fl{
            float: left;
        }
        .fl:nth-child(1){
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #389ef2;
            margin-top: 5px;
            margin-right: 20px;
        }
        .fl:nth-child(2){
            p{
                margin-bottom: 0;
            }
            p:nth-child(2){
                margin: 10px 0
            }
        }
      }
  }
  .upload-img-Box{
      overflow: hidden;
  }
  .upload-img{
    float: left;
    margin-right: 10px;
  }
  .comments {
    width:100%;/*自动适应父布局宽度*/
    overflow:auto;
    word-break:break-all;
  }
</style>
