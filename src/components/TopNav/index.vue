<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    @select="handleSelect">
    <template v-for="(item, index) in topMenus">
      <el-menu-item :style="{'border-bottom': '2px solid '+theme+'!important;'}" :index="item.path" :key="index"
                    v-if="index < visibleNumber">
        <svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon"/>
        {{ item.meta.title }}
      </el-menu-item>
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-submenu :style="{'border-bottom': '2px solid '+theme+'!important;'}" index="more"
                v-if="topMenus.length > visibleNumber">
      <template slot="title">更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
          :index="item.path"
          :key="index"
          v-if="index >= visibleNumber">
          <svg-icon :icon-class="item.meta.icon"/>
          {{ item.meta.title }}
        </el-menu-item>
      </template>
    </el-submenu>
  </el-menu>
</template>

<script>
import { deepClone } from '../../utils';
  export default {
    data() {
      return {
        // 顶部栏初始数
        visibleNumber: 5,
        // 是否为首次加载
        isFirst: false,
        // 当前激活菜单的 index
        currentIndex: undefined
      };
    },
    computed: {
      theme() {
        return this.$store.state.settings.theme;
      },
      // 顶部显示菜单
      topMenus() {
        let topMenus = [];
        this.routers.map((menu) => {
          if (menu.isShow === true) {
            topMenus.push(menu);
          }
        });
        return topMenus;
      },
      // 所有的路由信息
      routers() {
        return this.$store.state.permission.topbarRouters;
      },
      // 设置子路由
      childrenMenus() {
        var childrenMenus = [];
        this.routers.map((router) => {
          for (var item in router.children) {
            if (router.children[item].parentPath === undefined) {
              router.children[item].path = router.path + "/" + router.children[item].path;
              router.children[item].parentPath = router.path;
            }
            childrenMenus.push(router.children[item]);
          }
        });
        return childrenMenus
      },
      // 默认激活的菜单
      activeMenu() {
        const path = this.$route.path;
        let activePath = this.defaultRouter();
        if (path.lastIndexOf("/") > 0) {
          const tmpPath = path.substring(1, path.length);
          activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
        } else if ("/index" == path || "" == path) {
          if (!this.isFirst) {
            this.isFirst = true;
          } else {
            activePath = "index";
          }
        }
        var routes = this.activeRoutes(activePath);
        if (routes.length === 0) {
          activePath = this.currentIndex || this.defaultRouter()
          this.activeRoutes(activePath);
        }
        return activePath;
      },
    },
    beforeMount() {
      window.addEventListener('resize', this.setVisibleNumber)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.setVisibleNumber)
    },
    mounted() {
      this.setVisibleNumber();
    },
    methods: {
      // 根据宽度计算设置显示栏数
      setVisibleNumber() {
        const width = document.body.getBoundingClientRect().width / 3;
        this.visibleNumber = parseInt(width / 85);
      },
      // 默认激活的路由
      defaultRouter() {
        let router;
        Object.keys(this.routers).some((key) => {
          if (!this.routers[key].hidden) {
            router = this.routers[key].path;
            return true;
          }
        });
        return router;
      },
      // 菜单选择事件
      handleSelect(key) {
        this.currentIndex = key
        this.activeRoutes(key)
      },
      // 当前激活的路由
      activeRoutes(key) {
        var routes = [];
        if (key === 'home') {
          const homeRoute = deepClone(this.routers.find(v => v.path === key))
          homeRoute.path = '/home'
          routes = [homeRoute]
        } else {
          if (this.childrenMenus && this.childrenMenus.length > 0) {
            this.childrenMenus.map((item) => {
              if (key == item.parentPath || (key == "index" && "" == item.path)) {
                routes.push(item);
              }
            });
          }
        }
        if (routes.length > 0) {
          this.$store.commit("SET_SIDEBAR_ROUTERS", routes);
        }
        return routes;
      }
    },
  };
</script>

<style lang="less">
  .topmenu-container.el-menu--horizontal > .el-menu-item {
    float: left;
    height: 50px !important;
    line-height: 50px !important;
    color: #999093 !important;
    padding: 0 5px !important;
    margin: 0 10px !important;
  }

  .topmenu-container.el-menu--horizontal > .el-menu-item.is-active, .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
    color: #303133;
  }

  /* submenu item */
  .topmenu-container.el-menu--horizontal > .el-submenu .el-submenu__title {
    float: left;
    height: 50px !important;
    line-height: 50px !important;
    color: #999093 !important;
    padding: 0 5px !important;
    margin: 0 10px !important;
  }
</style>
