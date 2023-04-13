<script lang="ts" setup>
const props = defineProps<{
  content?: string
  title?: string
}>()

const container = ref<HTMLDivElement>()
const { messager } = useDiscreteApi()
const { instance, resize } = useMonacoEditor({ container, data: props.content })
const [isMaximize, toggleMaximize] = useToggle(false)

watchEffect(() => {
  instance.value?.setValue(props.content || "")
})

const save = () => {
  const content = instance.value?.getValue()
  const path = props.title
  if (path) {
    saveTemplate(path, content, true).then((res) => {
      if (res.data.value?.status === 10000) messager.success("Success")
    })
  }
}
</script>

<template>
  <div grow-1 max-h-screen w-full min-w-md :class="[isMaximize ? 'maximize' : '']">
    <div h-7 w-auto bg="dark:#2f2f31 neutral-1" rounded-t-lg px-2 flex justify-between>
      <p block m0 p0 leading-7>
        {{ title }}
      </p>
      <div flex items-center>
        <div class="i-mdi-content-save" btn @click="save" />
        <div class="i-mdi-fullscreen" btn @click="toggleMaximize();resize()" />
      </div>
    </div>
    <div ref="container" border="1 solid neutral100 dark:none" w-auto h-md class="editor-container" />
  </div>
</template>

<style>
.maximize {
  position: fixed;
  inset: 0;
  width: auto;
  height: 100vh;
  z-index: 9;
}

.maximize .editor-container {
  height: 100%;
}
</style>