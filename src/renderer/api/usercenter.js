import request from '@/utils/request'

// 操作日志分页查询
 export function ShowOperationMsg(data) {
     return request({
         url: '/OperationMsg/ShowOperationMsg',
         method: 'post',
         data
     })
 }

// 操作日志获取所有分店
export function SelectBusinessDepList(data) {
    return request({
        url: '/SystemMethod/SelectBusinessDepList',
        method: 'post',
        data
    })
}

 // 修改密码
export function ModifyPwd(data) {
    return request({
        url: '/SystemMethod/ModifyPwd',
        method: 'post',
        data
    })
}

// 个人中心信息查询
export function QueryEmp(data) {
    return request({
        url: '/SystemMethod/QueryEmp',
        method: 'post',
        data
    })
}

// 查询消息列表
export function ShowMessagePush(data) {
    return request({
        url: '/System/MessagePush/ShowMessagePush',
        method: 'post',
        data
    })
}

// 查询未读消息条数
export function FindReadCount(data) {
    return request({
        url: '/System/MessagePush/FindReadCount',
        method: 'post',
        data
    })
}

// 设置消息已读
export function SetReadState(data) {
    return request({
        url: '/system/MessagePush/SetReadState',
        method: 'post',
        data
    })
}

// 查询可切换的公司列表
export function SelectEmpCom(data) {
  return request({
    url: '/system/SystemMethod/SelectEmpCom',
    method: 'post',
    data
  })
}

// 切换公司登录
export function LoginCut(data) {
  return request({
    url: '/system/SystemMethod/LoginCut',
    method: 'post',
    data
  })
}
