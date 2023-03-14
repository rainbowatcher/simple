<script lang="ts" setup>import { ref } from 'vue';


const count = ref(0)
</script>

<template>
  This is App.vue
  <button class="w-16 rounded" @click="count++">{{ count }}</button>
</template>

<style scoped>

</style>