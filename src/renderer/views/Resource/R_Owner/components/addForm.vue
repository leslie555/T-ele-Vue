<template>
  <el-dialog
    :visible="EditVisible"
    @close="close"
    :title="type === 1 ? '新增' : '修改'"
    :center="true"
    width="840px"
    append-to-body
  >
    <el-form
      :model="EditFormData"
      label-position="right"
      label-width="100px"
      :inline="true"
      :rules="rules"
      style="height: 500px; overflow: auto;"
      ref="FinancialSubjectEditForm"
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix" style="marginBottom: 10px">
          <h3 style="color: #999999">业主信息</h3>
        </div>
        <div class="clearfix">
          <el-form-item label="业主姓名" prop="OwnerName">
            <el-input style="width: 250px;" v-model="EditFormData.OwnerName" :maxlength="8"></el-input>
          </el-form-item>
          <el-form-item label="业主电话" prop="OwnerTel">
            <el-input style="width: 250px;" v-model="EditFormData.OwnerTel" :maxlength="16"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="期望租金" prop="ExpectedRent">
            <el-input
              style="width: 250px;"
              v-model="EditFormData.ExpectedRent"
              :maxlength="16"
              type="number"
              @blur="$positive(EditFormData,'ExpectedRent',0,false,1000000)"
            ></el-input>
          </el-form-item>
        </div>
        <div class="clearfix" style="margin: 0 0 10px">
          <h3 style="color: #999999">房源信息</h3>
        </div>
        <div class="clearfix form-item-sm">
          <el-form-item label="小区名称" prop="CommunityName">
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="EditFormData.CommunityName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入小区名称搜索"

              :maxlength="40"
              @select="handleCommunitySelect"
              >
              <i class="el-icon-search el-input__icon" slot="suffix"></i>
              <template slot-scope="{ item }">
                <div class="name">{{ item.CommunityName }}</div>
                <span class="addr">{{ item.Location }}</span>
              </template>
            </el-autocomplete>              
          </el-form-item>
          <el-form-item label="所属区域" prop="RegionList">
            <el-cascader
              :options="CityData"
              v-model="EditFormData.RegionList"
              size="middle"
              expand-trigger="hover"
              separator
              filterable
              style="width: 260px;"
              :disabled="EditFormData.CommunityName== CommunityInfo.CommunityNameMark"
            ></el-cascader>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="详细地址" prop="DetailedAddress">
            <el-input v-model="EditFormData.DetailedAddress"
                      placeholder="请输入详细地址"
                      maxlength="50"
                      :disabled="EditFormData.CommunityName==CommunityInfo.CommunityNameMark"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="栋" prop="Tung">
            <el-input style="width: 250px;" v-model="EditFormData.Tung" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="单元" prop="Unit">
            <el-input style="width: 250px;" v-model="EditFormData.Unit" :maxlength="16"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="门牌" prop="NumberPlate">
            <el-input style="width: 250px;" v-model="EditFormData.NumberPlate" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="面积">
            <el-input
              style="width: 250px;"
              v-model="EditFormData.Area"
              :maxlength="16"
              type="number"
              @blur="$positive(EditFormData,'Area',0,false,1000000)"
            ></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="室">
            <el-input
              style="width: 100px;"
              v-model="EditFormData.RoomCount"
              :maxlength="4"
              type="number"
              @blur="$positive(EditFormData,'RoomCount',0,false,1000000)"
            ></el-input>
          </el-form-item>
          <el-form-item label="厅">
            <el-input
              style="width: 100px;"
              v-model="EditFormData.HallCount"
              :maxlength="4"
              type="number"
              @blur="$positive(EditFormData,'HallCount',0,false,1000000)"
            ></el-input>
          </el-form-item>
          <el-form-item label="卫">
            <el-input
              style="width: 100px;"
              v-model="EditFormData.ToiletCount"
              :maxlength="4"
              type="number"
              @blur="$positive(EditFormData,'ToiletCount',0,false,1000000)"
            ></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="房源照片">
            <upload-file :imgList="EditFormData.HousePictureList"></upload-file>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="备注
          ">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入备注"
              maxlength="400"
              v-model="EditFormData.Remarks"
              style="width: 540px;"
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="btnLoading">确 定</el-button>
      <el-button type="primary" @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { EditOwnerHouseInfo, AddOwnerHouseInfo } from '@/api/resource'
import { UploadFile } from '@/components/UploadFile'
import { validatePhone } from '@/utils/validate/rulevalidator'
import { CityData, getCodeArrByCode } from '@/utils/CityData'
import { searchCommunityList } from '@/api/owner'

