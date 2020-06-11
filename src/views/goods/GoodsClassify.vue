<template>
  <div id="goodsclassify">
    <div class="top">
      <p>商品分类</p>
      <el-button type="primary" @click="dialogFormVisible = true">添加分类</el-button>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="序号" width="180"></el-table-column>
      <el-table-column prop="cateName" label="分类名称" width="180"></el-table-column>
      <el-table-column label="是否启用" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="edltBtn(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delBtn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加商品模态框 -->
    <el-dialog title="添加商品" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.region" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch v-model="form.state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClassify">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑模态框 -->
    <el-dialog title="修改商品" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.region" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch v-model="form.state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClassify">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { CateList, DelCate, AddCate, EditCate } from "../../api/apis";

export default {
  data() {
    return {
      currentPage: 1, //当前页码
      pageSizes: [5, 10, 15, 20],
      pagesize: 5, //每页条数
      total: 0,
      tableData: [],

      value: true,
      dialogFormVisible: false,
      form: {
        region: "",
        state: ""
      },
      formLabelWidth: "100px"
    };
  },
  methods: {
    refresh(page) {
      CateList(page, this.pagesize).then(res => {
        // console.log(res);

        res.data.data.forEach(item => {
          item.state = item.state ? true : false;
        });
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },

    // 删除分类接口
    delBtn(id) {
      DelCate(id).then(res => {
        // console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success",
            duration: 2000,
            onClose: () => {
             this.refresh(this.currentPage);
            }
          });
        }
      });
    },

    handleSizeChange(val) {
      this.pagesize = val;
      this.refresh(this.currentPage,val);
    },

    handleCurrentChange(val) {
      // console.log(val);

      this.currentPage = val;
      this.refresh(this.currentPage);
    },

    //点击添加商品
    addClassify() {
      this.dialogFormVisible = false;
      var cateName = this.form.region;
      var state = this.form.state;

      // console.log(cateName);
      AddCate(cateName, JSON.stringify(state)).then(res => {
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
    },

    //点击编辑打开模态框
    edltBtn(row) {
      // console.log(row);
      //回填分类名称和分类状态
      this.form.region = row.cateName;
      this.form.state = row.state;
      //把编辑行的id挂在this身上，
      this.id = row.id;
      this.dialogFormVisible = true;
    },
    //点击确定发送修改商品分类的接口
    editClassify() {
      var id = this.id;
      var cateName = this.form.region;
      var state = this.form.state;

      // console.log(id, cateName, state);
      EditCate(id, cateName, JSON.stringify(state) ).then(res => {
        // console.log(res);
        
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
    }
  },

  created() {
    this.refresh(this.currentPage);
  }
};
</script>

<style lang="less" scoped>
#goodsclassify {
  background-color: #fff;

  .top {
    height: 60px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
  .el-table {
    padding: 20px 0 0 20px;
  }
  .el-pagination {
    padding: 20px 20px;
  }
}
</style>