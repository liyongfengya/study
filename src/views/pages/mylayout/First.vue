<template>
  <div ref="container" class="first_container">
    <div ref="box" class="move_box" @mousedown="drapBox" />
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

/**
 * 需求：实现自由拖拽标签
 */

 const container = ref<HTMLElement>();
 const box = ref<HTMLElement>();
// 拖拽处理事件
const drapBox = ()=>{
  let mouseDown: boolean = true;
  const maxX: number = container.value!.offsetWidth - box.value!.offsetWidth;
  const maxY: number = container.value!.offsetHeight - box.value!.offsetHeight;
  const moveHandle = (moveEvent: MouseEvent)=>{
    if(!mouseDown){ return; }
    const x: number = moveEvent.offsetX;
    const y: number = moveEvent.offsetY;
    if(x > 0 && x < maxX){
      box.value!.style.left = `${x}px`
    }
    if(y > 0 && y < maxY){
      box.value!.style.top = `${y}px`
    }
  }
  const uphandle = ()=>{
    mouseDown = false;
    container.value!.removeEventListener("mousemove", moveHandle);
    container.value!.removeEventListener("mouseup", uphandle);
  }
  box.value!.style.cursor = "grabbing";
  container.value!.addEventListener("mousemove", moveHandle);
  container.value!.addEventListener("mouseup", uphandle);
}

</script>

<style lang='scss' scoped>
.first_container{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgb(149, 237, 237);
    .move_box{
        position: absolute;
        width: 30px;
        height: 30px;
        left: 50px;
        top: 50px;
        background-color: blue;
    }
}
</style>