
<template>
  <div class="content-box" >
    <div class="container">
      <el-form ref="order" :model="order" label-width="120px">
        <el-form-item prop="orderNo" label="订单编号">
          <el-input v-model="order.orderNo" placeholder="请输入订单编号"/>
        </el-form-item>
        <el-form-item prop="orderClient" label="订单上游">
          <el-input v-model="order.orderClient" placeholder="请输入订单上游"/>
        </el-form-item>
        <el-form-item prop="orderName" label="订单名称">
          <el-input v-model="order.orderName" placeholder="请输入订单名称"/>
        </el-form-item>
        <el-form-item pepropop="orderTotal" label="订单总量">
          <el-input v-model="order.orderTotal" placeholder="请输入订单总量"/>
        </el-form-item>
        <el-form-item prop="orderUnitPrice" label="订单单价">
          <el-input v-model="order.orderUnitPrice" placeholder="请输入订单单价"/>
        </el-form-item>
        <el-form-item prop="orderStartDate" label="订单开始日期">
          <el-date-picker clearable type="date" placeholder="选择日期" v-model="order.orderStartDate"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item prop="orderEndDate" label="订单交货日期">
          <el-date-picker clearable type="date" placeholder="选择日期" v-model="order.orderEndDate"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" style="width: 210px">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      result: '',
      order: {
        orderNo: '',
        orderClient: '雅鹿',
        orderName: '羽绒服',
        orderTotal: '10000',
        orderUnitPrice: '8.0',
        orderStartDate: '',
        orderEndDate: ''
      }
    }
  },
  methods: {
    submit () {
      this.$axios.post('/api/addOrder', {
        orderNo: this.order.orderNo,
        orderClient: this.order.orderClient,
        orderName: this.order.orderName,
        orderTotal: this.order.orderTotal,
        orderUnitPrice: this.order.orderUnitPrice,
        orderStartDate: this.order.orderStartDate,
        orderEndDate: this.order.orderEndDate
      }).catch(error => {
        console.log('error:' + error)
      }).then(response => {
        this.result = response.data
        console.log(this.result)
        this.$router.push('/orderInfo')
      })
    }
  }
}
</script>
<style scoped>
.el-input {
  width: 210px;
}
.el-select {
  width: 210px;
}
.el-date-picker {
  width: 210px;
}
.el-time-picker {
  width: 210px;
}
</style>
