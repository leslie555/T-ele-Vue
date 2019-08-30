<template>
  <el-dialog
    :visible="EditVisible"
    title="新增"
    @close="dialogClose"
    :center="true"
    width="600px"
    append-to-body
  >
    <el-form :model="EditFormData" label-position="right" label-width="80px" :inline="true">
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item :label="`${ this.EditFormData.KeyID === 0 ? '选择' : '' }员工`">
            <el-select v-model="EditFormData.EmpID" placeholder="请选择" size="medium" filterable v-if="this.EditFormData.KeyID === 0">
              <el-option
                v-for="item in EmpList"
                :key="item.KeyID"
                :label="item.UserName"
                :value="item.KeyID"
                style="width: 300px !important"
              ></el-option>
            </el-select>
            <span v-else>{{ this.EditFormData.UserName }}</span>
          </el-form-item>
        </div>
        <div class="clearfix FinancialStaffingBox">
          <el-form-item label="负责门店">
            <el-select
              v-model="ComInfoList"
              multiple
              placeholder="请选择"
              size="medium"
              style="width: 400px"
              popper-class="kankanwo"
              filterable
            >
              <el-option
                v-for="item in ComList"
                :key="item.KeyID"
                :label="item.CompanyName"
                :value="item.KeyID"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="SubmitEditForm" :loading="loading">确 定</el-button>
      <el-button type="primary" @click="dialogClose">取 消</el-button>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
.community-amap {
  width: 600px;
  height: 250px;
  margin-left: 10px;
  margin-bottom: 20px;
}
</style>
<script>
/* eslint-disable no-extra-boolean-cast */

import { ShowBusDepEmp, ShowBusDepCom, AddHQDirectInfo, EditHQDirectInfo } from '../../../../api/system'
// , AddHQDirectInfo, EditHQDirectInfo, HQDirectInfoByID
export default ({
  name: 'edit-form',
  data() {
    return {
      value1: '',
      value2: [],
      EmpList: [],
      ComList: [],
      ComInfoList: [],
      EditFormData: {
        EmpID: '',
        ComInfoList: [],
        KeyID: 0,
        DepartmentID: 0,
        UserName: '',
        DepartmentName: ''
      },
      loading: false,
      EditVisible: false
    }
  },
  methods: {
    open(obj) {
      this.EditVisible = true
      ShowBusDepCom().then(res => {
        if (res) {
          this.ComList = res.Data
        }
      })
      if (obj === 0) {
        this.EditFormData.KeyID = 0
        ShowBusDepEmp().then(res => {
        if (res) {
          this.EmpList = res.Data
          this.EmpList.forEach(ele => {
            ele.UserName = ele.UserName + ' ' + ele.Tel
          })
        }
      })
      } else {
        // 赋值
        this.EditFormData.KeyID = obj.KeyID
        this.EditFormData.EmpID = obj.EmpID
        this.EditFormData.UserName = obj.UserName
        this.EditFormData.DepartmentID = obj.DepartmentID
        this.EditFormData.DepartmentName = obj.DepartmentName
        obj.ComInfoList.forEach(ele => {
          this.ComInfoList.push(Number(ele.CompanyID))
        })
        console.log(obj.ComInfoList, this.ComInfoList)
      }
    },
    dialogClose() {
      this.EditVisible = false
      this.ComInfoList = []
      this.loading = false
      this.EditFormData = {
        EmpID: '',
        ComInfoList: [],
        KeyID: 0,
        DepartmentID: 0,
        UserName: '',
        DepartmentName: ''
      }
    },
    SubmitEditForm() {
      var newArr = []
      this.loading = true
      if (this.EditFormData.KeyID === 0) {
        this.ComInfoList.forEach(ele => {
          newArr.push({
            CompanyID: ele
          })
        })
        this.EditFormData.ComInfoList = newArr
        AddHQDirectInfo(this.EditFormData).then(res => {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.$emit('SubmitEditForm')
          this.dialogClose()
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.ComInfoList.forEach(ele => {
          newArr.push({
            CompanyID: ele
          })
        })
        this.EditFormData.ComInfoList = newArr
        EditHQDirectInfo(this.EditFormData).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          const sendData = this.$deepCopy(this.EditFormData)
          var newData2 = []
          this.ComList.forEach(ele => {
            sendData.ComInfoList.forEach(item => {
              if (ele.KeyID === item.CompanyID) {
                newData2.push({
                  CompanyID: item.CompanyID,
                  CompanyName: ele.CompanyName
                })
              }
            })
          })
          sendData.ComInfoList = newData2
          this.$emit('EditForm', sendData)
          this.dialogClose()
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
})
</script>

<style lang="scss">
.FinancialStaffingBox {
  .el-input.el-input--medium.el-input--suffix {
    width: 100% !important;
  }
}
</style>
