<template>
  <div>
    <div class="UserImg-box">
      <img src="../assets/logo.jpg">
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>姓名</th>
          <th>性别</th>
          <th>邮箱</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{user.id}}</td>
          <td>{{user.name}}</td>
          <td>{{user.gender}}</td>
          <td>{{user.email}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'user',
  data () {
    return {
      data: '1',
      users: []
    }
  },
  created () {
    this.$axios({
      method: 'get',
      url: '/api/user/1'
    }).catch(error => {
      console.log('error:' + error)
    }).then(response => {
      this.users = response.data
      // console.log(this.users)
    })
  }
}
</script>
<style scoped>
.img{
  width: 200px;
  height: 200px;
}
.UserImg-box:hover img{
  transform: rotate(-360deg);
}
</style>
