import request from '@/utils/request'

// 查询核销单
export function GetVerificationList(data) {
  return request({
    url: '/Finance/QueryVerificationPage',
    method: 'post',
    data
  })
}
// 查询用户账户
export function GetCustomerList(data) {
  return request({
    url: 'Finance/QueryCustomerList',
    method: 'post',
    data
  })
}
// 查询应收
export function GetReceivableList(data) {
  return request({
    url: 'Finance/QueryReceivablePage',
    method: 'post',
    data
  })
}
// 查询应付
export function GetPayableList(data) {
  return request({
    url: 'Finance/QueryPayablePape',
    method: 'post',
    data
  })
}

// 查询付款单
export function GetPaymentList(data) {
  return request({
    url: 'Finance/QueryPaymentPage',
    method: 'post',
    data
  })
}

// 查询收款单
export function GetReceiptList(data) {
  return request({
    url: 'Finance/QueryReceiptPage',
    method: 'post',
    data
  })
}

// 查询核销单详细
export function GetVerificationDetailed(data) {
  return request({
    url: 'Finance/QueryVerificationById',
    method: 'post',
    data
  })
}
// 新增核销单或修改核销单
export function InsertWriteOff(data) {
  return request({
    url: 'Finance/WriteOff',
    method: 'post',
    data
  })
}
// 删除核销单
export function DeleteVerification(data) {
  return request({
    url: 'Finance/DeleteVerification',
    method: 'post',
    data
  })
}

// 获取记账本列表数据
export function getBookKeepingList(data) {
  return request({
    url: '/Finance/QueryBookKeepPage',
    method: 'post',
    data
  })
}

// 获取单条记账本数据
export function getBookKeepByID(data) {
  return request({
    url: '/Finance/QueryBookKeepByID',
    method: 'post',
    data
  })
}

// 新增记账
export function insertBookKeep(data) {
  return request({
    url: '/Finance/InsertBookKeep',
    method: 'post',
    data
  })
}

// 修改记账
export function editBookKeep(data) {
  return request({
    url: '/Finance/EditBookKeep',
    method: 'post',
    data
  })
}

// 删除记账
export function deleteBookKeepByIDs(data) {
  return request({
    url: '/Finance/DeleteBookKeepByIDs',
    method: 'post',
    data
  })
}

// 分页查询账户
export function QueryAccountInfoPage(data) {
  return request({
    url: '/VirtualCapital/QueryAccountInfoPage',
    method: 'post',
    data
  })
}

// 新增账户
export function InsertAccountInfo(data) {
  return request({
    url: '/VirtualCapital/InsertAccountInfo',
    method: 'post',
    data
  })
}

// 修改账户
export function UpdateAccountInfo(data) {
  return request({
    url: '/VirtualCapital/UpdateAccountInfo',
    method: 'post',
    data
  })
}

// 账户管理-查询分店
export function QueryAccountInfoCompanyList(data) {
  return request({
    url: '/VirtualCapital/QueryAccountInfoCompanyList',
    method: 'post',
    data
  })
}

// 查询财务税收列表
export function QueryFinanceTax(data) {
  return request({
    url: '/Finance/QueryTaxrevenueInfoList',
    method: 'post',
    data
  })
}
// 查询财务税收合计
export function QueryTaxrevenueInfoSubtotal(data) {
  return request({
    url: '/Finance/QueryTaxrevenueInfoSubtotal',
    method: 'post',
    data
  })
}
// 查询账户明细列表
export function QueryTransactionDetailsByPage(data) {
  return request({
    url: '/VirtualCapital/QueryTransactionDetailsByPage',
    method: 'post',
    data
  })
}
// 查询账户明细合计
export function GetCountTransaction(data) {
  return request({
    url: '/VirtualCapital/GetCountTransaction',
    method: 'post',
    data
  })
}
// 查询账户明细导出
export function QueryTransactionDetails(data) {
  return request({
    url: '/VirtualCapital/QueryTransactionDetails',
    method: 'post',
    data
  })
}
// 删除收款单
export function DeletePaymentNew(data) {
  return request({
    url: '/System/FinanceNew/DeletePaymentNew',
    method: 'post',
    data
  })
}
// 删除付款单
export function DeleteReceiptNew(data) {
  return request({
    url: '/System/FinanceNew/DeleteReceiptNew',
    method: 'post',
    data
  })
}
// 租客核销账单
export function UpdateTenIsActual(data) {
  return request({
    url: '/SystemMethod/UpdateTenIsActual',
    method: 'post',
    data
  })
}
// 付款单部分支付
export function PartPayOwner(data) {
  return request({
    url: '/System/FinanceNew/PartPayOwner',
    method: 'post',
    data
  })
}
// 应收应付头部合计
export function QueryPayableOrReceivableHome(data) {
  return request({
    url: '/Finance/QueryPayableOrReceivableHome',
    method: 'post',
    data
  })
}
// 生成付款单
export function AddPaymentNew(data) {
  return request({
    url: '/SystemMethod/AddPaymentNew',
    method: 'post',
    data
  })
}
// 付款单详情
export function ShowReimbursementDetails(data) {
  return request({
    url: '/SystemMethod/ShowReimbursementDetails',
    method: 'post',
    data
  })
}
// 报销单审核
export function ExamineReimbursement(data) {
  return request({
    url: '/SystemMethod/ExamineReimbursement',
    method: 'post',
    data
  })
}
// 合同调账 列表
export function QueryBillAdjustList(data) {
  return request({
    url: '/OwnerContract/OwnerContract/QueryBillAdjustList',
    method: 'post',
    data
  })
}

// 合同调账 查询
export function QueryBillAdjustCInfo(data) {
  return request({
    url: '/OwnerContract/OwnerContract/QueryBillAdjustCInfo',
    method: 'post',
    data
  })
}

// 合同调账 保存
export function AdjustAccount(data) {
  return request({
    url: '/OwnerContract/OwnerContract/AdjustAccount',
    method: 'post',
    data
  })
}
