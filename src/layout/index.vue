<template>
  <div
    :class="classObj"
    class="app-wrapper"
    :style="{ '--current-color': theme }">
    <!-- 侧边栏 -->
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <div>
        <!-- 头部导航 -->
        <navbar/>
        <!-- 已打开标签页功能 -->
        <tags-view v-if="needTagsView"/>
      </div>
      <!-- app路由跳转显示的内容 -->
      <app-main/>
      <!-- 右侧弹窗-设置全局样式 -->
      <right-panel>
        <settings/>
      </right-panel>
    </div>
  </div>
</template>

<script>
  import RightPanel from './RightPanel'
  import Settings from './Settings'
  import AppMain from './AppMain'
  import Sidebar from "./SideBar";
  import TagsView from './TagsView'
  import Navbar from './Navbar'
  import ResizeMixin from './mixin/ResizeHandler'
  import {mapState} from 'vuex'
  import variables from "@/assets/styles/variables.less";

  export default {
    name: "Layout",
    components: {
      AppMain,
      Navbar,
      RightPanel,
      Settings,
      Sidebar,
      TagsView
    },
    mixins: [ResizeMixin],
    computed: {
      ...mapState({
        theme: state => state.settings.theme,
        sideTheme: state => state.settings.sideTheme,
        needTagsView: state => state.settings.tagsView,
        sidebar: state => state.app.sidebar
      }),
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened
        };
      },
      variables() {
        return variables;
      },
    },
    methods: {
      logout() {
        this.$store.dispatch("LogOut").then(() => {
          // Message.error(err)
          this.$router.push({path: "/login"})
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/mixin.less";
  @import "~@/assets/styles/variables.less";

  .app-wrapper {
    .clearfix();
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - @base-sidebar-width);
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px);
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
