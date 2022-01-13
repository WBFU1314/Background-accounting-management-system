<template>
  <el-dialog
  :title="title"
  :visible.sync="staffDetail"
  width="35%"
  center
  :before-close="handleClose">
  <el-form :model="form" label-width="100px" :disabled="type==='staffDetail'">
    <el-form-item label="员工编号">
      <el-input v-model="form.staffNo" disabled></el-input>
    </el-form-item>
    <el-form-item label="员工姓名">
      <el-input v-model="form.staffName"></el-input>
    </el-form-item>
    <el-form-item label="员工性别">
      <el-input v-if="this.type === 'staffDetail'" v-model="form.staffGender"></el-input>
      <el-select v-else v-model="form.staffGender" style="width: 100%">
        <el-option v-for="item in option1" :key="item.label" :label="item.label" :value="item.label" >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="员工身份证号">
      <el-input v-model="form.staffID"></el-input>
    </el-form-item>
    <el-form-item label="联系方式">
      <el-input v-model="form.staffPhone"></el-input>
    </el-form-item>
    <el-form-item label="居住地">
      <el-input v-model="form.staffResidence"></el-input>
    </el-form-item>
    <el-form-item label="员工状态">
      <el-input v-if="this.type === 'staffDetail'" v-model="form.staffStatusText"></el-input>
      <el-select v-else v-model="form.staffStatus" style="width: 100%">
        <el-option v-for="item in option2" :key="item.label" :label="item.label" :value="item.value" >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="入职时间" v-if="this.type ==='staffDetail'">
      <el-input v-model="form.createDate"></el-input>
    </el-form-item>
    <el-form-item label="离职时间" v-if="form.resignDate">
      <el-input v-model="form.resignDate"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" v-if="this.type === 'staffDetail'" @click="handleClose">确 定</el-button>
    <el-button type="primary" v-if="this.type === 'editStaffDetail'" @click="handleClose">取 消</el-button>
    <el-button type="primary" v-if="this.type === 'editStaffDetail'" @click="submit">提交</el-button>
  </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    staffDetail: {
      type: Boolean,
      default: false
    },
    staffNo: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      title: '',
      form: {},
      option1: [{label: '女'}, {label: '男'}],
      option2: [{label: '在职', value: '0'}, {label: '离职', value: '1'}]
    }
  },
  mounted () {
    this.title = this.type === 'staffDetail' ? '员工详细信息' : '修改员工信息'
    this.fetchData(this.staffNo)
  },
  methods: {
    fetchData (staffNo) {
      this.$axios.post('api/queryStaff', {staffNo: staffNo}).then((res) => {
        this.form = res.data[0]
        this.form.staffStatusText = this.getStatus(this.form.staffStatus)
      })
    },
    submit () {
      this.$axios.post('api/updateStaff', this.form).then((res) => {
        if (res.data === 'ok') {
          this.$message.success('提交成功！')
          this.handleClose()
        }
      })
    },
    handleClose () {
      this.$emit('setDialogClose')
      this.$parent.fetchData()
    },
    getStatus (num) {
      if (num === '0') return '在职'
      else return '离职'
    }
  }
}
</script>
<style>
.el-dialog__title{
  color: white
}
</style>
