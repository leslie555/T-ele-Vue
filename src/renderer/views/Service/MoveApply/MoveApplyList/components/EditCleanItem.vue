<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="title"
    width="940px"
    append-to-body
    center
    class="has-scroll"
  >
    <div class="settlement-box">
      <el-form
        :inline="true"
        label-width="110px"
        style="height: 500px"
        :model="form"
        ref="EditMoveingItem"
        :rules="rules"
      >
        <el-scrollbar class="vertical-scroll">
          <div class="dialog-box form-item-sm" style="padding-top: 30px">
            <div class="clearfix form-item-md">
              <el-form-item label="房源名称" prop="HouseName">
                <search-house
                  v-model="form.HouseName"
                  :type="4"
                  keyWord="HouseKey"
                  @select="handleHouseSelect"
                ></search-house>
              </el-form-item>
            </div>
            <div class="clearfix form-item-sm">
              <el-form-item label="租客姓名">
                <el-input v-model="form.TenantName" placeholder="请输入租客姓名" maxlength="10"></el-input>
              </el-form-item>
            </div>
            <div class="clearfix form-item-sm">
              <el-form-item label="租客电话">
                <el-input v-model="form.TenantTel" type="number" placeholder="请输入租客电话" oninput="if(value.length > 11) value = value.slice(0,11)"></el-input>
              </el-form-item>
            </div>
            <div class="clearfix form-item-lg">
              <el-form-item :label="busType===0?'维修内容':'搬家内容'" prop="MaintainContent">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows:7}"
                  :placeholder="`请输入${busType===0?'维修':'搬家'}内容`"
                  maxlength="400"
                  v-model="form.MaintainContent"
                ></el-input>
              </el-form-item>
            </div>
            <div class="clearfix form-item-sm">
              <upload-file :imgList="form.Img" title="图片凭证"></upload-file>
            </div>
            <div class="clearfix form-item-lg">
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows:7}"
                  placeholder="请输入备注"
                  maxlength="400"
                  v-model="form.BZ"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-scrollbar>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="submitCancel">取 消</el-button>
      <el-button type="primary" @click="submitForm(1)" :loading="loading">暂 存</el-button>
      <el-button type="primary" @click="submitForm(2)" :loading="loading">提 交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { SearchHouse, UploadFile } from '../../../../../components'
  import { AddCleaning, InsertMaintain, AddHouseMoving, EditHouseMoving } from '../../../../../api/service'
  export default {
    name: 'EditCleanItem',
    props: {
      busType: { // 0 维修 1 搬家
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        showDialog: false,
        form: {
          HouseKey: '',
          HouseID: '',
          HouseName: '',
          HouseArea: '',
          Location: '',
          TenantName: '',
          TenantTel: '',
          MaintainContent: '',
          Img: '',
          BZ: '',
          EmployeeID: '',
          DepID: ''
        },
        defaultForm: {},
        title: '',
        editType: 0, // 0新增 1修改
        loading: false,
        oldImgSum: [],
        rules: {
          HouseName: [
            { required: true, message: '请选择房源', trigger: 'blur' }
          ],
          MaintainContent: [
            { required: true, message: '请输入维修内容', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      SearchHouse,
      UploadFile
    },
    created() {
      this.defaultForm = { ...this.form, Img: [] }
    },
    methods: {
      open({ type = 0, data = {}}) {
        this.editType = type
        if (type === 0) {
          this.form = { ...this.defaultForm, Img: [] }
          this.title = this.busType === 0 ? '新增维修' : '新增搬家'
        } else {
          console.log(data)
          const Img = data.ImageList
          data = { ...data, Img: [...(Img || [])] }
          this.form = this.busType === 0 ? data : { ...data, MaintainContent: data.MovingContent }
          this.title = this.busType === 0 ? '修改维修' : '修改搬家'
          this.oldImgSum = this.$deepCopy(Img)
        }
        this.showDialog = true
        this.$nextTick(() => {
          this.$refs['EditMoveingItem'].clearValidate()
        })
      },
      handleHouseSelect(item) {
        this.form.HouseID = item.KeyID
        this.form.EmployeeID = item.EmployeeID
        this.form.DepID = item.DepID
        this.form.HouseName = item.HouseName
        this.form.HouseKey = item.HouseKey
        this.form.HouseArea = item.HouseArea
        this.form.Location = item.Location
      },
      submitCancel() {
        this.showDialog = false
      },
      submitForm(type) {
        this.$refs['EditMoveingItem'].validate().then(() => {
          const form = { ...this.form }
          let fn = AddCleaning
          // busType 1 是半价  editType 1 是修改
          if (this.editType === 0) {
            fn = this.busType === 0 ? InsertMaintain : AddHouseMoving
          } else {
            fn = this.busType === 0 ? AddHouseMoving : EditHouseMoving
          }
          // this.busType === 0 ? form.type = 1 : form.type = 2
          this.loading = true
          if (this.busType === 1) {
            form.MovingContent = form.MaintainContent
          }
          form.Status = type
          // form.ImageID
          // const ImageID = this.$DiffArrFn(this.oldImgSum, this.form.Img, [
          //   'ImageLocation'
          // ])
          let arr = ''
          if (this.form.Img.length !== 0) {
            this.form.Img.forEach(item => {
              arr = arr + item.KeyID + ','
            })
            form.ImageID = arr.substring(0, arr.length - 1)
          } else {
            form.ImageID = ''
          }
          // 变成number
          // form.TenantTel = Number(form.TenantTel)
          fn(
            // [this.busType === 0 ? 'maintain' : 'info']: form,
            // type: type
            form
          ).then(({ Data }) => {
            this.loading = false
            this.showDialog = false
            this.$message.success('操作成功')
            // this.$emit('success', {
            //   data: Data,
            //   editType: this.editType,
            //   busType: this.busType
            // })
            this.$emit('refresh', true)
          }).catch(() => {
            this.loading = false
          })
        })
      }
    }
  }
</script>
