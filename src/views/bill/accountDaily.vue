<template>
  <div class="content-box">
    <div class="container">
      <div class="botton-group">
        <el-tooltip class="item" effect="dark" content="请勾选数据进行提交！不可重复提交！可勾选数据进行更改！" placement="top-start">
          <el-button type="primary" @click="submit()">保 存</el-button>
        </el-tooltip>
        <el-button type="primary" @click="correct()" :disabled="this.selectionData.length != 1">更 正</el-button>
        <div style="margin-left: 718px">
          <el-button type="primary" @click="search()">查 询</el-button>
        </div>
      </div>
      <el-divider/>
      <el-form :model="searchData" label-width="75px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="选择日期">
              <el-date-picker
                style="width: 150px"
                v-model="searchData.selectedDate"
                type="date"
                align="right"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="compareDate()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="员工编号" clearable v-if="!this.display">
              <el-input v-model="searchData.staffNo" clearable placeholder="请输入员工编号" style="width: 150px"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="员工姓名" clearable v-if="!this.display">
              <el-input v-model="searchData.staffName" clearable placeholder="请输入员工姓名" style="width: 150px"/>
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
        <el-table-column prop="staffNo" label="员工编号" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffName" label="员工姓名" width="130" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单名称" width="150" align="center">
          <template slot-scope="scope">
            <span v-if="display === false">{{scope.row.orderName}}</span>
            <el-select v-else v-model="scope.row.orderName" placeholder="请选择订单名称"
              @change="orderNameSelected(scope.row)">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.orderName"
                :value="item.orderName">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="orderPrice" label="订单单价" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderUnitPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成数量" width="160" align="center">
          <template slot-scope="scope">
            <span v-if="display === false">{{scope.row.staffCompletedQuantity}}</span>
            <el-input v-else class="el-input2" v-model="scope.row.staffCompletedQuantity"
              clearable placeholder="请输入完成数量"
              @change="CompletedQuantityinputed(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="staffDayWage" label="单日工资" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffDayWage}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" width="" align="center">
          <template slot-scope="scope">
            <span v-if="display === false">{{scope.row.remarks}}</span>
            <el-input v-else class="el-input3" v-model="scope.row.remarks" clearable placeholder="请输入备注" />
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
        distinguish='1' @setDialogClose='showFlag = false'/>
    </div>
  </div>
