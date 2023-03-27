<script lang="ts" setup>
import { darkTheme } from "naive-ui"
const dark = useDark()
const theme = computed(() => (dark.value ? darkTheme : undefined))
</script>

<template>
  <NConfigProvider :theme="theme" abstract>
    <NMessageProvider>
      <NDialogProvider>
        <!-- <NScrollbar> -->
          <MainLayout>
            <RouterView v-slot="{ Component }">
              <template v-if="Component">
                <!-- <KeepAlive> -->
                  <Suspense>
                    <component :is="Component" />
                    <template #fallback> Loading... </template>
                  </Suspense>
                <!-- </KeepAlive> -->
              </template>
            </RouterView>
          </MainLayout>
        <!-- </NScrollbar> -->
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style scoped></style>
