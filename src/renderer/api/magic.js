import request from '@/utils/request'

export function ShowMagicDepartmentRentAvgMoney(data) {
    return request({
        url: '/MCommunity/ShowMagicDepartmentRentAvgMoney',
        method: 'post',
        data
    })
}
// 查询跟进
export function ShowMagicFollowLogByHouseKey(data) {
    return request({
        url: '/MCommunity/ShowMagicFollowLogByHouseKey',
        method: 'post',
        data
    })
}
// 添加跟进
export function AddMagicFollowLog(data) {
    return request({
        url: '/MCommunity/AddMagicFollowLog',
        method: 'post',
        data
    })
}
