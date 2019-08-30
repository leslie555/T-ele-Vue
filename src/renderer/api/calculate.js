import request from '@/utils/request'

// 测算配置查询
export function FindCalcConfig(data = {}) {
  return request({
    url: '/CalcConfig/FindCalcConfig',
    method: 'post',
    data
  })
}

// 业绩测算列表查询
export function FindPerformanceList(data) {
  return request({
    url: '/Performance/FindPerformanceList',
    method: 'post',
    data
  })
}

// 空置业绩列表查询
export function FindVacancyPerformance(data) {
  return request({
    url: '/Performance/FindVacancyPerformance',
    method: 'post',
    data
  })
}

// 预算页面查询
export function FindCalcRequest(data) {
  return request({
    url: '/Performance/FindCalcRequest',
    method: 'post',
    data
  })
}

// 核算页面查询
export function FindAdjustAccounts(data) {
  return request({
    url: '/Performance/FindAdjustAccounts',
    method: 'post',
    data
  })
}

// 预算
export function Budget(data) {
  return request({
    url: '/CalculationMethod/Budget',
    method: 'post',
    data
  })
}

// 预算
export function business(data) {
  return request({
    url: '/CalculationMethod/business',
    method: 'post',
    data
  })
}

// 预算结果查看
export function FindBudgetResult(data) {
  return request({
    url: '/Performance/FindBudgetResult',
    method: 'post',
    data
  })
}

// 业绩查看
export function FindPerformanceDetail(data) {
  return request({
    url: '/Performance/FindPerformanceDetail',
    method: 'post',
    data
  })
}

// 价格配置
export function GetCompanyNumList(data) {
  return request({
    url: '/CompanyNum/GetCompanyNumList',
    method: 'post',
    data
  })
}

// 充值
export function Recharge(data) {
  return request({
    url: '/CompanyNum/Recharge',
    method: 'post',
    data
  })
}

// 修改预算核算价格
export function EditCompanyNum(data) {
  return request({
    url: '/CompanyNum/EditCompanyNum',
    method: 'post',
    data
  })
}

// 测算配置新增修改
export function AddCalcConfig(data) {
  return request({
    url: '/CalcConfig/AddCalcConfig',
    method: 'post',
    data
  })
}
