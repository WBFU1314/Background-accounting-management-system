<template>
  <div class="content-box" >
    <div class="container">
      <div class="botton-group">
        <div>
          <el-button type="primary" @click="routerto()">新增员工</el-button>
          <el-button type="primary" @click="download()">导出员工信息表</el-button>
        </div>
        <div>
          <el-button type="primary" @click="fetchData()">查 询</el-button>
        </div>
      </div>
      <el-divider></el-divider>
      <el-form :model="searchDate" label-width="75px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="员工编号">
              <el-input v-model="searchDate.staffNo" clearable placeholder="请输入员工编号" style="width :150px" @keyup.enter.native="fetchData()"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="员工姓名" clearable>
              <el-input v-model="searchDate.staffName" clearable placeholder="请输入员工编号" style="width :150px" @keyup.enter.native="fetchData()"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="居住地" clearable>
              <el-input v-model="searchDate.staffResidence" clearable placeholder="请输入员工编号" style="width :150px" @keyup.enter.native="fetchData()"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" clearable>
              <el-select v-model="searchDate.staffGender" clearable placeholder="请选择性别" style="width :150px" @change="fetchData()">
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
        v-loading="loading"
        stripe
        ref="selectionData"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        height="420"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="staffNo" label="员工编号" width="90" align="center" />
        <el-table-column prop="staffName" label="员工姓名" width="120" align="center" />
        <el-table-column prop="staffGender" label="性别" width="80" align="center" />
        <el-table-column prop="staffID" label="身份证号" width="180" align="center" />
        <el-table-column prop="staffPhone" label="联系方式" width="120" align="center" />
        <el-table-column prop="staffResidence" label="居住地" width="180" align="center" />
        <el-table-column prop="staffStatus" label="状态" width="80" align="center">
          <template slot-scope="scope">
            <!-- <span :style="scope.row.staffStatus === '0' ? 'color: green' : 'color: red'">{{scope.row.staffStatus}}</span> -->
            <span v-if="scope.row.staffStatus == '0'" style="color: green">在职</span>
            <span v-else style="color: red">离职</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row.staffNo)" type="text">详情</el-button>
            <el-button @click="edit(scope.row.staffNo)" type="text">编辑</el-button>
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
      <staff-detail v-if="staffDetail" :staffDetail="staffDetail" :staffNo="staffNo" :type="type" @setDialogClose="staffDetail = false"></staff-detail>
    </div>
  </div>
</template>

<script>
import staffDetail from './staffDetail.vue'
export default {
  components: { staffDetail },
  data () {
    return {
      loading: false,
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
        total: 0
      },
      staffDetail: false,
      staffNo: null,
      type: null
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    // 获取在职员工信息
    fetchData () {
      this.loading = true
      this.$axios.post('api/queryStaff', {
        staffNo: this.searchDate.staffNo,
        staffName: this.searchDate.staffName,
        staffResidence: this.searchDate.staffResidence,
        staffGender: this.searchDate.staffGender
      }).catch(error => {
        console.log('error:' + error)
      }).then(res => {
        this.rawData = res.data
        this.page.total = this.rawData.length
        this.tableData = this.rawData.slice(0, 10)
        this.loading = false
      })
    },
    //  新增员工
    routerto () {
      this.$router.push('/staff/staffAdd')
    },
    download () {
      this.$axios.get('/api/exportStaff').catch(error => {
        console.log('error:' + error)
      }).then((res) => {
        if (res.data === 'ok') {
          this.$message.success('导出成功！')
        } else if (res.data === 'ng') {
          this.$message.error('导出失败！')
        } else {
          this.$message.error('出错！')
        }
      })
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
    handleCurrentChange (currentPage) {
      this.tableData = this.rawData.slice((currentPage - 1) * 10, currentPage * 10)
    },
    detail (staffNo) {
      this.staffDetail = true
      this.staffNo = staffNo
      this.type = 'staffDetail'
    },
    edit (staffNo) {
      this.staffDetail = true
      this.staffNo = staffNo
      this.type = 'editStaffDetail'
    }
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
