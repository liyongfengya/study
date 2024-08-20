<template>
    <aside class="my_asider">
        <slot></slot>
    </aside>
</template>
<script setup lang="ts">
const props = defineProps({
    width: {
        type: String,
        default: "300px"
    }
});
</script>
<style scoped>
.my_asider{
    width: v-bind('props.width');
    overflow: auto;
    flex-shrink: 0;
    box-sizing: border-box;
}
</style>