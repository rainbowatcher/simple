<script lang="ts" setup>
</script>

<template>
  <NTabs type="line" :bar-width="28" animated>
    <NTabPane name="template" tab="Template" display-directive="show:lazy">
      <TemplateManage />
    </NTabPane>
    <NTabPane name="datasource" tab="DataSource" display-directive="show:lazy">
      <DataSourceManage />
    </NTabPane>
  </NTabs>
</template>

<style scoped></style>
