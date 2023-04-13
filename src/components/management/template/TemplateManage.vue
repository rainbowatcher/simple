<script lang="ts" setup>
const editorContent = ref("")
const title = ref("title")
const update = (path: string, template: string) => {
  title.value = path
  editorContent.value = template
}
</script>

<template>
  <div class="template-manage-panel" flex="~ row gap-4">
    <div class="template-manage-tree" flex-none min-w-48 h-auto>
      <TemplateFileTree @update-editor="update" />
    </div>
    <TemplateEditor :title="title" :content="editorContent" />
  </div>
</template>
