import request from '../utils/request'

// 装修申请项目配置 - 显示所有类别
export function ShowAllRenovationApply(data) {
  return request({
    url: '/CompanyMethod/ShowAllRenovationApply',
    method: 'post',
    data
  })
}
// 装修申请项目配置 - 显示所有项目
export function ShowRenovationProject(data) {
  return request({
    url: '/CompanyMethod/ShowRenovationProject',
    method: 'post',
    data
  })
}

// 装修申请项目配置 - 新增类别
export function AddRenovationApplyCategory(data) {
  return request({
    url: '/CompanyMethod/AddRenovationApplyCategory',
    method: 'post',
    data
  })
}

// 装修申请项目配置 - 删除类别
export function DelRenovationApply(data) {
  return request({
    url: '/CompanyMethod/DelRenovationApply',
    method: 'post',
    data
  })
}

// 装修申请项目配置 - 修改类别
export function EditRenovationApply(data) {
  return request({
    url: '/CompanyMethod/EditRenovationApply',
    method: 'post',
    data
  })
}

// liuqiang
// 库房列表
export function ShowStorageRoom(data) {
  return request({
    url: '/CompanyMethod/ShowStorageRoom',
    method: 'post',
    data
  })
}
// 新增库房
export function AddStorageRoom(data) {
  return request({
    url: '/CompanyMethod/AddStorageRoom',
    method: 'post',
    data
  })
}
// 入库
export function InStock(data) {
  return request({
    url: '/CompanyMethod/InStock',
    method: 'post',
    data
  })
}
// 出库
export function OutStock(data) {
  return request({
    url: '/CompanyMethod/OutStock',
    method: 'post',
    data
  })
}
// 编辑修改
export function EditStorageRoom(data) {
  return request({
    url: '/CompanyMethod/EditStorageRoom',
    method: 'post',
    data
  })
}
// 删除 库房
export function DelStorageRoom(data) {
  return request({
    url: '/CompanyMethod/DelStorageRoom',
    method: 'post',
    data
  })
}
// 操作记录
export function ShowStorageOperationalRecords(data) {
  return request({
    url: '/CompanyMethod/ShowStorageOperationalRecords',
    method: 'post',
    data
  })
}
// 采购部 列表
export function ShowRenovationApplyRecord(data) {
  return request({
    url: '/CompanyMethod/ShowRenovationApplyRecord',
    method: 'post',
    data
  })
}
// // 采购部 列表详情
// export function ShowDecorationSheetDetails(data) {
//   return request({
//     url: '/CompanyMethod/ShowDecorationSheetDetails',
//     method: 'post',
//     data
//   })
// }
// 采购部 列表详情
export function ShowRenovationRecordDetails(data) {
  return request({
    url: '/CompanyMethod/ShowRenovationRecordDetails',
    method: 'post',
    data
  })
}
// 采购部 装修完成
export function UpdateRenovationApplyStatus(data) {
  return request({
    url: '/CompanyMethod/UpdateRenovationApplyStatus',
    method: 'post',
    data
  })
}
// 采购部 部门
export function ShowOrganizationSmallList(data) {
  return request({
    url: '/SystemMethod/ShowOrganizationSmallList',
    method: 'post',
    data
  })
}
// 采购部 详情table新增
export function AddProjectYWY(data) {
  return request({
    url: '/CompanyMethod/AddProjectYWY',
    method: 'post',
    data
  })
}
// 采购部 详情table修改
export function UpdateProjectYWY(data) {
  return request({
    url: '/CompanyMethod/UpdateProjectYWY',
    method: 'post',
    data
  })
}
// 采购部 详情table删除
export function DeleteProjectYWY(data) {
  return request({
    url: '/CompanyMethod/DeleteProjectYWY',
    method: 'post',
    data
  })
}
// 采购部 勘察装修单
// export function ShowDecorationSheetDetails(data) {
//   return request({
//     url: '/CompanyMethod/ShowDecorationSheetDetails',
//     method: 'post',
//     data
//   })
// }
// 采购部 勘察采购单
// export function ShowPurchasingOrderDetails(data) {
//   return request({
//     url: '/CompanyMethod/ShowPurchasingOrderDetails',
//     method: 'post',
//     data
//   })
// }
// 采购部 新增勘察装修单
export function AddDecorationSheetDetails(data) {
  return request({
    url: '/CompanyMethod/AddDecorationSheetDetails',
    method: 'post',
    data
  })
}
// 采购部 新增勘察采购单
export function AddPurchasingOrderDetails(data) {
  return request({
    url: '/CompanyMethod/AddPurchasingOrderDetails',
    method: 'post',
    data
  })
}
// 采购部 删除勘察装修单
export function DelDecorationSheetDetails(data) {
  return request({
    url: '/CompanyMethod/DelDecorationSheetDetails',
    method: 'post',
    data
  })
}
// 采购部 删除勘察采购单
export function DelPurchasingOrderDetails(data) {
  return request({
    url: '/CompanyMethod/DelPurchasingOrderDetails',
    method: 'post',
    data
  })
}
// 采购部 修改勘察装修单
export function UpdateDecorationSheetDetails(data) {
  return request({
    url: '/CompanyMethod/UpdateDecorationSheetDetails',
    method: 'post',
    data
  })
}
// 采购部 修改勘察采购单
export function UpdatePurchasingOrderDetails(data) {
  return request({
    url: '/CompanyMethod/UpdatePurchasingOrderDetails',
    method: 'post',
    data
  })
}
// 采购部 勘察供货商
// export function ShowAllSupplierCategory(data) {
//   return request({
//     url: '/CompanyMethod/ShowAllSupplierCategory',
//     method: 'post',
//     data
//   })
// }
// 采购部 勘察提交
export function SurveyedCommit(data) {
  return request({
    url: '/CompanyMethod/SurveyedCommit',
    method: 'post',
    data
  })
}
// // 采购部 勘察项目名称
// export function ShowRenovationProject(data) {
//   return request({
//     url: '/CompanyMethod/ShowRenovationProject ',
//     method: 'post',
//     data
//   })
// }
// 装修申请项目配置 - 查询表
export function ShowRenovationApply(data) {
  return request({
    url: '/CompanyMethod/ShowRenovationApply',
    method: 'post',
    data
  })
}

