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
      label-width="100px"
      :inline="true"
      :rules="rules"
      style="height: 450px; overflow: auto;"
      ref="addFixSalesmanForm"
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <!-- <div style="padding: 10px 100px 20px 100px">
            <el-radio-group v-model="EditFormData.houseRelation">
              <el-radio :label="1">房源相关</el-radio>
              <el-radio :label="0">房源无关</el-radio>
            </el-radio-group>
          </div> -->
          <el-form-item v-if="showHouseInput" label="房源名称" prop="HouseName">
            <search-house :type="13" v-model="EditFormData.HouseName" @select="selectedHouse"></search-house>
          </el-form-item>
        </div>
        <div class="clearfix fix-to-apply-project-input">
          <el-form-item label="费用项目" style="display: block">
            <el-button @click="addProject" size="small" plain type="primary">添加项目</el-button>
          </el-form-item>
          <el-form-item
            v-for="(project, index) in EditFormData.costProject"
            :key="index"
            :rules="{required: true, message: '项目不能为空', trigger: 'change'}"
            :prop="'costProject.' + index"
            style="margin-left: 100px;width:700px"
          >
            <el-cascader
              placeholder="请选择项目"
              :options="billItem"
              :props="billItemProps"
              expand-trigger="hover"
              @change="projectChange(...arguments, index)"
              filterable
              v-model="project.BillProjectIDMark"
            ></el-cascader>
            <el-input
              style="width:150px;"
              type="number"
              placeholder="请填写金额"
              v-model="project.Money"
            ></el-input>
            <el-button size="mini" type="danger" @click.prevent="removeProject(project)">删除</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="图片">
            <upload-file :imgList="EditFormData.ImageList"></upload-file>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请填写备注"
              maxlength="400"
              v-model="EditFormData.Remark"
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
import { QueryBillItem } from '@/api/ownerBill'
import { getTreeNodeByValue } from '@/utils/arrUtil/treeArr'
import { AddReimbursement, EditReimbursement } from '@/api/house'

