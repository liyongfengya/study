<template>
  <div class="container">
    <First class="item"/>
    <Seconde class="item"/>
    <Three class="item"/>
  </div>
</template>

<script setup lang='ts'>
// import { ref, reactive } from 'vue'
import First from './First.vue';
import Seconde from "./Seconde.vue";
import Three from './Three.vue';

</script>

<style lang='scss' scoped>
.container{
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: stretch;
  .item{
    flex: 1;
  }
}
</style>