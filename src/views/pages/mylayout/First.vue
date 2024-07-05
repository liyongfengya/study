<template>
  <div ref="container" class="first_container">
    <div ref="box" class="move_box" @mousedown="drapBox" />
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { Optimize } from "../../../datas/Optimize";

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
    moveEvent.stopPropagation();
    console.log(box.value!.getBoundingClientRect());
    const { offsetX, offsetY } = moveEvent;
    if(offsetX > 0 && offsetX < maxX){
      box.value!.style.left = `${offsetX}px`
    }
    if(offsetY > 0 && offsetY < maxY){
      box.value!.style.top = `${offsetY}px`
    }
  }
  const deboundsMove = Optimize.thorrtle(moveHandle, 30);
  const uphandle = ()=>{
    mouseDown = false;
    container.value!.removeEventListener("mousemove", deboundsMove);
    container.value!.removeEventListener("mouseup", uphandle);
    box.value!.style.pointerEvents= "auto";
  }
  box.value!.style.cursor = "grabbing";
  container.value!.addEventListener("mousemove", deboundsMove);
  container.value!.addEventListener("mouseup", uphandle);
  // 穿透
  box.value!.style.pointerEvents= "none";
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