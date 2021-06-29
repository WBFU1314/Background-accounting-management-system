<template>
  <div>
    <!-- 一级菜单下面所拥有的二级菜单 -->
    <el-aside>
      <sidemanu :items='items'></sidemanu>
    </el-aside>

    <!-- 以及二级菜单所对应的页面 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
import sidemanu from '@/components/sidemanu'
export default {
  components: {
    sidemanu
  },
  data () {
    return {
      items: [{
        index: 'accountDaily',
        title: '按日记账'
      }, {
        index: 'accountMonthly',
        title: '按月查看'
      }]
    }
  }
}
</script>

<style scoped>
</style>
