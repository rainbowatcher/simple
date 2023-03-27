<script lang="ts" setup>
import axios from "axios"
import UserConfigPanel from "./UserConfigPanel.vue";

</script>

<template>
  <NTabs type="bar" :bar-width="28" animated>
    <NTabPane name="data" tab="UserConfig" display-directive="show:lazy">
      <UserConfigPanel/>
    </NTabPane>
  </NTabs>
</template>

<style scoped></style>