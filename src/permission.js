import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken} from '@/utils/auth'

NProgress.configure({showSpinner: false})

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  // next();
  store.dispatch('GetInfo').then(() => {
    store.dispatch('GenerateRoutes').then(accessRoutes => {
      next()
    })
  })

  // NProgress.start()
  // if (getToken()) {
  //   //有token
  //   if (to.path === '/login') {
  //     next({path: '/'})
  //     NProgress.done()
  //   } else {
  //     if (!store.getters.user) {
  //       store.dispatch('GetInfo').then(() => {
  //         store.dispatch('GenerateRoutes').then(accessRoutes => {
  //           next()
  //         })
  //       }).catch(err => {
  //         store.dispatch('LogOut').then(() => {
  //           Message.error(err)
  //           next({path: '/'})
  //         })
  //       })
  //     } else {
  //       next()
  //     }
  //   }
  // } else {
  //   // 没有token
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next()
  //   } else {
  //     next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  NProgress.done()
})
