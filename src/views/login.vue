<!--
 * @FileDescription: 登录页面
 * @Author: FuWB
 * @Date: 2021/04/03
 * @LastEditors: FuWB
 * @LastEditTime: 2021/04/03
 -->
<template>
  <div id="login">
    <div class="loginForm">
      <div class="ms_title">管理员登录入口</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="accountNo">
          <el-input v-model="param.accountNo" placeholder="输入账号">
            <i slot="prepend" class="el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-top:25px;">
          <el-input type="password" placeholder="登录密码" v-model="param.password" @keyup.enter.native="submitForm()">
            <i slot="prepend" class="el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <div class="login_btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <div class="login_foot">
          <div><span class="spanLink" @click="register()">没有账号，注册一个</span></div>
          <div><span class="spanLink" @click="forget()">忘记密码</span></div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setToken, setUserId } from '../utils/auth'
export default {
  data () {
    return {
      param: {
        accountNo: '',
        password: ''
      },
      rules: {
        accountNo: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    register () {
      this.$router.push('/register')
    },
    submitForm () {
      this.$refs.login.validate(valid => {
        if (valid) {
          this.$axios.post('/api/login', {
            accountNo: this.param.accountNo,
            password: this.param.password
          }).catch(error => {
            console.log('error:' + error)
          }).then(res => {
            if (res.data === 'non-existent') {
              this.$message.error('用户不存在！')
            } else if (res.data.result === 'Invaild') {
              this.$message.error('账号或密码不正确！')
            } else {
              setToken(res.data.result)
              setUserId(this.param.accountNo)
              this.$router.push('/home')
            }
          })
        } else {
          this.$message.error('请输入账号和密码')
        }
      })
    },
    forget () {
      //
    }
  },
  mounted () {
    let deviceName = window.localStorage.getItem('deviceName')
    console.log(deviceName)
    if (deviceName === 'Android' || deviceName === 'IOS') {
      this.$router.push('/staffLogin')
    }
  }
}
</script>

<style lang="scss">
#login{
  width: 100%;
  min-height: 680px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../assets/image/login/tree.png');
  background-size: cover;
  .loginForm{
    width: 400px;
    height: 350px;
    max-width: 90%;
    border-radius: 12px;
    background: rgba(255,255,255,.15);
    box-shadow: 0 0 10px 5px rgba(0,0,0,.2);
  }
  .ms_title{
    width: 100%;
    text-align: center;
    font-size: 22px;
    font-weight: 550;
    color: #038387;
    padding: 25px 0px 15px;
  }
  .ms-content{
    padding: 30px 30px;
    .el-input{
      width: 100%;
    }
  }
  .login_btn{
    text-align: center;
    margin: 10% 0 0 0;
    button{
      width: 100%;
      height: 36px;
      text-align: center;
      margin-bottom: 30px;
    }
  }
  .login_foot{
    display: flex;
    justify-content: space-between;
  }
}

@media screen and (max-width: 400px) {
  #login {
    background: url('../assets/image/login/flower.png');
    background-size: cover;
  }
}

</style>
