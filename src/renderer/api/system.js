import request from '@/utils/request'

export function getAllEnumData(data = {}) {
  return request({
    url: '/System/SystemMethod/GetEnums',
    method: 'post',
    data
  })
}

// 查询城市数组
export function ShowCompanyinfoCityCode(data = {}) {
  return request({
    url: '/SystemMethod/ShowCompanyinfoCityCode',
    method: 'post',
    data
  })
}

// 企业直属部门员工管理分页查询
export function ShowHQDirectInfoByPage(data = {}) {
  return request({
    url: '/SystemMethod/ShowHQDirectInfoByPage',
    method: 'post',
    data
  })
}

// 获取直属部门下面的员工
export function ShowBusDepEmp(data = {}) {
  return request({
    url: '/SystemMethod/ShowBusDepEmp',
    method: 'post',
    data
  })
}

// 获取所有分店
export function ShowBusDepCom(data = {}) {
  return request({
    url: '/SystemMethod/ShowBusDepCom',
    method: 'post',
    data
  })
}

//  根据ID查询数据
export function HQDirectInfoByID(data = {}) {
  return request({
    url: '/SystemMethod/HQDirectInfoByID',
    method: 'post',
    data
  })
}

// 添加
export function AddHQDirectInfo(data = {}) {
  return request({
    url: '/SystemMethod/AddHQDirectInfo',
    method: 'post',
    data
  })
}

// 修改
export function EditHQDirectInfo(data = {}) {
  return request({
    url: '/SystemMethod/EditHQDirectInfo',
    method: 'post',
    data
  })
}

// 删除
export function DeleteHQDirectInfo(data = {}) {
  return request({
    url: '/SystemMethod/DeleteHQDirectInfo',
    method: 'post',
    data
  })
}
export function getAllModule(data = {}) {
  return request({
    url: '/System/SystemMethod/ShowJurisdiction',
    method: 'post',
    data
  })
}
export function getAllModuleByUserID(data = {}) {
  return request({
    url: '/System/SystemMethod/ShowJurisdictionbyUserID',
    method: 'post',
    data
  })
}
export function getAllModuleByRoleID(data = {}) {
  return request({
    url: '/System/SystemMethod/ShowJurisdictionByRole',
    method: 'post',
    data
  })
}
export function saveRole(data = {}) {
  return request({
    url: '/System/SystemMethod/SavaJurisdictionByRole',
    method: 'post',
    data
  })
}
export function delRole(data = {}) {
  return request({
    url: '/System/SystemMethod/DelRole',
    method: 'post',
    data
  })
}

export function getAccessConsigData(data = {}) {
  return request({
    url: '/System/SystemMethod/ShowRole',
    method: 'post',
    data
  })
}

