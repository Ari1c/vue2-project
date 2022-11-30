<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="消息配置" name="msgConfig">
        <keep-alive>
          <informationConfig v-if="activeName === 'msgConfig'" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="消息模板展示" name="msgTemplete">
        <keep-alive>
          <informationTemplete v-if="activeName === 'msgTemplete'" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import informationConfig from '@/views/setting/information/inforConfig/index.vue';
  import informationTemplete from '@/views/setting/information/inforTemplete/index.vue';

  export default {
    name: 'setting',
    // 注册组件
    components: {
      informationConfig,
      informationTemplete
    },
    data() {
      return {
        activeName: 'msgConfig'
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
