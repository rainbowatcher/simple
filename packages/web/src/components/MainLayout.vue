<script lang="ts" setup>
const [collapsed, toggleCollapse] = useToggle(true)
</script>

<template>
  <NLayout>
    <NLayoutHeader bordered h="[var(--h-header)]">
      <Header />
    </NLayoutHeader>
    <NLayout has-sider>
      <NLayoutSider
        show-trigger
        :collapsed="collapsed"
        :on-update:collapsed="toggleCollapse"
        collapse-mode="width"
        content-style="height: calc(100vh - calc(var(--h-header) + 1px))"
      >
        <SideMenu :collapsed="collapsed" />
      </NLayoutSider>
      <NLayout bordered content-style="height: calc(100vh - calc(var(--h-header) + 1px))">
        <NLayoutContent embedded dark:bg-neutral-800>
          <div px4 py2>
            <NCard overflow-auto>
              <slot name="default" />
            </NCard>
            <NDivider />
            <div h-14 flex items-center justify-center>
              We do have footer.
            </div>
          </div>
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </NLayout>
</template>

<style scoped></style>
