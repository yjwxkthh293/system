import Vue from 'vue'
import App from './App.vue'

//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


import router from './router'

//引入公共样式
import './assets/css/common.css'

//使用element-ui
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
