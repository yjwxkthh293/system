<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账号列表</span>
      </div>

      <el-table
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="账号" width="120">
          <template slot-scope="scope">{{ scope.row.account }}</template>
        </el-table-column>
        <el-table-column prop="name" label="用户组" width="120">
          <template slot-scope="scope">{{ scope.row.userGroup }}</template>
        </el-table-column>
        <el-table-column prop="address" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.ctime | formateDate}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit( scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 模态框 -->
      <el-dialog title="修改账号" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="账号" prop="user">
            <el-input type="text" v-model="form.user"></el-input>
          </el-form-item>

          <el-form-item label="用户组" prop="region">
            <el-select v-model="form.region" placeholder="请选择用户组">
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通管理员" value="普通管理员"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAccount">确 定</el-button>
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

      <div style="margin-top: 20px">
        <el-button type="danger" @click="toggleSelection">批量删除</el-button>
        <el-button type="primary">取消选择</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { AcountList, delAccount, BatchDel, EditAccount } from "../../api/apis";
import moment from "moment";

export default {
  data() {
    return {
      currentPage: 1, //当前页码
      pageSizes: [5, 10, 15, 20],
      pagesize: 5, //每页条数
      total: 0,
      tableData: [],

      multipleTable: [],
      // 模态框data
      dialogFormVisible: false,
      formLabelWidth: "100px",
      form: {
        user: "",
        region: ""
      }
    };
  },
  methods: {
    //点击发送删除接口
    handleDelete($) {
      //弹出二次确认框
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //点击确认发送删除接口
        delAccount($).then(res => {
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

    //点击批量删除发送接口
    toggleSelection() {
      if (!this.newarr || this.newarr.length == 0) {
        this.$message.error("请选中数据");
        return;
      }

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        BatchDel(JSON.stringify(this.newarr)).then(res => {
          // console.log(res);
          this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1000,
            onClose: () => {
              this.refresh(this.currentPage);
            }
          });
        });
      });
    },
    // 获取点击inout框选中的值
    handleSelectionChange(val) {
      this.newarr = val.map(item => {
        return item.id;
      });
    },

    //点击编辑修改账号
    handleEdit(row) {
      // console.log(row);
      //回填账号和角色
      this.form.user = row.account;
      this.form.region = row.userGroup;

      //把编辑行的id挂在this身上，
      this.id = row.id;

      this.dialogFormVisible = true;
    },
    editAccount() {
      // console.log(this.id);
      var id = this.id;
      var account = this.form.user;
      var userGroup = this.form.region;

      // console.log(id, account, userGroup);
      EditAccount(id, account, userGroup).then(res => {
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
    // 封装一个获取账号列表实现刷新页面
    refresh(page) {
      AcountList(page, this.pagesize).then(res => {
        // console.log(res);
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },

    handleSizeChange(val) {
      this.pagesize = val;
      this.refresh(this.currentPage, val);
    },

    handleCurrentChange(val) {
      // console.log(val);

      this.currentPage = val;
      this.refresh(this.currentPage);
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
.el-pagination {
  padding-top: 20px;
}
.el-form-item {
  display: flex;
}
</style>