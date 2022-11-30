<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="开关控制" name="switchControl">
        <keep-alive>
          <switchController v-if="activeName === 'switchControl'" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="控制记录" name="controlRecord">
        <keep-alive>
          <controllerRecords v-if="activeName === 'controlRecord'" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import switchController from '@/views/controller/switchControl/index.vue';
  import controllerRecords from '@/views/controller/controlRecord/index.vue';

  export default {
    name: 'setting',
    // 注册组件
    components: {
      switchController,
      controllerRecords
    },
    data() {
      return {
        activeName: 'switchControl'
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
