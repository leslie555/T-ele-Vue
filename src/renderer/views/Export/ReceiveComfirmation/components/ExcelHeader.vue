<template>
  <div class="table-container">
    <div class="table-label">表头示例</div>
    <table>
      <thead>
        <tr>
          <th><div></div></th>
          <th v-for="(item, index) in RowHeader" :key="index + ''">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <td>1</td>
        <td v-for="(item, index) in RowHeadData" :key="index + ''">
          {{ item }}
        </td>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'ExcelHeader',
    data() {
      return {
        RowHeader: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        RowHeadData: [
          '房源名称',
          '客户姓名',
          '联系电话',
          '租赁开始时间',
          '租赁到期时间',
          '租金',
          '押金'
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../styles/variables';
  @import '../../../../styles/mixin';
  .table-container {
    margin-left: 15px;
    margin-top: 17px;
    @include displayFlex(row, center, flex-start);
    .table-label {
      align-self: flex-end;
      margin-right: 10px;
      margin-bottom: 2px;
    }
    table {
      border-spacing: 0;
      box-sizing: border-box;
      tr, tbody {
        margin: 0 auto;
        height: 14px;
        line-height: 14px;
        th {
          font-weight: normal;
          color: #c7ccd7;
          border-right: 1px solid #c7ccd7;
          margin-left: 1px;
        }
        th:first-child {
          width: 30px;
          @include displayFlex(row, flex-end, flex-end);
          div {
            margin-top: 5px;
            border-bottom: 10px solid #c7ccd7;
            border-left: 10px solid transparent;
          }
        }
        th:nth-child(2) {
          background-color: #c7ccd7;
          color: green;
        }
      }
      td {
        font-weight: normal;
        border: 1px solid #c7ccd7;
        text-align: center;
        border-right: none;
      }
      td:last-child {
        border-right: 1px solid #c7ccd7;
      }
      td:first-child {
        background-color: #c7ccd7;
        color: green;
      }
      td:nth-child(2) {
        border: 2px solid green;
      }
    }
  }
</style>
