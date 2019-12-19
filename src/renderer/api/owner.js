import request from '@/utils/request'

// 获取合同列表
export function getContractList(data) {
  return request({
    url: '/OwnerContract/OwnerContract/FindOwnerContractListPage',
    method: 'post',
    data
  })
}

// 预览合同详情
export function findOwnerPreviewById(data) {
  return request({
      url: '/OwnerContract/OwnerContract/FindOwnerPreviewById',
      method: 'post',
      data
  })
}
// 获取合同详情
export function getContractDetail(data) {
  return request({
    url: '/OwnerContract/OwnerContract/ShowOwnerContractByID',
    method: 'post',
    data
  })
}
// 创建账单
export function getOwnerBill(data) {
  return request({
    url: '/CalculationMethod/GetOwnerBill',
    method: 'post',
    data
  })
}
// 新增合同
export function insertOwnerContract(data) {
  return request({
    url: '/OwnerContract/OwnerContract/InsertOwnerContract',
    method: 'post',
    data
  })
}

// 修改合同
export function editOwnerContract(data) {
  return request({
    url: '/OwnerContract/OwnerContract/EditOwnerContract',
    method: 'post',
    data
  })
}

// 安全修改合同
export function safeEditOwnerContract(data) {
  return request({
    url: '/OwnerContract/OwnerContract/EditOwnerSomething',
    method: 'post',
    data
  })
}

// 业主退房
export function ownerCheckOut(data) {
  return request({
    url: '/OwnerContract/OwnerContract/OwnerCheckOut',
    method: 'post',
    data
  })
}

// 业主修改退房
export function ownerEditCheckOut(data) {
  return request({
    url: '/OwnerContract/OwnerContract/EditOwnerCheckOut',
    method: 'post',
    data
  })
}

// 业主合同删除
export function deleteOwnerContractByIDs(data) {
  return request({
    url: '/OwnerContract/OwnerContract/DeleteOwnerContractByIDs',
    method: 'post',
    data
  })
}

// 业主签字
export function ownerSign(data) {
  return request({
    url: '/OwnerContract/OwnerContract/OwnerSign',
    method: 'post',
    data
  })
}

// 业主撤回
export function ownerWithDrawByID(data) {
  return request({
    url: '/OwnerContract/OwnerContract/WithDrawByID',
    method: 'post',
    data
  })
}

// 预览合同
export function previewOwnerContract(data) {
  return request({
    url: '/OwnerContract/OwnerContract/PreviewOwnerContract',
    method: 'post',
    data
  })
}
// 预览合同(新)
export function NewPreviewOwnerContract(data) {
  return request({
    url: '/OwnerContract/OwnerContract/NewPreviewOwnerContract',
    method: 'post',
    data
  })
}

// 搜索小区
export function searchCommunityList(data) {
  return request({
    url: '/HouseData/MCommunity/ShowMCommunityInfo',
    method: 'post',
    data
  })
}

// 业主合同提交审核 用于手机端的合同
export function ownerSubmitAudit(data) {
  return request({
    url: '/OwnerContract/OwnerContract/OwnerSubmitaudit',
    method: 'post',
    data
  })
}

// 签字个人认证
export function personAuth(data) {
  return request({
    url: '/FDD/FDD/Register',
    method: 'post',
    data
  })
}

// 签字前预览
export function viewContract(data) {
  return request({
    url: 'FDD/FDD/ViewContractAndUploaddoc',
    method: 'post',
    data
  })
}

// 预览模板
export function onlyViewContract(data) {
  return request({
    url: 'FDD/FDD/ViewContract',
    method: 'post',
    data
  })
}

// 下载模板
export function getDownloadContract(data) {
  return request({
    url: 'FDD/FDD/DownLoadContract',
    method: 'post',
    data
  })
}

// 认证后获取签署url
export function getFddAuthUrl(data) {
  return request({
    url: '/FDD/FDD/Extsign',
    method: 'post',
    data
  })
}

//  业主合同
export function SelectOwnExpNoCheck(data) {
  return request({
    url: '/OperateMethod/SelectOwnExpNoCheck',
    method: 'post',
    data
  })
}

//  租客合同
export function QueryExpiredTenantWithoutCheckOut(data) {
  return request({
    url: 'OperateMethod/QueryExpiredTenantWithoutCheckOut',
    method: 'post',
    data
  })
}

//  房源
export function SearchHousePerfect(data) {
  return request({
    url: '/SystemMethod/SearchHousePerfect',
    method: 'post',
    data
  })
}

//  房源 (待完善、待审核、无照片)
export function SearchHousePerfectCount(data) {
  return request({
    url: '/SystemMethod/SearchHousePerfectCount',
    method: 'post',
    data
  })
}

//  财务
export function OverdueRentCollection(data) {
  return request({
    url: '/SystemMethod/OverdueRentCollection',
    method: 'post',
    data
  })
}

//  财务 (收款/付款)逾期、(收款/付款)单未核销
export function OverdueRentCollectionCount(data) {
  return request({
    url: '/SystemMethod/OverdueRentCollectionCount',
    method: 'post',
    data
  })
}

