<template>
  <div class="seconde_container">
    <div class="animation_container">
      <div class="animation_box"></div>
    </div>
    <div ref="echart_container"></div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import * as echarts from "echarts/core";
import { BarChart } from 'echarts/charts';
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  CanvasRenderer
]);

/**
 * 需求：分为两部分，上栏目展示小球动态变换(位移)，下栏目展示echart
 */

 // echarts
 const echart_container = ref<HTMLElement>();
 onMounted(() => {
  const myEcharts = echarts.init(echart_container.value, null, {renderer: 'canvas'});
  myEcharts.setOption({
    xAxis: {
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        data: [23, 24, 18, 25, 27, 28, 25]
      },
      {
        type: 'bar',
        data: [26, 24, 18, 22, 23, 20, 27]
      }
    ]
  })
 })

</script>

<style lang='scss' scoped>
@keyframes boxMove{
  from{
    left: 30px;
  }
  to{
    left: calc(100% - 70px);
  }
}

.seconde_container{
  width: 100%;
  height: 100%;
  background-color: rgb(198, 198, 211);
}
.seconde_container>div{
  position: relative;
  width: 100%;
  height: calc(50% - 2.5px);
  background-color: rgb(205, 205, 209);
}
.seconde_container>div:first-child{
  margin-bottom: 5px
}
.animation_box{
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  top: 100px;
  left: 20px;
  background-color: yellow;
  animation: boxMove 3s infinite alternate;
}
</style>