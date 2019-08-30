<template>
    <div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed prop="businessType" label="所属业务" width="100"></el-table-column>
            <el-table-column prop="proposer" label="申请人" width="100"></el-table-column>
            <el-table-column prop="applicationTime" label="申请时间" width="100"></el-table-column>
            <el-table-column prop="approver" label="审批人" width="100"></el-table-column>
            <el-table-column prop="Content" label="审批内容" width="250"></el-table-column>
            <el-table-column prop="approvalTime" label="审批时间" width="100"></el-table-column>
            <el-table-column prop="type" label="状态" width="100"></el-table-column>
            <el-table-column prop="remark" label="备注" width="250"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: {
      tableData: {
        type: Array,
        default: []
      }
    },
    methods: {
      handleClick(row) {
        console.log(row)
      }
    }
  }
</script>

<style>
</style>
