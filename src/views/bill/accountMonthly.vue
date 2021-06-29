<template>
  <div class="content-box" >
    <div class="container">
      <div class="vehicleInfo-btngroup">
        <el-button type="primary" @click="submit()">更 正</el-button>
      </div>
      <el-divider />
      <el-form :model="searchData" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="月份">
              <el-date-picker
                v-model="searchData.date"
                type="month"
                placeholder="选择月" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="员工编号">
              <el-input v-model="searchData.staffNo" clearable placeholder="请输入员工编号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="员工姓名" clearable>
              <el-input v-model="searchData.staffName" clearable placeholder="请输入员工姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div style="float: right; margin-right: 45%">
              <el-button type="primary" @click="search()">查 询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="selectionData"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="55px" align="center" />
        <el-table-column prop="staffNo" label="员工编号" width="130" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffName" label="员工姓名" width="155" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="130" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.date}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单名称" width="180" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderPrice" label="订单单价" width="130" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成数量" width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.CompletedQuantityinputed}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffDayWage" label="单日工资" width="130" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffDayWage}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" width="160" align="center">
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
        date: '',
        staffNo: '',
        staffName: ''
      },
      tableData: [{
        staffNo: '001',
        staffName: '张观博',
        staffGender: '1',
        staffID: '111111111111111111',
        staffPhone: '13111111111',
        staffResidence: '**镇**村',
        staffDayWage: '',
        staffMonthWage: ''
      }, {
        staffNo: '002',
        staffName: '陈泊依',
        staffGender: '1',
        staffID: '111111111111111112',
        staffPhone: '13111111112',
        staffResidence: '**镇**村',
        staffDayWage: '',
        staffMonthWage: ''
      }, {
        staffNo: '003',
        staffName: '周源晓',
        staffGender: '1',
        staffID: '111111111111111113',
        staffPhone: '13111111113',
        staffResidence: '**镇**村',
        staffDayWage: '',
        staffMonthWage: ''
      }],
      selectionData: [],
      options: [{
        value: '选项1',
        label: '衬衫'
      }, {
        value: '选项2',
        label: 'T恤'
      }, {
        value: '选项3',
        label: '长裤'
      }, {
        value: '选项4',
        label: '短裤'
      }, {
        value: '选项5',
        label: '外套'
      }
      ]
    }
  },
  methods: {
    // 结算
    submit () {
      for (let i = 0; i < this.selectionData.length; i++) {
        console.log(this.selectionData[i].staffNo)
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
    handleSelectionChange (val) {
      this.selectionData = val
    }
  }
}
</script>
<style scoped>
.el-input{
  width: 210px;
}
.vehicleInfo-btngroup{
  margin-bottom: 20px;
}
.el-table-column{
 margin: 0 20px;
}
.el-table .success-row {
  background: #f0f9eb;
}
.el-input2{
  width: 150px;
}
</style>
