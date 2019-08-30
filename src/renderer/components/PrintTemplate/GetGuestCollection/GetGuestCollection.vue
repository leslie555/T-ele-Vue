<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <td>月份</td>
        <td>中介</td>
        <td>物业</td>
        <td>转介绍</td>
        <td>网络</td>
        <td>上门</td>
        <td>其他</td>
        <td>合计</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData" :key="index">
        <td>{{ $dateFormat(item.Time,'yyyy-MM') }}</td>
        <td>{{ item.Intermediary}}</td>
        <td>{{ item.Property}}</td>
        <td>{{ item.Introduction}}</td>
        <td>{{ item.Network}}</td>
        <td>{{ item.Door}}</td>
        <td>{{ item.Other}}</td>
        <td>{{ item.Total}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'GetGuestCollection',
    props: {
      printData: {
        type: Array,
        default: () => {
          return []
        }
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        newPrintData: this.$deepCopy(this.PrintData)
      }
    },
    methods: {
    }
  }

</script>
<style lang="scss" scoped>
  @import "style";
</style>
