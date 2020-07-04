<template>
  <div id="shops">
    <div class="top">
      <p>商铺管理</p>
      <el-button type="primary" @click="addShops">保存</el-button>
    </div>

    <el-form ref="shop" :model="shop" label-width="80px">
      <el-form-item label="店铺名称">
        <el-input v-model="shop.name"></el-input>
      </el-form-item>

      <el-form-item label="店铺公告">
        <el-input type="textarea" v-model="shop.bulletin"></el-input>
      </el-form-item>

      <el-form-item label="店铺头像">
        <el-upload
          class="avatar-uploader"
          :action="SHOP_UPLOND"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="shop.avatar" :src=" SHOPS + shop.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="店铺图片">
        <el-upload
          :action="SHOP_UPLOND"
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
        <el-input v-model="shop.deliveryPrice"></el-input>
      </el-form-item>
      <el-form-item label="配送时间">
        <el-input v-model="shop.deliveryTime"></el-input>
      </el-form-item>
      <el-form-item label="配送描述">
        <el-input v-model="shop.description"></el-input>
      </el-form-item>
      <el-form-item label="店铺评分">
        <el-input v-model="shop.score"></el-input>
      </el-form-item>
      <el-form-item label="销量">
        <el-input v-model="shop.sellCount"></el-input>
      </el-form-item>

      <el-form-item label="活动">
        <el-checkbox-group v-model="type">
          <el-checkbox v-for="item in supports" :key="item" :label="item"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="营业时间">
        <el-time-picker
          is-range
          v-model="shop.date"
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
import { Info, EditShops, shop_upland, shops } from "../../api/apis";

export default {
  data() {
    return {
      filelist: [],

      shop: {},
      type: [],

      imageUrl: "",
      supports: [
        "在线支付满28减5",
        "VC无限橙果汁全场8折",
        "单人精彩套餐",
        "特价饮品8折抢购",
        "单人特色套餐"
      ],

      dialogImageUrl: "",
      dialogVisible: false,

      SHOP_UPLOND: shop_upland,
      SHOPS: shops
    };
  },

  created() {
    Info().then(res => {
      this.shop = res.data.data;

      this.shop.pics.map(item => {
        this.filelist.push({
          url: this.SHOPS + item
        });
        return item;
      });

      this.type = this.shop.supports;

      // console.log(this.shop);
    });
  },

  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.shop.avatar = res.imgUrl;
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

    handleRemove(file) {
      // console.log(file);
      let index = this.shop.pics.findIndex(item => item.uid === file.uid);

      this.shop.pics.splice(index, 1);
      // console.log(this.shop.pics);
    },
    handlePictureCardPreview(file) {
      console.log(file.url);

      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleAvatarSuccessCopy(res) {
      this.pics.push(res.imgUrl);
    },

    addShops() {
      var newobj = { ...this.shop };
      newobj.supports = JSON.stringify(this.type);
      newobj.date = JSON.stringify(this.shop.date);
      newobj.pics = JSON.stringify(this.shop.pics);

      EditShops(newobj).then(res => {
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