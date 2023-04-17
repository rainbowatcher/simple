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
    <div flex="~ row" my1px items-center rounded-sm bg="dark:#2f2f31" outline="1 solid neutral200 dark:none">
      <div class="i-mdi-file-plus" opacity-40 btn hover:opacity-100 @click="newFile" />
      <div class="i-mdi-folder-plus" opacity-40 btn hover:opacity-100 />
      <div class="i-mdi-refresh" opacity-40 btn hover:opacity-100 @click="refresh" />
      <div class="i-mdi-collapse-all" opacity-40 btn hover:opacity-100 />
      <div class="i-mdi-delete" opacity-40 btn hover:opacity-100 @click="trash(selectedKey)" />
    </div>
  </div>
  <NTree
    v-model:data="data"


    :animated="false"

    label-field="value"
    keyboard expand-on-click block-line h-full
    :node-props="nodeProps"
    :pattern="searchKey"
    :on-update:selected-keys="onSelect"
    :on-update:expanded-keys="animationOnExpand"
  />
</template>

<style scoped>
</style>