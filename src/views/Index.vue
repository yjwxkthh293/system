<template>
  <div id="home" class="home">
    <el-container>
      <!-- 左侧 -->
      <el-aside width="200px">
        <div class="top">
          <i class="el-icon-dish-1"></i>
          <span>外卖商家中心</span>
        </div>
        <div class="bottom">
          <el-row class="tac">
            <el-col :span="12">
              <el-menu
                :default-active="$route.path"
                class="el-menu-vertical-demo"
                background-color="#2d3a4b"
                text-color="#fff"
                active-text-color="#409EFF"
                router
                unique-opened
              >
                <div v-for="item in newmenulist" :key="item.index">
                  <el-submenu v-if="item.children" :index="item.index">
                    <template slot="title">
                      <i :class="item.icon"></i>
                      <span>{{item.title}}</span>
                    </template>

                    <el-menu-item-group v-for="ch in item.children" :key="ch.index">
                      <el-menu-item :index="ch.index">{{ch.title}}</el-menu-item>
                    </el-menu-item-group>
                  </el-submenu>

                  <el-menu-item v-else :index="item.index">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.title}}</span>
                  </el-menu-item>
                </div>
              </el-menu>
            </el-col>
          </el-row>
        </div>
      </el-aside>
      <!-- 右侧 -->
      <el-container>
        <el-header>
          <!-- <Header></Header> -->
          <div class="left">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-for="item in breadcrumblist" :key="item">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="right">
            <p>
              欢迎你，
              <span>{{username}}</span>
            </p>

            <el-dropdown @command="handleCommand">
              <div class="block">
                <el-avatar :size="50" :src="circleUrl"></el-avatar>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout">注销</el-dropdown-item>
                <el-dropdown-item></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>

        <el-main>
          <!-- 二级路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { CheckToken, AcountInfo } from "../api/apis";

export default {
  data() {
    return {
      username: "",

      defaultActive: "",
      breadcrumblist: ["首页"],
      circleUrl: "",
      squareUrl:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      sizeList: ["large", "medium", "small"],

      role: "", //保存用户角色
      menulist: [
        {
          index: "/index/home",
          icon: "el-icon-s-home",
          title: "后台首页",
          role: ["super", "normal"]
        },
        {
          index: "/index/order",
          icon: "el-icon-document",
          title: "订单管理",
          role: ["super"]
        },
        {
          index: "goods",
          icon: "el-icon-shopping-bag-1",
          title: "商品管理",
          role: ["super", "normal"],
          children: [
            { index: "/goods/goodslist", title: "商品列表" },
            { index: "/goods/addgoods", title: "添加商品" },
            { index: "/goods/goodsclassify", title: "商品分类" }
          ]
        },
        {
          index: "/index/shops",
          icon: "el-icon-s-shop",
          title: "店铺管理",
          role: ["super", "normal"]
        },
        {
          index: "account",
          icon: "el-icon-user-solid",
          title: "账号管理",
          role: ["super"],
          children: [
            { index: "/account/accountlist", title: "账号列表" },
            { index: "/account/addaccount", title: "添加账号" },
            { index: "/account/editpwd", title: "修改密码" }
          ]
        },
        {
          index: "statistics",
          icon: "el-icon-pie-chart",
          title: "销售统计",
          role: ["super"],
          children: [
            { index: "/statistics/goodsstatistics", title: "商品统计" },
            { index: "/statistics/orderstatistics", title: "订单统计" }
          ]
        }
      ]
    };
  },
  components: {},
  methods: {
    editdefaultActive(hash) {
      let arr = [];
      switch (hash) {
        case "/index/home":
          arr = ["首页"];
          break;
        case "/index/order":
          arr = ["订单管理"];
          break;
        case "/index/shops":
          arr = ["店铺管理"];
          break;
        case "/index/person":
          arr = ["个人中心"];
          break;

        case "/goods/addgoods":
          arr = ["商品管理", "商品添加"];
          break;
        case "/goods/goodslist":
          arr = ["商品管理", "商品列表"];
          break;
        case "/goods/goodsclassify":
          arr = ["商品管理", "商品分类"];
          break;
        case "/account/accountlist":
          arr = ["账号管理", "账号列表"];
          break;
        case "/account/editpwd":
          arr = ["账号管理", "修改密码"];
          break;
        case "/account/addaccount":
          arr = ["账号管理", "添加账号"];
          break;
        case "/statistics/goodsstatistics":
          arr = ["销售统计", "商品统计"];
          break;
        case "/statistics/orderstatistics":
          arr = ["销售统计", "订单统计"];
          break;
      }
      this.breadcrumblist = arr;
    },

    handleCommand(command) {
      const vm = this;
      if (command === "logout") {
        //注销
        vm.$router.push("/");
        localStorage.removeItem("token");
      } else if (command === "personal") {
        vm.$router.push("/index/person");
      }
    }

    // logout() {
    //   console.log(11);
    // }
  },

  watch: {
    $route: {
      handler: function(val) {
        // console.log(val.path);
        window.that.editdefaultActive(val.path);
      }
    }
  },
  created() {
    let hash = this.$route.path;
    //根据hash值改变左侧树菜单默认选中
    // this.defaultActive = hash;

    this.editdefaultActive(hash);

    window.that = this;

    // console.log(localStorage.token);
    // 验证token是否过期
    CheckToken(localStorage.token).then(() => {
      this.username = localStorage.user;
    });

    //获取本地保存的用户角色
    this.role = localStorage.role;
    // console.log(this.role);

    var id = localStorage.getItem("id");
    AcountInfo(id).then(res => {
      // console.log(res);

      this.circleUrl = res.data.accountInfo.imgUrl;
      // console.log(this.list);
    });
  },

  computed: {
    newmenulist() {
      return this.menulist.filter(item => item.role.includes(this.role));
    }
  }
};
</script>


<style>
#home .el-menu-item-group__title {
  padding: 0;
}
</style>

<style lang='less' scoped>
.el-container {
  height: 100%;
}

.el-aside {
  background-color: #2d3a4b;
}

.el-main {
  background-color: #e9eef3;
}
.top {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  i {
    width: 50px;
    height: 50px;
    background-color: #1296db;
    font-size: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  span {
    color: #fff;
    display: flex;
    align-items: center;
    text-indent: 10px;
    font-weight: bold;
  }
}
.bottom {
  .el-col-12 {
    width: 200px;
  }
  .el-menu {
    border: 0;
  }
}

.el-header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .left {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .right {
    display: flex;
    align-items: center;

    p {
      margin: 0 20px;
      span {
        font-size: 18px;
        color: #f60;
      }
    }
  }
}
</style>