export function updateDepartmentData(data = {}) {
  return request({
    url: '/System/SystemMethod/showDepartmentInfoPaging',
    method: 'post',
    data
  })
}
export function addDepartmentData(data = {}) {
  return request({
    url: '/System/SystemMethod/addDepartmentInfo',
    method: 'post',
    data
  })
}
export function editDepartmentData(data = {}) {
  return request({
    url: '/System/SystemMethod/editDepartmentInfo',
    method: 'post',
    data
  })
}
export function delDepartment(data = {}) {
  return request({
    url: '/System/SystemMethod/delDepartmentInfo',
    method: 'post',
    data
  })
}
export function updateCompanyData(data = {}) {
  return request({
    url: '/System/SystemMethod/showCompanyInfoPaging',
    method: 'post',
    data
  })
}
export function getAllCompany(data = {}) {
  return request({
    url: '/System/SystemMethod/showCompanyInfo',
    method: 'post',
    data
  })
}
export function addCompanyData(data = {}) {
  return request({
    url: '/System/SystemMethod/addCompanyInfo',
    method: 'post',
    data
  })
}
export function editCompanyData(data = {}) {
  return request({
    url: '/System/SystemMethod/editCompanyInfo',
    method: 'post',
    data
  })
}
export function isDisableCompany(data = {}) {
  return request({
    url: '/System/SystemMethod/IsDisableCompanyInfo',
    method: 'post',
    data
  })
}
export function getStaffInitData(data = {}) {
  return request({
    url: '/System/SystemMethod/showEmployeeInfoPaging',
    method: 'post',
    data
  })
}
export function getStaff(data = {}) {
  return request({
    url: '/System/SystemMethod/showEmployeeInfo',
    method: 'post',
    data
  })
}
export function getStaffAndPrincipal(data = {}) {
  return request({
    url: '/System/SystemMethod/showEmployeeInfoAll',
    method: 'post',
    data
  })
}
export function HouseEmployeeList(data = {}) {
  return request({
    url: '/SystemMethod/HouseEmployeeList',
    method: 'post',
    data
  })
}
export function HouseEmployeeListByFullID(data = {}) {
  return request({
    url: '/SystemMethod/HouseEmployeeListByFullID',
    method: 'post',
    data
  })
}
export function ShowChangeHouseInfoList(data = {}) {
  return request({
    url: '/MCommunity/ShowChangeHouseInfoList',
    method: 'post',
    data
  })
}
export function addStaffData(data = {}) {
  return request({
    url: '/System/SystemMethod/addEmployeeInfo',
    method: 'post',
    data
  })
}
export function editStaffData(data = {}) {
  return request({
    url: '/System/SystemMethod/editEmployeeInfo',
    method: 'post',
    data
  })
}
export function isDisableEmployee(data = {}) {
  return request({
    url: '/System/SystemMethod/IsDisableEmployeeInfo',
    method: 'post',
    data
  })
}
export function dimissionEmp(data = {}) {
  return request({
    url: '/System/SystemMethod/DimissionEmp',
    method: 'post',
    data
  })
}
export function addPrincipalInfo(data = {}) {
  return request({
    url: '/System/SystemMethod/addPrincipalInfo',
    method: 'post',
    data
  })
}
export function delPrincipalInfo(data = {}) {
  return request({
    url: '/System/SystemMethod/delPrincipalInfo',
    method: 'post',
    data
  })
}
export function SelectBusinessDepList(data = {}) {
  return request({
    url: '/System/SystemMethod/SelectBusinessDepList',
    method: 'post',
    data
  })
}
export function selectAuthority(data = {}) {
  return request({
    url: '/System/SystemMethod/selectAuthority',
    method: 'post',
    data
  })
}
export function SelectTubeRoomEmp(data = {}) {
  return request({
    url: '/System/SystemMethod/SelectTubeRoomEmp',
    method: 'post',
    data
  })
}
export function selectComAuthority(data = {}) {
  return request({
    url: '/System/SystemMethod/selectComAuthority',
    method: 'post',
    data
  })
}
// 返回某个公司下的所有数据,参数:CompanyID
export function selectAllComAuthority(data = {}) {
  return request({
    url: '/System/SystemMethod/selectAllComAuthority',
    method: 'post',
    data
  })
}

// 根据Code获取ImageList
export function getImageListByCode(data = {}) {
  return request({
    url: '/SystemMethod/FindCodeImageUpload',
    method: 'post',
    data
  })
}

// 根据Code获取ImageList
export function delImageByCode(data = {}) {
  return request({
    url: '/SystemMethod/DelImageUpload',
    method: 'post',
    data
  })
}

// 根据员工姓名或电话和公司id获取员工List
export function getEmployeeInfoList(data = {}) {
  return request({
    url: '/SystemMethod/EmployeeInfoList',
    method: 'post',
    data
  })
}

// 获取企业所有1级公司列表
export function SelectCompanyInfoList(data = {}) {
  return request({
    url: '/SystemMethod/SelectCompanyInfoList',
    method: 'post',
    data
  })
}

// 拿房成本
export function StateOwnerContract(data) {
  return request({
    url: '/MCommunity/StateOwnerContract',
    method: 'post',
    data
  })
}

