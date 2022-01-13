<template>
  <div id="fillIn">
    <van-form @submit="onSubmit">
      <van-cell title="日期" :value="form.selectedDate" />
      <van-cell title="员工编号" :value="form.staffNo" />
      <van-cell title="员工姓名" :value="form.staffName" />
      <van-field name="订单名称" label="订单名称" v-model="form.orderName" readonly required clickable placeholder="选择订单" @click="showPicker0 = true" />
      <van-popup v-model="showPicker0" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns0"
          @confirm="onConfirm0"
          @cancel="showPicker0 = false"
        />
      </van-popup>
      <van-field name="订单单价" label="订单单价" v-model="form.orderUnitPrice" readonly />
      <van-field name="完成数量" label="完成数量" v-model="form.staffCompletedQuantity" required placeholder="输入完成数量" @blur="calculation()" />
      <van-field name="单日工资" label="单日工资" v-model="form.staffDayWage" readonly />
      <van-field name="备注"     label="备注"    v-model="form.remarks" />
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showPicker0: false,
      columns0: [],
      form: {
        staffNo: '',
        staffName: '',
        orderName: '',
        orderUnitPrice: '',
        staffCompletedQuantity: '',
        staffDayWage: '',
        remarks: '',
        mark: '',
        selectedDate: new Date().toLocaleDateString(),
        selectedMonth: ''
      }
    }
  },
  mounted () {
    this.form.staffNo = localStorage.getItem('staffNo')
    this.form.staffName = localStorage.getItem('staffName')
    this.getOption()
  },
  methods: {
    getOption () {
      this.$axios.get('api/getOrderOption').then((res) => {
        this.dict = res.data
        this.dict.forEach((item) => {
          this.columns0.push(item.orderName)
        })
      })
    },
    onSubmit () {
      this.form.mark = this.form.selectedDate + '/' + this.form.staffNo
      if (this.form.selectedDate[6] === '/') this.form.selectedMonth = this.form.selectedDate.substring(0, 6)
      else this.form.selectedMonth = this.form.selectedDate.substring(0, 7)
      let param = [this.form]
      this.$axios.post('api/dayWageInsert', {param}).then((res) => {
        console.log(res)
      })
    },
    onConfirm0 (value) {
      this.form.orderName = value
      this.getPrice(value)
      this.showPicker0 = false
    },
    getPrice (value) {
      this.dict.forEach((item) => {
        if (value === item.orderName) this.form.orderUnitPrice = item.orderUnitPrice
      })
    },
    calculation () {
      let middle = Number(this.form.orderUnitPrice) * Number(this.form.staffCompletedQuantity)
      this.form.staffDayWage = middle.toFixed(2)
    }
  }
}
</script>
<style lang="scss">
#fillIn{
  width: 100%;
  height: 100%;
  padding: 8px;
  .van-button--info{
    background-color: #038387;
    border: 1px solid #038387;
    border-radius: 4px;
  }
  .van-field__label{
    min-width: 47%;
  }
  .van-cell__value{
    text-align: left;
    color: #323233
  }
}
</style>
