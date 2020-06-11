<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="选择时间">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <div id="main" style="width: 100%;height:400px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { OrderTotal } from "../../api/apis";

export default {
  data() {
    return {
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
      value1: "",
      orderTime: [],
      orderAmount: []
    };
  },
  methods: {
    onSubmit() {
      // console.log(this.value1);

      OrderTotal(JSON.stringify(this.value1)).then(res => {
        // this.option = res.data.data;
        res.data.data.forEach(item => {
          this.orderTime.push(item.orderTime);
          this.orderAmount.push(item.orderAmount);
        });

        this.myChart.setOption({
          title: {
            text: ""
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },

          xAxis: {
            type: "category",
            boundaryGap: false,
            data: this.orderTime
          },

          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "邮件营销",
              type: "line",
              stack: "总量",
              data: this.orderAmount
            },
            {
              name: "联盟广告",
              type: "line",
              stack: "总量",
              data: this.orderAmount
            }
          ]
        });
        this.myChart.hideLoading();

        console.log(this.orderTime);
      });
    }
  },

  mounted() {
    this.myChart = echarts.init(document.getElementById("main"));

    this.myChart.showLoading();
    // console.log(this.orderTime);
    // this.myChart.setOption({
    //   title: {
    //     text: ""
    //   },
    //   tooltip: {
    //     trigger: "axis"
    //   },
    //   legend: {
    //     data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
    //   },
    //   grid: {
    //     left: "3%",
    //     right: "4%",
    //     bottom: "3%",
    //     containLabel: true
    //   },
    //   toolbox: {
    //     feature: {
    //       saveAsImage: {}
    //     }
    //   },

    //   xAxis: {
    //     type: "category",
    //     boundaryGap: false,
    //     data: this.orderTime
    //   },

    //   yAxis: {
    //     type: "value"
    //   },
    //   series: [
    //     {
    //       name: "邮件营销",
    //       type: "line",
    //       stack: "总量",
    //       data: [120, 132, 101, 134, 90, 230, 210]
    //     },
        
    //   ]
    // });
  }
};
</script>

<style lang="less" scoped>
</style>