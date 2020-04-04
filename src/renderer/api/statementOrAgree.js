import request from '@/utils/request'

// 合同解除同意书列表查询
export function ShowConsentTerminateContractList(data) {
    return request({
        url: '/OwnerContract/OwnerContract/ShowConsentTerminateContractList',
        method: 'post',
        data
    })
}

export function ShowConsentTerminateContractByID(data) {
    return request({
        url: '/OwnerContract/OwnerContract/ShowConsentTerminateContractByID',
        method: 'post',
        data
    })
}
// 同意免租说明书列表
export function QueryAgreeRentFreeList(data) {
    return request({
        url: '/OwnerContract/OwnerContract/QueryAgreeRentFreeList',
        method: 'post',
        data
    })
}
