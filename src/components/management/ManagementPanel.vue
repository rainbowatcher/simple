<script lang="ts" setup>
import DataSourceManage from '../settings/DataSourceManage.vue';

</script>

<template>
  <NTabs type="line" :bar-width="28" animated>
    <NTabPane name="data" tab="DataSource manage" display-directive="show:lazy">
      <DataSourceManage />
    </NTabPane>
  </NTabs>
</template>

<style scoped></style>
