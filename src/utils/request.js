import axios from 'axios'
import qs from 'qs'
// import { Message } from 'element-ui'
// import store from '@/store'
import { getToken } from '@/utils/auth'

axios.defaults.withCredentials = true

const service = axios.create({
  timeout: 90000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
    config.data = qs.stringify(config.data)
  }
  if (config.url.indexOf('/auth/oauth/token') !== -1) {
    return config
  } else {
    config.headers['Accept'] = 'application/json'
    config.headers['Authorization'] = getToken()
  }
  // 用户注册时
//   if (config.url === '/c/admin/api/reg/register' || config.url === '/c/admin/api/tenant/register') {
//     config.headers['tokenCookie'] = store.state.user.registerCookie
//   }
  // const urls = configStore.url.split('/')
  // if (urls[1] === 'admin') {
  //   configStore.url = configStore.url.replace('/admin', '')
  // }
  // Do something before request is sent
//   if (store.getters.token && config.url.indexOf('/c/dados') === -1) {
//     config.headers['Authorization'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
//   }
  // config.headers['Accept'] = 'application/json'
  return config
}, error => {
  // Do something with request error
  // console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    if (JSON.stringify(response.headers) === '{}') {
      return response
    } else {
      const error = response.error
      if (error) {
        return Promise.reject(response)
      }
      const data = response.data
      if (data.code === 0 || data['access_token'] || data.code === 1 || data.code === -1) {
        return data // 正常处理直接返回需要接受的数据
      } else {
        // 这里假设code返回不为 0 表示， 就直接返回错误的处理
        return Promise.reject(data)
      }
    }
  },
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  error => {
    // // console.log('err' + error)// for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  })

export default service
