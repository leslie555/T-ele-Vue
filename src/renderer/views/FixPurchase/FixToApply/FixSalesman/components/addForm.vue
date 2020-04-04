<template>
  <el-dialog
    :visible="EditVisible"
    @close="close"
    :title="type === 1 ? '新增' : '修改'"
    :center="true"
    width="900px"
    append-to-body
  >
    <el-form
      :model="EditFormData"
      label-position="right"
      label-width="130px"
      :inline="true"
      :rules="rules"
      style="height: 500px; overflow: auto;"
      ref="addFixSalesmanForm"
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item label="房源名称" prop="HouseName">
            <search-house
              :type="3"
              key-word="HouseKey"
              v-model="EditFormData.HouseName"
              @select="selectedHouse"
            ></search-house>
          </el-form-item>
          <el-form-item label="钥匙位置" prop="KeyLocation">
            <el-input
              style="width: 250px;"
              v-model="EditFormData.KeyLocation"
              :maxlength="16"
              placeholder="请填写"
            ></el-input>
          </el-form-item>
        </div>
        <!-- <div class="clearfix">
          <el-form-item label="是否可继续出租" prop="whetherRentOut">
            <el-select v-model="EditFormData.whetherRentOut" placeholder="请选择">
              <el-option
                v-for="item in procureList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div> -->
        <div class="clearfix fix-to-apply-project-input">
          <el-form-item label="装修项目">
            <el-button @click="addProject" size="small" plain type="primary">添加项目</el-button>
          </el-form-item>
          <el-form-item
            v-for="(project, index) in EditFormData.ZXJSON"
            :label="'项目' + (index+1)"
            :key="project.RenovationApplyCategoryID"
            :rules="{required: true, message: '项目不能为空', trigger: 'change'}"
            :prop="'ZXJSON.' + index + '.RenovationApplyCategoryID'"
          >
            <el-cascader
              expand-trigger="hover"
              :show-all-levels="false"
              @change="projectChange(...arguments, index)"
              placeholder="请选择项目"
              :options="projectData"
              v-model="project.ProjectIDs"
            ></el-cascader>
            <el-input placeholder="单价" disabled v-model="project.ExternalPrice"></el-input>
            <span class="unit">{{project.Unit?`元/${project.Unit}`:''}}</span>
            <el-input-number
              v-model="project.Number"
              size="small"
              :min="0.01"
              label="数量"
              @change="handleNumberChange(index)"
            ></el-input-number>
            <el-input placeholder="总金额" disabled v-model="project.ExternalPriceTotalAmount"></el-input>
            <span class="unit">元</span>
            <el-button
              v-show="EditFormData.ZXJSON.length>1"
              size="mini"
              type="danger"
              @click.prevent="removeProject(project)"
            >删除</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="图片">
            <upload-file :imgList="EditFormData.ImageID"></upload-file>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请填写备注"
              maxlength="400"
              v-model="EditFormData.BZ"
              style="width: 540px;"
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button @click="submitForm(1)" :loading="btnLoading">暂 存</el-button>
      <el-button type="primary" @click="submitForm(2)" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { UploadFile } from '@/components/UploadFile'
  import SearchHouse from '@/components/SearchHouse'
  import { AddRenovationApplyRecord, ShowAllRenovationApply, ShowRenovationProject, UpdateRenovationApplyRecord } from '@/api/purchase'
  import { findNodeByArr } from '@/utils/arrUtil/treeArr'

  export default ({
    name: 'fixSalesManAdd',
    components: {
      UploadFile,
      SearchHouse
    },
    data() {
      return {
        type: 1,
        EditVisible: false,
        EditFormData: {
          HouseName: '',
          HouseID: '',
          HouseKey: '',
          HouseArea: '',
          Location: '',
          KeyLocation: '',
          whetherRentOut: 0,
          ZXJSON: [{
            RenovationApplyCategoryID: '',
            ProjectIDs: [],
            ExternalPrice: '',
            Number: 1,
            ExternalPriceTotalAmount: ''
          }],
          ImageID: [],
          BZ: '',
          Status: 1
        },
        rules: {
          HouseName: [
            { required: true, message: '请选择房源', trigger: 'blur' }
          ],
           whetherRentOut: [
             { required: true, message: '请选择是否可继续出租', trigger: 'blur' }
           ]
        },
        btnLoading: false,
        projectData: [],
        oldImage: [],
        procureList: [
          { value: 0, label: '是' },
          { value: 1, label: '否' }
        ]
      }
    },
    created() {
      this.initData()
    },
    methods: {
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
        this.projectData = []
        type.Data.forEach(v => {
          const children = filterProject.filter(val => val.CategoryID === v.KeyID)
          if (children.length > 0) {
            this.projectData.push({
              label: v.CategoryName,
              value: v.KeyID,
              children
            })
          }
        })
      },
      open(type, form) { // type: 1新增 2修改
        this.type = type
        if (form) {
          const EditFormData = this.$deepCopy(form)
          EditFormData.ZXJSON = EditFormData.ywyList
          EditFormData.ZXJSON.forEach(v => {
            v.ProjectIDs = [v.RenovationApplyCategoryID, v.RenovationApplyConfigueID]
          })
          EditFormData.ImageID = EditFormData.imageList || []
          this.oldImage = this.$deepCopy(form.imageList) || []
          this.EditFormData = EditFormData
        }
        this.btnLoading = false
        this.EditVisible = true
        this.$nextTick(() => {
          this.$refs.addFixSalesmanForm.clearValidate()
        })
      },
      close() {
        this.EditFormData = {
          HouseName: '',
          HouseID: '',
          HouseKey: '',
          HouseArea: '',
          Location: '',
          KeyLocation: '',
          ZXJSON: [{
            RenovationApplyCategoryID: '',
            ProjectIDs: [],
            ExternalPrice: '',
            Number: 1,
            ExternalPriceTotalAmount: ''
          }],
          ImageID: [],
          BZ: '',
          Status: 1
        }
        this.EditVisible = false
      },
      submitForm(status) { // 暂存1 提交2
        const form = this.$deepCopy(this.EditFormData)
        form.Status = status
        this.EditFormData.ZXJSON.forEach(v => {
          v.ExternalPriceTotalAmount = +v.ExternalPriceTotalAmount
        })
        form.ZXJSON = JSON.stringify(this.EditFormData.ZXJSON)
        form.ImageLocation = this.$DiffArrFn(this.oldImage, this.EditFormData.ImageID, [
          'ImageLocation'
        ])
        // form.ImageLocation = this.EditFormData.ImageID
        form.ImageID = this.EditFormData.ImageID.map(v => v.KeyID).join(',')
        this.$refs['addFixSalesmanForm'].validate(valid => {
          if (valid) {
            this.btnLoading = true
            if (this.type === 1) {
              AddRenovationApplyRecord(form).then(response => {
                if (response.Code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  })
                  const data = response.Data.ApplyRecord[0]
                  data.ywyList = response.Data.DecorationDetails
                  data.imageList = response.Data.imageList
                  this.$emit('AddNewData', data, status)
                  this.btnLoading = false
                  this.close()
                }
              }).catch(() => {
                this.btnLoading = false
              })
            } else {
              // 修改接口
              form.RecordID = form.KeyID
              UpdateRenovationApplyRecord(form).then(response => {
                if (response.Code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  const data = response.Data.ApplyRecord[0]
                  data.ywyList = response.Data.DecorationDetails
                  data.imageList = response.Data.imageList
                  this.$emit('EditNewData', data, status)
                  this.btnLoading = false
                  this.close()
                }
              }).catch(() => {
                this.btnLoading = false
              })
            }
          }
        })
      },
      removeProject(item) {
        const index = this.EditFormData.ZXJSON.indexOf(item)
        if (index !== -1) {
          this.EditFormData.ZXJSON.splice(index, 1)
        }
      },
      addProject() {
        this.EditFormData.ZXJSON.push({
          ProjectIDs: [],
          ExternalPrice: '',
          Number: 1,
          ExternalPriceTotalAmount: ''
        })
      },
      selectedHouse(data) {
        this.EditFormData.HouseName = data.HouseName
        this.EditFormData.HouseID = data.KeyID
        this.EditFormData.HouseKey = data.HouseKey
        this.EditFormData.HouseArea = data.HouseArea
        this.EditFormData.Location = data.Location
      },
      projectChange(data, idx) {
        const item = findNodeByArr(this.projectData, data)
        const EditFormData = { ...this.EditFormData }
        EditFormData.ZXJSON[idx].RenovationApplyConfigueID = item.value
        EditFormData.ZXJSON[idx].RenovationApplyCategoryID = item.CategoryID
        EditFormData.ZXJSON[idx].Unit = item.Unit
        EditFormData.ZXJSON[idx].ProjectName = item.label
        EditFormData.ZXJSON[idx].InsidePrice = item.InsidePrice
        EditFormData.ZXJSON[idx].InsidePriceTotalAmount = item.InsidePrice * EditFormData.ZXJSON[idx].Number
        EditFormData.ZXJSON[idx].ExternalPrice = item.ExternalPrice
        EditFormData.ZXJSON[idx].ExternalPriceTotalAmount = item.ExternalPrice * EditFormData.ZXJSON[idx].Number
        this.EditFormData = EditFormData
      },
      handleNumberChange(idx) {
        const item = this.EditFormData.ZXJSON[idx]
        if (item.ExternalPrice) {
          item.ExternalPriceTotalAmount = this.$priceFormat(item.ExternalPrice * item.Number)
          item.InsidePriceTotalAmount = item.InsidePrice * item.Number
        }
        this.$set(this.EditFormData.ZXJSON, idx, item)
      }
    }
  })
</script>

<style lang="scss">
  .fix-to-apply-project-input .el-input,
  .fix-to-apply-project-input .el-cascader {
    width: 120px;
    &:not(:first-child) {
      margin-left: 20px;
    }

    input {
      text-align: center;
    }
  }
  .fix-to-apply-project-input .el-input-number__decrease {
    left: 21px;
  }
  .fix-to-apply-project-input .el-input-number__increase {
    right: -9px;
  }
</style>
<style lang="scss" scoped>
  .unit {
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
