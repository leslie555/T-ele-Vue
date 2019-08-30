<template>
    <div class="ApMagement-Box">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="我的申请" name="first">
                <my-application></my-application>
            </el-tab-pane>
            <el-tab-pane label="我的审批" name="second">
                <my-approval></my-approval>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  import MyApplication from './MyApplication'
  import MyApproval from './MyApproval'

  export default {
    data() {
      return {
        activeName: 'first',
        testData: [{
          '__hash': '49102947',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10006,
          'ModuleID': 0,
          'ModuleName': '房源',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '60089958',
            'ID': 10014,
            'ModuleID': 0,
            'ModuleName': '房态图',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '8788366',
            'ID': 10001,
            'ActionName': '批量完善房源',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }, {
            '__hash': '12113012',
            'ID': 10002,
            'ActionName': '批量上架',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }, {
            '__hash': '29099660',
            'ID': 10003,
            'ActionName': '批量下架',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }, {
            '__hash': '1505536',
            'ID': 10004,
            'ActionName': '批量换管房人',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '41895409',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10006,
          'ModuleID': 0,
          'ModuleName': '房源',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '55063913',
            'ID': 10015,
            'ModuleID': 0,
            'ModuleName': '共享房源',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '98884',
            'ID': 10005,
            'ActionName': '预约',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '42421309',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10007,
          'ModuleID': 0,
          'ModuleName': '业主',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '12239738',
            'ID': 10016,
            'ModuleID': 0,
            'ModuleName': '新增合同',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '16356538',
            'ID': 10006,
            'ActionName': '暂存',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }, {
            '__hash': '37633147',
            'ID': 10007,
            'ActionName': '现场签字',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }, {
            '__hash': '38492749',
            'ID': 10008,
            'ActionName': '保存',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '4609179',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10007,
          'ModuleID': 0,
          'ModuleName': '业主',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '31180822',
            'ID': 10017,
            'ModuleID': 0,
            'ModuleName': '合同列表',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '21908769',
            'ID': 10009,
            'ActionName': '新增合同',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '3620961',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10008,
          'ModuleID': 0,
          'ModuleName': '租客',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '9888450',
            'ID': 10018,
            'ModuleID': 0,
            'ModuleName': '新增合同',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '14286892',
            'ID': 10010,
            'ActionName': '暂存',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }, {
            '__hash': '22170405',
            'ID': 10011,
            'ActionName': '现场签字',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }, {
            '__hash': '48754343',
            'ID': 10012,
            'ActionName': '保存',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '44756577',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10008,
          'ModuleID': 0,
          'ModuleName': '租客',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '7436462',
            'ID': 10019,
            'ModuleID': 0,
            'ModuleName': '合同列表',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '36125817',
            'ID': 10013,
            'ActionName': '新增合同',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '62937168',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10008,
          'ModuleID': 0,
          'ModuleName': '租客',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '22281958',
            'ID': 10020,
            'ModuleID': 0,
            'ModuleName': '入住人列表',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '29501515',
            'ID': 10014,
            'ActionName': '添加入住人',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '39683596',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10008,
          'ModuleID': 0,
          'ModuleName': '租客',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '45720460',
            'ID': 10021,
            'ModuleID': 0,
            'ModuleName': '预约单',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '18289346',
            'ID': 10015,
            'ActionName': '添加预约',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '61501618',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10008,
          'ModuleID': 0,
          'ModuleName': '租客',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '10410958',
            'ID': 10022,
            'ModuleID': 0,
            'ModuleName': '预定单',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '37116299',
            'ID': 10016,
            'ActionName': '添加预定',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '18091878',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10008,
          'ModuleID': 0,
          'ModuleName': '租客',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '43896469',
            'ID': 10023,
            'ModuleID': 0,
            'ModuleName': '房源代理',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': []
        }, {
          '__hash': '41103535',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10009,
          'ModuleID': 0,
          'ModuleName': '财务',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '50894462',
            'ID': 10024,
            'ModuleID': 0,
            'ModuleName': '租客账单',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': []
        }, {
          '__hash': '23343424',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10009,
          'ModuleID': 0,
          'ModuleName': '财务',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '15108515',
            'ID': 10025,
            'ModuleID': 0,
            'ModuleName': '业主账单',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': []
        }, {
          '__hash': '39102111',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10009,
          'ModuleID': 0,
          'ModuleName': '财务',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '64698771',
            'ID': 10026,
            'ModuleID': 0,
            'ModuleName': '记账本',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '39812034',
            'ID': 10017,
            'ActionName': '记一笔账',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '33711243',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10009,
          'ModuleID': 0,
          'ModuleName': '财务',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '33717902',
            'ID': 10027,
            'ModuleID': 0,
            'ModuleName': '财务核销',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '36574459',
            'ID': 10018,
            'ActionName': '批量核销',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '54077786',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10010,
          'ModuleID': 0,
          'ModuleName': '服务',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '46812415',
            'ID': 10028,
            'ModuleID': 0,
            'ModuleName': '报修',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '16975980',
            'ID': 10020,
            'ActionName': '申请保修',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '34938342',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10010,
          'ModuleID': 0,
          'ModuleName': '服务',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '23272314',
            'ID': 10029,
            'ModuleID': 0,
            'ModuleName': '水电气抄表',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '51710894',
            'ID': 10022,
            'ActionName': '保存',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }, {
            '__hash': '38048553',
            'ID': 10023,
            'ActionName': '作废',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }, {
            '__hash': '15375492',
            'ID': 10024,
            'ActionName': '生成账单',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '19417744',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10011,
          'ModuleID': 0,
          'ModuleName': '审批',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '8713288',
            'ID': 10042,
            'ModuleID': 0,
            'ModuleName': '审批管理',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': []
        }, {
          '__hash': '47013045',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10012,
          'ModuleID': 0,
          'ModuleName': '系统',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '35937286',
            'ID': 10034,
            'ModuleID': 0,
            'ModuleName': '系统配置',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': []
        }, {
          '__hash': '49165838',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10012,
          'ModuleID': 0,
          'ModuleName': '系统',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '19961212',
            'ID': 10035,
            'ModuleID': 0,
            'ModuleName': '通知管理',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': []
        }, {
          '__hash': '40534528',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10012,
          'ModuleID': 0,
          'ModuleName': '系统',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '8116890',
            'ID': 10036,
            'ModuleID': 0,
            'ModuleName': '权限配置',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '59593826',
            'ID': 10025,
            'ActionName': '新增',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '64383228',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10013,
          'ModuleID': 0,
          'ModuleName': '企业管理',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '38661882',
            'ID': 10037,
            'ModuleID': 0,
            'ModuleName': '分店管理',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '10058097',
            'ID': 10026,
            'ActionName': '新增分店',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '19956477',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10013,
          'ModuleID': 0,
          'ModuleName': '企业管理',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '38503287',
            'ID': 10038,
            'ModuleID': 0,
            'ModuleName': '员工管理',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': []
        }, {
          '__hash': '9129619',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10039,
          'ModuleID': 0,
          'ModuleName': '测算中心',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '24292539',
            'ID': 10040,
            'ModuleID': 0,
            'ModuleName': '业绩测算',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': []
        }, {
          '__hash': '19625552',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10039,
          'ModuleID': 0,
          'ModuleName': '测算中心',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '30753948',
            'ID': 10041,
            'ModuleID': 0,
            'ModuleName': '测算配置',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': []
        }, {
          '__hash': '40106683',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10043,
          'ModuleID': 0,
          'ModuleName': '平台管理',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '25897896',
            'ID': 10044,
            'ModuleID': 0,
            'ModuleName': '小区管理',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': []
        }, {
          '__hash': '37235145',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10043,
          'ModuleID': 0,
          'ModuleName': '平台管理',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '1967901',
            'ID': 10045,
            'ModuleID': 0,
            'ModuleName': '企业管理',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '38923362',
            'ID': 10027,
            'ActionName': '新增',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }, {
          '__hash': '55124072',
          '__typeFullName': 'ZF.HouseManager.Model.ModuleAndAction.ModuleInfo,ZF.HouseManager.Common',
          'ID': 10043,
          'ModuleID': 0,
          'ModuleName': '平台管理',
          'Count': 0,
          'ChildModuleList': [{
            '__hash': '25907162',
            'ID': 10046,
            'ModuleID': 0,
            'ModuleName': '通知模板',
            'Count': 0,
            'ChildModuleList': [],
            'ActionList': []
          }],
          'ActionList': [{
            '__hash': '41210025',
            'ID': 10028,
            'ActionName': '新增',
            'ModuleID': 0,
            'IsForm': false,
            'IsPlatForm': false,
            'Language': 'zh-CN'
          }]
        }]
      }
    },
    components: {
      MyApplication,
      MyApproval
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .ApMagement-Box {
        padding: 20px;
    }
</style>
