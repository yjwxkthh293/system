<template>
  <div id="addgoods">
    <p>商品添加</p>

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="商品名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="商品分类">
        <el-select v-model="form.region" placeholder="请选择商品分类">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.cateName"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品价格">
        <el-input-number v-model="num" :min="1" :max="1000" label="描述文字"></el-input-number>
      </el-form-item>

      <el-form-item label="商品图片">
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/goods/goods_img_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="商品描述">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Add, CateGories } from "../../api/apis";

export default {
  data() {
    return {
      imageUrl: "",
      num: 1,
      form: {
        img: "",
        name: "",
        region: "",
        desc: ""
      },
      options: []
    };
  },
  methods: {
    onSubmit() {
      var name = this.form.name;
      var category = this.form.region;
      var price = this.num;
      var imgUrl = this.form.img;
      var goodsDesc = this.form.desc;
      // console.log(name, category, price, imgUrl, goodsDesc);
      Add(name, category, price, imgUrl, goodsDesc).then(res => {
        // console.log(res);

        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1000
          });
          window.location.reload();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },

    handleAvatarSuccess(res, file) {
      // console.log(res);

      this.imageUrl = URL.createObjectURL(file.raw);

      this.form.img = res.imgUrl;
      // console.log(this.form.img);
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
    CateGories().then(res => {
      this.options = res.data.categories;

      console.log(this.options);
    });
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
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

<style lang="less" scoped>
#addgoods {
  //   height: 600px;
  background-color: #fff;
  padding: 20px;

  p {
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }
  .el-form {
    width: 450px;
    padding-top: 20px;
  }
}
</style>