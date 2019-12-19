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
                  v-loading="listLoading"
                  element-loading-text="加载中"
                  border
                  fit
                  min-height="500px"
                  class="table-normal">
          <el-table-column v-if="typeList.titleID === 1" align="center" label="装修部门" min-width="120" prop="DecorationDepartment"></el-table-column>
          <el-table-column v-else align="center" label="供货商" min-width="120" prop="Distributor"></el-table-column>
          <!-- <el-table-column align="center" label="类别" min-width="120" prop="CategoryName"></el-table-column> -->
          <el-table-column align="center" label='项目名称' min-width="120" prop="ProjectName">
          </el-table-column>
          <el-table-column align="center" label='型号' width="120" prop="Model"></el-table-column>
          <el-table-column align="center" label='内部单价' min-width="100" prop="InsidePrice">
             <template slot-scope="scope">
              <span>{{scope.row.InsidePrice + `元/` + scope.row.Unit}}</span>
             </template>
          </el-table-column>
          <el-table-column align="center" label='外部单价' min-width="100" prop="ExternalPrice">
             <template slot-scope="scope">
              <span>{{scope.row.ExternalPrice + `元/` + scope.row.Unit}}</span>
             </template>
          </el-table-column>
          <el-table-column align="center" label='数量' min-width="60" prop="Number"></el-table-column>
          <el-table-column align="center" label='内部总金额' min-width="100" prop="InsidePriceTotalAmount"></el-table-column>
          <el-table-column align="center" label='外部总金额' min-width="100" prop="ExternalPriceTotalAmount"></el-table-column>
        </el-table>
      </div>
      <div class="clearfix mr-top">
            <div>
              <span class="remark-size">{{typeList.title}}备注：</span>
            <span>{{this.editData.ZXBZ || this.editData.CGBZ}}</span>
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
        typeList: {},
        columnList: {},
        editData: {},
        formLabelWidth: '120px',
        filterList: []
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
        this.listLoading = true
        ShowPurchasingOrderDetails({
          KeyID: id
        }).then(res => {
          this.filterList = res.Data
          this.listLoading = false
          console.log('采购单详情', res)
        })
      },
      showDecorationList(id) {
        this.listLoading = true
        ShowDecorationSheetDetails({
          KeyID: id
        }).then(res => {
          this.filterList = res.Data
          this.listLoading = false
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
