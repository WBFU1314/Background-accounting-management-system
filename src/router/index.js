import Vue from 'vue'
import Router from 'vue-router'
import User from '@/views/User'
import login from '@/views/login'
import header from '@/components/header'
import test from '@/views/test'
import register from '@/views/register'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/User',
      name: 'User',
      component: User
    },
    {
      path: '/header',
      name: 'header',
      component: header,
      children: [
        {
          //  首页
          path: '/home',
          component: () => import('@/views/home.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          //  员工管理
          path: '/staff',
          component: () => import('../views/staff/staffManagement.vue'),
          meta: {
            title: '员工管理'
          },
          redirect: '/staff/staffInfo',
          children: [
            {
              path: '/staff/staffInfo',
              component: () => import('@/views/staff/staffInfo.vue'),
              meta: {
                title: '员工信息一览'
              }
            },
            {
              path: '/staff/staffAdd',
              component: () => import('@/views/staff/staffAdd.vue'),
              meta: {
                title: '新增员工'
              }
            }
          ]
        },
        {
          path: '/order',
          component: () => import('@/views/order/orderManagement.vue'),
          meta: {
            title: '订单管理'
          },
          redirect: '/order/orderInfo',
          children: [
            {
              path: '/order/orderInfo',
              component: () => import('@/views/order/orderInfo.vue'),
              meta: {
                title: '订单信息一览'
              }
            },
            {
              path: '/order/orderAdd',
              component: () => import('@/views/order/orderAdd.vue'),
              meta: {
                title: '新增订单'
              }
            },
            {
              path: '/order/orderHistory',
              component: () => import('@/views/order/orderHistory.vue'),
              meta: {
                title: '历史订单'
              }
            }
          ]
        },
        {
          //  账单管理
          path: '/bill',
          component: () => import('@/views/bill/billManagement.vue'),
          meta: {
            title: '账单管理'
          },
          redirect: '/bill/accountDaily',
          children: [
            {
              path: '/bill/accountDaily',
              component: () => import('@/views/bill/accountDaily.vue'),
              meta: {
                title: '每日记账'
              }
            },
            {
              path: '/bill/accountMonthly',
              component: () => import('@/views/bill/accountMonthly.vue'),
              meta: {
                title: '按月查看'
              }
            }
          ]
        },
        {
          //  工资结算
          path: '/salary',
          component: () => import('@/views/salary/salaryCalculation.vue'),
          meta: {
            title: '工资结算'
          },
          redirect: '/salary/salaryCalculate',
          children: [
            {
              path: '/salary/salaryCalculate',
              component: () => import('@/views/salary/salaryCalculate.vue'),
              meta: {
                title: '工资结算'
              }
            }
          ]
        },
        {
          //  统计
          path: '/Statistics',
          component: () => import('@/views/Statistics/Statistics.vue'),
          meta: {
            title: '统计'
          }
        },
        {
          //  权限管理
          path: '/permission',
          component: () => import('@/views/permission.vue'),
          meta: {
            title: '权限管理'
          }
        }
      ]
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.path === '/') {
//     next()
//   } else {
//     let token = localStorage.getItem('Authorization')
//     if (token === null || token === '') {
//       next('/')
//     } else {
//       next()
//     }
//   }
// })

export default router
