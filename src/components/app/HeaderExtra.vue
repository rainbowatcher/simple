<script lang="ts" setup>
const isDark = useDark()
const clazz = computed(() => isDark.value ? "i-mdi-weather-night" : "i-mdi-white-balance-sunny")
</script>

<template>
  <n-switch v-model:value="isDark" size="medium">
    <template #icon>
      <div :class="clazz"></div>
    </template>
  </n-switch>
</template>

<style scoped></style>