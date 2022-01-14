<template>
  <div id="changePassword">
    <van-form>
      <van-field v-model="form.password1" label="初始密码" placeholder="请输入初始密码" required />
      <van-field v-model="form.password2" label="新密码" placeholder="请输入新密码" required />
      <van-field v-model="form.password3" label="新密码" placeholder="请输入新密码" required />
      <div style="margin: 16px;">
        <van-button round block type="info" @click="submit()">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        password1: '',
        password2: '',
        password3: '',
        staffNo: localStorage.getItem('staffNo')
      }
    }
  },
  mounted () {},
  methods: {
    submit () {
      if (this.form.password1 === '') {
        this.$message.warning('请输入初始密码！')
      }
      if (this.form.password2 === '' || this.form.password3 === '') {
        this.$message.warning('请输入新密码！')
        return
      }
      if (this.form.password2 === this.form.password3) {
        this.$axios.post('api/changePassword', this.form).then((res) => {
          if (res.data === 'ok') this.$message.success('修改成功！'); this.$router.go(-1)
          if (res.data === 'ng1') this.$message.error('输入的初始密码不正确，请确认后重试！')
          if (res.data === 'ng2') this.$message.error('出错！')
        })
      } else {
        this.$message.warning('两次输入的新密码不一致！请确认后，再次提交！')
      }
    }
  }
}
</script>
<style lang="scss">
#changePassword{
  width: 100%;
  min-height: 100vh;
  background-color: #FFFFFF;
  .van-button--info {
    color: #fff;
    background-color: #038387;
    border: 1px solid #038387;
  }
}
</style>