// 出房成本
export function StateTenContract(data) {
  return request({
    url: '/MCommunity/StateTenContract',
    method: 'post',
    data
  })
}

// 装修成本
export function StateFitment(data) {
  return request({
    url: '/MCommunity/StateFitment',
    method: 'post',
    data
  })
}

// 验证身份证号信息
export function validateIDCard(data = {}) {
  return request({
    url: '/Individual/WeiXin/Shenfenzheng',
    method: 'post',
    data
  })
}

// 修改设置公司负责人
export function EditCompanyPrincipalInfo(data = {}) {
  return request({
    url: '/SystemMethod/EditCompanyPrincipalInfo',
    method: 'post',
    data
  })
}

// 通过公司ID获取当前公司的组织架构
export function selectfunctionaryComAuthority(data = {}) {
  return request({
    url: '/SystemMethod/selectfunctionaryComAuthority',
    method: 'post',
    data
  })
}
// 获取当前人员下属的门店
export function ShowOrganizationMeWireList(data = {}) {
  return request({
    url: '/SystemMethod/ShowOrganizationMeWireList',
    method: 'post',
    data
  })
}
// 获取共享房源门店
export function ShowShareOrganizationMeWireList(data) {
  return request({
    url: '/SystemMethod/ShowShareOrganizationMeWireList',
    method: 'post',
    data
  })
}
// 组织架构总接口
export function ShowOrganization(data = {}) {
  return request({
    url: '/SystemMethod/ShowOrganization',
    method: 'post',
    data
  })
}

// html生成pdf文件地址
export function HtmlToPDF(data) {
  return request({
    url: '/SystemMethod/HtmlToPDF',
    method: 'post',
    data
  })
}

// 配置组织时选择人员
export function ShowStaffSysEmpList(data) {
  return request({
    url: '/SystemMethod/ShowStaffSysEmpList',
    method: 'post',
    data
  })
}
// 查询组织
export function ShowStaffSysList(data) {
  return request({
    url: '/SystemMethod/ShowStaffSysList',
    method: 'post',
    data
  })
}

// 新增组织
export function AddStaffSys(data) {
  return request({
    url: '/SystemMethod/AddStaffSys',
    method: 'post',
    data
  })
}
// 修改组织
export function UpdateStaffSys(data) {
  return request({
    url: '/SystemMethod/UpdateStaffSys',
    method: 'post',
    data
  })
}
// 配置组织和人员关系
export function UpdateEmployeeinfoStaffSys(data) {
  return request({
    url: '/SystemMethod/UpdateEmployeeinfoStaffSys',
    method: 'post',
    data
  })
}
// 配置关系查询
export function ShowStaffSysEmployeeinfopage(data) {
  return request({
    url: '/SystemMethod/ShowStaffSysEmployeeinfopage',
    method: 'post',
    data
  })
}
// 新组织添加人员
export function AddStaffSysEmployeeinfo(data) {
  return request({
    url: '/SystemMethod/AddStaffSysEmployeeinfo',
    method: 'post',
    data
  })
}
// 新组织修改人员
export function UpdateStaffSysEmployeeinfo(data) {
  return request({
    url: '/SystemMethod/UpdateStaffSysEmployeeinfo',
    method: 'post',
    data
  })
}
// 根据ID查询人员管理的组织
export function ShowStaffRelationIntoByEmployeeID(data) {
  return request({
    url: '/SystemMethod/ShowStaffRelationIntoByEmployeeID',
    method: 'post',
    data
  })
}

// 查看当前登录人员管理的组织
export function ConfigurationByID(data) {
  return request({
    url: '/SystemMethod/ConfigurationByID',
    method: 'post',
    data
  })
}

// 人员选择要管理组织
export function UpdateConfiguration(data) {
  return request({
    url: '/SystemMethod/UpdateConfiguration',
    method: 'post',
    data
  })
}
// 删除组织
export function DeleteStaffSys(data) {
  return request({
    url: '/SystemMethod/DeleteStaffSys',
    method: 'post',
    data
  })
}
