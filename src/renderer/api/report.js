import request from '@/utils/request'

// 查找城市-公司-分店组件
export function ShowOrganizationList(data) {
  return request({
    url: '/SystemMethod/ShowOrganizationList',
    method: 'post',
    data
  })
}

// 客户到期查询
export function SelectTenantContractExcelList(data) {
  return request({
    url: '/ReportExcel/SelectTenantContractExcelList',
    method: 'post',
    data
  })
}

// 会分期查询
export function QueryStagingExcelList(data) {
  return request({
    url: '/ReportExcel/QueryStagingExcelList',
    method: 'post',
    data
  })
}

// 其他报表查询
export function SelectHouseExcelList(data) {
  return request({
    url: '/ReportExcel/SelectHouseExcelList',
    method: 'post',
    data
  })
}

// 房东到期报表查询
export function SelectOwnerContractExcelList(data) {
  return request({
    url: '/ReportExcel/SelectOwnerContractExcelList',
    method: 'post',
    data
  })
}

// 房东付款报表查询
export function SelectOwnerPaymentList(data) {
  return request({
    url: '/ReportExcel/SelectOwnerPaymentList',
    method: 'post',
    data
  })
}

// 房东付款报表查询
export function SelectTotalFee(data) {
  return request({
    url: '/ReportExcel/SelectTotalFee',
    method: 'post',
    data
  })
}

// 租客收款报表查询
export function SelectTenantReceiveList(data) {
  return request({
    url: '/ReportExcel/SelectTenantReceiveList',
    method: 'post',
    data
  })
}

// 财务科目查询
export function FindFinancialSubjectList(data) {
  return request({
    url: 'FinancialSubject/FindFinancialSubjectList',
    method: 'post',
    data
  })
}

// 财务科目修改
export function EditFinancialSubject(data) {
  return request({
    url: 'FinancialSubject/EditFinancialSubject',
    method: 'post',
    data
  })
}

// 财务科目新增
export function AddFinancialSubject(data) {
  return request({
    url: 'FinancialSubject/AddFinancialSubject',
    method: 'post',
    data
  })
}

// 财务科目删除
export function DelFinancialSubject(data) {
  return request({
    url: 'FinancialSubject/DelFinancialSubject',
    method: 'post',
    data
  })
}

// 业绩测试
export function SearchAchievement(data) {
  return request({
    url: 'ReportExcel/Achievement',
    method: 'post',
    data
  })
}

// 空置报表
export function Vacant(data) {
  return request({
    url: 'ReportExcel/Vacant',
    method: 'post',
    data
  })
}

// 测算报表
export function Calculation(data) {
  return request({
    url: '/ReportExcel/Calculation',
    method: 'post',
    data
  })
}

// 租客违约报表
export function SearchBreakTenant(data) {
  return request({
    url: 'ReportExcel/QueryTenantDefaultList',
    method: 'post',
    data
  })
}

// 业主违约报表
export function SearchBreakOwner(data) {
  return request({
    url: 'ReportExcel/QueryOwnerDefaultList',
    method: 'post',
    data
  })
}

// 空置报表
export function SearchVacant(data) {
  return request({
    url: 'ReportExcel/QueryVacantReportList',
    method: 'post',
    data
  })
}
// 拿房获客统计报表
export function SearchGetGuestCollection(data) {
  return request({
    url: 'ReportExcel/QueryTakeHouseCustomerReportList',
    method: 'post',
    data
  })
}

// 出房获客统计报表
export function SearchOutGuestCollection(data) {
  return request({
    url: 'ReportExcel/QueryOutHouseCustomerReportList',
    method: 'post',
    data
  })
}

// 收租逾期报表
export function SearchRentCollectionOverdue(data) {
  return request({
    url: 'ReportExcel/QueryOverdueRentList',
    method: 'post',
    data
  })
}

// 查询装修报表
export function QueryRepairReportList(data) {
  return request({
    url: '/ReportExcel/QueryRepairReportList',
    method: 'post',
    data
  })
}

// 查询收入报表
export function SelectIncomeReport(data) {
  return request({
    url: '/ReportExcel/SelectIncomeReport',
    method: 'post',
    data
  })
}

// 查询支出报表
export function SelectPayReport(data) {
  return request({
    url: '/ReportExcel/SelectPayReport',
    method: 'post',
    data
  })
}

// 查询拿房报表
export function SelectTakeHouseReport(data) {
  return request({
    url: '/ReportExcel/SelectTakeHouseReport',
    method: 'post',
    data
  })
}

// 查询业绩报表
export function SelectPerformanceReport(data) {
  return request({
    url: '/ReportExcel/SelectPerformanceReport',
    method: 'post',
    data
  })
}

// 查询现金流水报表
export function SelectCashFlow(data) {
  return request({
    url: '/ReportExcel/SelectCashFlow',
    method: 'post',
    data
  })
}
