<!--
 * @FileDescription: 账号注册页面
 * @Author: FuWB
 * @Date: 2021/04/03
 * @LastEditors: FuWB
 * @LastEditTime: 2021/04/03
 -->
<template>
  <div class="register-wrap">
    <div class="register-table">
      <div class="register-titie">账号注册</div>
      <el-form :model="registerInfo" :rules="rules" ref="registerInfo" label-width="80px" class="register-content">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="registerInfo.username" placeholder="输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="accountNo" label="账 号">
          <el-input v-model="registerInfo.accountNo" placeholder="输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密  码">
          <el-input type="password" v-model="registerInfo.password" placeholder="输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword" label="确认密码">
          <el-input type="password" v-model="registerInfo.confirmPassword" placeholder="再次输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="captcha" label="验证码" style="margin-bottom: 0px">
          <el-input class="el-input2" v-model="registerInfo.captcha" placeholder="输入验证码" @keyup.enter.native="register()"></el-input >
          <el-button @click="refreshCode">刷新验证码</el-button>
          <s-identify :identifyCode="identifyCode"></s-identify>
        </el-form-item>
      </el-form>
      <div class="register-btn">
        <el-button type="primary" @click="register()">立即注册</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import SIdentify from '@/components/SIdentify'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerInfo.confirmPwd !== '') {
          this.$refs.registerInfo.validateField('confirmPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerInfo.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatecaptcha = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.identifyCode) {
        callback(new Error('验证码不正确！'))
      } else {
        callback()
      }
    }
    return {
      registerInfo: {
        username: '',
        accountNo: '',
        password: '',
        confirmPassword: '',
        captcha: ''
      },
      identifyCode: '',
      identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        accountNo: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur', required: true }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { validator: validatecaptcha, trigger: 'blur', required: true }
        ]
      }
    }
  },
  methods: {
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    },
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    register () {
      this.$refs.registerInfo.validate(valid => {
        if (valid) {
          this.$axios.post('/api/register', {
            username: this.registerInfo.username,
            accountNo: this.registerInfo.accountNo,
            password: this.registerInfo.password
          }).then(response => {
            if (response.data === 'pass') {
              this.$router.push('/')
            } else {
              this.$message.error('输入信息有误，请查验后重新注册！')
            }
          })
        } else {
          this.$message.error('输入信息有误，请查验后重新注册！')
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted () {
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  components: {
    SIdentify
  }
}
</script>
<style scoped>
.register-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('../assets/image/bgi1.jpg') no-repeat top;
  background-size: cover
}
.register-table {
  position: relative;
  width: 400px;
  height: 520px;
  max-width: 90%;
  margin:7% auto;
  /* margin: 275px auto; */
  border-radius: 12px;
  background: white;
  overflow: hidden
}
.register-titie {
    width: 100%;
    text-align: center;
    font-size: 22px;
    margin: 0px 0px 0px;
    height: 60px;
    background-color: #038387;
    line-height: 60px
}
.register-content{
  padding: 20px
}
.register-btn {
  text-align: center;
  margin: 0
}
.register-btn button {
  width: 80%;
  height: 36px;
  text-align: center;
  margin-bottom: 10px
}
.el-input{
  width: 94%
}
.el-input2{
  width:50%;
  margin-bottom: 20px
}
.el-input3{
  width:62%
}
.s-canvas{
  width: 140px;
  height: 40px
}
</style>
