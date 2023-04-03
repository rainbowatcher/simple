<script lang="ts" setup>
const templates = useTemplates()
const data = ref([{
  key: "文件夹",
  label: "文件夹",
  prefix: () =>
    h("div", { class: "i-carbon-folder" }),
}])
const nodeProps = {
  option: {},
}
</script>

<template>
  <NTree
    block-line
    expand-on-click
    :data="data"
  />
</template>

<style scoped>

</style>