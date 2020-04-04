import request from '@/utils/request'

// 数据导出审核列表
export function getDataExportAuditList(data) {
  return request({
    url: '/Tool/Tool/QueryDataExportApplicationList',
    method: 'post',
    data
  })
}

// 数据导出申请列表
export function QueryDataExportApplyList(data) {
  return request({
    url: '/Tool/Tool/QueryDataExportApplicationList',
    method: 'post',
    data
  })
}

// 添加数据导出申请返回申请ID
export function AddDataExportApplyID(data) {
  return request({
    url: '/Tool/Tool/InsertDataExportApplication',
    method: 'post',
    data
  })
}

// 数据导出签字
export function SignDataExportApply(data) {
  return request({
    url: '/Tool/Tool/SignDataExportApplication',
    method: 'post',
    data
  })
}

// 查询数据导出签字
export function QueryDataExportApplySignInfo(data) {
  return request({
    url: '/Tool/Tool/QueryExportApplicationSignInfo',
    method: 'post',
    data
  })
}

// 查询数据导出表头
export function QueryDataExportheader(data) {
  return request({
    url: '/DownloadCenterMethod/ShowDownloadExportList',
    method: 'post',
    data
  })
}

// 数据导出申请详情
export function QueryDataExportEditDetail(data) {
  return request({
    url: '/Tool/Tool/QueryDataExportApplicationDetails',
    method: 'post',
    data
  })
}

// 修改数据导出申请
export function EditDataExportApply(data) {
  return request({
    url: '/Tool/Tool/UpdateDataExportApplication',
    method: 'post',
    data
  })
}

// 上传excel模板
export function UploadDataExportTemplate(data) {
  return request({
    url: '/Tool/Tool/UploadDataExpor',
    method: 'post',
    data
  })
}

// 删除数据导出
export function DeleteDataExportTemplate(data) {
  return request({
    url: '/Tool/Tool/DeleteDataExportApplication',
    method: 'post',
    data
  })
}

// 数据导出审核详情
export function getAuditDetail(data) {
  return request({
    url: '/Tool/Tool/QueryDataExportApplicationDetails',
    method: 'post',
    data
  })
}

// 数据导出审核详情进度
export function getAuditDetailProgress(data) {
  return request({
    url: '/Tool/Tool/QueryExportApplicationProgres',
    method: 'post',
    data
  })
}

// 数据导出执行审核
export function ExcuteAudit(data) {
  return request({
    url: '/Tool/Tool/ExcuteExportApplicationAudit',
    method: 'post',
    data
  })
}

// 上传列表的下载模板
export function DownLoadTemplate(data) {
  return request({
    url: '/Tool/Tool/DownloadData',
    method: 'post',
    data
  })
}
