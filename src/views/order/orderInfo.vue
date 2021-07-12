<template>
  <div class="content-box" >
    <div class="container">
      <div class="botton-group">
        <el-button type="primary" @click="routerto()">新添订单</el-button>
        <el-tooltip class="item" effect="dark" content="不可恢复操作！请确认后再点击！一次只能结算一条数据！" placement="top-start">
          <el-button type="primary" @click="settle()" :disabled ="this.selectionData.length != 1">结算订单</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="不可恢复操作！请确认后再点击！一次只能删除一条订单！" placement="top-start">
          <el-button type="primary" @click="deletes()" :disabled ="this.selectionData.length != 1">删除订单</el-button>
        </el-tooltip>
        <el-button type="primary" @click="download()">导出订单信息表</el-button>
        <div style="margin-left: 400px">
          <el-button type="primary" @click="getData()">查 询</el-button>
        </div>
      </div>
      <el-divider></el-divider>
      <el-form :model="searchDate" label-width="75px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input v-model="searchDate.orderNo" clearable placeholder="请输入订单编号" style="width :150px"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单名称" clearable>
              <el-input v-model="searchDate.orderName" clearable placeholder="请输入订单名称" style="width :150px"/>
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
        <el-table-column prop="orderNo" label="订单编号" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderClient" label="订单上游" width="130" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderClient}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderName" label="订单名称" width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderTotal" label="订单总量" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderTotal}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderUnitPrice" label="订单单价" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderUnitPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderStartDate" label="订单开始日期" width="155" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderStartDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderEndDate" label="订单交货日期" width="" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderEndDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == 0" style="color: green">进行中</span>
            <span v-else style="color: red">已结束</span>
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
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      searchDate: {
        orderNo: '',
        orderName: ''
      },
      tableData: [],
      selectionData: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 30
      }
    }
  },
  methods: {
    //  新增订单
    routerto () {
      this.$router.push('/order/orderAdd')
    },
    //  删除订单
    deletes () {
      let params = []
      for (let i = 0; i < this.selectionData.length; i++) {
        params.push(this.selectionData[i].orderNo)
      }
      console.log(params)
      this.$axios.post('api/delOrder', {
        params
      })
      this.getData()
    },
    //  结算订单
    settle () {
      let params = []
      for (let i = 0; i < this.selectionData.length; i++) {
        params.push(this.selectionData[i].orderNo)
      }
      this.$axios.post('api/updateOrder', {
        params
      })
      this.getData()
    },
    //   【导出excel】
    download () {
      console.log(this.selectionData)
    },
    setCurrent (row) {
      this.$refs.selectionData.setCurrentRow(row)
    },
    // 勾选表格颜色修改
    tableRowClassName ({row, rowIndex}) {
      if (!this.selectionData) return ''
      if (this.selectionData.some((el) => row.orderNo === el.orderNo)) {
        return 'success-row'
      } else {
        return ''
      }
    },
    handleSelectionChange (val) {
      this.selectionData = val
    },
    getData () {
      this.$axios.post('api/queryOrder', {
        orderNo: this.searchDate.orderNo,
        orderName: this.searchDate.orderName
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
  }
}
</script>
<style scoped>
.el-col{
  height: 50px
}
.el-input{
  width: 210px;
}
.botton-group{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.el-table-column{
 margin: 0 20px;
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>
