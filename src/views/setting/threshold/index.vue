<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="支路阈值" name="branchThreshold">
        <keep-alive>
          <branchThreshold v-if="activeName === 'branchThreshold'" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="主电源阈值" name="MPSThreshold">
        <keep-alive>
          <mainPowerThreshold v-if="activeName === 'MPSThreshold'" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="温湿度阈值" name="THThreshold">
        <keep-alive>
          <temORhumThreshold v-if="activeName === 'THThreshold'" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="输出功率阈值" name="POThreshold">
        <keep-alive>
          <powerOutputThreshold v-if="activeName === 'POThreshold'" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="数据获取设置" name="getDataSetting">
        <keep-alive>
          <dataGetSetting v-if="activeName === 'getDataSetting'" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import branchThreshold from '@/views/setting/threshold/branchThreshold/index.vue';
  import mainPowerThreshold from '@/views/setting/threshold/mainPowerThreshold/index.vue';
  import temORhumThreshold from '@/views/setting/threshold/temORhumThreshold/index.vue';
  import powerOutputThreshold from '@/views/setting/threshold/powerOutputThreshold/index.vue';
  import dataGetSetting from '@/views/setting/threshold/getDataSetting/index.vue';

  export default {
    name: 'setting',
    // 注册组件
    components: {
      branchThreshold,
      mainPowerThreshold,
      temORhumThreshold,
      powerOutputThreshold,
      dataGetSetting
    },
    data() {
      return {
        activeName: 'branchThreshold' // 默认（支路阈值）
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
