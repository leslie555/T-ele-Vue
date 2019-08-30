<template>
    <div class="table-expend">
        <el-table :data="list"
                  border
                  fit
                  class="table-normal noSplit">
            <el-table-column type="expand" fixed="left">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand-form">
                        <el-form-item label="房源名称">{{props.row.HouseName}}</el-form-item>
                        <el-form-item label="项目名称">{{props.row.BillProjectName}}</el-form-item>
                        <el-form-item label="收支类型">{{props.row.InOrOut?$EnumData.getEnumDesByValue('InOrOut', props.row.InOrOut):''}}</el-form-item>
                        <el-form-item label="金额">{{$priceFormat(props.row.Amount)}}</el-form-item>
                        <el-form-item label="收支日期">{{$dateFormat(props.row.ReceivablesDate)}}</el-form-item>
                        <!--<el-form-item label="审核状态">{{$EnumData.getEnumDesByValue('AuditStatus', props.row.AuditStatus)}}</el-form-item>-->
                        <el-form-item label="备注">
                            <p>{{ props.row.Remark || '无' }}</p>
                        </el-form-item>
                        <el-form-item label="图片凭证">
                            <div class="table-expand-img-box">
                                <template v-if="props.row.ImageUpload">
                                    <div class="table-expand-img" v-for="(item,index) in props.row.ImageUpload" :key="index">
                                        <img :src="$ImgUnit.getThumbImgUrl(item.ImageLocation)" @click="$seeImage($ImgUnit.getImgUrl(item.ImageLocation))">
                                    </div>
                                </template>
                                <template v-else>无</template>
                            </div>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" label='房源名称' fixed="left" width="240" prop="HouseName">
            </el-table-column>
            <el-table-column align="center" label="收支类型" min-width="80">
                <template slot-scope="scope">
                    {{scope.row.InOrOut?$EnumData.getEnumDesByValue('InOrOut', scope.row.InOrOut):''}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="项目" min-width="120" prop="BillProjectName"></el-table-column>
            <el-table-column align="center" label="金额" min-width="100">
                <template slot-scope="scope">
                    {{$priceFormat(scope.row.Amount)}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="收支日期" min-width="140">
                <template slot-scope="scope">
                    {{$dateFormat(scope.row.ReceivablesDate)}}
                </template>
            </el-table-column>
            <!--<el-table-column align="center" label="审核状态" min-width="120">-->
                <!--<template slot-scope="scope">-->
                    <!--{{$EnumData.getEnumDesByValue('AuditStatus', scope.row.AuditStatus)}}-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="操作" fixed="right" width="160">
                <template slot-scope="scope">
                    <table-buttons
                            v-if="!disabled"
                            :options="operation2button"
                            :condition="condition"
                            :showAll="true"
                            @handleUpdateClick="handleUpdate(scope.row)"
                            @handleDeleteClick="handleDelete(scope.$index)"
                    ></table-buttons>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  import { TableButtons } from '../../../../../components'

  export default {
    name: 'index',
    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    components: {
      TableButtons
    },
    data() {
      return {
        condition: ['Update', 'Delete'],
        operation2button: [
          {
            key: 'Update',
            value: '修改',
            type: 'primary'
          },
          {
            key: 'Delete',
            value: '删除',
            type: 'danger'
          }
        ]
      }
    },
    methods: {
      handleUpdate(row) {
        this.$parent.$parent.$refs['settlement'].open({
          BookKeepPara: row,
          type: 1
        })
      },
      handleDelete(index) {
        this.list.splice(index, 1)
      }
    }
  }
</script>

<style scoped>

</style>
