<template>
  <div id="home">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/image/order1.svg" alt />
          <div class="num">
            <p>总订单</p>
            <span>{{totalOrder}}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/image/money1.svg" alt />
          <div class="num">
            <p>总销售额</p>
            <span>{{totalAmount}}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/image/order2.svg" alt />
          <div class="num">
            <p>今日订单数</p>
            <span>{{todayOrder}}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/image/money2.svg" alt />
          <div class="num">
            <p>今日销售额</p>
            <span>{{totayAmount}}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <div id="main" style="width: 100%;height:400px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { TotalData } from "../../api/apis";

export default {
  data() {
    return {
      totalOrder: "",
      totalAmount: "",
      todayOrder: "",
      totayAmount: ""
    };
  },
  mounted() {
    var myChart = echarts.init(document.getElementById("main"));

    TotalData().then(res => {
      let {
        xData,
        orderData,
        amountData,
        totalOrder,
        totalAmount,
        todayOrder,
        totayAmount
      } = res.data;

      this.totalOrder = totalOrder;
      this.totalAmount = totalAmount;
      this.todayOrder = todayOrder;
      this.totayAmount = totayAmount;

      myChart.showLoading();

      setTimeout(() => {
        myChart.setOption({
          title: {
            text: "数据统计"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["订单", "销售额", "注册人数", "管理人员人数"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },

          xAxis: {
            type: "category",
            boundaryGap: false,
            data: xData
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "订单",
              type: "line",
              stack: "总量",
              data: orderData
            },
            {
              name: "销售额",
              type: "line",
              stack: "总量",
              data: amountData
            }
          ]
        });
        myChart.hideLoading();
      }, 1000);
    });
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  height: 80px;
  background: #fff;
  display: flex;
  justify-content: space-between;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

#home {
  // height: 600px;
  // background-color: #fff;
  img {
    width: 100px;
    height: 60px;
    padding: 10px 0;
  }
  .num {
    padding: 10px 30px;
    text-align: center;
    p {
      font-size: 20px;
      color: #e9eef3;
      line-height: 30px;
    }
    span {
      font-weight: bold;
    }
  }
  #main {
    background-color: #fff;
    padding: 20px 0;
  }
}
</style>