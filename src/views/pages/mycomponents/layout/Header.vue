<template>
    <header class="my_header">
        <slot></slot>
    </header>
</template>
<script setup lang="ts">
const props = defineProps({
    height: {
        type: String,
        default: "60px"
    }
});
</script>
<style scoped>
.my_header{
    height: v-bind('props.height');
    box-sizing: border-box;
    flex-shrink: 0;
}
</style>