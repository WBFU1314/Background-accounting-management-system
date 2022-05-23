
<template>
  <div class="content-box" >
    <div class="container">
      <el-form ref="order" :model="order" label-width="120px" :rules="rules">
        <el-form-item prop="orderNo" label="订单编号">
          <el-input v-model="order.orderNo" placeholder="请输入订单编号" readonly />
        </el-form-item>
        <el-form-item prop="orderClient" label="订单上游">
          <el-input v-model="order.orderClient" placeholder="请输入订单上游"/>
        </el-form-item>
        <el-form-item prop="orderName" label="订单名称">
          <el-input v-model="order.orderName" placeholder="请输入订单名称"/>
        </el-form-item>
        <el-form-item prop="orderTotal" label="订单总量">
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
import { getUserName } from '../../utils/auth'
import { add0 } from '../../utils/index'
export default {
  data () {
    return {
      result: '',
      order: {
        orderNo: '',
        orderClient: '',
        orderName: '',
        orderTotal: '',
        orderUnitPrice: '',
        orderStartDate: '',
        orderEndDate: '',
        creator: getUserName(),
        createDate: new Date().toLocaleDateString()
      },
      rules: {
        orderClient: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
        orderName: [{ required: true, message: '订单名称不能为空', trigger: 'blur' }],
        orderTotal: [{ required: true, message: '订单总量不能为空', trigger: 'blur' }],
        orderUnitPrice: [{ required: true, message: '订单单价不能为空', trigger: 'blur' }],
        orderStartDate: [{ required: true, message: '订单开始日期不能为空', trigger: 'blur' }],
        orderEndDate: [{ required: true, message: '订单结束日期不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.order.validate(valid => {
        if (valid) {
          this.$axios.post('api/addOrder', this.order).catch(error => {
            console.log('error:' + error)
          }).then(response => {
            this.result = response.data
            console.log(this.result)
            this.$router.push('/order/orderInfo')
          })
        } else {
          this.$message.error('带"*"字段不能为空！')
          console.log('error submit!!')
          return false
        }
      })
    },
    getMaxOrderNo () {
      this.$axios.get('/api/getMaxOrderNo').catch(error => {
        console.log('error:' + error)
      }).then(response => {
        this.maxOrderNo = response.data
        this.order.orderNo = add0(Number(this.maxOrderNo) + 1)
      })
    }
  },
  mounted () {
    this.getMaxOrderNo()
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
