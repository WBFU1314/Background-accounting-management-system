<!--
 * @FileDescription: 登录页面
 * @Author: FuWB
 * @Date: 2021/04/03
 * @LastEditors: FuWB
 * @LastEditTime: 2021/04/03
 -->
<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">好好生活，天天向上</div>
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
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
          <span>没有账号，<el-link type="primary" @click="register()">注册一个</el-link></span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setToken } from '../utils/auth'
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
              this.$router.push('/home')
            }
          })
        } else {
          this.$message.error('请输入账号和密码')
        }
      })
    }
  },
  mounted () {}
}
</script>

<style scoped>
.login-wrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/image/bgi1.jpg') no-repeat;
  background-size: 100%;
}
.ms-title {
  width: 100%;
  text-align: center;
  font-size: 22px;
  padding: 25px 0px 15px;
}
.ms-login {
  width: 450px;
  height: 350px;
  max-width: 90%;
  margin:11% 20% 20% 55%;
  border-radius: 12px;
  background: white;
  box-shadow: 0 0 20px 5px rgba(0,0,0,.2);
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
  margin: 10% 0;
}
.login-btn button {
    width: 100%;
    height: 36px;
    text-align: center;
    margin-bottom: 30px;
}
</style>
