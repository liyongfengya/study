<template>
    <main class="my_main">
        <slot></slot>
    </main>
</template>
<script setup lang="ts">
</script>
<style scoped>
.my_main{
    display: block;
    flex: 1 1 auto;
    overflow: auto;
    box-sizing: border-box;
}
</style>