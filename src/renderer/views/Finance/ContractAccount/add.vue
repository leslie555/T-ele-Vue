<template>
  <el-dialog
    :visible="addVisible"
    @close="close"
    title="新增调账"
    :center="true"
    width="1000px"
    append-to-body
  >
    <div class="ContractAccountACon">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="合同类型" prop="contarctStutas">
          <el-radio-group @change="selectContarct" v-model="form.contarctStutas">
            <el-radio :label="1">租客合同</el-radio>
            <el-radio :label="0">业主合同</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="房源名称" prop="HouseName">
          <search-house
            v-model="form.HouseName"
            :type="Type"
            keyWord="UUID"
            @select="handleHouseSelect"
          ></search-house>
          <div class="ContractAccountA">
            <p>
              <span>合同状态：</span>
              <span>{{ fillterStatus(form.ContractLeaseStatus) }}</span>
            </p>
            <p>
              <span>租客信息：</span>
              <span>{{ form.UserName }}{{ form.UserPhone }}</span>
            </p>
            <p>
              <span>租期：</span>
              <span>{{ form.StartTime }}至{{ form.EndTime }}</span>
            </p>
          </div>
        </el-form-item>
        <BillPanel ref="billPanel" :childrenKey="childrenKey" :type="form.contarctStutas"></BillPanel>
        <el-form-item label="备注" prop="Remark">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入备注"
                    v-model="form.Remark">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitForm()" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import BillPanel from '../../Owner/EditContract/components/BillPanel'
import SearchHouse from '../../../components/SearchHouse'
import { QueryBillAdjustCInfo, AdjustAccount } from '@/api/finance'
 export default {
  name: 'ContractAccountAdd',
  components: {
    BillPanel,
    SearchHouse
  },
  data() {
    return {
      addVisible: false,
      btnLoading: false,
      BillList: [],
      childrenKey: 'Detail',
      form: {
        contarctStutas: 1,
        // 房源
        HouseName: '',
        UUID: '',
        HouseKey: '',
        ContractID: '',
        KeyID: '',
        // 下面是左边信息
        ContractLeaseStatus: '',
        UserName: '',
        UserPhone: '',
        ContractNumber: '',
        StartTime: '',
        EndTime: '',
        Remark: ''
      },
      // 15 业主  16 租客
      Type: 16,
      rules: {
        contarctStutas: [
          { required: true, message: '请选择合同类型', trigger: 'change' }
        ],
        HouseName: [{ required: true, message: '请选择房源', trigger: 'blur' }],
        Remark: [
            { required: true, message: '请填写备注', trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
  methods: {
    open(form) {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        this.$refs.billPanel.initData([])
      })
    },
    submitForm() {
        // 验证数据
      this.$refs.billPanel.validate()
        .then(() => {
            // 获取数据
            const getBillData = this.$refs.billPanel.getValue()
            const obj = {
                billList: getBillData,
                contract: {
                    HouseID: this.form.KeyID,
                    HouseKey: this.form.HouseKey,
                    ContractID: this.form.ContractID,
                    ContractType: this.form.contarctStutas,
                    Remark: this.form.Remark,
                    HouseName: this.form.HouseName,
                    ContractNumber: this.form.ContractNumber,
                    UserName: this.form.UserName,
                    UserPhone: this.form.UserPhone
                }
            }
            this.btnLoading = true
            AdjustAccount(obj).then((data) => {
                if (data.Code === 0) {
                    this.btnLoading = false
                    this.$message.success('保存成功!')
                    this.$emit('refresh', true)
                    this.close()
                }
            })
        })
        .catch(() => {
          this.$message.error('账单信息填写完整才能暂存哦！')
        })
    },
    close() {
      this.removeForm()
      this.form.contarctStutas = 1
      this.addVisible = false
    },
    removeForm() {
      this.form.HouseName = ''
      this.form.UUID = ''
      this.form.HouseKey = ''
      this.form.KeyID = ''
      this.form.UserName = ''
      this.form.UserPhone = ''
      this.form.StartTime = ''
      this.form.EndTime = ''
      this.form.Remark = ''
      this.form.ContractNumber = ''
      this.form.ContractLeaseStatus = ''
    },
    selectContarct(val) {
      this.removeForm()
      this.$nextTick(() => {
        this.$refs.billPanel.initData([])
      })
      val === 1 ? (this.Type = 16) : (this.Type = 15)
    },
    handleHouseSelect(item) {
      this.form.HouseName = item.HouseName
      this.form.UUID = item.UUID
      this.form.HouseKey = item.HouseKey
      this.form.KeyID = item.KeyID
      this.form.ContractID = this.Type === 16 ? item.TenID : item.OwnerID
      this.getInformation(this.form.ContractID)
    },
    fillterStatus(code) {
        let ContractLeaseStatus = ''
        switch (code) {
            case 1:
                ContractLeaseStatus = '暂存'
                break
            case 2:
                ContractLeaseStatus = '待租客确认'
                break
            case 3:
                ContractLeaseStatus = '签约成功'
                break
            case 4:
                ContractLeaseStatus = '已退房结账'
                break
            case 5:
                ContractLeaseStatus = '已续签'
                break
            case 6:
                ContractLeaseStatus = '已转租'
                break
         }
         return ContractLeaseStatus
    },
    getInformation(id) {
      const contarct = {
          contractID: id,
          contractType: this.Type
      }
      QueryBillAdjustCInfo(contarct).then(({ Data }) => {
         this.form.UserName = Data.UserName
         this.form.UserPhone = Data.UserPhone
         this.form.StartTime = this.$dateFormat(Data.StartTime)
         this.form.EndTime = this.$dateFormat(Data.EndTime)
         this.form.ContractNumber = Data.ContractNumber
         this.form.ContractLeaseStatus = Data.ContractLeaseStatus
        //  switch (Data.ContractLeaseStatus) {
        //     case 1:
        //         this.form.ContractLeaseStatus = '暂存'
        //         break
        //     case 2:
        //         this.form.ContractLeaseStatus = '待租客确认'
        //         break
        //     case 3:
        //         this.form.ContractLeaseStatus = '签约成功'
        //         break
        //     case 4:
        //         this.form.ContractLeaseStatus = '已退房结账'
        //         break
        //     case 5:
        //         this.form.ContractLeaseStatus = '已续签'
        //         break
        //     case 6:
        //         this.form.ContractLeaseStatus = '已转租'
        //         break
        //  }
        this.$refs.billPanel.initData(Data.billAdjustContractBill)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ContractAccountA {
  float: right;
  display: flex;
  justify-content: space-around;
  width: 670px;
}
.ContractAccountACon {
    height: 600px !important;
    overflow-y: scroll;
    .bill-panel{
        margin-bottom: 40px;
    }
}
.ContractAccountACon::-webkit-scrollbar{
	display: none
}
.ContractAccountACon .el-form-item:nth-child(2) .el-form-item__content {
  overflow: hidden;
}
.ContractAccountACon
  .el-form-item:nth-child(2)
  .el-form-item__content
  .el-select {
  float: left;
}
</style>
