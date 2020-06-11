import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import { CheckToken } from '../api/apis'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/Index.vue'),

    children: [
      {
        path: '/index/home',
        name: 'home',
        component: () => import('../views/index/Home'),
        mate:{role:['super','normal']}
      },
      {
        path: '/index/order',
        name: 'order',
        component: () => import('../views/index/Order'),
      },
      {
        path: '/index/shops',
        name: 'shops',
        component: () => import('../views/index/Shops'),
      },
      {
        path: '/index/person',
        name: 'person',
        component: () => import('../views/index/Person'),
      },

      //账号管理
      {
        path: '/account/accountlist',
        name: 'accountlist',
        component: () => import('../views/account/AccountList'),
      },
      {
        path: '/account/editpwd',
        name: 'editpwd',
        component: () => import('../views/account/EditPwd'),
      },
      {
        path: '/account/addaccount',
        name: 'addaccount',
        component: () => import('../views/account/AddAccount'),
      },

      //商品管理
      {
        path: '/goods/addgoods',
        name: 'addgoods',
        component: () => import('../views/goods/AddGoods'),
      },
      {
        path: '/goods/goodsclassify',
        name: 'goodsclassify',
        component: () => import('../views/goods/GoodsClassify'),
      },
      {
        path: '/goods/goodslist',
        name: 'goodslist',
        component: () => import('../views/goods/GoodsList'),
      },

      //销售统计
      {
        path: '/statistics/goodsstatistics',
        name: 'goodsstatistics',
        component: () => import('../views/statistics/GoodsStatistics'),
      },
      {
        path: '/statistics/orderstatistics',
        name: 'orderstatistics',
        component: () => import('../views/statistics/OrderStatistics'),
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {

  if (to.path != '/') {

    CheckToken(localStorage.token).then(res => {

      // console.log(res);
      
      if (res.data.code == 0) {
        next()
      } else {
        next('/')
      }
    })

  } else {
    next()
  }

})
export default router
