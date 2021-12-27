<template>
  <div class="wrap">
    <div class="top">
      <el-row>
        <el-col class="elCol0" :span="6" v-for="(item, index) in list1" :key="index">
          <div class="block1" :style="{'background-image': item.bgColor}">
            <el-row>
              <el-col class="elCol2" :span="8">
                <img :src="item.icon" width="60" alt="">
              </el-col>
              <el-col :span="12" :offset="4">
                <div style="width: 100%; height: 100px; padding: 20px 0;">
                  <span class="span1 white">{{item.text}}</span>
                  <br />
                  <span class="span2 white">
                    <countTo :startVal='0' :endVal='item.num' :duration='2000'></countTo><span class="span1 white">{{item.unit}}</span>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="middle">
      <el-row>
        <el-col :span="12" class="elCol4">
          <div class="middleLeft">
            <span class="span1 bold">成品库存<span class="span3 gray"> 单位/件</span></span>
            <div class="middleLeftContent">
              <div class="block3" v-for="(item, index) in list2" :key="index">
                <span class="span2">
                  <countTo :startVal='0' :endVal='item.num' :duration='2000'></countTo>
                </span>
                <br>
                <span>{{ item.text}}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="elCol5">
          <div class="middleRight">
            <span class="span1 bold">材料库存<span class="span3 gray"> 单位/件</span></span>
            <div class="middleLeftContent">
              <div class="block3" v-for="(item, index) in list3" :key="index">
                <span class="span2">
                  <countTo :startVal='0' :endVal='item.num' :duration='2000'></countTo>
                </span>
                <br>
                <span>{{ item.text}}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-row>
        <el-col :span="12" class="elCol4">
          <div id="chart"></div>
        </el-col>
        <el-col :span="12" class="elCol5">
          <div class="panel">
            <div class="block2" v-for="(item, index) in list4" :key="index">
              <span class="span1 bold">
                {{ item.text }}
              </span>
              <br>
              <br>
              <span class="span4">
                <countTo :startVal='0' :endVal='item.num' :duration='2000' :style="{'color': item.numColor}"></countTo>
              </span>
              <br>
              <br>
              <span class="span3  ">
                {{ item.text2 }}
              </span>
              <br>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import countTo from 'vue-count-to'
import * as echarts from 'echarts'
export default{
  components: {countTo},
  data () {
    return {
      list1: [
        {
          icon: require('../assets/image/home/board.png'),
          text: '昨日出货量',
          num: 100,
          unit: '件',
          bgColor: 'linear-gradient(to right bottom, #F86EE2, #D066F3)',
          color1: '',
          color2: ''
        },
        {
          icon: require('../assets/image/home/board.png'),
          text: '昨日出勤人数',
          num: 100,
          unit: '人',
          bgColor: 'linear-gradient(to right bottom, #3AB7FC , #6D94FE)',
          color1: '',
          color2: ''
        },
        {
          icon: require('../assets/image/home/board.png'),
          text: '原料库存',
          num: 100,
          unit: '件',
          bgColor: 'linear-gradient(to right bottom, #FF81A0 , #FF6C42)',
          color1: '',
          color2: ''
        },
        {
          icon: require('../assets/image/home/board.png'),
          text: '成品库存',
          num: 100,
          unit: '件',
          bgColor: 'linear-gradient(to right bottom, #00CFB8 , #00A0D0)',
          color1: '',
          color2: ''
        }
      ],
      list2: [
        {
          text: '成品库存',
          num: 100,
          numColor: 'DeepPink',
          text2: '成品库存'
        },
        {
          text: '成品库存',
          num: 100,
          numColor: 'Orange',
          text2: '成品库存'
        },
        {
          text: '成品库存',
          num: 100,
          numColor: 'MediumSlateBlue',
          text2: '成品库存'
        },
        {
          text: '成品库存',
          num: 100,
          numColor: 'RoyalBlue',
          text2: '成品库存'
        }
      ],
      list3: [
        {
          text: '材料库存',
          num: 100,
          numColor: 'DeepPink',
          text2: '成品库存'
        },
        {
          text: '材料库存',
          num: 100,
          numColor: 'Orange',
          text2: '成品库存'
        },
        {
          text: '材料库存',
          num: 100,
          numColor: 'MediumSlateBlue',
          text2: '成品库存'
        },
        {
          text: '材料库存',
          num: 100,
          numColor: 'RoyalBlue',
          text2: '成品库存'
        }
      ],
      list4: [
        {
          text: '成品库存',
          num: 100,
          numColor: 'DeepPink',
          text2: '成品库存'
        },
        {
          text: '成品库存',
          num: 100,
          numColor: 'Orange',
          text2: '成品库存'
        },
        {
          text: '成品库存',
          num: 100,
          numColor: 'MediumSlateBlue',
          text2: '成品库存'
        },
        {
          text: '成品库存',
          num: 100,
          numColor: 'RoyalBlue',
          text2: '成品库存'
        },
        {
          text: '成品库存',
          num: 100,
          numColor: 'MediumSpringGreen',
          text2: '成品库存'
        },
        {
          text: '成品库存',
          num: 100,
          numColor: 'Gold',
          text2: '成品库存'
        }
      ],
      option: {
        backgroundColor: 'white',
        visualMap: [
          {
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 300,
            color: ['#9932CC', '#00FFFF'],
            colorLightness: '1'
          }
        ],
        title: [
          {
            text: '近日出货量趋势',
            left: 20,
            top: 20,
            textStyle: {
              fontSize: '16',
              fontWeight: '550'
            }
          },
          {
            text: '单位：件',
            left: 150,
            top: 22,
            textStyle: {
              fontSize: '12',
              fontWeight: '400',
              color: 'gray'
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          boundaryGap: true,
          type: 'category',
          axisLine: {
            show: true,
            lineStyle: {
              width: '1',
              color: 'gray'
            }
          },
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              width: '1',
              color: 'gray'
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
            smooth: true,
            showSymbol: false
          }
        ]
      }
    }
  },
  mounted () {
    window.resize = () => {
      this.drawChart()
    }
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.drawChart()
    },
    drawChart () {
      let chart = echarts.init(document.getElementById('chart'))
      chart.setOption(this.option, true)
      window.addEventListener('resize', () => {
        chart.resize()
      })
    }
  }
}
</script>
<style scoped>
.wrap{
  width: 100vw;
  height: calc(100vh - 70px);
  padding: 20px 5px;
  background-color: #F9F8F8;
  /* background-color: white; */
}
.top{
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}
.elCol0{
  padding: 0 15px
}
.elCol1{
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.elCol2{
  height: 100px;
  display: flex;
  justify-content: right;
  align-items: center;
}
.elCol4{
  padding-right: 15px;
}
.elCol5{
  padding-left: 15px;
}
.block1{
  width: 100%;
  height: 100px;
  border-radius: 12px;
}
.bottom{
  width: 100%;
  height: 330px;
  padding: 0 15px;
}
#chart{
  width: 100%;
  height: 330px;
  border-radius: 8px;
  overflow: hidden;
}
.panel{
  width: 100%;
  height: 330px;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.block2{
  width: 33%;
  height: 163px;
  background-color: #FFF;
  padding: 20px;
  border-radius: 8px;
}
.middle{
  width: 100%;
  height: 120px;
  margin: 20px auto;
  padding: 0 15px;
}
.middleLeft{
  width: 100%;
  height: 120px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}
.middleLeftContent{
  display: flex;
  justify-content: space-around;
}
.block3{
  height: 60px;
}
.middleRight{
  width: 100%;
  height: 120px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}
</style>
