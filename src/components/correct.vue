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
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="订单单价">
        <template>
          <div style="text-align: center">
            <span>{{selectedData.orderPrice}}</span>
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
      console.log(this.selectedData)
    },
    // 修正订单名称，从而修正订单单价
    orderNameSelected () {
      if (this.selectedData.orderName === '1') {
        this.selectedData.orderPrice = 1
      } else if (this.selectedData.orderName === '2') {
        this.selectedData.orderPrice = 2
      } else if (this.selectedData.orderName === '3') {
        this.selectedData.orderPrice = 3
      } else if (this.selectedData.orderName === '4') {
        this.selectedData.orderPrice = 4
      } else if (this.selectedData.orderName === '5') {
        this.selectedData.orderPrice = 5
      }
      if (this.selectedData.staffCompletedQuantity != null) {
        this.selectedData.staffDayWage = this.selectedData.orderPrice * this.selectedData.staffCompletedQuantity
      }
    },
    // 修正完成数量
    CompletedQuantityinputed () {
      if (this.selectedData.staffCompletedQuantity != null) {
        this.selectedData.staffDayWage = this.selectedData.orderPrice * this.selectedData.staffCompletedQuantity
      }
      //  发送完成数量，行内的订单单价，得出单日工资。
    }
  },
  activated: {
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