</template>
<script>
import correct from '@/components/correct.vue'
export default {
  data () {
    return {
      display: true,
      date: new Date(),
      selectedData: {},
      orderName: '',
      searchData: {
        selectedDate: new Date(),
        staffNo: '',
        staffName: ''
      },
      rawData: [],
      tableData: [],
      showFlag: false,
      selectionData: [],
      options: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 30
      }
    }
  },
  methods: {
    submit () {
      let i
      let selectedDate
      let selectedMonth
      let param = []
      if (typeof (this.searchData.selectedDate) === 'object') {
        selectedDate = this.searchData.selectedDate.toLocaleDateString()
        let arr = selectedDate.split('/')
        selectedMonth = arr[0] + '/' + arr[1]
      } else {
        let arr = this.searchData.selectedDate.split('-')
        if (arr[1][0] === '0') arr[1] = arr[1].substr(1, 1)
        if (arr[2][0] === '0') arr[2] = arr[2].substr(1, 1)
        selectedDate = arr[0] + '/' + arr[1] + '/' + arr[2]
        selectedMonth = arr[0] + '/' + arr[1]
      }
      for (i = 0; i < this.selectionData.length; i++) {
        this.selectionData[i].mark = this.searchData.selectedDate.toLocaleDateString() + '/' + this.selectionData[i].staffNo
        this.selectionData[i].selectedDate = selectedDate
        this.selectionData[i].selectedMonth = selectedMonth
      }
      param = this.selectionData
      console.log(param)
      if (this.selectionData.length === 0) {
        this.$message({
          message: '请选择一条或多条数据！',
          type: 'warning'
        })
      } else {
        this.$axios.post('api/dayWageInsert', {
          param
        })
      }
      this.getData()
    },
    download () {
      for (let i = 0; i < this.tableData.length; i++) {
        console.log(this.tableData[i].vehicleNo)
      }
    },
    setCurrent (row) {
      this.$refs.selectionData.setCurrentRow(row)
    },
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
    orderNameSelected (val) {
      for (let i = 0; i < this.options.length; i++) {
        if (val.orderName === this.options[i].orderName) {
          val.orderUnitPrice = this.options[i].orderUnitPrice
        }
      }
    },
    CompletedQuantityinputed (val) {
      let a = val.staffCompletedQuantity
      let staffCompletedQuantity = parseInt(a)
      let b = val.orderUnitPrice
      let orderUnitPrice = parseInt(b)
      if (val.staffCompletedQuantity != null) {
        let staffDayWage = orderUnitPrice * staffCompletedQuantity
        val.staffDayWage = staffDayWage.toFixed(2)
      }
      //  发送完成数量，行内的订单单价，得出单日工资。
    },
    correct () {
      this.showFlag = true
      this.selectedData = this.selectionData[0]
      this.staffNo = this.selectionData[0].staffNo
      this.staffName = this.selectionData[0].staffName
    },
    // 比较时间
    compareDate () {
      let selectedDate = this.searchData.selectedDate.toString()
      // 获取当前年份
      let year1 = this.date.getFullYear()
      year1 = year1.toString()
      // 获取选择年份
      let year2 = selectedDate.substr(0, 4)

      // 获取当前月份
      let month1 = this.date.getMonth()
      month1 += 1
      month1 = month1.toString()
      // 获取选择月份
      let month2 = selectedDate.substr(5, 2)
      let monthFlag = month2[0]
      if (monthFlag === '0') {
        month2 = selectedDate.substr(6, 1)
      }
      // 获取当前日
      let day1 = this.date.getDate()
      day1 = day1.toString()
      // 获取选择日
      let day2 = selectedDate.substr(8, 2)
      let dayFlag = day2[0]
      if (dayFlag === '0') {
        day2 = selectedDate.substr(9, 1)
      }
      // 比较当前日期和选中日期
      if (year1 === year2) {
        if (month1 === month2) {
          if (day1 === day2) {
            this.display = true
          } else {
            this.display = false
          }
        } else {
          this.display = false
        }
      } else {
        this.display = false
      }
      console.log(this.display)
      if (this.display) this.getData()
      else this.search()
    },
    getData () {
      let selectedDate = new Date().toLocaleDateString()
      this.$axios.post('api/getBillInfoForInsert', {
        selectedDate
      }).catch(error => {
        console.log('error:' + error)
      }).then(response => {
        this.rawData = response.data[0]
        this.page.total = this.rawData.length
        this.tableData = this.rawData.slice(0, 10)
        this.options = response.data[1]
      })
    },
    search () {
      let arr = this.searchData.selectedDate.split('-')
      if (arr[1][0] === '0') arr[1] = arr[1].substr(1, 1)
      if (arr[2][0] === '0') arr[2] = arr[2].substr(1, 1)
      let selectedDate = arr[0] + '/' + arr[1] + '/' + arr[2]
      this.$axios.post('api/qeuryDayWage', {
        selectedDate: selectedDate,
        staffNo: this.searchData.staffNo,
        staffName: this.searchData.staffName
      }).catch(error => {
        console.log('error:' + error)
      }).then(response => {
        this.rawData = response.data
        this.page.total = this.rawData.length
        this.tableData = this.rawData.slice(0, 10)
      })
    },
    handleCurrentChange (currentPage) {
      this.tableData = this.rawData.slice((currentPage - 1) * 10, currentPage * 10)
    }
  },
  mounted () {
    this.getData()
  },
  components: {
    correct
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
</style>
