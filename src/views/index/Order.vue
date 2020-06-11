<template>
  <div id="order">
    <!-- 表单 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="订单号">
        <el-input v-model="formInline.orderNo" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="收货人">
        <el-input v-model="formInline.consignee" placeholder="收货人"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.phone" placeholder="手机号"></el-input>
      </el-form-item>

      <el-form-item label="订单状态">
        <el-select v-model="formInline.orderState" placeholder="订单状态">
          <el-option label="已完成" value="已完成"></el-option>
          <el-option label="派送中" value="派送中"></el-option>
          <el-option label="已受理" value="已受理"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择时间">
        <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="orderNo" label="订单号" width="100"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间" width="200">
        <template slot-scope="scope">{{ scope.row.orderTime | formateDate}}</template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
      <el-table-column prop="deliverAddress" label="配送地址" width="300"></el-table-column>
      <el-table-column prop="deliveryTime" label="送达时间" width="200">
        <template slot-scope="scope">{{ scope.row.deliveryTime | formateDate}}</template>
      </el-table-column>
      <el-table-column prop="remarks" label="用户备注" width="120"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
      <el-table-column prop="orderState" label="订单状态" width="120"></el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit( scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看模态框 -->
    <el-dialog title="订单详情" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="orderNo" label="订单号" width="150"></el-table-column>
        <el-table-column property="orderTime" label="下单时间" width="200">
          <template slot-scope="scope">{{ scope.row.orderTime | formateDate}}</template>
        </el-table-column>
        <el-table-column property="phone" label="手机号"></el-table-column>
        <el-table-column property="consignee" label="收货人"></el-table-column>
        <el-table-column property="deliverAddress" label="配送地址"></el-table-column>
        <el-table-column property="deliveryTime" label="送达时间"  width="200">
          <template slot-scope="scope">{{ scope.row.deliveryTime | formateDate}}</template>
        </el-table-column>
        <el-table-column property="remarks" label="用户备注"></el-table-column>
        <el-table-column property="orderAmount" label="订单金额"></el-table-column>
        <el-table-column property="orderState" label="订单状态"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 编辑模态框 -->
    <el-dialog title="修改订单" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="订单号" prop="orderNo" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.orderNo"></el-input>
        </el-form-item>

        <el-form-item label="下单时间" prop="orderTime" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.orderTime"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.phone"></el-input>
        </el-form-item>

        <el-form-item label="收货人" prop="consignee" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.consignee"></el-input>
        </el-form-item>

        <el-form-item label="配送地址" prop="deliverAddress" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.deliverAddress"></el-input>
        </el-form-item>

        <el-form-item label="送达时间" prop="deliveryTime" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.deliveryTime"></el-input>
        </el-form-item>

        <el-form-item label="用户备注" prop="remarks" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.remarks"></el-input>
        </el-form-item>

        <el-form-item label="订单金额" prop="orderAmount" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.orderAmount"></el-input>
        </el-form-item>

        <el-form-item label="订单状态" prop="orderState" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.orderState"></el-input>
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
  </div>
</template>

<script>
import { OrderList, Search, EditOrder, Detail } from "../../api/apis";
import moment from "moment";

export default {
  data() {
    return {
      // 点击编辑里的数据
      dialogFormVisible: false,
      formLabelWidth: "100px",
      form: {
        orderNo: "",
        orderTime: "",
        phone: "",
        consignee: "",
        deliverAddress: "",
        deliveryTime: "",
        remarks: "",
        orderAmount: "",
        orderState: "",
        id: ""
      },

      formInline: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: ""
      },

      //时间选择器的数据
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      date: "",
      // value2: "",

      tableData: [],
      currentPage: 1, //当前页码
      pageSizes: [5, 10, 15, 20],
      pagesize: 5, //每页条数
      total: 0,

      //点击查看里的数据
      gridData: [],
      dialogTableVisible: false
    };
  },
  methods: {
    onSubmit() {
      // var
      let { currentPage, pagesize, date } = this;
      let { orderNo, consignee, phone, orderState } = this.formInline;
      Search(
        currentPage,
        pagesize,
        orderNo,
        consignee,
        phone,
        orderState,
        date
      ).then(res => {
        this.tableData = res.data.data;
      });

      // console.log(date.toLocaleString());
    },
    // 封装一个获取订单列表实现刷新页面
    refresh(page) {
      OrderList(page, this.pagesize).then(res => {
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
    },

    //点击查看详情
    handleClick(id) {
      this.dialogTableVisible = true;
      Detail(id).then(res => {
        let arr = [];
        arr.push(res.data.data);

        this.gridData = arr;
        // console.log(this.gridData);
        // console.log();
      });
    },
    handleEdit(row) {
      this.form.orderNo = row.orderNo;
      this.form.consignee = row.consignee;
      this.form.deliverAddress = row.deliverAddress;
      this.form.deliveryTime = row.deliveryTime;
      this.form.orderAmount = row.orderAmount;
      this.form.orderState = row.orderState;
      this.form.orderTime = row.orderTime;
      this.form.phone = row.phone;
      this.form.remarks = row.remarks;
      this.form.id = row.id;

      this.dialogFormVisible = true;
    },
    editAccount() {
      let {
        id,
        orderNo,
        orderTime,
        phone,
        consignee,
        deliverAddress,
        deliveryTime,
        remarks,
        orderAmount,
        orderState
      } = this.form;

      EditOrder(
        id,
        orderNo,
        orderTime,
        phone,
        consignee,
        deliverAddress,
        deliveryTime,
        remarks,
        orderAmount,
        orderState
      ).then(res => {
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
  },
  // 过滤器
  filters: {
    formateDate(v) {
      // console.log(v);

      return moment(v).format("YYYY-MM-DD HH:MM:SS");
    }
  }
};
</script>

<style lang="less" scoped>
#order {
  height: 600px;
  background-color: #fff;
  .el-form {
    padding: 20px 0 0 20px;
  }
}
</style>