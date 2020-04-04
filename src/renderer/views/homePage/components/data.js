// routerName: 路由名字
// name： 后台返回来对应的key

const meunShow = [
    {
        title: '今日待收租',
        name: 'TodayProduce',
        routerName: 'AccountsPayable'
    },
    {
        title: '逾期收租',
        name: 'OverdueRent',
        routerName: 'AccountsPayable'
    },
    {
        title: '待审核',
        name: 'checking',
        routerName: ''
    },
    {
        title: '已驳回审核',
        name: 'rejectChecked',
        routerName: ''
    },
    {
        title: '预约单',
        name: 'reservationList',
        routerName: 'ReserveList'
    },
    {
        title: '预定快到期',
        name: 'reservationExpire',
        routerName: 'ReserveList'
    },
    {
        title: '临期租客',
        name: 'adventTenants',
        routerName: 'TenantContractList'
    },
    {
        title: '临期房源',
        name: 'adventHousing',
        routerName: 'TenantContractList'
    },
    {
        title: '待上架房源',
        name: 'PendingListing',
        routerName: 'HouseList'
    },
    {
        title: '维修申请',
        name: 'RepairApplyList',
        routerName: 'RepairApplyList'
    },
    {
        title: '保洁申请',
        name: 'CleanApplyList',
        routerName: 'CleanApplyList'
    },
    {
        title: '搬家申请',
        name: 'MoveApply',
        routerName: 'MoveApply'
    },
    {
        title: '租客退房申请',
        name: 'tenantCheckOutApply',
        // 审批 租客结账  15
        routerName: 'MyApproval'
    }
]

export default meunShow
