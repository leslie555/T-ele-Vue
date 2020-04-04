<template>
  <div>
    <template v-for="step in steps">
      <Panel :key="step.title" :title="step.title">
        <step-item :color="step.color" :stepData="step.data"></step-item>
      </Panel>
    </template>
  </div>
</template>

<script>
import Panel from './Panel'
import StepItem from './StepItem'
const STEP_DATA = [
  {
    title: '拿房',
    color: '#FF8241',
    data: [
      {
        label: '跑盘',
        iconname: 'icon-lc-paopan',
        iconsize: '33px',
        routerName: '1'
      },
      { label: '意向业主', iconname: 'icon-lc-yixiangyezhu', routerName: '1' },
      {
        label: '新增房源合同',
        iconname: 'icon-lc-xinzengfangyuan',
        routerName: '1'
      },
      {
        label: '开付款单',
        stepLabel: '合同审批',
        iconname: 'icon-lc-kaifukuandan',
        iconsize: '20px',
        routerName: '1'
      },
      {
        label: '装修申请',
        stepLabel: '财务核销',
        iconname: 'icon-lc-zhuangxiushenqing',
        routerName: '1'
      },
      { label: '', iconname: 'icon-lc-chenggong', routerName: '1' }
    ]
  },
  {
    title: '出房',
    color: '#0088FF',
    data: [
      {
        label: '上架房源',
        iconname: 'icon-lc-shangjiafangyuan',
        routerName: '1'
      },
      { label: '预约看房', iconname: 'icon-lc-yuyuekanfang', routerName: '1' },
      {
        label: '预订房源',
        iconname: 'icon-lc-yudingfangyuan',
        routerName: '1'
      },
      {
        label: '新增租客合同',
        iconname: 'icon-lc-xinzengzukehetong',
        routerName: '1'
      },
      {
        label: '开收款单',
        stepLabel: '合同审核',
        iconname: 'icon-lc-kaishoukuandan',
        iconsize: '20px',
        routerName: '1'
      },
      { label: '', iconname: 'icon-lc-chenggong', routerName: '1' }
    ]
  },
  {
    title: '续租/转租',
    color: '#FFAC41',
    data: [
      { label: '续租/转租', iconname: 'icon-lc-zhuanzuxuzu', routerName: '1' },
      {
        label: '开收款单',
        stepLabel: '合同审核',
        iconname: 'icon-lc-kaishoukuandan',
        iconsize: '20px',
        routerName: '1'
      },
      {
        label: '',
        stepLabel: '财务核销',
        iconname: 'icon-lc-chenggong',
        routerName: '1'
      }
    ]
  },
  {
    title: '换房',
    color: '#24D0B2',
    data: [
      {
        label: '选择新房源',
        iconname: 'icon-lc-xuanzeyuanfangyuan',
        routerName: '1'
      },
      {
        label: '新增换房合同',
        stepLabel: '原房源结算',
        iconname: 'icon-lc-xinzengfangyuan',
        routerName: '1'
      },
      {
        label: '开收款单',
        stepLabel: '合同审批',
        iconname: 'icon-lc-kaishoukuandan',
        iconsize: '20px',
        routerName: '1'
      },
      {
        label: '',
        stepLabel: '财务核销',
        iconname: 'icon-lc-chenggong',
        routerName: '1'
      }
    ]
  },
  {
    title: '退房',
    color: '#F06F69',
    data: [
      {
        label: '退房申请',
        iconname: 'icon-lc-tuifangshenqing',
        routerName: '1'
      },
      {
        label: '退房结账',
        stepLabel: '退房审核',
        iconname: 'icon-lc-tuifangjiezhang',
        routerName: '1'
      },
      {
        label: '',
        stepLabel: '财务核销',
        iconname: 'icon-lc-chenggong',
        routerName: '1'
      }
    ]
  }
]
export default {
  name: 'StepBox',
  components: {
    Panel,
    StepItem
  },
  data() {
    return {
      steps: STEP_DATA
    }
  }
}
</script>

<style>
</style>