export default ({
  name: 'add-form',
  components: {
    UploadFile
  },
  data() {
    return {
      type: 1,
      CityData,
      EditVisible: false,
      oldCommunitySearchKey: '',
      oldCommunityList: [],
      CommunityInfo: {

      },
      EditFormData: {
        OwnerName: '',
        OwnerTel: '',
        ExpectedRent: '',
        CommunityName: '',
        RegionList: [],
        Region: '',
        DetailedAddress: '',
        Tung: '',
        Unit: '',
        NumberPlate: '',
        Area: '',
        RoomCount: '',
        ToiletCount: '',
        HallCount: '',
        Remarks: '',
        HousePictureList: []
      },
      // 表单验证
      rules: {
        OwnerName: [
          { required: true, message: '请输入业主姓名', trigger: 'blur' }
        ],
        OwnerTel: [
          { required: true, message: '请输入业主电话', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        ExpectedRent: [
          { required: true, message: '请输入期望租金（数字）', trigger: 'blur' }
        ],
        CommunityName: [
          { required: true, message: '请输入小区名称', trigger: 'blur' }
        ],
        RegionList: [
          { required: true, message: '请选择所属区域', trigger: 'blur' }
        ],
        DetailedAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        Tung: [
          { required: true, message: '请输入栋号', trigger: 'blur' }
        ],
        Unit: [
          { required: false, message: '请输入单元号', trigger: 'blur' }
        ],
        NumberPlate: [
          { required: true, message: '请输入门牌号', trigger: 'blur' }
        ]
      },
      btnLoading: false
    }
  },
  methods: {
    open(type, form) {
      this.type = type
      this.btnLoading = false
      this.EditVisible = true
      if (form) {
        this.EditFormData = this.$deepCopy(form)
        this.EditFormData.RegionList = getCodeArrByCode(this.EditFormData.Region)
        if (!this.EditFormData.HousePictureList) {
          this.EditFormData.HousePictureList = []
        }
      }
    },
    close() {
      // this.$refs['FinancialSubjectEditForm'].resetFields()
      this.EditVisible = false
      this.EditFormData.OwnerTel = ''
      this.EditFormData.ExpectedRent = ''
      this.EditFormData.CommunityName = ''
      this.EditFormData.RegionList = []
      this.EditFormData.Region = ''
      this.EditFormData.DetailedAddress = ''
      this.EditFormData.Tung = ''
      this.EditFormData.Unit = ''
      this.EditFormData.NumberPlate = ''
      this.EditFormData.OwnerName = ''
      this.EditFormData.Area = ''
      this.EditFormData.Region = ''
      this.EditFormData.RoomCount = ''
      this.EditFormData.ToiletCount = ''
      this.EditFormData.HallCount = ''
      this.EditFormData.Remarks = ''
      this.EditFormData.HousePictureList = []
      this.$refs.FinancialSubjectEditForm.clearValidate()
    },
    submitForm() {
      const self = this
      this.$refs['FinancialSubjectEditForm'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.type === 1) {
            this.EditFormData.Region = this.EditFormData.RegionList.length > 0 ? this.EditFormData.RegionList[this.EditFormData.RegionList.length - 1] : ''
            AddOwnerHouseInfo(this.EditFormData).then(response => {
              if (response.Code === 0) {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                })
                this.$emit('AddNewData', response.Data)
                this.btnLoading = false
                self.close()
              }
            }).catch(() => {
              this.btnLoading = false
            })
          } else {
            // 修改接口
            this.EditFormData.Region = this.EditFormData.RegionList.length > 0 ? this.EditFormData.RegionList[this.EditFormData.RegionList.length - 1] : ''
            EditOwnerHouseInfo(this.EditFormData).then(response => {
              if (response.Code === 0) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.$emit('EditNewData', this.EditFormData)
                this.btnLoading = false
                self.close()
              }
            }).catch(() => {
              this.btnLoading = false
            })
          }
        }
      })
    },
    querySearchAsync(queryString, cb) {
      if (this.oldCommunitySearchKey === queryString) {
        cb(this.oldCommunityList)
        return
      }
      this.oldCommunitySearchKey = queryString
      if (queryString) {
        searchCommunityList({
          CommunityName: queryString,
          parm: { page: 1, size: 20 }
        }).then(({ Data }) => {
          this.oldCommunityList = Data.rows || []
          cb(Data.rows || [])
        })
      } else {
        this.oldCommunityList = []
        cb([])
      }
    },
    handleCommunitySelect(item) {
      // console.log('item :', item)
      this.EditFormData.CommunityName = item.CommunityName
      this.EditFormData.RegionList = getCodeArrByCode(item.CityCode)
      this.EditFormData.DetailedAddress = item.Location
      // console.log('地区 :', getCodeArrByCode(item.CityCode))
      this.CommunityInfo.CommunityNameMark = item.CommunityName
      this.$refs.FinancialSubjectEditForm.clearValidate()
    }
  }
})
</script>
