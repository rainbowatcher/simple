<script lang="ts" setup>
const props = withDefaults(defineProps<{
  value?: string
  language?: string
  resize?: () => void
}>(), {
  value: "",
  language: "handlebars",
})
const emit = defineEmits<{
  (e: "update:value", val: string): void
}>()
const data = useVModel(props, "value", emit)
const container = ref<HTMLDivElement>()
const { instance, dispose, isLoading } = useMonacoEditor({ container, data })

onMounted(() => {
  dispose?.()
})
</script>

<template>
  <div ref="container" border="1 solid neutral100 dark:none" h-md w-auto class="editor-container" />
</template>

<style scoped>

</style>