// 装修申请项目配置 - 新增表
export function AddRenovationApplyConfigue(data) {
  return request({
    url: '/CompanyMethod/AddRenovationApplyConfigue',
    method: 'post',
    data
  })
}

// 装修申请项目配置 - 修改表
export function EditRenovationApplyCon(data) {
  return request({
    url: '/CompanyMethod/EditRenovationApplyCon',
    method: 'post',
    data
  })
}

// 装修申请项目配置 - 删除表
export function DelRenovationApplyCon(data) {
  return request({
    url: '/CompanyMethod/DelRenovationApplyCon',
    method: 'post',
    data
  })
}

// 装修单 - 查询表
export function ShowDecorationSheet(data) {
  return request({
    url: '/CompanyMethod/ShowDecorationSheet',
    method: 'post',
    data
  })
}

// 装修单 - 详情
export function ShowDecorationSheetDetails(data) {
  return request({
    url: '/CompanyMethod/ShowDecorationSheetDetails',
    method: 'post',
    data
  })
}

// 装修单 - 已入场（2）/装修结束（3）
export function UpdateDecorationSheetStatus(data) {
  return request({
    url: '/CompanyMethod/UpdateDecorationSheetStatus',
    method: 'post',
    data
  })
}

// 采购单 - 查询表
export function ShowPurchasingOrder(data) {
  return request({
    url: '/CompanyMethod/ShowPurchasingOrder',
    method: 'post',
    data
  })
}

// 采购单 - 详情
export function ShowPurchasingOrderDetails(data) {
  return request({
    url: '/CompanyMethod/ShowPurchasingOrderDetails',
    method: 'post',
    data
  })
}

// 采购单 - 安装完成
export function UpdatePurchasingOrderStatus(data) {
  return request({
    url: '/CompanyMethod/UpdatePurchasingOrderStatus',
    method: 'post',
    data
  })
}

// 供货商及装修部门配置 - 显示所有类别
export function ShowAllSupplierCategory(data) {
  return request({
    url: '/CompanyMethod/ShowAllSupplierCategory',
    method: 'post',
    data
  })
}

// 供货商及装修部门配置 - 添加类别
export function AddSupplierCategory(data) {
  return request({
    url: '/CompanyMethod/AddSupplierCategory',
    method: 'post',
    data
  })
}

// 供货商及装修部门配置 - 修改类别
export function EditSupplierCategory(data) {
  return request({
    url: '/CompanyMethod/EditSupplierCategory',
    method: 'post',
    data
  })
}

// 供货商及装修部门配置 - 删除类别
export function DelSupplierCategory(data) {
  return request({
    url: '/CompanyMethod/DelSupplierCategory',
    method: 'post',
    data
  })
}

// 供货商及装修部门配置 - 查询表
export function ShowSupplyCommodity(data) {
  return request({
    url: '/CompanyMethod/ShowSupplyCommodity',
    method: 'post',
    data
  })
}

// 供货商及装修部门配置 - 添加表
export function AddSupplyCommodity(data) {
  return request({
    url: '/CompanyMethod/AddSupplyCommodity',
    method: 'post',
    data
  })
}

// 供货商及装修部门配置 - 修改表
export function EditSupplyCommodity(data) {
  return request({
    url: '/CompanyMethod/EditSupplyCommodity',
    method: 'post',
    data
  })
}

// 供货商及装修部门配置 - 删除表
export function DelSupplyCommodity(data) {
  return request({
    url: '/CompanyMethod/DelSupplyCommodity',
    method: 'post',
    data
  })
}

// 新增装修申请
export function AddRenovationApplyRecord(data) {
  return request({
    url: '/CompanyMethod/AddRenovationApplyRecord',
    method: 'post',
    data
  })
}

// 修改装修申请
export function UpdateRenovationApplyRecord(data) {
  return request({
    url: '/CompanyMethod/UpdateRenovationApplyRecord',
    method: 'post',
    data
  })
}
