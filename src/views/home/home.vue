<template>
  <div class="home">
    <img class="bg" src="./home.png">

    <div class="row1">你好，<span v-text="user.name"></span>!</div>
    <div class="row2">欢迎光临</div>
    <div class="row3">让我们开始今天的工作吧！</div>
  </div>
</template>

<style lang="less" scoped>
  .home {
    position: relative;
    color: white;

    .bg {
      width: 100%;
      padding: 20px;
    }

    .row1 {
      position: absolute;
      left: 80px;
      top: 50px;
      font-size: 28px;
      font-weight: bold;
    }

    .row2 {
      position: absolute;
      left: 80px;
      top: 80px;
      font-size: 28px;
      font-weight: bold;
    }

    .row3 {
      position: absolute;
      left: 80px;
      top: 200px;
      font-size: 14px;
    }
  }


</style>

<script>
  import {mapGetters} from "vuex";

  export default {
    components: {},
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {},
    data() {
      return {}
    },
    mounted() {
    }
  }
</script>
