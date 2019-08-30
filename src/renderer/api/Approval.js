import request from '@/utils/request'

export function getAcationData(data) {
  return request({
    url: '/Apprpval/GetMyapplicationData',
    method: 'post',
    data
  })
}

export function getQueryApplyList(data) {
  return request({
    url: 'ApplyAudit/QueryApplyConfigList',
    method: 'post',
    data
  })
}

export function editApplyConfig(data) {
  return request({
    url: 'ApplyAudit/SaveApplyConfig',
    method: 'post',
    data
  })
}

// 我的审批查询
export function QueryApplyList(data) {
    return request({
        url: '/system/ApplyAudit/QueryApplyList',
        method: 'post',
        data
    })
}

// 我的审批批量审核
export function BatchExcuteAudit(data) {
    return request({
        url: '/ApplyAudit/BatchExcuteAudit',
        method: 'post',
        data
    })
}

// 业主合同通过后反审核
export function InverseAudit(data) {
  return request({
    url: '/ApplyAudit/InverseAudit',
    method: 'post',
    data
  })
}
