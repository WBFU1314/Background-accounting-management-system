
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
        <el-form-item prop="staffID" label="身份证号">
          <el-input v-model="staff.staffID" placeholder="请输入身份证号"/>
        </el-form-item>
        <el-form-item prop="staffPhone" label="联系方式">
          <el-input v-model="staff.staffPhone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item prop="staffResidence" label="居住地">
          <el-input v-model="staff.staffResidence" placeholder="请输入居住地" @keyup.enter.native="submit()" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()" style="width: 210px">提交</el-button>
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
        staffID: [{ required: true, message: '请填写证件号码', trigger: 'blur' },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '证件号码格式有误！',
            trigger: 'blur'
          }
        ],
        staffPhone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            message: '手机号格式不对'
          }
        ],
        staffResidence: [{ required: true, message: '住址不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit () {
      let createDate = new Date()
      this.staff.createDate = createDate.toLocaleDateString()
      this.$refs.staff.validate(valid => {
        if (valid) {
          this.$axios.post('/api/addStaff', this.staff).catch(error => {
            console.log('error:' + error)
          }).then(response => {
            this.result = response.data
            this.$router.push('/staff/staffInfo')
          })
        } else {
          this.$message.error('输入内容有误，请查验后再次提交！')
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
