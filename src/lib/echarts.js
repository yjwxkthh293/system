// 引入echarts
import Vue from "vue";
import echarts from "echarts";

function VueChart() {
    Vue.prototype.$echarts = echarts;
}

export default VueChart