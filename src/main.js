// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vconsole from 'vconsole'
Vue.prototype.$axios = axios
Vue.use(ElementUI)
Vue.config.productionTip = false
let vConsole = new Vconsole()
export default vConsole

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  if (window.localStorage.getItem('token')) {
    config.headers['Authorization'] = window.localStorage.getItem('token')
  }
  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})
