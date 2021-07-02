<template>
  <el-dialog
  title="更正"
  center
  :visible.sync="showFlag"
  width="30%"
  :before-close="handleClose">
    <el-form ref="form" label-width="80px">
      <el-form-item label="员工编号">
        <div style="text-align: center">
          <span>{{selectedData.staffNo}}</span>
        </div>
      </el-form-item>
      <el-form-item label="员工姓名">
        <div style="text-align: center">
          <span>{{selectedData.staffName}}</span>
        </div>
      </el-form-item>
      <el-form-item label="订单名称">
        <div style="text-align: center">
          <el-select v-model="selectedData.orderName" @change="orderNameSelected()">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.orderName"
              :value="item.orderName">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="订单单价">
        <template>
          <div style="text-align: center">
            <span>{{selectedData.orderUnitPrice}}</span>
          </div>
        </template>
      </el-form-item>
      <el-form-item label="完成数量">
        <template>
          <div style="text-align: center">
            <el-input class="el-input" v-model="selectedData.staffCompletedQuantity"
              @change="CompletedQuantityinputed()" />
          </div>
        </template>
      </el-form-item>
      <el-form-item label="单日工资">
          <div style="text-align: center">
            <span>{{selectedData.staffDayWage}}</span>
          </div>
      </el-form-item>
      <el-form-item label="备注">
        <div style="text-align: center">
          <el-input v-model="selectedData.remarks" />
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
</el-dialog>
</template>
<script>
export default{
  props: ['showFlag', 'selectedData', 'options'],
  data () {
    return {
    }
  },
  methods: {
    // 取消
    handleClose () {
      this.$emit('setDialogClose')
    },
    // 确定
    submit () {
      let param = this.selectedData
      let params = [param.orderName, param.orderUnitPrice, param.staffCompletedQuantity, param.staffDayWage, param.remarks, param.mark]
      this.$axios.post('api/updateDayWage', {params})
      this.$emit('setDialogClose')
    },
    // 修正订单名称，从而修正订单单价
    orderNameSelected () {
      for (let i = 0; i < this.options.length; i++) {
        if (this.selectedData.orderName === this.options[i].orderName) {
          this.selectedData.orderUnitPrice = Number(this.options[i].orderUnitPrice)
        }
      }
    },
    // 修正完成数量
    CompletedQuantityinputed () {
      let a = this.selectedData.staffCompletedQuantity
      let staffCompletedQuantity = parseInt(a)
      let b = this.selectedData.orderUnitPrice
      let orderUnitPrice = parseInt(b)
      if (this.selectedData.staffCompletedQuantity != null) {
        let staffDayWage = staffCompletedQuantity * orderUnitPrice
        this.selectedData.staffDayWage = staffDayWage.toFixed(2)
      }
      //  发送完成数量，行内的订单单价，得出单日工资。
    }
  },
  mounted () {
  }
}
</script>
<style scoped>
.el-input{
  width: 70%;
}
.el-input >>> .el-input__inner{
  text-align: center;
}
.el-select{
  width: 70%;
}
.el-select >>> .el-input__inner{
  text-align: center;
}
</style>
