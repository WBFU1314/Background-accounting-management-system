<template>
  <div class="content-box" >
    <div class="container">
      <div class="botton-group">
        <el-button type="primary" @click="settlement()" :disabled="this.selectionData.length < 1">结 算</el-button>
        <el-button type="primary" @click="getData()">查 询</el-button>
      </div>
      <el-divider />
      <el-form :model="searchData" label-width="80px">
        <el-row>
          <el-col :span="6" style="margin-left: -40px">
            <el-form-item label="月份">
              <el-date-picker
                v-model="searchData.selectedMonth"
                type="month"
                placeholder="选择月份" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="员工编号">
              <el-input v-model="searchData.staffNo" clearable placeholder="请输入员工编号" @keyup.enter.native="getData()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="员工姓名" clearable>
              <el-input v-model="searchData.staffName" clearable placeholder="请输入员工姓名" @keyup.enter.native="getData()" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        stripe
        ref="selectionData"
        :data="tableData"
        :summary-method="getSummaries"
        show-summary
        resizable
        :height="theight"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="staffNo" label="员工编号" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffName" label="员工姓名" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="monthWage" label="工资" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.monthWage}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="selectedMonth" label="月份" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.selectedMonth}}</span>
          </template>
          </el-table-column>
        <el-table-column prop="calculation" label="结算" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.settlement == 0" style="color: red">未结算</span>
            <span v-else style="color: green">已结算</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.remarks}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      orderName: '',
      staffCompletedQuantity: '',
      searchData: {
        selectedMonth: new Date(),
        staffNo: '',
        staffName: ''
      },
      rawData: [],
      tableData: [],
      selectionData: [],
      theight: '440'
    }
  },
  methods: {
    settlement () {
      let params = []
      for (let i = 0; i < this.selectionData.length; i++) {
        params.push(this.selectionData[i].mark)
      }
      this.$axios.post('api/salaryCalculate', {
        params
      })
      this.getData()
    },
    //   【导出excel】
    download () {
      for (let i = 0; i < this.tableData.length; i++) {
        console.log(this.tableData[i].vehicleNo)
      }
    },
    setCurrent (row) {
      this.$refs.selectionData.setCurrentRow(row)
    },
    // 勾选表格颜色修改
    tableRowClassName ({row, rowIndex}) {
      if (!this.selectionData) return ''
      if (this.selectionData.some((el) => row.vehicleNo === el.vehicleNo)) {
        return 'success-row'
      } else {
        return ''
      }
    },
    orderNameSelected (val) {
      if (val.orderName === 1) {
        val.orderPrice = 1
      } else if (val.orderName === 2) {
        val.orderPrice = 2
      } else if (val.orderName === 3) {
        val.orderPrice = 3
      } else if (val.orderName === 4) {
        val.orderPrice = 4
      } else if (val.orderName === 5) {
        val.orderPrice = 5
      }
    },
    CompletedQuantityinputed (val) {
      if (val.staffCompletedQuantity != null) {
        val.staffDayWage = val.orderPrice * val.staffCompletedQuantity
      }
      //  发送完成数量，行内的订单单价，得出单日工资。
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 4) {
          const values = data.map(item => Number(item[column.property]))
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          sums[index] = '--'
        }
      })
      setTimeout(() => {
        console.log(111)
        this.theight = '441'
      }, 50)
      return sums
    },
    getData () {
      let a = this.searchData.selectedMonth.getFullYear()
      let b = this.searchData.selectedMonth.getMonth() + 1
      let selectedMonth = a + '/' + b
      this.$axios.post('api/queryTotalDayWageMonthly', {
        selectedMonth: selectedMonth,
        staffNo: this.searchData.staffNo,
        staffName: this.searchData.staffName
      }).catch(error => {
        console.log('error:' + error)
      }).then(response => {
        this.rawData = response.data
        this.tableData = this.rawData
      })
    },
    handleSelectionChange (val) {
      this.selectionData = val
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style scoped>
.el-col{
  height: 50px
}
.botton-group{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px
}
.el-table-column{
 margin: 0 20px;
}
.el-input2{
  width: 130px;
}
.el-input3{
  width: 120px;
}
.el-select >>> .el-input__inner{
  text-align: center;
}
.el-input2 >>> .el-input__inner{
  text-align: center;
}
.el-input3 >>> .el-input__inner{
  text-align: center;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 160px;
}
</style>
