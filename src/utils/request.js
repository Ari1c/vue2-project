import axios from 'axios'
import {Message} from 'element-ui'
import {local_uuid} from '@/utils/index'
import {getToken} from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.API,
  // 超时
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    config.withCredentials = true

    config.headers["x-uuid"] = local_uuid();
    config.headers["x-token"] = getToken();
    console.log('【request】->' + config.url, config.params, config.data)
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)


// 响应拦截器
service.interceptors.response.use(
  res => {
    console.log('【response】<-', res.data)
    const code = res.data.code || "00000";
    const msg = res.data.msg
    if (code !== '00000') {
      Message({message: msg, type: 'error'})
    } else {
      return res.data
    }
  },
  error => {
    if (error.response.status == 400) {
      Message({message: "参数错误：" + error.response.data, type: 'error', duration: 5 * 1000})
    } else if (error.response.status == 401) {
      Message({message: "需要登录", type: 'error', duration: 5 * 1000})
    } else if (error.response.status == 403) {
      Message({message: "权限不足，请重新登录", type: 'error', duration: 5 * 1000})
    } else if (error.response.status == 404) {
      Message({message: error.response.data.path + " 请求不存在", type: 'error', duration: 5 * 1000})
    } else {//内部异常
      Message({message: error.message, type: 'error', duration: 5 * 1000})
    }
    Promise.reject(error)
  }
)

export default service
