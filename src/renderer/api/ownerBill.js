import request from '@/utils/request'

export function GetOwnerList(data) {
    return request({
        url: '/BillManage/ownerBill',
        method: 'post',
        data
    })
}

// 财务配置分页查询
export function QueryBillItemPage(data) {
    return request({
        url: '/SystemMethod/QueryBillItemPage',
        method: 'post',
        data
    })
}

// 查询树形财务栏目
export function QueryBillItem(data) {
    return request({
        url: '/SystemMethod/QueryBillItem',
        method: 'post',
        data
    })
}

// 新增财务配置
export function AddBillItem(data) {
    return request({
        url: '/SystemMethod/AddBillItem',
        method: 'post',
        data
    })
}

// 批量删除财务配置/栏目
export function DeleteBillItem(data) {
    return request({
        url: '/SystemMethod/DeleteBillItem',
        method: 'post',
        data
    })
}

// -----------财务模块(应付账单)------
// 获取应付账单列表数据
export function GetPayAbleList(data) {
    return request({
        url: '/Finance/QueryPayablePape',
        method: 'post',
        data
    })
}

// 获取付款单列表数据
export function GetPaymentList(data) {
  return request({
    url: '/Finance/QueryPaymentPage',
    method: 'post',
    data
  })
}

// 修改过后的查询新的付款单列表的数据(新)
export function GetPaymentListNew(data) {
  return request({
    url: '/System/FinanceNew/QueryPaymentNew',
    method: 'post',
    data
  })
}

// 添加付款单的接口（新）
export function AddPaymentSingleNew(data) {
  return request({
    url: '/System/FinanceNew/AddPaymentNew',
    method: 'post',
    data
  })
}
// 根据搜索的房源拉取账单列表数据（新）
export function GetBillListData(data) {
  return request({
    url: '/System/FinanceNew/QueryHouseBillList',
    method: 'post',
    data
  })
}

// 修改付款单接口(新)
export function EditPaymentSingleNew(data) {
  return request({
    url: '/System/FinanceNew/AddPaymentNew',
    method: 'post',
    data
  })
}

// 获取付款单详情的接口(新)
export function GetPaymentDetailsNew(data) {
  return request({
    url: '/System/FinanceNew/QueryPaymentNewSinge',
    method: 'post',
    data
  })
}
// 核销收付款单(新)
export function VerificationNew(data) {
  return request({
    url: '/System/FinanceNew/NewVerification',
    method: 'post',
    data
  })
}

// 添加付款单接口
export function AddPaymentSingle(data) {
  return request({
    url: '/Finance/AddPayment',
    method: 'post',
    data
  })
}

// 修改付款单接口
export function EditPaymentSingle(data) {
  return request({
    url: '/Finance/AddPayment',
    method: 'post',
    data
  })
}
// 删除付款单接口
export function DeletePaymentSingle(data) {
  return request({
    url: '/Finance/DeletePayment',
    method: 'post',
    data
  })
}

// 付款单点击修改获取表格对象,和表单对象的接口
export function GetPaymentTable(data) {
  return request({
    url: '/Finance/FindPaymentByID',
    method: 'post',
    data
  })
}
// 付款账户列表应用
export function GetPaymentAccount(data) {
  return request({
    url: '/VirtualCapital/QueryAccountByBusinessID',
    method: 'post',
    data
  })
}

