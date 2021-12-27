<template>
  <el-dialog
  title="提示"
  :visible.sync="staffDetail"
  width="35%"
  center
  :before-close="handleClose">
  <el-form :model="form" label-width="100px" :disabled="true">
    <el-form-item label="员工编号">
      <el-input v-model="form.staffNo"></el-input>
    </el-form-item>
    <el-form-item label="员工姓名">
      <el-input v-model="form.staffName"></el-input>
    </el-form-item>
    <el-form-item label="员工性别">
      <el-input v-model="form.staffGender"></el-input>
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
    <el-form-item label="入职时间">
      <el-input v-model="form.createDate"></el-input>
    </el-form-item>
    <el-form-item label="离职时间" v-if="form.resignDate">
      <el-input v-model="form.resignDate"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="handleClose">确 定</el-button>
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
    }
  },
  data () {
    return {
      form: {}
    }
  },
  mounted () {
    console.log(this.staffNo)
    this.fetchData(this.staffNo)
  },
  methods: {
    fetchData (staffNo) {
      this.$axios.post('api/queryStaff', {staffNo: staffNo}).then((res) => {
        this.form = res.data[0]
      })
    },
    handleClose () {
      this.$emit('setDialogClose')
    }
  }
}
</script>
