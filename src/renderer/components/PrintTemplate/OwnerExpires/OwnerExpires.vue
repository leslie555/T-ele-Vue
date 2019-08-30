<template>
  <div class="tableBigBox">
    <div class="receipt-title">
      <h5>{{ title }}</h5>
    </div>
    <table class="table-mark">
      <thead>
      <tr class="table-head">
        <td>房源编号</td>
        <td>区域</td>
        <td>物业地址</td>
        <td>门牌号</td>
        <td>房主姓名</td>
        <td>联系电话</td>
        <td>管房人</td>
        <td>托管开始时间</td>
        <td>托管到期时间</td>
        <td>托价</td>
        <td>备注</td>
      </tr>
      </thead>
      <tbody>
      <tr class="table-head" v-for="(item, index) in printData" :key="index">
        <td style="white-space: nowrap">{{ item.HouseCode }}</td>
        <td style="white-space: nowrap">{{ item.CityName }}</td>
        <td  style="white-space: nowrap">{{ item.CommunityName}}</td>
        <td  style="white-space: nowrap">{{ item.HouseNumber}}</td>
        <td  style="white-space: nowrap">{{ item.OwnerName}}</td>
        <td style="white-space: nowrap">{{ item.OwnerPhone}}</td>
        <td style="white-space: nowrap">{{ item.EmployeeName}}</td>
        <td style="white-space: nowrap">{{ $dateFormat(item.HostStartTime,'yyyy-MM-dd') }}</td>
        <td style="white-space: nowrap">{{ $dateFormat(item.HostEndTime,'yyyy-MM-dd') }}</td>
        <td style="white-space: nowrap">{{ item.JoePrice}}</td>
        <td>{{ item.BZ}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
    export default {
        name: 'OwnerExpires',
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
