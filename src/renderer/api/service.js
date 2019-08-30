import request from '@/utils/request'

export function getRepairTableList(data = {}) {
  return request({
    url: '/TenantBusiness/MRepairInfo/ShowMRepairInfo',
    method: 'post',
    data
  })
}

export function addRepairTableList(data = {}) {
  return request({
    url: '/TenantBusiness/MRepairInfo/AddMRepairInfo',
    method: 'post',
    data
  })
}

export function repairComplete(data = {}) {
  return request({
    url: '/Service/RepairList/RepairComplete',
    method: 'post',
    data
  })
}

export function editRepairItem(data = {}) {
  return request({
    url: '/TenantBusiness/MRepairInfo/EditMRepairInfo',
    method: 'post',
    data
  })
}

export function repairRevoke(data = {}) {
  return request({
    url: '/Service/Repair/Revoke',
    method: 'post',
    data
  })
}

// -----------水电气抄表接口-------------
// 获取水电气抄表小区数据
export function Getareadatas(data) {
    return request({
        url: '/TenantBusiness/UtilityHistory/SelectCommunityList',
        method: 'post',
        data
    })
}

// 获取小区后面(栋,单元,门牌号)的数据
export function GetAllUnitDatas(data) {
    return request({
        url: '/TenantBusiness/UtilityHistory/SelectByCommunityID',
        method: 'post',
        data
    })
}

// 获取水电气列表的数据
export function GetAllTableDatas(data) {
    return request({
        url: '/TenantBusiness/UtilityHistory/SelectHistoryByPage',
        method: 'post',
        data
    })
}

// 新增一条抄表数据
export function GetNewTableDatas(data) {
    return request({
        url: '/TenantBusiness/UtilityHistory/InsertUtilityInfo',
        method: 'post',
        data
    })
}

// 获取所有小区
export function SelectCommunityList(data) {
    return request({
        url: 'UtilityHistory/SelectCommunityList',
        method: 'post',
        data
    })
}
// 根据小区ID查询水电气单价
export function SearchPriceByComuID(data) {
    return request({
        url: 'UtilityHistory/SelectPriceByComuID',
        method: 'post',
        data
    })
}

// 保存水电气配置单价
export function InsertMeterPriceInfo(data) {
    return request({
        url: 'UtilityHistory/InsertMeterPriceInfo',
        method: 'post',
        data
    })
}
// 水电气抄表详情
export function LookMeterDetail(data) {
  return request({
    url: 'UtilityHistory/SelectUtilityDetail',
    method: 'post',
    data
  })
}
