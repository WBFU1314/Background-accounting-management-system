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
        <el-form-item prop="username">
            <el-input v-model="param.username" placeholder="输入账号">
                <el-button slot="prepend" icon="el-icon-user"></el-button>
            </el-input>
        </el-form-item>
        <el-form-item prop="userpsw" style="margin-top:25px;">
            <el-input type="userpsw" placeholder="登录密码" v-model="param.userpsw" @keyup.enter.native="submitForm()">
                <el-button slot="prepend" icon="el-icon-lock"></el-button>
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
export default {
  data () {
    return {
      pwd: '',
      param: {
        username: '001',
        userpsw: '12345678'
      },
      rules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        userpsw: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
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
            username: this.param.username,
            userpsw: this.param.userpsw
          }).catch(error => {
            console.log('error:' + error)
          }).then(response => {
            this.pwd = response.data[0].userpsw
            if (this.pwd === this.param.userpsw) {
              this.$message.success('登录成功')
              this.$router.push('/home')
            } else {
              this.$message.warning('账号或密码不正确，请重新输入！')
            }
          })
        } else {
          this.$message.error('请输入账号和密码')
        }
      })
    }
  }
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
    margin: 25px 0px 15px;
}
.ms-login {
    width: 450px;
    height: 365px;
    max-width: 90%;
    margin:11% 20% 20% 55%;
    /* margin: 275px auto; */
    border-radius: 12px;
    background: white;
    overflow: hidden;
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
    margin-bottom: 10px;
}
</style>
