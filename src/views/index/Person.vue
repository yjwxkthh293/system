<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>个人中心</span>
    </div>
    <div>
      <p>管理员ID：{{list.id}}</p>
      <p>账号：{{list.account}}</p>
      <p>用户组：{{list.userGroup}}</p>
      <p>创建时间：{{list.ctime | formateDate}}</p>

      <div class="photo">
        <p>用户头像：</p>
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/users/avatar_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="data"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script>
import { AcountInfo } from "../../api/apis";
import moment from "moment";

export default {
  data() {
    return {
      data: { id: localStorage.getItem("id") },
      list: [],
      imageUrl: ""
    };
  },
  methods: {
    handleAvatarSuccess() {
      console.log(this.imageUrl);

      window.location.reload();
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  created() {
    var id = localStorage.getItem("id");
    AcountInfo(id).then(res => {
      // console.log(res);

      this.list = res.data.accountInfo;
      this.imageUrl = res.data.accountInfo.imgUrl;
    });
  },
  // 过滤器
  filters: {
    formateDate(v) {
      return moment(v).format("YYYY-MM-DD HH:MM:SS");
    }
  }
};
</script>


<style>
.box-card .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>

<style lang="less" scoped>
p {
  padding: 20px 0;
}
.photo {
  display: flex;
  align-items: center;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>