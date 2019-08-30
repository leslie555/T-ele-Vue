<template>
  <div>
    <el-dialog :title="typeList.title + '详情'" width="1000px" :center="true" :visible.sync="modalVisibility"
               append-to-body>
      <div class="clearfix mr-bottom">
          <span class="remark-size">房源名称：</span> <span>{{editData.HouseName}}</span>
      </div>
      <div class="data-list-table">
        <el-table :data="filterList"
                  ref="multipleTable"
                  v-loading.body="listLoading"
                  element-loading-text="加载中"
                  border
                  fit
                  min-height="700px"
                  class="table-normal">
          <el-table-column v-if="typeList.titleID === 1" align="center" label="装修部门" min-width="120" prop="DecorationDepartment"></el-table-column>
          <el-table-column v-else align="center" label="供货商" min-width="120" prop="SupplierName"></el-table-column>
          <el-table-column align="center" label="类别" min-width="120" prop="CategoryName"></el-table-column>
          <el-table-column align="center" label='项目名称' min-width="120" prop="ProjectName">
          </el-table-column>
          <el-table-column align="center" label='型号' width="120" prop="Model"></el-table-column>
          <el-table-column align="center" label='内部单价' min-width="100" prop="InsidePrice"></el-table-column>
          <el-table-column align="center" label='外部单价' min-width="100" prop="ExternalPrice"></el-table-column>
          <el-table-column align="center" label='数量' min-width="60" prop="Number"></el-table-column>
          <el-table-column align="center" label='内部总金额' min-width="100" prop="InsidePriceTotalAmount"></el-table-column>
          <el-table-column align="center" label='外部总金额' min-width="100" prop="ExternalPriceTotalAmount"></el-table-column>
        </el-table>
      </div>
      <div class="clearfix mr-top">
            <div>
              <span class="remark-size">{{typeList.title}}备注：</span>
            <span>{{this.editData.BZ}}</span>
            </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { ShowPurchasingOrderDetails, ShowDecorationSheetDetails } from '../../../../../api/purchase'

  export default {
    name: 'FixPaperAndPurchaseDialog',
    data() {
      return {
        modalVisibility: false,
        listLoading: false,
        loading: false,
        form: {
          CategoryName: '', // 类别
          BrandName: '', // 品牌
          Distributor: '', // 经销商
          PersonChargeName: '', // 负责人姓名
          PersonChargeTel: '', // 负责人电话
          BZ: '' // 备注
        },
        typeList: {},
        columnList: {},
        editData: {},
        formLabelWidth: '120px',
        filterList: [],
        rules: {
          CategoryName: [
            { required: true }
          ],
          BrandName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          Distributor: [
            { required: true, min: 2, max: 15, message: '请输入经销商名称', trigger: 'blur' }
          ],
          PersonChargeName: [
            { required: true, min: 2, max: 15, message: '请输入负责人姓名', trigger: 'blur' }
          ],
          PersonChargeTel: [
            { required: true, min: 2, max: 15, message: '请输入负责人电话', trigger: 'blur' }
          ],
          BZ: [
            { min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      open(editData, typeList) {
        typeList.titleID === 1 ? this.showDecorationList(editData.KeyID) : this.showPurchaseList(editData.KeyID)
        console.log(editData, typeList)
        this.typeList = typeList
        this.editData = editData
        this.loading = false
        this.modalVisibility = true
      },

      close() {
        this.modalVisibility = false
      },
      showPurchaseList(id) {
        ShowPurchasingOrderDetails({
          KeyID: id
        }).then(res => {
          this.filterList = res.Data
          console.log('采购单详情', res)
        })
      },
      showDecorationList(id) {
        ShowDecorationSheetDetails({
          KeyID: id
        }).then(res => {
          this.filterList = res.Data
          console.log('装修单详情', res)
        })
      },
      cancleSubmit() {
        this.close()
      }
    }
  }
</script>

<style lang="scss" scoped>
.form-label-input {
  min-width: 532px;
}
.mr-top {
  margin-top: 25px;
}
.mr-bottom {
  margin-bottom: 25px;
}
.remark-size {
  font-size: 15px;
  color: rgb(138, 138, 138)
}
</style>
