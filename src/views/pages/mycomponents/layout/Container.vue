<template>
    <section class="my_container">
        <slot>
        </slot>
    </section>
</template>
<script setup lang="ts">
import { computed } from "vue";
/**
 * 容器，内部必须要有main、head、sider、footer之中一个或多个
 */
const props = defineProps({
    direction: {
        type: String,
        default: "vertical" // "horizontal"
    }
});
const containerDir = computed(() => {
    return props.direction === "horizontal" ? "row" : "column";
});
</script>
<style scoped>
.my_container {
    display: flex;
    flex-direction: v-bind(containerDir);
    flex: 1 1 auto;
    box-sizing: border-box;
    min-width: 0;
}
</style>