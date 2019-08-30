import axios from 'axios'
import { Message } from 'element-ui'
import { baseURL } from '../../config/index'

// 创建axios实例
const service = axios.create({
  baseURL: baseURL, // api的base_url
  timeout: 20000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非0是抛错
     */
    const res = response.data
    if (res.Code === 2) {
      Message({
        message: '链接已过期',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else if (res.Code !== 0) {
      Message({
        message: res.Msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
