<template>
  <div class="login">
    <div class="login-content">
      <div class="login-left">
        <img src="../assets/images/left_03.png" alt="">
      </div>
      <div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <h2 class="title">新型智能电源精细化管理系统</h2>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="账号"
            >
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>
          <!-- <el-form-item prop="code" v-if="captchaOnOff">
            <el-input
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img"/>
            </div>
          </el-form-item> -->
          <el-checkbox
            v-model="loginForm.rememberMe"
            style="margin: 0px 0px 25px 0px"
          >记住密码
          </el-checkbox
          >
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              size="medium"
              style="width: 100%"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <div style="float: right" v-if="register">
              <router-link class="link-type" :to="'/register'"
              >立即注册
              </router-link
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span v-text="copyRight"></span>
    </div> -->
  </div>
</template>

<script>
  import {getCodeImg} from "@/api/index";
  import {decrypt, encrypt} from "@/utils/jsencrypt";
  import {local_uuid} from '@/utils/index'

  export default {
    name: "Login",
    data() {
      return {
        //验证码数据
        codeUrl: "",
        //表单数据
        loginForm: {
          username: "",
          password: "",
          rememberMe: false,
          code: ""
        },
        //表单校验规则
        loginRules: {
          username: [{required: true, trigger: "blur", message: "请输入您的账号"}],
          password: [
            { required: true, trigger: "blur", message: "请输入您的密码" },
            // { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: '至少包含八个字符，包含字母和数字', trigger: 'change' }
        ],
          // code: [{required: true, trigger: "change", message: "请输入验证码"}],
        },
        //登录状态
        loading: false,
        //验证码开关
        captchaOnOff: true,
        //注册开关
        register: false,
        //登录成功后跳转地址
        redirect: undefined,
        //版权信息
        copyRight: process.env.COPY_RIGHT
      };
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true,
      },
    },
    created() {
      // this.getCode();
      this.getCookie();
    },
    methods: {
      // getCode() {
      //   let value = local_uuid();
      //   getCodeImg({value}).then((res) => {
      //     this.codeUrl = "data:image/gif;base64," + res;
      //   });
      // },
      getCookie() {
        const username = localStorage.username;
        const password = localStorage.password;
        const rememberMe = localStorage.rememberMe;
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        };
      },
      handleLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            if (this.loginForm.rememberMe) {
              localStorage.setItem("username", this.loginForm.username);
              localStorage.setItem("password", encrypt(this.loginForm.password));
              localStorage.setItem("rememberMe", this.loginForm.rememberMe);
            } else {
              localStorage.removeItem("username");
              localStorage.removeItem("password");
              localStorage.removeItem("rememberMe");
            }
            this.$store
              .dispatch("Login", this.loginForm)
              .then(() => {
                this.$router.push({path: this.redirect || "/"})
              })
              .catch(() => {
                this.loading = false;
                if (this.captchaOnOff) {
                  // this.getCode();
                }
              });
          }
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/images/login-bg.png");
    background-size: cover;
  }

  .login-content {
    border-radius: 5px;
    width: 50%;
    height: 55%;
    background-color: #fff;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .login-left {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    .el-input {
      height: 38px;

      input {
        height: 38px;
      }
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }

  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .login-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }

  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .login-code-img {
    height: 38px;
  }

  .el-button {
    background-color: #168E84;
    color: #fff;
  }
</style>
