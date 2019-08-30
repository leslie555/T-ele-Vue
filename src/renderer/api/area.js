import request from '@/utils/request'

export function areadatas(data) {
    return request({
        url: '/serives/areaList',
        method: 'post',
        data
    })
}

export function threesBuilddatas(data) {
    return request({
        url: '/serives/allarea',
        method: 'post',
        data
    })
}

// export function bulidingList(data) {
//     return request({
//         url: '/serives/dong',
//         method: 'post',
//         data
//     })
// }
//
// export function UnitList(data) {
//     return request({
//         url: '/serives/Unit',
//         method: 'post',
//         data
//     })
// }
//
// export function doonumberList(data) {
//     return request({
//         url: '/serives/doorNumber',
//         method: 'post',
//         data
//     })
// }
