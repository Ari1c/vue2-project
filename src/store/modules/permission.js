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
        menus().then(res => {
          let menus = res.data;
          const rewriteRoutes = filtersMenus(menus);
          commit('SET_SIDEBAR_ROUTERS', rewriteRoutes)
          commit('SET_DEFAULT_ROUTES', rewriteRoutes)
          commit('SET_TOPBAR_ROUTES', rewriteRoutes)
          commit('SET_ORG_MENUS', menus)
          resolve(rewriteRoutes)
        })
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
