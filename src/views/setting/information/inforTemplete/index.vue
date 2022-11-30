<template>
  <div>
    <div v-for="item in temphack" :key="item.title">
      <h3>{{item.title}}</h3>
      <el-input
        readonly
        :autosize="{ minRows: 3, maxRows: 4 }"
        resize="none"
        type="textarea"
        v-model="item.content"
        placeholder="撒大啊大大" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'inforTemplete',
    data() {
      return {
        temphack: [
          { title: '电流/电压异常消息模板', content: '测试测试测试！' },
          { title: '环境异常消息模板', content: '测试测试测试测试！' },
          { title: '温湿度异常消息模板', content: '测试测试测试！' }
        ]
      }
    },
    mounted() {
      this.getInforTemplete();
    },
    methods: {
      getInforTemplete() {
        // todo api 请求
        // res = this.temphack
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
