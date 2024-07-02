<template>
    <div id="main_three">
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { ThreeLearn } from "../../datas/ThreeLearn";

let threeLearn: ThreeLearn | null = null;


onMounted(() => {
    threeLearn = new ThreeLearn("main_three");
})
onUnmounted(() => {
    threeLearn?.cancelCameraControl();
})
</script>
<style scoped>
#main_three{
    width: 100%;
    height: 100%;
    text-align: center;
    padding: 0;
    margin: 0;
    background: rgb(158, 156, 156);
}
</style>