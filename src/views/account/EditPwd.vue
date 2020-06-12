<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改密码</span>
      </div>

      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldpwd">
          <el-input type="text" v-model="ruleForm.oldpwd" @blur="sendoldpwd" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpass">
          <el-input type="text" v-model="ruleForm.newpass" autocomplete="off" show-password></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="text" v-model="ruleForm.checkPass" autocomplete="off" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { CheckOldPwd, EditPwd } from "../../api/apis";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newpass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        oldpwd: "",
        newpass: "",
        checkPass: ""
      },
      rules: {
        newpass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm() {
      var newpass = this.ruleForm.newpass;
      var id = localStorage.getItem("id");
      // console.log(newpass);

      EditPwd(newpass, id).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });

          setTimeout(() => {
            this.$router.push("/");
          }, 2000);
        }
      });
    },

    //失焦   检查旧密码是否正确
    sendoldpwd() {
      var oldpwd = this.ruleForm.oldpwd;
      var id = localStorage.getItem("id");
      CheckOldPwd(oldpwd, id).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },

    resetForm(formName) {
      // console.log( this.$refs[formName]);

      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
.el-form {
  width: 450px;
  padding-top: 20px;
}
</style>