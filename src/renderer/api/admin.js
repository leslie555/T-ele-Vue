import request from '@/utils/request'

export function showBusinessInfoPaging(data) {
    return request({
        url: '/System/SystemMethod/showBusinessInfoPaging',
        method: 'post',
        data
    })
}
export function addBusinessInfo(data) {
    return request({
        url: '/System/SystemMethod/addBusinessInfo',
        method: 'post',
        data
    })
}
export function delBusinessInfo(data) {
    return request({
        url: '/System/SystemMethod/delBusinessInfo',
        method: 'post',
        data
    })
}

export function editBusinessInfo(data) {
    return request({
        url: '/System/SystemMethod/editBusinessInfo',
        method: 'post',
        data
    })
}

export function showBusinessInfoByID(data) {
    return request({
        url: '/System/SystemMethod/showBusinessInfoByID',
        method: 'post',
        data
    })
}
// 开启/关闭企业状态
export function upeBusinessInfo(data) {
    return request({
        url: '/System/SystemMethod/upeBusinessInfo',
        method: 'post',
        data
    })
}

export function saveCompanyInfo(data) {
    return request({
        url: '/Company/Save',
        method: 'post',
        data
    })
}
