<!--
 * @FileDescription: 正式页面
 * @Author: FuWB
 * @Date: 2021/04/03
 * @LastEditors: FuWB
 * @LastEditTime: 2021/04/03
 -->
<template>
  <div>
    <div class="wrapper">
    <!-- 页面头部部分 -->
      <div class="header">
        <div class="logo">记账管理系统</div>
        <!-- 水平一级菜单 -->
        <div style="float:left;">
          <el-menu :default-active="toIndex()" mode="horizontal" @select="handleSelect">
            <template v-for="item in items">
              <el-menu-item :index="item.index" :key="item.index">
              <template slot="title">
                  <span slot="title">{{ item.title }}</span>
              </template>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
        <div class="header-right">
          <div class="header-user-con">
            <!-- 用户头像 -->
            <div class="user-avator"><img src='../assets/image/headPortrait.jpg' /></div>
            <!-- 用户名下拉菜单 -->
            <el-dropdown class="user-name" trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                {{ username }}
                <i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item disabled>修改密码</el-dropdown-item>
                <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <!--页面左侧二级菜单栏，和主体内容区域部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      username: 'FuWB',
      items: [
        {index: 'home', title: '首页'},
        {index: 'staff', title: '员工管理'},
        {index: 'order', title: '订单管理'},
        {index: 'bill', title: '每日记账'},
        {index: 'salary', title: '工资结算'},
        {index: 'permission', title: '权限管理'}
      ]
    }
  },
  methods: {
    // 根据路径绑定到对应的一级菜单，防止页面刷新重新跳回第一个
    toIndex () {
      return this.$route.path.split('/')[1]
    },
    // 切换菜单栏
    handleSelect (index) {
      this.$router.push('/' + index)
    },
    // 用户名下拉菜单选择事件
    handleCommand (command) {
      if (command === 'loginout') {
        localStorage.removeItem('ms_username')
        this.$router.push('/')
      }
    }
  }
}
</script>
<style scoped>
.wrapper {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
}
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    background: #ffffff;
}
.header .logo {
    float: left;
    margin-left: 60px;
    margin-top: 17.5px;
    height: 29px;
    width: 160px;
    vertical-align: middle;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.user-name {
    margin-left: 10px;
}
.el-menu.el-menu--horizontal {
    border-bottom: none !important;
    float: left;
    margin-left: 50px;
}
.el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 2px solid #038387;
    color: #038387;
    font-weight: 700;
}
.el-menu--horizontal > .el-menu-item {
    font-size: 16px;
    margin: 0 15px;
    color: black;
}
</style>
