import request from '@/utils/request'

export function getSelectHouseInfoForSearch(data = {}) {
  return request({
    url: '/House/SelectHouseInfoForSearch',
    method: 'post',
    data
  })
}

// 共享房源
// 收藏
export function addEnshrine(data) {
  return request({
    url: '/MCommunity/addEnshrine',
    method: 'post',
    data
  })
}

// 一键发布
export function ReleaseHouse(data) {
  return request({
    url: '/MCommunity/ReleaseHouse',
    method: 'post',
    data
  })
}

// 取消收藏
export function delEnshrine(data) {
  return request({
    url: '/MCommunity/delEnshrine',
    method: 'post',
    data
  })
}

// 查询收藏列表
export function selectEnshrine(data) {
  return request({
    url: '/MCommunity/selectEnshrine',
    method: 'post',
    data
  })
}

// 查询共享房源列表
export function selectShareHouseInfoListPaging(data) {
  return request({
    url: '/MCommunity/selectShareHouseInfoListPaging',
    method: 'post',
    data
  })
}

// 查询共享房源公司
export function showCompanyInfo(data) {
  return request({
    url: '/SystemMethod/showCompanyInfo',
    method: 'post',
    data
  })
}

// 查询共享房源详情
export function selectShareHouseInfoListByID(data) {
  return request({
    url: '/MCommunity/selectShareHouseInfoListByID',
    method: 'post',
    data
  })
}

// 查询共享房源详情
export function HousingSumbit(data) {
  return request({
    url: '/MCommunity/perfectingHousingSumbit',
    method: 'post',
    data
  })
}

// 查询房态图总数
export function SelectHouseHead(data) {
  return request({
    url: '/MCommunity/SelectHouseHead',
    method: 'post',
    data
  })
}

// 查询房源详情
export function houseInfoListByID(data) {
  return request({
    url: '/MCommunity/houseInfoListByID',
    method: 'post',
    data
  })
}

// 查找房源配置
export function equipmentList(data) {
  return request({
    url: '/MCommunity/equipmentList',
    method: 'post',
    data
  })
}

// 查找房源配置图片列表
export function selEquipmentImg(data) {
  return request({
    url: '/MCommunity/selEquipmentImg',
    method: 'post',
    data
  })
}

// 编辑房源配置
export function editEquipment(data) {
  return request({
    url: '/MCommunity/editEquipment',
    method: 'post',
    data
  })
}

// 新增房源配置
export function addequipment(data) {
  return request({
    url: '/MCommunity/addequipment',
    method: 'post',
    data
  })
}

// 删除房源配置
export function delEquipment(data) {
  return request({
    url: '/MCommunity/delEquipment',
    method: 'post',
    data
  })
}

// 查询物品管理（业主，中介，水电气）
export function goodsManagementList(data) {
  return request({
    url: '/MCommunity/goodsManagementList',
    method: 'post',
    data
  })
}

// 查询中介物品列表
export function equipmentListAgent(data) {
  return request({
    url: '/MCommunity/equipmentListAgent',
    method: 'post',
    data
  })
}

// 新增物品（中介）
export function MoveOut(data) {
  return request({
    url: '/MCommunity/MoveOut',
    method: 'post',
    data
  })
}

// 搬离物品（中介）
export function MoveIn(data) {
  return request({
    url: '/MCommunity/MoveIn',
    method: 'post',
    data
  })
}

// 小区列表查询
export function ShowMCommunityInfo(data) {
  return request({
    url: '/MCommunity/ShowMCommunityInfo',
    method: 'post',
    data
  })
}

// 小区列表修改
export function EditMCommunityInfo(data) {
  return request({
    url: '/MCommunity/EditMCommunityInfo',
    method: 'post',
    data
  })
}

// 房态图查询
export function selectRoomStatusList(data) {
  return request({
    url: '/MCommunity/selectRoomStatusList',
    method: 'post',
    data
  })
}

// 房态图小区房源查询
export function selectRoomStatusListWhere(data) {
  return request({
    url: '/MCommunity/selectRoomStatusListWhere',
    method: 'post',
    data
  })
}

// 房态图(待完善房源)查询
export function selectRoomaAwaitList(data) {
  return request({
    url: '/MCommunity/selectRoomaAwaitList',
    method: 'post',
    data
  })
}

// 修改完善
export function perfectingHousingSumbitEdit(data) {
  return request({
    url: '/MCommunity/perfectingHousingSumbitEdit',
    method: 'post',
    data
  })
}

// 房态图(待审核房源)查询
export function selectRoomaAuditList(data) {
  return request({
    url: '/MCommunity/selectRoomaAuditList',
    method: 'post',
    data
  })
}

// 房态图房源备注
export function editHouseInfoRemark(data) {
  return request({
    url: '/MCommunity/editHouseInfoRemark',
    method: 'post',
    data
  })
}

