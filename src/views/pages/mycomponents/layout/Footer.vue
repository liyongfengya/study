<template>
    <footer class="my_footer">
        <slot></slot>
    </footer>
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
.my_footer{
    height: v-bind('props.height');
    box-sizing: border-box;
    flex-shrink: 0;
}
</style>