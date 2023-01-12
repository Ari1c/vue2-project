import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 非必要不要修改此路由表，可以新增！！！
export const constantRoutes = [
  {
    path: '/login', name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    component: () => import('@/layout'),
    redirect: 'home',
    children: [
      {
        path: 'home', name: 'home',
        component: () => import('@/views/home/home'),
        meta: { icon: "dashboard", affix: true }
      }
    ]
  },
  {
   path: '/monitor',
   name: 'monitor',
   component: () => import('@/layout'),
   redirect: 'home',
   meta: { icon: 'monitor' },
   children: [
    {
      path: 'actualMonitoring',
      name: 'actualMonitoring',
      component: () => import('@/views/monitor/actualMonitoring/index'),
      // meta: {
      //   icon: 'monitor'
      // }
    }
   ]
  },
  {
    path: '/branchController',
    name: 'branchController',
    component: () => import('@/layout'),
    meta: { icon: 'branch' },
    children: [
      {
        path: '/branchController',
        name: 'branchController',
        component: () => import('@/views/controller/index'),
        meta: {
          icon: 'branch'
        }
      }
    ]
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/layout'),
    redirect: 'home',
    meta: { icon: 'deviceSetting' },
    children: [
      {
        path: 'threshold',
        name: 'threshold',
        component: () => import('@/views/setting/threshold/index'),
      },
      {
        path: 'device',
        name: 'device',
        component: () => import('@/views/setting/device/index'),
      },
      {
        path: 'information',
        name: 'information',
        component: () => import('@/views/setting/information/index'),
      }
    ]
  },
  {
    path: '/alarm',
    name: 'alarm',
    component: () => import('@/layout'),
    meta: { icon: 'alarm' },
    children: [
      {
        path: '/alarm',
        name: 'alarm',
        component: () => import('@/views/alarm/index'),
        meta: { icon: 'alarm' }
      }
    ]
  },
  {
    path: '/msgLog',
    name: 'msgLog',
    component: () => import('@/layout'),
    meta: { icon: 'messageLog' },
    children: [
      {
        path: '/msgLog',
        name: 'msgLog',
        component: () => import('@/views/msgLog/index'),
        meta: { icon: 'messageLog' }
      }
    ]
  },
  {
    path: '/system', name: 'system',
    component: () => import('@/layout'), redirect: 'home', meta: {icon: "system"},
    children: [

      {
        path: "sysAccount", name: "sysAccount",
        component: () => import('@/views/system/sysAccount/index'), meta: {icon: "user"}
      },
      {
        path: "SysGlobalConfig", name: "sysGlobalConfig",
        component: () => import('@/views/system/SysGlobalConfig/index'), meta: {icon: "edit"}
      },
      {
        path: "SysMenu", name: "sysMenu",
        component: () => import('@/views/system/SysMenu/index'), meta: {icon: "tree-table"}
      },
      {
        path: "SysRole", name: "sysRole",
        component: () => import('@/views/system/SysRole/index'), meta: {icon: "peoples"}
      },
      {
        path: "SysOrganization", name: "sysOrganization",
        component: () => import('@/views/system/sysOrganization/index'), meta: {icon: "tree"}
      },
      {
        path: "SysDict", name: "sysDict",
        component: () => import('@/views/system/SysDict/index'), meta: {icon: "dict"}
      },
      {
        path: "dict-data/index/:id", name: "sysDictData",
        component: () => import('@/views/system/SysDict/data')
      },
      {
        path: "SysUpgrade", name: "sysUpgrade",
        component: () => import('@/views/system/SysUpgrade/index'), meta: {icon: "upload"}
      },
      {
        path: "SysUpgrade/version/:id", name: "sysUpgradeVersion",
        component: () => import('@/views/system/SysUpgrade/version')
      },
      {
        path: "sysLog", name: "sysLog",
        meta: { icon: "form" },
        component: () => import('@/views/system/sysLog/index.vue'),
        children: [
          {
            path: "sysLoginLog", name: "sysLoginLog",
            component: () => import('@/views/system/sysLog/sysLoginLog.vue')
          },
          {
            path: "SysOpLog", name: "sysOpLog",
            component: () => import('@/views/system/sysLog/SysOpLog.vue')
          },
          {
            path: "SysErrorLog", name: "sysErrorLog",
            component: () => import('@/views/system/sysLog/SysErrorLog.vue')
          }
        ]
      }
    ]
  }
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
});

//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
//push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch(err => err);
};
//replace
Router.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalReplace.call(this, location, onResolve, onReject);
    return originalReplace.call(this, location).catch(err => err);
};

export default router
