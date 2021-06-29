<template>
  <div class="content-box">
    <div class="container">
      <div class="botton-group">
        <el-button type="primary" @click="submit()">保 存</el-button>
        <el-button type="primary" v-if="this.display === false" @click="correct()" :disabled="this.selectionData.length != 1">更 正</el-button>
        <div style="margin-left: 718px">
          <el-button type="primary" @click="search()">查 询</el-button>
        </div>
      </div>
      <el-divider />
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
            <el-form-item label="员工编号">
              <el-input v-model="searchData.staffNo" clearable placeholder="请输入员工编号" style="width: 150px"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="员工姓名" clearable>
              <el-input v-model="searchData.staffName" clearable placeholder="请输入员工姓名" style="width: 150px"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
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
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="orderPrice" label="订单单价" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderPrice}}</span>
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
            <el-input v-else class="el-input2" v-model="scope.row.remarks" clearable placeholder="请输入备注" />
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
        @setDialogClose='showFlag = false' />
    </div>
  </div>
</template>
<script>
import correct from '@/components/correct.vue'
export default {
  data () {
    return {
      display: true,
      date: '',
      selectedData: {},
      staffNo: '',
      staffName: '',
      orderName: '',
      searchData: {
        selectedDate: ''
      },
      tableData: [],
      showFlag: false,
      selectionData: [],
      options: [{
        value: '1',
        label: '衬衫'
      }, {
        value: '2',
        label: 'T恤'
      }, {
        value: '3',
        label: '长裤'
      }, {
        value: '4',
        label: '短裤'
      }, {
        value: '5',
        label: '外套'
      }],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 30
      }
    }
  },
  methods: {
    submit () {
      sessionStorage.setItem('time', this.date)
      let timeb = sessionStorage.getItem('time')
      console.log(timeb)
      for (let i = 0; i < this.selectionData.length; i++) {
        console.log(this.selectionData[i].staffNo)
      }
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
      if (val.orderName === '1') {
        val.orderPrice = 1
      } else if (val.orderName === '2') {
        val.orderPrice = 2
      } else if (val.orderName === '3') {
        val.orderPrice = 3
      } else if (val.orderName === '4') {
        val.orderPrice = 4
      } else if (val.orderName === '5') {
        val.orderPrice = 5
      }
      if (val.staffCompletedQuantity != null) {
        val.staffDayWage = val.orderPrice * val.staffCompletedQuantity
      }
    },
    CompletedQuantityinputed (val) {
      if (val.staffCompletedQuantity != null) {
        val.staffDayWage = val.orderPrice * val.staffCompletedQuantity
      }
      //  发送完成数量，行内的订单单价，得出单日工资。
    },
    correct () {
      this.showFlag = true
      this.selectedData = this.selectionData[0]
      this.staffNo = this.selectionData[0].staffNo
      this.staffName = this.selectionData[0].staffName
    },
    // 匹配时间
    getDate () {
      // 获取当前时间
      var date = new Date()
      this.date = date
      console.log(this.date)
      this.$set(this.searchData, 'selectedDate', date)
      console.log(this.searchData.selectedDate)
    },
    compareDate () {
      // 获取当前年份
      let year1 = this.date.getFullYear()
      console.log(year1)
      // 获取选择年份
      let year2 = this.searchData.selectedDate.getFullYear()
      console.log(year2)

      // 获取当前月份
      let month1 = this.date.getMonth()
      // 获取选择月份
      let month2 = this.searchData.selectedDate.getMonth()

      // 获取当前日
      let day1 = this.date.getDate()
      // 获取选择日
      let day2 = this.searchData.selectedDate.getDate()

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
    },
    handleCurrentChange (currentPage) {
      this.tableData = this.rawData.slice((currentPage - 1) * 10, currentPage * 10)
    }
  },
  mounted () {
    this.getDate()
    console.log(this.display)
  },
  components: {
    correct
  }
}
</script>
<style scoped>
.el-input{
  width: 210px;
}
.botton-group{
  display: flex;
  margin-bottom: 10px
}
.el-table-column{
 margin: 0 20px;
}
.el-input2{
  width: 130px;
}
.el-input2 >>> .el-input__inner{
  text-align: center;
}
.el-select >>> .el-input__inner{
  text-align: center;
}
</style>
