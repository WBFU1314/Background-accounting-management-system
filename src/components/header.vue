<!--
 * @FileDescription: 正式页面
 * @Author: FuWB
 * @Date: 2021/04/03
 * @LastEditors: FuWB
 * @LastEditTime: 2021/04/03
 -->
<template>
  <div class="wrapper">
    <!-- 页面头部部分 -->
    <div class="header">
      <div>
        <div class="logo" @click="goHome()">记账管理系统</div>
        <!-- 水平一级菜单 -->
        <div style="float: left">
          <el-menu
            :default-active="toIndex()"
            mode="horizontal"
            @select="handleSelect"
          >
            <template v-for="item in items">
              <el-menu-item :index="item.index" :key="item.index">
                <template slot="title">
                  <span slot="title">{{ item.title }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </div>
      <div class="header-right">
        <div class="header-user-con">
          <div class="themeColor" @click="changeThemeColor">
            <i class="el-icon-sunny" v-if="flag" style="color: #ffffff"></i>
            <i class="el-icon-moon" v-else></i>
          </div>
          <!-- 用户头像 -->
          <div class="user-avator">
            <img src="../assets/image/headPortrait.jpg" width="100" height="100" />
          </div>
          <!-- 用户名下拉菜单 -->
          <el-dropdown
            class="user-name"
            trigger="click"
            @command="handleCommand"
          >
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
</template>
<script>
import { getUserId, setUserName } from '../utils/auth'
export default {
  data () {
    return {
      username: '',
      items: [
        { index: 'home', title: '首页' },
        { index: 'staff', title: '员工管理' },
        { index: 'order', title: '订单管理' },
        { index: 'bill', title: '每日记账' },
        { index: 'salary', title: '工资结算' },
        { index: 'permission', title: '权限管理' }
      ],
      flag: false
    }
  },
  mounted () {
    let params = {
      accountNo: getUserId()
    }
    this.$axios.get('api/userInfo', { params }).then((res) => {
      this.username = res.data.username
      setUserName(res.data.username)
    })
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
    changeThemeColor () {
      this.flag = !this.flag
      var r = document.querySelector(':root')
      if (!this.flag) {
        r.style.setProperty('--bgColor', '#ffffff')
        r.style.setProperty('--fontColor', '#000000')
        r.style.setProperty('--selectColor', '#ffffff')
      } else {
        r.style.setProperty('--bgColor', '#130f40')
        r.style.setProperty('--fontColor', '#ffffff')
        r.style.setProperty('--selectColor', '#000000')
      }
    },
    // 用户名下拉菜单选择事件
    handleCommand (command) {
      if (command === 'loginout') {
        localStorage.clear()
        this.$router.push({path: '/'})
      }
    },
    goHome () {
      this.$router.push('/home')
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
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 70px;
  font-size: 22px;
  background: var(--bgColor);
}
.header .logo {
  float: left;
  margin-left: 35px;
  margin-top: 17.5px;
  height: 29px;
  width: 160px;
  vertical-align: middle;
  color: var(--fontColor);
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.themeColor{
  display: flex;
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
.el-menu{
  background-color: var(--bgColor);
}
.el-menu.el-menu--horizontal {
  border-bottom: none !important;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid var(--theme);
  color: var(--theme);
  font-weight: 700;
}
.el-menu--horizontal > .el-menu-item {
  font-family: PingFang;
  font-size: 16px;
  color: var(--fontColor);
}
.el-main {
  padding: 0;
}
</style>
