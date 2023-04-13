<script lang="ts" setup>
import type { TreeOption } from "naive-ui/es/tree/src/interface"

const emit = defineEmits<{
  (e: "updateEditor", path: string, value: string): void
}>()
const {
  data,
  selectedKey,
  searchKey,
  refresh,
  handleDrop,
  newFile,
  get,
  trash,
  onSelect,
  animationOnExpand,
} = useTemplateTree()
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    async onClick() {
      if (!option.children && !option.disabled) {
        const path = option.key as string
        get(path).then(({ data }) => {
          if (data.value?.status === 10000) {
            emit("updateEditor", path, data.value.data!)
          }
        })
      }
    },
  }
}
</script>

<template>
  <div class="template-tree-header" flex="~ row gap-2" justify-between>
    <NInput v-model:value.lazy="searchKey" type="text" placeholder="Search" size="small" />
    <div flex="~ row" items-center rounded-sm my1px bg="dark:#2f2f31" outline="1 solid neutral200 dark:none">
      <div class="i-mdi-file-plus" btn opacity-40 hover:opacity-100 @click="newFile" />
      <div class="i-mdi-folder-plus" btn opacity-40 hover:opacity-100 />
      <div class="i-mdi-refresh" btn opacity-40 hover:opacity-100 @click="refresh" />
      <div class="i-mdi-collapse-all" btn opacity-40 hover:opacity-100 />
      <div class="i-mdi-delete" btn opacity-40 hover:opacity-100 @click="trash(selectedKey)" />
    </div>
  </div>
  <NTree
    v-model:data="data"
    block-line
    keyboard
    :animated="false"
    expand-on-click
    label-field="value"
    h-full
    :node-props="nodeProps"
    :pattern="searchKey"
    :on-update:selected-keys="onSelect"
    :on-update:expanded-keys="animationOnExpand"
  />
</template>

<style scoped>
</style>