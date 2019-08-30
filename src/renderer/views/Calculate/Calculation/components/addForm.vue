<template>
  <el-dialog
    title="添加新项目"
    :visible.sync="isShowDialog"
    @close="closeDialog"
    width="700px"
    center
    append-to-body
  >
    <el-form
      :model="addForm"
      label-width="90px"
      label-position="right"
      :inline="true"
      :rules="rules"
      ref="CalcAddForm"
    >
      <div class="dialog-box form-item-sm">
        <div class="clearfix">
          <el-form-item label="应收/应付" prop="ReceivableOrPayable">
            <el-select v-model="addForm.ReceivableOrPayable">
              <el-option
                v-for="opt in ReceivableOrPayableList"
                :key="opt.label"
                :label="opt.label"
                :value="opt.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="BillType">
            <el-select v-model="addForm.BillType">
              <el-option
                v-for="opt in BillTypeList"
                :key="opt.label"
                :label="opt.label"
                :value="opt.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="收支项目" prop="ItemNameArr">
            <el-cascader
              placeholder="项目"
              v-model="addForm.ItemNameArr"
              :options="billItem.data"
              :props="billItem.props"
              separator=">"
              expand-trigger="hover"
              filterable
              @change="handleItemChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="金额" prop="Price">
            <el-input v-model="addForm.Price" v-positive="addForm.Price" type="number"></el-input>元
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="收入/支出">
            <el-radio-group v-model="addForm.InOrOut">
              <el-radio label="1">收入</el-radio>
              <el-radio label="2">支出</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="日期" prop="BudgetDate">
            <el-date-picker
              v-model="addForm.BudgetDate"
              type="date"
              placeholder="选择日期"
              style="width: 220px;"
            ></el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="submitForm" type="primary">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default ({
  name: 'addForm',
  data() {
    return {
      isShowDialog: false,
      addForm: {
        ReceivableOrPayable: '',
        BillType: '',
        ItemNameArr: [],
        InOrOut: '1',
        BudgetDate: '',
        Price: '',
        isNew: 'yes'
      },
      ReceivableOrPayableList: [
        {
          label: '应收',
          value: 1
        },
        {
          label: '应付',
          value: 2
        }
      ],
      BillTypeList: [
        {
          label: '业主',
          value: 2
        },
        {
          label: '租客',
          value: 1
        }
      ],
      ItemNameArrList: [
        {
          label: '租金',
          value: '租金'
        },
        {
          label: '水电气费',
          value: '水电气费'
        }
      ],
      rules: {
        ReceivableOrPayable: [
          { required: true, message: '请选择应付或应收', trigger: 'blur' }
        ],
        BillType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        ItemNameArr: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ],
        Price: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        BudgetDate: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'refreshBillItem'
    ]),
    open() {
      this.isShowDialog = true
      this.refreshBillItem()
      console.log(this.billItem)
    },
    closeDialog() {
      this.$refs['CalcAddForm'].resetFields()
      this.isShowDialog = false
    },
    handleItemChange() {
      this.addForm.ItemArr = this.getCascaderObj(this.addForm.ItemNameArr, this.billItem.data)
    },
    getCascaderObj(val, opt) {
      return val.map(function(value, index, array) {
        for (var itm of opt) {
          if (itm.KeyID === value) { opt = itm.Children; return itm }
        }
        return null
      })
    },
    submitForm() {
      this.$refs['CalcAddForm'].validate(valid => {
        if (valid) {
          this.addForm.ItemName = this.addForm.ItemArr[this.addForm.ItemArr.length - 1].Name
          this.addForm.ItemID = this.addForm.ItemArr[this.addForm.ItemArr.length - 1].KeyID
          var newObj = Object.assign({}, this.addForm)
          this.$emit('addNewItem', newObj)
          this.$refs['CalcAddForm'].resetFields()
          this.closeDialog()
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'billItem'
    ])
  }
})
</script>
<style lang="scss" scoped>
</style>
