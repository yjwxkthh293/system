<template>
  <div id="addacc">
    <p>添加账号</p>

    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="user">
        <el-input type="text" v-model="ruleForm.user"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass"></el-input>
      </el-form-item>

      <el-form-item label="用户组" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择用户组">
          <el-option label="超级管理员" value="超级管理员"></el-option>
          <el-option label="普通管理员" value="普通管理员"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addAccount } from "../../api/apis";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        user: "",
        pass: "",
        region: ""
      },
      rules: {
        user: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        region: [{ required: true, message: "请选择用户组", trigger: "blur" }]
      },
      isres: true
    };
  },
  methods: {
    submitForm(formName) {
      var user = this.ruleForm.user;
      var pass = this.ruleForm.pass;
      var region = this.ruleForm.region;

      //防抖节流
      if (this.isres == false) return;
      // console.log(user,pass,region);
      this.isres = false;

      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证成功发送axios
          addAccount(user, pass, region).then(res => {
            // console.log(res);
            if (res.data.code == 0) {
              this.$message({
                message: "添加账号成功",
                type: "success"
              });
             
            } else {
              this.$message.error("添加账号失败");
            }
          });
          // 失败不发送
        } else {
          // console.log("error submit!!");

          return false;
        }
      });

      setTimeout(() => {
        this.isres = true;
      }, 3000);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
#addacc {
  background-color: #fff;
  padding: 20px 0 20px 0;
  p {
    padding: 0 0 20px 20px;
    border-bottom: 1px solid #ccc;
  }
  .el-form {
    width: 450px;
    padding-top: 20px;
  }
}
</style>