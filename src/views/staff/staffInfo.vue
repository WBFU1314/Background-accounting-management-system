<template>
  <div class="content-box" >
    <div class="container">
      <div class="botton-group">
        <el-button type="primary" @click="routerto()">新增员工</el-button>
        <el-tooltip class="item" effect="dark" content="不可恢复操作！请确认后再点击！一次只能修改一个员工！" placement="top-start">
          <el-button type="primary" @click="settle()" :disabled ="this.selectionData.length != 1">修改员工状态</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="不可恢复操作！请确认后再点击！一次只能删除一个员工！" placement="top-start">
          <el-button type="primary" @click="deletes()" :disabled ="this.selectionData.length != 1">删除员工</el-button>
        </el-tooltip>
        <el-button type="primary" @click="download()">导出员工信息表</el-button>
        <div style="margin-left: 400px">
          <el-button type="primary" @click="getData()">查 询</el-button>
        </div>
      </div>
      <el-divider></el-divider>
      <el-form :model="searchDate" label-width="75px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="员工编号">
              <el-input v-model="searchDate.staffNo" clearable placeholder="请输入员工编号" style="width :150px" @keyup.enter.native="getData()"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="员工姓名" clearable>
              <el-input v-model="searchDate.staffName" clearable placeholder="请输入员工编号" style="width :150px" @keyup.enter.native="getData()"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="居住地" clearable>
              <el-input v-model="searchDate.staffResidence" clearable placeholder="请输入员工编号" style="width :150px" @keyup.enter.native="getData()"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" clearable>
              <el-select v-model="searchDate.staffGender" clearable placeholder="请选择性别" style="width :150px" @change="getData()">
                <el-option
                  v-for="item in gender"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
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
        <el-table-column prop="staffName" label="员工姓名" width="120" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffGender" label="性别" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffGender}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffID" label="身份证号" width="180" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffID}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffPhone" label="联系方式" width="120" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffResidence" label="居住地" width="180" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staffResidence}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffStatus" label="状态" width="" align="center">
          <template slot-scope="scope">
            <span :style="scope.row.staffStatus === '在职' ? 'color: green' : 'color: red'">{{scope.row.staffStatus}}</span>
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
      staff: [],
      searchDate: {
        staffNo: '',
        staffName: '',
        staffGender: '',
        staffResidence: '',
        staffID: ''
      },
      gender: [{
        value: '男'
      }, {
        value: '女'
      }],
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
  methods: {
    //  新增员工
    routerto () {
      this.$router.push('/staff/staffAdd')
    },
    // 删除员工
    deletes () {
      let params = []
      for (let i = 0; i < this.selectionData.length; i++) {
        params.push(this.selectionData[i].staffNo)
      }
      this.$axios.post('api/delStaff', {
        params
      })
      // .catch(error => {
      //   console.log('error:' + error)
      // }).then(response => {
      // })
    },
    //  修改员工状态
    settle () {
      let params = []
      for (let i = 0; i < this.selectionData.length; i++) {
        params.push(this.selectionData[i].staffNo)
      }
      console.log(params)
      this.$axios.post('api/updateStaff', {
        params
      })
      this.getData()
    },
    download () {
      for (let i = 0; i < this.tableData.length; i++) {
        console.log(this.tableData[i].staffNo)
      }
    },
    setCurrent (row) {
      this.$refs.selectionData.setCurrentRow(row)
    },
    // 勾选表格颜色修改
    tableRowClassName ({row, rowIndex}) {
      if (!this.selectionData) return ''
      if (this.selectionData.some((el) => row.staffNo === el.staffNo)) {
        return 'success-row'
      } else {
        return ''
      }
    },
    handleSelectionChange (val) {
      this.selectionData = val
    },
    getData () {
      this.$axios.post('api/queryStaff', {
        staffNo: this.searchDate.staffNo,
        staffName: this.searchDate.staffName,
        staffResidence: this.searchDate.staffResidence,
        staffGender: this.searchDate.staffGender
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
  width: 210px
}
.botton-group{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px
}
.el-table-column{
 margin: 0 20px
}
.el-table .success-row {
  background: #f0f9eb
}
</style>