export default {
  name: 'AddOrModifiyExpense',
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
        ContractID: '',
        ContractNum: '',
        // 房源相关
        houseRelation: 1,
        costProject: [],
        ImageList: [],
        Remark: ''
      },
      rules: {
        HouseName: [{ required: true, message: '请选择房源', trigger: 'blur' }]
      },
      btnLoading: false,
      oldImage: [],
      billItem: [],
      billItemProps: {},
      // 记录传进来的form
      recoredForm: []
    }
  },
  created() {
    this.initData()
  },
  computed: {
    showHouseInput() {
      return this.EditFormData.houseRelation === 1
    }
  },
  methods: {
    initData() {
      QueryBillItem().then(({ Data }) => {
        this.billItem = Data
        this.billItemProps = {
          children: 'Children',
          label: 'Name',
          value: 'KeyID'
        }
      })
    },
    async open(type, form) {
      // type: 1新增 2修改
      this.type = type
      if (form) {
        // 记录传进来的form
        this.recoredForm = this.$deepCopy(form)
        // 回显到页面上的数据
        const EditFormData = this.$deepCopy(form)
        // 费用项目回显，2个keyID组成的数组
        EditFormData.costProject = EditFormData.reimbursementTypes
        EditFormData.costProject.forEach(v => {
          v.BillProjectIDMark = [v.BillProjectTypeID, v.BillProjectID]
        })
        // 判断显示是否显示房源
        if (EditFormData.HouseName !== '非房源记账') {
          EditFormData.houseRelation = 1
        } else {
          EditFormData.houseRelation = 0
        }
        // 图片
        EditFormData.ImageList = EditFormData.ImageList || []
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
        ContractID: '',
        ContractNum: '',
        KeyLocation: '',
        costProject: [],
        ImageList: [],
        Remark: '',
        houseRelation: 1
      }
      this.EditVisible = false
    },
    submitForm(status) {
      // 暂存1 提交2
      this.$refs['addFixSalesmanForm'].validate(valid => {
        if (valid) {
          // houseRelation判断是否展示房源
          if (this.EditFormData.houseRelation === 0) {
            this.EditFormData.HouseName = '非房源记账'
            this.EditFormData.HouseID = ''
            this.EditFormData.HouseKey = ''
            this.EditFormData.HouseArea = ''
            this.EditFormData.Location = ''
            this.EditFormData.ContractID = ''
            this.EditFormData.ContractNum = ''
          }
          // 判断费用只填写一个的情况下
          if (this.EditFormData.costProject !== 0) {
            var judgeCostProject = true
            this.EditFormData.costProject.forEach((item, index) => {
              if (item.BillProjectName === '' || item.Money === '') {
                const num = index + 1
                this.$message.error('请填写完第' + num + '行费用项目,或者删除')
                judgeCostProject = false
                return
              }
            })
            if (!judgeCostProject) {
              return
            }
          }
          const form = this.$deepCopy(this.EditFormData)
          form.Status = status
          // 解决[]  map报错
          if (this.EditFormData.ImageList.length !== 0) {
            form.ImageLocation = this.$DiffArrFn(
              this.oldImage,
              this.EditFormData.ImageList,
              ['ImageLocation']
            )
            form.ImageID = form.ImageList.map(v => v.KeyID).join(',')
          }
          // 修改的时候对比一下费用项目
          if (
            this.type === 2 &&
            (this.recoredForm.reimbursementTypes.length !== 0 ||
              this.EditFormData.costProject.length !== 0)
          ) {
            form.costProject = this.$DiffArrFn(
              this.recoredForm.reimbursementTypes,
              this.EditFormData.costProject,
              ['BillProjectID', 'Money']
            )
          }
          const obj = {
            ment: form,
            mentType: form.costProject
          }
          this.btnLoading = true
          if (this.type === 1) {
            AddReimbursement(obj).then(({ Data }) => {
              this.$emit('succeedExpense')
              this.$message.success('新增成功')
              this.close()
              this.btnLoading = false
            })
          } else {
            // 修改接口
            obj.OperationType = 1
            EditReimbursement(obj).then(({ Data }) => {
              this.$emit('succeedExpense')
              this.$message.success('修改成功')
              this.close()
              this.btnLoading = false
            })
          }
        }
      })
    },
    removeProject(item) {
      const index = this.EditFormData.costProject.indexOf(item)
      if (index !== -1) {
        this.EditFormData.costProject.splice(index, 1)
      }
    },
    addProject() {
      this.EditFormData.costProject.push({
        Money: '',
        BillProjectIDMark: [],
        BillProjectName: '',
        BillProjectID: '',
        // 保存上一级ID
        BillProjectTypeID: '',
        BillProjectTypeName: ''
      })
    },
    selectedHouse(data) {
      this.EditFormData.HouseName = data.HouseName
      this.EditFormData.HouseID = data.KeyID
      this.EditFormData.HouseKey = data.HouseKey
      this.EditFormData.HouseArea = data.HouseArea
      this.EditFormData.Location = data.Location
      this.EditFormData.ContractNum = data.ContractNum
      this.EditFormData.ContractID = data.ContractID
    },
    projectChange(data, index) {
      const billItem = getTreeNodeByValue(
        this.billItem,
        data[1],
        this.billItemProps
      )
      this.EditFormData.costProject[index].BillProjectID = billItem.data.KeyID
      this.EditFormData.costProject[index].BillProjectName = billItem.data.Name
      this.EditFormData.costProject[index].BillProjectTypeID = data[0]
      this.EditFormData.costProject[index].BillProjectTypeName =
        billItem.pathNameArr[0]
    }
  }
}
</script>

<style lang="scss">
.fix-to-apply-project-input .el-input,
.fix-to-apply-project-input .el-cascader {
  width: 200px;
  &:not(:first-child) {
    margin-left: 20px;
  }
  input {
    // text-align: center;
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
