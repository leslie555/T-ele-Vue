import request from '@/utils/request'

// --------------租客合同----------------

// 获取租客合同列表
export function getContractList(data) {
  return request({
    url: '/TenantContract/FindTenantContractListPage',
    method: 'post',
    data
  })
}

// 预览合同详情
export function findTenantPreviewById(data) {
  return request({
    url: '/TenantContract/FindTenantPreviewById',
    method: 'post',
    data
  })
}
// 获取合同详情
export function getContractDetail(data) {
  return request({
    url: '/TenantContract/ShowTenantContractInfoByTenantID',
    method: 'post',
    data
  })
}
// 创建账单
export function getTenantBill(data) {
  return request({
    url: '/CalculationMethod/GetTenantBill',
    method: 'post',
    data
  })
}

// 创建账单
export function getTenantBillNew(data) {
  return request({
    url: '/CalculationMethod/GetNewTenantBill',
    method: 'post',
    data
  })
}
// 新增合同
export function insertTenantContract(data) {
  return request({
    url: '/TenantContract/InsertTenantContract',
    method: 'post',
    data
  })
}

// 修改合同
export function editTenantContract(data) {
  return request({
    url: '/TenantContract/EditTenantContract',
    method: 'post',
    data
  })
}

// 安全修改合同
export function safeEditTenantContract(data) {
  return request({
    url: '/TenantBusiness/TenantContract/EditTenantSomething',
    method: 'post',
    data
  })
}

// 租客退房
export function tenantCheckOut(data) {
  return request({
    url: '/TenantContract/TenantCheckOut',
    method: 'post',
    data
  })
}

// 租客修改退房
export function tenantEditCheckOut(data) {
  return request({
    url: '/TenantContract/EditTenantCheckOut',
    method: 'post',
    data
  })
}

// 业主合同删除
export function deleteTenantContractByIDs(data) {
  return request({
    url: '/TenantContract/DeleteTenantContractByIDs',
    method: 'post',
    data
  })
}
// 租客签字
export function tenantSign(data) {
  return request({
    url: '/TenantContract/TenantSign',
    method: 'post',
    data
  })
}

// 租客撤回
export function tenantWithDrawByID(data) {
  return request({
    url: '/TenantContract/WithDrawByID',
    method: 'post',
    data
  })
}

// 预览合同
export function previewTenantContract(data) {
  return request({
    url: '/TenantContract/PreviewTenantContract',
    method: 'post',
    data
  })
}

// 租客合同提交审核 用于手机端的合同
export function tenantSubmitAudit(data) {
  return request({
    url: '/TenantContract/TenantSubmitaudit',
    method: 'post',
    data
  })
}

// --------------预约单模块--------------
// --获取预约列表----
export function GetReserveList(data) {
    return request({
        url: '/AppointmentInfo/FindAppointListPage',
        method: 'post',
        data
    })
}

// 已看房模拟接口
export function SeeHouse(data) {
    return request({
        url: '/AppointmentInfo/UpdateAppontById',
        method: 'post',
        data
    })
}

// 删除接口
export function deleteHouse(data) {
    return request({
        url: '/AppointmentInfo/DelAppointmentInfo',
        method: 'post',
        data
    })
}

// -------------预订模块--------------
// 获取预订单列表
// 获取预定列表
export function GetOderList(data) {
  return request({
    url: '/OperateMethod/SelectOrderInfoByPage',
    method: 'post',
    data
  })
}

// 取消预定
export function CancelOrderInfo(data) {
  return request({
    url: '/OperateMethod/CancelOrderInfo',
    method: 'post',
    data
  })
}

// 预订单删除接口
export function DeleteOrder(data) {
    return request({
        url: '/TenantBusiness/OrderInfo/DeleteOrderInfoByID',
        method: 'post',
        data
    })
}

// 预订单修改接口
export function EditOderList(data) {
    return request({
        url: '/TenantBusiness/OrderInfo/UpdateOrderInfo',
        method: 'post',
        data
    })
}

// 预订单修改取消预订接口
export function WithdrawOrder(data) {
    return request({
        url: '/TenantBusiness/OrderInfo/CancelOrderInfo',
        method: 'post',
        data
    })
}

// 查询房源合同状态
export function QueryHouseContractStatus(data) {
    return request({
        url: '/TenantContract/QueryHouseIsHaveTenantContract',
        method: 'post',
        data
    })
}