// 房态图弹窗详情
export function selectRoomStatusTofuList(data) {
  return request({
    url: '/MCommunity/selectRoomStatusTofuList',
    method: 'post',
    data
  })
}

// 批量换管房人
export function editHouseInfoEmp(data) {
  return request({
    url: '/MCommunity/EditMyHouseEmp',
    method: 'post',
    data
  })
}

// 装修查询
export function FindFitment(data) {
  return request({
    url: '/Fitment/FindFitment',
    method: 'post',
    data
  })
}

// 装修新增
export function AddFitment(data) {
  return request({
    url: '/Fitment/AddFitment',
    method: 'post',
    data
  })
}

// 装修修改
export function EditFitment(data) {
  return request({
    url: '/Fitment/EditFitment',
    method: 'post',
    data
  })
}

// 查询物品管理历史记录
export function historiesLis(data) {
  return request({
    url: '/MCommunity/historiesLis',
    method: 'post',
    data
  })
}

// 修改水电气门卡数据
export function HouseUtilitiesUpd(data) {
  return request({
    url: '/MCommunity/HouseUtilitiesUpd',
    method: 'post',
    data
  })
}

// 修改房源配置的区域信息
export function updEquipment(data) {
  return request({
    url: '/MCommunity/updEquipment',
    method: 'post',
    data
  })
}

// 房源预定
export function InsertOrderInfo(data) {
  return request({
    url: '/OperateMethod/InsertOrderInfo',
    method: 'post',
    data
  })
}

// 修改房源预定
export function UpdateOrderInfo(data) {
  return request({
    url: '/OperateMethod/UpdateOrderInfo',
    method: 'post',
    data
  })
}
// 续定房源预定
export function OrderMoneyExtension(data) {
  return request({
    url: '/OrderInfo/OrderMoneyExtension',
    method: 'post',
    data
  })
}
// 转定房源预定
export function TurnOrderinfo(data) {
  return request({
    url: '/OrderInfo/TurnOrderinfo',
    method: 'post',
    data
  })
}

// 房源预约
export function AddAppointmentInfo(data) {
  return request({
    url: '/AppointmentInfo/AddAppointmentInfo',
    method: 'post',
    data
  })
}

// 搜索房源
export function searchHouseList(data) {
  return request({
    url: '/HouseData/MCommunity/selectHouseList',
    method: 'post',
    data
  })
}

// 搜索房源
export function searchHouseConfig(data) {
  return request({
    url: '/HouseData/MCommunity/selectHouseFacilities',
    method: 'post',
    data
  })
}

// 查询勾选房源的管房人
export function selectMyHouseEmp(data) {
  return request({
    url: '/HouseData/MCommunity/selectMyHouseEmp',
    method: 'post',
    data
  })
}

// 查询房东信息
export function FindOwnerInfo(data) {
  return request({
    url: '/HouseData/MCommunity/FindOwnerInfo',
    method: 'post',
    data
  })
}
// 查询租客信息
export function FindTenantInfo(data) {
  return request({
    url: '/HouseData/MCommunity/FindTenantInfo',
    method: 'post',
    data
  })
}

// 查看装修申请列表
export function SelectRenovationApplyList(data) {
  return request({
    url: '/CompanyMethod/ShowRenovationApplyRecord',
    method: 'post',
    data
  })
}
// 提交装修申请
export function SubmitRenovationApplication(data) {
  return request({
    url: '/CompanyMethod/UDRenovationApplyRecordStatus',
    method: 'post',
    data
  })
}

// 删除装修申请
export function DeleteRenovationApplication(data) {
  return request({
    url: '/CompanyMethod/UDRenovationApplyRecordStatus',
    method: 'post',
    data
  })
}

// 撤回装修申请
export function WithdrawRenovationApplication(data) {
  return request({
    url: '/CompanyMethod/Withdraw',
    method: 'post',
    data
  })
}
// 审批
export function ApprovalRenovationApplication(data) {
  return request({
    url: '/CompanyMethod/RenovationApplyApproval',
    method: 'post',
    data
  })
}
// 合同信息列表
export function QueryContractDataExportList(data) {
  return request({
    url: '/OperateMethod/QueryContractDataExportList',
    method: 'post',
    data
  })
}
// 导出数据条数
export function QueryContractDataExportNumber(data) {
  return request({
    url: '/OperateMethod/QueryContractDataExportNumber',
    method: 'post',
    data
  })
}
// 导出记录
export function QueryDataExportRecordList(data) {
  return request({
    url: '/OperateMethod/QueryDataExportRecordList',
    method: 'post',
    data
  })
}
// 签字
export function QueryDataExportSignInfo(data) {
  return request({
    url: '/OperateMethod/QueryDataExportSignInfo',
    method: 'post',
    data
  })
}
