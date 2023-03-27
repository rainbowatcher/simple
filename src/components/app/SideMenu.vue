<script lang="ts" setup>
import { MenuOption } from "naive-ui/es/menu/src/interface"
defineProps<{
  collapsed?: boolean
}>()
const { sideMenu } = useAppConfig()
const menuOptions = sideMenu.map((i) => {
  return {
    key: i.key,
    label: i.label,
    link: i.link,
    icon: () => h("i", { class: i.icon }),
  } as MenuOption
})
const route = useRoute()
const router = useRouter()
const active = ref<string | number>()
const routeTo = (e: string | number) => {
  const link = menuOptions.find((o) => o.key === e)?.link
  if (link) router.push(link as string)
}

const stop = watch(route, () => {
  active.value = menuOptions.find((o) => o.link === route.fullPath)?.key
  stop()
})
</script>

<template>
  <n-menu
    v-model:value="active"
    :onUpdate:value="routeTo"
    :options="menuOptions"
    :collapsed="collapsed ?? false"
  />
</template>
