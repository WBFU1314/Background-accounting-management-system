
<template>
  <div class="content-box" >
    <div class="container">
      <el-form ref="staff" :model="staff" label-width="80px" :rules="rules">
        <el-form-item prop="staffNo" label="员工编号">
          <el-input v-model="staff.staffNo" placeholder="请输入员工编号"/>
        </el-form-item>
        <el-form-item prop="staffName" label="员工姓名">
          <el-input v-model="staff.staffName" placeholder="请输入员工姓名"/>
        </el-form-item>
        <el-form-item prop="staffGender" label="性别">
          <template>
            <el-radio v-model="staff.staffGender" label="女">女</el-radio>
            <el-radio v-model="staff.staffGender" label="男">男</el-radio>
          </template>
        </el-form-item>
        <el-form-item pepropop="staffID" label="身份证号">
          <el-input v-model="staff.staffID" placeholder="请输入身份证号"/>
        </el-form-item>
        <el-form-item prop="staffPhone" label="联系方式">
          <el-input v-model="staff.staffPhone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item prop="staffResidence" label="居住地">
          <el-input v-model="staff.staffResidence" placeholder="请输入居住地"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" style="width: 210px">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      result: [],
      maxStaffNo: '',
      staff: {
        staffNo: 0,
        staffName: '',
        staffGender: '女',
        staffID: '',
        staffPhone: '',
        staffResidence: ''
      },
      rules: {
        staffName: [{ required: true, message: '员工姓名不能为空', trigger: 'blur' }],
        staffID: [{ required: true, message: '证件号不能为空', trigger: 'blur' }],
        staffPhone: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
        staffResidence: [{ required: true, message: '住址不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.staff.validate(valid => {
        if (valid) {
          this.$axios.post('/api/addStaff', {
            staffNo: this.staff.staffNo,
            staffName: this.staff.staffName,
            staffGender: this.staff.staffGender,
            staffID: this.staff.staffID,
            staffPhone: this.staff.staffPhone,
            staffResidence: this.staff.staffResidence
          }).catch(error => {
            console.log('error:' + error)
          }).then(response => {
            this.result = response.data
            this.$router.push('/staff/staffInfo')
          })
        } else {
          this.$message.error('带"*"字段不能为空！')
          console.log('error submit!!')
          return false
        }
      })
    },
    getMaxStaffNo () {
      this.$axios.get('/api/getMaxStaffNo').catch(error => {
        console.log('error:' + error)
      }).then(response => {
        this.maxStaffNo = response.data
        this.staff.staffNo = Number(this.maxStaffNo) + 1
      })
    }
  },
  mounted () {
    this.getMaxStaffNo()
  }
}
</script>
<style scoped>
.el-input {
  width: 210px;
}
.el-select {
  width: 210px;
}
.el-date-picker {
  width: 210px;
}
.el-time-picker {
  width: 210px;
}
</style>
