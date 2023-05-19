<script lang="ts" setup>
const editorContent = ref("")
const title = ref("title")
function update(path: string, template: string) {
  title.value = path
  editorContent.value = template
}
</script>

<template>
  <div class="template-manage-panel" flex="~ row gap-4">
    <div class="template-manage-tree" h-auto min-w-48 flex-none>
      <TemplateFileTree @update-editor="update" />
    </div>
    <TemplateEditor :title="title" :content="editorContent" />
  </div>
</template>
