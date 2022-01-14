<template>
  <div id="staffHome">
    <div class="welcomeBlock">
      <img class="img" src="../../assets/image/staffHome/mountain.jpg" alt="">
      <span class="welcomeSpan1">{{ date }}</span>
      <span class="welcomeSpan2">{{ time }}</span>
      <span class="welcomeSpan3">{{ welcome }}{{ staffName }}，{{ welcomeSentence }}</span>
    </div>
    <van-row>
      <van-col span="8" v-for="(item, index) in list" :key="index">
        <div class="block" @click="jumpTo(item.path)">
          <div><span class="titleSpan">{{ item.title }}</span></div>
          <van-icon :name="item.name" color="#038387" size="40"></van-icon>
        </div>
      </van-col>
    </van-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      welcome: '早上好！',
      staffName: '',
      welcomeSentence: '不要忘记上班打卡哦！',
      list: [
        {
          title: '打卡',
          name: 'clock',
          path: '/clockIn'
        },
        {
          title: '每日申报',
          name: 'todo-list',
          path: '/billFillIn'
        },
        {
          title: '月度记录',
          name: 'balance-list',
          path: '/billMonth'
        },
        {
          title: '修改密码',
          name: 'setting',
          path: '/changePassword'
        }
      ]
    }
  },
  mounted () {
    this.fetchData()
    setInterval(() => {
      this.time = new Date().toLocaleTimeString('chinese', { hour12: false })
    }, 500)
  },
  beforeDestroy () {
    clearInterval()
  },
  methods: {
    fetchData () {
      this.$axios.post('api/queryStaff', {staffNo: localStorage.getItem('staffNo')}).then((res) => {
        this.staffName = res.data[0].staffName
        localStorage.setItem('staffName', res.data[0].staffName)
      })
    },
    jumpTo (path) {
      this.$router.push({path: path})
    }
  }
}
</script>
<style lang="scss">
#staffHome{
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  padding: 8px;
  .welcomeBlock{
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: 4px;
    overflow: hidden;
    .img{
      width: 100%;
    }
    .welcomeSpan1{
      position: absolute;
      top: 10px;
      left: 20px;
      font-family: PingFang;
      font-size: 18px;
      color: white;
    }
    .welcomeSpan2{
      height: 18px;
      position: absolute;
      top: 10px;
      right: 20px;
      font-family: PingFang;
      font-size: 18px;
      color: white;
      z-index: 500;
    }
    .welcomeSpan3{
      position: absolute;
      top: 70px;
      left: 20px;
      right: 20px;
      font-family: kaiti;
      font-size: 24px;
      color: white;
      line-height: 40px;
      z-index: 999;
    }
  }
  .van-col{
    padding: 10px 8px;
  }
  .block{
    width: 100%;
    height: 100px;
    text-align: center;
    padding: 10px;
    background-color: Lavender;
    box-shadow: 0 0 3px 1px rgba(3,131,135,.05);
    border-radius: 4px;
    .titleSpan{
      font-family: PingFang;
      font-size: 18px;
      line-height: 40px;
    }
  }
  .block:active{
    box-shadow: none;
  }
}
</style>
