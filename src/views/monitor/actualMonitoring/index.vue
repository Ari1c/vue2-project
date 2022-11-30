<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="主电源监控" name="MPSMonitor">
        <keep-alive>
          <mainMonitor v-if="activeName === 'MPSMonitor'" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="支路监控" name="branchMonitor">
        <keep-alive>
          <branchMonitor v-if="activeName === 'branchMonitor'" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="环境监控" name="ENVMonitor">
        <keep-alive>
          <environmentMonitor v-if="activeName === 'ENVMonitor'" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import mainMonitor from '@/views/monitor/actualMonitoring/mainPowerMonitor/index.vue';
  import branchMonitor from '@/views/monitor/actualMonitoring/branchMonitor/index.vue';
  import environmentMonitor from '@/views/monitor/actualMonitoring/environmentMonitor/index.vue';

  export default {
    name: 'monitoring',
    // 注册组件
    components: {
      mainMonitor,
      branchMonitor,
      environmentMonitor
    },
    data() {
      return {
        activeName: 'MPSMonitor' // 默认给第一个（主电源监控）
      }
    },
    methods: {
      handleClick(tab) {
        this.activeName = tab.name;
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
