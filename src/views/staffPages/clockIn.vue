<template>
  <div id="clockIn">
    <div class="rule">
      <span class="ruleSpan">上班时间点：<span class="ruleSpan DeepPink">8：45</span> 下班时间点：<span class="ruleSpan DeepPink">17：30</span></span>
    </div>
    <div class="time" @click="clockIn" :disabled='disabled'>
      <div>
        <span class="timeSpan">{{ date }}<br>{{ time }}</span>
        <br>
        <span class="timeSpan" v-if="!flag">上班打卡</span>
        <span class="timeSpan" v-else>下班打卡</span>
      </div>
    </div>
    <div class="record">
      <div class="recordTitle">
        <span class="recordTitleSpan">本月打卡记录</span>
      </div>
      <table border="1" class="recordTable">
        <tr>
          <th>日期</th>
          <th>员工姓名</th>
          <th>上班打卡时间</th>
          <th>下班打卡时间</th>
        </tr>
        <tr v-for="(item, index) in list" :key="index">
          <td>{{item.creactedDate}}</td>
          <td>{{item.staffName}}</td>
          <td>{{item.clockInTime}}</td>
          <td>{{item.clockOutTime}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      date: new Date().toLocaleDateString(),
      time: '',
      list: [],
      flag: false,
      disabled: false
    }
  },
  mounted () {
    setInterval(() => {
      this.time = new Date().toLocaleTimeString('chinese', { hour12: false })
    }, 500)
    this.fetchData()
  },
  beforeDestroy () {
    clearInterval()
  },
  methods: {
    fetchData () {
      let year = this.date.split('/')[0]
      let month = this.date.split('/')[1]
      this.$axios.get(`api/queryClockRecord/${year}/${month}`).then((res) => {
        this.list = res.data
      })
    },
    clockIn () {
      let clickTime = new Date().toLocaleTimeString('chinese', { hour12: false })
      let params = {
        staffNo: localStorage.getItem('staffNo'),
        staffName: localStorage.getItem('staffName'),
        creactedDate: this.date,
        clockInTime: this.flag ? '' : clickTime,
        clockOutTime: this.flag ? clickTime : '',
        mark: this.date + '/' + localStorage.getItem('staffNo')
      }
      this.$axios.post('api/clockIn', params).then((res) => {
        if (res.data === 'flag1') {
          this.flag = true
          this.$message.success(this.date.split('/')[0] + '年' + this.date.split('/')[1] + '月' + this.date.split('/')[2] + '日' + '上班打卡成功！')
        } else if (res.data === 'flag2') {
          this.flag = false
          this.$message.success(this.date.split('/')[0] + '年' + this.date.split('/')[1] + '月' + this.date.split('/')[2] + '日' + '下班打卡成功！')
        } else {
          this.$message.error('出错！')
        }
      })
      this.fetchData()
    }
  }
}
</script>
<style lang="scss">
#clockIn{
  width: 100%;
  min-height: 100vh;
  background-color: #FFFFFF;
  .rule{
    width: 100%;
    height: 100px;
    padding: 40px 10px;
    .ruleSpan{
      font-family: PingFang SC;
      font-size: 18px;
      line-height: 24px;
    }
  }
  .time{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 200px;
    height: 200px;
    margin: 0 auto;
    border-radius: 50%;
    background-color: #038387;
    .timeSpan{
      font-family: PingFang;
      font-size: 18px;
      color: white;
      line-height: 30px;
    }
  }
  .record{
    width: 100%;
    padding: 10px;
    .recordTitle{
      width: 100%;
      height: 30px;
      .recordTitleSpan{
        font-family: PingFang SC;
        font-size: 18px;
        line-height: 24px;
      }
    }
    .recordTable{
      width: 100%;
      border-collapse:collapse;
      border-color: black;
      text-align: center;
      th{
        font-weight: normal;
      }
    }
  }
}
</style>
