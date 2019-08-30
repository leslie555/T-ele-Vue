<template>
  <el-dialog
    :visible="EditVisible"
    @close="close"
    :title="type === 1 ? '新增科目': '修改科目'"
    :center="true"
    width="700px"
    append-to-body
  >
    <el-form
      :model="EditFormData"
      label-position="right"
      label-width="100px"
      :inline="true"
      :rules="rules"
      ref="FinancialSubjectEditForm"
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item label="所属类型" prop="AssetsType">
            <el-select v-model="EditFormData.AssetsType" placeholder="请选择" style="width: 200px;">
              <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="级次" prop="Gradation">
            <el-select v-model="EditFormData.Gradation" placeholder="请选择" style="width: 200px;">
              <el-option
                v-for="item in levelOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="科目编码" prop="SubjectCode">
            <el-input style="width: 200px;" v-model="EditFormData.SubjectCode" :maxlength="32"></el-input>
          </el-form-item>
          <el-form-item label="科目名称" prop="SubjectName">
            <el-input style="width: 200px;" v-model="EditFormData.SubjectName" :maxlength="16"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="助记码">
            <el-input style="width: 200px;" v-model="EditFormData.MnemonicCode" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="外币币种">
            <el-input style="width: 200px;" v-model="EditFormData.ForeignCurrency" :maxlength="16"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="计量单位">
            <el-input style="width: 200px;" v-model="EditFormData.Unit" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="辅助账类型">
            <el-input
              style="width: 200px;"
              v-model="EditFormData.AuxiliaryAccountType"
              :maxlength="16"
            ></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="账页格式">
            <el-input style="width: 200px;" v-model="EditFormData.Format" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="余额方向">
            <el-input style="width: 200px;" v-model="EditFormData.Direction" :maxlength="16"></el-input>
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
import { EditFinancialSubject, AddFinancialSubject } from '@/api/report'

export default ({
  name: 'edit-form',
  data() {
    return {
      type: 1,
      EditVisible: false,
      EditFormData: {
        AssetsType: '',
        Gradation: '',
        SubjectCode: '',
        SubjectName: '',
        MnemonicCode: '',
        ForeignCurrency: '',
        Unit: '',
        AuxiliaryAccountType: '',
        Format: '',
        Direction: ''
      },
      typeOption: [
        {
          value: 1,
          label: '资产'
        }, {
          value: 2,
          label: '负债'
        }, {
          value: 3,
          label: '共同'
        }, {
          value: 4,
          label: '权益'
        }, {
          value: 5,
          label: '成本'
        }, {
          value: 6,
          label: '损益'
        }
      ],
      levelOption: [
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        },
        {
          value: '4',
          label: '4'
        },
        {
          value: '5',
          label: '5'
        },
        {
          value: '6',
          label: '6'
        },
        {
          value: '7',
          label: '7'
        },
        {
          value: '8',
          label: '8'
        },
        {
          value: '9',
          label: '9'
        },
        {
          value: '10',
          label: '10'
        }
      ],
      // 表单验证
      rules: {
        AssetsType: [
          { required: true, message: '请选择所属类型', trigger: 'blur' }
        ],
        Gradation: [
          { required: true, message: '请选择级次', trigger: 'blur' }
        ],
        SubjectCode: [
          { required: true, message: '请填写科目编码', trigger: 'blur' }
        ],
        SubjectName: [
          { required: true, message: '请填写科目名称', trigger: 'blur' }
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
      }
    },
    close() {
      this.$refs['FinancialSubjectEditForm'].resetFields()
      this.EditVisible = false
      this.EditFormData.AssetsType = ''
      this.EditFormData.Gradation = ''
      this.EditFormData.SubjectCode = ''
      this.EditFormData.SubjectName = ''
      this.EditFormData.MnemonicCode = ''
      this.EditFormData.ForeignCurrency = ''
      this.EditFormData.Unit = ''
      this.EditFormData.AuxiliaryAccountType = ''
      this.EditFormData.Format = ''
      this.EditFormData.Direction = ''
    },
    submitForm() {
      const self = this
      this.$refs['FinancialSubjectEditForm'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.type === 1) {
            AddFinancialSubject(this.EditFormData).then(response => {
              if (response.Code === 0) {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                })
                this.$emit('AddNewFinancial', response.Data)
                this.btnLoading = false
                self.close()
              }
            })
          } else {
            // 修改接口
            EditFinancialSubject(this.EditFormData).then(response => {
              if (response.Code === 0) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.$emit('EditNewFinancial', this.EditFormData)
                this.btnLoading = false
                self.close()
              }
            })
          }
        }
      })
    }
  }
})
</script>