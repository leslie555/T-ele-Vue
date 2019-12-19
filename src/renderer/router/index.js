import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'
import reportLayout from '../views/Report/reportLayout'
// import { filterRouter } from './fiterRouter'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    hasCache: true                keep-alive
    hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
  }
 **/
export const constantRouterMap = [
         {
           path: '/redirect',
           component: Layout,
           meta: {
             hidden: true
           },
           children: [
             {
               path: '/redirect/:path*',
               component: () => import('@/views/redirect/index'),
               meta: {
                 hidden: true
               }
             }
           ]
         },
         {
           path: '/login',
           component: () => import('@/views/login/index'),
           meta: {
             hidden: true
           }
         },
         {
           path: '/404',
           component: () => import('@/views/404'),
           meta: {
             hidden: true
           }
         },
         {
           path: '/UserManual',
           component: Layout,
           name: 'UserManual',
           meta: {
             hidden: true
           },
           children: [
             {
               path: 'UserManualIndex',
               name: 'UserManualIndex',
               hidden: true,
               component: () => import('@/views/UserManual/index'),
               meta: { title: '用户手册', hidden: true }
             }
           ]
         },
         {
           path: '/House',
           component: Layout,
           redirect: '/House/HouseList',
           name: 'House',
           meta: { title: '房源', icon: 'icon-fangyuan', sort: 1 },
           children: [
             {
               path: 'HouseList',
               name: 'HouseList',
               component: () => import('@/views/House/HouseList/index'),
               meta: { title: '房态图', hasCache: true }
             },
             {
               path: 'ShareHouse',
               name: 'ShareHouse',
               component: () => import('@/views/House/ShareHouse/index'),
               meta: { title: '共享房源' }
             },
             {
               path: 'CommunityList',
               name: 'CommunityList',
               component: () => import('@/views/House/CommunityList/index'),
               meta: { title: '小区管理' }
             },
             {
               path: 'ShareHouseDetail',
               name: 'ShareHouseDetail',
               component: () => import('@/views/House/ShareHouseDetail/index'),
               meta: { title: '共享房源详情', hidden: true }
             },
             {
               path: 'HouseInfo',
               name: 'HouseInfo',
               component: () => import('@/views/House/HouseInfo/index'),
               meta: { title: '房源详情', hidden: true }
             },
             {
               path: 'FixSalesman',
               name: 'FixSalesmanList',
               component: () =>
                 import('@/views/FixPurchase/FixToApply/FixSalesman/index'),
               meta: { title: '装修申请' }
             },
             // {
             //   path: 'HouseConfig',
             //   name: 'HouseConfig',
             //   component: () =>
             //   import('@/views/House/HouseConfig/index'),
             //   meta: { title: '房源配置', hasCache: true }
             // },
             {
               path: 'CompleteHouse',
               name: 'CompleteHouse',
               component: () => import('@/views/House/CompleteHouse/index'),
               meta: { title: '完善房源', hasCache: true, hidden: true }
             },
             {
               path: 'HouseDistribution',
               name: 'HouseDistribution',
               component: () => import('@/views/House/HouseDistribution/index'),
               meta: { title: '房源分配', hasCache: true }
             }
             // {
             //   path: 'ItemManage',
             //   name: 'ItemManage',
             //   component: () => import('@/views/House/CompleteHouse/components/ItemManage/index'),
             //   meta: { title: '物品管理' }
             // }
           ]
         },
         {
           path: '/Owner',
           component: Layout,
           redirect: '/Owner/ContractList',
           name: 'Owner',
           meta: { title: '业主', icon: 'icon-yezhu' },
           children: [
             {
               path: 'AddContract',
               name: 'OwnerAddContract',
               component: () => import('@/views/Owner/EditContract/add'),
               meta: {
                 title: '新增合同',
                 markTitle: '新增业主合同',
                 hasCache: true
               }
             },
             {
               path: 'EditContract',
               name: 'OwnerEditContract',
               component: () => import('@/views/Owner/EditContract/edit'),
               meta: {
                 title: '修改合同',
                 markTitle: '修改业主合同',
                 hasCache: true,
                 hidden: true
               }
             },
             {
               path: 'ContractList',
               name: 'OwnerContractList',
               component: () => import('@/views/Owner/ContractList/index'),
               meta: {
                 title: '合同列表',
                 hasCache: true,
                 markTitle: '业主合同列表'
               }
             },
             {
               path: 'ContractDetail',
               name: 'OwnerContractDetail',
               component: () => import('@/views/Owner/ContractDetail/index'),
               meta: {
                 title: '业主合同详情',
                 hasCache: true,
                 hidden: true
               }
             },
             {
               path: 'ContractSign',
               name: 'OwnerContractSign',
               component: () => import('@/views/Owner/ContractSign/index_old'),
               meta: { title: '业主合同签字', hidden: true }
             },
             {
               path: 'ContractPreview',
               name: 'OwnerContractPreview',
               component: () => import('@/views/Owner/ContractPreview/index'),
               meta: { title: '业主合同预览', hidden: true }
             },
             {
               path: 'ContractPDFPreview',
               name: 'ContractPDFPreview',
               component: () =>
                 import('@/views/Owner/ContractPDFPreview/index'),
               meta: { title: '合同PDF查看', hidden: true }
             }
           ]
         },
         {
           path: '/',
           component: Layout,
           redirect: '/homePage',
           name: 'homePage',
           meta: {
             hidden: true
           },
           children: [
             {
               path: 'homePage',
               name: 'homePageIndex',
               hidden: true,
               component: () => import('@/views/homePage/index'),
               meta: { title: '首页', hidden: true }
             }
           ]
         },
         {
           path: '/Examine',
           component: Layout,
           redirect: '/Examine',
           name: 'Examine',
           meta: { title: '监察部', icon: 'icon-ic_jiandu-', menu: 2 },
           children: [
             {
               path: '',
               name: 'HomePageExamine',
               redirect: '/Examine/ContractLandlord',
               component: () => import('@/views/Examine/HomePage/index'),
               meta: { title: '监察部', hidden: true },
               children: [
                 {
                   path: 'ContractLandlord',
                   name: 'ContractLandlordList',
                   component: () =>
                     import('@/views/Examine/ContractLandlordList/index'),
                   meta: {
                     markTitle: '监察部',
                     title: '业主合同',
                     hidden: true,
                     routerKey: 'HomePageExamine',
                     rootKey: 'Examine'
                   }
                 },
                 {
                   path: 'TenantContract',
                   name: 'ContractTenantList',
                   component: () =>
                     import('@/views/Examine/ContractTenantList/index'),
                   meta: {
                     markTitle: '监察部',
                     title: '租客合同',
                     hidden: true,
                     routerKey: 'HomePageExamine',
                     rootKey: 'Examine'
                   }
                 },
                 {
                   path: 'HouseResources',
                   name: 'HouseResourcesList',
                   component: () =>
                     import('@/views/Examine/HouseResources/index'),
                   meta: {
                     markTitle: '监察部',
                     title: '房源',
                     hidden: true,
                     routerKey: 'HomePageExamine',
                     rootKey: 'Examine'
                   }
                 },
                 {
                   path: 'Finance',
                   name: 'FinanceList',
                   component: () => import('@/views/Examine/Finance/index'),
                   meta: {
                     markTitle: '监察部',
                     title: '财务',
                     hidden: true,
                     routerKey: 'HomePageExamine',
                     rootKey: 'Examine'
                   }
                 }
               ]
             }
           ]
         },
         {
           path: '/FixPurchase',
           component: Layout,
           redirect: '/FixPurchase/PurchaseDepartment',
           name: 'FixPurchaseList',
           meta: { title: '采购部', icon: 'icon-cloud-cloud1' },
           children: [
             {
               path: 'FixPaper',
               name: 'FixPaperList',
               component: () =>
                 import(
                   '@/views/FixPurchase/PurchaseDepartment/FixPaper/index'
                 ),
               meta: { title: '装修单', hasCache: true }
             },
             {
               path: 'PurchasePaper',
               name: 'PurchasePaperList',
               component: () =>
                 import(
                   '@/views/FixPurchase/PurchaseDepartment/PurchasePaper/index'
                 ),
               meta: { title: '采购单', hasCache: true }
             },
             {
               path: 'CleaningPaper',
               name: 'CleaningPaperList',
               component: () =>
                 import(
                   '@/views/FixPurchase/PurchaseDepartment/CleaningPaper/index'
                 ),
               meta: { title: '保洁单', hasCache: true }
             },
             {
               path: 'MoveingPaper',
               name: 'MoveingPaper',
               component: () =>
                 import(
                   '@/views/FixPurchase/PurchaseDepartment/MoveingPaper/index'
                 ),
               meta: { title: '搬家单', hasCache: true }
             },
             {
               path: 'CleaningPaperDetail',
               name: 'CleaningPaperDetailList',
               component: () =>
                 import(
                   '@/views/FixPurchase/PurchaseDepartment/CleaningPaper/CleaningPaperDetail'
                 ),
               meta: { title: '保洁详情', hasCache: true, hidden: true }
             },
             {
               path: 'FixPurchaseDepartment',
               name: 'FixPurchaseDepartmentList',
               component: () =>
                 import(
                   '@/views/FixPurchase/PurchaseDepartment/FixPurchaseDepartment/index'
                 ),
               meta: { title: '装修-采购部', hasCache: true }
             },
             {
               path: 'FixPurchaseDepartmentDetail',
               name: 'FixPurchaseDepartmentDetail',
               component: () =>
                 import(
                   '@/views/FixPurchase/PurchaseDepartment/FixPurchaseDepartment/detail'
                 ),
               meta: { title: '详情', hasCache: true, hidden: true }
             },
             {
               path: 'RepairBill',
               name: 'RepairBill',
               component: () => import('@/views/FixPurchase/RepairBill/index'),
               meta: { title: '维修单', hasCache: true }
             },
             {
               path: 'cleningDetail',
               name: 'cleningDetail',
               component: () =>
                 import('@/views/FixPurchase/RepairBill/cleningDetail'),
               meta: { title: '详情', hasCache: true, hidden: true }
             },
             {
               path: 'RepairBillDetail',
               name: 'RepairBillDetail',
               component: () =>
                 import('@/views/FixPurchase/RepairBill/details'),
               meta: { title: '详情', hasCache: true, hidden: true }
             },
             {
               path: 'StoreHouse',
               name: 'StoreHouseList',
               component: () =>
                 import(
                   '@/views/FixPurchase/PurchaseDepartment/StoreHouse/index'
                 ),
               meta: { title: '库房', hasCache: true }
             },
             {
               path: 'FixApplyConfig',
               name: 'FixApplyConfigList',
               component: () =>
                 import(
                   '@/views/FixPurchase/PurchaseDepartment/FixApplyConfig/index'
                 ),
               meta: { title: '装修申请项目配置', hasCache: true }
             },
             {
               path: 'SupplyConfig',
               name: 'SupplyConfigList',
               component: () =>
                 import(
                   '@/views/FixPurchase/PurchaseDepartment/SupplyConfig/index'
                 ),
               meta: { title: '供货商及装修部门配置', hasCache: true }
             },
             {
               path: 'PurchaseApproval',
               name: 'PurchaseApproval',
               component: () =>
                 import('@/views/FixPurchase/PurchaseApproval/index'),
               meta: { title: '采购部审批', hasCache: true }
             }
           ]
         },
         {
           path: '/Tenant',
           component: Layout,
           redirect: '/Tenant/OrderList',
           name: 'Tenant',
           meta: { title: '租客', icon: 'icon-zuke' },
           children: [
             {
               path: 'AddContract',
               name: 'TenantAddContract',
               component: () => import('@/views/Tenant/EditContract/add'),
               meta: {
                 title: '新增合同',
                 markTitle: '新增租客合同',
                 hasCache: true
               }
             },
             {
               path: 'EditContract',
               name: 'TenantEditContract',
               component: () => import('@/views/Tenant/EditContract/edit'),
               meta: {
                 title: '修改合同',
                 markTitle: '修改租客合同',
                 hasCache: true,
                 hidden: true
               }
             },
             {
               path: 'ContractList',
               name: 'TenantContractList',
               component: () => import('@/views/Tenant/ContractList/index'),
               meta: {
                 title: '合同列表',
                 hasCache: true,
                 markTitle: '租客合同列表'
               }
             },
             {
               path: 'ContractDetail',
               name: 'TenantContractDetail',
               component: () => import('@/views/Tenant/ContractDetail/index'),
               meta: {
                 title: '租客合同详情',
                 hasCache: true,
                 hidden: true
               }
             },
             {
               path: 'CheckoutBill',
               name: 'TenantCheckoutBill',
               component: () =>
                 import('@/views/Tenant/ContractList/CheckoutBill/index'),
               meta: {
                 title: '退房收款清单',
                 hasCache: true,
                 hidden: true
               }
             },
             {
               path: 'ContractSign',
               name: 'TenantContractSign',
               component: () => import('@/views/Owner/ContractSign/index_old'),
               meta: { title: '租客合同签字', hidden: true }
             },
             {
               path: 'ContractPreview',
               name: 'TenantContractPreview',
               component: () => import('@/views/Owner/ContractPreview/index'),
               meta: { title: '租客合同预览', hidden: true }
             },
             {
               path: 'OrderList',
               name: 'OrderList',
               component: () => import('@/views/Tenant/OrderList/index'),
               meta: { title: '预定单', hasCache: true }
             },
             {
               path: 'ReserveList',
               name: 'ReserveList',
               component: () => import('@/views/Tenant/ReserveList/index'),
               meta: { title: '预约单', hasCache: true }
             }
           ]
         },
         {
           path: '/Finance',
           component: Layout,
           redirect: '/Finance/PaymentBill',
           name: 'Finance',
           meta: { title: '财务', icon: 'icon-caiwu' },
           children: [
             {
               path: 'PaymentBill',
               name: 'PaymentBill',
               component: () => import('@/views/Finance/PaymentBill/index'),
               meta: { title: '收付款单', hasCache: true }
             },
             // {
             //   path: 'ReceiptBill',
             //   name: 'ReceiptBill',
             //   component: () =>
             //     import('@/views/Finance/ReceiptBill/index'),
             //   meta: { title: '收款单', hasCache: true }
             // },
             {
               path: 'BookKeeping',
               name: 'BookKeeping',
               component: () => import('@/views/Finance/BookKeeping/index'),
               meta: { title: '记账本', hasCache: true }
             },
            {
              path: 'ReturnDeposit',
              name: 'ReturnDeposit',
              component: () => import('@/views/Finance/ReturnDeposit/index'),
              meta: { title: '退押金', hasCache: true }
            },
             {
               path: 'FinancialCancel',
               name: 'FinancialCancel',
               component: () =>
                 import('@/views/Finance/FinancialVerification/index'),
               meta: { title: '财务核销', hasCache: true }
             },
             // {
             //   path: 'AccountsPayable',
             //   name: 'AccountsPayable',
             //   component: () =>
             //     import('@/views/Finance/AccountsPayable/index'),
             //   meta: { title: '应付账单', hasCache: true }
             // },
             // {
             //   path: 'AccountsReceivesAble',
             //   name: 'AccountsReceivesAble',
             //   component: () =>
             //     import('@/views/Finance/AccountsReceivesAble/index'),
             //   meta: { title: '应收账单', hasCache: true }
             // },
             {
               path: 'AccountManage',
               name: 'AccountManage',
               component: () => import('@/views/Finance/AccountManage/index'),
               meta: { title: '账户管理', hasCache: true }
             },
             {
               path: 'AccountDetail',
               name: 'AccountDetail',
               component: () =>
                 import('@/views/Finance/AccountManage/pages/AccountDetail'),
               meta: { title: '账户明细', hidden: true }
             },
             {
               path: 'FinancialConfig',
               name: 'FinancialConfig',
               component: () => import('@/views/Finance/FinancialConfig/index'),
               meta: { title: '财务配置', hasCache: true }
             },
             {
               path: 'FinanceTax',
               name: 'FinanceTax',
               component: () => import('@/views/Finance/FinanceTax/index'),
               meta: { title: '财务税收', hasCache: true }
             }
           ]
         },
         {
           path: '/Admin',
           component: Layout,
           redirect: '/Admin/CompanyInfo',
           name: 'Admin',
           meta: { title: '平台', icon: 'icon-pingtai' },
           children: [
             {
               path: 'CompanyInfo',
               name: 'CompanyInfo',
               component: () => import('@/views/Admin/CompanyInfo/index'),
               meta: { title: '企业管理', hasCache: true }
             },
             {
               path: 'AddCompany',
               name: 'AddCompany',
               component: () => import('@/views/Admin/AddCompany/index'),
               meta: { title: '新增企业', hidden: true, hasCache: true }
             },
             {
               path: 'EditCompany',
               name: 'EditCompany',
               component: () => import('@/views/Admin/AddCompany/index'),
               meta: { title: '编辑企业', hidden: true }
             },
             {
               path: 'ViewCompany',
               name: 'ViewCompany',
               component: () => import('@/views/Admin/AddCompany/index'),
               meta: { title: '查看详情', hidden: true }
             }
           ]
         },
         {
           path: '/UserCenter',
           component: Layout,
           redirect: '/UserCenter/OperationLog',
           name: 'UserCenter',
           meta: { title: '用户中心', icon: 'example', hidden: true },
           children: [
             {
               path: 'UserInfo',
               name: 'UserInfo',
               component: () => import('@/views/UserCenter/UserInfo/index'),
               meta: { title: '个人中心', icon: 'example', hidden: true }
             },
             {
               path: 'HouseCollection',
               name: 'HouseCollection',
               component: () => import('@/views/House/HouseCollection/index'),
               meta: {
                 title: '我的收藏',
                 icon: 'example',
                 hidden: true,
                 hasCache: true
               }
             },
             {
               path: 'OperationLog',
               name: 'OperationLog',
               component: () => import('@/views/UserCenter/OperationLog/index'),
               meta: {
                 title: '操作日志',
                 icon: 'example',
                 hidden: true,
                 hasCache: true
               }
             },
             {
               path: 'MsgCenter',
               name: 'MsgCenter',
               component: () => import('@/views/UserCenter/MsgCenter/index'),
               meta: { title: '消息中心', hidden: true }
             }
           ]
         },
         {
           path: '/Service',
           component: Layout,
           redirect: '/Service/RepairList',
           name: 'Service',
           meta: { title: '服务', icon: 'icon-fuwu' },
           children: [
             {
               path: 'RepairList',
               name: 'RepairList',
               component: () => import('@/views/Service/RepairList/index'),
               meta: { title: '报修', hasCache: true }
             },
             {
               path: 'RepairApplyList',
               name: 'RepairApplyList',
               component: () =>
                 import('@/views/Service/RepairApply/RepairApplyList/index'),
               meta: { title: '维修申请' }
             },
             {
               path: 'CleanApplyList',
               name: 'CleanApplyList',
               component: () =>
                 import('@/views/Service/CleanApply/CleanApplyList/index'),
               meta: { title: '保洁申请' }
             },
             {
               path: 'WaterAndelectricityReading',
               name: 'WaterAndelectricityReading',
               component: () =>
                 import('@/views/Service/WaterAndelectricityReading/index'),
               meta: { title: '水电气抄表', hasCache: true }
             },
             {
               path: 'MeterReadingConfiguration',
               name: 'MeterReadingConfiguration',
               component: () =>
                 import('@/views/Service/MeterReadingConfiguration/index'),
               meta: { title: '抄表配置', hasCache: true }
             },
             {
               path: 'MoveApply',
               name: 'MoveApply',
               component: () =>
                 import('@/views/Service/MoveApply/MoveApplyList/index'),
               meta: { title: '搬家申请' }
             },
             {
               path: 'MoveApplydetail',
               name: 'MoveApplydetail',
               component: () =>
                 import('@/views/Service/MoveApply/MoveApplydetail'),
               meta: { title: '搬家详情', hasCache: true, hidden: true }
             }
           ]
         },
         {
           path: '/Calculate',
           component: Layout,
           redirect: '/Calculate/CalculateInfo',
           name: 'Calculate',
           meta: { title: '测算', icon: 'icon-cesuan' },
           children: [
             {
               path: 'CalculateInfo',
               name: 'CalculateInfo',
               component: () => import('@/views/Calculate/CalculateInfo/index'),
               meta: { title: '业绩测算', hasCache: true }
             },
             {
               path: 'CalculateEmpty',
               name: 'CalculateEmpty',
               component: () =>
                 import('@/views/Calculate/CalculateEmpty/index'),
               meta: { title: '空置业绩', hasCache: true }
             },
             {
               path: 'CalculateConfig',
               name: 'CalculateConfig',
               component: () =>
                 import('@/views/Calculate/CalculateConfig/index'),
               meta: { title: '测算配置' }
             },
             {
               path: 'Calculation',
               name: 'Calculation',
               component: () => import('@/views/Calculate/Calculation/index'),
               meta: { title: '预算', hidden: true }
             },
             {
               path: 'AccountingPage',
               name: 'AccountingPage',
               component: () =>
                 import('@/views/Calculate/AccountingPage/index'),
               meta: { title: '核算', hidden: true }
             },
             {
               path: 'PriceConfig',
               name: 'PriceConfig',
               component: () => import('@/views/Calculate/PriceConfig/index'),
               meta: { title: '测算价格配置' }
             },
             {
               path: 'ViewPerformance',
               name: 'ViewPerformance',
               component: () =>
                 import('@/views/Calculate/ViewPerformance/index'),
               meta: { title: '业绩查看', icon: 'example', hidden: true }
             }
           ]
         },
         {
           path: '/Approval',
           component: Layout,
           redirect: '/Approval/ApprovalManagement',
           name: 'Approval',
           meta: { title: '审批', icon: 'icon-shenpi' },
           children: [
             {
               path: 'MyApproval',
               name: 'MyApproval',
               component: () => import('@/views/approval/MyApproval'),
               meta: { title: '我的审批', hasCache: true }
             },
             {
               path: 'ApprovalConfig',
               name: 'ApprovalConfig',
               component: () => import('@/views/approval/ApprovalConfig/index'),
               meta: { title: '审批配置' }
             },
             {
               path: 'FixApproval',
               name: 'FixApproval',
               component: () =>
                 import('@/views/approval/PurchaseApproval/FixApproval'),
               meta: { title: '装修审批' }
             },
             {
               path: 'RepairApproval',
               name: 'RepairApproval',
               component: () =>
                 import('@/views/approval/PurchaseApproval/RepairApproval'),
               meta: { title: '维修审批' }
             },
             {
               path: 'CleaningApproval',
               name: 'CleaningApproval',
               component: () =>
                 import('@/views/approval/PurchaseApproval/CleaningApproval'),
               meta: { title: '保洁审批' }
             },
             {
               path: 'MovingApproval',
               name: 'MovingApproval',
               component: () =>
                 import('@/views/approval/PurchaseApproval/MovingApproval'),
               meta: { title: '搬家审批' }
             }
           ]
         },
         {
           path: '/System',
           component: Layout,
           redirect: '/System/RoleManage',
           name: 'System',
           meta: { title: '系统', icon: 'icon-xitong' },
           children: [
             {
               path: 'RoleManage',
               name: 'RoleManage',
               component: () => import('@/views/System/RoleManage/index'),
               meta: { title: '角色管理', hasCache: true }
             },
             {
               path: 'DepartmentManage',
               name: 'DepartmentManage',
               component: () => import('@/views/System/DepartmentManage/index'),
               meta: { title: '部门管理', hasCache: true }
             },
             {
               path: 'CompanyManage',
               name: 'CompanyManage',
               component: () => import('@/views/System/CompanyManage/index'),
               meta: { title: '公司管理', hasCache: true }
             },
             {
               path: 'StaffManage',
               name: 'StaffManage',
               component: () => import('@/views/System/StaffManage/index'),
               meta: { title: '员工管理' }
             },
             {
               path: 'AddCompanyInfo',
               name: 'AddCompanyInfo',
               component: () => import('@/views/System/AddCompany/index'),
               meta: { title: '新增公司', hidden: true }
             },
             {
               path: 'EditCompanyInfo',
               name: 'EditCompanyInfo',
               component: () => import('@/views/System/AddCompany/index'),
               meta: { title: '修改公司信息', hidden: true }
             },
             {
               path: 'FinancialStaffing',
               name: 'FinancialStaffing',
               component: () =>
                 import('@/views/System/FinancialStaffing/index'),
               meta: { title: '直属部门人员配置' }
             },
             {
               path: 'OrganizationConfig',
               name: 'OrganizationConfig',
               component: () =>
                 import('@/views/System/OrganizationConfig/index'),
               meta: { title: '组织配置' }
             }
           ]
         },
         // 报表
         {
           path: '/Report',
           component: Layout,
           redirect: '/Report/HuiStaging',
           name: 'Report',
           meta: { title: '报表', icon: 'icon-cesuan', menu: 1 },
           children: [
             {
               path: 'Finance',
               name: 'ReportFinance',
               component: reportLayout,
               meta: { title: '财务' },
               children: [
                 {
                   path: 'CustomerCollection',
                   name: 'CustomerCollection',
                   component: () =>
                     import('@/views/Report/CustomerCollection/index'),
                   meta: { title: '客户收款', hasCache: true }
                 },
                 {
                   path: 'Expiration',
                   name: 'Expiration',
                   component: () => import('@/views/Report/Expiration/index'),
                   meta: { title: '客户到期', hasCache: true }
                 },
                 {
                   path: 'FinancialSubject',
                   name: 'FinancialSubject',
                   component: () =>
                     import('@/views/Report/FinancialSubject/index'),
                   meta: { title: '财务科目', hasCache: true }
                 },
                 {
                   path: 'ExpendReports',
                   name: 'ExpendReports',
                   component: () =>
                     import('@/views/Report/ExpendReports/index'),
                   meta: { title: '支出报表', hasCache: true }
                 },
                 {
                   path: 'IncomeReports',
                   name: 'IncomeReports',
                   component: () =>
                     import('@/views/Report/IncomeReports/index'),
                   meta: { title: '收入报表', hasCache: true }
                 },
                 {
                   path: 'OwnerExpires',
                   name: 'OwnerExpires',
                   component: () => import('@/views/Report/OwnerExpires/index'),
                   meta: { title: '房东到期', hasCache: true }
                 },
                 {
                   path: 'OwnerPayment',
                   name: 'OwnerPayment',
                   component: () => import('@/views/Report/OwnerPayment/index'),
                   meta: { title: '房东付款', hasCache: true }
                 },
                 {
                   path: 'MeasureReports',
                   name: 'MeasureReports',
                   component: () =>
                     import('@/views/Report/MeasureReports/index'),
                   meta: { title: '测算报表', hasCache: true }
                 },
                 {
                   path: 'CashFlow',
                   name: 'CashFlow',
                   component: () => import('@/views/Report/CashFlow/index'),
                   meta: { title: '现金流水', hasCache: true }
                 },
                 {
                   path: 'RentCollectionOverdue',
                   name: 'RentCollectionOverdue',
                   component: () =>
                     import('@/views/Report/RentCollectionOverdue/index'),
                   meta: { title: '收租逾期', hasCache: true }
                 },
                 {
                   path: 'HuiStaging',
                   name: 'HuiStaging',
                   component: () => import('@/views/Report/HuiStaging/index'),
                   meta: { title: '金融分期', hasCache: true }
                 }
               ]
             },
             {
               path: 'Business',
               name: 'BusFinance',
               component: reportLayout,
               meta: { title: '业务' },
               children: [
                 {
                   path: 'EarningReports',
                   name: 'EarningReports',
                   component: () =>
                     import('@/views/Report/EarningReports/index'),
                   meta: { title: '业绩报表', hasCache: true }
                 },
                 {
                   path: 'BreakOwnerContract',
                   name: 'BreakOwnerContract',
                   component: () =>
                     import('@/views/Report/BreakOwnerContract/index'),
                   meta: { title: '业主违约', hasCache: true }
                 },
                 {
                   path: 'BreakTenantContract',
                   name: 'BreakTenantContract',
                   component: () =>
                     import('@/views/Report/BreakTenantContract/index'),
                   meta: { title: '租客违约', hasCache: true }
                 },
                 {
                   path: 'VacantReport',
                   name: 'VacantReport',
                   component: () => import('@/views/Report/VacantReport/index'),
                   meta: { title: '空置报表', hasCache: true }
                 },
                 {
                   path: 'OtherReports',
                   name: 'OtherReports',
                   component: () => import('@/views/Report/OtherReports/index'),
                   meta: { title: '其他', hasCache: true }
                 },
                 {
                   path: 'TakeHouseReports',
                   name: 'TakeHouseReports',
                   component: () =>
                     import('@/views/Report/TakeHouseReports/index'),
                   meta: { title: '拿房报表', hasCache: true }
                 },
                 {
                   path: 'RepairReports',
                   name: 'RepairReports',
                   component: () =>
                     import('@/views/Report/RepairReports/index'),
                   meta: { title: '装修报表', hasCache: true }
                 }
               ]
             },
             {
               path: 'Other',
               name: 'OtherFinance',
               component: reportLayout,
               meta: { title: '其他' },
               children: [
                 {
                   path: 'GetGuestCollection',
                   name: 'GetGuestCollection',
                   component: () =>
                     import('@/views/Report/GetGuestCollection/index'),
                   meta: { title: '拿房获客统计', hasCache: true }
                 },
                 {
                   path: 'OutGuestCollection',
                   name: 'OutGuestCollection',
                   component: () =>
                     import('@/views/Report/OutGuestCollection/index'),
                   meta: { title: '出房获客统计', hasCache: true }
                 }
               ]
             }
           ]
         },
         {
           path: '/Resource',
           component: Layout,
           redirect: '/Resource/R_Owner',
           name: 'Resource',
           meta: { title: '资源', icon: 'icon-cloud-cloud1' },
           children: [
             {
               path: 'R_Owner',
               name: 'R_Owner',
               component: () => import('@/views/Resource/R_Owner/index'),
               meta: { title: '业主', hasCache: true }
             },
             {
               path: 'R_Tenant',
               name: 'R_Tenant',
               component: () => import('@/views/Resource/R_Tenant/index'),
               meta: { title: '租客', hasCache: true }
             }
           ]
         },
         {
           path: '*',
           redirect: '/404',
           meta: { hidden: true }
         }
       ]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  // routes: filterRouter(constantRouterMap)
  routes: constantRouterMap
})
