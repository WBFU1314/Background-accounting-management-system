<template>
  <div id="billMonth">
    <van-field readonly clickable name="picker" :value="month" label="月份" placeholder="点击选择月份" @click="showPicker = true" />
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
    <table border='1' class="billMonthTable">
      <tr>
        <th>日期</th>
        <th>员工姓名</th>
        <th>订单名称</th>
        <th>订单单价</th>
        <th>单日工资</th>
        <th>备注</th>
      </tr>
      <tr v-for="(item, index) in list" :key="index">
        <td>{{item.selectedDate}}</td>
        <td>{{item.orderName}}</td>
        <td>{{item.orderUnitPrice}}</td>
        <td>{{item.staffCompletedQuantity}}</td>
        <td>{{item.staffDayWage}}</td>
        <td>{{item.remarks}}</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      month: '',
      monthValue: '',
      list: [],
      showPicker: false,
      columns: [
        {
          values: ['2021', '2022', '2023', '2024', '2025']
        },
        {
          values: ['1', '2', '3']
        }
      ]
    }
  },
  mounted () {
    this.monthValue = new Date().toLocaleDateString().split('/')[0] + '/' + new Date().toLocaleDateString().split('/')[1]
    this.fetchData()
    // this.fetchDict()
  },
  methods: {
    fetchData () {
      let params = {
        staffNo: localStorage.getItem('staffNo'),
        selectedMonth: this.monthValue
      }
      this.$axios.post('api/queryDayWageMonthly', params).then((res) => {
        this.list = []
        if (res.data.length > 0) {
          this.list = res.data
        } else {
          this.$message.warning('当月无记录！')
        }
      })
    },
    fetchDict () {
      //
    },
    onConfirm (value) {
      this.month = value[0] + '年' + value[1] + '月'
      this.monthValue = value[0] + '/' + value[1]
      this.showPicker = false
      this.fetchData()
    }
  }
}
</script>
<style lang="scss">
#billMonth{
  width: 100%;
  min-height: 100vh;
  background-color: #FFFFFF;
  .van-field__label{
    min-width: 50%;
  }
  .billMonthTable{
    width: 100%;
    border-collapse:collapse;
    border-color: black;
    text-align: center;
    th{
      font-weight: normal;
    }
  }
}
</style>
