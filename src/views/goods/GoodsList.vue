<template>
  <div id="goodslist">
    <p>商品列表</p>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>

            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>

            <el-form-item label="所属分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="商品价格">
              <span>{{ props.row.price }}</span>
            </el-form-item>
            <el-form-item label="商品图片">
              <span>
                <el-image
                  style="width: 50px; height: 50px"
                  :src="'http://127.0.0.1:5000/upload/imgs/goods_img/'+props.row.imgUrl"
                ></el-image>
              </span>
            </el-form-item>

            <el-form-item label="创建时间">
              <span>{{ props.row.ctime |formateDate }}</span>
            </el-form-item>
            
            <el-form-item label="商品评价">
              <span>{{ props.row.rating }}</span>
            </el-form-item>
            <el-form-item label="商品销量">
              <span>{{ props.row.sellCount }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.goodsDesc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="所属分类" prop="category"></el-table-column>
      <el-table-column label="商品价格" prop="price"></el-table-column>
      <el-table-column label="商品图片" prop="img">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="'http://127.0.0.1:5000/upload/imgs/goods_img/'+scope.row.imgUrl"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="goodsDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editBtn(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delBtn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 模态框 -->
    <el-dialog title="修改商品" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="商品名称" prop="user" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-input v-model="form.region" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="商品图片地址" :label-width="formLabelWidth">
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

        <el-form-item label="商品描述" :label-width="formLabelWidth">
          <el-input v-model="form.goodsDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editgoods">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页器 -->
    <el-pagination
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="pageSizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { GoodsList, DelGodds, EditGoods } from "../../api/apis";
import moment from "moment";

export default {
  data() {
    return {
      currentPage: 1, //当前页码
      pageSizes: [5, 10, 15, 20],
      pagesize: 5, //每页条数
      total: 0,
      // url: "",
      tableData: [],
      //修改商品的数据
      imageUrl: "",
      dialogFormVisible: false,
      formLabelWidth: "100px",
      form: {
        name: "",
        region: "",
        price: "",
        goodsDesc: "",
        img: ""
      }
    };
  },
  methods: {
    refresh(page) {
      GoodsList(page, this.pagesize).then(res => {
        // console.log(res);
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },

    handleSizeChange(val) {
      // console.log(val);
      this.pagesize = val;
      this.refresh(this.currentPage, val);
    },

    handleCurrentChange(val) {
      // console.log(val);
      this.currentPage = val;
      this.refresh(this.currentPage);
    },
    //点击发送删除接口
    delBtn(id) {
      //弹出二次确认框
      this.$confirm("此操作将永久删除这条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //点击确认发送删除接口
        DelGodds(id).then(res => {
          console.log(res);

          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: "success",
              duration: 1000,
              onClose: () => {
                this.refresh(this.currentPage);
              }
            });
          }
        });
      });
    },
    editBtn(row) {
 

      this.form.name = row.name;
      this.form.region = row.category;
      this.form.price = row.price;
      this.imageUrl =
        "http://127.0.0.1:5000/upload/imgs/goods_img/" + row.imgUrl;

      this.form.goodsDesc = row.goodsDesc;
      this.id = row.id;

      this.dialogFormVisible = true;
    },
    editgoods() {
      var name = this.form.name;
      var category = this.form.region;
      var price = this.form.price;
      var goodsDesc = this.form.goodsDesc;
      var id = this.id;
      var imgUrl = this.form.img;
      // console.log(name, imgUrl,category,price,goodsDesc,id);
      console.log(imgUrl);

      EditGoods(name, category, price, imgUrl, goodsDesc, id).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1000,
            onClose: () => {
              this.refresh(this.currentPage);
            }
          });
        }
        this.dialogFormVisible = false;
      });
    },

    handleAvatarSuccess(res, file) {
      console.log(res);
      this.imageUrl = URL.createObjectURL(file.raw);

      this.form.img = res.imgUrl;
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
    this.refresh(this.currentPage);
  },
  // 过滤器
  filters: {
    formateDate(v) {
      return moment(v).format("YYYY-MM-DD HH:MM:SS");
    }
  }
};
</script>

<style lang="less" scoped>
#goodslist {
  //   height: 600px;
  background-color: #fff;
  p {
    padding: 20px 0 10px 20px;
    border-bottom: 1px solid #ccc;
  }

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-pagination {
    padding: 20px 20px;
  }
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
}
</style>