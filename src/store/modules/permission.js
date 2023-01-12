import {menus} from '@/api/menu'
import {deepClone, recursionToArray, recursionToTree} from '@/utils/index'
import { constantRoutes } from '@/router'

const permission = {
  state: {
    sidebarRouters: [],
    orgMenus:[],
    defaultRoutes: [],
    topbarRouters: []
  },
  mutations: {
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = routes
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    SET_ORG_MENUS: (state, routes) => {
      state.orgMenus = routes
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({commit}) {
      return new Promise(resolve => {
        // 向后端请求路由数据

        // menus().then(res => {
        //   console.log('menus---res: ------', res.data, JSON.parse(JSON.stringify(res.data)));

        //   let menus = res.data;
        //   const rewriteRoutes = filtersMenus(menus);
        //   commit('SET_SIDEBAR_ROUTERS', rewriteRoutes)
        //   commit('SET_DEFAULT_ROUTES', rewriteRoutes)
        //   commit('SET_TOPBAR_ROUTES', rewriteRoutes)
        //   commit('SET_ORG_MENUS', menus)
        //   resolve(rewriteRoutes)
        // })

        let menus = [
          {
            code: "system",
            id: 1,
            isShow: true,
            name: "系统管理",
            pid: 0,
            sortOrder: 2
          },
          {
            code: "sysAccount",
            id: 2,
            isShow: true,
            name: "系统用户管理",
            pid: 1,
            sortOrder: 1
          },
          {
            code: "sysGlobalConfig",
            id: 3,
            isShow: true,
            name: "全局配置",
            pid: 1,
            sortOrder: 7
          },
          {
            code: "sysMenu",
            id: 4,
            isShow: true,
            name: "菜单管理",
            pid: 1,
            sortOrder: 3
          },
          {
            code: "sysRole",
            id: 5,
            isShow: true,
            name: "角色管理",
            pid: 1,
            sortOrder: 2
          },
          {
            code: "sysOpLog",
            id: 6,
            isShow: true,
            name: "操作日志",
            pid: 9,
            sortOrder: 2
          },
          {
            code: "sysErrorLog",
            id: 7,
            isShow: true,
            name: "异常日志",
            pid: 9,
            sortOrder: 3
          },
          {
            code: "sysOrganization",
            id: 8,
            isShow: true,
            name: "组织管理",
            pid: 1,
            sortOrder: 4
          },
          {
            code: "sysLog",
            id: 9,
            isShow: true,
            name: "日志管理",
            pid: 1,
            sortOrder: 5
          },
          {
            code: "sysLoginLog",
            id: 10,
            isShow: true,
            name: "登录日志",
            pid: 9,
            sortOrder: 1
          },
          {
            code: "sysDict",
            id: 11,
            isShow: false,
            name: "字典管理",
            pid: 1,
            sortOrder: 6
          },
          {
            code: "sysUpgrade",
            id: 12,
            isShow: true,
            name: "升级管理",
            pid: 1,
            sortOrder: 8
          },
          {
            code: "home",
            id: 13,
            isShow: true,
            name: "首页",
            pid: 0,
            sortOrder: 1
          },
          {
            code: "sysDictData",
            id: 15,
            isShow: false,
            name: "字典数据",
            pid: 1,
            sortOrder: 6
          },
          {
            code: "sysUpgradeVersion",
            id: 16,
            isShow: false,
            name: "版本管理",
            pid: 1,
            sortOrder: 10
          },
          {
            code: "file",
            id: 20,
            isShow: true,
            name: "文件传输管理",
            pid: 0,
            sortOrder: 3
          },
          {
            code: "desktopRegister",
            id: 21,
            isShow: true,
            name: "桌面注册审核",
            pid: 20,
            sortOrder: 1
          },
          {
            code: "messageTemplate",
            id: 22,
            isShow: true,
            name: "短信模板配置",
            pid: 20,
            sortOrder: 2
          },
          {
            code: "portal",
            id: 24,
            isShow: true,
            name: "门户网站管理",
            pid: 0,
            sortOrder: 4
          },
          {
            code: "mailbox",
            id: 25,
            isShow: true,
            name: "信箱管理",
            pid: 24,
            sortOrder: 1
          },
          {
            code: "dutyForm",
            id: 26,
            isShow: true,
            name: "值班表管理",
            pid: 24,
            sortOrder: 2
          },
          {
            code: "contribute",
            id: 27,
            isShow: true,
            name: "投稿区管理",
            pid: 24,
            sortOrder: 3
          },
          {
            code: "category",
            id: 29,
            isShow: true,
            name: "栏目管理",
            pid: 24,
            sortOrder: 5
          },
          {
            code: "categoryUpdate",
            id: 30,
            isShow: false,
            name: "栏目编辑",
            pid: 24,
            sortOrder: 6
          },
          {
            code: "article",
            id: 31,
            isShow: true,
            name: "文章管理",
            pid: 24,
            sortOrder: 7
          },
          {
            code: "articleEdit",
            id: 32,
            isShow: false,
            name: "文章编辑",
            pid: 24,
            sortOrder: 8
          },
          {
            code: "fileManage",
            id: 33,
            isShow: true,
            name: "文件管理",
            pid: 24,
            sortOrder: 9
          },
          {
            code: "link",
            id: 34,
            isShow: true,
            name: "链接管理",
            pid: 24,
            sortOrder: 11
          },
          {
            code: "media",
            id: 35,
            isShow: true,
            name: "音视频管理",
            pid: 24,
            sortOrder: 13
          },
          {
            code: "fileManageUpdate",
            id: 36,
            isShow: false,
            name: "编辑文件",
            pid: 24,
            sortOrder: 10
          },
          {
            code: "linkUpdate",
            id: 37,
            isShow: false,
            name: "编辑链接",
            pid: 24,
            sortOrder: 12
          },
          {
            code: "mediaUpdate",
            id: 38,
            isShow: false,
            name: "编辑音视频",
            pid: 24,
            sortOrder: 14
          },
          {
            code: "sysAppAccount",
            id: 39,
            isShow: true,
            name: "App用户管理",
            pid: 1,
            sortOrder: 1
          },
          {
            code: "userApplyExamine",
            id: 40,
            isShow: true,
            name: "游客申请审核",
            pid: 20,
            sortOrder: 4
          },
          {
            code: "message",
            id: 41,
            isShow: true,
            name: "留言建议管理",
            pid: 24,
            sortOrder: 1
          }
        ]

        const rewriteRoutes = filtersMenus(menus);
        console.log(rewriteRoutes, 'rewriteRoutes')
        commit('SET_SIDEBAR_ROUTERS', rewriteRoutes)
        commit('SET_DEFAULT_ROUTES', rewriteRoutes)
        commit('SET_TOPBAR_ROUTES', rewriteRoutes)
        commit('SET_ORG_MENUS', menus)
        resolve(rewriteRoutes)
      })
    }
  }
}

function filtersMenus(menus) {
  menus = deepClone(menus);
  //从小到大排序
  menus.sort(function (a, b) {
    return a.sortOrder - b.sortOrder
  })

  let routes = recursionToArray(constantRoutes, "children")

  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i]
    menu.meta = {title: menu.name}
    for (let j = 0; j < routes.length; j++) {
      let route = routes[j]
      if (menu.code == route.name) {
        menu.path = route.path;
        route.meta && route.meta.icon && (menu.meta.icon = route.meta.icon);
        break;
      }
    }
    !menu.path && (menu.path = "/" + menu.code)
  }

  let newArr = recursionToTree(menus, "id", "pid", "children", 0)
  return newArr
}

export default permission
