import request from '@/utils/request'

export function GetTenantList(data) {
    return request({
        url: '/BillManage/tenatBill',
        method: 'post',
        data
    })
}

// -----------财务模块(应收账单)------
// 获取应收账单列表数据
export function GetReceivesAbleList(data) {
    return request({
        url: '/Finance/QueryReceivablePage',
        method: 'post',
        data
    })
}

// 获取收款单列表数据
export function GetReceiveList(data) {
  return request({
    url: '/Finance/QueryReceiptPage',
    method: 'post',
    data
  })
}

// 修改过后的查询新的收款单列表的数据(新)
export function GetReceiveListNew(data) {
  return request({
    url: '/System/FinanceNew/QueryReceiptNew',
    method: 'post',
    data
  })
}

// 添加收款单（新）
export function AddReceiveSingleNew(data) {
  return request({
    url: '/System/FinanceNew/AddReceiptNew',
    method: 'post',
    data
  })
}
// 修改收款单接口（新）
export function EditReceiveSingleNew(data) {
  return request({
    url: '/System/FinanceNew/AddReceiptNew', // to do 需要修改
    method: 'post',
    data
  })
}

// 获取收款单详情的接口(新)
export function GetReceiptDetailsNew(data) {
  return request({
    url: '/System/FinanceNew/QueryReceiptNewSinge',
    method: 'post',
    data
  })
}

// 添加收款单接口
export function AddReceiveSingle(data) {
  return request({
    url: '/Finance/AddReceipt',
    method: 'post',
    data
  })
}

// 修改付款单接口
export function EditReceiveSingle(data) {
  return request({
    url: '/Finance/AddReceipt', // to do 需要修改
    method: 'post',
    data
  })
}
// 删除付款单接口
export function DeleteReceiveSingle(data) {
  return request({
    url: '/Finance/DeleteReceipt',
    method: 'post',
    data
  })
}

// 收款单点击修改获取表格对象,和表单对象的接口
export function GetReceiptTable(data) {
  return request({
    url: '/Finance/FindReceiptByID',
    method: 'post',
    data
  })
}

// 打印房屋押金收款凭条
export function GetHousingDeposit(data) {
  return request({
    url: 'Finance/QueryHouseInfobyReceivableOrPayable',
    method: 'post',
    data
  })
}

