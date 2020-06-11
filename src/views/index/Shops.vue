<template>
  <div id="shops">
    <div class="top">
      <p>商铺管理</p>
      <el-button type="primary" @click="addShops">保存</el-button>
    </div>

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="店铺名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="店铺公告">
        <el-input type="textarea" v-model="form.bulletin"></el-input>
      </el-form-item>

      <el-form-item label="店铺头像">
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/shop/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="店铺图片">
        <el-upload
          action="http://127.0.0.1:5000/shop/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccessCopy"
          :file-list="filelist"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>

      <el-form-item label="配送费">
        <el-input v-model="form.deliveryPrice"></el-input>
      </el-form-item>
      <el-form-item label="配送时间">
        <el-input v-model="form.deliveryTime"></el-input>
      </el-form-item>
      <el-form-item label="配送描述">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="店铺评分">
        <el-input v-model="form.score"></el-input>
      </el-form-item>
      <el-form-item label="销量">
        <el-input v-model="form.sellCount"></el-input>
      </el-form-item>

      <el-form-item label="活动">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="在线支付满28减5" name="type"></el-checkbox>
          <el-checkbox label="VC无限橙果汁全场8折" name="type"></el-checkbox>
          <el-checkbox label="单人精彩套餐" name="type"></el-checkbox>
          <el-checkbox label="特价饮品8折抢购" name="type"></el-checkbox>
          <el-checkbox label="单人特色套餐" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="营业时间">
        <el-time-picker
          is-range
          v-model="date"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        ></el-time-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Info, EditShops } from "../../api/apis";

export default {
  data() {
    return {
      filelist: [],
      img: "",
      form: {
        name: "",
        deliveryPrice: "",
        deliveryTime: "",
        description: "",
        delivery: false,
        type: [],
        score: "",
        sellCount: "",
        // sellCount:'',
        bulletin: ""
      },
      imageUrl: "",
      date: "",
      pics: "",

      dialogImageUrl: "",
      dialogVisible: false
    };
  },

  created() {
    Info().then(res => {
      this.form.name = res.data.data.name;
      this.form.bulletin = res.data.data.bulletin;
      this.imageUrl =
        "http://127.0.0.1:5000/upload/shop/" + res.data.data.avatar;

      this.pics = res.data.data.pics.map(item => {
        this.filelist.push({
          url: "http://127.0.0.1:5000/upload/shop/" + item
        });
        return item;
      });
      // this.filelist = arr;
      console.log(this.pics);

      this.form.deliveryPrice = res.data.data.deliveryPrice;
      this.form.deliveryTime = res.data.data.deliveryTime;
      this.form.description = res.data.data.description;
      this.form.score = res.data.data.score;
      this.form.sellCount = res.data.data.sellCount;
      this.form.type = res.data.data.supports;
      this.date = res.data.data.date;
      this.id = res.data.data.id;
      // console.log(res);
    });
  },

  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.img = res.imgUrl;
      // console.log(this.img );
      // window.location.reload();
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
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      console.log(file.url);

      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleAvatarSuccessCopy(fileList) {
      console.log(fileList);
    },

    addShops() {
      // console.log(111);
      var {
        name,
        bulletin,
        deliveryPrice,
        deliveryTime,
        description,
        score,
        sellCount
      } = this.form;
      var id = this.id
      var avatar = this.img;
      var supports = JSON.stringify(this.form.type);
      var date = JSON.stringify(this.date);
      var pics = JSON.stringify(this.pics);

      // console.dir( instanceof supports);

      console.log(
        id,
        name,
        bulletin,
        avatar,
        deliveryPrice,
        deliveryTime,
        description,
        score,
        sellCount,
        supports,
        date,
        pics
      );

      EditShops(
        id,
        name,
        bulletin,
        avatar,
        deliveryPrice,
        deliveryTime,
        description,
        score,
        sellCount,
        supports,
        date,
        pics
      ).then(res => {
        console.log(res);
      });
    }
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
#shops {
  background-color: #fff;
  //   height: 600px;

  .top {
    height: 60px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
  .el-form {
    width: 450px;
    padding: 20px 0 20px 20px;
  }
}
</style>