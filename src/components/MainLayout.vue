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
        showTrigger
        :collapsed="collapsed"
        :on-update:collapsed="toggleCollapse"
        collapseMode="width"
        content-style="height: calc(100vh - calc(var(--h-header) + 1px))"
      >
        <SideMenu :collapsed="collapsed" />
      </NLayoutSider>
      <NLayout bordered>
        <NLayoutContent dark:bg-neutral-800 embedded>
          <div px4 py2>
            <NCard overflow-auto>
              <slot name="default"></slot>
            </NCard>
            <NDivider />
            <div flex h-14 items-center justify-center>We do have footer.</div>
          </div>
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </NLayout>
</template>

<style scoped></style>
