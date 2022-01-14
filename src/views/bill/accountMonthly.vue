<template>
  <div class="content-box" >
    <div class="container">
      <div class="botton-group">
        <el-button type="primary" @click="correct()" :disabled="this.selectionData.length != 1">更 正</el-button>
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
                placeholder="选择月份" @change="getData()" />
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
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        height="365"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="55px" align="center" />
        <el-table-column prop="staffNo" label="员工编号" width="90" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffName" label="员工姓名" width="130" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="90" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.selectedDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单名称" width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderPrice" label="订单单价" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderUnitPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成数量" width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffCompletedQuantity}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffDayWage" label="单日工资" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffDayWage}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" width="" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.remarks}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center; margin-top: 8px"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        :total="page.total">
      </el-pagination>
      <correct v-if="showFlag" :showFlag='showFlag' :selectedData='selectedData' :options='options'
        distinguish='2' @setDialogClose='showFlag = false'/>
    </div>
  </div>
</template>
<script>
import correct from '@/components/correct.vue'
export default {
  components: { correct },
  data () {
    return {
      showFlag: false,
      searchData: {
        selectedMonth: new Date(),
        staffNo: '',
        staffName: ''
      },
      rawData: [],
      tableData: [],
      selectionData: [],
      options: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 30
      }
    }
  },
  mounted () {
    this.getData()
    this.getDict()
  },
  methods: {
    // 勾选表格颜色修改
    tableRowClassName ({row, rowIndex}) {
      if (!this.selectionData) return ''
      if (this.selectionData.some((el) => row.vehicleNo === el.vehicleNo)) {
        return 'success-row'
      } else {
        return ''
      }
    },
    handleSelectionChange (val) {
      this.selectionData = val
    },
    correct () {
      this.showFlag = true
      this.selectedData = this.selectionData[0]
      this.staffNo = this.selectionData[0].staffNo
      this.staffName = this.selectionData[0].staffName
    },
    getData () {
      let a = this.searchData.selectedMonth.getFullYear()
      let b = this.searchData.selectedMonth.getMonth() + 1
      let selectedMonth = a + '/' + b
      this.$axios.post('api/queryDayWageMonthly', {
        selectedMonth: selectedMonth,
        staffNo: this.searchData.staffNo,
        staffName: this.searchData.staffName
      }).catch(error => {
        console.log('error:' + error)
      }).then(res => {
        this.rawData = res.data
        this.page.total = this.rawData.length
        this.tableData = this.rawData.slice(0, 10)
      })
    },
    getDict () {
      this.$axios.get('api/getOrderOption').then((res) => {
        this.options = res.data
        console.log('信息页', this.options)
      })
    },
    handleCurrentChange (currentPage) {
      this.tableData = this.rawData.slice((currentPage - 1) * 10, currentPage * 10)
    }
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
