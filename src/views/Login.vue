<template>
  <div id="login" class="login">
    <div class="login_div">
      <h2>天娱系统登陆</h2>

      <div class="input_div">
        <el-input prefix-icon="el-icon-user" v-model="user"></el-input>

        <el-input prefix-icon="el-icon-lock" v-model="pwd" show-password></el-input>

        <el-button type="primary" @click="login_btn">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Login } from "../api/apis";

export default {
  data() {
    return {
      user: "",
      pwd: "",
      isres: true
    };
  },
  methods: {
    login_btn() {
      if (this.isres == false) return;

      this.isres = false;
      Login(this.user, this.pwd).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "恭喜你，登陆成功",
            type: "success"
          });

          localStorage.token = res.data.token;
          localStorage.user = this.user;
          localStorage.setItem("id", res.data.id);
          localStorage.role = res.data.role;

          setTimeout(() => {
            this.$router.push("./index/home");
          }, 1500);
        } else {
          this.$message.error("用户名和密码错误");
        }
      });

      setTimeout(() => {
        this.isres = true;
      }, 3000);
    }
  }
};
</script>

<style>
#login .el-input__inner {
  background-color: #2d3a4b;
}
</style>

<style lang='less' scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #2d3a4b;
  .login_div {
    width: 350px;
    h2 {
      color: #fff;
      margin: 0;
      text-align: center;
    }
    .input_div {
      padding: 20px 0;
      .el-button {
        width: 100%;
        margin: 10px 0;
      }
      .el-input {
        padding: 10px 0;
      }
    }
  }
}
</style>